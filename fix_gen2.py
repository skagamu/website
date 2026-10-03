import json

with open('/tmp/ui-clone-skills/tmp/ref/AvenuesHome/generation-plan.json', 'r') as f:
    data = json.load(f)

data['requiredChecks'] = [
    "impl-url-guard",
    "capacity-probe",
    "runtime-env",
    "preview-runtime-health",
    "blank-viewport",
    "unresolved-imports",
    "hydration-check",
    "tailwind-transform-conflict"
]

with open('/tmp/ui-clone-skills/tmp/ref/AvenuesHome/generation-plan.json', 'w') as f:
    json.dump(data, f, indent=2)
