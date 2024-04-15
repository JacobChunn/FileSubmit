"use client"

import { useContext, useState } from "react";
import { TimesheetContext } from "../../dashboard/timesheets/timesheet-context-wrapper";
import { TimesheetDetails } from "@/app/lib/definitions";

interface InputProps {
	index: number,
	attr: keyof TimesheetDetails,
	info: string,
	value: string | null | undefined,
    readOnly: boolean,
}

export default function InputDetailsDesc({
	index,
	attr,
	info,
	value,
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

	const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newValue = event.target.value;
		context.setLocalTimesheetDetails(prev => {
		  if (prev === null) return null;
		  const updatedTSDs = [...prev];
		  const updatedItem = { ...updatedTSDs[index], [attr]: newValue };
		  updatedTSDs[index] = updatedItem;
		  return updatedTSDs;
		});
	  };

	return (
        <div className="flex items-center justify-center h-max">
            <textarea
                id={info+len}
                key={info+len}
                name={info}
                className={`transition-all duration-300 ease-in-out text-base resize-none ${
                    isFocused ? 'h-32 text-3xl w-80 bg-white shadow-xl rounded-lg' : 'h-12 w-full bg-gray-100'
                }`}
                value={formattedValue}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={handleChange}
                readOnly={readOnly}
            />
        </div>
	)
}