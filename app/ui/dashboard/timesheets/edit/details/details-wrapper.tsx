"use client"

import { useContext } from "react"
import { TimesheetContext } from "../../timesheet-wrapper"

export default function TimesheetDetailsWrapper({
	children
}: {
	children: React.ReactNode
}) {
	const context = useContext(TimesheetContext)

	return (
		<div className="rounded-xl shadow-md p-6 w-full h-full">
			{context?.selectedTimesheet == null ?
				null
				:
				children
			}
			
		</div>
	)

}