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
import { COLLATERAL } from "@/lib/hq-fixtures"

const AT_RISK = new Set(["At Risk", "Margin Call", "Liquidation"])

export function CollateralPage({ schema }: { schema: Record<string, string> }) {
  const focus = schema.layout === "at-risk-focus"
  const rows = focus ? COLLATERAL.filter((r) => AT_RISK.has(r.status)) : COLLATERAL
  return (
    <AppFrame nav={schema.nav} pageId="collateral">
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        {focus && (
          <div className="flex items-center gap-3 border-b pb-3 text-[13px]">
            <span className="font-medium tabular-nums">{rows.length}</span>
            <span className="text-muted-foreground">loans in At Risk, Margin Call or Liquidation</span>
          </div>
        )}
        <HqTable>
          <HqHead>
            <HqHeadCell>Borrower</HqHeadCell>
            <HqHeadCell>Loan ID</HqHeadCell>
            <HqHeadCell>Asset</HqHeadCell>
            <HqHeadCell>Amount</HqHeadCell>
            <HqHeadCell>Value</HqHeadCell>
            <HqHeadCell>LTV</HqHeadCell>
            <HqHeadCell>Chain</HqHeadCell>
            <HqHeadCell>Health</HqHeadCell>
            <HqHeadCell />
          </HqHead>
          <TableBody>
            {rows.map((row) => (
              <HqRow key={row.loanId}>
                <HqCell className="font-medium">{row.borrower}</HqCell>
                <HqCell>
                  <AddressCell address={row.loanId} />
                </HqCell>
                <HqCell>{row.asset}</HqCell>
                <HqCell>{row.amount}</HqCell>
                <HqCell>{row.value}</HqCell>
                <HqCell>{row.ltv}</HqCell>
                <HqCell>{row.chain}</HqCell>
                <HqCell>
                  <StatusBadge value={row.status} />
                </HqCell>
                <RowAction />
              </HqRow>
            ))}
          </TableBody>
        </HqTable>
      </div>
    </AppFrame>
  )
}
