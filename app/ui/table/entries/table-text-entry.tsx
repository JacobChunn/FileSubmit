import { colors } from '@material-tailwind/react/types/generic'
import { Typography } from '@/app/ui/material-tailwind-wrapper'
import { variant } from '@material-tailwind/react/types/components/typography'

export type Props<T, K extends keyof T> = {
    data?: T,
    dataProperty: K,
    rowStyles?: string,
    variant?: variant,
    color?: colors,
    addonStyles?: string,
}

export default function TableTextEntry<T, K extends keyof T>({
    data,
    dataProperty,
    rowStyles,
    variant="small",
    color="blue-gray",
    addonStyles
}: Props<T, K>
) {
    if (!data) throw Error("Data is undefined :(");

    const text = data[dataProperty] as string;
    return (
        <td className={rowStyles}>
            <Typography
				variant={variant}
				color={color}
				className={`font-normal text-blue-gray-900 text-xs ${addonStyles}`}
            >
                {text}
            </Typography>
        </td>
    )
}