'use client'

import { deleteTimesheet } from "@/app/lib/actions"
import { Button } from "@/app/ui/button"

export function DeleteTimesheetButton({id}: {id: number}) {
    return (
        <Button onClick={() => deleteTimesheet(id)}>
            Confirm
        </Button>
    )
}