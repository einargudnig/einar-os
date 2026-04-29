import latest from "@/data/whoop/latest.json";
import { cn } from "@/lib/utils";
import { WhoopRing } from "./whoop-ring";

interface WhoopSnapshot {
  lastUpdated: string | null;
  dataDate?: string | null;
  recovery: {
    score?: number;
    hrv?: number | null;
    restingHeartRate?: number;
  } | null;
  sleep: {
    performance?: number;
    efficiency?: number;
    consistency?: number;
    hoursSlept?: number;
  } | null;
  strain: { day?: number } | null;
}

const STRAIN_MAX = 21;
const STALE_AFTER_HOURS = 36;

function recoveryColor(score: number): string {
  if (score >= 67) return "text-emerald-400";
  if (score >= 34) return "text-yellow-400";
  return "text-red-500";
}

function sleepColor(performance: number): string {
  if (performance >= 85) return "text-emerald-400";
  if (performance >= 70) return "text-yellow-400";
  return "text-red-500";
}

function strainColor(_strain: number): string {
  return "text-sky-400";
}

function formatStrain(value: number): string {
  return value.toFixed(1);
}

function hoursSince(iso: string): number {
  return (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60);
}

function formatRelative(iso: string): string {
  const hours = hoursSince(iso);
  if (hours < 1) return "just now";
  if (hours < 24) return `${Math.round(hours)}h ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export function WhoopStats() {
  const data = latest as WhoopSnapshot;

  const recoveryScore = data.recovery?.score;
  const sleepPerformance = data.sleep?.performance;
  const strainDay = data.strain?.day;

  const hasAny =
    recoveryScore != null || sleepPerformance != null || strainDay != null;
  if (!hasAny) return null;

  const stale =
    data.lastUpdated != null && hoursSince(data.lastUpdated) > STALE_AFTER_HOURS;

  const dateLabel = data.dataDate
    ? new Date(data.dataDate).toLocaleDateString("en", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className={cn("space-y-4", stale && "opacity-60")}>
      <div className="grid grid-cols-3 gap-4">
        {recoveryScore != null && data.recovery ? (
          <WhoopRing
            label="Recovery"
            displayValue={`${recoveryScore}%`}
            fill={recoveryScore / 100}
            colorClass={recoveryColor(recoveryScore)}
            subtitle={recoverySubtitle(data.recovery)}
          />
        ) : (
          <RingPlaceholder label="Recovery" />
        )}
        {sleepPerformance != null && data.sleep ? (
          <WhoopRing
            label="Sleep"
            displayValue={`${Math.round(sleepPerformance)}%`}
            fill={sleepPerformance / 100}
            colorClass={sleepColor(sleepPerformance)}
            subtitle={
              data.sleep.hoursSlept != null
                ? `${data.sleep.hoursSlept.toFixed(1)} hrs`
                : undefined
            }
          />
        ) : (
          <RingPlaceholder label="Sleep" />
        )}
        {strainDay != null ? (
          <WhoopRing
            label="Strain"
            displayValue={formatStrain(strainDay)}
            fill={strainDay / STRAIN_MAX}
            colorClass={strainColor(strainDay)}
          />
        ) : (
          <RingPlaceholder label="Strain" />
        )}
      </div>
      <div className="flex items-baseline justify-between text-xs text-muted-foreground">
        <p>{dateLabel ? `Stats from ${dateLabel}` : null}</p>
        {data.lastUpdated ? (
          <p>
            {stale ? "Stale · " : ""}updated {formatRelative(data.lastUpdated)}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function recoverySubtitle(
  recovery: NonNullable<WhoopSnapshot["recovery"]>,
): string | undefined {
  const parts: string[] = [];
  if (recovery.hrv != null) parts.push(`HRV ${recovery.hrv}ms`);
  if (recovery.restingHeartRate != null)
    parts.push(`RHR ${recovery.restingHeartRate}`);
  return parts.length > 0 ? parts.join(" · ") : undefined;
}

function RingPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 opacity-50">
      <div className="size-[120px] rounded-full border-2 border-dashed border-muted-foreground/30" />
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-muted-foreground">No data</p>
    </div>
  );
}
