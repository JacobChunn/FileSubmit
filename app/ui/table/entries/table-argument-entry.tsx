import { colors } from '@material-tailwind/react/types/generic'
import { Typography } from '@/app/ui/material-tailwind-wrapper'
import { variant } from '@material-tailwind/react/types/components/typography'

export type Props = {
	arg: string | number,
    rowStyles?: string,
    variant?: variant,
    color?: colors,
    addonStyles?: string,
}

export default function TableArgumentEntry({
	arg,
    rowStyles,
    variant="small",
    color="blue-gray",
    addonStyles
}: Props
) {
    return (
        <td className={rowStyles}>
            <Typography
				variant={variant}
				color={color}
				className={`font-normal text-blue-gray-900 text-xs ${addonStyles}`}
            >
                {arg}
            </Typography>
        </td>
    )
}