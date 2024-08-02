"use client"

import { useContext } from "react"
import { ApprovalContext } from "./approval-context-wrapper"
import { DisplayExpense } from "@/app/lib/definitions"

export default function ExpenseApprovalTable({
	children
}: {
	children?: React.ReactNode
}) {
	const context = useContext(ApprovalContext)

	if (!context || !context.subordinateExpenses) {
		return <div>Loading...</div>;
	}

	function createDisplayExpenses(): DisplayExpense[] | null {
		const displayExpenses: DisplayExpense[] = [];

		if (!context) return null;
	
		if (!context.subordinates || !context.subordinateExpenses) {
			return displayExpenses;
		}
	
		for (const [id, firstname, lastname] of context.subordinates) {
			const matchingExpenses = context.subordinateExpenses.filter(
				(subEX) => subEX.subordinateid === id
			);
	
			if (matchingExpenses.length > 0) {
				for (const expense of matchingExpenses) {
					displayExpenses.push({
						id,
						firstname,
						lastname,
						found: true,
						expense: expense
					});
				}
			} else {
				displayExpenses.push({
					id,
					firstname,
					lastname,
					found: false
				});
			}
		}
	
		return displayExpenses;
	}

	const displayExpenses = createDisplayExpenses();
	if (!displayExpenses) {
		throw new Error(
			"Display Expenses was not set up properly"
		);
	}

	const handleRowClick = (id: number) => {
		context.setSelectedSubordinate([id, "expense"])
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
				{displayExpenses.map(({ id, firstname, lastname, found }) => (
				<tr
					key={id}
					onClick={() => handleRowClick(id)}
					className="cursor-pointer"
				>
					<td className={found ? 'text-blue-500' : 'text-red-500'}>{id}</td>
					<td className={found ? 'text-blue-500' : 'text-red-500'}>{lastname}</td>
					<td className={found ? 'text-blue-500' : 'text-red-500'}>{firstname}</td>
				</tr>
				))}
			</tbody>
		</table>
	);
}