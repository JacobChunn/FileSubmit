"use client"

import { useContext } from "react"
import { ExpenseContext } from "../expense-context-wrapper"

export default function ExpenseDetailsWrapper({
	children
}: {
	children: React.ReactNode
}) {
	const context = useContext(ExpenseContext)

	return (
		<>
			{context == undefined || context.selectedExpense == null ?
				null
				:
				<div className="w-full h-full shadow-md rounded-lg pt-4 pb-6 px-4">
					{children}
				</div>
			}
		</>
	)

}