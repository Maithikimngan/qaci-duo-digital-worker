import type { WorkerPackage } from "./repository";

// Ported from openmausbot-teams' lib/proof.ts for structural parity with its public revenue-claim field
// (`WorkerPackage.proof`, see lib/repository.ts). No QACI Duo Digital Worker carries one today — these
// helpers exist so a genuine future provenance field has a renderer ready, not because any current
// worker uses them. Pure helpers, no filesystem access, so client components may import them freely.

const PERIOD_SUFFIX = { monthly: "/mo", weekly: "/wk", daily: "/day", total: "" } as const;

/** "$4,200" + monthly → "$4,200/mo" — the figure exactly as claimed. */
export function proofHeadline(proof: NonNullable<WorkerPackage["proof"]>): string {
  return `${proof.amount}${PERIOD_SUFFIX[proof.period] ?? ""}`;
}
