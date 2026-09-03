import concurrent.futures
import json
import os
import re
import subprocess
import sys
import time
import urllib.request
import urllib.error

def log_flush(msg):
    print(msg, flush=True)

# 0. CONFIG LOADER: Baca dari ~/.codex/config.toml
def load_9router_config():
    config_path = os.path.expanduser("~/.codex/config.toml")
    base_url = "http://100.79.193.34:20128/v1"
    api_key = os.getenv("NINEROUTER_API_KEY", "")
    model = "ag/gemini-3.7-flash-high"

    if os.path.exists(config_path):
        with open(config_path, "r") as f:
            content = f.read()

        match_url = re.search(r'base_url\s*=\s*["\']([^"\']+)["\']', content)
        if match_url:
            base_url = match_url.group(1)

        match_key = re.search(r'NINEROUTER_API_KEY\s*=\s*["\']([^"\']+)["\']', content)
        if match_key and not api_key:
            api_key = match_key.group(1)

        match_model = re.search(r'model\s*=\s*["\']([^"\']+)["\']', content)
        if match_model:
            model = match_model.group(1)

    return base_url, api_key, model

# 1. PLANNER: Call 9router LLM & parse streaming SSE / JSON
def generate_plan(prd_text: str, workdir: str = None) -> list:
    base_url, api_key, model = load_9router_config()
    
    prompt = f"""
Break down this PRD into execution waves.
Rules:
- Tasks inside the same wave MUST run in parallel (no dependency between them).
- Tasks dependent on previous wave results must go to subsequent waves.
- 'cmd' must be valid runnable shell commands.

PRD:
{prd_text}

Output strictly valid JSON array of arrays, no conversational text:
[
  [{{"name": "Setup Folder", "cmd": "mkdir -p app"}}],
  [{{"name": "Init File A", "cmd": "touch app/a.txt"}}, {{"name": "Init File B", "cmd": "touch app/b.txt"}}],
  [{{"name": "Verify", "cmd": "ls -la app"}}]
]
"""

    url = f"{base_url.rstrip('/')}/chat/completions"
    payload = json.dumps({
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.1,
        "stream": False
    }).encode("utf-8")

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    try:
        req = urllib.request.Request(url, data=payload, headers=headers)
        with urllib.request.urlopen(req, timeout=45) as resp:
            raw_text = resp.read().decode("utf-8")
            content_parts = []
            for line in raw_text.splitlines():
                line = line.strip()
                if line.startswith("data: ") and line != "data: [DONE]":
                    chunk_json = json.loads(line[6:])
                    choices = chunk_json.get("choices", [])
                    if choices:
                        delta = choices[0].get("delta", {})
                        if "content" in delta:
                            content_parts.append(delta["content"])
                        elif "text" in delta:
                            content_parts.append(delta["text"])
            
            if content_parts:
                full_content = "".join(content_parts)
            else:
                parsed = json.loads(raw_text)
                full_content = parsed["choices"][0]["message"]["content"]

            full_content = full_content.strip()
            if "```json" in full_content:
                full_content = full_content.split("```json")[1].split("```")[0].strip()
            elif "```" in full_content:
                full_content = full_content.split("```")[1].split("```")[0].strip()

            return json.loads(full_content)

    except Exception as e:
        log_flush(f"[WARN] 9router call failed ({e}). Fallback to local heuristic.")
        lines = [l.strip("- *0123456789. ") for l in prd_text.splitlines() if l.strip()]
        return [
            [{"name": f"Wave 1: {lines[0]}", "cmd": f"echo '[W1] {lines[0]}'"}],
            [{"name": f"Wave 2: {l}", "cmd": f"echo '[W2] {l}'"} for l in lines[1:-1]],
            [{"name": f"Wave 3: {lines[-1]}", "cmd": f"echo '[W3] {lines[-1]}'"}],
        ]

# 2. EXECUTOR: Menjalankan satu shell task dengan live status
def execute_task(task: dict, wave_num: int, task_idx: int, workdir: str = None) -> dict:
    start = time.time()
    log_flush(f"  ⏳ [Wave {wave_num}][Task {task_idx}] STARTING: {task['name']} (`{task['cmd']}`)")
    proc = subprocess.run(task["cmd"], shell=True, capture_output=True, text=True, cwd=workdir)
    end = time.time()
    status = "SUCCESS" if proc.returncode == 0 else "FAILED"
    icon = "✅" if status == "SUCCESS" else "❌"
    out = proc.stdout.strip() or proc.stderr.strip()
    log_flush(f"  {icon} [Wave {wave_num}][Task {task_idx}] {status} ({end - start:.2f}s): {task['name']}")
    return {
        "name": task["name"],
        "cmd": task["cmd"],
        "status": status.lower(),
        "output": out,
        "duration": end - start
    }

# 3. ORCHESTRATOR: Eksekusi Wave Plan
def run_waves(waves: list, workdir: str = None) -> list:
    total_waves = len(waves)
    results = []
    with concurrent.futures.ThreadPoolExecutor() as pool:
        for idx, wave in enumerate(waves, 1):
            log_flush(f"\n🌊 ══════════ WAVE {idx}/{total_waves} ({len(wave)} Task Paralel) ══════════")
            futures = [pool.submit(execute_task, task, idx, t_idx, workdir) for t_idx, task in enumerate(wave, 1)]
            wave_results = [f.result() for f in futures]
            results.append(wave_results)
            log_flush(f"🏁 Wave {idx}/{total_waves} SELESAI.\n")
    return results

# 4. ENTRYPOINT
def run_prd_pipeline(prd_source: str, workdir: str = None):
    if not workdir:
        workdir = os.path.dirname(os.path.abspath(__file__)) if "__file__" in globals() else os.getcwd()
    prd_text = prd_source
    if os.path.exists(prd_source):
        with open(prd_source, "r") as f:
            prd_text = f.read()

    log_flush("🤖 [Step 1/3] Membaca PRD & Memanggil 9router LLM Planner...")
    plan = generate_plan(prd_text, workdir)

    log_flush(f"\n📋 [Step 2/3] Plan Terbentuk: {len(plan)} Wave")
    for w_i, w in enumerate(plan, 1):
        log_flush(f"   • Wave {w_i}: {len(w)} task -> {', '.join([t['name'] for t in w])}")

    log_flush("\n🚀 [Step 3/3] Menjalankan Eksekusi Orchestrator...")
    results = run_waves(plan, workdir)
    log_flush("🎉 SEMUA WAVE TUNTAS.")
    return results

if __name__ == "__main__":
    if len(sys.argv) > 1:
        target = " ".join(sys.argv[1:])
        run_prd_pipeline(target)
    else:
        test_prd = """
        Buat project mini:
        1. Buat folder bernama 'test_run'
        2. Buat file 'test_run/a.txt' dan 'test_run/b.txt' paralel
        3. Cek isi folder test_run
        """
        run_prd_pipeline(test_prd)
