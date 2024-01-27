"use client"
import { 
	Card, CardHeader, CardBody, CardFooter, Typography, Button, Tabs, 
	TabsHeader, Tab, Input, Avatar, Chip, Tooltip, IconButton,
} from "@/app/ui/employees/client-components/sortable-table-material-tailwind-components";
import {
	MagnifyingGlassIcon,
	ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon, UserMinusIcon } from "@heroicons/react/24/solid";
import TableBoolEntry from "./tableboolentry";
import TableTextEntry from "./tabletextentry";
import TableDoubleTextEntry from "./tabledoubletextentry";
import { useEffect, useState } from "react";
import { Employees } from "@/app/lib/definitions";

const TABS = [
	{
		label: "Active",
		value: "active",
	},
	{
		label: "Inactive",
		value: "inactive",
	},
	{
		label: "All",
		value: "all",
	},
] as const;

type TabValueType = typeof TABS[number]['value'];


const TABLE_HEAD = [
	"Employee", "Cell/Home", "Employee Status", "Contractor Status", "Login", "Numeric ID", "Manager ID",
	"Access Level", "Timesheet Required", "Overtime Eligible", "Tab Navigate", "Email Expense Copy",
	"I Enter Time Data", "Sheet Summaries", "Expense Summaries", "Default Rows", "ID"
];

const demoImg = "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg";

export default function SortableTable({
	employeePromise,
}: {
	employeePromise: Promise<Employees[]>;
}) {
	const [employees, setEmployees] = useState<Employees[] | undefined>(undefined);
	const [tabValue, setTabValue] = useState<TabValueType>(TABS[0]["value"]);
	console.log("Hello from sortableTable");
	
	function tabFilter(employee: Employees) {
		switch (tabValue){
			case "active":
				return employee.activeemployee == true;
			case "inactive":
				return employee.activeemployee == false;
			case "all":
				return true;
		}
	}

	useEffect(() => {
		const handleEmployeePromise = async() => {
			const data = await employeePromise;
			setEmployees(data);
		}
		
		handleEmployeePromise();
	
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
			<CardBody className="overflow-scroll px-0">
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
						{employees !== undefined ? (
							Array.isArray(employees) && 
							employees
								.filter(tabFilter)
								//.filter(searchFilter)
								.map(
								// Skip password
								({ id, number, username, firstname, lastname, cellphone, homephone, email, 
									managerid, accesslevel, timesheetrequired, overtimeeligible, tabnavigateot, 
									emailexpensecopy, activeemployee, ientertimedata, numtimesheetsummaries, 
									numexpensesummaries, numdefaulttimerows, contractor}, index) => {
									const isLast = index === employees.length - 1;
									const classes = isLast
										? "p-2"
										: "p-2 border-b border-blue-gray-50";

									return (
										<tr key={firstname + index}>
											
											{/* PFF, Name, and Email */}
											<td className={classes}>
												<div className="flex flex-grow items-center gap-3">
													<Avatar src={demoImg} alt={firstname} variant="rounded" className="max-w-none" />
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
															className="font-normal opacity-70 text-xs"
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
											<TableTextEntry 
												classes={classes}
												text={managerid}
											/>

											{/* Access Level */}
											<TableTextEntry 
												classes={classes}
												text={accesslevel}
											/>

											{/* Timesheet Required */}
											<TableBoolEntry
												condition={timesheetrequired}
												classes={classes}
											/>

											{/* Overtime Eligible */}
											<TableBoolEntry
												condition={overtimeeligible}
												classes={classes}
											/>

											{/* Tab Navigate OT*/}
											<TableBoolEntry
												condition={tabnavigateot}
												classes={classes}
											/>

											{/* Email Expense Copy */}
											<TableBoolEntry
												condition={emailexpensecopy}
												classes={classes}
											/>

											{/* I Enter Time Data */}
											<TableBoolEntry
												condition={ientertimedata}
												classes={classes}
											/>

											{/* Number of Sheet Summaries */}
											<TableTextEntry 
												classes={classes}
												text={numtimesheetsummaries}
											/>

											{/* Number of Expense Summaries */}
											<TableTextEntry 
												classes={classes}
												text={numexpensesummaries}
											/>

											{/* Number of Default Rows */}
											<TableTextEntry 
												classes={classes}
												text={numdefaulttimerows} // change
											/>

											{/* ID */}
											<TableTextEntry 
												classes={classes}
												text={id}
											/>

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
			{/* <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
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
			</CardFooter> */}
		</Card>
	);
}