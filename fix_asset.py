with open('/tmp/ui-clone-skills/skills/visual-debug/scripts/asset-transfer-check.sh', 'r') as f:
    text = f.read()

text = text.replace(
    '# Auto-detect impl/public/ if not provided\nIMPL_PUB="${2:-}"\nif [ -z "$IMPL_PUB" ] && [ -n "${UI_CLONE_IMPL_ROOT:-}" ]; then\n  IMPL_PUB="$UI_CLONE_IMPL_ROOT/public"\nfi',
    '# Auto-detect impl/public/ if not provided\nIMPL_PUB="${2:-}"\nshift 2 || true\nwhile [ $# -gt 0 ]; do\n  IMPL_PUB="$IMPL_PUB $1"\n  shift\ndone\n\nif [ -z "$IMPL_PUB" ] && [ -n "${UI_CLONE_IMPL_ROOT:-}" ]; then\n  IMPL_PUB="$UI_CLONE_IMPL_ROOT/public"\nfi'
)

with open('/tmp/ui-clone-skills/skills/visual-debug/scripts/asset-transfer-check.sh', 'w') as f:
    f.write(text)
