import type { SupabaseRpcClientLike } from "./page-like";

/**
 * Default IAM level that counts as "member enough to see gated rows".
 * Mirrors the threshold `iam.is_member()` enforces server-side.
 */
export const IAM_MEMBER_MIN_LEVEL = 50;

/** Row shape returned by the `get_my_iam_role()` RPC. */
interface IamRoleRow {
  role_id?: unknown;
  level?: unknown;
}

function readLevel(row: unknown): number | null {
  if (typeof row !== "object" || row === null) return null;
  const level = (row as IamRoleRow).level;
  if (typeof level === "number" && Number.isFinite(level)) return level;
  if (typeof level === "string" && level.trim() !== "") {
    const parsed = Number(level);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

/**
 * Independent authorization probe: ask the database who the caller is,
 * instead of inferring it from the very response whose emptiness is in doubt.
 *
 * Calls the existing `get_my_iam_role()` RPC (already granted to
 * `authenticated`; returns rows of `{ role_id, level }`) and resolves whether
 * any granted role clears `minLevel` (default {@link IAM_MEMBER_MIN_LEVEL}).
 *
 * FAILS TO `'unknown'`, NEVER TO `true`. An RPC error, a null payload, a
 * non-array payload, or rows carrying no readable `level` all mean "we did not
 * learn anything" — and `'unknown'` is treated by `classifyEmptiness` exactly
 * as harshly as `false`. A probe that guessed optimistically would reintroduce
 * the very false-green this module exists to prevent.
 *
 * Note that an empty row set is `'unknown'` rather than `false`: a level-0
 * identity may legitimately produce zero rows, but so does a broken grant, and
 * the two are not distinguishable from here. Both block a green.
 *
 * @example
 * await assertNotVacuouslyEmpty(page, {
 *   countText: /^(\d+) registros?$/,
 *   viewerIsAuthorized: () => iamMemberProbe(supabase),
 * });
 */
export async function iamMemberProbe(
  supabaseClient: SupabaseRpcClientLike,
  opts: { minLevel?: number; rpcName?: string } = {},
): Promise<boolean | "unknown"> {
  const minLevel = opts.minLevel ?? IAM_MEMBER_MIN_LEVEL;
  const rpcName = opts.rpcName ?? "get_my_iam_role";

  let data: unknown;
  let error: unknown;
  try {
    ({ data, error } = await supabaseClient.rpc(rpcName));
  } catch {
    // A thrown RPC (network, auth refresh, bad client) teaches us nothing.
    return "unknown";
  }

  if (error) return "unknown";

  const rows = Array.isArray(data) ? data : data == null ? [] : [data];
  if (rows.length === 0) return "unknown";

  const levels = rows.map(readLevel).filter((l): l is number => l !== null);
  if (levels.length === 0) return "unknown";

  return levels.some((level) => level >= minLevel);
}
