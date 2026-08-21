import snapshot from "@/data/whoop/latest.json";

// Whoop numbers come from life-os, my local-first personal data store. Its HTTP API
// binds to 127.0.0.1 and is published over the Tailscale Funnel. Set LIFEOS_API_URL
// plus LIFEOS_WEB_TOKEN — the read key life-os issues for this site specifically, so
// revoking the site never disturbs the key my own devices use — and these numbers go
// live; without them this serves the committed snapshot written by `bun run
// whoop:snapshot` in the life-os repo, which is also the fallback whenever my Mac is
// asleep and the funnel is dark.

export interface WhoopSnapshot {
  date: string;
  recovery?: { score: number; hrv?: number; rhr?: number };
  sleep?: { performance: number; hours?: number };
  strain?: number;
  trends: {
    days: number;
    avgRecovery: number | null;
    avgSleep: number | null;
    workouts: number;
  };
  insight: {
    afterGood: number | null;
    afterShort: number | null;
    sleepDelta: number | null;
    enough: boolean;
  };
}

interface Sample {
  value: number;
  ts: number;
}

const TREND_DAYS = 30;
const DAY_MS = 86_400_000;
const GOOD_SLEEP_HOURS = 7;

const committed = snapshot as WhoopSnapshot;

const round = (value: number, decimals = 0) => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

const mean = (values: number[]) => values.reduce((sum, v) => sum + v, 0) / values.length;

// Samples come back ordered by insert id, not timestamp — a backfill would put them out
// of order — so pick the newest by ts rather than trusting position.
const newest = (rows: Sample[]): Sample | undefined =>
  rows.reduce<Sample | undefined>(
    (best, row) => (!best || row.ts > best.ts ? row : best),
    undefined,
  );

// en-CA formats as YYYY-MM-DD. Days are bucketed in the *server's* timezone, which in
// a Worker is UTC and on my Mac is local — enough to shift a late-night sample by a day,
// which the 30-day averages absorb.
const dayKey = (ts: number) => new Date(ts).toLocaleDateString("en-CA");

const groupByDay = (rows: Sample[]) => {
  const days = new Map<string, number[]>();
  for (const row of rows) {
    const key = dayKey(row.ts);
    const bucket = days.get(key);
    if (bucket) bucket.push(row.value);
    else days.set(key, [row.value]);
  }
  return days;
};

// No per-fetch revalidate option here: `next: { revalidate }` was Next-only, and the
// equivalent now lives one level up — `/` is edge-cached for an hour by routeRules in
// astro.config.mjs, so these requests don't run on the hot path of every page view.
const request = async <T>(baseUrl: string, token: string | undefined, path: string): Promise<T> => {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) throw new Error(`life-os ${path} → ${response.status}`);
  const { data } = await response.json();
  return data as T;
};

const samplesSince = (baseUrl: string, token: string | undefined, metric: string, from: number) =>
  request<Sample[]>(baseUrl, token, `/v1/samples?metric=${metric}&from=${from}&limit=1000`);

// Recovery is my headline number, and sleep is the lever that moves it — so pair each
// day's recovery with that day's sleep and compare well-slept days against short ones.
const computeInsight = (recovery: Sample[], sleepHours: Sample[]): WhoopSnapshot["insight"] => {
  const sleepByDay = groupByDay(sleepHours);
  const afterGoodNights: number[] = [];
  const afterShortNights: number[] = [];

  for (const [day, scores] of groupByDay(recovery)) {
    const hours = sleepByDay.get(day);
    if (!hours) continue;
    const slept = Math.max(...hours);
    (slept >= GOOD_SLEEP_HOURS ? afterGoodNights : afterShortNights).push(mean(scores));
  }

  const afterGood = afterGoodNights.length ? Math.round(mean(afterGoodNights)) : null;
  const afterShort = afterShortNights.length ? Math.round(mean(afterShortNights)) : null;

  return {
    afterGood,
    afterShort,
    sleepDelta: afterGood != null && afterShort != null ? afterGood - afterShort : null,
    // Under four days on either side the comparison is noise, not a pattern.
    enough: afterGoodNights.length >= 4 && afterShortNights.length >= 4,
  };
};

const fetchLive = async (baseUrl: string, token: string | undefined): Promise<WhoopSnapshot> => {
  const from = Date.now() - TREND_DAYS * DAY_MS;
  const [recovery, hrv, rhr, sleepPerformance, sleepHours, strain, workouts] = await Promise.all([
    samplesSince(baseUrl, token, "whoop.recovery_score", from),
    samplesSince(baseUrl, token, "whoop.hrv_rmssd_milli", from),
    samplesSince(baseUrl, token, "whoop.resting_heart_rate", from),
    samplesSince(baseUrl, token, "sleep.performance", from),
    samplesSince(baseUrl, token, "sleep.duration", from),
    samplesSince(baseUrl, token, "whoop.day_strain", from),
    request<unknown[]>(
      baseUrl,
      token,
      `/v1/intervals?source=whoop_workout&from=${from}&limit=1000`,
    ),
  ]);

  const latestRecovery = newest(recovery);
  // The rings are anchored on recovery. Without it there is nothing to show, so let the
  // caller fall back to the snapshot rather than render a half-empty widget.
  if (!latestRecovery) throw new Error("no recovery samples in the last 30 days");

  const latestHrv = newest(hrv);
  const latestRhr = newest(rhr);
  const latestSleepPerformance = newest(sleepPerformance);
  const latestSleepHours = newest(sleepHours);
  const latestStrain = newest(strain);

  return {
    date: dayKey(latestRecovery.ts),
    recovery: {
      score: Math.round(latestRecovery.value),
      ...(latestHrv ? { hrv: Math.round(latestHrv.value) } : {}),
      ...(latestRhr ? { rhr: Math.round(latestRhr.value) } : {}),
    },
    ...(latestSleepPerformance
      ? {
          sleep: {
            performance: Math.round(latestSleepPerformance.value),
            ...(latestSleepHours ? { hours: round(latestSleepHours.value, 2) } : {}),
          },
        }
      : {}),
    ...(latestStrain ? { strain: round(latestStrain.value, 1) } : {}),
    trends: {
      days: TREND_DAYS,
      avgRecovery: recovery.length ? Math.round(mean(recovery.map((r) => r.value))) : null,
      avgSleep: sleepHours.length ? round(mean(sleepHours.map((r) => r.value)), 1) : null,
      workouts: workouts.length,
    },
    insight: computeInsight(recovery, sleepHours),
  };
};

export const getWhoopSnapshot = async (): Promise<WhoopSnapshot> => {
  const baseUrl = process.env.LIFEOS_API_URL?.replace(/\/+$/, "");
  if (!baseUrl) return committed;

  try {
    return await fetchLive(baseUrl, process.env.LIFEOS_WEB_TOKEN);
  } catch (cause) {
    console.error("life-os unreachable, serving committed Whoop snapshot:", cause);
    return committed;
  }
};
