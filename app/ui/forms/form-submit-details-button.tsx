"use client"

import { StateType } from "@/app/lib/definitions";
import Link from "next/link";
import { Button } from "../button";
import { useContext } from "react";
import { TimesheetContext } from "../dashboard/timesheets/table/timesheet-wrapper";

export type Props = {
	text: string,
}

export default function FormSubmitDetailsButton({
	text,
}: Props
) {
	const context = useContext(TimesheetContext);

	if (context == null) {
		throw new Error(
			"context has to be used within <TimesheetContext.Provider>"
		);
	}

	return (
		<div className="mt-6 flex justify-end gap-4">
			<button
				className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
				onClick={() => {
					context.setLocalTimesheetDetails(null);
					context.setSelectedTimesheet(null);
				}}
			>
				Cancel
			</button>
			<Button type="submit">{text}</Button>
		</div>
	)
}