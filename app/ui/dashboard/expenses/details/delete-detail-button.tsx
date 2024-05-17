"use client"

import { IconButton, Tooltip } from "@/app/ui/material-tailwind-wrapper";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useContext } from "react";
import { ExpenseContext } from "../expense-context-wrapper";

type Props = {
    index: number,
    hidden: boolean,
}

export default function DeleteDetailButton({
    index,
    hidden,
}: Props) {
    const context = useContext(ExpenseContext);
    if (!context) {
        console.error("Component must be used within the ExpenseContext context!")
        return null;
    }

    const handleOnClick = () => {
        console.log(index);
        const currentEXDs = context.localExpenseDetails || [];
        context.setLocalExpenseDetails(null);
        context.setLocalExpenseDetails(() => {
    
            console.log([
                ...currentEXDs.slice(0, index),
                ...currentEXDs.slice(index + 1)
            ]);
            if (!currentEXDs) return [];
            return [
                ...currentEXDs.slice(0, index),
                ...currentEXDs.slice(index + 1)
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