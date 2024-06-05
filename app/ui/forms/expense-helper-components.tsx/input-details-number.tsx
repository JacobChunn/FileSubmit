"use client"

import { useContext } from "react";
import { ExpenseDetailsExtended } from "@/app/lib/definitions";
import { ExpenseContext } from "../../dashboard/expenses/expense-context-wrapper";

interface InputProps {
	index: number,
	attr: keyof ExpenseDetailsExtended,
	info: string,
	className?: string,
	value: string | number | null | undefined,
	dbValue: string | number | null | undefined,
	disabled: boolean,
}

export default function InputDetailsNumber({
	index,
	attr,
	info,
	className='',
	value,
	dbValue,
	disabled,
}: InputProps) {
	const context = useContext(ExpenseContext);

	if (context == null) {
		throw new Error(
			"context has to be used within <TimesheetContext.Provider>"
		);
	}

	const len = context.localExpenseDetails?.length || 0;

	const definedValue = (value !== null && value !== undefined) ? value : 0;

	const formattedValue = definedValue == 0 ? "" : definedValue;

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value;

		const result = inputValue.match(/\d/g);
		const newValue = result && !Number.isNaN(result) ? parseInt(result.join(''), 10) : "";

		const formattedNewValue = newValue == "" ? null : String(newValue)

		//console.log(newValue, typeof(newValue))

		context.setLocalExpenseDetails(prev => {
		  if (prev === null) return null;
		  const updatedEXDs = [...prev];
		  const updatedItem = { ...updatedEXDs[index], [attr]: formattedNewValue };
		  updatedEXDs[index] = updatedItem;
		  return updatedEXDs;
		});
	};

	const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
		context.setSelectedExpenseDetails(index);
		// Manually trigger click on the input element
		const inputElement = document.getElementById(info+len) as HTMLInputElement;
		if (inputElement) {
			inputElement.click();
		}
	};

	const dbValueProcessed = dbValue !== null ? String(dbValue) : '';
	const valueProcessed = value !== null ? String(value) : '';
	const bgCol = dbValueProcessed !== valueProcessed ? "bg-red-300 " : "bg-white ";

	//console.log("compare: ", dbValueProcessed, typeof dbValueProcessed, valueProcessed, typeof valueProcessed);


	return (
		<div className="relative flex w-full h-full">
			<input
				id={info+len}
				key={info+len}
				name={info}
				className={bgCol + " flex-grow w-full text-xs px-1 " + className}
				value={formattedValue}
				onChange={handleChange}
				readOnly={disabled}
			/>
		</div>
	)
}