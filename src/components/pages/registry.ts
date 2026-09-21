import type { ComponentType } from "react";
import { BillingPage } from "@/components/pages/BillingPage";
import { blockPageRegistry } from "@/components/pages/BlockPages";
import { ChartsPage } from "@/components/pages/ChartsPage";
import { DashboardPage } from "@/components/pages/DashboardPage";
import { LandingPage } from "@/components/pages/LandingPage";

// Page type id -> renderer. Each renderer owns its slot->component lookups
// and its fixed placeholder content; the canvas only hands it a schema.
export const pageRegistry: Record<string, ComponentType<{ schema: Record<string, string> }>> = {
  dashboard: DashboardPage,
  billing: BillingPage,
  charts: ChartsPage,
  landing: LandingPage,
  ...blockPageRegistry,
};
