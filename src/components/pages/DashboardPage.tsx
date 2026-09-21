import type { ComponentType } from "react";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import data from "@/app/dashboard/data.json";
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
import { DataTable } from "@/components/data-table";
import { AppFrame } from "@/components/pages/AppShell";
import { SectionCards } from "@/components/section-cards";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Fixed placeholder content, identical across every variant (same numbers
// shadcn's dashboard-01 block ships with). Only the structure varies.
const STATS = [
  { label: "Total Revenue", value: "$1,250.00", trend: "+12.5%", up: true, note: "Trending up this month" },
  { label: "New Customers", value: "1,234", trend: "-20%", up: false, note: "Down 20% this period" },
  { label: "Active Accounts", value: "45,678", trend: "+12.5%", up: true, note: "Strong user retention" },
  { label: "Growth Rate", value: "4.5%", trend: "+4.5%", up: true, note: "Steady performance increase" },
];

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
  return <SectionCards />;
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

function DataTableBlock() {
  return <DataTable data={data} />;
}

function SimpleList() {
  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent sections</CardTitle>
          <CardDescription>Latest 8 of {data.length} records</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Header</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Reviewer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.slice(0, 8).map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.header}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{row.type}</Badge>
                  </TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell className="text-right">{row.reviewer}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
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
    <AppFrame nav={schema.nav}>
      <Kpis />
      <Chart />
      <Records />
    </AppFrame>
  );
}
