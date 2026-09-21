import { useEffect, useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Sparkles, Send } from "lucide-react"

type MessageRole = "user" | "assistant"

interface ChatMessage {
  id: number
  role: MessageRole
  content: string
}

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hi, I'm Acme Copilot. Ask me to draft, summarise, or plan something and I'll get to work.",
  },
  {
    id: 2,
    role: "user",
    content: "What can you help me with on the Acme dashboard?",
  },
  {
    id: 3,
    role: "assistant",
    content:
      "Plenty. I can surface revenue trends, draft customer replies, generate release notes, and explain any metric you click on. Want me to start with a quick weekly summary?",
  },
]

const cannedReplies: string[] = [
  "Got it. Here's a quick take: your weekly active users are up 12% and trial conversion held steady at 4.8%. Want me to break this down by plan tier?",
  "Done. I drafted three subject-line variants and a 90-word body for the launch email, each tuned for a slightly different audience. I can refine the tone if you'd like.",
  "Sure thing. The top driver this week was the Acme Pro upgrade flow (+$18.4k). I can pull the full attribution report whenever you're ready.",
  "Here's a starting outline with five sections and suggested owners. Let me know which part you'd like me to expand first.",
]

const suggestions: string[] = [
  "Summarise This Week",
  "Draft A Launch Email",
  "Explain Churn Rate",
]

export default function AiChatBlock() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [draft, setDraft] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const replyIndex = useRef(0)
  const nextId = useRef(initialMessages.length + 1)
  const replyTimers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const timers = replyTimers.current
    return () => timers.forEach(clearTimeout)
  }, [])

  function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || isTyping) return

    const userMessage: ChatMessage = {
      id: nextId.current++,
      role: "user",
      content: trimmed,
    }
    setMessages((prev) => [...prev, userMessage])
    setDraft("")
    setIsTyping(true)

    const reply = cannedReplies[replyIndex.current % cannedReplies.length]
    replyIndex.current += 1

    const timer = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: nextId.current++, role: "assistant", content: reply },
      ])
      setIsTyping(false)
    }, 1400)
    replyTimers.current.push(timer)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    send(draft)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      send(draft)
    }
  }

  return (
    <section className="flex w-full items-center justify-center bg-muted/30 px-6 py-16 text-foreground">
      <MessageScrollerProvider autoScroll defaultScrollPosition="end">
        <Card className="flex h-[80vh] max-h-[640px] w-full max-w-2xl flex-col overflow-hidden border border-border shadow-sm">
          <CardHeader className="px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Sparkles className="size-5" aria-hidden="true" />
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm leading-none font-semibold tracking-tight">
                  Acme Copilot
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="inline-block size-1.5 rounded-full bg-primary" />
                  {isTyping ? "Typing…" : "Online"}
                </span>
              </div>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="min-h-0 flex-1 overflow-hidden p-0">
            <MessageScroller className="size-full">
              <MessageScrollerViewport>
                <MessageScrollerContent className="justify-end gap-5 px-5 py-5">
                  {messages.map((msg) => (
                    <MessageScrollerItem
                      key={msg.id}
                      messageId={String(msg.id)}
                      scrollAnchor={msg.role === "user"}
                    >
                      <Message align={msg.role === "user" ? "end" : "start"}>
                        <MessageAvatar>
                          <Avatar className="size-8 border border-border">
                            {msg.role === "user" ? (
                              <>
                                <AvatarImage
                                  src="/pravatar/150?img=12"
                                  alt="You"
                                  className=""
                                />
                                <AvatarFallback className="text-xs font-medium">
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
                            <BubbleContent className="text-sm whitespace-pre-line">
                              {msg.content}
                            </BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  ))}

                  {isTyping && (
                    <Message align="start" aria-label="Acme Copilot is typing">
                      <MessageAvatar>
                        <Avatar className="size-8 border border-border">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <Sparkles className="size-4" aria-hidden="true" />
                          </AvatarFallback>
                        </Avatar>
                      </MessageAvatar>
                      <MessageContent>
                        <Bubble variant="muted">
                          <BubbleContent
                            role="status"
                            className="flex items-center gap-1 py-3"
                          >
                            <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                            <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                            <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
                          </BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  )}
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 px-5 py-4">
            <div className="flex w-full flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  disabled={isTyping}
                  className={cn(
                    "rounded-md border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors",
                    "hover:bg-muted hover:text-foreground",
                    "disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex w-full items-end gap-2"
            >
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Message Acme Copilot…"
                aria-label="Message Acme Copilot"
                className="max-h-32 min-h-10 flex-1 resize-none text-sm"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!draft.trim() || isTyping}
                className="size-10 shrink-0"
                aria-label="Send message"
              >
                <Send className="size-4" aria-hidden="true" />
              </Button>
            </form>

            <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Kbd>Enter</Kbd>
                Send
              </span>
              <span className="flex items-center gap-1.5">
                <KbdGroup>
                  <Kbd>Shift</Kbd>
                  <Kbd>Enter</Kbd>
                </KbdGroup>
                New Line
              </span>
            </div>
          </CardFooter>
        </Card>
      </MessageScrollerProvider>
    </section>
  )
}
