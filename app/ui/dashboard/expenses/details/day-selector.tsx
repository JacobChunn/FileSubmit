"use client"
import { useContext, useState } from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { ExpenseContext } from "../expense-context-wrapper";


export default function DaySelector({
	index
}: {
	index: number
}) {
	const context = useContext(ExpenseContext);
	if (context == null) {
		throw new Error(
			"context has to be used within <ExpenseContext.Provider>"
		);
	}

	if (!context.localExpenseDateStart || !context.databaseExpenseDateStart ||
			!context.localExpenseDetails || !context.databaseExpenseDetails
	) {
		throw new Error(
			"Expense Start Date and Details values were not initialized properly"
		);
	}

	const [dayIsFocused, setDayIsFocused] = useState<boolean>(false);
	const [tempValue, setTempValue] = useState<string>(context.localExpenseDetails[index]['day'].toString());

	// const dateString = "Thu Nov 01 2001 00:00:00 GMT-0500 (Eastern Standard Time)";
	// const jsDate = new Date(dateString);
	// const luxonDateTime = DateTime.fromJSDate(jsDate);
	const localDT = context.localExpenseDateStart;
	const maxDays = localDT.daysInMonth
	if (!maxDays) {
		throw new Error(
			"Month was not set properly"
		);
	}
	// const formattedDate = `${localDT.toFormat('ccc MMM dd yyyy HH:mm:ss')} GMT${localDT.toFormat('ZZZ')} (${localDT.offsetNameLong})`;
	const localISO = localDT.toISO()
	const formattedDate = localISO ? localISO : "";
	// console.log(formattedDate)

	// const handleAddOnClick = (day: number) => {
	// 	context.setLocalExpenseDetails(prev => {
	// 		if (prev === null) return null;
	// 		const updatedEXDs = [...prev];
	// 		const currentDay = updatedEXDs[index]['day']
	// 		const updatedDay = currentDay + day
	// 		const updatedItem = { ...updatedEXDs[index], ['day']: Number(updatedDay < 1 ? 1 : updatedDay > maxDays ? maxDays : updatedDay) };
	// 		updatedEXDs[index] = updatedItem;
	// 		return updatedEXDs;
	// 	  });
	// };
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTempValue(event.target.value);
    };

    const clampValue = (value: number) => {
        return Math.max(1, Math.min(value, maxDays));
    };

    const applyClamping = () => {
        const inputDay = parseInt(tempValue, 10);
        if (!isNaN(inputDay)) {
            const clampedDay = clampValue(inputDay);
            context.setLocalExpenseDetails(prev => {
                if (prev === null) return null;
                const updatedEXDs = [...prev];
                const updatedItem = { ...updatedEXDs[index], day: clampedDay };
                updatedEXDs[index] = updatedItem;
                return updatedEXDs;
            });
            setTempValue(clampedDay.toString());
        } else {
            setTempValue(context.localExpenseDetails ? context.localExpenseDetails[index]['day'].toString() : "");
        }
    };

    const handleBlur = () => {
        applyClamping();
        setDayIsFocused(false);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            applyClamping();
            setDayIsFocused(false);
        }
    };


	const savedDay = context.databaseExpenseDetails[index] && context.localExpenseDetails[index]['day'] === context.databaseExpenseDetails[index]['day'];
	const hideButtons = context.expenseDetailsState == "signed";

	return (
		<div className="flex items-center justify-center px-2"
		>
            <input
                form={"form" + context.selectedExpense}
                id="day"
                name={"EXD" + index + "[day]"}
                type="number"
                value={tempValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
                onFocus={() => setDayIsFocused(true)}
                onKeyDown={handleKeyPress}
                className={`flex items-center justify-center w-10 h-8 px-2 rounded-2xl border border-black ${savedDay ? "bg-blue-gray-50" : "bg-red-300"}`}
            />
		</div>
	)		
}