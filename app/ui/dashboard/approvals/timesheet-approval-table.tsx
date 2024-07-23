"use client"

import { useContext } from "react"
import { ApprovalContext } from "./approval-context-wrapper"
import { DisplayTimesheet } from "@/app/lib/definitions"

export default function TimesheetApprovalTable({
	children
}: {
	children?: React.ReactNode
}) {
	const context = useContext(ApprovalContext)

	if (!context || !context.subordinateTimesheets) {
		return <div>Loading...</div>;
	}

	function createDisplayTimesheets(): DisplayTimesheet[] | null {
		const displayTimesheets: DisplayTimesheet[] = [];

		if (!context) return null;
	
		if (!context.subordinates || !context.subordinateTimesheets) {
			return displayTimesheets;
		}
	
		for (const [id, firstname, lastname] of context.subordinates) {
			const matchingTimesheets = context.subordinateTimesheets.filter(
				(subTS) => subTS.subordinateid === id
			);
	
			if (matchingTimesheets.length > 0) {
				for (const timesheet of matchingTimesheets) {
					displayTimesheets.push({
						id,
						firstname,
						lastname,
						found: true,
						timesheet: timesheet
					});
				}
			} else {
				displayTimesheets.push({
					id,
					firstname,
					lastname,
					found: false
				});
			}
		}
	
		return displayTimesheets;
	}

	const displayTimesheets = createDisplayTimesheets();
	if (!displayTimesheets) {
		throw new Error(
			"Display Timesheets was not set up properly"
		);
	}

	return (
		<table className="w-full h-full">
			<thead>
				<tr>
					<th className="text-left">ID</th>
					<th className="text-left">Last Name</th>
					<th className="text-left">First Name</th>
				</tr>
			</thead>
			<tbody>
				{displayTimesheets.map(({ id, firstname, lastname, found }) => (
				<tr key={id}>
					<td className={found ? 'text-blue-500' : 'text-red-500'}>{id}</td>
					<td className={found ? 'text-blue-500' : 'text-red-500'}>{lastname}</td>
					<td className={found ? 'text-blue-500' : 'text-red-500'}>{firstname}</td>
				</tr>
				))}
			</tbody>
		</table>
	);
}