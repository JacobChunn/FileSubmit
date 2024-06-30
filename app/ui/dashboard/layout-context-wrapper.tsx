"use client"

import { createContext, useState } from "react";

type layoutContextType = {
    isNavMin: boolean;
    setIsNavMin: React.Dispatch<React.SetStateAction<boolean>>;

	isTransitioning: boolean;
	setIsTransitioning: React.Dispatch<React.SetStateAction<boolean>>;

	isMinNavButtonVisible: boolean;
	setIsMinNavButtonVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LayoutContext = createContext<layoutContextType | null>(null)

export default function LayoutContextWrapper({
    children,
}: {
    children: React.ReactNode,
}) {

	const [isNavMin, setIsNavMin] = useState<boolean>(false);
	const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
	const [isMinNavButtonVisible, setIsMinNavButtonVisible] = useState<boolean>(true);

    return (
        <LayoutContext.Provider
            value={{
                isNavMin, setIsNavMin,
				isTransitioning, setIsTransitioning,
				isMinNavButtonVisible, setIsMinNavButtonVisible,
            }}
        >
            {children}
        </LayoutContext.Provider>
    )
}