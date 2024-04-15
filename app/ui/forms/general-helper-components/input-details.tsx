"use client"

import { useContext } from "react";
import { TimesheetContext } from "../../dashboard/timesheets/timesheet-context-wrapper";
import { TimesheetDetails } from "@/app/lib/definitions";

interface InputProps {
	index: number,
	attr: keyof TimesheetDetails,
	info: string,
	className?: string,
	value: string | number | null | undefined,
	type?: string,
	disabled: boolean,
}

export default function InputDetails({
	index,
	attr,
	info,
	className='',
	value,
	type='number',
	disabled,
}: InputProps) {
	const context = useContext(TimesheetContext);

	if (context == null) {
		throw new Error(
			"context has to be used within <TimesheetContext.Provider>"
		);
	}

	const len = context.localTimesheetDetails?.length || 0;

	let formattedValue;

	if (type == 'number') {
		formattedValue = (value !== null && value !== undefined) ? value : 0;
	}

	if (type == 'text') {
		formattedValue = (value !== null && value !== undefined) ? value : '';
	}

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = type === 'number' ? parseFloat(event.target.value) : event.target.value;
		context.setLocalTimesheetDetails(prev => {
		  if (prev === null) return null;
		  const updatedTSDs = [...prev];
		  const updatedItem = { ...updatedTSDs[index], [attr]: newValue };
		  updatedTSDs[index] = updatedItem;
		  return updatedTSDs;
		});
	  };

	return (
		<input
			id={info+len}
			key={info+len}
			name={info}
			className={className}
			value={formattedValue}
			onChange={handleChange}
			disabled={disabled}
		/>
	)
}