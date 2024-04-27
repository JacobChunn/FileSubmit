'use client'

import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { TimesheetContext } from "../../dashboard/timesheets/timesheet-context-wrapper";
import { TimesheetDetails, TimesheetDetailsExtended } from "@/app/lib/definitions";

interface ControlledSelectProps {
	index: number,
	phaseAttr: keyof TimesheetDetailsExtended,
	costcodeAttr: keyof TimesheetDetailsExtended,
	info: string,
	className: string,
	phaseValue: string | number,
	costcodeValue: string | number,
	phaseDbValue: string | number | undefined,
	costcodeDbValue: string | number | undefined,
	disabled: boolean,
	children: React.ReactElement<HTMLOptionElement & {"focused-label": string, "unfocused-label": string}>[];
}

export default function DoubleControlledSelect({
	index,
	phaseAttr,
	costcodeAttr,
	info,
	className,
	phaseValue,
	costcodeValue,
	phaseDbValue,
	costcodeDbValue,
	disabled,
	children,
}: ControlledSelectProps) {
	const context = useContext(TimesheetContext);
	const focusedInfoRef = useRef<string | null>(null);

	if (context == null) {
		throw new Error(
			"context has to be used within <TimesheetContext.Provider>"
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
		console.log("inputValue: ",inputValue)
		const parsedInput = inputValue.split('-');
		const newPhase = parsedInput[0];
		const newCostcode = parsedInput[1];
		// const result = inputValue.match(/\d/g);
		// const newValue = result && !Number.isNaN(result) ? parseInt(result.join(''), 10) : "";

		// console.log(newValue, typeof(newValue))

		context.setLocalTimesheetDetails(prev => {
		  if (prev === null) return null;
		  const updatedTSDs = [...prev];
		  //const updatedItem = { ...updatedTSDs[index], [attr1]: Number(inputValue) };
		  const updatedItem = { ...updatedTSDs[index], [phaseAttr]: Number(newPhase), [costcodeAttr]: Number(newCostcode)};
		  updatedTSDs[index] = updatedItem;
		  return updatedTSDs;
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

	const editStyle = costcodeDbValue == null || phaseDbValue == null || phaseDbValue !== phaseValue || costcodeDbValue !== costcodeValue ? "bg-red-300 " : "";

	// console.log("phase val + db", phaseValue, phaseDbValue);
	// console.log("costcode val + db", costcodeValue, costcodeDbValue);

	return (
		<select
			id={info}
			key={info}
			name={info}
			className={editStyle + className}
			onChange={handleChange}
			value={phaseValue + "-" + costcodeValue}
			disabled={disabled}
		>
			{children}
		</select>
	)
}