"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { LayoutGrid, FileText, BarChart, Users, Plus, User, Settings, SquareTerminal, Moon, Search, CornerDownLeft } from "lucide-react"

/** Props a call site may pass through to an icon. */
type IconProps = { className?: string; size?: number | string }

/** An icon held in data and rendered later, e.g. `<item.icon className="size-4" />`. */
type IconRenderer = (props: IconProps) => React.ReactNode

type PaletteCommand = {
  id: string
  label: string
  group: string
  icon: IconRenderer
  shortcut: string[]
}

const commands: PaletteCommand[] = [
  {
    id: "dashboard",
    label: "Go To Dashboard",
    group: "Navigation",
    icon: (p: IconProps) => (
      <LayoutGrid {...p} />
    ),
    shortcut: ["G", "D"],
  },
  {
    id: "projects",
    label: "Open Projects",
    group: "Navigation",
    icon: (p: IconProps) => (
      <FileText {...p} />
    ),
    shortcut: ["G", "P"],
  },
  {
    id: "analytics",
    label: "View Analytics",
    group: "Navigation",
    icon: (p: IconProps) => (
      <BarChart {...p} />
    ),
    shortcut: ["G", "A"],
  },
  {
    id: "members",
    label: "Browse Members",
    group: "Navigation",
    icon: (p: IconProps) => (
      <Users {...p} />
    ),
    shortcut: ["G", "M"],
  },
  {
    id: "new-project",
    label: "Create New Project",
    group: "Actions",
    icon: (p: IconProps) => (
      <Plus {...p} />
    ),
    shortcut: ["Ctrl", "N"],
  },
  {
    id: "profile",
    label: "Edit Profile",
    group: "Actions",
    icon: (p: IconProps) => (
      <User {...p} />
    ),
    shortcut: ["Ctrl", "E"],
  },
  {
    id: "settings",
    label: "Open Settings",
    group: "Actions",
    icon: (p: IconProps) => (
      <Settings {...p} />
    ),
    shortcut: ["Ctrl", ","],
  },
  {
    id: "terminal",
    label: "Open Terminal",
    group: "Actions",
    icon: (p: IconProps) => (
      <SquareTerminal {...p} />
    ),
    shortcut: ["Ctrl", "`"],
  },
  {
    id: "theme",
    label: "Toggle Dark Mode",
    group: "Preferences",
    icon: (p: IconProps) => (
      <Moon {...p} />
    ),
    shortcut: ["Ctrl", "K", "T"],
  },
]

const groupOrder = ["Navigation", "Actions", "Preferences"]

const COMMAND_GROUP_CLASS =
  "p-1.5 **:[[cmdk-group-heading]]:px-3 **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:tracking-wide"
const COMMAND_ITEM_CLASS = "gap-2.5 px-3 py-2.5 text-sm"

export default function CommandPaletteBlock() {
  const [open, setOpen] = useState(false)
  const [ranLabel, setRanLabel] = useState<string | null>(null)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  function run(cmd: PaletteCommand) {
    setRanLabel(cmd.label)
    setOpen(false)
  }

  return (
    <section className="flex min-h-svh w-full flex-col items-center justify-center gap-6 bg-muted/30 px-6 py-16 text-foreground">
      <div className="flex w-full max-w-md flex-col items-center gap-4 text-center">
        <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          Acme Console
        </span>
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          Jump to anything
        </h2>
        <p className="text-sm text-muted-foreground">
          Search projects, run actions, and navigate without leaving the
          keyboard.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(true)}
          className="w-full justify-between font-normal text-muted-foreground"
        >
          <span className="flex items-center gap-2">
            <Search data-icon="inline-start" className="size-4" />
            Search commands…
          </span>
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </Button>
        {ranLabel ? (
          <p className="text-xs text-muted-foreground">
            Last action:{" "}
            <span className="font-medium text-foreground">{ranLabel}</span>
          </p>
        ) : null}
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput
            aria-label="Type a command or search"
            placeholder="Type a command or search…"
            className="text-sm"
          />
          <CommandList>
            <CommandEmpty className="text-sm">No results found.</CommandEmpty>
            {groupOrder.map((group) => (
              <CommandGroup
                key={group}
                heading={group}
                className={COMMAND_GROUP_CLASS}
              >
                {commands
                  .filter((cmd) => cmd.group === group)
                  .map((cmd) => (
                    <CommandItem
                      key={cmd.id}
                      value={cmd.label}
                      onSelect={() => run(cmd)}
                      className={COMMAND_ITEM_CLASS}
                    >
                      <cmd.icon aria-hidden="true" />
                      <span className="flex-1 truncate">{cmd.label}</span>
                      <CommandShortcut>
                        <KbdGroup>
                          {cmd.shortcut.map((key) => (
                            <Kbd key={key}>{key}</Kbd>
                          ))}
                        </KbdGroup>
                      </CommandShortcut>
                    </CommandItem>
                  ))}
              </CommandGroup>
            ))}
          </CommandList>

          <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <KbdGroup>
                  <Kbd>↑</Kbd>
                  <Kbd>↓</Kbd>
                </KbdGroup>
                Navigate
              </span>
              <span className="flex items-center gap-1.5">
                <Kbd>
                  <CornerDownLeft className="size-3" />
                </Kbd>
                Select
              </span>
            </div>
            <span className="hidden items-center gap-1.5 sm:flex">
              <span className="size-2 rounded-full bg-primary" />
              Acme
            </span>
          </div>
        </Command>
      </CommandDialog>
    </section>
  )
}
