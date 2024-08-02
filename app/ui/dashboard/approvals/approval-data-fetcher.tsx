"use client"
import { useContext, useEffect } from "react";
import { fetchSubordinatesWithAuth } from "@/app/lib/actions";
import { ApprovalContext } from "./approval-context-wrapper";
import { DateTime } from "luxon";

export default function ApprovalDataFetcher({
	children,
}: {
	children?: React.ReactNode;
}) {
	const context = useContext(ApprovalContext);

	if (context == null) {
		throw new Error(
			"context has to be used within <ApprovalContext.Provider>"
		);
	}

	function getNextSunday(): DateTime {
		const now = DateTime.local();
		const daysUntilSunday = (7 - now.weekday) % 7;
		const nextSunday = now.plus({ days: daysUntilSunday }).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
		//console.log('next sunday: ', nextSunday.toISO()); // Outputs: '2024-07-28T04:00:00.000Z' (example format)
		return nextSunday;
	}

	function getFirstOfMonth(): DateTime {
		const now = DateTime.local();
		const firstOfMonth = now.set({ day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 });
		//console.log('first of the month: ', firstOfMonth.toISO()); // Outputs: '2024-08-01T00:00:00.000Z' (example format)
		return firstOfMonth;
	}

    useEffect(() => {
		const handleDataPromise = async() => {
			const data = await fetchSubordinatesWithAuth();
			//console.log(data)
			context.setSubordinates(data);
			context.setTimesheetWeekending(getNextSunday());
			context.setExpenseDatestart(getFirstOfMonth());
		}
		
		handleDataPromise();
	
	}, []);

	return (
		<>
			{context == undefined || context.subordinates == null ?
				null
				:
				<>
					{children}
				</>
			}
		</>
	)

}