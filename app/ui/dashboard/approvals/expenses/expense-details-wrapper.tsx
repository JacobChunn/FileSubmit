"use client"

import { useContext } from "react"
import { ApprovalContext } from "../approval-context-wrapper"

export default function ExpenseDetailsWrapper({
	children
}: {
	children: React.ReactNode
}) {
	const context = useContext(ApprovalContext)

	return (
		<>
			{context == undefined || context.selectedSubordinate == null ?
				null
				:
				<div className="w-full h-full bg-blue-100 shadow-md rounded-lg pt-4 pb-6 px-4">
					{children}
				</div>
			}
		</>
	)

}