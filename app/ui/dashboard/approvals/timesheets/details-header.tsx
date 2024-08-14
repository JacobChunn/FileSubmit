"use client"
import { useContext } from "react"
import { TimesheetDetails, TimesheetDetailsExtended } from "@/app/lib/definitions"
import { ApprovalContext } from "../approval-context-wrapper"
import TimesheetDetailsStateIndicator from "./details-state-indicator"
import SignTimesheetToggleButton from "./sign-timesheet-toggle-button"
import ApproveTimesheetToggleButton from "./approval-timesheet-toggle-button"

export default function TimesheetDetailsHeader({
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

	const timesheetID = context.selectedSubordinate ? context.selectedSubordinate[2] : null;

	if (timesheetID == null) {
		throw new Error(
			"selectedTimesheet of ApprovalContext has not been set!"
		);
	}

	if (context.localSubordinateTimesheets == null) {
		throw new Error(
			"timesheets of ApprovalContext has not been set!"
		);
	}

	const canAddTSD = context.subordinateDetailsState == "saved" || 
		context.subordinateDetailsState == "unsaved" || 
		context.subordinateDetailsState == "signed";

	const addTSD = () => {
		const currentTSDs = context.localSubordinateDetails as TimesheetDetailsExtended[] || [];
		const newTSD: TimesheetDetails = {
			id: 0,
			timesheetid: timesheetID,
			employeeid: -1,
			projectid: 0,
			phase: 0,
			costcode: 0,
			description: null,
			mon: 0,
			monot: 0,
			tues: 0,
			tuesot: 0,
			wed: 0,
			wedot: 0,
			thurs: 0,
			thursot: 0,
			fri: 0,
			friot: 0,
			sat: 0,
			satot: 0,
			sun: 0,
			sunot: 0,
			lasteditdate: ""
		}
		context.setLocalSubordinateDetails([...currentTSDs, newTSD]);
	}

	return (
		<div className="w-full h-16">
			<div className="flex justify-between pb-2">
				<TimesheetDetailsStateIndicator/>
				<div className="flex items-center space-x-1">
					<SignTimesheetToggleButton/>
					<ApproveTimesheetToggleButton/>
					<div className="w-2"/>
					<button
						className={`flex h-10 items-center rounded-lg px-4 text-sm font-medium text-white transition-colors
						${canAddTSD ? 'bg-blue-500 hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600' : 'bg-gray-400 cursor-not-allowed opacity-50'}`}
						onClick={addTSD}
					>
						Add Row
					</button>
				</div>
			</div>
			{children}
		</div>
	)

}