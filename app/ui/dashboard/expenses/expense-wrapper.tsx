"use client";

import { useContext, useEffect } from "react";
import { LayoutContext } from "../layout-context-wrapper";
import { ExpenseContext } from "./expense-context-wrapper";

export default function ExpenseWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const layoutContext = useContext(LayoutContext);

	if (layoutContext == null) {
		throw new Error(
			"context has to be used within <LayoutContext.Provider>"
		);
	}

	const expenseContext = useContext(ExpenseContext);

	if (expenseContext == null) {
		throw new Error(
			"context has to be used within <ExpenseContext.Provider>"
		);
	}

	const expenseIsSelected = expenseContext.selectedExpense != null;

	useEffect(() => {
		layoutContext.setExpenseIsSelected(expenseIsSelected)
	}, [expenseIsSelected]);

	return (
		<div className="w-min h-full shadow-md rounded-lg pt-4 pb-6 px-4 transition-width duration-500 ease-in-out">
			{children}
		</div>
	);
}
