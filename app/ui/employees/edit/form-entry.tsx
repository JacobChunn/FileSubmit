import { EmployeeState } from "@/app/lib/actions"
import { ChangeEvent, useState } from "react";

export type Props = {
    state: EmployeeState,
    type: string,
    label: string,
    inputId: string,
    inputName: string,
    value: string | number,
}

export default function FormTextEntry({ state, type, label, inputId, inputName, value }: Props) {
    const [originalValue, setOriginalValue] = useState(value);
    const [currentValue, setCurrentValue] = useState(value);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCurrentValue(e.target.value);
    };

    return (
        <div className="mb-4">
            <label htmlFor={inputId} className={`mb-2 block text-sm font-medium ${originalValue === currentValue ? "text-black" : "text-blue-600"}`}>
                {label}
            </label>
            <div className={`relative`}>
                <input
                    id={inputId}
                    name={inputName}
                    type={type}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    className={`peer block ${type === 'checkbox' ? 'w-4 h-' : 'w-full'} rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500`}
                    aria-describedby={`${inputId}-error`}
                    onWheel={(e) => e.currentTarget.blur()}
                    onChange={handleChange}
                    value={currentValue}
                />
            </div>
            <div id={`${inputId}-error`} aria-live="polite" aria-atomic="true">
                {state.errors?.[inputName] &&
                    state.errors[inputName]?.map((error: string | number) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                            {error}
                        </p>
                    ))}
            </div>
        </div>
    );
}