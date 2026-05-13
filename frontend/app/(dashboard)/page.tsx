import { listHouseholds } from "@/lib/api";
import { redirect } from "next/navigation";

export default async function DashboardHomePage() {
	const households = await listHouseholds();
	if (households.length === 0) {
		return (
			<div className="flex flex-1 flex-col gap-2">
				<h1 className="text-2xl font-semibold tracking-tight">Welcome</h1>
				<p className="text-muted-foreground">
					No households found. Create one via the API, then refresh this page.
				</p>
			</div>
		);
	}
	redirect(`/households/${String(households[0]._id)}/expenses`);
}
