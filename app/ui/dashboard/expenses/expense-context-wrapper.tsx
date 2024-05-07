"use client"

import { SavingState, Timesheet, TimesheetDetailsExtended,  } from "@/app/lib/definitions";
import { DateTime } from "luxon";
import { createContext, useState } from "react";

type expenseContextType = {
    selectedExpense: number | null;
    setSelectedExpense: React.Dispatch<React.SetStateAction<number | null>>;

    localTimesheets: Timesheet[] | null;
    setLocalTimesheets: React.Dispatch<React.SetStateAction<Timesheet[] | null>>;

    localTimesheetDetails: TimesheetDetailsExtended[] | null;
    setLocalTimesheetDetails: React.Dispatch<React.SetStateAction<TimesheetDetailsExtended[] | null>>;

    databaseTimesheetDetails: TimesheetDetailsExtended[] | null;
    setDatabaseTimesheetDetails: React.Dispatch<React.SetStateAction<TimesheetDetailsExtended[] | null>>;

    timesheetDetailsState: SavingState;
    setTimesheetDetailsState: React.Dispatch<React.SetStateAction<SavingState>>;

	localTimesheetWeekEnding: DateTime<true> | DateTime<false> | null;
	setLocalTimesheetWeekEnding: React.Dispatch<React.SetStateAction<DateTime<true> | DateTime<false> | null>>;

	databaseTimesheetWeekEnding: DateTime<true> | DateTime<false> | null;
	setDatabaseTimesheetWeekEnding: React.Dispatch<React.SetStateAction<DateTime<true> | DateTime<false> | null>>;

    timesheetIsSaving: boolean;
    setTimesheetIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ExpenseContext = createContext<expenseContextType | null>(null)

export default function ExpenseContextWrapper({
    children,
}: {
    children: React.ReactNode,
}) {

	const [selectedTimesheet, setSelectedTimesheet] = useState<number | null>(null);
    const [localTimesheets, setLocalTimesheets] = useState<Timesheet[] | null>(null);
    const [localTimesheetDetails, setLocalTimesheetDetails] = useState<TimesheetDetailsExtended[] | null>(null);
    const [databaseTimesheetDetails, setDatabaseTimesheetDetails] = useState<TimesheetDetailsExtended[] | null>(null);
    const [timesheetDetailsState, setTimesheetDetailsState] = useState<SavingState>(null);
	const [localTimesheetWeekEnding, setLocalTimesheetWeekEnding] = useState<DateTime<true> | DateTime<false> | null>(null);
	const [databaseTimesheetWeekEnding, setDatabaseTimesheetWeekEnding] = useState<DateTime<true> | DateTime<false> | null>(null);
    const [timesheetIsSaving, setTimesheetIsSaving] = useState<boolean>(false);

    return (
        <ExpenseContext.Provider
            value={{
                selectedTimesheet, setSelectedTimesheet,
                localTimesheets, setLocalTimesheets,
                localTimesheetDetails, setLocalTimesheetDetails,
                databaseTimesheetDetails, setDatabaseTimesheetDetails,
                timesheetDetailsState, setTimesheetDetailsState,
				localTimesheetWeekEnding, setLocalTimesheetWeekEnding,
				databaseTimesheetWeekEnding, setDatabaseTimesheetWeekEnding,
                timesheetIsSaving, setTimesheetIsSaving,
            }}
        >
            {children}
        </ExpenseContext.Provider>
    )
}