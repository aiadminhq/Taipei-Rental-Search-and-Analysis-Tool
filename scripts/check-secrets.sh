#!/usr/bin/env bash
# Fails if any known secret prefix appears in tracked files (excluding this script).
set -euo pipefail
PATTERN='ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|figd_[A-Za-z0-9_-]{20,}|ntn_[A-Za-z0-9]{20,}|secret_[A-Za-z0-9]{20,}|fc-[a-f0-9]{32}|2f7832c86[a-f0-9]{50,}|227b86cbe9ad[a-f0-9]{20}|55646321-a227'
if git grep -nE "$PATTERN" -- ':!scripts/check-secrets.sh' ':!.gitleaks.toml'; then
  echo "❌ secret-like strings found in tracked files"; exit 1
fi
echo "✅ no secret-like strings in tracked files"
