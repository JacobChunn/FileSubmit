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

	if (!context || !context.localSubordinateExpenses) {
		return <div>Loading...</div>;
	}

	function createDisplayExpenses(): DisplayExpense[] | null {
		const displayExpenses: DisplayExpense[] = [];

		if (!context) return null;
	
		if (!context.subordinates || !context.localSubordinateExpenses) {
			return displayExpenses;
		}
	
		for (const [id, firstname, lastname] of context.subordinates) {
			const matchingExpenses = context.localSubordinateExpenses.filter(
				(subEX) => subEX.subordinateid === id
			);
	
			if (matchingExpenses.length > 0) {
				for (const expense of matchingExpenses) {
					displayExpenses.push({
						id,
						firstname,
						lastname,
						signed: expense.usercommitted,
						approved: expense.mgrapproved,
						expenseCount: matchingExpenses.length,
						expense: expense
					});
				}
			} else {
				displayExpenses.push({
					id,
					firstname,
					lastname,
					signed: false,
					approved: false,
					expenseCount: 0,
					expense: undefined
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

	const handleRowClick = (subordinateID: number, expenseID: number) => {
		context.setSelectedSubordinate([subordinateID, "expense", expenseID])
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
				{displayExpenses.map(({ id, firstname, lastname, signed, approved, expenseCount, expense }) => {
					const textColor = !signed
					? "text-red-500"
					: signed && approved
						? "text-green-500"
						: "text-blue-500";
					return (
					<tr
						key={id}
						onClick={expense ? () => handleRowClick(id, expense.id) : undefined}
						className={expense ? "cursor-pointer" : ""}
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