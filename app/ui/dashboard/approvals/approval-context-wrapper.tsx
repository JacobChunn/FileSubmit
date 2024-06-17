"use client"

import { SubordinateTuple } from "@/app/lib/definitions";
import { createContext, useState } from "react";

type approvalContextType = {
    subordinates: SubordinateTuple[] | null;
    setSubordinates: React.Dispatch<React.SetStateAction<SubordinateTuple[] | null>>;
}

export const ApprovalContext = createContext<approvalContextType | null>(null)

export default function ApprovalContextWrapper({
    children,
}: {
    children: React.ReactNode,
}) {
	const [subordinates, setSubordinates] = useState<SubordinateTuple[] | null>(null);


    return (
        <ApprovalContext.Provider
            value={{
				subordinates, setSubordinates,
            }}
        >
            {children}
        </ApprovalContext.Provider>
    )
}