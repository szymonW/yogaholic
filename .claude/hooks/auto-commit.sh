#!/usr/bin/env bash
# Auto-branch / auto-commit / auto-push on every Claude Code turn that changes files.
# Best-effort automation: never exits non-zero, so it can never block Claude's response.

INPUT="$(cat)"
SESSION_ID="$(printf '%s' "$INPUT" | jq -r '.session_id // empty' 2>/dev/null)"
[ -z "$SESSION_ID" ] && exit 0

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)"
[ -z "$REPO_ROOT" ] && exit 0
cd "$REPO_ROOT" || exit 0

# Nothing changed this turn (e.g. a plain conversation turn) -> nothing to do.
[ -z "$(git status --porcelain)" ] && exit 0

STATE_FILE=".claude/.session-branches.json"
[ -f "$STATE_FILE" ] || echo '{}' > "$STATE_FILE"

BRANCH="$(jq -r --arg sid "$SESSION_ID" '.[$sid] // empty' "$STATE_FILE" 2>/dev/null)"

if [ -z "$BRANCH" ]; then
  # New Context Window for this repo -> branch off a freshly updated main.
  git fetch origin main --quiet 2>/dev/null || echo "auto-commit: fetch origin main failed, continuing with local main" >&2
  if ! git checkout main --quiet 2>/dev/null; then
    echo "auto-commit: could not switch to main (dirty working tree conflicts with main) - leaving changes uncommitted" >&2
    exit 0
  fi
  git pull --quiet origin main 2>/dev/null || echo "auto-commit: pull origin main failed, continuing with local main" >&2

  SLUG="$(date +%Y%m%d-%H%M%S)"
  BRANCH="claude/${SLUG}-${SESSION_ID:0:8}"

  if ! git checkout -b "$BRANCH" --quiet 2>/dev/null; then
    echo "auto-commit: could not create branch $BRANCH" >&2
    exit 0
  fi

  TMP_STATE="${STATE_FILE}.tmp"
  jq --arg sid "$SESSION_ID" --arg br "$BRANCH" '.[$sid] = $br' "$STATE_FILE" > "$TMP_STATE" 2>/dev/null \
    && mv "$TMP_STATE" "$STATE_FILE"
else
  CURRENT="$(git branch --show-current)"
  if [ "$CURRENT" != "$BRANCH" ]; then
    if ! git checkout "$BRANCH" --quiet 2>/dev/null; then
      echo "auto-commit: could not switch to session branch $BRANCH" >&2
      exit 0
    fi
  fi
fi

git add -A

if git diff --cached --quiet; then
  exit 0
fi

FILES="$(git diff --cached --name-only | head -5 | tr '\n' ',' | sed 's/,$//')"
COUNT="$(git diff --cached --name-only | wc -l | tr -d ' ')"
if [ "$COUNT" -le 3 ]; then
  MSG="Update: ${FILES}"
else
  MSG="Update ${COUNT} files (${FILES}, ...)"
fi

if ! git commit -m "$MSG" --quiet; then
  echo "auto-commit: commit failed" >&2
  exit 0
fi

git push -u origin "$BRANCH" --quiet 2>&1 >&2 || echo "auto-commit: push failed, will retry on next change" >&2

exit 0
