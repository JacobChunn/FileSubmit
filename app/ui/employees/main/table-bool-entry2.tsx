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
    if (!data) return (
        <td>
            Row Not Found
        </td>
    )

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
            </div>
        </td>
    )
}