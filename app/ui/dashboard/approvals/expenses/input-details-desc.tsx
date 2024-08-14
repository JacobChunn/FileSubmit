"use client"

import { useContext, useState } from "react";
import { ExpenseDetailsExtended } from "@/app/lib/definitions";
import { ApprovalContext } from "../approval-context-wrapper";

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
	const context = useContext(ApprovalContext);
    const [isFocused, setIsFocused] = useState(false);

	if (context == null) {
		throw new Error(
			"context has to be used within <ApprovalContext.Provider>"
		);
	}

	const len = context.localSubordinateDetails?.length || 0;

	const formattedValue = (value !== null && value !== undefined) ? value : '';

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		let newValue: string | null = event.target.value;
		newValue = newValue !== '' ? newValue : null;
		context.setLocalSubordinateDetails(prev => {
			prev = prev as ExpenseDetailsExtended[]
			if (prev === null) return null;
			const updatedEXDs = [...prev];
			const updatedItem = { ...updatedEXDs[index], [attr]: newValue };
			updatedEXDs[index] = updatedItem;
			return updatedEXDs;
		});
	};

	const dbValueProcessed = dbValue !== null ? dbValue : '';
	const valueProcessed = value !== null ? value : '';
	const editStyle = dbValueProcessed !== valueProcessed ? "bg-red-300 " : "bg-white";

	//console.log(dbValue, value);

	return (
        <div className="flex w-full h-full">
            <input
                id={info+len}
                key={info+len}
                name={info}
                className={`flex-grow text-xs px-1 ${editStyle} w-full `}
                value={formattedValue}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={handleChange}
                readOnly={readOnly}
            />
        </div>
	)
}