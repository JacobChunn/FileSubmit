"use client"
import { addTimesheetDetails } from "@/app/lib/actions"
import { Button } from "@/app/ui/button"

export default function TimesheetDetailsHeader({
	timesheetID,
	children
}: {
	timesheetID: number,
	children?: React.ReactNode
}) {

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