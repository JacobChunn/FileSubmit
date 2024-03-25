"use client"

import { createContext, useState } from "react";

type timesheetContextType = {
    selectedTimesheet: number | null;
    setSelectedTimesheet: React.Dispatch<React.SetStateAction<number | null>>;
}

export const TimesheetContext = createContext<timesheetContextType | null>(null)

export default async function TimesheetWrapper({
    children,
}: {
    children: React.ReactNode,
}) {

	const [selectedTimesheet, setSelectedTimesheet] = useState<number | null>(null);

    return (
        <TimesheetContext.Provider value={{selectedTimesheet, setSelectedTimesheet}}>
            {children}
        </TimesheetContext.Provider>
    )
}