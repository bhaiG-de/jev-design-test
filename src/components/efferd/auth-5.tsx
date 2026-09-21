"use client";
import { IconPlaceholder } from "@/components/icon-placeholder"

import { AppleIcon } from "@/components/icons/apple-icon";
import { GithubIcon } from "@/components/icons/github-icon";
import { GoogleIcon } from "@/components/icons/google-icon";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { AuthDivider } from "@/components/auth-divider";
import { FloatingPaths } from "@/components/floating-paths";

export function AuthPage() {
	return (
		<section className="flex w-full items-center justify-center bg-background px-6 py-10">
			<div className="mx-auto grid w-full max-w-[940px] overflow-hidden rounded-xl border border-border bg-card shadow-sm md:grid-cols-2 md:items-stretch">
				<div className="relative hidden flex-col justify-between bg-muted p-10 md:flex">
					<div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-muted" />
					<Logo className="z-10 mr-auto h-4.5" />

					<div className="z-10 mt-auto">
						<blockquote className="space-y-2">
							<p className="text-xl">
								&ldquo;This Platform has helped me to save time and serve my
								clients faster than ever before.&rdquo;
							</p>
							<footer className="font-mono font-semibold text-sm">
								~ Ali Hassan
							</footer>
						</blockquote>
					</div>
					<div className="absolute inset-0">
						<FloatingPaths position={1} />
						<FloatingPaths position={-1} />
					</div>
				</div>

				<div className="flex flex-col justify-center gap-4 p-8 md:p-10">
					<div className="flex items-center justify-between">
						<Logo className="h-4.5 md:hidden" />
						<a
							className="ml-auto inline-flex items-center text-xs text-muted-foreground hover:text-foreground"
							href="#"
						>
							<IconPlaceholder
								data-icon="inline-start"
								hugeicons="ArrowLeft01Icon"
								lucide="ChevronLeftIcon"
								phosphor="CaretLeftIcon"
								remixicon="RiArrowLeftSLine"
								tabler="IconChevronLeft"
							/>
							Home
						</a>
					</div>

					<div className="flex flex-col space-y-1">
						<h1 className="font-bold text-2xl tracking-wide">
							Sign In or Join Now!
						</h1>
						<p className="text-base text-muted-foreground">
							login or create your efferd account.
						</p>
					</div>
					<div className="space-y-2">
						<Button className="w-full">
							<GoogleIcon data-icon="inline-start" />
							Continue with Google
						</Button>
						<Button className="w-full">
							<AppleIcon data-icon="inline-start" />
							Continue with Apple
						</Button>
						<Button className="w-full">
							<GithubIcon data-icon="inline-start" />
							Continue with GitHub
						</Button>
					</div>

					<AuthDivider>OR</AuthDivider>

					<form className="space-y-2">
						<p className="text-start text-muted-foreground text-xs">
							Enter your email address to sign in or create an account
						</p>
						<InputGroup>
							<InputGroupInput
								placeholder="your.email@example.com"
								type="email"
							/>
							<InputGroupAddon align="inline-start">
								<IconPlaceholder
									hugeicons="AtIcon"
									lucide="AtSignIcon"
									phosphor="AtIcon"
									remixicon="RiAtLine"
									tabler="IconAt"
								/>
							</InputGroupAddon>
						</InputGroup>

						<Button className="w-full" type="button">
							Continue With Email
						</Button>
					</form>
					<p className="text-muted-foreground text-sm">
						By clicking continue, you agree to our{" "}
						<a
							className="underline underline-offset-4 hover:text-primary"
							href="#"
						>
							Terms of Service
						</a>{" "}
						and{" "}
						<a
							className="underline underline-offset-4 hover:text-primary"
							href="#"
						>
							Privacy Policy
						</a>
						.
					</p>
				</div>
			</div>
		</section>
	);
}
