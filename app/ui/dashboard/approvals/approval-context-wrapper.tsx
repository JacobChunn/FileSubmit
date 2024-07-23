"use client"

import { SubordinateTimesheet, SubordinateTuple } from "@/app/lib/definitions";
import { DateTime } from "luxon";
import { createContext, useState } from "react";

export type approvalContextType = {
    subordinates: SubordinateTuple[] | null;
    setSubordinates: React.Dispatch<React.SetStateAction<SubordinateTuple[] | null>>;

    timesheetWeekending: DateTime<true> | DateTime<false> | null;
    setTimesheetWeekending: React.Dispatch<React.SetStateAction<DateTime<true> | DateTime<false> | null>>;

    subordinateTimesheets: SubordinateTimesheet[] | null;
    setSubordinateTimesheets: React.Dispatch<React.SetStateAction<SubordinateTimesheet[] | null>>;
}

export const ApprovalContext = createContext<approvalContextType | null>(null)

export default function ApprovalContextWrapper({
    children,
}: {
    children: React.ReactNode,
}) {
	const [subordinates, setSubordinates] = useState<SubordinateTuple[] | null>(null);
    const [timesheetWeekending, setTimesheetWeekending] = useState<DateTime<true> | DateTime<false> | null>(null);
    const [subordinateTimesheets, setSubordinateTimesheets] = useState<SubordinateTimesheet[] | null>(null);

    return (
        <ApprovalContext.Provider
            value={{
				subordinates, setSubordinates,
                timesheetWeekending, setTimesheetWeekending,
                subordinateTimesheets, setSubordinateTimesheets,
            }}
        >
            {children}
        </ApprovalContext.Provider>
    )
}