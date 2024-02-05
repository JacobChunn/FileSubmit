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
import { useEffect, useState, Children, cloneElement } from "react";
import { TabType } from "@/app/lib/definitions";
import Link from "next/link";

export default function SortableTable<T>({ // Split into header + body components
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
	children: React.ReactNode;
	title: string,
	addText: string,
	addHref: string,
	description: string,
	dataPromise: Promise<T[]>;
	TABLE_HEAD: readonly string[],
	TABS: readonly TabType[];
	defaultTabValue: typeof TABS[number]['value'];
	tabFilterUnbound: (data: T, tabValue: typeof TABS[number]['value']) => boolean
}) {
	type TabValueType = typeof TABS[number]['value'];

	const tabFilter = (data: T) => tabFilterUnbound(data, tabValue);

	const [data, setData] = useState<T[] | undefined>(undefined);
	const [tabValue, setTabValue] = useState<TabValueType>(TABS[0]["value"]);
	console.log("Hello from sortableTable");
	

	useEffect(() => {
		const handleDataPromise = async() => {
			const returnedData = await dataPromise;
			setData(returnedData);
		}
		
		handleDataPromise();
	
	}, []);



	return (
		<Card className="w-full relative p-4">
			<div  className="sticky top-0 h-fit rounded-lg w-full bg-white z-50">
				<div className="mb-8 flex items-center justify-between gap-8">
					<div>
						<Typography variant="h5" color="blue-gray">
							{title}
						</Typography>
						<Typography color="gray" className="mt-1 font-normal">
							{description}
						</Typography>
					</div>
					<div className="sticky right-5">
						<Link href={addHref}> 
							<Button className="flex items-center gap-3" size="sm">
								<UserPlusIcon strokeWidth={2} className="h-4 w-4" /> {addText}
							</Button>
						</Link>
					</div>
				</div>
				<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
					<Tabs value={defaultTabValue} className="w-full md:w-max">
						<TabsHeader>
							{TABS.map(({ label, value }) => (
								<Tab key={value} value={value} onClick={() => {setTabValue(value); console.log(value)}}>
									&nbsp;&nbsp;{label}&nbsp;&nbsp;
								</Tab>
							))}
						</TabsHeader>
					</Tabs>
					<div className="sticky right-5 w-full md:w-72">
						<Input
							label="Search"
							icon={<MagnifyingGlassIcon className="h-5 w-5" />}
							crossOrigin="anonymous"
						/>
					</div>
				</div>
			</div>
			<div className="px-0 max-w-full">
				<div className="overflow-x-auto">
					<table id="employees-table" className="w-full mt-4 table-auto text-left">
						<thead>
							<tr>
								{TABLE_HEAD.map((head, index) => (
									<th
										key={head + index}
										className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 py-4 px-2 transition-colors hover:bg-blue-gray-50 text-left"
									>
										<div
											className="font-normal leading-none text-blue-gray-900 opacity-80 text-xs"
										>
											{head}
										</div>
										{/*" "*/}{/*index !== TABLE_HEAD.length - 1 && (
												<ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
										)*/}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="min-w-full">
							{data !== undefined ? (
								Array.isArray(data) && 
								data
									.filter(tabFilter)
									//.filter(searchFilter)
									.map(
									// Skip password
									(rowData, index) => {
										const isLast = index === data.length - 1;
										const inAllClasses = "p-2 align-middle "
										const classes = isLast
											? inAllClasses
											: inAllClasses + "border-b border-blue-gray-50";

										return (
											<tr key={index}>
												{Children.map(
													children,
													(child) => 
														cloneElement(child as React.ReactElement<any>, {
															data: rowData,
															rowStyles: classes
														})
																	
												)}
											</tr>
										);
									},
								)
							) : (
								<tr>
									<td>
										...Loading
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</Card>
	);
}