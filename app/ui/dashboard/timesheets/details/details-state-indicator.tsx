import { useContext } from "react";
import { TimesheetContext } from "../timesheet-context-wrapper";

export default function DetailsStateIndicator() {
	const context = useContext(TimesheetContext);
    if (context == null) {
		throw new Error(
			"context has to be used within <TimesheetContext.Provider>"
		);
	}

    let stateDisplayText = "";
    let stateStyles = "";
    switch (context.timesheetDetailsState) {
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