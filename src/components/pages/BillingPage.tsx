import type { ComponentType, ReactNode } from "react";
import CurrentPlan from "@/components/blocks/billing-1";
import InvoiceTable from "@/components/blocks/billing-2";
import FullBilling from "@/components/blocks/billing-3";
import PaymentMethods from "@/components/blocks/billing-5";
import AddCardForm from "@/components/blocks/billing-6";
import { AppFrame, PageHeader } from "@/components/pages/AppShell";

// The 7ovr billing blocks are widget cards (max-w-sm/md/lg/2xl), not pages.
// Each is wrapped in its own `.block-reset` so it fills its grid cell, and
// the layouts below arrange them into complete screens.
const B = ({ children }: { children: ReactNode }) => <div className="block-reset min-w-0">{children}</div>;

const TITLE = "Billing & payments";
const DESC = "Manage your plan, payment methods and invoices.";

function Overview() {
  // Already a full page (own heading, plan + payment + invoices).
  return (
    <B>
      <FullBilling />
    </B>
  );
}

function PlanAndCards() {
  return (
    <>
      <PageHeader title={TITLE} description={DESC} />
      <div className="grid gap-6 md:grid-cols-2">
        <B><CurrentPlan /></B>
        <B><PaymentMethods /></B>
      </div>
      <B><InvoiceTable /></B>
    </>
  );
}

function InvoicesFocus() {
  return (
    <>
      <PageHeader title={TITLE} description={DESC} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <B><InvoiceTable /></B>
        <div className="flex flex-col gap-6">
          <B><CurrentPlan /></B>
          <B><PaymentMethods /></B>
        </div>
      </div>
    </>
  );
}

function PaymentSettings() {
  return (
    <>
      <PageHeader title={TITLE} description={DESC} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(420px,480px)]">
        <B><PaymentMethods /></B>
        <B><AddCardForm /></B>
      </div>
      <B><InvoiceTable /></B>
    </>
  );
}

function AddCard() {
  return (
    <>
      <PageHeader title={TITLE} description={DESC} />
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        <B><AddCardForm /></B>
        <B><PaymentMethods /></B>
      </div>
    </>
  );
}

const LAYOUTS: Record<string, ComponentType> = {
  overview: Overview,
  "plan-and-cards": PlanAndCards,
  "invoices-focus": InvoicesFocus,
  "payment-settings": PaymentSettings,
  "add-card": AddCard,
};

export function BillingPage({ schema }: { schema: Record<string, string> }) {
  const Layout = LAYOUTS[schema.layout] ?? Overview;
  const width = schema.width === "contained" ? "mx-auto w-full max-w-5xl" : "w-full";
  return (
    <AppFrame nav={schema.nav} pageId="billing">
      <div className={`${width} flex flex-col gap-6 px-4 lg:px-6`}>
        <Layout />
      </div>
    </AppFrame>
  );
}
