"use client"

import { useContext } from "react";
import { managerToggleTimesheetSignedValue } from "@/app/lib/actions";
import { Timesheet, SavingState, SubordinateTimesheet } from "@/app/lib/definitions";
import { ApprovalContext } from "../approval-context-wrapper";

export default function SignTimesheetToggleButton({

}: {

}) {
	const context = useContext(ApprovalContext);

	if (context == null) {
		throw new Error(
			"context has to be used within <ApprovalContext.Provider>"
		);
	}

	if (!context.selectedSubordinate) {
		throw new Error(
			"selectedSubordinate was not set!"
		);
	}

	const setTimesheets = (): SubordinateTimesheet[] | null => {
		if (!context.localSubordinateTimesheets || !context.selectedSubordinate) return null;
		const selectedSubordinate = context.selectedSubordinate[2]

		const updatedTimesheets = [...context.localSubordinateTimesheets];

		const selectedTimesheet = updatedTimesheets.find(timesheet => timesheet.id === selectedSubordinate);
		if (!selectedTimesheet) return null;

		selectedTimesheet.usercommitted = !selectedTimesheet.usercommitted;

		return updatedTimesheets;
	}

	const toggleTimesheetSigned = async () => {
		if (context.selectedSubordinate == null) return;
		try {
			await managerToggleTimesheetSignedValue(context.selectedSubordinate[0], context.selectedSubordinate[2]);
			const newTimesheets = setTimesheets();
			context.setLocalSubordinateTimesheets(newTimesheets);
			const newTSDState: SavingState = context.subordinateDetailsState == "signed" ? "saved" : "signed";
			context.setSubordinateDetailsState(newTSDState);
		} catch (error) {
			console.error(error);
		}
	}
	const selectedSubordinate = context.selectedSubordinate[2]
	const selectedTimesheet = context.localSubordinateTimesheets?.find(timesheet => timesheet.id === selectedSubordinate);
	if (!selectedTimesheet) return null;

	const isTogglable = context.subordinateDetailsState == "saved" || context.subordinateDetailsState == "signed";

	return (
		<button
			id="signTS"
			className={`flex h-10 items-center justify-center w-20 rounded-lg px-4 text-sm font-medium text-white transition-colors
				${isTogglable ? 'bg-blue-500 hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600' : 'bg-gray-400 cursor-not-allowed opacity-50'}`}
			onClick={toggleTimesheetSigned}
			disabled={!isTogglable}
		>
			{selectedTimesheet.usercommitted ? 'Unsign' : 'Sign' }
		</button>
	)
}