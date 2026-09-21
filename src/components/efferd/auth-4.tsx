import { IconPlaceholder } from "@/components/icon-placeholder"
import { GoogleIcon } from "@/components/icons/google-icon";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { AuthDivider } from "@/components/auth-divider";

export function AuthPage() {
	return (
		<div className="relative w-full overflow-hidden px-4">
			<div className="relative mx-auto flex w-full max-w-md flex-col justify-center gap-6 rounded-xl border bg-card p-6 shadow-sm md:p-8">
				<div className="flex flex-col space-y-6">
					<a aria-label="Home" className="" href="#">
						<Logo className="h-4.5" />
					</a>
					<div className="space-y-1">
						<h1 className="font-semibold text-xl tracking-wide">
							Hey, welcome!
						</h1>
						<p className="text-base text-muted-foreground">
							Log in or sign up. It only takes a moment.
						</p>
					</div>
				</div>

				<div className="relative flex size-full flex-col gap-4">
					<Button className="w-full" type="button" variant="outline">
						<GoogleIcon data-icon="inline-start" />
						Continue with Google
					</Button>
					<AuthDivider>OR CONTINUE WITH EMAIL</AuthDivider>
					<form className="space-y-2">
						<InputGroup>
							<InputGroupInput
								aria-label="Email address"
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

						<Button className="w-full" size="sm" type="submit">
							Continue With Email
						</Button>
					</form>
				</div>

				<p className="text-center text-muted-foreground text-sm">
					This site is protected by reCAPTCHA and the Google{" "}
					<a
						className="underline underline-offset-4 hover:text-primary"
						href="#"
					>
						Privacy Policy
					</a>{" "}
					and{" "}
					<a
						className="underline underline-offset-4 hover:text-primary"
						href="#"
					>
						Terms of Service
					</a>{" "}
					apply.
				</p>
			</div>
		</div>
	);
}
