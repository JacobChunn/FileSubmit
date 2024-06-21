"use client"
import { useContext } from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { ExpenseContext } from "../expense-context-wrapper";


export default function DaySelector({
	index
}: {
	index: number
}) {
	const context = useContext(ExpenseContext);
	if (context == null) {
		throw new Error(
			"context has to be used within <ExpenseContext.Provider>"
		);
	}

	if (!context.localExpenseDateStart || !context.databaseExpenseDateStart ||
			!context.localExpenseDetails || !context.databaseExpenseDetails
	) {
		throw new Error(
			"Expense Start Date and Details values were not initialized properly"
		);
	}

	// const dateString = "Thu Nov 01 2001 00:00:00 GMT-0500 (Eastern Standard Time)";
	// const jsDate = new Date(dateString);
	// const luxonDateTime = DateTime.fromJSDate(jsDate);
	const localDT = context.localExpenseDateStart;
	const maxDays = localDT.daysInMonth
	if (!maxDays) {
		throw new Error(
			"Month was not set properly"
		);
	}
	// const formattedDate = `${localDT.toFormat('ccc MMM dd yyyy HH:mm:ss')} GMT${localDT.toFormat('ZZZ')} (${localDT.offsetNameLong})`;
	const localISO = localDT.toISO()
	const formattedDate = localISO ? localISO : "";
	// console.log(formattedDate)

	const handleAddOnClick = (day: number) => {
		context.setLocalExpenseDetails(prev => {
			if (prev === null) return null;
			const updatedEXDs = [...prev];
			const currentDay = updatedEXDs[index]['day']
			const updatedDay = currentDay + day
			const updatedItem = { ...updatedEXDs[index], ['day']: Number(updatedDay < 1 ? 1 : updatedDay > maxDays ? maxDays : updatedDay) };
			updatedEXDs[index] = updatedItem;
			return updatedEXDs;
		  });
	};

	const savedDay = context.databaseExpenseDetails[index] && context.localExpenseDetails[index]['day'] === context.databaseExpenseDetails[index]['day'];
	const hideButtons = context.expenseDetailsState == "signed";

	return (
		<div className="flex items-center justify-center">
			<button
				type="button"
				className="bg-white p-2 rounded-2xl transition-colors duration-150 hover:bg-blue-gray-50 focus-visible:bg-blue-gray-50 active:bg-blue-gray-100"
				onClick={() => handleAddOnClick(-1)}
				hidden={hideButtons}
			>
				<MinusIcon className="w-4 h-4"/>
			</button>	
			<input
				form={"form"+context.selectedExpense}
				id="day"
				name={"EXD" + index + "[day]"}
				type="text"
				value={context.localExpenseDetails[index]['day']}
				readOnly
				hidden
			/>
			<div
				className={`flex items-center justify-center w-10 h-8 px-2 rounded-2xl border border-black ${savedDay ? "bg-blue-gray-50" : "bg-red-300"}`}
			>
				{context.localExpenseDetails[index]['day']}
			</div>
			<button 
				type="button"
				className="bg-white p-2 rounded-2xl transition-colors duration-150 hover:bg-blue-gray-50 focus-visible:bg-blue-gray-50 active:bg-blue-gray-100"
				onClick={() => handleAddOnClick(1)}
				hidden={hideButtons}
			>
				<PlusIcon className="w-4 h-4"/>
			</button>
		</div>
	)		
}