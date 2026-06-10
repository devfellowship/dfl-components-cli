#!/usr/bin/env bash
# Self-test for compute-next-version.sh.
#
# Tests the version-compute logic WITHOUT touching the real npm registry by
# shadowing `npm` with a mock function that returns a fixed "live latest".
# This proves: given npm-latest=X + bump=patch/minor/major we get the right
# next version, and explicit semver passes through verbatim.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPT="$HERE/compute-next-version.sh"

pass=0
fail=0

# Run compute-next-version.sh with a mocked `npm view <pkg> version`.
# $1 = mocked live-latest (use "__none__" to simulate unpublished)
# $2 = input (patch|minor|major|explicit)
# $3 = expected output
run_case() {
  local mock_latest="$1" input="$2" expected="$3"
  local got
  # Build a tiny shim dir whose `npm` returns the mocked version, prepend to PATH.
  local shim_dir
  shim_dir="$(mktemp -d)"
  if [[ "$mock_latest" == "__none__" ]]; then
    # `npm view` for a missing package errors (non-zero) and prints nothing.
    cat >"$shim_dir/npm" <<'EOF'
#!/usr/bin/env bash
# mock: package not found
exit 1
EOF
  else
    cat >"$shim_dir/npm" <<EOF
#!/usr/bin/env bash
# mock: always report the fixed live latest
printf '%s\n' "$mock_latest"
EOF
  fi
  chmod +x "$shim_dir/npm"

  got="$(PATH="$shim_dir:$PATH" bash "$SCRIPT" "@devfellowship/components" "$input" 2>/dev/null)"
  rm -rf "$shim_dir"

  if [[ "$got" == "$expected" ]]; then
    echo "ok    : latest=$mock_latest input=$input -> $got"
    pass=$((pass + 1))
  else
    echo "FAIL  : latest=$mock_latest input=$input -> got '$got' expected '$expected'"
    fail=$((fail + 1))
  fi
}

# --- patch/minor/major from live npm latest ---
run_case "1.2.2" patch "1.2.3"
run_case "1.2.2" minor "1.3.0"
run_case "1.2.2" major "2.0.0"
run_case "0.2.1" patch "0.2.2"
run_case "0.2.1" minor "0.3.0"
run_case "0.2.1" major "1.0.0"

# pre-release / build metadata on current is stripped before bumping
run_case "1.2.2-beta.1" patch "1.2.3"
run_case "1.2.2+build9"  minor "1.3.0"

# never-published package -> bump from 0.0.0
run_case "__none__" patch "0.0.1"
run_case "__none__" minor "0.1.0"
run_case "__none__" major "1.0.0"

# explicit semver passes through verbatim (npm latest irrelevant)
run_case "1.2.2" "1.5.0"        "1.5.0"
run_case "1.2.2" "2.0.0-beta.1" "2.0.0-beta.1"

echo "----"
echo "passed=$pass failed=$fail"
[[ "$fail" -eq 0 ]]
