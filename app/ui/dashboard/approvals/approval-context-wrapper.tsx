"use client"

import { ExpenseDetailsExtended, SavingState, SubordinateExpense, SubordinateTimesheet, SubordinateTuple, TimesheetDetailsExtended } from "@/app/lib/definitions";
import { DateTime } from "luxon";
import { createContext, useState } from "react";

export type approvalContextType = {
    subordinates: SubordinateTuple[] | null;
    setSubordinates: React.Dispatch<React.SetStateAction<SubordinateTuple[] | null>>;

    timesheetWeekending: DateTime<true> | DateTime<false> | null;
    setTimesheetWeekending: React.Dispatch<React.SetStateAction<DateTime<true> | DateTime<false> | null>>;

    localSubordinateTimesheets: SubordinateTimesheet[] | null;
    setLocalSubordinateTimesheets: React.Dispatch<React.SetStateAction<SubordinateTimesheet[] | null>>;

    dBSubordinateTimesheets: SubordinateTimesheet[] | null;
    setDbSubordinateTimesheets: React.Dispatch<React.SetStateAction<SubordinateTimesheet[] | null>>;

    expenseDatestart: DateTime<true> | DateTime<false> | null;
    setExpenseDatestart: React.Dispatch<React.SetStateAction<DateTime<true> | DateTime<false> | null>>;

    localSubordinateExpenses: SubordinateExpense[] | null;
    setLocalSubordinateExpenses: React.Dispatch<React.SetStateAction<SubordinateExpense[] | null>>;

    dBSubordinateExpenses: SubordinateExpense[] | null;
    setDbSubordinateExpenses: React.Dispatch<React.SetStateAction<SubordinateExpense[] | null>>;

    selectedSubordinate: [number, "expense" | "timesheet", number] | null;
    setSelectedSubordinate: React.Dispatch<React.SetStateAction<[number, "expense" | "timesheet", number] | null>>;

    localSubordinateDetails: ExpenseDetailsExtended[] | TimesheetDetailsExtended[] | null;
    setLocalSubordinateDetails: React.Dispatch<React.SetStateAction<ExpenseDetailsExtended[] | TimesheetDetailsExtended[] | null>>;

    dbSubordinateDetails: ExpenseDetailsExtended[] | TimesheetDetailsExtended[] | null;
    setDbSubordinateDetails: React.Dispatch<React.SetStateAction<ExpenseDetailsExtended[] | TimesheetDetailsExtended[] | null>>;

    subordinateDetailsState: SavingState | "approved";
    setSubordinateDetailsState: React.Dispatch<React.SetStateAction<SavingState | "approved">>;

    selectedExpenseDetails: number | null;
    setSelectedExpenseDetails: React.Dispatch<React.SetStateAction<number | null>>;
}

export const ApprovalContext = createContext<approvalContextType | null>(null)

export default function ApprovalContextWrapper({
    children,
}: {
    children: React.ReactNode,
}) {
	const [subordinates, setSubordinates] = useState<SubordinateTuple[] | null>(null);
    const [timesheetWeekending, setTimesheetWeekending] = useState<DateTime<true> | DateTime<false> | null>(null);
    const [localSubordinateTimesheets, setLocalSubordinateTimesheets] = useState<SubordinateTimesheet[] | null>(null);
    const [dBSubordinateTimesheets, setDbSubordinateTimesheets] = useState<SubordinateTimesheet[] | null>(null);
    const [expenseDatestart, setExpenseDatestart] = useState<DateTime<true> | DateTime<false> | null>(null);
    const [localSubordinateExpenses, setLocalSubordinateExpenses] = useState<SubordinateExpense[] | null>(null);
    const [dBSubordinateExpenses, setDbSubordinateExpenses] = useState<SubordinateExpense[] | null>(null);
    const [selectedSubordinate, setSelectedSubordinate] = useState<[number, "expense" | "timesheet", number] | null>(null);
    const [localSubordinateDetails, setLocalSubordinateDetails] = useState<ExpenseDetailsExtended[] | TimesheetDetailsExtended[] | null>(null);
    const [dbSubordinateDetails, setDbSubordinateDetails] = useState<ExpenseDetailsExtended[] | TimesheetDetailsExtended[] | null>(null);
    const [subordinateDetailsState, setSubordinateDetailsState] = useState<SavingState | "approved">(null);
    const [selectedExpenseDetails, setSelectedExpenseDetails] = useState<number | null>(null);

    return (
        <ApprovalContext.Provider
            value={{
				subordinates, setSubordinates,

                timesheetWeekending, setTimesheetWeekending,
                localSubordinateTimesheets, setLocalSubordinateTimesheets,
                dBSubordinateTimesheets, setDbSubordinateTimesheets,
                
                expenseDatestart, setExpenseDatestart,
                localSubordinateExpenses, setLocalSubordinateExpenses,
                dBSubordinateExpenses, setDbSubordinateExpenses,

                selectedSubordinate, setSelectedSubordinate,

                localSubordinateDetails, setLocalSubordinateDetails,
                dbSubordinateDetails, setDbSubordinateDetails,

                subordinateDetailsState, setSubordinateDetailsState,

                selectedExpenseDetails, setSelectedExpenseDetails,
            }}
        >
            {children}
        </ApprovalContext.Provider>
    )
}