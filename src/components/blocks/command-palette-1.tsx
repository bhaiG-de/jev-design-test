"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { LayoutGrid, FileText, BarChart, Users, User, Settings, SquareTerminal, Search } from "lucide-react"

/** Props a call site may pass through to an icon. */
type IconProps = { className?: string; size?: number | string }

const COMMAND_GROUP_CLASS =
  "p-1.5 **:[[cmdk-group-heading]]:px-3 **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:tracking-wide"
const COMMAND_ITEM_CLASS = "gap-2.5 px-3 py-2.5 text-sm"

const navigationCommands = [
  {
    icon: (p: IconProps) => (
      <LayoutGrid {...p} />
    ),
    label: "Go To Dashboard",
    shortcut: ["G", "D"],
  },
  {
    icon: (p: IconProps) => (
      <FileText {...p} />
    ),
    label: "Open Projects",
    shortcut: ["G", "P"],
  },
  {
    icon: (p: IconProps) => (
      <BarChart {...p} />
    ),
    label: "View Analytics",
    shortcut: ["G", "A"],
  },
  {
    icon: (p: IconProps) => (
      <Users {...p} />
    ),
    label: "Browse Members",
    shortcut: ["G", "M"],
  },
]

const actionCommands = [
  {
    icon: (p: IconProps) => (
      <User {...p} />
    ),
    label: "Edit Profile",
    shortcut: ["Ctrl", "E"],
  },
  {
    icon: (p: IconProps) => (
      <Settings {...p} />
    ),
    label: "Open Settings",
    shortcut: ["Ctrl", ","],
  },
  {
    icon: (p: IconProps) => (
      <SquareTerminal {...p} />
    ),
    label: "Open Terminal",
    shortcut: ["Ctrl", "`"],
  },
]

export default function CommandPaletteBlock() {
  const [open, setOpen] = React.useState(true)
  const [ranLabel, setRanLabel] = React.useState<string | null>(null)

  // The Ctrl+K hint is advertised in the trigger, so wire it.
  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  function run(label: string) {
    setRanLabel(label)
    setOpen(false)
  }

  return (
    <section className="flex min-h-svh w-full flex-col items-center justify-center gap-3 bg-background px-6 py-12 text-foreground">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <Button
              variant="outline"
              className="w-full max-w-md justify-start gap-2 text-muted-foreground"
            />
          }
        >
          <Search className="size-4 shrink-0" aria-hidden="true" />
          <span className="flex-1 text-left">Search…</span>
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </DialogTrigger>

        <DialogContent className="overflow-hidden p-0" showCloseButton={false}>
          <DialogTitle className="sr-only">Command palette</DialogTitle>
          <DialogDescription className="sr-only">
            Search for a command to run.
          </DialogDescription>
          <Command>
            <CommandInput
              aria-label="Search commands"
              placeholder="Search commands…"
              className="text-sm"
            />
            <CommandList>
              <CommandEmpty className="text-sm">
                No commands found.
              </CommandEmpty>
              <CommandGroup
                heading="Navigation"
                className={COMMAND_GROUP_CLASS}
              >
                {navigationCommands.map((cmd) => (
                  <CommandItem
                    key={cmd.label}
                    value={cmd.label}
                    onSelect={() => run(cmd.label)}
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
              <CommandSeparator />
              <CommandGroup heading="Actions" className={COMMAND_GROUP_CLASS}>
                {actionCommands.map((cmd) => (
                  <CommandItem
                    key={cmd.label}
                    value={cmd.label}
                    onSelect={() => run(cmd.label)}
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
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
      {ranLabel ? (
        <p className="text-xs text-muted-foreground">
          Last action:{" "}
          <span className="font-medium text-foreground">{ranLabel}</span>
        </p>
      ) : null}
    </section>
  )
}
