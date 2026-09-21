import type { ComponentType } from "react";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartAreaGradient } from "@/components/chart-area-gradient";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { ChartBarInteractive } from "@/components/chart-bar-interactive";
import { ChartBarMultiple } from "@/components/chart-bar-multiple";
import { ChartLineDots } from "@/components/chart-line-dots";
import { ChartLineInteractive } from "@/components/chart-line-interactive";
import { ChartPieDonut } from "@/components/chart-pie-donut";
import { ChartPieDonutText } from "@/components/chart-pie-donut-text";
import { ChartRadarDefault } from "@/components/chart-radar-default";
import { ChartRadialText } from "@/components/chart-radial-text";
import {
  HqCell,
  HqHead,
  HqHeadCell,
  HqRow,
  HqTable,
  RowAction,
  StatusBadge,
  TableBody,
} from "@/components/hq-table";
import { AppFrame } from "@/components/pages/AppShell";
import { DASHBOARD_STATS, LOANS } from "@/lib/hq-fixtures";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const STATS = DASHBOARD_STATS;

// ---- kpis --------------------------------------------------------------

function Trend({ trend, up }: { trend: string; up: boolean }) {
  const Icon = up ? TrendingUpIcon : TrendingDownIcon;
  return (
    <Badge variant="outline">
      <Icon />
      {trend}
    </Badge>
  );
}

function FourCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:bg-linear-to-t lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {STATS.map((s) => (
        <Card key={s.label} className="@container/card">
          <CardHeader>
            <CardDescription>{s.label}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{s.value}</CardTitle>
            <CardAction>
              <Trend trend={s.trend} up={s.up} />
            </CardAction>
          </CardHeader>
          <CardFooter className="text-muted-foreground text-sm">{s.note}</CardFooter>
        </Card>
      ))}
    </div>
  );
}

function StatStrip() {
  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardContent className="grid grid-cols-4 divide-x">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col gap-1 px-4 first:pl-0 last:pr-0">
              <span className="text-muted-foreground text-sm">{s.label}</span>
              <span className="text-xl font-semibold tabular-nums">{s.value}</span>
              <span className={s.up ? "text-xs text-success" : "text-xs text-destructive"}>{s.trend}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function HeroNumber() {
  const [primary, ...rest] = STATS;
  return (
    <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-[2fr_1fr]">
      <Card className="from-primary/5 to-card bg-linear-to-t">
        <CardHeader>
          <CardDescription>{primary.label}</CardDescription>
          <CardTitle className="text-5xl font-semibold tabular-nums">{primary.value}</CardTitle>
          <CardAction>
            <Trend trend={primary.trend} up={primary.up} />
          </CardAction>
        </CardHeader>
        <CardFooter className="text-muted-foreground text-sm">{primary.note}</CardFooter>
      </Card>
      <div className="flex flex-col gap-4">
        {rest.map((s) => (
          <Card key={s.label} size="sm">
            <CardHeader>
              <CardDescription>{s.label}</CardDescription>
              <CardTitle className="text-xl tabular-nums">{s.value}</CardTitle>
              <CardAction>
                <Trend trend={s.trend} up={s.up} />
              </CardAction>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---- chart -------------------------------------------------------------

const barData = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, i) => ({
  month,
  desktop: [186, 305, 237, 73, 209, 214][i],
}));
const barConfig = { desktop: { label: "Desktop", color: "var(--chart-1)" } } satisfies ChartConfig;

function ChartBarCard() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Signups by month</CardTitle>
        <CardDescription>January – June</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={barConfig} className="aspect-auto h-[250px] w-full">
          <BarChart data={barData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={6} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function AreaFull() {
  return (
    <div className="px-4 lg:px-6">
      <ChartAreaInteractive />
    </div>
  );
}

function SplitTwo() {
  return (
    <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2">
      <ChartAreaInteractive />
      <ChartBarCard />
    </div>
  );
}

function BarFull() {
  return (
    <div className="px-4 lg:px-6">
      <ChartBarInteractive />
    </div>
  );
}

function LineFull() {
  return (
    <div className="px-4 lg:px-6">
      <ChartLineInteractive />
    </div>
  );
}

function ThreeSmall() {
  return (
    <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-3">
      <ChartPieDonutText />
      <ChartRadarDefault />
      <ChartRadialText />
    </div>
  );
}

function FourGrid() {
  return (
    <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2">
      <ChartAreaGradient />
      <ChartBarMultiple />
      <ChartLineDots />
      <ChartPieDonut />
    </div>
  );
}

// ---- table -------------------------------------------------------------

function LoanRecords({ compact }: { compact?: boolean }) {
  const rows = compact ? LOANS.slice(0, 6) : LOANS;
  return (
    <div className="px-4 lg:px-6">
      <HqTable>
        <HqHead>
          <HqHeadCell>Borrower</HqHeadCell>
          <HqHeadCell>Pool</HqHeadCell>
          <HqHeadCell>Outstanding</HqHeadCell>
          <HqHeadCell>State</HqHeadCell>
          <HqHeadCell>Health</HqHeadCell>
          {!compact && <HqHeadCell />}
        </HqHead>
        <TableBody>
          {rows.map((loan) => (
            <HqRow key={loan.id}>
              <HqCell className="font-medium">{loan.borrower}</HqCell>
              <HqCell>{loan.pool}</HqCell>
              <HqCell>{loan.principal}</HqCell>
              <HqCell>
                <StatusBadge value={loan.status} />
              </HqCell>
              <HqCell>
                <StatusBadge value={loan.health} />
              </HqCell>
              {!compact && <RowAction />}
            </HqRow>
          ))}
        </TableBody>
      </HqTable>
    </div>
  );
}

function DataTableBlock() {
  return <LoanRecords />;
}

function SimpleList() {
  return <LoanRecords compact />;
}

function None() {
  return null;
}

// ---- composition -------------------------------------------------------

type Block = ComponentType;

const KPIS: Record<string, Block> = { "four-cards": FourCards, "stat-strip": StatStrip, "hero-number": HeroNumber };
const CHART: Record<string, Block> = {
  "area-full": AreaFull,
  "bar-full": BarFull,
  "line-full": LineFull,
  "split-two": SplitTwo,
  "three-small": ThreeSmall,
  "four-grid": FourGrid,
  none: None,
};
const TABLE: Record<string, Block> = { "data-table": DataTableBlock, "simple-list": SimpleList, none: None };

export function DashboardPage({ schema }: { schema: Record<string, string> }) {
  const Kpis = KPIS[schema.kpis] ?? FourCards;
  const Chart = CHART[schema.chart] ?? AreaFull;
  const Records = TABLE[schema.table] ?? DataTableBlock;
  return (
    <AppFrame nav={schema.nav} pageId="dashboard">
      <Kpis />
      <Chart />
      <Records />
    </AppFrame>
  );
}
