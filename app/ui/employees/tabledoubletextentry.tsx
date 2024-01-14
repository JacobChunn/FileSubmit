import { colors } from '@material-tailwind/react/types/generic'
import { Typography } from '@/app/ui/employees/client-components/textentry-material-tailwind-components'
import { variant } from '@material-tailwind/react/types/components/typography'


export type Props = {
    classes: string,
    text1?: any,
    text2?: any,
    variant?: variant,
    color?: colors,
    addonStyles1?: string,
    addonStyles2?: string,
}

export default function TableDoubleTextEntry({classes, text1="", text2="", variant="small", color="blue-gray", addonStyles1="", addonStyles2=""} : Props) {
    return(
        <td className={classes}>
            <div className="flex flex-col">
                <Typography
                    variant={variant}
                    color={color}
                    className={"font-normal " + addonStyles1}
                >
                    {text1}
                </Typography>
                <Typography
                    variant={variant}
                    color={color}
                    className={"font-normal " + addonStyles2}
                >
                    {text2}
                </Typography>
            </div>
        </td>
    )
}