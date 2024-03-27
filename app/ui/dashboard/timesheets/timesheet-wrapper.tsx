"use client"

import { Timesheet } from "@/app/lib/definitions";
import { createContext, useState } from "react";

type timesheetContextType = {
    selectedTimesheet: number | null;
    setSelectedTimesheet: React.Dispatch<React.SetStateAction<number | null>>;
    timesheetDetails: Timesheet[] | null;
    setTimesheetDetails: React.Dispatch<React.SetStateAction<Timesheet[] | null>>
}

export const TimesheetContext = createContext<timesheetContextType | null>(null)

export default function TimesheetWrapper({
    children,
}: {
    children: React.ReactNode,
}) {

	const [selectedTimesheet, setSelectedTimesheet] = useState<number | null>(null);
    const [timesheetDetails, setTimesheetDetails] = useState<Timesheet[] | null>(null);

    return (
        <TimesheetContext.Provider
            value={{
                selectedTimesheet, setSelectedTimesheet,
                timesheetDetails, setTimesheetDetails,
            }}
        >
            {children}
        </TimesheetContext.Provider>
    )
}