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
    const childType = typeof(children);
    console.log(childType, children)
    return (
        <Typography
            variant={variant}
            color={color}
            className={`font-normal text-blue-gray-900 text-xs`}
        >
        
            {DateTime.fromISO(children as string).setZone('utc').toLocaleString()}
            
        </Typography>
    )
}