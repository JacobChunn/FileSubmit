"use client"
import { useContext } from "react"
import { TimesheetContext } from "../timesheet-context-wrapper"
import { TimesheetDetails } from "@/app/lib/definitions"
import SignTimesheetToggleButton from "./sign-timesheet-toggle-button"
import TimesheetDetailsStateIndicator from "./details-state-indicator"
import WeekEditor from "./week-editor"

export default function TimesheetDetailsHeader({
	children
}: {
	children?: React.ReactNode
}) {
	const context = useContext(TimesheetContext)

	if (context == null) {
		throw new Error(
			"context has to be used within <TimesheetContext.Provider>"
		);
	}

	const timesheetID = context.selectedTimesheet;

	if (timesheetID == null) {
		throw new Error(
			"selectedTimesheet of TimesheetContext has not been set!"
		);
	}

	if (context.localTimesheets == null) {
		throw new Error(
			"timesheets of TimesheetContext has not been set!"
		);
	}

	const canAddTSD = context.timesheetDetailsState == "saved" || context.timesheetDetailsState == "unsaved";

	const addTSD = () => {
		const currentTSDs = context.localTimesheetDetails || [];
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
		context.setLocalTimesheetDetails([...currentTSDs, newTSD]);
	}

	return (
		<div className="w-full h-full">
			<div className="flex justify-between pb-2">
				<TimesheetDetailsStateIndicator/>
				<WeekEditor/>
				<div className="flex items-center space-x-1">
					<SignTimesheetToggleButton/>
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