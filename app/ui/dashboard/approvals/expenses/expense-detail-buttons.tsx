"use client"

import { useContext, useEffect, useRef } from "react";
import { Expense, ExpenseDetailsExtended, SubordinateExpense } from "@/app/lib/definitions";
import { assert } from "console";
import { ApprovalContext } from "../approval-context-wrapper";

export type Props = {
	submitDisabled: boolean,
	mileage: number,
	perdiem: number
}

export default function ExpenseDetailButtons({
	submitDisabled,
	mileage,
	perdiem
}: Props
) {
	const context = useContext(ApprovalContext);

	if (context == null) {
		throw new Error(
			"context has to be used within <ApprovalContext.Provider>"
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
		context.setLocalSubordinateDetails(null);
		context.setSelectedSubordinate(null);
		context.setSubordinateDetailsState(null);
		context.setSelectedExpenseDetails(null);
	}

	const setExpenses = (): SubordinateExpense[] | null => {
		if (!context.localSubordinateExpenses || !context.selectedSubordinate || !context.localSubordinateDetails) return null;
			
		const updatedExpenses = [...context.localSubordinateExpenses];
		const selectedSubordinate = context.selectedSubordinate[2];
		const selectedExpense = updatedExpenses.find(timesheet => timesheet.id === selectedSubordinate);
		if (!selectedExpense) return null;

		const localEXDs = context.localSubordinateDetails as ExpenseDetailsExtended[];

		let totalexpenses = 0.0;

		localEXDs.forEach(EXD => {
			totalexpenses += (Number(EXD.transportation) + Number(EXD.lodging) + Number(EXD.cabsparking) + Number(EXD.carrental) + (Number(EXD.miles) * Number(mileage)) + Number(perdiem) + Number(EXD.entertainment) + Number(EXD.miscvalue));
			
		});

		selectedExpense.totalexpenses = totalexpenses;

		return updatedExpenses;
	}

	const handleSubmitOnClick = () => {
		const newExpenses = setExpenses();
		context.setLocalSubordinateExpenses(newExpenses);
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