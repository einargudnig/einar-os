#!/usr/bin/env bun

import { WhoopClient } from "./client";

const WHOOP_CLIENT_ID = process.env.WHOOP_CLIENT_ID;
const WHOOP_CLIENT_SECRET = process.env.WHOOP_CLIENT_SECRET;

if (!WHOOP_CLIENT_ID || !WHOOP_CLIENT_SECRET) {
  console.error("Error: WHOOP_CLIENT_ID and WHOOP_CLIENT_SECRET must be set");
  process.exit(1);
}

const SNAPSHOT_PATH = "data/whoop/latest.json";
const API_BASE = "https://api.prod.whoop.com/developer";

interface WhoopCycle {
  id: number;
  start: string;
  end?: string;
  score_state: string;
  score?: {
    strain: number;
    kilojoule: number;
    average_heart_rate: number;
    max_heart_rate: number;
  };
}

interface WhoopSleepRecord {
  id: number;
  start: string;
  end: string;
  nap: boolean;
  score_state: string;
  score?: {
    stage_summary: { total_in_bed_time_milli: number };
    sleep_performance_percentage: number;
    sleep_efficiency_percentage: number;
    sleep_consistency_percentage: number;
  };
}

interface WhoopRecoveryRecord {
  cycle_id: number;
  created_at: string;
  score_state: string;
  score?: {
    recovery_score: number;
    hrv_rmssd_milli: number;
    resting_heart_rate: number;
  };
}

interface Snapshot {
  lastUpdated: string;
  dataDate: string | null;
  recovery: {
    score: number;
    hrv: number;
    restingHeartRate: number;
  } | null;
  sleep: {
    performance: number;
    efficiency: number;
    consistency: number;
    hoursSlept: number;
  } | null;
  strain: {
    day: number;
  } | null;
}

const millisToHours = (ms: number) => ms / (1000 * 60 * 60);

async function whoopGet<T>(
  client: WhoopClient,
  path: string,
  params: Record<string, string>,
): Promise<{ records: T[] }> {
  await (client as any).ensureValidToken();
  const tokens = (client as any).tokens as { access_token: string };

  const url = new URL(`${API_BASE}${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  if (!res.ok) {
    throw new Error(`Whoop ${path} ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

async function buildSnapshot(): Promise<Snapshot> {
  const client = new WhoopClient(WHOOP_CLIENT_ID!, WHOOP_CLIENT_SECRET!);

  // Whoop returns records newest-first. Fetch the latest few of each so we
  // can skip naps / unscored cycles without windowing math.
  const [recoveryRes, sleepRes, cycleRes] = await Promise.all([
    whoopGet<WhoopRecoveryRecord>(client, "/v2/recovery", { limit: "2" }),
    whoopGet<WhoopSleepRecord>(client, "/v2/activity/sleep", { limit: "10" }),
    whoopGet<WhoopCycle>(client, "/v2/cycle", { limit: "2" }),
  ]);

  const latestRecovery = recoveryRes.records.find((r) => r.score) ?? null;
  const latestSleep =
    sleepRes.records.find((s) => !s.nap && s.score) ?? null;

  // /v2/cycle?limit=2 typically returns: [in-progress (no score), latest scored].
  // The in-progress cycle has no score but its `start` is the freshest signal
  // Whoop publishes — "tracking since this morning when you woke up."
  const inProgressCycle = cycleRes.records.find((c) => !c.score) ?? null;
  const latestScoredCycle =
    cycleRes.records.find((c) => c.score?.strain != null) ?? null;

  const dataDate =
    latestSleep?.end ??
    inProgressCycle?.start ??
    latestScoredCycle?.end ??
    latestRecovery?.created_at ??
    null;

  return {
    lastUpdated: new Date().toISOString(),
    dataDate,
    recovery: latestRecovery?.score
      ? {
          score: latestRecovery.score.recovery_score,
          hrv: Math.round(latestRecovery.score.hrv_rmssd_milli),
          restingHeartRate: latestRecovery.score.resting_heart_rate,
        }
      : null,
    sleep: latestSleep?.score
      ? {
          performance: latestSleep.score.sleep_performance_percentage,
          efficiency: latestSleep.score.sleep_efficiency_percentage,
          consistency: latestSleep.score.sleep_consistency_percentage,
          hoursSlept: Number(
            millisToHours(
              latestSleep.score.stage_summary.total_in_bed_time_milli,
            ).toFixed(2),
          ),
        }
      : null,
    strain: latestScoredCycle?.score
      ? { day: Number(latestScoredCycle.score.strain.toFixed(1)) }
      : null,
  };
}

if (import.meta.main) {
  const snapshot = await buildSnapshot();
  await Bun.write(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2) + "\n");
  console.log(`Wrote ${SNAPSHOT_PATH}`);
  console.log(JSON.stringify(snapshot, null, 2));
}
