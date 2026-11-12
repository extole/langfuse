import useLocalStorage from "@/src/components/useLocalStorage";
import { usePostHogClientCapture } from "@/src/features/posthog-analytics/usePostHogClientCapture";
import {
  DEFAULT_SESSION_TURN_ORDER,
  SESSION_TURN_ORDER_STORAGE_KEY,
  parseSessionTurnOrder,
  type SessionTurnOrder,
} from "@/src/features/sessions/sessionTurnOrder";

/**
 * The reviewer's turn order for session views, kept in this browser and shared
 * by the session detail page and annotation queue session items.
 */
export function useSessionTurnOrder({
  surface,
  isV4,
}: {
  surface: "session_detail" | "annotation_queue";
  isV4: boolean;
}): [SessionTurnOrder, (order: SessionTurnOrder) => void] {
  const capture = usePostHogClientCapture();
  const [storedOrder, setStoredOrder] = useLocalStorage<string>(
    SESSION_TURN_ORDER_STORAGE_KEY,
    DEFAULT_SESSION_TURN_ORDER,
  );

  const setOrder = (order: SessionTurnOrder) => {
    setStoredOrder(order);
    capture("session_detail:turn_order_changed", { order, surface, isV4 });
  };

  return [parseSessionTurnOrder(storedOrder), setOrder];
}
