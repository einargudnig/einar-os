import { cn } from "@/lib/utils";

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

// Contribution dates are bare "YYYY-MM-DD" strings. Parse and read them in UTC
// everywhere so week grouping, month labels, and hover labels are identical no
// matter the server or client timezone.
const parseDay = (date: string) => new Date(`${date}T00:00:00Z`);

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
    const dayOfWeek = parseDay(day.date).getUTCDay();

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
    const date = parseDay(firstDay.date);
    const month = date.getUTCMonth();

    if (month !== lastMonth) {
      const monthName = date.toLocaleString("en", {
        month: "short",
        timeZone: "UTC",
      });
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
          {LEVEL_CLASSES.map((cls) => (
            <div key={cls} className={cn("h-[11px] w-[11px] rounded-[2px]", cls)} />
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
          {weeks.map((week, i) => {
            const label = monthLabels.find((m) => m.colStart === i);
            return (
              <div key={week[0].date} className="min-w-0">
                {label ? <span>{label.label}</span> : null}
              </div>
            );
          })}
        </div>

        {/* Contribution grid */}
        <div
          className="grid w-full"
          style={{
            gridTemplateColumns: `repeat(${totalWeeks}, minmax(10px, 1fr))`,
            gap: "2px",
          }}
        >
          {weeks.map((week) => (
            <div
              key={week[0].date}
              className="grid"
              style={{
                gridTemplateRows: "repeat(7, 1fr)",
                gap: "2px",
              }}
            >
              {week.map((day) => {
                const label = parseDay(day.date).toLocaleDateString("en", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  timeZone: "UTC",
                });
                return (
                  <div
                    key={day.date}
                    title={`${day.count} contribution${day.count !== 1 ? "s" : ""} on ${label}`}
                    className={cn(
                      "aspect-square w-full rounded-[2px]",
                      LEVEL_CLASSES[day.level],
                    )}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
