"use client"

import { useContext, useEffect, useRef } from "react";
import { ExpenseContext } from "../expense-context-wrapper";
import { Expense } from "@/app/lib/definitions";
import { assert } from "console";

export type Props = {
	submitDisabled: boolean,
	mileage: number,
	perdiem: number
}

export default function FormSubmitDetailsButton({
	submitDisabled,
	mileage,
	perdiem
}: Props
) {
	const context = useContext(ExpenseContext);

	if (context == null) {
		throw new Error(
			"context has to be used within <ExpenseContext.Provider>"
		);
	}

	const buttonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const input = buttonRef.current;
	
		if (input == null) throw new Error('Expense Form Submit button was not found');
	
		const handleKeyPress = (event: KeyboardEvent) => {
		  if (event.key === "Enter") {
			event.preventDefault();
			input.click();
		  }
		};
	
		document.addEventListener("keypress", handleKeyPress);
	
		// Cleanup event listener on component unmount
		return () => {
		  document.removeEventListener("keypress", handleKeyPress);
		};
	  }, []);

	const handleCloseOnClick = () => {
		context.setLocalExpenseDetails(null);
		context.setSelectedExpense(null);
		context.setLocalExpenseDateStart(null);
		context.setDatabaseExpenseDateStart(null);
		context.setExpenseDetailsState(null);
	}

	const setExpenses = (prev: Expense[] | null) => {
		if (!prev || !context.selectedExpense || !context.localExpenseDetails) return null;
			
		const updatedExpenses = [...prev];
		const selectedExpense = updatedExpenses.find(timesheet => timesheet.id === context.selectedExpense);
		if (!selectedExpense) return null;

		const localEXDs = context.localExpenseDetails;

		let totalexpenses = 0.0;

		localEXDs.forEach(EXD => {
			totalexpenses += (Number(EXD.transportation) + Number(EXD.lodging) + Number(EXD.cabsparking) + Number(EXD.carrental) + (Number(EXD.miles) * Number(mileage)) + Number(perdiem) + Number(EXD.entertainment) + Number(EXD.miscvalue));
			
		});

		selectedExpense.totalexpenses = totalexpenses;

		return updatedExpenses;
	}

	const handleSubmitOnClick = () => {
		context.setLocalExpenses(setExpenses);
	}

	return (
		<div className="mt-6 flex justify-end gap-4">
			<button
				className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
				onClick={handleCloseOnClick}
			>
				Close
			</button>
			<button 
				type="submit"
				ref={buttonRef}
				className={`flex h-10 items-center rounded-lg px-4 text-sm font-medium text-white transition-colors
					${submitDisabled ? 'bg-gray-400 cursor-not-allowed opacity-50' : 'bg-blue-500 hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600'}`}
				onClick={handleSubmitOnClick}
				disabled={submitDisabled}
			>
				Save
			</button>
		</div>
	)
}