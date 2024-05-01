'use client'
import { addEmptyTimesheet } from "@/app/lib/actions";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { TimesheetContext } from "./timesheet-context-wrapper";
import { Timesheet } from "@/app/lib/definitions";

export default function AddTimesheetButton({
	className,
}: {
	className: string,
}) {
	const context = useContext(TimesheetContext);

	if (context == null) {
		throw new Error(
			"context has to be used within <TimesheetContext.Provider>"
		);
	}

	const [isSaving, setIsSaving] = useState<boolean>(false);

	const handleOnClick = () => {
		const addTimesheet = async () => {
			setIsSaving(true);
			const res = await addEmptyTimesheet();
			setIsSaving(false);

			let timesheets;
			if (res.success && res.weekending && res.submittedby) {
				timesheets = context.localTimesheets || [];
				const newTimesheet: Timesheet = {
					id: 0,
					employeeid: 0,
					weekending: res.weekending,
					processed: false,
					mgrapproved: false,
					usercommitted: false,
					totalreghours: 0,
					totalovertime: 0,
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
					${!isSaving ? 'bg-blue-500 hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600' : 'bg-gray-400 cursor-not-allowed opacity-50'}`}
				onClick={handleOnClick}
			>
				<DocumentPlusIcon strokeWidth={2} className="h-4 w-4" />
				Add Timesheet
			</button>
		</div>
	)
}