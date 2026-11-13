import { renderHook } from "@testing-library/react";

import {
  SESSION_TURN_ORDER_STORAGE_KEY,
  getSessionTurnNumber,
  orderSessionTraces,
} from "@/src/features/sessions/sessionTurnOrder";
import { useSessionTurnOrder } from "@/src/features/sessions/useSessionTurnOrder";

const traceIds = ["turn-1", "turn-2", "turn-3"];

const displayTurns = (order: "oldest-first" | "newest-first") =>
  orderSessionTraces(traceIds, order).map((id, displayIndex) => [
    id,
    getSessionTurnNumber({
      displayIndex,
      traceCount: traceIds.length,
      order,
    }),
  ]);

describe("session turn order", () => {
  it("shows the newest turn first while turn numbers stay chronological", () => {
    expect(displayTurns("oldest-first")).toEqual([
      ["turn-1", 1],
      ["turn-2", 2],
      ["turn-3", 3],
    ]);
    expect(displayTurns("newest-first")).toEqual([
      ["turn-3", 3],
      ["turn-2", 2],
      ["turn-1", 1],
    ]);
    expect(traceIds).toEqual(["turn-1", "turn-2", "turn-3"]);
  });

  it("reads an unknown stored order as oldest first", () => {
    localStorage.setItem(SESSION_TURN_ORDER_STORAGE_KEY, '"sideways"');
    const { result } = renderHook(() => useSessionTurnOrder());
    expect(result.current[0]).toBe("oldest-first");
  });
});
