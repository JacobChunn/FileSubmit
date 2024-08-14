"use client"

import { useContext } from "react";
import { SubordinateTimesheet, Timesheet, TimesheetDetailsExtended } from "@/app/lib/definitions";
import { ApprovalContext } from "../approval-context-wrapper";

export type Props = {
	submitDisabled: boolean,
}

export default function TimesheetDetailButtons({
	submitDisabled,
}: Props
) {
	const context = useContext(ApprovalContext);

	if (context == null) {
		throw new Error(
			"context has to be used within <ApprovalContext.Provider>"
		);
	}

	const handleCloseOnClick = () => {
		context.setLocalSubordinateDetails(null);
		context.setSelectedSubordinate(null);
		context.setSubordinateDetailsState(null);
	}

	const setTimesheets = (): SubordinateTimesheet[] | null => {
		if (!context.localSubordinateTimesheets || !context.selectedSubordinate || !context.localSubordinateDetails) return null;
			
		const updatedTimesheets = [...context.localSubordinateTimesheets];
		const selectedSubordinateID = context.selectedSubordinate[2];
		const selectedTimesheet = updatedTimesheets.find(timesheet => timesheet.id === selectedSubordinateID);
		if (!selectedTimesheet) return null;

		const localTSDs = context.localSubordinateDetails as TimesheetDetailsExtended[];

		let totalReg = 0.0;
		let totalOT = 0.0;

		localTSDs.forEach(TSD => {
			totalReg += (Number(TSD.mon) + Number(TSD.tues) + Number(TSD.wed) + Number(TSD.thurs) + Number(TSD.fri) + Number(TSD.sat) + Number(TSD.sun));
			totalOT += (Number(TSD.monot) + Number(TSD.tuesot) + Number(TSD.wedot) + Number(TSD.thursot) + Number(TSD.friot) + Number(TSD.satot) + Number(TSD.sunot));
		});

		selectedTimesheet.totalreghours = totalReg;
		selectedTimesheet.totalovertime = totalOT;

		return updatedTimesheets;
	}

	const handleSubmitOnClick = () => {
		const newTimesheets = setTimesheets();
		context.setLocalSubordinateTimesheets(newTimesheets);
	}

	return (
		<div className="mt-6 flex justify-end gap-4">
			<button
				className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
				onClick={handleCloseOnClick}
			>
				Close
			</button>
			<button 
				type="submit"
				className={`flex h-10 items-center rounded-lg px-4 text-sm font-medium text-white transition-colors
					${submitDisabled ? 'bg-gray-400 cursor-not-allowed opacity-50' : 'bg-blue-500 hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600'}`}
				onClick={handleSubmitOnClick}
				disabled={submitDisabled}
			>
				Save
			</button>
		</div>
	)
}