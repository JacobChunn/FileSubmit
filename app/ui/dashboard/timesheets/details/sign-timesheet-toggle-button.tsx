"use client"

import { useContext } from "react";
import { TimesheetContext } from "../timesheet-context-wrapper";
import { toggleTimesheetSignedValue } from "@/app/lib/actions";

export default function SignTimesheetToggleButton({

}: {

}) {
	const context = useContext(TimesheetContext);

	if (context == null) {
		throw new Error(
			"context has to be used within <TimesheetContext.Provider>"
		);
	}

	const toggleTimesheetSigned = async () => {
		if (context.selectedTimesheet == null) return;

		try {
			await toggleTimesheetSignedValue(context.selectedTimesheet);
			context.setTimesheets(prev => {
				if (!prev || !context.selectedTimesheet) return null;

				const updatedTimesheets = [...prev];

				console.log("prevTSs", prev);
				console.log("selectedTSNumber", context.selectedTimesheet);

				const selectedTimesheet = updatedTimesheets.find(timesheet => timesheet.id === context.selectedTimesheet);
				if (!selectedTimesheet) return null;
				console.log("selectedTS", selectedTimesheet);

				selectedTimesheet.usercommitted = !selectedTimesheet.usercommitted;
				
				console.log("updatedTSs", updatedTimesheets);

				return updatedTimesheets;
			})

			
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<button
			className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
			onClick={toggleTimesheetSigned}
		>
			Sign Timesheet
		</button>
	)
}