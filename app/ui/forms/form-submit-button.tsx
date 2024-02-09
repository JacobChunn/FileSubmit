import { StateType } from "@/app/lib/definitions";
import Link from "next/link";
import { Button } from "../button";

export type Props = {
	href: string,
	text: string,
}

export default function FormSubmitButton({
	href,
	text,
}: Props
) {

	return (
		<div className="mt-6 flex justify-end gap-4">
			<Link
				href={href}
				className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
			>
				Cancel
			</Link>
			<Button type="submit">{text}</Button>
		</div>
	)
}