"use client"
import { Timesheet } from "@/app/lib/definitions";
import { useContext, useEffect } from "react";
import { TimesheetContext } from "./timesheet-wrapper";

export default function TimesheetTableWrapper({
	timesheetPromise,
	children,
}: {
	timesheetPromise: Promise<Timesheet[]>;
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
			const returnedData = await timesheetPromise;
			context.setTimesheetDetails(returnedData);
		}
		
		handleDataPromise();
	
	}, []);

	return (
		<table className="w-full h-full">
			{children}
		</table>
	)

}