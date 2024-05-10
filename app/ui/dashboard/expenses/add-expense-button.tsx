'use client'
import { addEmptyExpense } from "@/app/lib/actions";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import { useContext } from "react";
import { Expense } from "@/app/lib/definitions";
import { ExpenseContext } from "./expense-context-wrapper";

export default function AddExpenseButton({
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
			const res = await addEmptyExpense();
			context.setExpenseIsSaving(false);

			let expenses;
			if (res.success && 
				'id' in res &&
				res.id
			) {
				expenses = context.localExpenses || [];
				const newExpense: Expense = {
                    id: res.id,
                    employeeid: -1,
                    datestart: res.datestart,
                    numdays: res.numdays,
                    usercommitted: false,
                    mgrapproved: false,
                    paid: false,
                    totalexpenses: 0,
                    submittedby: res.submittedby,
                    approvedby: "",
                    processedby: "",
                    datepaid: "",
                    mileagerate: res.mileagerate
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
				<DocumentPlusIcon strokeWidth={2} className="h-4 w-4" />
				Add
			</button>
		</div>
	)
}