import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getWhoopSnapshot } from "@/lib/life-os";

/**
 * The build replaces this with an RPC stub in the client bundle, so
 * LIFEOS_API_URL and LIFEOS_WEB_TOKEN never leave the worker.
 */
const fetchWhoop = createServerFn().handler(() => getWhoopSnapshot());

/**
 * The homepage is prerendered, so its HTML carries whatever the snapshot said
 * at build time. `staleTime` then lets the client refetch once on mount and
 * pick up live numbers whenever the funnel is up.
 */
export const whoopQueryOptions = queryOptions({
  queryKey: ["whoop"],
  queryFn: () => fetchWhoop(),
  staleTime: 5 * 60_000,
});
