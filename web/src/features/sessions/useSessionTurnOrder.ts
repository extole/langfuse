import useLocalStorage from "@/src/components/useLocalStorage";
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
export function useSessionTurnOrder(): [
  SessionTurnOrder,
  (order: SessionTurnOrder) => void,
] {
  const [storedOrder, setStoredOrder] = useLocalStorage<string>(
    SESSION_TURN_ORDER_STORAGE_KEY,
    DEFAULT_SESSION_TURN_ORDER,
  );
  return [parseSessionTurnOrder(storedOrder), setStoredOrder];
}
