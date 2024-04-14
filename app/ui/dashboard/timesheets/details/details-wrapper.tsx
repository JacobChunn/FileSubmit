"use client"

import { useContext } from "react"
import { TimesheetContext } from "../timesheet-context-wrapper"

export default function TimesheetDetailsWrapper({
	children
}: {
	children: React.ReactNode
}) {
	const context = useContext(TimesheetContext)

	return (
		<div className=" p-6 w-full h-full">
			{context == undefined || context.selectedTimesheet == null ?
				null
				:
				children
			}
			
		</div>
	)

}