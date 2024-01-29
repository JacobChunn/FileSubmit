export type Props = {
    condition: boolean,
    rowStyles?: string,
    trueText?: string,
    falseText?: string,
    trueAddStyles?: string,
    falseAddStyles?: string,
}

export default function TableBoolEntry(
    {
		condition,
		rowStyles,
		trueText = "",
		falseText = "",
		trueAddStyles = "bg-green-200 text-green-800",
		falseAddStyles = "bg-red-200 text-red-800",
	} : Props
) {
    return (
        <td className={rowStyles}>
            <div 
				className={`w-fit px-2 py-1.5 rounded-xl text-sm font-sans font-normal antialiased ${
					condition==true ? trueAddStyles : falseAddStyles
				}`}
			>

				{condition==true ?
					trueText
					:
					falseText
				}
                {/* <Chip
                    className='' // change?
                    variant="ghost"
                    size="sm"
                    value={condition==true ? valueTextWhenTrue : valueTextWhenFalse}
                    color={condition==true ? colorWhenTrue : colorWhenFalse}
                    icon={
                        condition==true ?
                            valueTextWhenTrue === "" ? (
                                <CheckIcon strokeWidth="2" className=''/> // change? cant affect internal div between this change and upper div inside of chip
                            ) : null                                                    // may have to resort to making my own chip
                            :
                            valueTextWhenFalse == "" ? (
                               <XMarkIcon strokeWidth="2" className=''/> 
                            ) : null
                        }
                /> */}
            </div>
        </td>
    )
}