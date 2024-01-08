"use client"
import { fetchEmployees } from "@/app/lib/data";
import { Card, CardHeader, CardBody, CardFooter, Typography, Button, Tabs, TabsHeader, Tab, Input, Avatar, Chip, Tooltip, IconButton } from "@/app/ui/employees/sortable-table-material-tailwind-components";
import {
	MagnifyingGlassIcon,
	ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import TableBoolEntry from "./tableboolentry";
import TableTextEntry from "./tabletextentry";
import TableDoubleTextEntry from "./tabledoubletextentry";
import { useEffect, useState } from "react";
import { Employees } from "@/app/lib/definitions";
import { QueryResult } from "@vercel/postgres";
import { employees } from "@/app/lib/placeholder-data";

const axios = require('axios');

const TABS = [
	{
		label: "All",
		value: "all",
	},
	{
		label: "Monitored",
		value: "monitored",
	},
	{
		label: "Unmonitored",
		value: "unmonitored",
	},
];

const TABLE_HEAD = [
	"Employee", "Cell/Home", "Employee Status", "Contractor Status", "Login", "Numeric ID", "Manager ID",
	"Access Level", "Timesheet Required", "Overtime Eligible", "Tab Navigate", "Email Expense Copy",
	"I Enter Time Data", "Sheet Summaries", "Expense Summaries", "Default Rows", "ID"
];

const TABLE_ROWS = [
	{
		img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg",
		name: "John Michael",
		email: "john@creative-tim.com",
		job: "Manager",
		org: "Organization",
		online: true,
		date: "23/04/18",
	},
	{
		img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-2.jpg",
		name: "Alexa Liras",
		email: "alexa@creative-tim.com",
		job: "Programator",
		org: "Developer",
		online: false,
		date: "23/04/18",
	},
	{
		img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-1.jpg",
		name: "Laurent Perrier",
		email: "laurent@creative-tim.com",
		job: "Executive",
		org: "Projects",
		online: false,
		date: "19/09/17",
	},
	{
		img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-4.jpg",
		name: "Michael Levi",
		email: "michael@creative-tim.com",
		job: "Programator",
		org: "Developer",
		online: true,
		date: "24/12/08",
	},
	{
		img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-5.jpg",
		name: "Richard Gran",
		email: "richard@creative-tim.com",
		job: "Manager",
		org: "Executive",
		online: false,
		date: "04/10/21",
	},
];

export default function SortableTable() {
	const [employees, setEmployees] = useState<Employees[] | undefined>(undefined);
	const [isLoading, setLoading] = useState<boolean>(true);
	//let employees : Employees[] | undefined = undefined;
	//let loading : boolean = true;
	//console.log("Initial Data: " + employees)
	//let employees : Employees[];

	//const employees = await fetchEmployees2();

	console.log("Hello from sortableTable");
	//TODO: FINISH CUSTOM WIDTH IMPLEMENTATION, ADD UPDATE ON DATA CHANGE
	
	useEffect(() => {
		fetch('/api/employees')
		.then((res) => res.json())
		.then((data : Employees[]) => {
			//console.log("After Set Data: " + JSON.stringify((data as QueryResult<Employees>).rows));

			setEmployees(data);
			//employees = data;

			//console.log("After data set: ");
			//console.log(employees);
			setLoading(false);
			//loading = false;
		})
		/*
		const calculateColumnWidths = () => {


			const table = document.getElementById('employees-table');
			if (!table) return;

			const headerCells = table.querySelectorAll('th');
			const bodyCells = table.querySelectorAll('td');

			for (let i = 0; i < headerCells.length; i++) {
				const headerWidth = headerCells[i].offsetWidth;
				const bodyWidth = bodyCells[i].offsetWidth;

				const columnWidth = Math.max(headerWidth, bodyWidth);
				headerCells[i].style.minWidth = `${columnWidth}px`;

				for (let j = 0; j < bodyCells.length; j += headerCells.length) {
					bodyCells[i + j].style.minWidth = `${columnWidth}px`;
				}
			}
		};

		calculateColumnWidths();

		// Recalculate on window resize
		window.addEventListener('resize', calculateColumnWidths);



		return () => {
			window.removeEventListener('resize', calculateColumnWidths);
		};
		*/
	}, []);

	  

	return (
		<Card className="h-full w-full">
			<CardHeader floated={false} shadow={false} className="rounded-none">
				<div className="mb-8 flex items-center justify-between gap-8">
					<div>
						<Typography variant="h5" color="blue-gray">
							Members list
						</Typography>
						<Typography color="gray" className="mt-1 font-normal">
							See information about all members
						</Typography>
					</div>
					<div className="flex shrink-0 flex-col gap-2 sm:flex-row">
						<Button variant="outlined" size="sm">
							view all
						</Button>
						<Button className="flex items-center gap-3" size="sm">
							<UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add member
						</Button>
					</div>
				</div>
				<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
					<Tabs value="all" className="w-full md:w-max">
						<TabsHeader>
							{TABS.map(({ label, value }) => (
								<Tab key={value} value={value}>
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
			<CardBody className="overflow-scroll px-0">
				<table id="employees-table" className="mt-4 w-full min-w-min table-auto text-left">
					<thead>
						<tr>
							{TABLE_HEAD.map((head, index) => (
								<th
									key={head + index}
									className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
								>
									<Typography
										variant="small"
										color="blue-gray"
										className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
									>
										{head}{" "}
										{index !== TABLE_HEAD.length - 1 && (
											<ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
										)}
									</Typography>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{employees !== undefined && !isLoading  ? (
							Array.isArray(employees) && employees.map(
								// Skip password
								({ id, number, username, firstname, lastname, cellphone, homephone, email, 
									managerid, accesslevel, timesheetrequired, overtimeeligible, tabNavigateot, 
									emailexpensecopy, activeemployee, ientertimedata, numtimesheetsummaries, 
									numexpensesummaries, numdefaulttimeRows, contractor}, index) => {
									const isLast = index === employees.length - 1;
									const classes = isLast
										? "p-4"
										: "p-4 border-b border-blue-gray-50";

									return (
										<tr key={firstname + index}>
											
											<td className={classes}>
												<Avatar src={TABLE_ROWS[0].img} alt={firstname} variant="rounded" />
											</td>

											{/* PFF, Name, and Email */}
											<td className={classes}>
												<div className="flex items-center gap-3">
												
													<div className="flex flex-col">
														<Typography
															variant="small"
															color="blue-gray"
															className="font-normal"
														>
															{firstname} {lastname}
														</Typography>
														<Typography
															variant="small"
															color="blue-gray"
															className="font-normal opacity-70"
														>
															{email}
														</Typography>
													</div>
												</div>
											</td>

											{/* Cell and Home Phone Numbers */}
											<TableDoubleTextEntry
												classes={classes}
												text1={cellphone}
												text2={homephone}
												addonStyles2="opacity-70"
											/>

											{/* Is Active Employee */}
											<TableBoolEntry
												condition={activeemployee}
												classes={classes}
												valueTextWhenTrue="Active"
												valueTextWhenFalse="Inactive"
											/>

											{/* Is Contractor */}
											<TableBoolEntry
												condition={contractor}
												classes={classes}
												valueTextWhenTrue="Contractor"
												valueTextWhenFalse="Employee"
												colorWhenTrue="yellow"
												colorWhenFalse="blue"
											/>

											{/* Username and Password */}
											<td className={classes}>
												<div className="flex flex-col">
													<Typography
														variant="small"
														color="blue-gray"
														className="font-normal"
													>
														{username}
													</Typography>
													<Typography
														variant="small"
														color="blue-gray"
														className="font-normal"
													>
														PASSWORD
													</Typography>
												</div>
											</td>

											{/* Number */}
											<TableTextEntry 
												classes={classes}
												text={number}
											/>

											{/* Manager ID */}


											{/* Access Level */}


											{/* Timesheet Required */}


											{/* Overtime Eligible */}


											{/* Tab Navigate */}


											{/* Email Expense Copy */}


											{/* I Enter Time Data */}


											{/* Number of Sheet Summaries */}


											{/* Number of Expense Summaries */}


											{/* Number of Default Rows */}


											{/* ID */}


											{/* Edit User */}
											<td className={classes}>
												<Tooltip content="Edit User">
													<IconButton variant="text">
														<PencilIcon className="h-4 w-4" />
													</IconButton>
												</Tooltip>
											</td>
										</tr>
									);
								},
							)
						) : (
							<tr>
								<td>
									No data available
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</CardBody>
			<CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
				<Typography variant="small" color="blue-gray" className="font-normal">
					Page 1 of 10
				</Typography>
				<div className="flex gap-2">
					<Button variant="outlined" size="sm">
						Previous
					</Button>
					<Button variant="outlined" size="sm">
						Next
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
}