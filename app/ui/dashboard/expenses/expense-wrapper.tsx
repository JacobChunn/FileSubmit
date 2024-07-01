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
		const timeoutId = setTimeout(() => {
			// toggle nav minimization
			layoutContext.setIsNavMin(expenseIsSelected);
			layoutContext.setIsTransitioning(expenseIsSelected);

			// toggle nav min button visibility
			layoutContext.setIsMinNavButtonVisible(!expenseIsSelected);
		}, 300);

		// Cleanup the timeout if the component is unmounted
		return () => clearTimeout(timeoutId);
	}, [expenseIsSelected, layoutContext]);

	return (
		<div className="w-min h-full shadow-md rounded-lg pt-4 pb-6 px-4 transition-width duration-500 ease-in-out">
			{children}
		</div>
	);
}
