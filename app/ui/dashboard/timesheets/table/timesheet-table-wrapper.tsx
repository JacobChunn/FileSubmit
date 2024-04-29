"use client"
import { Timesheet } from "@/app/lib/definitions";
import { useContext, useEffect } from "react";
import { TimesheetContext } from "../timesheet-context-wrapper";
import { fetchTimesheetsWithAuth } from "@/app/lib/actions";

export default function TimesheetTableWrapper({
	//timesheetPromise,
	children,
}: {
	//timesheetPromise: Promise<Timesheet[]>;
	children?: React.ReactNode;
}) {
	const context = useContext(TimesheetContext);

	if (context == null) {
		throw new Error(
			"context has to be used within <TimesheetContext.Provider>"
		);
	}

    useEffect(() => {
		const handleDataPromise = async() => {
			const data = await fetchTimesheetsWithAuth();
			context.setLocalTimesheets(data);
		}
		
		handleDataPromise();
	
	}, []);

	return (
		<table className="w-full h-full">
			{children}
		</table>
	)

}