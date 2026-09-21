import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
} from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { Send } from "lucide-react"

type Member = { id: string; name: string; avatar: string }

type GroupMessage = {
  id: number
  from: string
  text: string
  time: string
}

const me = "me"

const members: Record<string, Member> = {
  mara: {
    id: "mara",
    name: "Mara Lin",
    avatar: "/pravatar/80?img=32",
  },
  leo: {
    id: "leo",
    name: "Leo Tanaka",
    avatar: "/pravatar/80?img=12",
  },
  owen: {
    id: "owen",
    name: "Owen Reyes",
    avatar: "/pravatar/80?img=53",
  },
}

const memberList = Object.values(members)

const seed: GroupMessage[] = [
  {
    id: 1,
    from: "mara",
    text: "Morning all. Pushed the new empty states to staging.",
    time: "9:31 AM",
  },
  {
    id: 2,
    from: "leo",
    text: "Nice, the illustrations really tie it together.",
    time: "9:33 AM",
  },
  {
    id: 3,
    from: me,
    text: "Agreed. Should we ship it behind the beta flag first?",
    time: "9:35 AM",
  },
  {
    id: 4,
    from: "owen",
    text: "Let's do beta. I'll write the release note this afternoon.",
    time: "9:36 AM",
  },
  {
    id: 5,
    from: "mara",
    text: "Perfect. Thanks team.",
    time: "9:37 AM",
  },
  {
    id: 6,
    from: "leo",
    text: "I'll keep an eye on error rates once it's live.",
    time: "9:40 AM",
  },
  {
    id: 7,
    from: me,
    text: "Sounds good, ping this thread if anything looks off.",
    time: "9:41 AM",
  },
]

export default function ChatBlock() {
  const [messages, setMessages] = React.useState(seed)
  const [draft, setDraft] = React.useState("")
  const nextId = React.useRef(1000)

  const send = (e: React.FormEvent) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    setMessages((prev) => [
      ...prev,
      { id: nextId.current++, from: me, text, time: "Now" },
    ])
    setDraft("")
  }

  return (
    <section className="flex w-full items-center justify-center bg-background px-6 py-16 text-foreground">
      <div className="flex h-[560px] w-full max-w-md flex-col rounded-lg border border-border bg-background">
        <div className="flex items-center justify-between gap-3 border-b border-border p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex -space-x-2">
              {memberList.map((member) => (
                <Avatar
                  key={member.id}
                  className="size-7 ring-2 ring-background"
                >
                  <AvatarImage
                    src={member.avatar}
                    alt={member.name}
                    className=""
                  />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-semibold">
                Design Guild
              </span>
              <span className="text-xs text-muted-foreground">4 Members</span>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-success" />3 Online
          </span>
        </div>

        <MessageScrollerProvider autoScroll defaultScrollPosition="end">
          <MessageScroller className="flex-1">
            <MessageScrollerViewport>
              <MessageScrollerContent className="justify-end gap-3 p-4">
                <div className="flex items-center justify-center">
                  <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    Today
                  </span>
                </div>
                {messages.map((message, index) => {
                  const mine = message.from === me
                  const prev = messages[index - 1]
                  const showMeta = !prev || prev.from !== message.from
                  const member = members[message.from]
                  return (
                    <MessageScrollerItem
                      key={message.id}
                      messageId={String(message.id)}
                      scrollAnchor={mine}
                    >
                      <Message align={mine ? "end" : "start"}>
                        {!mine && (
                          <MessageAvatar>
                            {showMeta ? (
                              <Avatar className="size-8">
                                <AvatarImage
                                  src={member?.avatar}
                                  alt={member?.name}
                                  className=""
                                />
                                <AvatarFallback>
                                  {member?.name[0]}
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              <span className="size-8" aria-hidden="true" />
                            )}
                          </MessageAvatar>
                        )}
                        <MessageContent>
                          {!mine && showMeta && (
                            <MessageHeader>{member?.name}</MessageHeader>
                          )}
                          <Bubble variant={mine ? "default" : "muted"}>
                            <BubbleContent>{message.text}</BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  )
                })}
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
              placeholder="Message Design Guild..."
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
    </section>
  )
}
