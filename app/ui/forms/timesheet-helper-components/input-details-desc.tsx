"use client"

import { useContext, useState } from "react";
import { TimesheetContext } from "../../dashboard/timesheets/timesheet-context-wrapper";
import { TimesheetDetails, TimesheetDetailsExtended } from "@/app/lib/definitions";

interface InputProps {
	index: number,
	attr: keyof TimesheetDetailsExtended,
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
	const context = useContext(TimesheetContext);
    const [isFocused, setIsFocused] = useState(false);

	if (context == null) {
		throw new Error(
			"context has to be used within <TimesheetContext.Provider>"
		);
	}

	const len = context.localTimesheetDetails?.length || 0;

	const formattedValue = (value !== null && value !== undefined) ? value : '';

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;
		context.setLocalTimesheetDetails(prev => {
		  if (prev === null) return null;
		  const updatedTSDs = [...prev];
		  const updatedItem = { ...updatedTSDs[index], [attr]: newValue };
		  updatedTSDs[index] = updatedItem;
		  return updatedTSDs;
		});
	};

	const editStyle = dbValue !== value ? "bg-red-300 " : "bg-white";

	//console.log("desc: ", dbValue, value);

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