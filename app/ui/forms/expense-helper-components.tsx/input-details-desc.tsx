"use client"

import { useContext, useState } from "react";
import { ExpenseDetailsExtended } from "@/app/lib/definitions";
import { ExpenseContext } from "../../dashboard/expenses/expense-context-wrapper";

interface InputProps {
	index: number,
	attr: keyof ExpenseDetailsExtended,
	info: string,
	value: string | null | undefined,
	dbValue: string | null | undefined,
    readOnly: boolean,
}

export default function InputDetailsDesc({
	index,
	attr,
	info,
	value,
	dbValue,
    readOnly,
}: InputProps) {
	const context = useContext(ExpenseContext);
    const [isFocused, setIsFocused] = useState(false);

	if (context == null) {
		throw new Error(
			"context has to be used within <ExpenseContext.Provider>"
		);
	}

	const len = context.localExpenseDetails?.length || 0;

	const formattedValue = (value !== null && value !== undefined) ? value : '';

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;
		context.setLocalExpenseDetails(prev => {
		  if (prev === null) return null;
		  const updatedEXDs = [...prev];
		  const updatedItem = { ...updatedEXDs[index], [attr]: newValue };
		  updatedEXDs[index] = updatedItem;
		  return updatedEXDs;
		});
	};

	const editStyle = dbValue !== value ? "bg-red-300 " : "bg-white";

	return (
        <div className="flex items-center justify-center h-max">
            <input
                id={info+len}
                key={info+len}
                name={info}
                className={`transition-all duration-300 ease-in-out text-sm resize-none ${editStyle} h-12 w-full`}
                value={formattedValue}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={handleChange}
                readOnly={readOnly}
            />
        </div>
	)
}