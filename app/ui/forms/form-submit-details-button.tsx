"use client"

import { useContext } from "react";
import { TimesheetContext } from "../dashboard/timesheets/timesheet-context-wrapper";

export type Props = {
	submitDisabled: boolean,
}

export default function FormSubmitDetailsButton({
	submitDisabled,
}: Props
) {
	const context = useContext(TimesheetContext);

	if (context == null) {
		throw new Error(
			"context has to be used within <TimesheetContext.Provider>"
		);
	}

	const handleCancelOnClick = () => {
		context.setLocalTimesheetDetails(null);
		context.setSelectedTimesheet(null);
		context.setLocalTimesheetWeekEnding(null);
		context.setDatabaseTimesheetWeekEnding(null);
		context.setTimesheetDetailsState(null);
	}

	const handleSubmitOnClick = () => {
		context.setTimesheets(prev => {
			if (!prev || !context.selectedTimesheet || !context.localTimesheetDetails) return null;
			

			const updatedTimesheets = [...prev];
			const selectedTimesheet = updatedTimesheets.find(timesheet => timesheet.id === context.selectedTimesheet);
			if (!selectedTimesheet) return null;

			const localTSDs = context.localTimesheetDetails;

			let totalReg = 0.0;
			let totalOT = 0.0;

			localTSDs.forEach(TSD => {
				totalReg += (Number(TSD.mon) + Number(TSD.tues) + Number(TSD.wed) + Number(TSD.thurs) + Number(TSD.fri) + Number(TSD.sat) + Number(TSD.sun));
				totalOT += (Number(TSD.monot) + Number(TSD.tuesot) + Number(TSD.wedot) + Number(TSD.thursot) + Number(TSD.friot) + Number(TSD.satot) + Number(TSD.sunot));
			});

			selectedTimesheet.totalreghours = totalReg;
			selectedTimesheet.totalovertime = totalOT;

			return updatedTimesheets;
		})
		//context.setTimesheetDetailsState("saving");
	}

	return (
		<div className="mt-6 flex justify-end gap-4">
			<button
				className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
				onClick={handleCancelOnClick}
			>
				Cancel
			</button>
			<button 
				type="submit"
				className={`flex h-10 items-center rounded-lg px-4 text-sm font-medium text-white transition-colors
					${submitDisabled ? 'bg-gray-400 cursor-not-allowed opacity-50' : 'bg-blue-500 hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600'}`}
				onClick={handleSubmitOnClick}
				disabled={submitDisabled}
			>
				Submit Edits
			</button>
		</div>
	)
}