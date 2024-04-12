import { Typography } from "@/app/ui/material-tailwind-wrapper"
import { DateTime } from "luxon";

export default function DateEntry({
    variant,
    color,
    children,
}: {
    variant?: 'small'
    color?: 'blue-gray'
    children?: React.ReactNode
}) {
    if (!children) return null;
	const date = new Date(children as string);
	const formattedDate = DateTime.fromJSDate(date).setZone('utc').toLocaleString();
    return (
        <Typography
            variant={variant}
            color={color}
            className={`font-normal text-blue-gray-900 text-xs`}
        >
            {formattedDate}
            
        </Typography>
    )
}