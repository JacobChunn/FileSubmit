"use client"

import { IconButton, Tooltip } from "@/app/ui/material-tailwind-wrapper";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useContext } from "react";
import { TimesheetContext } from "../timesheet-context-wrapper";

type Props = {
    index: number,
    hidden: boolean,
}

export default function DeleteDetailButton({
    index,
    hidden,
}: Props) {
    const context = useContext(TimesheetContext);
    if (!context) {
        console.error("Component must be used within the TimesheetContext context!")
        return null;
    }

    const handleOnClick = () => {
        console.log(index);
        const currentTSDs = context.localTimesheetDetails || [];
        context.setLocalTimesheetDetails(null);
        context.setLocalTimesheetDetails(() => {
    
            console.log([
                ...currentTSDs.slice(0, index),
                ...currentTSDs.slice(index + 1)
            ]);
            if (!currentTSDs) return [];
            return [
                ...currentTSDs.slice(0, index),
                ...currentTSDs.slice(index + 1)
            ]
        });
    }

    return (
        <div hidden={hidden}>
            <IconButton
                className="flex items-center justify-center"
                variant='text'
                type='button'
                onClick={handleOnClick}
            
            >
                <Tooltip content='Delete Entry'>
                    <TrashIcon className='w-4 h-4' />
                </Tooltip>
            </IconButton>
        </div>
    )
}