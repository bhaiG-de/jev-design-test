import { IconPlaceholder } from "@/components/icon-placeholder"
import { Button } from "@/components/ui/button";
import { FullWidthDivider } from "@/components/full-width-divider";

type PricingPlan = {
	name: string;
	price: string;
	period?: string;
	description: string;
	href?: string;
	featuresTitle: string;
	features: string[];
	isPopular?: boolean;
};

const pricingPlans: PricingPlan[] = [
	{
		name: "STARTER",
		price: "Free",
		description: "For early-stage startups",
		featuresTitle: "FREE, FOREVER:",
		features: [
			"10 customers",
			"10 documents",
			"10 invoices",
			"Auto-updated taxes",
		],
		href: "#",
	},
	{
		name: "SCALE",
		isPopular: true,
		href: "#",
		price: "$8",
		period: "month",
		description: "For fast-growing teams",
		featuresTitle: "EVERYTHING IN STARTER, PLUS:",
		features: [
			"20 customers",
			"25 documents",
			"30 invoices",
			"Auto-updated taxes",
			"Cloud Sync",
		],
	},
];

export function PricingSection() {
	return (
		<section className="container border-x py-16">
			<div className="relative">
				<FullWidthDivider position="top" />
				<FullWidthDivider position="bottom" />

				<div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
					<div className="flex flex-col bg-background p-8 md:col-span-2">
						<p className="mb-6 text-muted-foreground text-sm uppercase tracking-wider">
							PRICING
						</p>
						<h1 className="font-bold text-3xl leading-tight md:text-5xl">
							Pricing that doesn't suck
						</h1>
					</div>

					{pricingPlans.map((plan) => (
						<PricingCard key={plan.name} plan={plan} />
					))}
				</div>
			</div>
		</section>
	);
}

function PricingCard({ plan }: { plan: PricingPlan }) {
	return (
		<div className="flex flex-col bg-background *:px-4 *:py-6">
			<div className="border-b">
				<p className="mb-6 text-muted-foreground text-sm uppercase tracking-wider">
					{plan.name}
				</p>
				<div className="mb-2 flex items-baseline gap-2">
					<h2 className="font-bold text-4xl">{plan.price}</h2>
					{plan.period && (
						<span className="text-muted-foreground text-xs">
							/ {plan.period}
						</span>
					)}
				</div>
				<p className="mb-8 line-clamp-1 text-muted-foreground">
					{plan.description}
				</p>

				<Button
					className="w-full"
					variant={plan.isPopular ? "default" : "outline"}
				>
					<a href={plan.href}>Get started</a>
				</Button>
			</div>

			<div className="space-y-3 text-muted-foreground text-sm">
				<p className="mb-6 text-xs uppercase">{plan.featuresTitle}</p>

				{plan.features.map((feature) => (
					<p
						className="flex items-center gap-2 text-foreground/80"
						key={feature}
					>
						<IconPlaceholder
							className="size-4"
							hugeicons="Tick02Icon"
							lucide="CheckIcon"
							phosphor="CheckIcon"
							remixicon="RiCheckLine"
							tabler="IconCheck"
						/>
						{feature}
					</p>
				))}
			</div>
		</div>
	);
}
