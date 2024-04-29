"use client"

import { useContext } from "react";
import { TimesheetContext } from "../timesheet-context-wrapper";
import { toggleTimesheetSignedValue } from "@/app/lib/actions";
import { Timesheet, TimesheetDetailsState } from "@/app/lib/definitions";

export default function SignTimesheetToggleButton({

}: {

}) {
	const context = useContext(TimesheetContext);

	if (context == null) {
		throw new Error(
			"context has to be used within <TimesheetContext.Provider>"
		);
	}

	const setTimesheets = (prev: Timesheet[] | null) => {
		if (!prev || !context.selectedTimesheet) return null;

		const updatedTimesheets = [...prev];

		const selectedTimesheet = updatedTimesheets.find(timesheet => timesheet.id === context.selectedTimesheet);
		if (!selectedTimesheet) return null;

		selectedTimesheet.usercommitted = !selectedTimesheet.usercommitted;

		return updatedTimesheets;
	}

	const toggleTimesheetSigned = async () => {
		if (context.selectedTimesheet == null) return;

		try {
			await toggleTimesheetSignedValue(context.selectedTimesheet);
			context.setLocalTimesheets(setTimesheets);
			context.setDatabaseTimesheets(setTimesheets);
			const newTSDState: TimesheetDetailsState = context.timesheetDetailsState == "signed" ? "saved" : "signed";
			context.setTimesheetDetailsState(newTSDState);
			
		} catch (error) {
			console.error(error);
		}
	}

	const selectedTimesheet = context.databaseTimesheets?.find(timesheet => timesheet.id === context.selectedTimesheet);
	if (!selectedTimesheet) return null;

	const isTogglable = context.timesheetDetailsState == "saved" || context.timesheetDetailsState == "signed";

	return (
		<button
			className={`flex h-10 items-center rounded-lg px-4 text-sm font-medium text-white transition-colors
				${isTogglable ? 'bg-blue-500 hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600' : 'bg-gray-400 cursor-not-allowed opacity-50'}`}
			onClick={toggleTimesheetSigned}
		>
			{selectedTimesheet.usercommitted ? 'Unsign Timesheet' : 'Sign Timesheet' }
		</button>
	)
}