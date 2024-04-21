"use client"

import { useContext } from "react";
import { TimesheetContext } from "../../dashboard/timesheets/timesheet-context-wrapper";
import { TimesheetDetails, TimesheetDetailsExtended } from "@/app/lib/definitions";

interface InputProps {
	index: number,
	attr: keyof TimesheetDetailsExtended,
	info: string,
	className?: string,
	isOT?: boolean,
	value: string | number | null | undefined,
	dbValue: string | number | null | undefined,
	type?: string,
	disabled: boolean,
}

export default function InputDetailsNumber({
	index,
	attr,
	info,
	className='',
	isOT=false,
	value,
	dbValue,
	disabled,
}: InputProps) {
	const context = useContext(TimesheetContext);

	if (context == null) {
		throw new Error(
			"context has to be used within <TimesheetContext.Provider>"
		);
	}

	const len = context.localTimesheetDetails?.length || 0;

	const definedValue = (value !== null && value !== undefined) ? value : 0;

	const formattedValue = definedValue == 0 ? "" : definedValue;

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value;

		const result = inputValue.match(/\d/g);
		const newValue = result && !Number.isNaN(result) ? parseInt(result.join(''), 10) : "";

		console.log(newValue, typeof(newValue))

		context.setLocalTimesheetDetails(prev => {
		  if (prev === null) return null;
		  const updatedTSDs = [...prev];
		  const updatedItem = { ...updatedTSDs[index], [attr]: newValue };
		  updatedTSDs[index] = updatedItem;
		  return updatedTSDs;
		});
	};

	let bgCol;
	if (isOT) {
		bgCol = dbValue == null || dbValue !== value ? "bg-red-300 " : "bg-zinc-200 ";
	} else {
		bgCol = dbValue == null || dbValue !== value ? "bg-red-300 " : "bg-white ";
	}

	return (
		<input
			id={info+len}
			key={info+len}
			name={info}
			className={bgCol + className}
			value={formattedValue}
			onChange={handleChange}
			disabled={disabled}
		/>
	)
}