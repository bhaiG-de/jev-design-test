"use client"

import * as React from "react"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Marker, MarkerContent } from "@/components/ui/marker"
import { Message, MessageContent } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { Headset, Send } from "lucide-react"

type ChatMessage = { id: number; from: "me" | "agent"; text: string }

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    from: "agent",
    text: "Hi there! Thanks for reaching out. How can we help you today?",
  },
]

const quickReplies = [
  "I need help with billing",
  "How do I reset my password?",
  "Talk to a human",
]

export default function ChatBlock() {
  const [messages, setMessages] = React.useState(initialMessages)
  const [draft, setDraft] = React.useState("")
  const nextId = React.useRef(initialMessages.length + 1)

  const sendText = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const id = nextId.current++
    setMessages((prev) => [...prev, { id, from: "me", text: trimmed }])
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendText(draft)
    setDraft("")
  }

  const repliesVisible = messages.length === 1

  return (
    <section className="flex w-full items-center justify-center bg-muted/30 px-6 py-16 text-foreground">
      <MessageScrollerProvider autoScroll defaultScrollPosition="end">
        <div className="flex h-[540px] w-full max-w-sm flex-col overflow-hidden rounded-lg border border-border bg-background">
          <div className="flex items-center gap-3 border-b border-border bg-card p-4">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Headset className="size-5" aria-hidden="true" />
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Acme Support</span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  className="size-1.5 rounded-full bg-success"
                  aria-hidden="true"
                />
                Typically replies in a few minutes
              </span>
            </div>
          </div>

          <MessageScroller className="flex-1">
            <MessageScrollerViewport>
              <MessageScrollerContent className="gap-4 p-4">
                <Marker variant="separator">
                  <MarkerContent>Conversation started</MarkerContent>
                </Marker>
                {messages.map((message) => (
                  <MessageScrollerItem
                    key={message.id}
                    messageId={String(message.id)}
                    scrollAnchor={message.from === "me"}
                  >
                    <Message align={message.from === "me" ? "end" : "start"}>
                      <MessageContent>
                        <Bubble
                          variant={message.from === "me" ? "default" : "muted"}
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

          {repliesVisible && (
            <div className="flex flex-wrap gap-2 border-t border-border p-3">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  onClick={() => sendText(reply)}
                  className="rounded-md border border-border px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-muted"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={onSubmit}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Send a message..."
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
        </div>
      </MessageScrollerProvider>
    </section>
  )
}
