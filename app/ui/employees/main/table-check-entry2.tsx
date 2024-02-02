import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

export type Props<T, K extends keyof T> = {
    data?: T
    dataProperty: K,
    rowStyles?: string,
	trueStyles?: string,
	falseStyles?: string,
}

export default function TableCheckEntry2<T, K extends keyof T>(
    {data, dataProperty, rowStyles, trueStyles = "", falseStyles = ""} : Props<T,K>
) {
    if (!data) throw Error("Data is undefined :(");

    const condition = data[dataProperty] == true;

    return (
        <td className={rowStyles}>
            <div className={`w-fit p-1 rounded-lg ${condition ? "bg-green-200" : "bg-red-200"}`}>

				{condition ? 
					(<CheckIcon strokeWidth="2" className={`w-5 text-green-700 ${trueStyles}`}/>)
					:
					(<XMarkIcon strokeWidth="2" className={`w-5 text-red-700 ${falseStyles}`}/>)
				}
            </div>
        </td>
    )
}