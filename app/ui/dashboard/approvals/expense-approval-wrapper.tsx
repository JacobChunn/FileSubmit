"use client"
import { fetchSubordinateExpensesWithAuth, fetchSubordinateTimesheetsWithAuth } from "@/app/lib/actions";
import { useContext, useEffect } from "react";
import { ApprovalContext } from "./approval-context-wrapper";
import { DateTime } from "luxon";

export default function ExpenseApprovalWrapper({
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
            const datestart = context.expenseDatestart?.toISO();
			const data = await fetchSubordinateExpensesWithAuth(datestart);
			console.log("data", data)
			context.setSubordinateExpenses(data);
		}
		
		handleDataPromise();
	
	}, [context.expenseDatestart]);

    return (
        <div className="w-full h-full shadow-md rounded-lg pt-4 pb-6 px-4">
            {children}
        </div>
    )
}