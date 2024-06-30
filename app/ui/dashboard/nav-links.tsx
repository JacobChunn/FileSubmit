'use client';

import {
  UserGroupIcon,
  BriefcaseIcon,
  DocumentIcon,
  BanknotesIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
	{ name: 'Timesheets', href: '/dashboard', icon: DocumentIcon },
	{ name: 'Expenses', href: '/dashboard/expenses', icon: BanknotesIcon },
	{ name: 'Employees', href: '/dashboard/employees', icon: UserGroupIcon },
	{ name: 'Projects', href: '/dashboard/projects', icon: BriefcaseIcon },
	{ name: 'Approvals', href: '/dashboard/approvals', icon: CheckCircleIcon}
];

export default function NavLinks({
	displayText,
}: {
	displayText: boolean,
}) {
	const pathname = usePathname();
	const [fadeClass, setFadeClass] = useState('');

	useEffect(() => {
		if (displayText) {
			setFadeClass('duration-300 max-w-min opacity-100');
		} else {
			setFadeClass('duration-75 max-w-0 opacity-0');
		}
	}, [displayText]);
	
	return (
		<>
			{links.map((link) => {
				const LinkIcon = link.icon;
				return (
				<Link
					key={link.name}
					href={link.href}
					className={clsx(
					"flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
					{
					'bg-sky-100 text-blue-600': pathname === link.href,
					},
					)}
				>
					<LinkIcon className="w-6 h-6" />
					<div className={`transition-all ${fadeClass}`}>{link.name}</div>
				</Link>
				);
			})}
		</>
	);
}
