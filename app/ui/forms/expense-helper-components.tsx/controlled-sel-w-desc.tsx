'use client'

import { useContext, useEffect, useRef, useState } from "react";
import { ExpenseDetailsExtended } from "@/app/lib/definitions";
import { ExpenseContext } from "../../dashboard/expenses/expense-context-wrapper";

interface ControlledSelectProps {
	index: number,
	attr: keyof ExpenseDetailsExtended,
	info: string,
	className: string,
	value: string | number,
	dbValue: string | number | undefined,
	disabled: boolean,
	children: React.ReactElement<HTMLOptionElement & {"focused-label": string, "unfocused-label": string}>[];
}

export default function ControlledSelect({
	index,
	attr,
	info,
	className,
	value,
	dbValue,
	disabled,
	children,
}: ControlledSelectProps) {
	const context = useContext(ExpenseContext);
	const focusedInfoRef = useRef<string | null>(null);

	if (context == null) {
		throw new Error(
			"context has to be used within <ExpenseContext.Provider>"
		);
	}

	const saveFocusedContent = (data: string) => {
		focusedInfoRef.current = data;
	}

	const getFocusedContent = () => {
		return focusedInfoRef.current;
	}

	const changeToFocusedLabel = (element: HTMLSelectElement) => {
		// Restore the focused label info
		const focusedContent = getFocusedContent();
		if (!focusedContent) return;

		// Set the text content to the focused version
		const selectedOption = element.options[element.selectedIndex];
		if(!selectedOption.textContent) return;
		selectedOption.textContent = focusedContent;

	}

	const changeToUnfocusedLabel = (element: HTMLSelectElement) => {
		// Save the current focused label info
		const selectedOption = element.options[element.selectedIndex];
		if(!selectedOption.textContent) return;
		const currentFocusedContent = selectedOption.textContent;
		saveFocusedContent(currentFocusedContent);

		// Set the text content to the unfocused version
		const unfocusedLabel = selectedOption.getAttribute('unfocused-label');
		if (!unfocusedLabel) return;
		selectedOption.textContent = unfocusedLabel;
	}

	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const inputValue = event.target.value;
		//console.log("inputValue: ",inputValue)
		// const result = inputValue.match(/\d/g);
		// const newValue = result && !Number.isNaN(result) ? parseInt(result.join(''), 10) : "";

		// console.log(newValue, typeof(newValue))

		context.setLocalExpenseDetails(prev => {
		  if (prev === null) return null;
		  const updatedEXDs = [...prev];
		  const updatedItem = { ...updatedEXDs[index], [attr]: Number(inputValue) };
		  updatedEXDs[index] = updatedItem;
		  return updatedEXDs;
		});
	  };

	useEffect(() => {
		const element = document.getElementById(info) as HTMLSelectElement;
		if (!element) return;

		// Initialize drop downs to unfocused
		changeToUnfocusedLabel(element);

		// Add focus event listener to change label to focused label
		element.addEventListener('focus', (event) => {
			changeToFocusedLabel(element);
		});

		// Add blur event listener to change label to unfocused label
		element.addEventListener('blur', (event) => {
			changeToUnfocusedLabel(element);
		});
	}, []);

	const editStyle = dbValue == null || dbValue !== value ? "bg-red-300 " : "";

	return (
		<select
			id={info}
			key={info}
			name={info}
			className={editStyle + " text-xs " + className}
			onChange={handleChange}
			value={value}
			disabled={disabled}
		>
			{children}
		</select>
	)
}