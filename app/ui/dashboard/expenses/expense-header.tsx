"use client";
import { useContext, useEffect, useState } from "react";
import AddExpenseButton from "./add-expense-button";
import DuplicateExpenseButton from "./duplicate-expense-button";
import { ExpenseContext } from "./expense-context-wrapper";

export default function ExpenseHeader({
	children,
}: {
	children?: React.ReactNode,
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

	return (
		<>
			{shouldRender && (
				<div className={`flex items-center justify-end gap-3 transition-all duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
					<AddExpenseButton className="pb-2" />
					<DuplicateExpenseButton className="pb-2" />
					{children}
				</div>
			)}
		</>
	);
}
