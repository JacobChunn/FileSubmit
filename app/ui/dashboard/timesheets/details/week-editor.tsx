"use client"
import { useContext } from "react";
import { TimesheetContext } from "../timesheet-context-wrapper";
import { DateTime } from "luxon";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";


export default function WeekEditor({
	children
}: {
	children?: React.ReactNode,
}) {
	const context = useContext(TimesheetContext);
	if (context == null) {
		throw new Error(
			"context has to be used within <TimesheetContext.Provider>"
		);
	}

	if (!context.localTimesheetWeekEnding || !context.databaseTimesheetWeekEnding) {
		throw new Error(
			"Timesheet Week Ending values were not initialized properly"
		);
	}

	// const dateString = "Thu Nov 01 2001 00:00:00 GMT-0500 (Eastern Standard Time)";
	// const jsDate = new Date(dateString);
	// const luxonDateTime = DateTime.fromJSDate(jsDate);
	const localDT = context.localTimesheetWeekEnding;
	// const formattedDate = `${localDT.toFormat('ccc MMM dd yyyy HH:mm:ss')} GMT${localDT.toFormat('ZZZ')} (${localDT.offsetNameLong})`;
	const localISO = localDT.toISO()
	const formattedDate = localISO ? localISO : "";
	// console.log(formattedDate)

	const handleAddOnClick = (days: number) => {
		let newWeekEnding = context.localTimesheetWeekEnding?.plus({days: days});
		context.setLocalTimesheetWeekEnding(newWeekEnding ? newWeekEnding : null);
	}

	const savedWeekEnding = context.databaseTimesheetWeekEnding.equals(context.localTimesheetWeekEnding);
	const hideButtons = context.timesheetDetailsState == "signed";

	return (
		<div className="flex items-center justify-center">
			<button
				className="bg-white p-2 rounded-2xl transition-colors duration-150 hover:bg-blue-gray-50 focus-visible:bg-blue-gray-50 active:bg-blue-gray-100"
				onClick={() => handleAddOnClick(-7)}
				hidden={hideButtons}
			>
				<MinusIcon className="w-4 h-4"/>
			</button>	
			<input
				form={"form"+context.selectedTimesheet}
				id="weekEnding"
				name="weekEnding"
				type="text"
				value={formattedDate}
				readOnly
				hidden
			/>
			<div
				className={`flex items-center justify-center w-28 h-8 px-2 rounded-2xl border border-black ${savedWeekEnding ? "bg-blue-gray-50" : "bg-red-300"}`}
			>
				{localDT.toLocaleString()}
			</div>
			<button 
				className="bg-white p-2 rounded-2xl transition-colors duration-150 hover:bg-blue-gray-50 focus-visible:bg-blue-gray-50 active:bg-blue-gray-100"
				onClick={() => handleAddOnClick(7)}
				hidden={hideButtons}
			>
				<PlusIcon className="w-4 h-4"/>
			</button>
		</div>
	)		
}