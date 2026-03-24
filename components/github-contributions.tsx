import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ContributionData {
  total: { lastYear: number };
  contributions: ContributionDay[];
}

const LEVEL_CLASSES = [
  "bg-muted/50",
  "bg-brand/20",
  "bg-brand/40",
  "bg-brand/70",
  "bg-brand",
] as const;

function groupByWeeks(contributions: ContributionDay[]) {
  const weeks: ContributionDay[][] = [];
  let currentWeek: ContributionDay[] = [];

  for (const day of contributions) {
    const dayOfWeek = new Date(day.date).getDay();

    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    currentWeek.push(day);
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
}

function getMonthLabels(weeks: ContributionDay[][]) {
  const labels: { label: string; colStart: number }[] = [];
  let lastMonth = -1;

  for (let i = 0; i < weeks.length; i++) {
    const firstDay = weeks[i][0];
    const date = new Date(firstDay.date);
    const month = date.getMonth();

    if (month !== lastMonth) {
      const monthName = date.toLocaleString("en", { month: "short" });
      labels.push({ label: monthName, colStart: i });
      lastMonth = month;
    }
  }

  return labels;
}

export async function GitHubContributions({
  username,
}: {
  username: string;
}) {
  let data: ContributionData;

  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
      { next: { revalidate: 3600 } },
    );
    data = await res.json();
  } catch {
    return null;
  }

  const weeks = groupByWeeks(data.contributions);
  const monthLabels = getMonthLabels(weeks);
  const totalWeeks = weeks.length;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-mono tabular-nums text-foreground">
            {data.total.lastYear.toLocaleString()}
          </span>{" "}
          contributions in the last year
        </p>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>Less</span>
          {LEVEL_CLASSES.map((cls, i) => (
            <div key={i} className={cn("h-[11px] w-[11px] rounded-[2px]", cls)} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        {/* Month labels */}
        <div
          className="grid text-xs text-muted-foreground mb-1.5"
          style={{
            gridTemplateColumns: `repeat(${totalWeeks}, minmax(10px, 1fr))`,
            gap: "2px",
          }}
        >
          {Array.from({ length: totalWeeks }).map((_, i) => {
            const label = monthLabels.find((m) => m.colStart === i);
            return (
              <div key={i} className="min-w-0">
                {label ? <span>{label.label}</span> : null}
              </div>
            );
          })}
        </div>

        {/* Contribution grid */}
        <TooltipProvider delayDuration={100}>
          <div
            className="grid w-full"
            style={{
              gridTemplateColumns: `repeat(${totalWeeks}, minmax(10px, 1fr))`,
              gap: "2px",
            }}
          >
            {weeks.map((week, weekIdx) => (
              <div
                key={weekIdx}
                className="grid"
                style={{
                  gridTemplateRows: "repeat(7, 1fr)",
                  gap: "2px",
                }}
              >
                {week.map((day) => (
                  <Tooltip key={day.date}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "aspect-square w-full rounded-[2px]",
                          LEVEL_CLASSES[day.level],
                        )}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs font-mono">
                      <span className="font-semibold">{day.count}</span>{" "}
                      contribution{day.count !== 1 ? "s" : ""} on{" "}
                      {new Date(day.date).toLocaleDateString("en", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            ))}
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
}
