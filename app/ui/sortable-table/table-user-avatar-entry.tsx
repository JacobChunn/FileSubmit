import { Avatar, Typography } from '@/app/ui/material-tailwind-wrapper'
import { UserIcon } from '@heroicons/react/24/outline';
export type Props<T, K extends keyof T> = {
    data?: T,
    firstnameDataProperty: K,
	lastnameDataProperty: K,
	emailDataProperty: K,
    rowStyles?: string,
	imgURL?: string,
    imgAddStyles?: string,
	nameAddStyles?: string,
	emailAddStyles?: string,
}

export default function TableUserAvatarEntry<T, K extends keyof T>({
    data,
    firstnameDataProperty,
	lastnameDataProperty,
	emailDataProperty,
    rowStyles,
	imgURL = "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg",
    imgAddStyles,
	nameAddStyles,
	emailAddStyles,
}: Props<T, K>
) {
    if (!data) throw Error("Data is undefined :(");

    const firstname = data[firstnameDataProperty] as string;
	const lastname = data[lastnameDataProperty] as string;
	const email = data[emailDataProperty] as string;

    return(
		<td className={rowStyles}>
			<div className="flex flex-grow items-center gap-3">
				<Avatar src={imgURL} alt={firstname} variant="rounded" className={`max-w-none ${imgAddStyles}`} />
				<div className="flex flex-col">
					<Typography
						variant="small"
						color="blue-gray"
						className={`font-normal ${nameAddStyles}`}
					>
						{firstname} {lastname}
					</Typography>
					<Typography
						variant="small"
						color="blue-gray"
						className={`font-normal opacity-70 text-xs ${emailAddStyles}`}
					>
						{email}
					</Typography>
				</div>
			</div>
		</td>
    )
}