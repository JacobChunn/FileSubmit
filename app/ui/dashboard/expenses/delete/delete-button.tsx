'use client'

import { deleteExpense } from "@/app/lib/actions"
import { Button } from "@/app/ui/button"

export function DeleteExpenseButton({id}: {id: number}) {
    return (
        <Button onClick={() => deleteExpense(id)}>
            Confirm
        </Button>
    )
}