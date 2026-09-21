import type { ReactNode } from "react"
import { ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { truncateAddress } from "@/lib/hq-fixtures"
import { cn } from "@/lib/utils"

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  Active: "default",
  Pending: "secondary",
  "Pending KYB": "secondary",
  Matured: "outline",
  Completed: "outline",
  Liquidated: "destructive",
  Healthy: "default",
  "At Risk": "secondary",
  "Margin Call": "destructive",
  Liquidation: "destructive",
}

export function HqTable({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border bg-background">
      <div className="relative w-full overflow-x-auto">
        <table className="w-full caption-bottom text-[13px] [&_td:first-child]:pl-4 [&_th:first-child]:pl-4">
          {children}
        </table>
      </div>
    </div>
  )
}

export function HqHead({ children }: { children: ReactNode }) {
  return (
    <TableHeader>
      <TableRow className="bg-muted/30 hover:bg-muted/30">{children}</TableRow>
    </TableHeader>
  )
}

export function HqHeadCell({ children, className }: { children?: ReactNode; className?: string }) {
  return <TableHead className={cn("h-10 whitespace-nowrap text-muted-foreground", className)}>{children}</TableHead>
}

export function HqRow({
  children,
  selected,
  onClick,
}: {
  children: ReactNode
  selected?: boolean
  onClick?: () => void
}) {
  return (
    <TableRow
      data-state={selected ? "selected" : undefined}
      className={cn("h-12", onClick && "cursor-pointer")}
      onClick={onClick}
    >
      {children}
    </TableRow>
  )
}

export function HqCell({ children, className }: { children: ReactNode; className?: string }) {
  return <TableCell className={cn("whitespace-nowrap tabular-nums", className)}>{children}</TableCell>
}

export function StatusBadge({ value }: { value: string }) {
  return <Badge variant={STATUS_VARIANT[value] ?? "outline"}>{value}</Badge>
}

export function AddressCell({ address }: { address: string }) {
  return <span className="font-normal">{truncateAddress(address)}</span>
}

export function RowAction() {
  return (
    <TableCell className="sticky right-0 bg-background after:absolute after:inset-y-0 after:-left-px after:w-px after:bg-border">
      <Button variant="outline" size="icon" className="size-7" tabIndex={-1} aria-label="Open row">
        <ChevronRight className="size-4" />
      </Button>
    </TableCell>
  )
}

export { TableBody }
