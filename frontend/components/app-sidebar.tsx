"use client";

import { ChevronDownIcon, HomeIcon, ReceiptIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuGroup,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { ApiError, listHouseholds } from "@/lib/api";
import type { Household } from "@/lib/api/types";

const HOUSEHOLD_EXPENSES_PATH = /^\/households\/([^/]+)\/expenses/;

export function AppSidebar() {
	const pathname = usePathname();
	const router = useRouter();
	const [households, setHouseholds] = useState<Household[]>([]);
	const [loadError, setLoadError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	const householdIdFromRoute = useMemo(() => {
		const m = pathname.match(HOUSEHOLD_EXPENSES_PATH);
		return m?.[1] ?? "";
	}, [pathname]);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const data = await listHouseholds();
				if (!cancelled) {
					setHouseholds(data);
					setLoadError(null);
				}
			} catch (e) {
				if (!cancelled) {
					const msg =
						e instanceof ApiError
							? e.message
							: "Failed to load households";
					setLoadError(msg);
					setHouseholds([]);
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	const selectedHousehold = households.find(
		(h) => String(h._id) === householdIdFromRoute,
	);

	const triggerLabel = loading
		? "Loading…"
		: loadError
			? "Could not load households"
			: (selectedHousehold?.name ?? "Select household");

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader className="border-b border-sidebar-border">
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger
								className={cn(
									"peer/menu-button group/menu-button flex h-12 w-full items-center gap-2 overflow-hidden rounded-md bg-background p-2 text-left text-sm shadow-[0_0_0_1px_var(--sidebar-border)] ring-sidebar-ring outline-hidden transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)] focus-visible:ring-2 data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!",
									"[&_svg]:size-4 [&_svg]:shrink-0",
								)}
							>
								<div className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
									<span className="truncate text-xs font-medium text-muted-foreground">
										Household
									</span>
									<span className="truncate text-sm font-semibold">
										{triggerLabel}
									</span>
								</div>
								<ChevronDownIcon className="size-4 shrink-0 opacity-60" />
							</DropdownMenuTrigger>
							<DropdownMenuContent className="min-w-56">
								<DropdownMenuGroup>
									<DropdownMenuLabel>
										Switch household
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									{households.length === 0 && !loading ? (
										<div className="px-2 py-1.5 text-sm text-muted-foreground">
											No households yet.
										</div>
									) : (
										<DropdownMenuRadioGroup
											value={
												householdIdFromRoute ||
												undefined
											}
											onValueChange={(id) => {
												if (id) {
													router.push(
														`/households/${id}/expenses`,
													);
												}
											}}
										>
											{households.map((h) => (
												<DropdownMenuRadioItem
													key={String(h._id)}
													value={String(h._id)}
												>
													{h.name}
												</DropdownMenuRadioItem>
											))}
										</DropdownMenuRadioGroup>
									)}
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Navigation</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									render={<Link href="/" />}
									isActive={pathname === "/"}
									tooltip="Home"
								>
									<HomeIcon />
									<span>Home</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton
									render={
										<Link
											href={
												householdIdFromRoute
													? `/households/${householdIdFromRoute}/expenses`
													: "/"
											}
										/>
									}
									isActive={HOUSEHOLD_EXPENSES_PATH.test(
										pathname,
									)}
									tooltip="Expenses"
									disabled={!householdIdFromRoute}
								>
									<ReceiptIcon />
									<span>Expenses</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
