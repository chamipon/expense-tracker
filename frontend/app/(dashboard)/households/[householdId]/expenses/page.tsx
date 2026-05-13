import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	ApiError,
	getExpensesByHousehold,
	getHousehold,
} from "@/lib/api";
import type { Expense } from "@/lib/api/types";
import { formatExpenseDate, formatMoney } from "@/lib/format-money";

type PageProps = {
	params: Promise<{ householdId: string }>;
};

export default async function HouseholdExpensesPage({ params }: PageProps) {
	const { householdId } = await params;

	let householdName: string | null = null;
	try {
		const h = await getHousehold(householdId);
		householdName = h.name;
	} catch {
		householdName = null;
	}

	let expenses: Expense[];
	try {
		expenses = await getExpensesByHousehold(householdId);
	} catch (e) {
		const message =
			e instanceof ApiError ? e.message : "Failed to load expenses";
		return (
			<div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
				{message}
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col gap-6">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">Expenses</h1>
				<p className="text-muted-foreground">
					{householdName
						? `Household: ${householdName}`
						: `Household id: ${householdId}`}
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>All expenses</CardTitle>
					<CardDescription>
						{expenses.length === 0
							? "No expenses yet for this household."
							: `${expenses.length} expense${expenses.length === 1 ? "" : "s"} loaded.`}
					</CardDescription>
				</CardHeader>
				<CardContent className="px-0 sm:px-4">
					{expenses.length === 0 ? null : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Date</TableHead>
									<TableHead>Description</TableHead>
									<TableHead>Category</TableHead>
									<TableHead className="text-right">Amount</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{expenses.map((row) => (
									<TableRow key={row._id}>
										<TableCell className="whitespace-nowrap">
											{formatExpenseDate(row.expenseDate)}
										</TableCell>
										<TableCell className="font-medium">
											{row.description}
										</TableCell>
										<TableCell className="text-muted-foreground">
											{row.category ?? "—"}
										</TableCell>
										<TableCell className="text-right tabular-nums">
											{formatMoney(row.amountCents, row.currency)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
