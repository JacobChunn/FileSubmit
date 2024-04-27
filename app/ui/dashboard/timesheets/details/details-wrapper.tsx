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
		<>
			{context == undefined || context.selectedTimesheet == null ?
				null
				:
				<div className="w-full h-full shadow-md rounded-lg pt-4 pb-6 px-4">
					{children}
				</div>
			}
		</>
	)

}