import { act, renderHook } from "@testing-library/react";

import {
  SESSION_TURN_ORDER_STORAGE_KEY,
  getSessionTurnNumber,
  orderSessionTraces,
} from "@/src/features/sessions/sessionTurnOrder";
import { computeIdleGapBetweenSeconds } from "@/src/features/sessions/sessionIdleGap";
import { useSessionTurnOrder } from "@/src/features/sessions/useSessionTurnOrder";

const traces = [
  { id: "turn-1", timestamp: new Date("2026-01-01T12:00:00Z"), latencyMs: 0 },
  { id: "turn-2", timestamp: new Date("2026-01-01T12:01:00Z"), latencyMs: 0 },
  {
    id: "turn-3",
    timestamp: new Date("2026-01-01T12:31:00Z"),
    latencyMs: 60_000,
  },
];

const displayTurns = (order: "oldest-first" | "newest-first") => {
  const ordered = orderSessionTraces(traces, order);
  return ordered.map((trace, displayIndex) => ({
    id: trace.id,
    turnNumber: getSessionTurnNumber({
      displayIndex,
      traceCount: ordered.length,
      order,
    }),
    idleGapAboveSeconds:
      displayIndex === 0
        ? null
        : computeIdleGapBetweenSeconds(ordered[displayIndex - 1]!, trace),
  }));
};

describe("session turn order", () => {
  it("shows the newest turn first while numbers and idle gaps stay chronological", () => {
    expect(displayTurns("oldest-first")).toEqual([
      { id: "turn-1", turnNumber: 1, idleGapAboveSeconds: null },
      { id: "turn-2", turnNumber: 2, idleGapAboveSeconds: 60 },
      { id: "turn-3", turnNumber: 3, idleGapAboveSeconds: 1800 },
    ]);
    expect(displayTurns("newest-first")).toEqual([
      { id: "turn-3", turnNumber: 3, idleGapAboveSeconds: null },
      { id: "turn-2", turnNumber: 2, idleGapAboveSeconds: 1800 },
      { id: "turn-1", turnNumber: 1, idleGapAboveSeconds: 60 },
    ]);
    expect(traces.map((trace) => trace.id)).toEqual([
      "turn-1",
      "turn-2",
      "turn-3",
    ]);
  });

  it("defaults to oldest first and keeps the choice in this browser", () => {
    localStorage.clear();
    const first = renderHook(() => useSessionTurnOrder("session_detail"));
    expect(first.result.current[0]).toBe("oldest-first");

    act(() => first.result.current[1]("newest-first"));
    first.unmount();

    const next = renderHook(() => useSessionTurnOrder("annotation_queue"));
    expect(next.result.current[0]).toBe("newest-first");

    localStorage.setItem(SESSION_TURN_ORDER_STORAGE_KEY, '"sideways"');
    expect(
      renderHook(() => useSessionTurnOrder("session_detail")).result.current[0],
    ).toBe("oldest-first");
  });
});
