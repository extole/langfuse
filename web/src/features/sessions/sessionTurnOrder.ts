export type SessionTurnOrder = "oldest-first" | "newest-first";

export const SESSION_TURN_ORDER_STORAGE_KEY = "sessionTurnOrder";

export const DEFAULT_SESSION_TURN_ORDER: SessionTurnOrder = "oldest-first";

/** Reads a stored preference; anything unrecognised falls back to the default. */
export const parseSessionTurnOrder = (value: unknown): SessionTurnOrder =>
  value === "newest-first" ? "newest-first" : DEFAULT_SESSION_TURN_ORDER;

/** Puts chronologically sorted session traces into display order. */
export const orderSessionTraces = <T>(
  traces: T[],
  order: SessionTurnOrder,
): T[] => (order === "newest-first" ? [...traces].reverse() : traces);

/** The 1-based chronological turn number of the trace at a display position. */
export const getSessionTurnNumber = ({
  displayIndex,
  traceCount,
  order,
}: {
  displayIndex: number;
  traceCount: number;
  order: SessionTurnOrder;
}): number =>
  order === "newest-first" ? traceCount - displayIndex : displayIndex + 1;
