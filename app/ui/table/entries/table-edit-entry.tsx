import { PencilIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { Tooltip, IconButton } from "@/app/ui/material-tailwind-wrapper";

export type Props<T, K extends keyof T> = {
    data?: T,
    dataProperty: K,
	hrefBeforeID?: string,
	hrefAfterID?: string,
    rowStyles?: string,
}

export default function TableEditEntry<T, K extends keyof T>({
    data,
    dataProperty,
	hrefBeforeID = "",
	hrefAfterID = "",
    rowStyles,
}: Props<T, K>
) {
    if (!data) throw Error("Data is undefined :(");

    const id = data[dataProperty];

    return (
		<td className={rowStyles}>
			<Link href={hrefBeforeID + id + hrefAfterID}>
				<Tooltip content="Edit User">
					<IconButton variant="text">
						<PencilIcon className="h-4 w-4" />
					</IconButton>
				</Tooltip>
			</Link>
		</td>
    )
}