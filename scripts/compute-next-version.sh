#!/usr/bin/env bash
# compute-next-version.sh
#
# Compute the next npm version to publish, ALWAYS derived from the live
# published version on the registry — NOT from the (frequently stale) source
# package.json. This is the fix for the recurring version-drift: when the
# source package.json lags behind npm (because the bump-back PR never merged),
# computing `patch` from the source produced a version that already exists on
# npm, so the idempotency guard aborted.
#
# Usage:
#   compute-next-version.sh <package-name> <bump-or-explicit>
#
#   <package-name>      e.g. @devfellowship/components
#   <bump-or-explicit>  one of: patch | minor | major  OR an explicit semver
#                       like 1.4.0
#
# Output: the computed next version on stdout (nothing else). Errors go to
# stderr with a non-zero exit.
#
# Behavior:
#   - patch/minor/major  -> read live latest from npm, bump from THAT.
#                           If the package has never been published, fall back
#                           to bumping from 0.0.0 (so first patch = 0.0.1).
#   - explicit semver    -> used verbatim (validated for x.y.z[-pre] shape).
set -euo pipefail

PKG="${1:?package name required}"
INPUT="${2:?bump type or explicit version required}"

# Pure-bash semver bump so the logic is testable without npm in the loop.
# Pre-release / build suffixes on the CURRENT version are dropped before
# bumping (we only ever publish clean release versions from a bump keyword).
bump_semver() {
  local current="$1" kind="$2"
  # strip any -prerelease / +build metadata
  current="${current%%-*}"
  current="${current%%+*}"
  local major minor patch
  IFS='.' read -r major minor patch <<<"$current"
  major="${major:-0}"; minor="${minor:-0}"; patch="${patch:-0}"
  case "$kind" in
    major) major=$((major + 1)); minor=0; patch=0 ;;
    minor) minor=$((minor + 1)); patch=0 ;;
    patch) patch=$((patch + 1)) ;;
    *) echo "bump_semver: unknown kind '$kind'" >&2; return 2 ;;
  esac
  printf '%s.%s.%s\n' "$major" "$minor" "$patch"
}

is_explicit_semver() {
  # x.y.z with optional -prerelease and/or +build
  [[ "$1" =~ ^[0-9]+\.[0-9]+\.[0-9]+([-+].+)?$ ]]
}

case "$INPUT" in
  patch|minor|major)
    # Live latest on npm. Empty if never published.
    CURRENT="$(npm view "$PKG" version 2>/dev/null || true)"
    if [[ -z "$CURRENT" ]]; then
      CURRENT="0.0.0"
      echo "compute-next-version: '$PKG' not found on npm; bumping from 0.0.0" >&2
    else
      echo "compute-next-version: live npm latest for '$PKG' is $CURRENT" >&2
    fi
    bump_semver "$CURRENT" "$INPUT"
    ;;
  *)
    if is_explicit_semver "$INPUT"; then
      printf '%s\n' "$INPUT"
    else
      echo "compute-next-version: '$INPUT' is neither patch|minor|major nor a valid x.y.z semver" >&2
      exit 2
    fi
    ;;
esac
