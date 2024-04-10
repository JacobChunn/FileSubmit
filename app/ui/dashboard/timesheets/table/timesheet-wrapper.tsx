"use client"

import { Timesheet } from "@/app/lib/definitions";
import { createContext, useState } from "react";

type timesheetContextType = {
    selectedTimesheet: number | null;
    setSelectedTimesheet: React.Dispatch<React.SetStateAction<number | null>>;
    timesheet: Timesheet[] | null;
    setTimesheet: React.Dispatch<React.SetStateAction<Timesheet[] | null>>
}

export const TimesheetContext = createContext<timesheetContextType | null>(null)

export default function TimesheetWrapper({
    children,
}: {
    children: React.ReactNode,
}) {

	const [selectedTimesheet, setSelectedTimesheet] = useState<number | null>(null);
    const [timesheet, setTimesheet] = useState<Timesheet[] | null>(null);

    return (
        <TimesheetContext.Provider
            value={{
                selectedTimesheet, setSelectedTimesheet,
                timesheet, setTimesheet,
            }}
        >
            {children}
        </TimesheetContext.Provider>
    )
}