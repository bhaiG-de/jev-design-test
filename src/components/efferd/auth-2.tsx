import { IconPlaceholder } from "@/components/icon-placeholder"
import { cn } from "@/lib/utils";
import { GithubIcon } from "@/components/icons/github-icon";
import { GoogleIcon } from "@/components/icons/google-icon";
import { Button } from "@/components/ui/button";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { AuthDivider } from "@/components/auth-divider";

export function AuthPage() {
	return (
		<div className="relative flex w-full items-center justify-center overflow-hidden px-6 md:px-8">
			<div
				className={cn(
					"relative flex w-full max-w-md flex-col justify-between rounded-xl border bg-card p-6 shadow-sm md:p-8",
					"dark:bg-[radial-gradient(50%_80%_at_20%_0%,--theme(--color-foreground/.1),transparent)]"
				)}
			>
				<div className="w-full max-w-md animate-in space-y-8">
					<div className="flex flex-col space-y-1">
						<h1 className="font-bold text-2xl tracking-wide">Join Now!</h1>
						<p className="text-base text-muted-foreground">
							Login or create your efferd account.
						</p>
					</div>
					<div className="space-y-4">
						<form className="space-y-2">
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

							<Button className="w-full" size="sm" type="button">
								Continue With Email
							</Button>
						</form>
						<AuthDivider>OR</AuthDivider>
						<div className="grid grid-cols-2 gap-2 space-y-2">
							<Button className="w-full" type="button" variant="outline">
								<GoogleIcon data-icon="inline-start" />
								Google
							</Button>
							<Button className="w-full" type="button" variant="outline">
								<GithubIcon data-icon="inline-start" />
								GitHub
							</Button>
						</div>
					</div>
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
		</div>
	);
}
