import { Chip } from '@/app/ui/employees/client-components/boolentry-material-tailwind-components'
import { colors } from '@material-tailwind/react/types/generic'

export type Props = {
    condition: boolean,
    classes: string,
    valueTextWhenTrue?: string,
    valueTextWhenFalse?: string,
    colorWhenTrue?: colors,
    colorWhenFalse?: colors,
}

export default function TableBoolEntry(
    {condition, classes, valueTextWhenTrue = "True", valueTextWhenFalse = "False", colorWhenTrue = "green", colorWhenFalse = "red"} : Props
) {
    return (
        <td className={classes}>
            <div className="w-max">
                <Chip
                    variant="ghost"
                    size="sm"
                    value={condition==true ? valueTextWhenTrue : valueTextWhenFalse}
                    color={condition==true ? colorWhenTrue : colorWhenFalse}
                />
            </div>
        </td>
    )
}