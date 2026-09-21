import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
} from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { Separator } from "@/components/ui/separator"
import { Bot, Sparkles, Send } from "lucide-react"

type MessageRole = "user" | "assistant"

interface ChatMessage {
  id: number
  role: MessageRole
  content: string
  time: string
}

const userAvatar = "/pravatar/150?img=24"
const userName = "Jordan Davis"

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hello! I'm Acme AI. How can I help you today? You can ask me anything about your account, products, or support topics.",
    time: "9:41 AM",
  },
  {
    id: 2,
    role: "user",
    content: "Can you summarise last quarter's revenue for the EMEA region?",
    time: "9:42 AM",
  },
  {
    id: 3,
    role: "assistant",
    content:
      "Sure! EMEA revenue for Q3 2024 was $2.84M, up 18.3% quarter-over-quarter. The strongest contributors were the UK (+$420k), Germany (+$310k), and France (+$275k). Churn remained low at 2.1%, and new logo ARR accounted for 34% of the total.",
    time: "9:42 AM",
  },
  {
    id: 4,
    role: "user",
    content: "Great. Which product line drove the most growth?",
    time: "9:43 AM",
  },
  {
    id: 5,
    role: "assistant",
    content:
      "The Acme Pro tier led growth, contributing $1.12M (+26% QoQ). Enterprise seats added 41 upsells this quarter. The legacy Starter plan declined by $88k as customers migrated to Pro, which is expected per our migration roadmap.",
    time: "9:43 AM",
  },
]

const CANNED_REPLIES = [
  "Got it. Let me pull that together. Based on the latest data, the trend is holding steady with healthy growth across your top segments.",
  "Good question. The numbers point to a positive trajectory; I'd recommend reviewing the dashboard for the segment-level breakdown.",
  "Here's a quick take: the key drivers remain consistent with last quarter, and there are no anomalies worth flagging right now.",
  "Sure thing. I've drafted a summary you can share. It highlights the headline figure, the main growth lever, and the current churn rate.",
]

function formatTime() {
  return new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  })
}

export default function AiChatBlock() {
  const [messages, setMessages] =
    React.useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [draft, setDraft] = React.useState("")
  const nextId = React.useRef(INITIAL_MESSAGES.length + 1)
  const replyIdx = React.useRef(0)
  const replyTimers = React.useRef<ReturnType<typeof setTimeout>[]>([])

  React.useEffect(() => {
    const timers = replyTimers.current
    return () => timers.forEach(clearTimeout)
  }, [])

  function send() {
    const text = draft.trim()
    if (!text) return

    const userMsg: ChatMessage = {
      id: nextId.current++,
      role: "user",
      content: text,
      time: formatTime(),
    }
    setMessages((prev) => [...prev, userMsg])
    setDraft("")

    const reply = CANNED_REPLIES[replyIdx.current % CANNED_REPLIES.length]
    replyIdx.current += 1
    const timer = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId.current++,
          role: "assistant",
          content: reply,
          time: formatTime(),
        },
      ])
    }, 600)
    replyTimers.current.push(timer)
  }

  return (
    <section className="flex w-full items-center justify-center bg-background px-6 py-12 text-foreground">
      <MessageScrollerProvider autoScroll defaultScrollPosition="end">
        <Card className="w-full max-w-xl border border-border shadow-sm">
          <CardHeader className="px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Bot className="size-4" aria-hidden="true" />
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm leading-none font-semibold tracking-tight">
                  Acme AI Assistant
                </span>
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <span className="inline-block size-1.5 bg-primary" />
                  Online, responds instantly
                </span>
              </div>
              <Badge variant="outline" className="ml-auto gap-1">
                <Sparkles className="size-3" aria-hidden="true" />
                GPT-4o
              </Badge>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="flex min-h-0 flex-1 flex-col p-0">
            <MessageScroller className="min-h-0 flex-1">
              <MessageScrollerViewport>
                <MessageScrollerContent className="justify-end gap-5 px-4 py-4">
                  {messages.map((msg) => (
                    <MessageScrollerItem
                      key={msg.id}
                      messageId={String(msg.id)}
                      scrollAnchor={msg.role === "user"}
                    >
                      <Message align={msg.role === "user" ? "end" : "start"}>
                        <MessageAvatar>
                          <Avatar className="size-7 border border-border">
                            {msg.role === "user" ? (
                              <>
                                <AvatarImage
                                  src={userAvatar}
                                  alt={userName}
                                  className=""
                                />
                                <AvatarFallback className="text-[10px] font-medium">
                                  JD
                                </AvatarFallback>
                              </>
                            ) : (
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                <Sparkles className="size-4" aria-hidden="true" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                        </MessageAvatar>
                        <MessageContent>
                          <Bubble
                            variant={msg.role === "user" ? "default" : "muted"}
                          >
                            <BubbleContent className="whitespace-pre-line">
                              {msg.content}
                            </BubbleContent>
                          </Bubble>
                          <MessageFooter className="tabular-nums">
                            {msg.time}
                          </MessageFooter>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  ))}
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          </CardContent>

          <CardFooter className="px-4 py-3">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                send()
              }}
              className="flex w-full items-center gap-2"
            >
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type a message…"
                aria-label="Message"
                className="h-8 flex-1 text-xs"
              />
              <Button
                type="submit"
                size="icon"
                className="size-8 shrink-0"
                aria-label="Send message"
                disabled={!draft.trim()}
              >
                <Send className="size-3.5" aria-hidden="true" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </MessageScrollerProvider>
    </section>
  )
}
