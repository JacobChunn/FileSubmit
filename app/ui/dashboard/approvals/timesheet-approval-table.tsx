"use client"

import { useContext } from "react"
import { ApprovalContext } from "./approval-context-wrapper"

export default function TimesheetApprovalTable({
	children
}: {
	children?: React.ReactNode
}) {
	const context = useContext(ApprovalContext)

	if (!context) {
		return <div>Loading...</div>;
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
				{context.subordinates?.map(([id, firstname, lastname]) => (
					<tr key={id}>
						<td>{id}</td>
						<td>{lastname}</td>
						<td>{firstname}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}