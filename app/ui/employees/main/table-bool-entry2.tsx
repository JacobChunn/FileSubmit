export type Props<T, K extends keyof T> = {
    data?: T,
    dataProperty: K,
    rowStyles?: string,
    trueText?: string,
    falseText?: string,
    trueAddStyles?: string,
    falseAddStyles?: string,
}

export default function TableBoolEntry2<T, K extends keyof T>(
    {
        data,
		dataProperty,
		rowStyles,
		trueText = "",
		falseText = "",
		trueAddStyles = "bg-green-200 text-green-800",
		falseAddStyles = "bg-red-200 text-red-800",
	} : Props<T, K>
) {
    const condition = data[dataProperty]==true;

    return (
        <td className={rowStyles}>
            <div 
				className={`w-fit px-2 py-1.5 rounded-xl text-sm font-sans font-normal antialiased ${
					condition ? trueAddStyles : falseAddStyles
				}`}
			>

				{condition ?
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