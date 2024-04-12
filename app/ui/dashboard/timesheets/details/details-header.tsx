"use client"
import { addTimesheetDetails } from "@/app/lib/actions"
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

	return (
		<div className="w-full h-full">
			<div className="flex justify-end py-4">
				<Button
					onClick={() =>{
						//addTimesheetDetails(timesheetID)
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
					}}
				>
					Add Timesheet Details
					{children}
				</Button>
			</div>
		</div>
	)

}