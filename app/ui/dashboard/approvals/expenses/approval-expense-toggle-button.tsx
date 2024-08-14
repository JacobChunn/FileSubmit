"use client"

import { useContext } from "react";
import { managerToggleExpenseApprovedValue, managerToggleExpenseSignedValue } from "@/app/lib/actions";
import { Expense, SavingState, SubordinateExpense } from "@/app/lib/definitions";
import { ApprovalContext } from "../approval-context-wrapper";

export default function ApproveExpenseToggleButton({

}: {

}) {
	const context = useContext(ApprovalContext);

	if (context == null) {
		throw new Error(
			"context has to be used within <ApprovalContext.Provider>"
		);
	}

	if (!context.selectedSubordinate) {
		throw new Error(
			"selectedSubordinate was not set!"
		);
	}

	const setExpenses = (): SubordinateExpense[] | null => {
		if (!context.localSubordinateExpenses || !context.selectedSubordinate) return null;

		const updatedExpenses = [...context.localSubordinateExpenses];

		const selectedSubordinate = context.selectedSubordinate[2]
		const selectedExpense = updatedExpenses.find(expense => expense.id === selectedSubordinate);
		if (!selectedExpense) return null;

		selectedExpense.mgrapproved = !selectedExpense.mgrapproved;

		return updatedExpenses;
	}

	const toggleExpenseSigned = async () => {
		if (context.selectedSubordinate == null) return;

		try {
			await managerToggleExpenseApprovedValue(context.selectedSubordinate[0], context.selectedSubordinate[2]);
			const newExpenses = setExpenses();
			context.setLocalSubordinateExpenses(newExpenses);
			const newTSDState: SavingState = context.subordinateDetailsState == "approved" ? "signed" : "approved";
			context.setSubordinateDetailsState(newTSDState);
			
		} catch (error) {
			console.error(error);
		}
	}
	const selectedSubordinate = context.selectedSubordinate[2]
	const selectedExpense = context.localSubordinateExpenses?.find(expense => expense.id === selectedSubordinate);
	if (!selectedExpense) return null;

	const isTogglable = context.subordinateDetailsState == "approved" || context.subordinateDetailsState == "signed";

	return (
		<button
			className={`flex h-10 items-center justify-center w-20 rounded-lg px-4 text-sm font-medium text-white transition-colors
				${isTogglable ? 'bg-blue-500 hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600' : 'bg-gray-400 cursor-not-allowed opacity-50'}`}
			onClick={toggleExpenseSigned}
			disabled={!isTogglable}
		>
			{selectedExpense.mgrapproved ? 'Unapprove' : 'Approve' }
		</button>
	)
}