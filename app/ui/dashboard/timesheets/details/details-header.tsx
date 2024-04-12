"use client"
import { Button } from "@/app/ui/button"
import { useContext, useEffect, useState } from "react"
import { TimesheetContext } from "../table/timesheet-wrapper"
import { TimesheetDetails } from "@/app/lib/definitions"

export default function TimesheetDetailsHeader({
	children
}: {
	children?: React.ReactNode
}) {
	const context = useContext(TimesheetContext)
	const [changedTSD, setChangedTSD] = useState<number>(0);

	useEffect(() => {
		
	}, [changedTSD]);

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

	const signTimesheet = () => {
		//TODO: FINISH
	}

	const addTSD = () => {
		const currentTSDs = context.localTimesheetDetails || [];
		const newTSD: TimesheetDetails = {
			id: 0,
			timesheetid: timesheetID,
			employeeid: context.employeeid,
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
			<div className="flex justify-end py-4">
				<button
					className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
					onClick={signTimesheet}
				>
					Sign Timesheet
				</button>
				<div className="w-2"/>
				<Button
					onClick={addTSD}
				>
					Add Timesheet Details
				</Button>
			</div>
			{children}
		</div>
	)

}