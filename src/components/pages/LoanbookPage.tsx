import { useState } from "react"
import { X } from "lucide-react"
import {
  AddressCell,
  HqCell,
  HqHead,
  HqHeadCell,
  HqRow,
  HqTable,
  RowAction,
  StatusBadge,
  TableBody,
} from "@/components/hq-table"
import { AppFrame } from "@/components/pages/AppShell"
import { Button } from "@/components/ui/button"
import { LOANS, type LoanRow, truncateAddress } from "@/lib/hq-fixtures"

function LoanTable({
  selectedId,
  onSelect,
}: {
  selectedId: string
  onSelect: (id: string) => void
}) {
  return (
    <HqTable>
      <HqHead>
        <HqHeadCell>Loan ID</HqHeadCell>
        <HqHeadCell>Borrower</HqHeadCell>
        <HqHeadCell>Pool</HqHeadCell>
        <HqHeadCell>Asset</HqHeadCell>
        <HqHeadCell>Principal</HqHeadCell>
        <HqHeadCell>Collateral</HqHeadCell>
        <HqHeadCell>APY</HqHeadCell>
        <HqHeadCell>State</HqHeadCell>
        <HqHeadCell>Health</HqHeadCell>
        <HqHeadCell />
      </HqHead>
      <TableBody>
        {LOANS.map((loan) => (
          <HqRow key={loan.id} selected={loan.id === selectedId} onClick={() => onSelect(loan.id)}>
            <HqCell>
              <AddressCell address={loan.id} />
            </HqCell>
            <HqCell className="font-medium">{loan.borrower}</HqCell>
            <HqCell>{loan.pool}</HqCell>
            <HqCell>{loan.asset}</HqCell>
            <HqCell>{loan.principal}</HqCell>
            <HqCell>{loan.collateral}</HqCell>
            <HqCell>{loan.apy}</HqCell>
            <HqCell>
              <StatusBadge value={loan.status} />
            </HqCell>
            <HqCell>
              <StatusBadge value={loan.health} />
            </HqCell>
            <RowAction />
          </HqRow>
        ))}
      </TableBody>
    </HqTable>
  )
}

function Detail({ loan, onClose }: { loan: LoanRow; onClose: () => void }) {
  const rows = [
    ["Borrower", loan.borrower],
    ["Pool", loan.pool],
    ["Asset", loan.asset],
    ["Loan ID", truncateAddress(loan.id)],
    ["Principal", loan.principal],
    ["Collateral", loan.collateral],
    ["APY", loan.apy],
    ["State", loan.status],
    ["Health", loan.health],
  ]
  return (
    <div className="flex h-full w-[320px] shrink-0 flex-col border-l bg-background">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-sm font-medium">Details</h3>
        <Button variant="ghost" size="icon" className="size-7" onClick={onClose} aria-label="Close">
          <X className="size-4" />
        </Button>
      </div>
      <dl className="flex flex-col gap-3 p-4 text-[13px]">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-4">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export function LoanbookPage({ schema }: { schema: Record<string, string> }) {
  const [selectedId, setSelectedId] = useState(LOANS[0].id)
  const selected = LOANS.find((l) => l.id === selectedId) ?? LOANS[0]
  const withAside = schema.layout !== "full-table"
  return (
    <AppFrame nav={schema.nav} pageId="loanbook">
      <div className="flex min-h-0 flex-1 px-4 lg:px-6">
        <div className="min-w-0 flex-1">
          <LoanTable selectedId={selectedId} onSelect={setSelectedId} />
        </div>
        {withAside && <Detail loan={selected} onClose={() => setSelectedId(LOANS[0].id)} />}
      </div>
    </AppFrame>
  )
}
