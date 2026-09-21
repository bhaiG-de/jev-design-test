import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Message, MessageContent } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { cn } from "@/lib/utils"
import { Search, Send } from "lucide-react"

type ChatMessage = { id: number; from: "me" | "them"; text: string }

type Conversation = {
  id: string
  name: string
  avatar: string
  preview: string
  time: string
  unread?: number
}

const conversations: Conversation[] = [
  {
    id: "mara",
    name: "Mara Lin",
    avatar: "/pravatar/80?img=32",
    preview: "Anything you would change before we ship?",
    time: "9:43 AM",
    unread: 2,
  },
  {
    id: "leo",
    name: "Leo Tanaka",
    avatar: "/pravatar/80?img=12",
    preview: "The API docs are live now.",
    time: "9:20 AM",
  },
  {
    id: "sam",
    name: "Sam Rivera",
    avatar: "/pravatar/80?img=15",
    preview: "Can you review the release notes?",
    time: "8:52 AM",
    unread: 1,
  },
  {
    id: "owen",
    name: "Owen Reyes",
    avatar: "/pravatar/80?img=53",
    preview: "Thanks for the quick review!",
    time: "Yesterday",
  },
  {
    id: "jordan",
    name: "Jordan Kim",
    avatar: "/pravatar/80?img=8",
    preview: "Moved the sync to 3pm, hope that works.",
    time: "Yesterday",
  },
  {
    id: "morgan",
    name: "Morgan Lee",
    avatar: "/pravatar/80?img=26",
    preview: "Sent over the updated invoice.",
    time: "Tue",
  },
  {
    id: "taylor",
    name: "Taylor Obi",
    avatar: "/pravatar/80?img=59",
    preview: "Sounds good, see you then.",
    time: "Tue",
  },
  {
    id: "jamie",
    name: "Jamie Park",
    avatar: "/pravatar/80?img=68",
    preview: "Can we push the deadline a day?",
    time: "Mon",
  },
  {
    id: "alex",
    name: "Alex Chen",
    avatar: "/pravatar/80?img=5",
    preview: "Great catch on the QA pass.",
    time: "Mon",
  },
]

const seed: Record<string, ChatMessage[]> = {
  mara: [
    { id: 1, from: "them", text: "Did you look at the new onboarding flow?" },
    { id: 2, from: "me", text: "Just did. The empty states are a nice touch." },
    { id: 3, from: "them", text: "Anything you would change before we ship?" },
  ],
  leo: [
    { id: 1, from: "them", text: "Pushed the v2 API reference." },
    { id: 2, from: "them", text: "The API docs are live now." },
  ],
  sam: [
    { id: 1, from: "them", text: "Draft release notes are in the doc." },
    { id: 2, from: "them", text: "Can you review the release notes?" },
  ],
  owen: [
    { id: 1, from: "me", text: "Left a few notes on your PR." },
    { id: 2, from: "them", text: "Thanks for the quick review!" },
  ],
  jordan: [
    { id: 1, from: "them", text: "Heads up, moving today's sync back an hour." },
    { id: 2, from: "them", text: "Moved the sync to 3pm, hope that works." },
    { id: 3, from: "me", text: "Works for me, thanks for the flag." },
  ],
  morgan: [
    { id: 1, from: "them", text: "Sent over the updated invoice." },
    { id: 2, from: "me", text: "Got it, looks correct on our end." },
  ],
  taylor: [
    { id: 1, from: "me", text: "Still good for the walkthrough tomorrow?" },
    { id: 2, from: "them", text: "Sounds good, see you then." },
  ],
  jamie: [
    { id: 1, from: "them", text: "Running a little behind on the assets." },
    { id: 2, from: "them", text: "Can we push the deadline a day?" },
    { id: 3, from: "me", text: "That works, thanks for the heads up." },
  ],
  alex: [
    { id: 1, from: "me", text: "Found two edge cases in the QA pass." },
    { id: 2, from: "them", text: "Great catch on the QA pass." },
  ],
}

export default function ChatBlock() {
  const [threads, setThreads] = React.useState(seed)
  const [activeId, setActiveId] = React.useState(conversations[0].id)
  const [draft, setDraft] = React.useState("")
  const [query, setQuery] = React.useState("")
  const nextId = React.useRef(1000)

  const active =
    conversations.find((c) => c.id === activeId) ?? conversations[0]
  const messages = threads[activeId]
  const filtered = conversations.filter((c) =>
    c.name.toLowerCase().includes(query.trim().toLowerCase())
  )

  const send = (e: React.FormEvent) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    const id = nextId.current++
    setThreads((prev) => ({
      ...prev,
      [activeId]: [...prev[activeId], { id, from: "me", text }],
    }))
    setDraft("")
  }

  return (
    <section className="flex w-full items-center justify-center bg-muted/30 px-6 py-16 text-foreground">
      <div className="grid h-[560px] w-full max-w-5xl grid-cols-1 overflow-hidden rounded-lg border border-border bg-background sm:grid-cols-[320px_1fr]">
        <div className="hidden flex-col border-r border-border bg-card sm:flex">
          <div className="flex flex-col gap-3 border-b border-border p-4">
            <h2 className="font-heading text-sm font-semibold">Messages</h2>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search messages..."
                aria-label="Search conversations"
                className="pl-8"
              />
            </div>
          </div>
          <ul className="flex flex-1 flex-col overflow-y-auto">
            {filtered.map((conversation) => (
              <li key={conversation.id}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveId(conversation.id)
                    setDraft("")
                  }}
                  aria-pressed={conversation.id === activeId}
                  className={cn(
                    "flex w-full items-center gap-3 border-b border-border p-3 text-left transition-colors",
                    conversation.id === activeId
                      ? "bg-muted"
                      : "hover:bg-muted/50"
                  )}
                >
                  <Avatar className="size-9 shrink-0">
                    <AvatarImage
                      src={conversation.avatar}
                      alt={conversation.name}
                      className=""
                    />
                    <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium">
                        {conversation.name}
                      </span>
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {conversation.time}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-xs text-muted-foreground">
                        {conversation.preview}
                      </span>
                      {conversation.unread ? (
                        <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                          {conversation.unread}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex min-w-0 flex-col">
          <MessageScrollerProvider
            key={activeId}
            autoScroll
            defaultScrollPosition="end"
          >
            <div className="flex items-center gap-3 border-b border-border p-4">
              <Avatar className="size-8">
                <AvatarImage
                  src={active.avatar}
                  alt={active.name}
                  className=""
                />
                <AvatarFallback>{active.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{active.name}</span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span
                    className="size-1.5 rounded-full bg-success"
                    aria-hidden="true"
                  />
                  Online
                </span>
              </div>
            </div>

            <MessageScroller className="flex-1">
              <MessageScrollerViewport>
                <MessageScrollerContent className="justify-end gap-4 p-4">
                  {messages.map((message) => (
                    <MessageScrollerItem
                      key={message.id}
                      messageId={String(message.id)}
                      scrollAnchor={message.from === "me"}
                    >
                      <Message align={message.from === "me" ? "end" : "start"}>
                        <MessageContent>
                          <Bubble
                            variant={
                              message.from === "me" ? "default" : "muted"
                            }
                          >
                            <BubbleContent>{message.text}</BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  ))}
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>

            <form
              onSubmit={send}
              className="flex items-center gap-2 border-t border-border p-3"
            >
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type a message..."
                aria-label="Message"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!draft.trim()}
                aria-label="Send message"
              >
                <Send className="size-4" aria-hidden="true" />
              </Button>
            </form>
          </MessageScrollerProvider>
        </div>
      </div>
    </section>
  )
}
