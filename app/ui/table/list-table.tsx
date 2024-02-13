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

export default function ListTable<T>({
	children,
	title,
	addText, // add customizable add button icon as well
	addHref,
	description,
	dataPromise,
	TABLE_HEAD,
	TABS,
	defaultTabValue,
	tabFilterUnbound,
}: {
	children: React.ReactNode,
	title: string,
	addText: string,
	addHref: string,
	description: string,
	dataPromise: Promise<T[]>,
	TABLE_HEAD: readonly string[],
	TABS: readonly TabType[],
	defaultTabValue: typeof TABS[number]['value'],
	tabFilterUnbound: (data: T, tabValue: typeof TABS[number]['value']) => boolean,
}) {
	type TabValueType = typeof TABS[number]['value'];

	const tabFilter = (data: T) => tabFilterUnbound(data, tabValue);
	
	const [tabValue, setTabValue] = useState<TabValueType>(TABS[0]["value"]);

	console.log("Hello from " + title + " list-table");

	return (
		<Card className="w-full p-4">
			<TableListHeader
				title={title}
				description={description}
				addHref={addHref}
				addText={addText}
				TABS={TABS}
				defaultTabValue={defaultTabValue}
				setTabValue={setTabValue}
			/>
			<TableBody
				children={children}
				TABLE_HEAD={TABLE_HEAD}
				dataPromise={dataPromise}
				filter={tabFilter}
			/>
		</Card>
	);
}