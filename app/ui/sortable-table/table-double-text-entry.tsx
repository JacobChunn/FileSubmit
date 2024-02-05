import { colors } from '@material-tailwind/react/types/generic'
import { Typography } from '@/app/ui/material-tailwind-wrapper'
import { variant } from '@material-tailwind/react/types/components/typography'


export type Props<T, K extends keyof T> = {
    data?: T,
    dataProperty1: K,
    dataProperty2: K,
    rowStyles?: string,
    variant?: variant,
    color?: colors,
    addonStyles1?: string,
    addonStyles2?: string,
}

export default function TableDoubleTextEntry<T, K extends keyof T>({
    data,
    dataProperty1,
    dataProperty2,
    rowStyles,
    variant="small",
    color="blue-gray",
    addonStyles1="",
    addonStyles2=""
}: Props<T, K>
) {
    if (!data) throw Error("Data is undefined :(");

    const text1 = data[dataProperty1] as string;
    const text2 = data[dataProperty2] as string;

    return(        
        <td className={rowStyles}>
            <div className="flex flex-col">
                <Typography
                    variant={variant}
                    color={color}
                    className={"font-normal whitespace-nowrap " + addonStyles1}
                >
                    {text1}
                </Typography>
                <Typography
                    variant={variant}
                    color={color}
                    className={"font-normal whitespace-nowrap " + addonStyles2}
                >
                    {text2}
                </Typography>
            </div>
        </td>
    )
}