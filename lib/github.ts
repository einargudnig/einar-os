import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface ContributionData {
  total: { lastYear: number };
  contributions: ContributionDay[];
}

const CACHE_SECONDS = 3600;

const fetchContributions = createServerFn()
  .inputValidator((username: string) => username)
  .handler(async ({ data: username }): Promise<ContributionData | null> => {
    try {
      const res = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
        {
          cf: { cacheTtl: CACHE_SECONDS, cacheEverything: true },
        } as RequestInit & { cf: Record<string, unknown> },
      );
      if (!res.ok) return null;
      return (await res.json()) as ContributionData;
    } catch {
      // The graph is decorative; a dead upstream should not fail the homepage.
      return null;
    }
  });

export const contributionsQueryOptions = (username: string) =>
  queryOptions({
    queryKey: ["github-contributions", username],
    queryFn: () => fetchContributions({ data: username }),
    staleTime: CACHE_SECONDS * 1000,
  });
