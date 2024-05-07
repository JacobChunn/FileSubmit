import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function BoolEntry({
    variant,
    color,
    children,
}: {
    variant?: 'small'
    color?: 'blue-gray'
    children: React.ReactNode
}) {
    const childType = typeof(children);

    return (
        childType === 'boolean' ?
            (<div className={`flex justify-center items-center w-5 h-5 p-1 rounded-lg ${children ? "bg-green-200" : "bg-red-200"}`}>
                {children ? 
                    (<CheckIcon strokeWidth="2" className='w-3 h-3 text-green-700'/>)
                    :
                    (<XMarkIcon strokeWidth="2" className='w-3 h-3 text-red-700'/>)
                }
            </div>)
            :
            null
    )
}
