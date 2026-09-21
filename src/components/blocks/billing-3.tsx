import * as React from "react"
import {
  sortFn_datetime,
  columnVisibilityFeature,
  type ColumnDef,
  type SortingState,
  flexRender,
  tableFeatures,
  useTable,
  createSortedRowModel,
  rowSortingFeature,
  createPaginatedRowModel,
  rowPaginationFeature,
} from "@tanstack/react-table"

const TABLE_FEATURES = tableFeatures({
  columnVisibilityFeature,
  rowSortingFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: {
    datetime: sortFn_datetime,
  },
})
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowUp, ArrowDown, ChevronsUpDown, Download, Calendar, HardDrive, Pencil, CreditCard, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"

const PLAN = {
  name: "Pro",
  price: "$49",
  interval: "/ Month",
  renewalDate: "July 14, 2026",
  storage: {
    used: 162,
    total: 250,
  },
}

const PAYMENT = {
  brand: "Visa",
  last4: "4242",
  expiry: "08 / 28",
  holder: "Jordan Rivera",
}

type InvoiceStatus = "Paid" | "Pending" | "Failed"

type Invoice = {
  id: string
  date: string
  amount: string
  status: InvoiceStatus
}

const INVOICES: Invoice[] = [
  {
    id: "INV-2026-0047",
    date: "Jun 1, 2026",
    amount: "$49.00",
    status: "Paid",
  },
  {
    id: "INV-2026-0031",
    date: "May 1, 2026",
    amount: "$49.00",
    status: "Paid",
  },
  {
    id: "INV-2026-0018",
    date: "Apr 1, 2026",
    amount: "$49.00",
    status: "Pending",
  },
  {
    id: "INV-2026-0009",
    date: "Mar 1, 2026",
    amount: "$49.00",
    status: "Paid",
  },
  {
    id: "INV-2026-0004",
    date: "Feb 1, 2026",
    amount: "$49.00",
    status: "Failed",
  },
  {
    id: "INV-2026-0001",
    date: "Jan 1, 2026",
    amount: "$49.00",
    status: "Paid",
  },
  {
    id: "INV-2025-0142",
    date: "Dec 1, 2025",
    amount: "$49.00",
    status: "Paid",
  },
  {
    id: "INV-2025-0128",
    date: "Nov 1, 2025",
    amount: "$49.00",
    status: "Paid",
  },
]

const STATUS_VARIANT: Record<
  InvoiceStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Paid: "secondary",
  Pending: "outline",
  Failed: "destructive",
}

function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (sorted === "asc")
    return (
      <ArrowUp className="size-3.5" aria-hidden="true" />
    )
  if (sorted === "desc")
    return (
      <ArrowDown className="size-3.5" aria-hidden="true" />
    )
  return (
    <ChevronsUpDown className="size-3.5 text-muted-foreground/60" aria-hidden="true" />
  )
}

function SortHeader({
  label,
  sorted,
  onToggle,
  align = "left",
}: {
  label: string
  sorted: false | "asc" | "desc"
  onToggle: () => void
  align?: "left" | "right"
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "-mx-1 inline-flex items-center gap-1 rounded-md px-1 text-xs font-medium tracking-wide text-muted-foreground uppercase transition-colors hover:text-foreground",
        align === "right" && "ml-auto"
      )}
    >
      {label}
      <SortIcon sorted={sorted} />
    </button>
  )
}

const columns: ColumnDef<typeof TABLE_FEATURES, Invoice>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <SortHeader
        label="Invoice"
        sorted={column.getIsSorted()}
        onToggle={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.original.id}</span>
    ),
  },
  {
    accessorKey: "date",
    sortFn: "datetime",
    header: ({ column }) => (
      <SortHeader
        label="Date"
        sorted={column.getIsSorted()}
        onToggle={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.date}</span>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <SortHeader
        label="Amount"
        sorted={column.getIsSorted()}
        onToggle={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => (
      <span className="text-foreground tabular-nums">
        {row.original.amount}
      </span>
    ),
  },
  {
    accessorKey: "status",
    enableSorting: false,
    header: () => (
      <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Status
      </span>
    ),
    cell: ({ row }) => (
      <Badge variant={STATUS_VARIANT[row.original.status]}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "download",
    enableSorting: false,
    header: () => (
      <span className="block text-right text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Download
      </span>
    ),
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Download ${row.original.id}`}
          onClick={() =>
            toast.success("Invoice downloading", {
              description: `${row.original.id} (${row.original.amount}) is on its way.`,
            })
          }
        >
          <Download
          />
        </Button>
      </div>
    ),
  },
]

export default function BillingBlock() {
  const autoRenew = true
  const [sorting, setSorting] = React.useState<SortingState>([])
  const storagePct = Math.round((PLAN.storage.used / PLAN.storage.total) * 100)

  const table = useTable({
    features: TABLE_FEATURES,
    data: INVOICES,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
  })

  const pageCount = table.getPageCount()

  return (
    <section className="flex min-h-svh w-full justify-center bg-muted/30 px-6 py-16 text-foreground">
      <Toaster />
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-8 flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Billing
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your Acme subscription, payment method, and invoices.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-5">
          <Card className="md:col-span-3">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Current Plan</CardTitle>
                <Badge variant="secondary">{PLAN.name}</Badge>
              </div>
              <CardDescription>
                {autoRenew
                  ? "Your subscription renews automatically."
                  : "Auto-renew is turned off."}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-5">
              <div className="flex items-end gap-1">
                <span className="text-3xl font-semibold tracking-tight">
                  {PLAN.price}
                </span>
                <span className="mb-1 text-xs text-muted-foreground">
                  {PLAN.interval}
                </span>
              </div>

              <Separator />

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="size-3.5 shrink-0" />
                <span>
                  Next Renewal:{" "}
                  <span className="font-medium text-foreground">
                    {PLAN.renewalDate}
                  </span>
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <HardDrive className="size-3.5 shrink-0" />
                    <span>Storage Used</span>
                  </div>
                  <span className="font-medium text-foreground">
                    {PLAN.storage.used} GB{" "}
                    <span className="text-muted-foreground">
                      / {PLAN.storage.total} GB
                    </span>
                  </span>
                </div>
                <Progress
                  value={storagePct}
                  aria-label="Storage Used"
                  className="gap-0"
                />
                <p className="text-xs text-muted-foreground">
                  {PLAN.storage.total - PLAN.storage.used} GB Remaining
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-2 sm:flex-row">
              <UpgradePlanDialog />
              <Button
                variant="outline"
                className="w-full sm:flex-1"
                onClick={() =>
                  toast("Subscription settings", {
                    description: "Opening your subscription management panel.",
                  })
                }
              >
                Manage Subscription
              </Button>
            </CardFooter>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Used for recurring charges.</CardDescription>
              <CardAction>
                <PaymentMethodDialog
                  trigger={
                    <Button variant="ghost" size="sm">
                      <Pencil data-icon="inline-start" />
                      Edit
                    </Button>
                  }
                  title="Edit Payment Method"
                  description="Update the card used for your recurring Acme charges."
                  submitLabel="Save Card"
                  successMessage="Payment method updated"
                />
              </CardAction>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-3 rounded-lg border border-border bg-muted p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background text-foreground">
                  <CreditCard className="size-5" />
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {PAYMENT.brand} ending in {PAYMENT.last4}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Expires {PAYMENT.expiry}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Cardholder</span>
                <span className="font-medium">{PAYMENT.holder}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Billing email</span>
                <span className="font-medium">billing@acme.com</span>
              </div>
            </CardContent>

            <CardFooter className="mt-auto">
              <PaymentMethodDialog
                trigger={
                  <Button variant="outline" className="w-full">
                    Add Payment Method
                  </Button>
                }
                title="Add Payment Method"
                description="Add a new card to use for future Acme charges."
                submitLabel="Add Card"
                successMessage="Payment method added"
              />
            </CardFooter>
          </Card>

          <Card className="overflow-hidden pb-0 md:col-span-5">
            <CardHeader>
              <CardTitle>Invoice History</CardTitle>
              <CardDescription>
                Download or review past invoices.
              </CardDescription>
              <CardAction>
                <span className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {INVOICES.length}
                  </span>{" "}
                  Invoices
                </span>
              </CardAction>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="border-b border-border hover:bg-transparent"
                    >
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className={cn(
                            "h-10",
                            header.column.id === "id" && "pl-6",
                            header.column.id === "download" && "pr-6 text-right"
                          )}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        className="border-b border-border last:border-b-0"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className={cn(
                              "py-3",
                              cell.column.id === "id" && "pl-6",
                              cell.column.id === "download" && "pr-6 text-right"
                            )}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className="hover:bg-transparent">
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center text-sm text-muted-foreground"
                      >
                        No invoices yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between gap-4 border-t border-border px-6 py-2.5">
                <p className="text-xs text-muted-foreground tabular-nums">
                  Page {table.state.pagination.pageIndex + 1} of{" "}
                  {Math.max(pageCount, 1)}
                </p>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-7"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="size-3.5" aria-hidden="true" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-7"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    aria-label="Next page"
                  >
                    <ChevronRight className="size-3.5" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

const UPGRADE_PLANS = [
  { name: "Team", price: "$99", detail: "Everything in Pro + admin controls" },
  {
    name: "Enterprise",
    price: "Custom",
    detail: "SSO, audit logs, and a dedicated success manager",
  },
]

function UpgradePlanDialog() {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="w-full sm:flex-1">
            Upgrade Plan
            <ArrowRight data-icon="inline-end" />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade Your Plan</DialogTitle>
          <DialogDescription>
            You&apos;re on Pro. Pick a plan to unlock more for your team.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {UPGRADE_PLANS.map((plan) => (
            <button
              key={plan.name}
              type="button"
              onClick={() => {
                setOpen(false)
                toast.success(`Switched to ${plan.name}`, {
                  description: `Your plan will update on your next renewal.`,
                })
              }}
              className="flex items-center justify-between gap-4 rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted"
            >
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{plan.name}</span>
                <span className="max-w-[15rem] text-xs text-muted-foreground">
                  {plan.detail}
                </span>
              </span>
              <span className="shrink-0 text-sm font-semibold tabular-nums">
                {plan.price}
              </span>
            </button>
          ))}
        </div>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  )
}

function PaymentMethodDialog({
  trigger,
  title,
  description,
  submitLabel,
  successMessage,
}: {
  trigger: React.ReactElement
  title: string
  description: string
  submitLabel: string
  successMessage: string
}) {
  const [open, setOpen] = React.useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setOpen(false)
    toast.success(successMessage, {
      description: "Your billing details are now up to date.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form id="payment-form" onSubmit={handleSubmit} className="grid gap-4">
          <Field>
            <FieldLabel htmlFor="card-name">Cardholder name</FieldLabel>
            <Input id="card-name" placeholder="Jordan Rivera" />
          </Field>
          <Field>
            <FieldLabel htmlFor="card-number">Card number</FieldLabel>
            <Input id="card-number" placeholder="1234 5678 9012 3456" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="card-expiry">Expiry</FieldLabel>
              <Input id="card-expiry" placeholder="MM / YY" />
            </Field>
            <Field>
              <FieldLabel htmlFor="card-cvc">CVC</FieldLabel>
              <Input id="card-cvc" placeholder="123" />
            </Field>
          </div>
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <Button type="submit" form="payment-form">
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
