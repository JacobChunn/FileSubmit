"use client"
import { Tooltip } from "@/app/ui/material-tailwind-wrapper";
import { CheckIcon, DocumentArrowUpIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { useContext, useEffect, useState } from "react";
import { ExpenseContext } from "../expense-context-wrapper";

export default function ExpenseTableHeader({
    children
}: {
    children?: React.ReactNode
}) {
	const context = useContext(ExpenseContext);

	if (context == null) {
		throw new Error(
			"context has to be used within <ExpenseContext.Provider>"
		);
	}

	const [isFading, setIsFading] = useState(false);
	const [shouldRender, setShouldRender] = useState(true);

	useEffect(() => {
		if (context.selectedExpense == null) {
			setShouldRender(true);
			setTimeout(() => {
				setIsFading(false);
			}, 0); // Start fading in immediately
		} else {
			setIsFading(true);
			setTimeout(() => {
				setShouldRender(false);
			}, 300); // Duration should match the CSS transition duration
		}
	}, [context.selectedExpense]);

	const signedIcon = (
		<Tooltip content="Expense Signed">
			<PencilSquareIcon className="w-6 h-6"/>
		</Tooltip>
	)

	const approvedIcon = (
		<Tooltip content="Expense Approved">
			<CheckIcon className="w-6 h-6"/>
		</Tooltip>
	)

	// May need to change icon
	const processedIcon = (
		<Tooltip content="Expense Paid">
			<DocumentArrowUpIcon className="w-6 h-6"/>
		</Tooltip>
	)

    const TABLE_HEAD = [
		"Start Date",
		signedIcon, approvedIcon, processedIcon,
		"Signatory", "Date Paid", "Total", "Delete"
	] as const;


    return (
		<thead className="w-min h-min">
			<tr className="w-min h-min">
				{TABLE_HEAD.map((head, index) => {
					if (!shouldRender && index != 0 ) return null;
					return (
						<th
							key={"head-" + index}
							className="w-min h-min border-y border-blue-gray-100 bg-blue-gray-50/50 py-4 px-2"
						>
							<div
								className={`h-min font-normal leading-none text-blue-gray-900 text-xs transition-opacity duration-300 ${isFading && index != 0 ? 'opacity-0' : 'opacity-80'}`}
							>
								{head}
							</div>
						</th>
					)
				})}
			</tr>
			{children}
		</thead>
    )
}