import { IconPlaceholder } from "@/components/icon-placeholder"
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/components/ui/empty";
import { FullWidthDivider } from "@/components/full-width-divider";

export function NotFoundPage() {
	return (
		<div className="flex w-full items-center justify-center overflow-hidden">
			<div className="flex h-screen items-center border-x">
				<div>
					<FullWidthDivider />
					<div className="rounded-2xl bg-card p-8">
						<Empty>
							<EmptyHeader>
								<EmptyTitle className="font-black font-mono text-8xl">
									404
								</EmptyTitle>
								<EmptyDescription className="text-nowrap">
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
					<FullWidthDivider />
				</div>
			</div>
		</div>
	);
}
