"use client"

import { StateType } from "@/app/lib/definitions";
import Link from "next/link";
import { Button } from "../button";
import { useContext } from "react";
import { TimesheetContext } from "../dashboard/timesheets/timesheet-context-wrapper";

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
			<Button 
				type="submit"
				onClick={() => {
					context.setTimesheets(prev => {
						if (!prev || !context.selectedTimesheet || !context.localTimesheetDetails) return null;
						

						const updatedTimesheets = [...prev];
						const selectedTimesheet = updatedTimesheets.find(timesheet => timesheet.id === context.selectedTimesheet);
						if (!selectedTimesheet) return null;

						const localTSDs = context.localTimesheetDetails;

						let totalReg = 0.0;
						let totalOT = 0.0;

						localTSDs.forEach(TSD => {
							totalReg += (Number(TSD.mon) + Number(TSD.tues) + Number(TSD.wed) + Number(TSD.thurs) + Number(TSD.fri) + Number(TSD.sat) + Number(TSD.sun));
							totalOT += (Number(TSD.monot) + Number(TSD.tuesot) + Number(TSD.wedot) + Number(TSD.thursot) + Number(TSD.friot) + Number(TSD.satot) + Number(TSD.sunot));
						});

						selectedTimesheet.totalreghours = totalReg;
						selectedTimesheet.totalovertime = totalOT;

						return updatedTimesheets;
					}
				)}}
			>
				{text}
			</Button>
		</div>
	)
}