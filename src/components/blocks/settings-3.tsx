import { useState } from "react"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Toaster } from "@/components/ui/sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, CreditCard, Mail, User } from "lucide-react"

const teamMembers = [
  {
    name: "Ada Lovelace",
    email: "ada@acme.com",
    initials: "AL",
    avatar: "/pravatar/150?img=47",
    role: "Owner",
    roleVariant: "default" as const,
  },
  {
    name: "Grace Hopper",
    email: "grace@acme.com",
    initials: "GH",
    avatar: "/pravatar/150?img=45",
    role: "Admin",
    roleVariant: "secondary" as const,
  },
  {
    name: "Alan Turing",
    email: "alan@acme.com",
    initials: "AT",
    avatar: "/pravatar/150?img=12",
    role: "Member",
    roleVariant: "outline" as const,
  },
  {
    name: "Katherine Johnson",
    email: "katherine@acme.com",
    initials: "KJ",
    avatar: "/pravatar/150?img=49",
    role: "Member",
    roleVariant: "outline" as const,
  },
]

const planFeatures = [
  "Unlimited projects",
  "Priority support",
  "Advanced analytics",
]

export default function SettingsBlock() {
  const [marketingEmails, setMarketingEmails] = useState(true)
  const [fullName, setFullName] = useState("Ada Lovelace")
  const [email, setEmail] = useState("ada@acme.com")

  function saveChanges() {
    toast.success("Profile saved", {
      id: "profile-saved",
      description: "Your account details have been updated.",
    })
  }

  function inviteMember() {
    toast.success("Invitation sent", {
      id: "invitation-sent",
      description: "We emailed an invite to join the Acme workspace.",
    })
  }

  function changePlan() {
    toast("Plans available", {
      id: "plans-available",
      description: "Compare plans and pick the one that fits your team.",
    })
  }

  function cancelSubscription() {
    toast.error("Subscription canceled", {
      id: "subscription-canceled",
      description: "Your Pro plan stays active until Jan 1, 2027.",
    })
  }

  function updatePayment() {
    toast.success("Payment method updated", {
      id: "payment-updated",
      description: "Future charges will use your new card.",
    })
  }

  return (
    <section className="flex min-h-svh w-full justify-center bg-muted/30 px-6 py-16 text-foreground">
      {/* Extra wrapper: the shell's `.block-reset` strips max-width off this
          section's direct child and grandchild, so the real max-w-3xl column
          lives one level deeper, where the reset doesn't reach. */}
      <div className="flex w-full justify-center">
      <div className="flex w-full max-w-3xl flex-col gap-8">
        <header className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your account, billing, and team for Acme.
          </p>
        </header>

        <Tabs defaultValue="account" className="gap-6">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  Update your personal details and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <Field>
                  <FieldLabel htmlFor="full-name">Full name</FieldLabel>
                  <Input
                    id="full-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="email">Email address</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@acme.com"
                  />
                  <FieldDescription>
                    Used for sign-in and account notices.
                  </FieldDescription>
                </Field>

                <Separator />

                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldLabel htmlFor="marketing-emails">
                      Marketing emails
                    </FieldLabel>
                    <FieldDescription>
                      Receive product news and occasional offers.
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    id="marketing-emails"
                    checked={marketingEmails}
                    onCheckedChange={setMarketingEmails}
                  />
                </Field>

                <div className="flex justify-end">
                  <Button onClick={saveChanges}>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <CardTitle>Pro plan</CardTitle>
                      <CardDescription>
                        Billed annually, renews Jan 1, 2027.
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">
                      <Check data-icon="inline-start" />
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold tracking-tight">
                      $24
                    </span>
                    <span className="text-sm text-muted-foreground">
                      / month
                    </span>
                  </div>

                  <ul className="flex flex-col gap-2">
                    {planFeatures.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="flex size-5 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <Check className="size-3.5" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" onClick={changePlan}>
                      Change Plan
                    </Button>
                    <Button variant="ghost" onClick={cancelSubscription}>
                      Cancel Subscription
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment method</CardTitle>
                  <CardDescription>
                    The card charged for your subscription.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
                        <CreditCard className="size-5" />
                      </span>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          Visa ending in 4242
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Expires 08 / 2028
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={updatePayment}>
                      Update
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="team">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <CardTitle>Team members</CardTitle>
                    <CardDescription>
                      People with access to the Acme workspace.
                    </CardDescription>
                  </div>
                  <Button size="sm" onClick={inviteMember}>
                    <Mail data-icon="inline-start" />
                    Invite Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Email
                      </TableHead>
                      <TableHead className="text-right">Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamMembers.map((member) => (
                      <TableRow key={member.email}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="size-8">
                              <AvatarImage
                                src={member.avatar}
                                alt={member.name}
                                className=""
                              />
                              <AvatarFallback className="text-xs">
                                {member.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium">{member.name}</span>
                              <span className="text-xs text-muted-foreground sm:hidden">
                                {member.email}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground sm:table-cell">
                          {member.email}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={member.roleVariant}>
                            {member.role === "Owner" ? (
                              <User data-icon="inline-start" />
                            ) : null}
                            {member.role}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      </div>
      <Toaster />
    </section>
  )
}
