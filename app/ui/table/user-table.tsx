"use client"
import { 
	Card, CardHeader, CardBody, Typography, Button, Tabs, 
	TabsHeader, Tab, Input,
} from "@/app/ui/material-tailwind-wrapper";
import {
	MagnifyingGlassIcon,
	ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { useEffect, useState, Children, cloneElement, SetStateAction } from "react";
import { TabType } from "@/app/lib/definitions";
import Link from "next/link";
import TableBody from "./table-body";
import TableListHeader from "./table-list-header";
import TableUserHeader from "./table-user-header";

export default function UserTable<T>({
	children,
	title,
	addHref,
	addText,
	dataPromise,
	TABLE_HEAD,
}: {
	children: React.ReactNode,
	title: string,
	addHref: string,
	addText: string,
	dataPromise: Promise<T[]>,
	TABLE_HEAD: readonly string[],
}) {
	console.log("Hello from " + title + " user-table");

	return (
		<Card className="w-full p-4">
			<TableUserHeader
				title={title}
				addHref={addHref}
				addText={addText}
			/>
			<TableBody
				children={children}
				TABLE_HEAD={TABLE_HEAD}
				dataPromise={dataPromise}
			/>
		</Card>
	);
}