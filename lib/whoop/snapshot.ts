#!/usr/bin/env bun

import { WhoopClient } from "./client";

const WHOOP_CLIENT_ID = process.env.WHOOP_CLIENT_ID;
const WHOOP_CLIENT_SECRET = process.env.WHOOP_CLIENT_SECRET;

if (!WHOOP_CLIENT_ID || !WHOOP_CLIENT_SECRET) {
  console.error("Error: WHOOP_CLIENT_ID and WHOOP_CLIENT_SECRET must be set");
  process.exit(1);
}

const SNAPSHOT_PATH = "data/whoop/latest.json";

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

async function fetchDayStrain(client: WhoopClient): Promise<WhoopCycle | null> {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 2);

  // The WhoopClient only exposes recovery/sleep/workouts. Day strain lives on
  // the cycle resource, which we fetch directly using the client's auth.
  await (client as any).ensureValidToken();
  const tokens = (client as any).tokens as { access_token: string };

  const url = new URL("https://api.prod.whoop.com/developer/v2/cycle");
  url.searchParams.set("start", yesterday.toISOString());

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch cycle: ${res.statusText}`);
  }
  const data = (await res.json()) as { records: WhoopCycle[] };
  const scored = data.records.filter((c) => c.score?.strain != null);
  return scored[scored.length - 1] ?? null;
}

async function buildSnapshot(): Promise<Snapshot> {
  const client = new WhoopClient(WHOOP_CLIENT_ID!, WHOOP_CLIENT_SECRET!);

  const now = new Date();
  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const [recovery, sleep, cycle] = await Promise.all([
    client.getRecovery(twoDaysAgo, now),
    client.getSleep(twoDaysAgo, now),
    fetchDayStrain(client),
  ]);

  const latestRecovery = recovery[recovery.length - 1] ?? null;
  const latestSleep = [...sleep].reverse().find((s) => !s.nap && s.score) ?? null;

  // v2 Whoop API nests scored fields under `score` (just like sleep does).
  // The shared client's WhoopRecovery type still lists them flat, so cast.
  const recoveryScore = (latestRecovery as any)?.score as
    | {
        recovery_score: number;
        hrv_rmssd_milli: number;
        resting_heart_rate: number;
      }
    | undefined;

  // The "data date" is the day these stats represent — typically yesterday's
  // cycle. Fall back through cycle → sleep → null so we always show something
  // meaningful, even if one source is missing.
  const dataDate =
    cycle?.start ??
    latestSleep?.end ??
    (latestRecovery as any)?.created_at ??
    null;

  return {
    lastUpdated: now.toISOString(),
    dataDate,
    recovery: recoveryScore
      ? {
          score: recoveryScore.recovery_score,
          hrv: Math.round(recoveryScore.hrv_rmssd_milli),
          restingHeartRate: recoveryScore.resting_heart_rate,
        }
      : null,
    sleep: latestSleep?.score
      ? {
          performance: latestSleep.score.sleep_performance_percentage,
          efficiency: latestSleep.score.sleep_efficiency_percentage,
          consistency: latestSleep.score.sleep_consistency_percentage,
          hoursSlept: Number(
            millisToHours(latestSleep.score.stage_summary.total_in_bed_time_milli).toFixed(2),
          ),
        }
      : null,
    strain: cycle?.score
      ? { day: Number(cycle.score.strain.toFixed(1)) }
      : null,
  };
}

if (import.meta.main) {
  const snapshot = await buildSnapshot();
  await Bun.write(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2) + "\n");
  console.log(`Wrote ${SNAPSHOT_PATH}`);
  console.log(JSON.stringify(snapshot, null, 2));
}
