"use client"
import { addTimesheetDetails } from "@/app/lib/actions"
import { Button } from "@/app/ui/button"
import { useContext } from "react"
import { TimesheetContext } from "../../timesheet-wrapper"

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

	return (
		<div className="w-full h-full">
			<div className="flex justify-end py-4">
				<Button
					onClick={() => addTimesheetDetails(timesheetID)}
				>
					Add Timesheet Details
					{children}
				</Button>
			</div>
		</div>
	)

}