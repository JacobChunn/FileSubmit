"use client"

import { useContext, useState } from "react";
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
			"context has to be used within <ExpenseContext.Provider>"
		);
	}
	const [visualValue, setVisualValue] = useState<string | number | null | undefined>(value)

	const len = context.localExpenseDetails?.length || 0;


	const definedValue = (visualValue !== null && visualValue !== undefined) ? visualValue : 0;

	const formattedValue = definedValue == 0 ? "" : definedValue;

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		let inputValue = event.target.value;
		if (attr == 'miles')
			inputValue = String(parseInt(inputValue))

		setVisualValue(inputValue)
	};

	const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value;

		const result = inputValue.match(/\d+(\.\d*)?|\.\d+/g);
		const newValue = result && !Number.isNaN(result) ? parseFloat(result.join('')) : 0;
		const formattedNewValue = newValue == 0 ? 0 : String(newValue)
		//console.log(newValue, typeof(newValue))

		context.setLocalExpenseDetails(prev => {
		  if (prev === null) return null;
		  const updatedEXDs = [...prev];
		  const updatedItem = { ...updatedEXDs[index], [attr]: formattedNewValue };
		  updatedEXDs[index] = updatedItem;
		  return updatedEXDs;
		});

		setVisualValue(formattedNewValue)
	}

	// const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
	// 	context.setSelectedExpenseDetails(index);
	// 	// Manually trigger click on the input element
	// 	const inputElement = document.getElementById(info+len) as HTMLInputElement;
	// 	if (inputElement) {
	// 		inputElement.click();
	// 	}
	// };

	const dbValueProcessed = dbValue !== null ? String(dbValue) : '';
	const valueProcessed = value !== null && value !== '' ? String(value) : '0';
	const bgCol = dbValueProcessed !== valueProcessed ? "bg-red-300 " : "bg-white ";

	return (
		<div className="relative flex w-full h-full">
			<input
				id={info+len}
				key={info+len}
				name={info}
				className={bgCol + " flex-grow w-full text-xs px-1 " + className}
				value={formattedValue}
				onChange={handleChange}
				onBlur={handleBlur}
				readOnly={disabled}
			/>
		</div>
	)
}