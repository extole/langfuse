import { type RouterOutputs } from "@/src/utils/api";
import { getSessionTranscriptThreads } from "./getSessionTranscriptThreads";

export function getSessionConversationEntries(
  traces: readonly {
    trace: { id: string };
    /** Chronological turn number, independent of the display order. */
    turnNumber: number;
    transcript:
      | RouterOutputs["events"]["transcriptByTraceId"]["transcript"]
      | undefined;
  }[],
  includeNestedThreads = false,
) {
  const visibility = traces.map(({ transcript }) =>
    getSessionTranscriptThreads(transcript ?? null, includeNestedThreads),
  );
  const useThreadNumbers = visibility.some(
    ({ visibleThreads }) => visibleThreads.length > 1,
  );
  return traces.flatMap(({ trace, turnNumber, transcript }, traceIndex) => {
    const { visibleThreads } = visibility[traceIndex]!;
    const threads = visibleThreads.length
      ? visibleThreads
      : [{ threadIndex: undefined }];
    return threads.map(({ threadIndex }, visibleIndex) => ({
      itemId:
        threadIndex === undefined ? trace.id : `${trace.id}:${threadIndex}`,
      traceIndex,
      threadIndex,
      threadCount: transcript === undefined ? undefined : visibleThreads.length,
      threadNumber:
        useThreadNumbers && threadIndex !== undefined
          ? visibleIndex + 1
          : undefined,
      displayNumber:
        useThreadNumbers && threadIndex !== undefined
          ? `${turnNumber}.${visibleIndex + 1}`
          : String(turnNumber),
      isFirstThread: visibleIndex === 0,
    }));
  });
}
