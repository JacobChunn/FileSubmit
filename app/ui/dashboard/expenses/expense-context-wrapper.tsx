"use client"

import { Expense, ExpenseDetailsExtended, SavingState } from "@/app/lib/definitions";
import { DateTime } from "luxon";
import { createContext, useState } from "react";

type expenseContextType = {
    selectedExpense: number | null;
    setSelectedExpense: React.Dispatch<React.SetStateAction<number | null>>;

    localExpenses: Expense[] | null;
    setLocalExpenses: React.Dispatch<React.SetStateAction<Expense[] | null>>;

    localExpenseDetails: ExpenseDetailsExtended[] | null;
    setLocalExpenseDetails: React.Dispatch<React.SetStateAction<ExpenseDetailsExtended[] | null>>;

    databaseExpenseDetails: ExpenseDetailsExtended[] | null;
    setDatabaseExpenseDetails: React.Dispatch<React.SetStateAction<ExpenseDetailsExtended[] | null>>;

    expenseDetailsState: SavingState;
    setExpenseDetailsState: React.Dispatch<React.SetStateAction<SavingState>>;

	localExpenseDateStart: DateTime<true> | DateTime<false> | null;
	setLocalExpenseDateStart: React.Dispatch<React.SetStateAction<DateTime<true> | DateTime<false> | null>>;

	databaseExpenseDateStart: DateTime<true> | DateTime<false> | null;
	setDatabaseExpenseDateStart: React.Dispatch<React.SetStateAction<DateTime<true> | DateTime<false> | null>>;

    expenseIsSaving: boolean;
    setExpenseIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ExpenseContext = createContext<expenseContextType | null>(null)

export default function ExpenseContextWrapper({
    children,
}: {
    children: React.ReactNode,
}) {

	const [selectedExpense, setSelectedExpense] = useState<number | null>(null);
    const [localExpenses, setLocalExpenses] = useState<Expense[] | null>(null);
    const [localExpenseDetails, setLocalExpenseDetails] = useState<ExpenseDetailsExtended[] | null>(null);
    const [databaseExpenseDetails, setDatabaseExpenseDetails] = useState<ExpenseDetailsExtended[] | null>(null);
    const [expenseDetailsState, setExpenseDetailsState] = useState<SavingState>(null);
	const [localExpenseDateStart, setLocalExpenseDateStart] = useState<DateTime<true> | DateTime<false> | null>(null);
	const [databaseExpenseDateStart, setDatabaseExpenseDateStart] = useState<DateTime<true> | DateTime<false> | null>(null);
    const [expenseIsSaving, setExpenseIsSaving] = useState<boolean>(false);

    return (
        <ExpenseContext.Provider
            value={{
                selectedExpense, setSelectedExpense,
                localExpenses, setLocalExpenses,
                localExpenseDetails, setLocalExpenseDetails,
                databaseExpenseDetails, setDatabaseExpenseDetails,
                expenseDetailsState, setExpenseDetailsState,
				localExpenseDateStart, setLocalExpenseDateStart,
				databaseExpenseDateStart, setDatabaseExpenseDateStart,
                expenseIsSaving, setExpenseIsSaving,
            }}
        >
            {children}
        </ExpenseContext.Provider>
    )
}