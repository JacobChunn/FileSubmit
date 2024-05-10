"use client"

import { useContext } from "react";
import { toggleExpenseSignedValue } from "@/app/lib/actions";
import { Expense, SavingState } from "@/app/lib/definitions";
import { ExpenseContext } from "../expense-context-wrapper";

export default function SignExpenseToggleButton({

}: {

}) {
	const context = useContext(ExpenseContext);

	if (context == null) {
		throw new Error(
			"context has to be used within <ExpenseContext.Provider>"
		);
	}

	const setExpenses = (prev: Expense[] | null) => {
		if (!prev || !context.selectedExpense) return null;

		const updatedExpenses = [...prev];

		const selectedExpense = updatedExpenses.find(expense => expense.id === context.selectedExpense);
		if (!selectedExpense) return null;

		selectedExpense.usercommitted = !selectedExpense.usercommitted;

		return updatedExpenses;
	}

	const toggleExpenseSigned = async () => {
		if (context.selectedExpense == null) return;

		try {
			await toggleExpenseSignedValue(context.selectedExpense);
			context.setLocalExpenses(setExpenses);
			const newTSDState: SavingState = context.expenseDetailsState == "signed" ? "saved" : "signed";
			context.setExpenseDetailsState(newTSDState);
			
		} catch (error) {
			console.error(error);
		}
	}

	const selectedExpense = context.localExpenses?.find(expense => expense.id === context.selectedExpense);
	if (!selectedExpense) return null;

	const isTogglable = context.expenseDetailsState == "saved" || context.expenseDetailsState == "signed";

	return (
		<button
			className={`flex h-10 items-center justify-center w-20 rounded-lg px-4 text-sm font-medium text-white transition-colors
				${isTogglable ? 'bg-blue-500 hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600' : 'bg-gray-400 cursor-not-allowed opacity-50'}`}
			onClick={toggleExpenseSigned}
		>
			{selectedExpense.usercommitted ? 'Unsign' : 'Sign' }
		</button>
	)
}