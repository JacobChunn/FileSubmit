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

	if (!context || !context.localSubordinateTimesheets) {
		return <div>Loading...</div>;
	}

	function createDisplayTimesheets(): DisplayTimesheet[] | null {
		const displayTimesheets: DisplayTimesheet[] = [];

		if (!context) return null;

		if (!context.subordinates || !context.localSubordinateTimesheets) {
			return displayTimesheets;
		}

		for (const [id, firstname, lastname] of context.subordinates) {
			const matchingTimesheets = context.localSubordinateTimesheets.filter(
				(subTS) => subTS.subordinateid === id
			);

			if (matchingTimesheets.length > 0) {
				for (const timesheet of matchingTimesheets) {
					displayTimesheets.push({
						id,
						firstname,
						lastname,
						signed: timesheet.usercommitted,
						approved: timesheet.mgrapproved,
						timesheetCount: matchingTimesheets.length,
						timesheet: timesheet
					});
				}
			} else {
				displayTimesheets.push({
					id,
					firstname,
					lastname,
					signed: false,
					approved: false,
					timesheetCount: 0,
					timesheet: undefined
				});
			}
		}

		return displayTimesheets;
	}

	const displayTimesheets = createDisplayTimesheets();
	if (displayTimesheets == null) {
		throw new Error(
			"Display Timesheets was not set up properly"
		);
	}

	const handleRowClick = (subordinateID: number, timesheetID: number) => {
		context.setSelectedSubordinate([subordinateID, "timesheet", timesheetID])
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
				{displayTimesheets.map(({ id, firstname, lastname, signed, approved, timesheetCount, timesheet }) => {
					const textColor = !signed
						? "text-red-500"
						: signed && approved
							? "text-green-500"
							: "text-blue-500";
					return (
						<tr
							key={id}
							onClick={timesheet ? () => handleRowClick(id, timesheet.id) : undefined}
							className={timesheet ? "cursor-pointer" : ""}
						>
							<td className={textColor}>{id}</td>
							<td className={textColor}>{lastname}</td>
							<td className={textColor}>{firstname}</td>
						</tr>
					);

				})}
			</tbody>
		</table>
	);
}