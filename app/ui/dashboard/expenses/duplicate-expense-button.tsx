'use client'
import { duplicateExpense } from "@/app/lib/actions";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { useContext } from "react";
import { ExpenseContext } from "./expense-context-wrapper";
import { Expense } from "@/app/lib/definitions";

export default function DuplicateExpenseButton({
	className = "",
}: {
	className?: string,
}) {
	const context = useContext(ExpenseContext);

	if (context == null) {
		throw new Error(
			"context has to be used within <ExpenseContext.Provider>"
		);
	}

	const handleOnClick = () => {
		const addExpense = async () => {
			context.setExpenseIsSaving(true);
			const res = await duplicateExpense();
			context.setExpenseIsSaving(false);

			let expenses;
			if (res.success && 'id' in res && res.id) {
				expenses = context.localExpenses || [];
				const newExpense: Expense = {
					id: res.id,
					employeeid: 0,
					datestart: res.datestart,
					numdays: res.numdays, // change x
					usercommitted: false,
					mgrapproved: false,
					paid: false,
					totalexpenses: res.totalexpenses, // change x
					submittedby: res.submittedby, // change x
					approvedby: null,
					processedby: null,
					datepaid: null,
					mileagerate: res.mileagerate // change x
				}

				expenses = [newExpense, ...expenses]
			} else {
				expenses = context.localExpenses;
			}

			context.setLocalExpenses(expenses);
		}

		addExpense();
	}

	return (
		<div className={className}>
			<button
				className={`flex h-10 items-center justify-center gap-3 rounded-lg px-4 text-sm font-medium text-white transition-colors
					${!context.expenseIsSaving ? 'bg-blue-500 hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600' : 'bg-gray-400 cursor-not-allowed opacity-50'}`}
				onClick={handleOnClick}
			>
				<DocumentDuplicateIcon strokeWidth={2} className="h-4 w-4" />
				Duplicate
			</button>
		</div>
	)
}