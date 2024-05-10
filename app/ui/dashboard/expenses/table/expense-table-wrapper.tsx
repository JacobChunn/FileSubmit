"use client"
import { useContext, useEffect } from "react";
import { ExpenseContext } from "../expense-context-wrapper";
import { fetchExpensesWithAuth } from "@/app/lib/actions";

export default function ExpenseTableWrapper({
	children,
}: {
	children?: React.ReactNode;
}) {
	const context = useContext(ExpenseContext);

	if (context == null) {
		throw new Error(
			"context has to be used within <ExpenseContext.Provider>"
		);
	}

    useEffect(() => {
		const handleDataPromise = async() => {
			const data = await fetchExpensesWithAuth();
			context.setLocalExpenses(data);
		}
		
		handleDataPromise();
	
	}, []);

	return (
		<table className="w-full h-full">
			{children}
		</table>
	)

}