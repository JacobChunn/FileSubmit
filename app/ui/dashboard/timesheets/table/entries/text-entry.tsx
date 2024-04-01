import { Typography } from "@/app/ui/material-tailwind-wrapper"

export default function TextEntry({
    variant,
    color,
    children,
}: {
    variant?: 'small'
    color?: 'blue-gray'
    children: React.ReactNode
}) {
    const childType = typeof(children);
    return (
        <Typography
            variant={variant}
            color={color}
            className={`font-normal text-blue-gray-900 text-xs`}
        >
        {childType === 'string' || childType == 'number' ?
            children
            :
            null
        }
    </Typography>
    )
}