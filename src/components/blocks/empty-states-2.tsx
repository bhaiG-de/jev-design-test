"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
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
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/sonner"
import { Inbox, Plus } from "lucide-react"

export default function EmptyStatesBlock() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    toast.success(`Workspace "${trimmed}" created`, {
      id: "workspace-created",
      description: "Invite your team to start collaborating.",
    })
    setOpen(false)
    setName("")
  }

  return (
    <section className="flex w-full items-center justify-center bg-background px-6 py-12 text-foreground">
      <Toaster />
      <div className="flex min-h-[720px] w-full items-center justify-center">
      <div className="w-full max-w-lg overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex items-center justify-center border-b border-border bg-muted px-8 py-12">
          <div className="relative flex size-20 items-center justify-center">
            <div className="absolute inset-0 rounded-lg border border-border bg-background" />
            <div className="absolute inset-2 rounded-md border border-border bg-card" />
            <Inbox className="relative size-8 text-foreground" />
          </div>
        </div>

        <Empty className="border-0 px-8 py-8">
          <EmptyHeader>
            <EmptyTitle className="text-base font-semibold">
              Your inbox is empty
            </EmptyTitle>
            <EmptyDescription className="max-w-xs text-sm/relaxed">
              Messages and notifications from your Acme workspace will appear
              here once your team starts collaborating.
            </EmptyDescription>
          </EmptyHeader>

          <EmptyContent>
            <div className="flex w-full max-w-xs flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger
                  render={<Button size="default" className="sm:flex-1" />}
                >
                  <Plus data-icon="inline-start" />
                  Create A Workspace
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleCreate}>
                    <DialogHeader>
                      <DialogTitle>Create a workspace</DialogTitle>
                      <DialogDescription>
                        Workspaces keep your projects, messages, and team in one
                        place.
                      </DialogDescription>
                    </DialogHeader>

                    <Field className="my-4">
                      <FieldLabel htmlFor="workspace-name">
                        Workspace name
                      </FieldLabel>
                      <Input
                        id="workspace-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Acme Inc."
                        autoFocus
                      />
                      <FieldDescription>
                        You can rename this later in settings.
                      </FieldDescription>
                    </Field>

                    <DialogFooter>
                      <DialogClose render={<Button variant="outline" />}>
                        Cancel
                      </DialogClose>
                      <Button type="submit" disabled={!name.trim()}>
                        Create Workspace
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <Button
                nativeButton={false}
                variant="outline"
                size="default"
                className="sm:flex-1"
                render={<a href="#" />}
              >
                Learn More
              </Button>
            </div>
            <Separator className="my-1 w-full max-w-xs" />
            <p className="text-xs text-muted-foreground">
              Need help?{" "}
              <a
                href="#"
                className="underline underline-offset-4 hover:text-foreground"
              >
                Contact Acme Support
              </a>
            </p>
          </EmptyContent>
        </Empty>
      </div>
      </div>
    </section>
  )
}
