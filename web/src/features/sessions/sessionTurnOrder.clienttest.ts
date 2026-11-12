import { act, renderHook } from "@testing-library/react";

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

  it("defaults to oldest first and keeps the choice in this browser", () => {
    localStorage.clear();
    const first = renderHook(() =>
      useSessionTurnOrder({ surface: "session_detail", isV4: true }),
    );
    expect(first.result.current[0]).toBe("oldest-first");

    act(() => first.result.current[1]("newest-first"));
    first.unmount();

    const next = renderHook(() =>
      useSessionTurnOrder({ surface: "annotation_queue", isV4: true }),
    );
    expect(next.result.current[0]).toBe("newest-first");

    localStorage.setItem(SESSION_TURN_ORDER_STORAGE_KEY, '"sideways"');
    expect(
      renderHook(() =>
        useSessionTurnOrder({ surface: "session_detail", isV4: true }),
      ).result.current[0],
    ).toBe("oldest-first");
  });
});
