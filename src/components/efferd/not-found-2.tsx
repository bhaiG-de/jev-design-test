import { IconPlaceholder } from "@/components/icon-placeholder"
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/components/ui/empty";

export function NotFoundPage() {
	return (
		<div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
			<div className="rounded-2xl bg-card p-8">
				<Empty>
					<EmptyHeader>
						<EmptyTitle className="mask-b-from-20% mask-b-to-80% font-extrabold text-9xl">
							404
						</EmptyTitle>
						<EmptyDescription className="-mt-8 text-nowrap">
							The page you're looking for might have been <br />
							moved or doesn't exist.
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<div className="flex gap-2">
							<Button render={<a href="#" />} nativeButton={false}>
								<IconPlaceholder
									data-icon="inline-start"
									hugeicons="Home01Icon"
									lucide="HomeIcon"
									phosphor="HouseIcon"
									remixicon="RiHomeLine"
									tabler="IconHome"
								/>
								Go Home
							</Button>

							<Button variant="outline" render={<a href="#" />} nativeButton={false}>
								<IconPlaceholder
									data-icon="inline-start"
									hugeicons="CompassIcon"
									lucide="CompassIcon"
									phosphor="CompassIcon"
									remixicon="RiCompassLine"
									tabler="IconCompass"
								/>
								Explore
							</Button>
						</div>
					</EmptyContent>
				</Empty>
			</div>
		</div>
	);
}
