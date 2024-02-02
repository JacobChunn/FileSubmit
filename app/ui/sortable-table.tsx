"use client"
import { 
	Card, CardHeader, CardBody, CardFooter, Typography, Button, Tabs, 
	TabsHeader, Tab, Input, Avatar, Chip, Tooltip, IconButton,
} from "@/app/ui/employees/client-components/sortable-table-material-tailwind-components";
import {
	MagnifyingGlassIcon,
	ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import TableBoolEntry from "./employees/main/table-bool-entry";
import TableTextEntry from "./employees/main/tabletextentry";
import TableDoubleTextEntry from "./employees/main/tabledoubletextentry";
import { useEffect, useState, Children } from "react";
import { TabType } from "@/app/lib/definitions";
import TableCheckEntry from "./employees/main/table-check-entry";
import Link from "next/link";




const TABLE_HEAD = [
	"Employee", "Cell/Home", "Employee Status", "Contractor Status", "Login", "Numeric ID", "Manager ID",
	"Access Level", "Timesheet Required", "Overtime Eligible", "Tab Navigate", "Email Expense Copy",
	"I Enter Time Data", "Sheet Summaries", "Expense Summaries", "Default Rows", "ID"
];

const demoImg = "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg";

export default function SortableTable<T>({
	children,
	dataPromise,
	TABS,
	tabFilterUnbound,
}: {
	children: React.ReactNode;
	dataPromise: Promise<T[]>;
	TABS: readonly TabType[];
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
		<Card className="h-full w-full">
			<CardHeader floated={false} shadow={false} className="rounded-none">
				<div className="mb-8 flex items-center justify-between gap-8">
					<div>
						<Typography variant="h5" color="blue-gray">
							Employee list
						</Typography>
						<Typography color="gray" className="mt-1 font-normal">
							See information about all employees
						</Typography>
					</div>
					<div className="flex shrink-0 flex-col gap-2 sm:flex-row">
						{/* CHANGE TO NEXT.js LINK COMPONENT FOR PREFETCHING!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
						<a href="/dashboard/employees/add"> 
							<Button className="flex items-center gap-3" size="sm">
								<UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Employee
							</Button>
						</a>
					</div>
				</div>
				<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
					<Tabs value="active" className="w-full md:w-max">
						<TabsHeader>
							{TABS.map(({ label, value }) => (
								<Tab key={value} value={value} onClick={() => {setTabValue(value); console.log(value)}}>
									&nbsp;&nbsp;{label}&nbsp;&nbsp;
								</Tab>
							))}
						</TabsHeader>
					</Tabs>
					<div className="w-full md:w-72">
						<Input
							label="Search"
							icon={<MagnifyingGlassIcon className="h-5 w-5" />}
							crossOrigin="anonymous"
						/>
					</div>
				</div>
			</CardHeader>
			<CardBody className="overflow-x-auto px-0">
				<table id="employees-table" className="mt-4 w-full table-auto text-left">
					<thead>
						<tr>
							{TABLE_HEAD.map((head, index) => (
								<th
									key={head + index}
									className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 py-4 px-2 transition-colors hover:bg-blue-gray-50 text-left"
								>
									<Typography
										variant="small"
										color="blue-gray"
										className="font-normal leading-none opacity-70"
									>
										{head}

									</Typography>
									{/*" "*/}{/*index !== TABLE_HEAD.length - 1 && (
											<ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
									)*/}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{data !== undefined ? (
							Array.isArray(data) && 
							data
								.filter(tabFilter)
								//.filter(searchFilter)
								.map(
								// Skip password
								(rowData, index) => {
									const isLast = index === data.length - 1;
									const classes = isLast
										? "p-2"
										: "p-2 border-b border-blue-gray-50";

									return (
										<div>
											{Children.map(
												children,
												(child) => (
													<div>{child}</div>
												)												
											)}
										</div>
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
			</CardBody>
		</Card>
	);
}