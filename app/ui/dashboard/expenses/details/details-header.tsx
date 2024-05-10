"use client"
import { useContext } from "react"
import { ExpenseContext } from "../expense-context-wrapper";
import { ExpenseDetails } from "@/app/lib/definitions";
import ExpenseDetailsStateIndicator from "./details-state-indicator";
import MonthEditor from "./month-editor";
import SignExpenseToggleButton from "./sign-expense-toggle-button";

export default function ExpenseDetailsHeader({
	children
}: {
	children?: React.ReactNode
}) {
	const context = useContext(ExpenseContext)

	if (context == null) {
		throw new Error(
			"context has to be used within <ExpenseContext.Provider>"
		);
	}

	const expenseID = context.selectedExpense;

	if (expenseID == null) {
		throw new Error(
			"selectedExpense of ExpenseContext has not been set!"
		);
	}

	if (context.localExpenses == null) {
		throw new Error(
			"expenses of ExpenseContext has not been set!"
		);
	}

	const canAddEXD = context.expenseDetailsState == "saved" || context.expenseDetailsState == "unsaved";

	const addEXD = () => {
		const currentEXDs = context.localExpenseDetails || [];
		const newEXD: ExpenseDetails = {
            id: 0,
            expenseid: 0,
            employeeid: -1,
            jobid: 0,
            purpose: null,
            transportwhere: null,
            transportation: null,
            lodging: null,
            cabsparking: null,
            carrental: null,
            miles: null,
            mileage: null,
            perdiem: null,
            entertainment: null,
            miscid: 0,
            miscvalue: null,
            total: null,
            miscdetail: null,
            entlocation: null,
            entactivity: null,
            entwho: null,
            entpurpose: null,
		}
		context.setLocalExpenseDetails([...currentEXDs, newEXD]);
	}

	return (
		<div className="w-full h-full">
			<div className="flex justify-between pb-2">
				<ExpenseDetailsStateIndicator/>
				<MonthEditor/>
				<div className="flex items-center space-x-1">
					<SignExpenseToggleButton/>
					<div className="w-2"/>
					<button
						className={`flex h-10 items-center rounded-lg px-4 text-sm font-medium text-white transition-colors
						${canAddEXD ? 'bg-blue-500 hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600' : 'bg-gray-400 cursor-not-allowed opacity-50'}`}
						onClick={addEXD}
					>
						Add Row
					</button>
				</div>
			</div>
			{children}
		</div>
	)

}