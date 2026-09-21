import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { FileText, Folder, BarChart, Users, User, Settings, CornerDownLeft } from "lucide-react"

/** Props a call site may pass through to an icon. */
type IconProps = { className?: string; size?: number | string }

/** An icon held in data and rendered later, e.g. `<item.icon className="size-4" />`. */
type IconRenderer = (props: IconProps) => React.ReactNode

type Entry = {
  id: string
  icon: IconRenderer
  title: string
  group: string
  category: string
  description: string
  meta: { label: string; value: string }[]
}

const entries: Entry[] = [
  {
    id: "roadmap",
    icon: (p: IconProps) => (
      <FileText {...p} />
    ),
    title: "Q3 Product Roadmap",
    group: "Documents",
    category: "Document",
    description:
      "The planning doc for the next quarter, covering themes, bets, and the sequencing across teams.",
    meta: [
      { label: "Owner", value: "Mara Lin" },
      { label: "Updated", value: "Jul 9, 2026" },
    ],
  },
  {
    id: "assets",
    icon: (p: IconProps) => (
      <Folder {...p} />
    ),
    title: "Brand Assets",
    group: "Documents",
    category: "Folder",
    description:
      "Logos, color tokens, and export-ready templates for the marketing and product teams.",
    meta: [
      { label: "Items", value: "148 files" },
      { label: "Updated", value: "Jul 2, 2026" },
    ],
  },
  {
    id: "analytics",
    icon: (p: IconProps) => (
      <BarChart {...p} />
    ),
    title: "View Analytics",
    group: "Navigation",
    category: "Page",
    description:
      "Traffic, conversion, and retention dashboards for the current billing period.",
    meta: [
      { label: "Section", value: "Insights" },
      { label: "Access", value: "Admins" },
    ],
  },
  {
    id: "members",
    icon: (p: IconProps) => (
      <Users {...p} />
    ),
    title: "Browse Members",
    group: "Navigation",
    category: "Page",
    description:
      "The full team directory with roles, status, and their most recent activity.",
    meta: [
      { label: "Section", value: "People" },
      { label: "Count", value: "42 members" },
    ],
  },
  {
    id: "profile",
    icon: (p: IconProps) => (
      <User {...p} />
    ),
    title: "Edit Profile",
    group: "Actions",
    category: "Action",
    description:
      "Update your display name, avatar, and the notifications you receive.",
    meta: [{ label: "Shortcut", value: "Cmd E" }],
  },
  {
    id: "settings",
    icon: (p: IconProps) => (
      <Settings {...p} />
    ),
    title: "Open Settings",
    group: "Actions",
    category: "Action",
    description:
      "Workspace preferences, billing, integrations, and security controls.",
    meta: [{ label: "Shortcut", value: "Cmd ," }],
  },
]

const groups = ["Navigation", "Documents", "Actions"]

const byId = Object.fromEntries(entries.map((e) => [e.id, e]))

const COMMAND_GROUP_CLASS =
  "p-1.5 **:[[cmdk-group-heading]]:px-3 **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:tracking-wide"

function PreviewPane({ entry }: { entry: Entry | undefined }) {
  if (!entry) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
        Select a result to preview it.
      </div>
    )
  }
  return (
    <div className="flex h-full flex-col p-5">
      <div className="flex size-11 items-center justify-center rounded-lg border border-border bg-muted text-foreground">
        <entry.icon className="size-5" aria-hidden="true" />
      </div>
      <div className="mt-4 flex items-center gap-2">
        <h3 className="font-heading text-sm font-semibold">{entry.title}</h3>
        <Badge variant="secondary">{entry.category}</Badge>
      </div>
      <p className="mt-2 text-sm text-pretty text-muted-foreground">
        {entry.description}
      </p>
      <dl className="mt-5 flex flex-col gap-2 border-t border-border pt-4">
        {entry.meta.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <dt className="text-xs text-muted-foreground">{row.label}</dt>
            <dd className="text-xs font-medium tabular-nums">{row.value}</dd>
          </div>
        ))}
      </dl>
      <Button className="mt-auto w-full">
        Open
        <KbdGroup>
          <Kbd>
            <CornerDownLeft className="size-3" aria-hidden="true" />
          </Kbd>
        </KbdGroup>
      </Button>
    </div>
  )
}

export default function CommandPaletteBlock() {
  const [value, setValue] = React.useState(entries[0].id)
  const selected = byId[value]

  return (
    <section className="flex min-h-svh w-full items-center justify-center bg-background px-6 py-16 text-foreground">
      <div className="grid h-[420px] w-full max-w-2xl grid-cols-1 overflow-hidden rounded-lg border border-border bg-popover sm:grid-cols-[1fr_260px]">
        <Command
          value={value}
          onValueChange={setValue}
          className="bg-transparent"
        >
          <CommandInput
            aria-label="Search everything"
            placeholder="Search everything…"
            className="text-sm"
          />
          <CommandList className="max-h-none flex-1">
            <CommandEmpty className="text-sm">No results found.</CommandEmpty>
            {groups.map((group) => (
              <CommandGroup
                key={group}
                heading={group}
                className={COMMAND_GROUP_CLASS}
              >
                {entries
                  .filter((entry) => entry.group === group)
                  .map((entry) => (
                    <CommandItem
                      key={entry.id}
                      value={entry.id}
                      onSelect={() => setValue(entry.id)}
                      className="gap-2.5 px-3 py-2.5 text-sm"
                    >
                      <entry.icon aria-hidden="true" />
                      <span className="flex-1 truncate">{entry.title}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>

        <div className="hidden border-l border-border bg-background sm:block">
          <PreviewPane entry={selected} />
        </div>
      </div>
    </section>
  )
}
