import { IconPlaceholder } from "@/components/icon-placeholder"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DecorIcon } from "@/components/decor-icon";

export function PricingSection() {
	return (
		<section className="w-full space-y-5">
			<div className="mx-auto max-w-lg">
				<div className="flex justify-center">
					<div className="rounded-md border px-4 py-1 text-sm">Pricing</div>
				</div>
				<h2 className="mt-4 text-center font-bold text-3xl tracking-tight md:text-4xl">
					Pricing Based on Your Success
				</h2>
				<p className="mt-2 text-center text-muted-foreground text-sm md:text-base">
					We offer a single price for all our services. We believe that pricing
					is a critical component of any successful business.
				</p>
			</div>

			<div className="mx-auto w-full max-w-[880px] space-y-2">
				<div className="relative grid border bg-background p-4 shadow-xs md:grid-cols-2">
					<DecorIcon className="size-3" position="top-left" />
					<DecorIcon className="size-3" position="top-right" />
					<DecorIcon className="size-3" position="bottom-left" />
					<DecorIcon className="size-3" position="bottom-right" />

					<div className="w-full px-4 pt-5 pb-4">
						<div className="space-y-1">
							<div className="flex items-center justify-between">
								<h3 className="font-semibold leading-none">Monthly</h3>
								<div className="flex items-center gap-x-1">
									<span className="text-muted-foreground text-sm line-through">
										$8.99
									</span>
									<Badge variant="secondary">11% off</Badge>
								</div>
							</div>
							<p className="text-muted-foreground text-sm">
								Best value for growing businesses!
							</p>
						</div>
						<div className="mt-10 space-y-4">
							<div className="flex items-end gap-0.5 text-muted-foreground text-xl">
								<span>$</span>
								<span className="-mb-0.5 font-extrabold text-4xl text-foreground tracking-tighter md:text-4xl">
									7.99
								</span>
								<span>/month</span>
							</div>
							<Button className="w-full" variant="outline">
								<a href="#">Start Your Journey</a>
							</Button>
						</div>
					</div>
					<div className="relative w-full rounded-md border bg-card p-4 shadow dark:bg-card/80">
						<div className="space-y-1">
							<div className="flex items-center justify-between">
								<h3 className="font-semibold leading-none">Yearly</h3>
								<div className="flex items-center gap-x-1">
									<span className="text-muted-foreground text-sm line-through">
										$8.99
									</span>
									<Badge>22% off</Badge>
								</div>
							</div>
							<p className="text-muted-foreground text-sm">
								Unlock savings with an annual commitment!
							</p>
						</div>
						<div className="mt-10 space-y-4">
							<div className="flex items-end text-muted-foreground text-xl">
								<span>$</span>
								<span className="-mb-0.5 font-extrabold text-4xl text-foreground tracking-tighter md:text-4xl">
									6.99
								</span>
								<span>/month</span>
							</div>
							<Button className="w-full">
								<a href="#">Get Started Now</a>
							</Button>
						</div>
					</div>
				</div>

				<div className="flex items-center justify-center gap-x-2 text-muted-foreground text-sm">
					<IconPlaceholder
						className="size-4"
						hugeicons="SecurityCheckIcon"
						lucide="ShieldCheckIcon"
						phosphor="ShieldCheckIcon"
						remixicon="RiShieldCheckLine"
						tabler="IconShieldCheck"
					/>
					<span>Access to all features with no hidden fees</span>
				</div>
			</div>
		</section>
	);
}
