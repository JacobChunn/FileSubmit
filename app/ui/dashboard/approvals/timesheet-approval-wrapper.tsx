"use client"
import { fetchSubordinateTimesheetsWithAuth } from "@/app/lib/actions";
import { useContext, useEffect } from "react";
import { ApprovalContext } from "./approval-context-wrapper";
import { DateTime } from "luxon";

export default function TimesheetApprovalWrapper({
    children,
}: {
    children: React.ReactNode,
}) {
	const context = useContext(ApprovalContext);

	if (context == null) {
		throw new Error(
			"context has to be used within <ApprovalContext.Provider>"
		);
	}

    useEffect(() => {
		const handleDataPromise = async() => {
            const weekending = context.timesheetWeekending?.toISO();
			const data = await fetchSubordinateTimesheetsWithAuth(weekending);
			console.log("data", data)
			context.setSubordinateTimesheets(data);
		}
		
		handleDataPromise();
	
	}, [context.timesheetWeekending]);

    return (
        <div className="w-full h-full shadow-md rounded-lg pt-4 pb-6 px-4">
            {children}
        </div>
    )
}