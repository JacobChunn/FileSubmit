"use client"
import { useContext } from "react"
import { ExpenseDetailsExtended, TimesheetDetails, TimesheetDetailsExtended } from "@/app/lib/definitions"
import { ApprovalContext } from "../approval-context-wrapper"
import ExpenseDetailsStateIndicator from "./details-state-indicator"
import SignExpenseToggleButton from "./sign-expense-toggle-button"
import ApproveExpenseToggleButton from "./approval-expense-toggle-button"

export default function ExpenseDetailsHeader({
	children
}: {
	children?: React.ReactNode
}) {
	const context = useContext(ApprovalContext)

	if (context == null) {
		throw new Error(
			"context has to be used within <ApprovalContext.Provider>"
		);
	}

	const expenseID = context.selectedSubordinate ? context.selectedSubordinate[2] : null;

	if (expenseID == null) {
		throw new Error(
			"selectedExpense of ApprovalContext has not been set!"
		);
	}

	if (context.localSubordinateExpenses == null) {
		throw new Error(
			"expenses of ApprovalContext has not been set!"
		);
	}

	const canAddEXD = context.subordinateDetailsState == "saved" || 
		context.subordinateDetailsState == "unsaved" || 
		context.subordinateDetailsState == "signed";

		const addEXD = () => {
			const currentEXDs = context.localSubordinateDetails as ExpenseDetailsExtended[] || [];
			const newEXD: ExpenseDetailsExtended = {
				id: 0,
				expenseid: 0,
				employeeid: -1,
				jobid: 0,
				day: 1,
				purpose: null,
				transportwhere: null,
				transportation: 0,
				lodging: 0,
				cabsparking: 0,
				carrental: 0,
				miles: 0,
				mileage: null,
				perdiem: null,
				entertainment: 0,
				miscid: 0,
				miscvalue: 0,
				total: null,
				miscdetail: null,
				entlocation: null,
				entactivity: null,
				entwho: null,
				entpurpose: null,
			}
			context.setLocalSubordinateDetails([...currentEXDs, newEXD]);
		}

	return (
		<div className="w-full h-16">
			<div className="flex justify-between pb-2">
				<ExpenseDetailsStateIndicator/>
				<div className="flex items-center space-x-1">
					<SignExpenseToggleButton/>
					<ApproveExpenseToggleButton/>
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