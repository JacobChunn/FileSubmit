import { useContext } from "react";
import { ExpenseContext } from "../expense-context-wrapper";

export default function ExpenseDetailsStateIndicator() {
	const context = useContext(ExpenseContext);
    if (context == null) {
		throw new Error(
			"context has to be used within <ExpenseContext.Provider>"
		);
	}

    let stateDisplayText = "";
    let stateStyles = "";
    switch (context.expenseDetailsState) {
        case "saved":
            stateDisplayText = "Saved!"
            stateStyles = "text-blue-500"
            break;
        case "saving":
            stateDisplayText = "Saving..."
            stateStyles = "italic"
            stateStyles = "text-yellow-500"
            break;
        case "unsaved":
            stateDisplayText = "Unsaved Changes"
            stateStyles = "italic text-red-500"
            break;
        case "signed":
            stateDisplayText = "Signed!"
            stateStyles = "text-green-500"
            break;
        default:
            stateDisplayText = "";
            break;
    }

    return (
        <div className={"flex items-center justify-center text-center w-40 " + stateStyles}>
            {stateDisplayText}
        </div>
    )

}