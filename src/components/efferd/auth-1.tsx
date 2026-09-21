import { useEffect, useRef, useState } from "react";
import { IconPlaceholder } from "@/components/icon-placeholder"
import { GithubIcon } from "@/components/icons/github-icon";
import { GoogleIcon } from "@/components/icons/google-icon";
import { Logo } from "@/components/logo";
import { Particles } from "@/components/ui/particles";
import { Button } from "@/components/ui/button";

// Particles only accepts a literal hex color, so the theme's token can't be
// passed directly. Read the browser's own resolved value of a token color
// instead of hand-writing an oklch->hex converter.
function useTokenHexColor(fallback: string) {
	const probeRef = useRef<HTMLSpanElement>(null);
	const [hex, setHex] = useState(fallback);

	useEffect(() => {
		if (!probeRef.current) return;
		const rgb = getComputedStyle(probeRef.current).color.match(/\d+/g);
		if (!rgb) return;
		setHex(
			"#" +
				rgb
					.slice(0, 3)
					.map((n) => Number(n).toString(16).padStart(2, "0"))
					.join(""),
		);
	}, []);

	return { probeRef, hex };
}

export function AuthPage() {
	const { probeRef, hex } = useTokenHexColor("#666666");
	return (
		<div className="relative w-full">
			<span ref={probeRef} className="sr-only text-muted-foreground" aria-hidden="true" />
			<Particles
				className="absolute inset-0"
				color={hex}
				ease={20}
				quantity={120}
			/>
			<div className="relative mx-auto flex max-w-5xl flex-col justify-center px-8">
				<Button className="absolute top-4 left-4" variant="ghost">
					<a href="#">
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
				</Button>

				<div className="mx-auto space-y-4 sm:w-md">
					<Logo className="h-5" />
					<div className="flex flex-col space-y-1">
						<h1 className="font-bold text-2xl tracking-wide">
							Sign In or Join Now!
						</h1>
						<p className="text-base text-muted-foreground">
							login or create your efferd account.
						</p>
					</div>
					<div className="space-y-2">
						<Button className="w-full" type="button">
							<GoogleIcon data-icon="inline-start" />
							Continue with Google
						</Button>
						<Button className="w-full" type="button">
							<GithubIcon data-icon="inline-start" />
							Continue with GitHub
						</Button>
					</div>
					<p className="mt-8 text-muted-foreground text-sm">
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
