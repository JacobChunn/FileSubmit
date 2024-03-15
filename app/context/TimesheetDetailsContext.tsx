'use client';

import { createContext, useState } from 'react';

type TimesheetDetailsOptions = {
    projects: string[] | null;
    phases: string[] | null;
    costcodes: string[] | null;
};

type TimesheetDetailsContextType = {
    options: TimesheetDetailsOptions;
    setOptions: (options: TimesheetDetailsOptions) => void;
}

export const TimesheetDetailsContext = createContext<TimesheetDetailsContextType | null>(null);

export const CounterProvider = (children: React.ReactNode) => {
    const initialOptions = {
        projects: null,
        phases: null,
        costcodes: null,
    } satisfies TimesheetDetailsOptions
    const [options, setOptions] = useState<TimesheetDetailsOptions>(initialOptions);

    return (
        <TimesheetDetailsContext.Provider value={{ options, setOptions }}>
            {children}
        </TimesheetDetailsContext.Provider>
    );
};