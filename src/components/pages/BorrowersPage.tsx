import {
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
import { ENTITIES, ORGANIZATIONS } from "@/lib/hq-fixtures"

function OrganizationsTable() {
  return (
    <HqTable>
      <HqHead>
        <HqHeadCell>Organization</HqHeadCell>
        <HqHeadCell>Entities</HqHeadCell>
        <HqHeadCell>Users</HqHeadCell>
        <HqHeadCell>Wallets</HqHeadCell>
        <HqHeadCell>Status</HqHeadCell>
        <HqHeadCell />
      </HqHead>
      <TableBody>
        {ORGANIZATIONS.map((row) => (
          <HqRow key={row.name}>
            <HqCell className="font-medium">{row.name}</HqCell>
            <HqCell>{row.entities}</HqCell>
            <HqCell>{row.users}</HqCell>
            <HqCell>{row.wallets}</HqCell>
            <HqCell>
              <StatusBadge value={row.status} />
            </HqCell>
            <RowAction />
          </HqRow>
        ))}
      </TableBody>
    </HqTable>
  )
}

function EntitiesTable() {
  return (
    <HqTable>
      <HqHead>
        <HqHeadCell>Entity</HqHeadCell>
        <HqHeadCell>Organization</HqHeadCell>
        <HqHeadCell>Kind</HqHeadCell>
        <HqHeadCell>Wallets</HqHeadCell>
        <HqHeadCell>Loans</HqHeadCell>
        <HqHeadCell>Status</HqHeadCell>
        <HqHeadCell />
      </HqHead>
      <TableBody>
        {ENTITIES.map((row) => (
          <HqRow key={row.name}>
            <HqCell className="font-medium">{row.name}</HqCell>
            <HqCell>{row.organization}</HqCell>
            <HqCell>{row.kind}</HqCell>
            <HqCell>{row.wallets}</HqCell>
            <HqCell>{row.loans}</HqCell>
            <HqCell>
              <StatusBadge value={row.status} />
            </HqCell>
            <RowAction />
          </HqRow>
        ))}
      </TableBody>
    </HqTable>
  )
}

export function BorrowersPage({ schema }: { schema: Record<string, string> }) {
  const entities = schema.layout === "entities-table"
  return (
    <AppFrame nav={schema.nav} pageId="borrowers" pageTitle={entities ? "Entities" : "Organizations"}>
      <div className="px-4 lg:px-6">{entities ? <EntitiesTable /> : <OrganizationsTable />}</div>
    </AppFrame>
  )
}
