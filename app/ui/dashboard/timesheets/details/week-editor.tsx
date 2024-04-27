"use client"
import { useContext } from "react";
import { TimesheetContext } from "../timesheet-context-wrapper";
import { DateTime } from "luxon";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";


export default function WeekEditor2({
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

	if (!context.selectedTimesheetWeekEnding) {
		throw new Error(
			"selectedTimesheetWeekEnding was not initialized properly"
		);
	}

	const dateString = "Thu Nov 01 2001 00:00:00 GMT-0500 (Eastern Standard Time)";
	const jsDate = new Date(dateString);
	const luxonDateTime = DateTime.fromJSDate(jsDate);
	
	const formattedDate = luxonDateTime.toLocaleString()

	return (
		<div className="flex items-center justify-center">
			<button className="bg-white p-2 rounded-2xl transition-colors duration-150 hover:bg-blue-gray-50 focus-visible:bg-blue-gray-50 active:bg-blue-gray-100">
				<MinusIcon className="w-4 h-4"/>
			</button>	
			<div className="flex items-center justify-center h-8 px-2 rounded-2xl border border-black bg-blue-gray-50 ">
				{formattedDate}
			</div>
			<button className="bg-white p-2 rounded-2xl transition-colors duration-150 hover:bg-blue-gray-50 focus-visible:bg-blue-gray-50 active:bg-blue-gray-100">
				<PlusIcon className="w-4 h-4"/>
			</button>
		</div>
	)		
}