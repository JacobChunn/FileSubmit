"use client"
import { useContext } from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { ApprovalContext } from "./approval-context-wrapper";


export default function DatestartSelector() {
	const context = useContext(ApprovalContext);
	if (context == null) {
		throw new Error(
			"context has to be used within <ApprovalContext.Provider>"
		);
	}

	if (!context.subordinates || !context.expenseDatestart) {
		throw new Error(
			"Subordinate or datestart values were not initialized properly"
		);
	}

	// const dateString = "Thu Nov 01 2001 00:00:00 GMT-0500 (Eastern Standard Time)";
	// const jsDate = new Date(dateString);
	// const luxonDateTime = DateTime.fromJSDate(jsDate);
	const expenseDatestart = context.expenseDatestart;
	// const formattedDate = `${localDT.toFormat('ccc MMM dd yyyy HH:mm:ss')} GMT${localDT.toFormat('ZZZ')} (${localDT.offsetNameLong})`;
	const datestartISO = expenseDatestart.toISO()
	const formattedDate = datestartISO ? datestartISO : "";
	// console.log(formattedDate)

	const handleAddOnClick = (months: number) => {
		let newDatestart;

		newDatestart = context.expenseDatestart?.plus({months: months});
		context.setExpenseDatestart(newDatestart ? newDatestart : null);
	};

	//const savedDateStart = context.databaseExpenseDateStart.equals(context.localExpenseDateStart);
	//const hideButtons = context.expenseDetailsState == "signed";

	return (
		<div className="flex items-center justify-center">
			<button
				className="bg-white p-2 rounded-2xl transition-colors duration-150 hover:bg-blue-gray-50 focus-visible:bg-blue-gray-50 active:bg-blue-gray-100"
				onClick={() => handleAddOnClick(-1)}
				//hidden={hideButtons}
			>
				<MinusIcon className="w-4 h-4"/>
			</button>	
			<input
				//form={"form"+context.selectedExpense}
				id="dateStart"
				name="dateStart"
				type="text"
				value={formattedDate}
				readOnly
				hidden
			/>
			<div
				className={`flex items-center justify-center w-28 h-8 px-2 rounded-2xl border border-black bg-blue-gray-50`}
			>
				{expenseDatestart.toLocaleString()}
			</div>
			<button 
				className="bg-white p-2 rounded-2xl transition-colors duration-150 hover:bg-blue-gray-50 focus-visible:bg-blue-gray-50 active:bg-blue-gray-100"
				onClick={() => handleAddOnClick(1)}
				//hidden={hideButtons}
			>
				<PlusIcon className="w-4 h-4"/>
			</button>
		</div>
	)		
}