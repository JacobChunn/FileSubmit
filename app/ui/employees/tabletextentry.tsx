import { colors } from '@material-tailwind/react/types/generic'
import { Typography } from '@/app/ui/employees/textentry-material-tailwind-components'
import { variant } from '@material-tailwind/react/types/components/typography'

export type Props = {
    classes: string,
    text?: any,
    variant?: variant,
    color?: colors,
}

export default function TableTextEntry({classes, text="", variant="small", color="blue-gray", } : Props) {
    return(
        <td className={classes}>
            <Typography
                    variant={variant}
                    color={color}
                    className="font-normal"
                >
                    {text}
                </Typography>
        </td>
    )
}