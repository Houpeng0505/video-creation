#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if ! command -v node >/dev/null || ! command -v npm >/dev/null; then
  echo "Node.js and npm are required to install upstream Agent Skills." >&2
  exit 1
fi
# Official Remotion skills. Local scope; not global. Pin a reviewed version
# before using this unattended or committing installed upstream files.
npx -y skills@latest add remotion-dev/skills -y
echo "Review new files under .agents/skills/ and commit only vetted skill content."
