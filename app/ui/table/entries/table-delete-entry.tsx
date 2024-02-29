import Link from "next/link";
import { Tooltip, IconButton } from "@/app/ui/material-tailwind-wrapper";
import { TrashIcon } from "@heroicons/react/24/outline";

export type Props<T, K extends keyof T> = {
    data?: T,
    dataProperty: K,
	hrefBeforeID?: string,
	hrefAfterID?: string,
    rowStyles?: string,
}

export default function TableDeleteEntry<T, K extends keyof T>({
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
				<Tooltip content="Delete Entry">
					<IconButton variant="text">
						<TrashIcon className="h-4 w-4" />
					</IconButton>
				</Tooltip>
			</Link>
		</td>
    )
}