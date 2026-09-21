import type { ComponentType } from "react";
import { AppFrame, ContentFrame } from "@/components/pages/AppShell";
import { ChartAreaDefault } from "@/components/chart-area-default";
import { ChartAreaGradient } from "@/components/chart-area-gradient";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { ChartAreaLegend } from "@/components/chart-area-legend";
import { ChartAreaLinear } from "@/components/chart-area-linear";
import { ChartAreaStacked } from "@/components/chart-area-stacked";
import { ChartAreaStep } from "@/components/chart-area-step";
import { ChartBarDefault } from "@/components/chart-bar-default";
import { ChartBarHorizontal } from "@/components/chart-bar-horizontal";
import { ChartBarInteractive } from "@/components/chart-bar-interactive";
import { ChartBarMixed } from "@/components/chart-bar-mixed";
import { ChartBarMultiple } from "@/components/chart-bar-multiple";
import { ChartBarNegative } from "@/components/chart-bar-negative";
import { ChartBarStacked } from "@/components/chart-bar-stacked";
import { ChartLineDefault } from "@/components/chart-line-default";
import { ChartLineDots } from "@/components/chart-line-dots";
import { ChartLineInteractive } from "@/components/chart-line-interactive";
import { ChartLineLabel } from "@/components/chart-line-label";
import { ChartLineLinear } from "@/components/chart-line-linear";
import { ChartLineMultiple } from "@/components/chart-line-multiple";
import { ChartLineStep } from "@/components/chart-line-step";
import { ChartPieDonut } from "@/components/chart-pie-donut";
import { ChartPieDonutText } from "@/components/chart-pie-donut-text";
import { ChartPieLabel } from "@/components/chart-pie-label";
import { ChartPieLegend } from "@/components/chart-pie-legend";
import { ChartPieSimple } from "@/components/chart-pie-simple";
import { ChartPieStacked } from "@/components/chart-pie-stacked";
import { ChartRadarDefault } from "@/components/chart-radar-default";
import { ChartRadarDots } from "@/components/chart-radar-dots";
import { ChartRadarMultiple } from "@/components/chart-radar-multiple";
import { ChartRadialSimple } from "@/components/chart-radial-simple";
import { ChartRadialStacked } from "@/components/chart-radial-stacked";
import { ChartRadialText } from "@/components/chart-radial-text";

// A charts / analytics-report screen: each layout option is a gallery of
// real shadcn chart blocks (recharts) inside the shared app shell.
//
// Columns respond to the gallery's own rendered width via a container query
// (not the viewport) so a squeeze from with-aside/header-and-aside content
// modes drops to 2 or 1 columns instead of cramming 3 cards under ~300px.
function grid(items: ComponentType[], maxCols: 1 | 3 = 3) {
  const cols =
    maxCols === 1 ? "grid-cols-1" : "grid-cols-1 @[640px]:grid-cols-2 @[960px]:grid-cols-3";
  return function Gallery() {
    return (
      <div className="@container">
        <div className={`grid gap-4 ${cols}`}>
          {items.map((Item, i) => (
            <Item key={i} />
          ))}
        </div>
      </div>
    );
  };
}

const GALLERIES: Record<string, ComponentType> = {
  "area-gallery": grid([ChartAreaDefault, ChartAreaLinear, ChartAreaStep, ChartAreaStacked, ChartAreaGradient, ChartAreaLegend]),
  "bar-gallery": grid([ChartBarDefault, ChartBarHorizontal, ChartBarMultiple, ChartBarStacked, ChartBarNegative, ChartBarMixed]),
  "line-gallery": grid([ChartLineDefault, ChartLineLinear, ChartLineStep, ChartLineMultiple, ChartLineDots, ChartLineLabel]),
  "pie-gallery": grid([ChartPieSimple, ChartPieDonut, ChartPieDonutText, ChartPieLegend, ChartPieLabel, ChartPieStacked]),
  "radar-radial-gallery": grid([ChartRadarDefault, ChartRadarDots, ChartRadarMultiple, ChartRadialSimple, ChartRadialText, ChartRadialStacked]),
  "interactive-stack": grid([ChartAreaInteractive, ChartBarInteractive, ChartLineInteractive], 1),
};

export function ChartsPage({ schema }: { schema: Record<string, string> }) {
  const Gallery = GALLERIES[schema.layout] ?? GALLERIES["area-gallery"];
  return (
    <AppFrame nav={schema.nav}>
      <ContentFrame mode={schema.content} title="Charts & reports">
        <Gallery />
      </ContentFrame>
    </AppFrame>
  );
}
