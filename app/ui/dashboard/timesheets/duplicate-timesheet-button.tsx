'use client'
import { duplicateTimesheet } from "@/app/lib/actions";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { useContext } from "react";
import { TimesheetContext } from "./timesheet-context-wrapper";
import { Timesheet } from "@/app/lib/definitions";

export default function DuplicateTimesheetButton({
	className = "",
}: {
	className?: string,
}) {
	const context = useContext(TimesheetContext);

	if (context == null) {
		throw new Error(
			"context has to be used within <TimesheetContext.Provider>"
		);
	}

	const handleOnClick = () => {
		const addTimesheet = async () => {
			context.setTimesheetIsSaving(true);
			const res = await duplicateTimesheet();
			context.setTimesheetIsSaving(false);

			let timesheets;
			if (res.success && 'id' in res && res.id) {
				timesheets = context.localTimesheets || [];
				const newTimesheet: Timesheet = {
					id: res.id,
					employeeid: -1,
					weekending: res.weekending,
					processed: false,
					mgrapproved: false,
					usercommitted: false,
					totalreghours: res.totalreghours,
					totalovertime: res.totalovertime,
					approvedby: "",
					submittedby: res.submittedby,
					processedby: "",
					dateprocessed: "",
					message: null
				}

				timesheets = [...timesheets, newTimesheet]
			} else {
				timesheets = context.localTimesheets;
			}

			context.setLocalTimesheets(timesheets);
		}

		addTimesheet();
	}

	return (
		<div className={className}>
			<button
				className={`flex h-10 items-center justify-center gap-3 rounded-lg px-4 text-sm font-medium text-white transition-colors
					${!context.timesheetIsSaving ? 'bg-blue-500 hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600' : 'bg-gray-400 cursor-not-allowed opacity-50'}`}
				onClick={handleOnClick}
			>
				<DocumentDuplicateIcon strokeWidth={2} className="h-4 w-4" />
				Duplicate
			</button>
		</div>
	)
}