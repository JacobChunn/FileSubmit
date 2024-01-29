import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

export type Props = {
    condition: boolean,
    rowStyles?: string,
	trueStyles?: string,
	falseStyles?: string,
}

export default function TableCheckEntry(
    {condition, rowStyles, trueStyles = "", falseStyles = ""} : Props
) {


    return (
        <td className={rowStyles}>
            <div className={`w-fit p-1 rounded-lg ${condition==true ? "bg-green-200" : "bg-red-200"}`}>

				{condition==true ? 
					(<CheckIcon strokeWidth="2" className={`w-5 text-green-700 ${trueStyles}`}/>)
					:
					(<XMarkIcon strokeWidth="2" className={`w-5 text-red-700 ${falseStyles}`}/>)
				}
            </div>
        </td>
    )
}