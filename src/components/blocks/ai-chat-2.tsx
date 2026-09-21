"use client"

import * as React from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Message, MessageAvatar, MessageContent } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { Textarea } from "@/components/ui/textarea"
import { ChartBar, FileText, Lightbulb, Sparkles, Send } from "lucide-react"

/** Props a call site may pass through to an icon. */
type IconProps = { className?: string; size?: number | string }

const suggestions = [
  {
    icon: (p: IconProps) => (
      <ChartBar {...p} />
    ),
    label: "Summarise last quarter's revenue",
  },
  {
    icon: (p: IconProps) => (
      <FileText {...p} />
    ),
    label: "Draft a status update for stakeholders",
  },
  {
    icon: (p: IconProps) => (
      <Lightbulb {...p} />
    ),
    label: "Suggest three ways to reduce churn",
  },
  {
    icon: (p: IconProps) => (
      <Sparkles {...p} />
    ),
    label: "What are my top action items today?",
  },
]

const CANNED_REPLIES = [
  "Here's what I found: the latest figures are trending up across your core segments, with no anomalies worth flagging.",
  "Good ask. I've put together a concise summary you can drop straight into your update: headline metric, main driver, and current risk.",
  "Based on the workspace data, the top three opportunities all tie back to onboarding and activation. Want me to expand on any of them?",
  "Your priorities for today: two items need a decision, one is waiting on review. I can draft the follow-ups if that helps.",
]

type MessageRole = "user" | "assistant"

interface ChatMessage {
  id: number
  role: MessageRole
  content: string
}

export default function AiChatBlock() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [draft, setDraft] = React.useState("")
  const nextId = React.useRef(1)
  const replyIdx = React.useRef(0)
  const replyTimers = React.useRef<ReturnType<typeof setTimeout>[]>([])
  const started = messages.length > 0

  React.useEffect(() => {
    const timers = replyTimers.current
    return () => timers.forEach(clearTimeout)
  }, [])

  function sendMessage(text: string) {
    const content = text.trim()
    if (!content) return

    setMessages((prev) => [
      ...prev,
      { id: nextId.current++, role: "user", content },
    ])
    setDraft("")

    const reply = CANNED_REPLIES[replyIdx.current % CANNED_REPLIES.length]
    replyIdx.current += 1
    const timer = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: nextId.current++, role: "assistant", content: reply },
      ])
    }, 600)
    replyTimers.current.push(timer)
  }

  return (
    <section className="flex w-full items-center justify-center bg-background px-6 py-12 text-foreground">
      <MessageScrollerProvider autoScroll defaultScrollPosition="end">
        <Card className="w-full max-w-lg">
          <CardHeader className="flex flex-col items-center gap-4 pt-8 pb-2">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-6" aria-hidden="true" />
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <h2 className="font-heading text-base font-semibold tracking-tight">
                Acme AI Assistant
              </h2>
              <p className="max-w-xs text-xs text-muted-foreground">
                Ask me anything about your workspace: reports, drafts, insights,
                or next steps.
              </p>
            </div>
            <Badge variant="secondary" className="gap-1.5">
              <span className="size-1.5 bg-primary" />
              Ready
            </Badge>
          </CardHeader>

          <CardContent className="flex min-h-0 flex-1 flex-col gap-3 px-5 pb-0">
            {started ? (
              <MessageScroller className="min-h-0 flex-1">
                <MessageScrollerViewport>
                  <MessageScrollerContent className="justify-end gap-4 pr-2.5">
                    {messages.map((msg) => (
                      <MessageScrollerItem
                        key={msg.id}
                        messageId={String(msg.id)}
                        scrollAnchor={msg.role === "user"}
                      >
                        <Message align={msg.role === "user" ? "end" : "start"}>
                          {msg.role === "assistant" && (
                            <MessageAvatar>
                              <Avatar className="size-7 border border-border">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                  <Sparkles className="size-4" aria-hidden="true" />
                                </AvatarFallback>
                              </Avatar>
                            </MessageAvatar>
                          )}
                          <MessageContent>
                            <Bubble
                              variant={
                                msg.role === "user" ? "default" : "muted"
                              }
                            >
                              <BubbleContent className="whitespace-pre-line">
                                {msg.content}
                              </BubbleContent>
                            </Bubble>
                          </MessageContent>
                        </Message>
                      </MessageScrollerItem>
                    ))}
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton />
              </MessageScroller>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5 py-4">
                <p className="text-center text-sm font-medium text-foreground">
                  What can I help with?
                </p>
                <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                  {suggestions.map(({ icon: Icon, label }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => sendMessage(label)}
                      className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-border bg-muted px-3 py-2.5 text-left transition-colors hover:bg-accent focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      <Icon className="mt-px size-3.5 shrink-0 text-muted-foreground" />
                      <span className="text-xs leading-snug text-foreground">
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="px-5 pt-4 pb-5">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                sendMessage(draft)
              }}
              className="flex w-full flex-col gap-2"
            >
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage(draft)
                  }
                }}
                placeholder="Ask anything…"
                aria-label="Ask anything"
                className="resize-none"
                rows={3}
              />
              <div className="flex w-full items-center justify-between">
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <KbdGroup>
                    <Kbd>Shift</Kbd>
                    <Kbd>Enter</Kbd>
                  </KbdGroup>
                  New Line
                </span>
                <Button type="submit" size="sm" disabled={!draft.trim()}>
                  <Send data-icon="inline-start" />
                  Send
                </Button>
              </div>
            </form>
          </CardFooter>
        </Card>
      </MessageScrollerProvider>
    </section>
  )
}
