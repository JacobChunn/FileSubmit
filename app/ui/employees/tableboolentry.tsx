import { Chip } from '@/app/ui/employees/client-components/boolentry-material-tailwind-components'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
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
    {condition, classes, valueTextWhenTrue = "", valueTextWhenFalse = "", colorWhenTrue = "green", colorWhenFalse = "red"} : Props
) {


    return (
        <td className={classes}>
            <div className="w-fit h-fit">
                <Chip
                    className='p-2 grid-cols-1 place-items-center relative' // change?
                    variant="ghost"
                    size="lg"
                    // value={condition==true ? valueTextWhenTrue : valueTextWhenFalse}
                    value=""
                    color={condition==true ? colorWhenTrue : colorWhenFalse}
                    icon={
                        condition==true ?
                            valueTextWhenTrue === "" ? (
                                <CheckIcon strokeWidth="2" className='w-5 p-0 static'/> // change? cant affect internal div between this change and upper div inside of chip
                            ) : null                                                    // may have to resort to making my own chip
                            :
                            valueTextWhenFalse == "" ? (
                               <XMarkIcon strokeWidth="2" className='w-5'/> 
                            ) : null
                        }
                />
            </div>
        </td>
    )
}