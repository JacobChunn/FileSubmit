'use server';

import { boolean, z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath, unstable_noStore } from 'next/cache';
import { redirect } from 'next/navigation';
//import { signIn } from '@/auth';
//import { AuthError } from 'next-auth';
import { CostCodeOption, EditDetailsType, EmployeeState, Expense, ExpenseDetails, ExpenseOptions, ExpenseRates, Mileage, MiscOption, Options, Perdiem, PhaseCostCodeOption, PhaseOption, ProjectOption, ProjectState, Subordinate, SubordinateExpense, SubordinateTimesheet, SubordinateTuple, Timesheet, TimesheetDetails } from './definitions';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/options';
import { fetchEmployeeByID, fetchTimesheetsByEmployeeID } from './data';
import * as bcrypt from 'bcrypt';
import { DateTime } from 'luxon';
import assert from 'assert';
 
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

const EmployeeSchema = z.object({
	id: z.coerce.number(),
	number: z.coerce.number(),
	username: z.string().max(50),
	password: z.string().max(24),
	firstname: z.string().max(50),
	lastname: z.string().max(50),
	cellphone: z.string().max(32),
	homephone: z.string().max(32),
	email: z.string().max(50),
	managerid: z.coerce.number(),
	accesslevel: z.coerce.number(),
	timesheetrequired: z.coerce.boolean(),
	overtimeeligible: z.coerce.boolean(),
	tabnavigateot: z.coerce.boolean(),
	emailexpensecopy: z.coerce.boolean(),
	activeemployee: z.coerce.boolean(),
	ientertimedata: z.coerce.boolean(),
	numtimesheetsummaries: z.coerce.number(),
	numexpensesummaries: z.coerce.number(),
	numdefaulttimerows: z.coerce.number(),
	contractor: z.coerce.boolean(),
});

const AddEmployee = EmployeeSchema.omit({ id: true });
const EditEmployee = EmployeeSchema.omit({ id: true });

const ProjectSchema = z.object({
	id: z.coerce.number(),
	number: z.string().max(12),
	description: z.string().max(50),
	startdate: z.coerce.date(), // may need to change FORMAT: 2006-04-01 00:00:00.000
	enddate: z.coerce.date(), // may need to change
	shortname: z.string().max(8),
	customerpo: z.string().max(50),
	customercontact: z.string().max(50),
	comments: z.string().max(256),
	overtime: z.coerce.boolean(),
	sgaflag: z.coerce.boolean(),
});

const AddProject = ProjectSchema.omit({ id: true });
const EditProject = ProjectSchema.omit({ id: true });

const ExpenseSchema = z.object({
	id: z.coerce.number(),
	employeeid: z.coerce.number(),
	datestart: z.coerce.date(),
	numdays: z.coerce.number(),
	usercommitted: z.coerce.boolean(),
	mgrapproved: z.coerce.boolean(),
	paid: z.coerce.boolean(),
	totalexpenses: z.coerce.number(),
    submittedby: z.string().max(32).nullable(),
    approvedby: z.string().max(32).nullable(),
    processedby: z.string().max(32).nullable(),
    datepaid: z.coerce.date().nullable(),
	mileagerate: z.coerce.number(),
})

const OnlyExpenseID = ExpenseSchema.pick({ id: true });

const ExpenseDetailsSchema = z.object({
	day: z.number().int().min(0).max(31),
    id: z.number(),
    expenseid: z.number(),
    employeeid: z.number(),
    jobid: z.number(),
    purpose: z.string().nullable(),
    transportwhere: z.string().max(1024).nullable(),
    transportation: z.number().min(0.0).nullable(),
    lodging: z.number().min(0.0).nullable(),
    cabsparking: z.number().min(0.0).nullable(),
    carrental: z.number().min(0.0).nullable(),
    miles: z.number().min(0.0).nullable(),
    mileage: z.number().min(0.0).nullable(),
    perdiem: z.number().min(0.0).nullable(),
    entertainment: z.number().min(0.0).nullable(),
    miscid: z.number(),
    miscvalue: z.number().min(0.0).nullable(),
    total: z.number().min(0.0).nullable(),
    miscdetail: z.string().max(1024).nullable(),
    entlocation: z.string().max(1024).nullable(),
    entactivity: z.string().max(1024).nullable(),
    entwho: z.string().max(1024).nullable(),
    entpurpose: z.string().max(1024).nullable(),
});

const EditExpenseDetails = ExpenseDetailsSchema.omit({
	expenseid: true,
	employeeid: true,
	total: true,
	mileage: true,
	perdiem: true,
});

const TimesheetSchema = z.object({
  id: z.coerce.number(),
  employeeid: z.coerce.number(),
  weekending: z.coerce.date(),
  processed: z.coerce.boolean(),
  mgrapproved: z.coerce.boolean(),
  usercommitted: z.coerce.boolean(),
  totalreghours: z.coerce.number().min(0.0),
  totalovertime: z.coerce.number().min(0.0),
  approvedby: z.string().max(32),
  submittedby: z.string().max(32),
  processedby: z.string().max(32),
  dateprocessed: z.coerce.date(),
  message: z.string().max(4096),
});

const OnlyTimesheetID = TimesheetSchema.pick({ id: true });

// Usages are deprecated
const AddTimesheet = TimesheetSchema.pick({
  weekending: true,
  usercommitted: true,
  totalreghours: true,
  totalovertime: true,
  message: true,
})

// Usages are deprecated
const EditTimesheet = TimesheetSchema.pick({
  id: true,
  weekending: true,
  usercommitted: true,
  totalreghours: true,
  totalovertime: true,
  message: true,
})


const TimesheetDetailsSchema = z.object({
  id: z.coerce.number(),
  timesheetid: z.coerce.number(),
  employeeid: z.coerce.number(),
  project: z.coerce.number(),
  phase_costcode: z.string().regex(/^\d+-\d+$/, "Input must be two numbers separated by a dash"),
  // phase: z.coerce.number(),
  // costcode: z.coerce.number(),
  description: z.string().max(128),
  mon: z.coerce.number().min(0.0),
  monot: z.coerce.number().min(0.0),
  tues: z.coerce.number().min(0.0),
  tuesot: z.coerce.number().min(0.0),
  wed: z.coerce.number().min(0.0),
  wedot: z.coerce.number().min(0.0),
  thurs: z.coerce.number().min(0.0),
  thursot: z.coerce.number().min(0.0),
  fri: z.coerce.number().min(0.0),
  friot: z.coerce.number().min(0.0),
  sat: z.coerce.number().min(0.0),
  satot: z.coerce.number().min(0.0),
  sun: z.coerce.number().min(0.0),
  sunot: z.coerce.number().min(0.0),
  lasteditdate: z.coerce.date(),
});

const EditTimesheetDetails = TimesheetDetailsSchema.omit({
	timesheetid: true,
	employeeid: true,
	lasteditdate: true,
});

const DateSchema = z.object({
    date: z.string().regex(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|([+-]\d{2}:\d{2}))$/,
        "date must be in valid ISO 8601 format"
    )
});

export type InvoiceState = {
    errors?: {
      customerId?: string[];
      amount?: string[];
      status?: string[];
    };
    message?: string | null;
};


// export async function authenticate(
//     prevState: string | undefined,
//     formData: FormData,
// ) {
//     try {
//       await signIn('credentials', formData);
//     } catch (error) {
//       if (error instanceof AuthError) {
//         switch (error.type) {
//           case 'CredentialsSignin':
//             return 'Invalid credentials.';
//           default:
//             return 'Something went wrong.';
//         }
//       }
//       throw error;
//     }
// }

export async function fetchSubordinatesWithAuth(

) {
	unstable_noStore();

	const session = await getServerSession(authOptions);

	if (!session) {
	  console.log("Session was unable to be retrieved!");
	  return null;
  
	}
  
	const managerid = Number(session.user.id);
  
	if (isNaN(managerid)) {
	  console.error('id is not a number');
	  return null;
	}

	try {
		const data = await sql<Subordinate>`
			SELECT
			id, firstname, lastname
			FROM employees
			WHERE employees.managerid = ${managerid}
			ORDER BY lastname ASC;
		`;
		const dataRows = data.rows;
		
		// Transform the data to match the expected state type
		const transformedData: SubordinateTuple[] = dataRows.map(row => [row.id, row.firstname, row.lastname]);

		return transformedData;
	  } catch (error) {
		console.error('Database Error:', error);
		return null;
	  }

}

export async function fetchSubordinateTimesheetsWithAuth(
	weekending: string | undefined | null
) {
	unstable_noStore();

	const session = await getServerSession(authOptions);

	if (!session) {
	  console.log("Session was unable to be retrieved!");
	  return null;
  
	}
  
	const managerid = Number(session.user.id);
  
	if (isNaN(managerid)) {
	  console.error('id is not a number');
	  return null;
	}

	if (!weekending) return null;
	console.log("weekending: ", weekending)

	try {
		const data = await sql<SubordinateTimesheet>`
			SELECT
				e.id AS subordinateid, e.firstname, e.lastname, t.*
			FROM employees e
			JOIN timesheets t ON e.id = t.employeeid
			WHERE e.managerid = ${managerid} AND t.weekending = ${weekending}
			ORDER BY e.lastname ASC;
		`;
		console.log("data: ", data.rows)
		const dataRows = data.rows;
		
		// Transform the data to match the expected state type
		//const transformedData: SubordinateTuple[] = dataRows.map(row => [row.id, row.firstname, row.lastname]);

		return dataRows;
	  } catch (error) {
		console.error('Database Error:', error);
		return null;
	  }

}

export async function fetchSubordinateExpensesWithAuth(
	datestart: string | undefined | null
) {
	unstable_noStore();

	const session = await getServerSession(authOptions);

	if (!session) {
	  console.log("Session was unable to be retrieved!");
	  return null;
  
	}
  
	const managerid = Number(session.user.id);
  
	if (isNaN(managerid)) {
	  console.error('id is not a number');
	  return null;
	}

	if (!datestart) return null;
	console.log("datestart: ", datestart)

	try {
		const data = await sql<SubordinateExpense>`
			SELECT
				e.id AS subordinateid, e.firstname, e.lastname, x.*
			FROM employees e
			JOIN expenses x ON e.id = x.employeeid
			WHERE e.managerid = ${managerid} AND x.datestart = ${datestart}
			ORDER BY e.lastname ASC;
		`;
		console.log("data: ", data.rows)
		const dataRows = data.rows;
		
		// Transform the data to match the expected state type
		//const transformedData: SubordinateTuple[] = dataRows.map(row => [row.id, row.firstname, row.lastname]);

		return dataRows;
	  } catch (error) {
		console.error('Database Error:', error);
		return null;
	  }

}

export async function addEmployee(
	prevState: EmployeeState,
	formData: FormData,
) {
  const validatedFields = AddEmployee.safeParse({
    number: formData.get('number'),
    username: formData.get('username'),
    password: formData.get('password'),
    firstname: formData.get('firstname'),
    lastname: formData.get('lastname'),
    cellphone: formData.get('cellphone'),
    homephone: formData.get('homephone'),
    email: formData.get('email'),
    managerid: formData.get('managerid'),
    accesslevel: formData.get('accesslevel'),
    timesheetrequired: formData.get('timesheetrequired'),
    overtimeeligible: formData.get('overtimeeligible'),
    tabnavigateot: formData.get('tabnavigateot'),
    emailexpensecopy: formData.get('emailexpensecopy'),
    activeemployee: formData.get('activeemployee'),
    ientertimedata: formData.get('ientertimedata'),
    numtimesheetsummaries: formData.get('numtimesheetsummaries'),
    numexpensesummaries: formData.get('numexpensesummaries'),
    numdefaulttimerows: formData.get('numdefaulttimerows'),
    contractor: formData.get('contractor'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Add Employee.',
    };
  }

  const {password, ...otherFields} = validatedFields.data;

  const {number, username, firstname, lastname, cellphone, homephone,
    email, managerid, accesslevel, timesheetrequired, overtimeeligible, tabnavigateot,
    emailexpensecopy, activeemployee, ientertimedata, numtimesheetsummaries,
    numexpensesummaries, numdefaulttimerows, contractor
  } = otherFields;

  // Prepare data for insertion into the database
  const hashedPassword = await bcrypt.hash(validatedFields.data.password, 10);

  try {
    await sql`
    INSERT INTO employees (
      number, username, password, firstname, lastname, cellphone, homephone,
      email, managerid, accesslevel, timesheetrequired, overtimeeligible, tabnavigateot,
      emailexpensecopy, activeemployee, ientertimedata, numtimesheetsummaries,
      numexpensesummaries, numdefaulttimerows, contractor
    )
    VALUES (
      ${number}, ${username}, ${hashedPassword}, ${firstname}, ${lastname},
      ${cellphone}, ${homephone}, ${email}, ${managerid}, ${accesslevel},
      ${timesheetrequired ? 1 : 0}, ${overtimeeligible ? 1 : 0}, ${tabnavigateot ? 1 : 0},
      ${emailexpensecopy ? 1 : 0}, ${activeemployee ? 1 : 0}, ${ientertimedata ? 1 : 0},
      ${numtimesheetsummaries}, ${numexpensesummaries}, ${numdefaulttimerows},
      ${contractor ? 1 : 0}
    )
  `;
  } catch (error) {
    console.log(error);
    return {
      message: 'Database Error: Failed to Add Employee.',
    };
  }

  revalidatePath('/dashboard/employees');
  redirect('/dashboard/employees');
}

export async function addProject( // make it not break when project table doesnt exist
	prevState: ProjectState,
	formData: FormData,
) {
  const validatedFields = AddProject.safeParse({
    number: formData.get('number'),
    description: formData.get('description'),
    startdate: formData.get('startdate'),
    enddate: formData.get('enddate'),
    shortname: formData.get('shortname'),
    customerpo: formData.get('customerpo'),
    customercontact: formData.get('customercontact'),
    comments: formData.get('comments'),
    overtime: formData.get('overtime'),
    sgaflag: formData.get('sgaflag'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Project.',
    };
  }

  const {
    number, description, startdate, enddate, shortname,
    customerpo, customercontact, comments, overtime, sgaflag
  } = validatedFields.data;

  // Prepare data for insertion into the database
  // Noting needed as of now

//   console.log("Start Date: ")
//   console.log(startdate)
//   console.log(startdate.toISOString())
//   console.log(startdate.toUTCString())
//   console.log(startdate.toTimeString())
//   console.log(startdate.toJSON())
//   console.log(startdate.toDateString())
//   console.log(startdate.getDate())
//   console.log(startdate.getUTCDate())
  

  try {
    await sql`
    INSERT INTO projects (
      number, description, startdate, enddate, shortname, customerpo, customercontact,
      comments, overtime, sgaflag
    )
    VALUES (
      ${number}, ${description}, ${startdate.toLocaleDateString('en-us')}, ${enddate.toLocaleDateString('en-us')}, ${shortname},
      ${customerpo}, ${customercontact}, ${comments}, ${overtime ? 1 : 0}, ${sgaflag ? 1 : 0}
    )	  
    `;
  } catch (error) {
    console.log(error);
    return {
      message: 'Database Error: Failed to Create Project.',
    };
  }

  revalidatePath('/dashboard/projects');
  redirect('/dashboard/projects');
}

export async function addEmptyExpense() {
  const session = await getServerSession(authOptions);

  if (!session) {
    console.error("Session was unable to be retrieved!");
    return {
      success: false,
      message: "Session was unable to be retrieved!",
    };
  }

  const employeeid = Number(session.user.id);
  const user = await fetchEmployeeByID(employeeid)
  const submittedby = user.username;

  const datestartObj = DateTime.now().startOf('month')

  const datestart = datestartObj.toLocaleString();
  const numdays = datestartObj.endOf('month').day;

  const usercommitted = false;
	const mgrapproved = false;
	const approvedby = null;
	const processedby = null;
  const paid = false;
  const totalexpenses = 0.00;
	const datepaid = null;

	const addSuccess = await addExpenseHelper(
		true,
		employeeid,
		submittedby,
		datestart,
		numdays,
		usercommitted,
		mgrapproved,
		approvedby,
		processedby,
		paid,
		totalexpenses,
		datepaid,
		null,
		null
	);

	return {
		...addSuccess,
		datestart,
		numdays,
		submittedby,
	};
}

// Only call this funciton if session and employee ID is verified, 
// and the recipiant of the returned values has been authorized to recieve them.
async function addExpenseHelper(
	addBlankDetails: boolean,
	employeeid: number,
	submittedby: string,
	datestart: string,
	numdays: number,
	usercommitted: boolean,
	mgrapproved: boolean,
	approvedby: string | null,
	processedby: string | null,
	paid: boolean,
	totalexpenses: number,
	datepaid: string | null,
	mileagerate: number | null,
	perdiemrate: number | null,
) {
  // Get Milage + Perdiem Rate
  try {
    if (mileagerate == null) {
		const mileageData = await sql`
			SELECT rate
			FROM mileagerates
			WHERE datestart <= ${datestart}
			ORDER BY datestart DESC
			LIMIT 1;
		`;
		if (!mileageData.rows[0].rate) throw new Error("Error getting mileage data!");

		mileagerate = mileageData.rows[0].rate;
	}
	if (perdiemrate == null) {
		const perdiemData = await sql`
			SELECT rate
			FROM perdiemrates
			WHERE datestart <= ${datestart}
			ORDER BY datestart DESC
			LIMIT 1;
		`;
		if (!perdiemData.rows[0].rate) throw new Error("Error getting perdiem data!");
		
		perdiemrate = perdiemData.rows[0].rate;
	}
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: JSON.stringify(error),
    };
  }

  mileagerate = Number(mileagerate)
  perdiemrate = Number(perdiemrate)

  assert(mileagerate != null && typeof mileagerate == 'number')
  assert(perdiemrate != null && typeof perdiemrate == 'number')
//   console.log(`employeeid: ${employeeid}`);
//   console.log(`datestart: ${datestart}`);
//   console.log(`numdays: ${numdays}`);
//   console.log(`usercommitted: ${usercommitted ? 1 : 0}`);
//   console.log(`mgrapproved: ${mgrapproved ? 1 : 0}`);
//   console.log(`paid: ${paid ? 1 : 0}`);
//   console.log(`totalexpenses: ${totalexpenses}`);
//   console.log(`approvedby: ${approvedby}`);
//   console.log(`submittedby: ${submittedby}`);
//   console.log(`processedby: ${processedby}`);
//   console.log(`datepaid: ${datepaid}`);
//   console.log(`mileagerate: ${mileagerate}`);
  

  // Add a expense entry
  let expenseID: number;
  try {
    const expenseIDData = await sql`
      INSERT INTO expenses (
        employeeid, datestart, numdays, usercommitted,
		mgrapproved, paid, totalexpenses,
        approvedby, submittedby, processedby, datepaid, mileagerate
      )
      VALUES (
        ${employeeid}, ${datestart}, ${numdays}, ${usercommitted ? 1 : 0},
        ${mgrapproved ? 1 : 0}, ${paid ? 1 : 0}, ${totalexpenses},
        ${approvedby}, ${submittedby}, ${processedby}, ${datepaid}, ${mileagerate}
      )
      RETURNING id;
    `;
	
    expenseID = expenseIDData.rows[0].id;

    // Add details if indicated in parameter
	  if (addBlankDetails) {
      const addExpenseDetailsRes = await addExpenseDetailsHelper({
        expenseid: expenseID,
        employeeid: employeeid,
		mileage: mileagerate,
		perdiem: perdiemrate,
      });
		  
      if(!addExpenseDetailsRes.success) {
        console.error('Database Error: Failed to Create Expense Details.');
        return {
          success: false,
          message: "Database Error: Failed to Create Expense Details."
        };
      }
	  }

  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: JSON.stringify(error),
    };
  }
  return {
    success: true,
    message: "Expense was added successfully!",
    id: expenseID,
    mileagerate: mileagerate
  };
}

async function addExpenseDetailsHelper({
	day = 1,
	expenseid,
	employeeid,
	jobid = 0,
	purpose=null,
	transportwhere=null,
	transportation=null,
	lodging = null,
	cabsparking = null,
	carrental = null,
	miles = null,
	mileage = null,
	perdiem = null,
	entertainment = null,
	miscid = 0,
	miscvalue = null,
	total = null,
	miscdetail = null,
	entlocation = null,
	entactivity = null,
	entwho = null,
	entpurpose = null,
}: {
	day?: number,
	expenseid: number,
	employeeid: number,
	jobid?: number,
	purpose?: string | null,
	transportwhere?: string | null,
	transportation?: number | null,
	lodging?: number | null,
	cabsparking?: number | null,
	carrental?: number | null,
	miles?: number | null,
	mileage?: number | null,
	perdiem?: number | null,
	entertainment?: number | null,
	miscid?: number,
	miscvalue?: number | null,
	total?: number | null,
	miscdetail?: string | null,
	entlocation?: string | null,
	entactivity?: string | null,
	entwho?: string | null,
	entpurpose?: string | null,
}) {
	try {

		// console.log(`expenseid: ${expenseid}`);
		// console.log(`employeeid: ${employeeid}`);
		// console.log(`jobid: ${jobid}`);
		// console.log(`purpose: ${purpose}`);
		// console.log(`transportwhere: ${transportwhere}`);
		// console.log(`transportation: ${transportation}`);
		// console.log(`lodging: ${lodging}`);
		// console.log(`cabsparking: ${cabsparking}`);
		// console.log(`carrental: ${carrental}`);
		// console.log(`miles: ${miles}`);
		// console.log(`mileage: ${mileage}`);
		// console.log(`perdiem: ${perdiem}`);
		// console.log(`entertainment: ${entertainment}`);
		// console.log(`miscid: ${miscid}`);
		// console.log(`miscvalue: ${miscvalue}`);
		// console.log(`total: ${total}`);
		// console.log(`miscdetail: ${miscdetail}`);
		// console.log(`entlocation: ${entlocation}`);
		// console.log(`entactivity: ${entactivity}`);
		// console.log(`entwho: ${entwho}`);
		// console.log(`entpurpose: ${entpurpose}`);
		

		await sql`
			INSERT INTO expensedetails (
				expenseid, employeeid, jobid,
				purpose, transportwhere, transportation,
				lodging, cabsparking, carrental, miles, mileage,
				perdiem, entertainment, miscid, miscvalue, total,
				miscdetail, entlocation, entactivity, entwho, entpurpose,
				day
			)
			VALUES (
			${expenseid}, ${employeeid}, ${jobid},
			${purpose}, ${transportwhere}, ${transportation},
			${lodging}, ${cabsparking}, ${carrental}, ${miles}, ${mileage},
			${perdiem}, ${entertainment}, ${miscid}, ${miscvalue}, ${total},
			${miscdetail}, ${entlocation}, ${entactivity}, ${entwho}, ${entpurpose},
			${day}
			)
		`;

		return {
			success: true,
			message: "Successfully added Expense Details!"
		}
	} catch (error) {
		console.log(error);
		return {
			success: false,
			message: JSON.stringify(error)
		};
	}
}

export async function fetchExpensesWithAuth() {

	const session = await getServerSession(authOptions);
  
	if (!session) {
		console.log("Session was unable to be retrieved!");
		return null;
	
	}
  
	const employeeid = Number(session.user.id);

	if (isNaN(employeeid)) {
		console.error('id is not a number');
		return null;
	}
  
	try {
		const data = await sql<Expense>`
			SELECT
				id,
				employeeid,
				datestart,
				numdays,
				usercommitted,
				mgrapproved,
				paid,
				totalexpenses,
				submittedby,
				approvedby,
				processedby,
				datepaid,
				mileagerate
			FROM expenses
			WHERE employeeid = ${employeeid}
			ORDER BY datestart DESC;
		`;
		const dataRows = data.rows;
		//console.log(employeeid, dataRows);
		return dataRows;
	} catch (error) {
		console.error('Database Error:', error);
		return null;
	}
  
}

export async function toggleExpenseSignedValue(expenseid: number) {
	const validatedFields = OnlyExpenseID.safeParse({
		id: expenseid,
	});
	
	  // If form validation fails, return errors early. Otherwise, continue.
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Missing fields. Failed to validate expense ID.',
		};
	}
	
	const { id } = validatedFields.data;

	// Get the user session to ensure they are who they say they are
	const session = await getServerSession(authOptions);

	if (!session) {
		console.log("Session was unable to be retrieved!");
		return {
			message: 'Session was unable to be retrieved!',
		};
	}
	
	const employeeid = Number(session.user.id);

	try {
		await sql`
			UPDATE expenses
			SET usercommitted = NOT usercommitted
			WHERE id = ${id} AND employeeid = ${employeeid};
		`;
	} catch(error) {
		console.error(error);
		return {
			message: 'Failed to toggle signed value!',
		};
	}
}

export async function fetchExpenseDetailsEditFormData(
	expenseID: number
) {
	unstable_noStore();

	const validatedExpense = z.number().safeParse(expenseID);

	if (!validatedExpense.success) {
		console.error(validatedExpense.error.flatten().fieldErrors);
		throw new Error('Failed to Validate ExpenseID.')
	}

	// Ensure user is logged in
	const session = await getServerSession(authOptions);

	if (!session) {
		throw new Error('Failed to user Session.');
	}
	
	const employeeID = Number(session.user.id);
	const validatedExpenseID = validatedExpense.data;

	// Ensure expenseID belongs to employee
	// const validOwnership = await employeeOwnsExpense(employeeID, validatedExpenseID);
	// if (!validOwnership) {
	// 	throw new Error("Employee does not own provided expense!")
	// }

	try {
		const EXDData = await sql<ExpenseDetails>`
			SELECT
				id, expenseid, employeeid, jobid, day,
				purpose, transportwhere, transportation,
				lodging, cabsparking, carrental, miles, mileage,
				perdiem, entertainment, miscid, miscvalue, total,
				miscdetail, entlocation, entactivity, entwho, entpurpose
			FROM expensedetails
			WHERE expensedetails.expenseid = ${validatedExpenseID}
				AND expensedetails.employeeid = ${employeeID}
		`;
		
		const projectsData = await sql<ProjectOption>`
			SELECT id, number, shortname, description FROM projects;
		`;
	
		const miscData = await sql<MiscOption>`
			SELECT id, description FROM misc;
		`;

		const mileageData = await sql<Mileage>`
			SELECT rate, datestart FROM mileagerates;
		`;

		const perdiemData = await sql<Perdiem>`
			SELECT rate, datestart FROM perdiemrates;
		`;

		const expenseDetails = EXDData.rows;
		const projects = projectsData.rows;
		const misc = miscData.rows;

		const mileage = mileageData.rows;

		const perdiem = perdiemData.rows;

		const options: ExpenseOptions = {
			projects,
			misc
		}

		const rates: ExpenseRates = {
			mileage,
			perdiem
		}
		
		return {rates, options, expenseDetails};

	} catch (error) {
		console.error('Database Error:', error);
		throw error;
	}
}

export async function duplicateExpense() {
	const session = await getServerSession(authOptions);

	if (!session) {
		console.error('Session was unable to be retrieved!');
		return {
		success: false,
		message: 'Session was unable to be retrieved!',
		};
	}

	const employeeid = Number(session.user.id);
	const user = await fetchEmployeeByID(employeeid);
	const submittedby = user.username;

	const now = DateTime.now();
	const datestart = now.startOf('month').toLocaleString();
	const numdays = now.daysInMonth;

	const usercommitted = false;
	const paid = false;

	const mgrapproved = false;
	const approvedby = null;
	const processedby = null;

	const expenseHelperRes = await duplicateExpenseHelper(
		employeeid,
		datestart,
		numdays,
		usercommitted,
		mgrapproved,
		paid,
		submittedby,
		approvedby,
		processedby,
	);

	return {
		...expenseHelperRes,
		datestart,
		numdays,
		submittedby,
	};
}
  
  async function duplicateExpenseHelper(
		employeeid: number,
		datestart: string,
		numdays: number,
		usercommitted: boolean,
		mgrapproved: boolean,
		paid: boolean,
		submittedby: string,
		approvedby: string | null,
		processedby: string | null,
  ) {
	  // Get recent expense
	  const recentExpenseRes = await getRecentExpense(employeeid);
	  if (!recentExpenseRes.success || !recentExpenseRes.recentExpense){
		  return {
			  success: false,
			  message: "Failed to get recent expense"
		  }
	  }
  
	  // Parse recent expense
	  const recentExpense = recentExpenseRes.recentExpense;
	  const expenseID = recentExpense.id;
  
	  // Get mileagerate and perdiemrate
	  let mileagerate: number;
	  let perdiemrate: number;
	  try {
		const mileageData = await sql`
			SELECT rate
			FROM mileagerates
			WHERE datestart <= ${datestart}
			ORDER BY datestart DESC
			LIMIT 1;
		`;
		if (!mileageData.rows[0].rate) throw new Error("Error getting mileage data!");

		mileagerate = mileageData.rows[0].rate;
	
		const perdiemData = await sql`
			SELECT rate
			FROM perdiemrates
			WHERE datestart <= ${datestart}
			ORDER BY datestart DESC
			LIMIT 1;
		`;
		if (!perdiemData.rows[0].rate) throw new Error("Error getting perdiem data!");
		
		perdiemrate = perdiemData.rows[0].rate;
	
	  } catch (error) {
		console.error(error);
		return {
		  success: false,
		  message: JSON.stringify(error),
		};
	  }

	  // Get recent expense details
	  const recentExpenseDetailsRes = await getExpenseDetails(expenseID, employeeid);
	  if (!recentExpenseDetailsRes.success || !recentExpenseDetailsRes.expenseDetails) {
		  return {
			  success: false,
			  message: "Failed to get recent expense details"
		  }
	  }
	  const thresholdDay = DateTime.fromFormat(datestart, "M/d/yyyy").daysInMonth
	  assert(thresholdDay)
	  // Parse recent expense details
	  const recentExpenseDetails = recentExpenseDetailsRes.expenseDetails.filter(exd => exd.day <= thresholdDay);
  
	  let recentExpenseDetailsTotal = 0;
	  // Total expense details
	  for (const exd of recentExpenseDetails) {
		recentExpenseDetailsTotal += Number(exd.transportation);
		recentExpenseDetailsTotal += Number(exd.lodging);
		recentExpenseDetailsTotal += Number(exd.cabsparking);
		recentExpenseDetailsTotal += Number(exd.carrental);
		recentExpenseDetailsTotal += Number(exd.entertainment);
		recentExpenseDetailsTotal += Number(exd.miscvalue);
	  
		recentExpenseDetailsTotal += Number(exd.miles) * Number(mileagerate);
		recentExpenseDetailsTotal += Number(perdiemrate);
	  }
	  
	  console.log("here")
	  // Create new expense
	  const addExpenseHelperRes = await addExpenseHelper(
		  false,
			employeeid,
			submittedby,
			datestart,
			numdays,
			usercommitted,
			mgrapproved,
			approvedby,
			processedby,
			paid,
			recentExpenseDetailsTotal,
			null,
			mileagerate,
			perdiemrate,
	  );
  
	  // Parse the newly created timesheet response
	  if (!addExpenseHelperRes.success || !addExpenseHelperRes.id) {
		  return {
			  success: false,
			  message: "Failed to get create a new recent timesheet"
		  }
	  }
	  const newExpenseID = addExpenseHelperRes.id;
  
	  // Create new timesheet details with recent timesheet details' data but references newly created timesheet
	  console.log("recentTSDs: ", recentExpenseDetails);
	  for (const exd of recentExpenseDetails) {
		  const addExpenseDetailsRes = await addExpenseDetailsHelper({
				day: exd.day,
				expenseid: newExpenseID,
				employeeid: employeeid,
				jobid: exd.jobid,
				purpose: exd.purpose,
				transportwhere: exd.transportwhere,
				transportation: exd.transportation,
				lodging: exd.lodging,
				cabsparking: exd.cabsparking,
				carrental: exd.carrental,
				miles: exd.miles,
				mileage: mileagerate,
				perdiem: perdiemrate,
				entertainment: exd.entertainment,
				miscid: exd.miscid,
				miscvalue: exd.miscvalue,
				total: Number(exd.transportation) + 
						Number(exd.lodging) + 
						Number(exd.cabsparking) + 
						Number(exd.carrental) + 
						(Number(exd.miles) * Number(mileagerate)) + 
						Number(perdiemrate) + 
						Number(exd.entertainment) + 
						Number(exd.miscvalue),
				miscdetail: exd.miscdetail,
				entlocation: exd.entlocation,
				entactivity: exd.entactivity,
				entwho: exd.entwho,
				entpurpose: exd.entpurpose
				
				
		  });
  
		  if (!addExpenseDetailsRes.success) return addExpenseDetailsRes;
	  }
  
	  return {
		  success: true,
		  message: "Recent expense has been successfully duplicated!",
		  id: newExpenseID,
		  totalexpenses: recentExpenseDetailsTotal,
		  mileagerate: mileagerate
	  }
  }
  
  // Only call this funciton if session is verified, and the recipiant of the recent expense for the given
  // employee has been authorized to recieve it.
  async function getRecentExpense(employeeID: number) {
	try {
	  const recentExpenseData = await sql`
		SELECT *
		FROM expenses
		WHERE employeeid = ${employeeID}
		ORDER BY datestart DESC
		LIMIT 1;    
	  `;
  
	  const recentExpense = recentExpenseData.rows[0];
  
	  return {
		success: true,
		recentExpense: recentExpense
	  }
	} catch(error) {
	  console.error(error);
	  return {
		success: false,
		message: JSON.stringify(error)
	  }
	}
  }

// Only call this funciton if session is verified, and the recipiant of the expense details for the given
// employee + expense has been authorized to recieve it.
async function getExpenseDetails(expenseID: number, employeeID: number) {
	try {
	  const expenseDetailsData = await sql`
		SELECT *
		FROM expensedetails
		WHERE expenseid = ${expenseID}
		  AND employeeid = ${employeeID};
	  `;
  
	  const expenseDetails = expenseDetailsData.rows;
  
	  return {
		success: true,
		expenseDetails: expenseDetails
	  }
	} catch(error) {
	  console.error(error);
	  return {
		success: false,
		message: JSON.stringify(error)
	  }
	}
}

export async function deleteExpense(
	expenseid: number
  ) {
	const validatedFields = OnlyExpenseID.safeParse({
	  id: expenseid,
	});
  
	// If form validation fails, return errors early. Otherwise, continue.
	if (!validatedFields.success) {
	  return {
		errors: validatedFields.error.flatten().fieldErrors,
		message: 'Missing Fields. Failed to delete expense.',
	  };
	}
  
	const { id } = validatedFields.data;
  
	// Get the user session to ensure they are who they say they are
	const session = await getServerSession(authOptions);
  
	if (!session) {
	  console.log("Session was unable to be retrieved!");
	  return {
		message: 'Session was unable to be retrieved!',
	  };
  
	}
  
	const sessionEmployeeid = Number(session.user.id);
  
	// Get database data
	var DBexpenseData;
	try {
		DBexpenseData = await sql`
		  SELECT 
		  employeeid
		  FROM expenses
		  WHERE expenses.id = ${id};
	  `;
	} catch (error) {
	  return {
		  message: 'Database Error: Failed to get Expense Data.',
	  };
  }
  
	if (!(DBexpenseData && DBexpenseData.rowCount > 0)) {
	  console.log("Expense of ID was not found!");
	  return {
		message: 'Expense of ID was not found!',
	  };
	}
  
	const DBdata = DBexpenseData.rows[0];
  
	// Validate the user is trying to delete their own expense
	const DBemployeeid = DBdata.employeeid;
  
	if (Number(DBemployeeid) != sessionEmployeeid) {
	  console.log("Session user id did not match with associated expense!");
	  return {
		message: 'Session user id did not match with associated expense!',
	  };
	}
  
	try {
	  await deleteExpenseDetailsByExpense(id);
  
	  await sql`
		DELETE FROM expenses
		WHERE id = ${id}; 
	  `;
	} catch (error) {
	  console.log(error);
	  return {
		message: 'Database Error: Failed to Delete Expense.',
	  };
	}
  
	revalidatePath('/dashboard/expenses');
	redirect('/dashboard/expenses');
}

async function deleteExpenseDetailsByExpense(expenseid: number) {
	try {
		await sql`
			DELETE FROM expensedetails WHERE expenseid = ${expenseid};
		`;
	} catch(error) {
		console.log(error);
		return;
	}
}

export async function editExpenseDetails(
	expenseID: number,
	prevState: any,
	formData: FormData
): Promise<EditDetailsType> {
	//console.log(formData);

	const validatedExpense = z.number().safeParse(expenseID);

	// If form validation fails, return errors early. Otherwise, continue.
	if (!validatedExpense.success) {
		return {
      		success: false,
			errors: validatedExpense.error.flatten().fieldErrors,
			message: 'Failed to Validate expenseID.',
		};
	}

  	const validatedExpenseID = validatedExpense.data;

	// Get user session and id
	const session = await getServerSession(authOptions);

	if (!session) {
		console.log("Session was unable to be retrieved!");
		return {
    		success: false,
			message: 'Session was unable to be retrieved!',
		};

	}

	const employeeID = Number(session.user.id);

	// Ensure expenseID belongs to employee
	// const validOwnership = await employeeOwnsExpense(employeeID, validatedExpenseID);
	// if (!validOwnership) {
	// 	console.log("Employee does not own provided expense!");
	// 	return {
	// 		success: false,
	// 		message: 'Employee does not own provided expense!',
	// 	};
	// }

	// Ensure that expense is not signed
	try {
		const expenseIsSigned = await sql`
			SELECT usercommitted
			FROM expenses
			WHERE id = ${validatedExpenseID}
				AND employeeid = ${employeeID};
		`;
		console.log(expenseIsSigned.rows[0]);
		if (expenseIsSigned.rows[0].usercommitted) {
			return {
				success: false,
				message: 'Cannot edit a signed expense!'
			}
		}

	} catch(error) {
		console.error(error);
		return {
			success: false,
			errors: JSON.stringify(error),
			message: 'Error checking if expense is signed!'
		}
	}

	// Validate DateStart
  	let validatedDateStart;
	try {
		validatedDateStart = DateSchema.safeParse({
			date: formData.get('dateStart')
		})
	} catch(error) {
		console.error(error);
		return {
			success: false,
			errors: JSON.stringify(error),
			message: 'Error validating Week Ending value!'
		}
	}

	if (!validatedDateStart.success) {
		console.error(validatedDateStart.error);
		return {
			success: false,
			errors: validatedDateStart.error.flatten().fieldErrors,
			message: 'Error validating Date Start value!',
		};
	}

	const numdaysFromDateStart = DateTime.fromISO(validatedDateStart.data.date).daysInMonth
	//console.log(validatedWeekEnding.data.weekEnding)

	// Update DateStart for expense
	try {
		await sql`
			UPDATE expenses
			SET datestart = ${validatedDateStart.data.date},
				numdays = ${numdaysFromDateStart}
			WHERE id = ${validatedExpenseID}
				AND employeeid = ${employeeID};
		`;
	} catch(error) {
		console.error(error);
		return {
			success: false,
			errors: JSON.stringify(error),
			message: 'Error entering Date Start value into database!'
		}
	}

	// Get mileage + perdiem
	let mileage: number;
	let perdiem: number;
	try {
		const mileageData = await sql`
			SELECT rate
			FROM mileagerates
			WHERE datestart <= ${validatedDateStart.data.date}
			ORDER BY datestart DESC
			LIMIT 1;
		`;
		if (!mileageData.rows[0].rate) throw new Error("Error getting mileage data!");
		
		mileage = mileageData.rows[0].rate;

		const perdiemData = await sql`
			SELECT rate
			FROM perdiemrates
			WHERE datestart <= ${validatedDateStart.data.date}
			ORDER BY datestart DESC
			LIMIT 1;
		`;
		if (!perdiemData.rows[0].rate) throw new Error("Error getting perdiem data!");
		
		perdiem = perdiemData.rows[0].rate;
	} catch(error) {
		console.error(error);
		return {
			success: false,
			errors: JSON.stringify(error),
			message: 'Error getting mileage/perdiem data!'
		}
	}

	// Separate EXDs from formData
	const separateEXDs = separateExpenseFormData(formData);

	// Validate each EXD and add it to array

  	type validatedEXDType = {
		day: number;
		id: number;
		jobid: number;
		purpose: string | null;
		transportwhere: string | null;
		transportation: number | null;
		lodging: number | null;
		cabsparking: number | null;
		carrental: number | null;
		miles: number | null;
		mileage: number | null;
		perdiem: number | null;
		entertainment: number | null;
		miscid: number;
		miscvalue: number | null;
		total: number | null;
		miscdetail: string | null;
		entlocation: string | null;
		entactivity: string | null;
		entwho: string | null;
		entpurpose: string | null;
	};

	const validatedEXDs: validatedEXDType[] = [];

 	for (const exdkey in separateEXDs) {
		const validatedEXD = EditExpenseDetails.safeParse({
			day: Number(separateEXDs[exdkey]['day']),
			id: Number(separateEXDs[exdkey]['id']),
			jobid: Number(separateEXDs[exdkey]['jobid']),
			purpose: separateEXDs[exdkey]['purpose'],
			transportwhere: separateEXDs[exdkey]['transportwhere'],
			transportation: Number(separateEXDs[exdkey]['transportation']),
			lodging: Number(separateEXDs[exdkey]['lodging']),
			cabsparking: Number(separateEXDs[exdkey]['cabsparking']),
			carrental: Number(separateEXDs[exdkey]['carrental']),
			miles: Number(separateEXDs[exdkey]['miles']),
			entertainment: Number(separateEXDs[exdkey]['entertainment']),
			miscid: Number(separateEXDs[exdkey]['miscid']),
			miscvalue: Number(separateEXDs[exdkey]['miscvalue']),
			miscdetail: separateEXDs[exdkey]['miscdetail'],
			entlocation: separateEXDs[exdkey]['entlocation'],
			entactivity: separateEXDs[exdkey]['entactivity'],
			entwho: separateEXDs[exdkey]['entwho'],
			entpurpose: separateEXDs[exdkey]['entpurpose']
		});


		if (!validatedEXD.success) {
			console.error(validatedEXD.error);
			return {
        		success: false,
				errors: validatedEXD.error.flatten().fieldErrors,
				message: 'Incorrect or Missing Fields. Failed to Validate expense.',
			};
		}

		// Prep data to calculate total
		const transportation = validatedEXD.data.transportation ? validatedEXD.data.transportation : 0;
		const lodging = validatedEXD.data.lodging ? validatedEXD.data.lodging : 0;
		const milesCost = validatedEXD.data.miles ? validatedEXD.data.miles * mileage : 0;
		const entertainment = validatedEXD.data.entertainment ? validatedEXD.data.entertainment : 0;
		const misc = validatedEXD.data.miscvalue ? validatedEXD.data.miscvalue : 0;

		// Calculate total. Add travel, parking/etc, miles * mileage, perdiem, entertainment, and misc
		const total = transportation + lodging + milesCost + Number(perdiem) + entertainment + misc;

		console.log(`transportation: ${transportation}`);
		console.log(`lodging: ${lodging}`);
		console.log(`milesCost: ${milesCost}`);
		console.log(`perdiem: ${perdiem}`);
		console.log(`entertainment: ${entertainment}`);
		console.log(`misc: ${misc}`);
		console.log(`total: ${total}`);


		// Push validated Expense details with mileage and total
		validatedEXDs.push({...validatedEXD.data, perdiem, mileage, total});

	}

	// Delete all EXDs associated with the timesheet
	try{ // Note - could make this more robost by temporarily storing the EXDs in DB before deletion
		await sql`
		DELETE FROM expensedetails
		WHERE expenseid = ${validatedExpenseID}
			AND employeeid = ${employeeID};
		`;
	} catch(error) {
		console.error(error);
		return {
			success: false,
			errors: JSON.stringify(error),
			message: 'Failed to delete old EXDs'
		}
	}

	// Add all validated EXDs to Database
	let totalTotal = 0.0;
	for (const EXD of validatedEXDs) {
		const {
			day, id, jobid, purpose, transportwhere, transportation, lodging, 
			cabsparking, carrental, miles, mileage, perdiem, entertainment, 
			miscid, miscvalue, total, miscdetail, entlocation, entactivity, 
			entwho, entpurpose

		} = EXD;

		console.log("inner total: ", total)

		try {
			const addExpenseDetailsRes = await addExpenseDetailsHelper({ // Do I need to ensure user is authorized?
				day: day,
				expenseid: validatedExpenseID,
				employeeid: employeeID,
				jobid: jobid,
				purpose: purpose,
				transportwhere: transportwhere,
				transportation: transportation,
				lodging: lodging,
				cabsparking: cabsparking,
				carrental: carrental,
				miles: miles,
				mileage: mileage,
				perdiem: perdiem,
				entertainment: entertainment,
				miscid: miscid,
				miscvalue: miscvalue,
				total: total,
				miscdetail: miscdetail,
				entlocation: entlocation,
				entactivity: entactivity,
				entwho: entwho,
				entpurpose: entpurpose,
			});
			
			if(!addExpenseDetailsRes.success) {
				return {
					success: false,
					message: 'Failed to Create Expense Details.',
				};
			}

			totalTotal += (total ? total : 0);
	
		} catch(error) {
			console.error(error);
			return {
				success: false,
				errors: JSON.stringify(error),
				message: 'Failed to Create Expense Details.',
			};
		}
	}

	// Update the associated expense's totalexpenses and mileagerate
	try {
		await sql`
		UPDATE expenses
		SET totalexpenses = ${totalTotal}, 
		mileagerate =${mileage}
		WHERE id = ${validatedExpenseID}
			AND employeeid = ${employeeID};
		`;
	} catch(error) {
		console.error(error);
		return {
			success: false,
			errors: JSON.stringify(error),
			message: 'Failed to Update Expense Details',
		};
	}

	// Return success
	return {
		success: true,
		message: 'Expense Details were successfully updated!'
	}

}

function separateExpenseFormData(formData: FormData): SeparatedFormData {
	const result: SeparatedFormData = {};
	
	formData.forEach((value, name) => {
		const matches = name.match(/^EXD(\d+)\[([^]+)\]$/);
		
		if (matches) {
			const [, index, key] = matches;
			if (!result[`EXD${index}`]) {
				result[`EXD${index}`] = {};
			}
			if (typeof value === 'string') {
				result[`EXD${index}`][key] = value;
			}
		}
	});
	
	return result;
}

// Deprecated in favor of addEmptyTimesheet and duplicateTimesheet
export async function addTimesheetFromForm(
	prevState: ProjectState,
	formData: FormData,
) {
	const session = await getServerSession(authOptions);

	if (!session) {
		console.error("Session was unable to be retrieved!");
		return {
			success: false,
			message: "Session was unable to be retrieved!",
		};
	}
  
	const employeeid = Number(session.user.id);
	const user = await fetchEmployeeByID(employeeid)
	const submittedby = user.username;

	const validatedFields = AddTimesheet.safeParse({
		weekending: formData.get('weekending'),
		usercommitted: formData.get('usercommitted'),
		totalreghours: formData.get('totalreghours'),
		totalovertime: formData.get('totalovertime'),
		message: formData.get('message'),
	});

	// If form validation fails, return errors early. Otherwise, continue.
	if (!validatedFields.success) {
		return {
		errors: validatedFields.error.flatten().fieldErrors,
		message: 'Missing Fields. Failed to Create Project.',
		};
	}

	const {
		weekending, usercommitted, totalreghours, totalovertime, message
	} = validatedFields.data;

	const processed = false;
	const mgrapproved = false;
	const approvedby = null;
	const processedby = null;
	const dateprocessed = null;

	const res = await addTimesheetHelper(
		true,
		employeeid,
		submittedby,
		weekending.toLocaleDateString('en-us'),
		usercommitted,
		processed,
		mgrapproved,
		approvedby,
		processedby,
		totalreghours,
		totalovertime,
		message,
		dateprocessed,
	)
	if (res) {
		revalidatePath('/dashboard');
	}

	return res;
}

export async function duplicateTimesheet() {
  const session = await getServerSession(authOptions);

  if (!session) {
    console.error("Session was unable to be retrieved!");
    return {
      success: false,
      message: "Session was unable to be retrieved!",
    };
  }

  const employeeid = Number(session.user.id);
  const user = await fetchEmployeeByID(employeeid)
  const submittedby = user.username;

	const today = DateTime.now();
	const weekday = today.weekday;
	const weekending = today.plus({days: 7 - weekday}).toLocaleString();

	const usercommitted = false;

	const processed = false;
	const mgrapproved = false;
	const approvedby = null;
	const processedby = null;
	const dateprocessed = null;

	const timesheetHelperRes = await duplicateTimesheetHelper(
		employeeid,
		submittedby,
		weekending,
		usercommitted,
		processed,
		mgrapproved,
		approvedby,
		processedby,
		dateprocessed
	);

	return {
		...timesheetHelperRes,
		weekending,
		submittedby,
	};
}

async function duplicateTimesheetHelper(
	employeeid: number,
	submittedby: string,
	weekending: string,
	usercommitted: boolean,
	processed: boolean,
	mgrapproved: boolean,
	approvedby: string | null,
	processedby: string | null,
	dateprocessed: string | null,
) {
	// Get recent timesheet
	const recentTimesheetRes = await getRecentTimesheet(employeeid);
	if (!recentTimesheetRes.success || !recentTimesheetRes.recentTimesheet){
		return {
			success: false,
			message: "Failed to get recent timesheet"
		}
	}

	// Parse recent timesheet
	const recentTimesheet = recentTimesheetRes.recentTimesheet;
	const timesheetID = recentTimesheet.id;
	const recentTotalreghours = recentTimesheet.totalreghours;
	const recentTotalovertime = recentTimesheet.totalovertime;
	const recentMessage = recentTimesheet.message;

	// Get recent timesheet details
	const recentTimesheetDetailsRes = await getTimesheetDetails(timesheetID, employeeid);
	if (!recentTimesheetDetailsRes.success || !recentTimesheetDetailsRes.timesheetDetails) {
		return {
			success: false,
			message: "Failed to get recent timesheet details"
		}
	}

	// Parse recent timesheet details
	const recentTimesheetDetails = recentTimesheetDetailsRes.timesheetDetails;

	// Create new timesheet with recent totalreghours and totalovertime
	const addTimesheetHelperRes = await addTimesheetHelper(
		false,
		employeeid,
		submittedby,
		weekending,
		usercommitted,
		processed,
		mgrapproved,
		approvedby,
		processedby,
		recentTotalreghours,
		recentTotalovertime,
		recentMessage,
		dateprocessed,
	);

	// Parse the newly created timesheet response
	if (!addTimesheetHelperRes.success || !addTimesheetHelperRes.id) {
		return {
			success: false,
			message: "Failed to get create a new recent timesheet"
		}
	}
	const newTimesheetID = addTimesheetHelperRes.id;

	// Create new timesheet details with recent timesheet details' data but references newly created timesheet
	console.log("recentTSDs: ", recentTimesheetDetails);
	for (const tsd of recentTimesheetDetails) {
		console.log("TSD")
		const addTimesheetDetailsRes = await addTimesheetDetailsHelper({
			timesheetid: newTimesheetID, // Newly created timesheet
			employeeid: employeeid,
			projectid: tsd.projectid,
			phase: tsd.phase,
			costcode: tsd.costcode,
			description: tsd.description,
			mon: tsd.mon, monot: tsd.monot, tues: tsd.tues, tuesot: tsd.tuesot,
			wed: tsd.wed, wedot: tsd.wedot, thurs: tsd.thurs, thursot: tsd.thursot,
			fri: tsd.fri, friot: tsd.friot, sat: tsd.sat, satot: tsd.satot,
			sun: tsd.sun, sunot: tsd.sunot,
			
			
		});

		if (!addTimesheetDetailsRes.success) return addTimesheetDetailsRes;
	}

	return {
		success: true,
		message: "Recent timesheet has been successfully duplicated!",
		id: newTimesheetID,
		totalreghours: recentTotalreghours,
		totalovertime: recentTotalovertime,
		timesheetMessage: recentMessage
	}
}

// Only call this funciton if session is verified, and the recipiant of the recent timesheet for the given
// employee has been authorized to recieve it.
async function getRecentTimesheet(employeeID: number) {
  try {
    const recentTimesheetData = await sql`
      SELECT *
      FROM timesheets
      WHERE employeeid = ${employeeID}
      ORDER BY weekending DESC
      LIMIT 1;    
    `;

    const recentTimesheet = recentTimesheetData.rows[0];

    return {
      success: true,
      recentTimesheet: recentTimesheet
    }
  } catch(error) {
    console.error(error);
    return {
      success: false,
      message: JSON.stringify(error)
    }
  }
}

// Only call this funciton if session is verified, and the recipiant of the timesheet details for the given
// employee + timesheet has been authorized to recieve it.
async function getTimesheetDetails(timesheetID: number, employeeID: number) {
  try {
    const timesheetDetailsData = await sql`
      SELECT *
      FROM timesheetdetails
      WHERE timesheetid = ${timesheetID}
        AND employeeid = ${employeeID};
    `;

    const timesheetDetails = timesheetDetailsData.rows;

    return {
      success: true,
      timesheetDetails: timesheetDetails
    }
  } catch(error) {
    console.error(error);
    return {
      success: false,
      message: JSON.stringify(error)
    }
  }
}

export async function addEmptyTimesheet() {
  const session = await getServerSession(authOptions);

  if (!session) {
    console.error("Session was unable to be retrieved!");
    return {
      success: false,
      message: "Session was unable to be retrieved!",
    };
  }

  const employeeid = Number(session.user.id);
  const user = await fetchEmployeeByID(employeeid)
  const submittedby = user.username;

	const today = DateTime.now();
	const weekday = today.weekday;
	const weekending = today.plus({days: 7 - weekday}).toLocaleString();

	const usercommitted = false;
	const totalreghours = 0.0;
	const totalovertime = 0.0;
	const message = null;

	const processed = false;
	const mgrapproved = false;
	const approvedby = null;
	const processedby = null;
	const dateprocessed = null;

	const addSuccess = await addTimesheetHelper(
		true,
		employeeid,
		submittedby,
		weekending,
		usercommitted,
		processed,
		mgrapproved,
		approvedby,
		processedby,
		totalreghours,
		totalovertime,
		message,
		dateprocessed,
	)

	return {
    ...addSuccess,
    weekending,
    submittedby
  };
}

// Only call this funciton if session and employee ID is verified, 
// and the recipiant of the returned values has been authorized to recieve them.
async function addTimesheetHelper(
	addBlankDetails: boolean,
	employeeid: number,
	submittedby: string,
	weekending: string,
	usercommitted: boolean,
	processed: boolean,
	mgrapproved: boolean,
	approvedby: string | null,
	processedby: string | null,
	totalreghours: number,
	totalovertime: number,
	message: string | null,
	dateprocessed: string | null,
) {
  // Add a timesheet entry
  let timesheetID: number;
  try {
    const timesheetIDData = await sql`
      INSERT INTO timesheets (
        employeeid, weekending, processed, mgrapproved, usercommitted, totalreghours,
        totalovertime, approvedby, submittedby, processedby, dateprocessed, message
      )
      VALUES (
        ${employeeid}, ${weekending}, ${processed ? 1 : 0},
        ${mgrapproved ? 1 : 0}, ${usercommitted ? 1 : 0}, ${totalreghours}, ${totalovertime},
        ${approvedby}, ${submittedby}, ${processedby}, ${dateprocessed}, ${message}
      )
      RETURNING id;
    `;
	
    timesheetID = timesheetIDData.rows[0].id;

    // Add details if indicated in parameter
	  if (addBlankDetails) {
      const addTimesheetDetailsRes = await addTimesheetDetailsHelper({
        timesheetid: timesheetID,
        employeeid: employeeid,
      });
		  
      if(!addTimesheetDetailsRes.success) {
        console.error('Database Error: Failed to Create TimesheetDetails.');
        return {
          success: false,
          message: "Database Error: Failed to Create TimesheetDetails."
        };
      }
	  }

  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: JSON.stringify(error),
    };
  }
  return {
    success: true,
    message: "Timesheet was added successfully!",
    id: timesheetID
  };
}

export async function fetchTimesheetsWithAuth() {

  const session = await getServerSession(authOptions);

  if (!session) {
    console.log("Session was unable to be retrieved!");
    return null;

  }

  const employeeid = Number(session.user.id);

  if (isNaN(employeeid)) {
    console.error('id is not a number');
    return null;
  }

  try {
	  const data = await sql<Timesheet>`
      SELECT
		id, employeeid, weekending, processed, mgrapproved,
		usercommitted, totalreghours, totalovertime, approvedby,
		submittedby, processedby, dateprocessed, message
      FROM timesheets
      WHERE timesheets.employeeid = ${employeeid}
	  ORDER BY weekending DESC;
	  `;
	  const dataRows = data.rows;
    //console.log(dataRows);
	  return dataRows;
	} catch (error) {
	  console.error('Database Error:', error);
	  return null;
	}

}

// Intended to be ran as a server helper function
async function addTimesheetDetailsHelper({
  timesheetid,
  employeeid,
  projectid = 0,
  phase = 0,
  costcode = 0,
  description = null,
  mon = 0, monot = 0, tues = 0, tuesot = 0,
  wed = 0, wedot = 0, thurs = 0, thursot = 0,
  fri = 0, friot = 0, sat = 0, satot = 0,
  sun = 0, sunot = 0,
}: {
    timesheetid: number,
    employeeid: number,
    projectid?: number,
    phase?: number,
    costcode?: number,
    description?: string | null,
    mon?: number, monot?: number, tues?: number, tuesot?: number,
    wed?: number, wedot?: number, thurs?: number, thursot?: number,
    fri?: number, friot?: number, sat?: number, satot?: number,
    sun?: number, sunot?: number,
}) {
	// Get last edit date
	const currentDate = DateTime.now().setZone('utc').toISO();

  try {
    await sql`
    INSERT INTO timesheetdetails (
      timesheetid, employeeid, projectid,
      phase, costcode, description,
      mon, monot,
      tues, tuesot,
      wed, wedot,
      thurs, thursot,
      fri, friot,
      sat, satot,
      sun, sunot,
	    lasteditdate
    )
    VALUES (
      ${timesheetid}, ${employeeid}, ${projectid},
      ${phase}, ${costcode}, ${description},
      ${mon}, ${monot},
      ${tues}, ${tuesot},
      ${wed}, ${wedot},
      ${thurs}, ${thursot},
      ${fri}, ${friot},
      ${sat}, ${satot},
      ${sun}, ${sunot},
	    ${currentDate}
    )
    `;

    return {
      success: true,
      message: "Successfully added Timesheet Details!"
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: JSON.stringify(error)
    };
  }
}

export async function addTimesheetDetails(timesheetID: number) {

  const validatedTimesheet = z.number().safeParse(timesheetID);

	if (!validatedTimesheet.success) {
		return {
			errors: validatedTimesheet.error.flatten().fieldErrors,
			message: 'Failed to Validate TimesheetID.',
		};
	}

  const validatedTimesheetID = validatedTimesheet.data;

	const session = await getServerSession(authOptions);

	if (!session) {
		console.log("Session was unable to be retrieved!");
		return {
			message: 'Session was unable to be retrieved!',
		};

	}

	const employeeID = Number(session.user.id);

	// Ensure timesheetID belongs to employee
	const validOwnership = await employeeOwnsTimesheet(employeeID, validatedTimesheetID);
	if (!validOwnership) {
		console.log("Employee does not own provided timesheet!");
		return {
			message: 'Employee does not own provided timesheet!',
		};
	}

	try{
		const addTimesheetDetailsRes = await addTimesheetDetailsHelper({
			timesheetid: validatedTimesheetID,
			employeeid: employeeID,
		});
	
		if(!addTimesheetDetailsRes.success) {
			return {
				message: 'Failed to Create TimesheetDetails.',
			};
		}

	} catch(error) {
		console.error(error);
			return {
				message: 'Failed to Create TimesheetDetails.',
		};
	}
  revalidatePath(`/dashboard`);
	// revalidatePath(`/dashboard/${validatedTimesheetID}/edit/details`);
	// redirect(`/dashboard/${validatedTimesheetID}/edit/details`);
}



export async function editTimesheetDetails(
	timesheetID: number,
	prevState: any,
	formData: FormData
): Promise<EditDetailsType> {
	//console.log(formData);

	const validatedTimesheet = z.number().safeParse(timesheetID);

	// If form validation fails, return errors early. Otherwise, continue.
	if (!validatedTimesheet.success) {
		return {
      success: false,
			errors: validatedTimesheet.error.flatten().fieldErrors,
			message: 'Failed to Validate timesheetID.',
		};
	}

  const validatedTimesheetID = validatedTimesheet.data;

	// Get user session and id
	const session = await getServerSession(authOptions);

	if (!session) {
		console.log("Session was unable to be retrieved!");
		return {
      success: false,
			message: 'Session was unable to be retrieved!',
		};

	}

	const employeeID = Number(session.user.id);

	// Ensure timesheetID belongs to employee
	const validOwnership = await employeeOwnsTimesheet(employeeID, validatedTimesheetID);
	if (!validOwnership) {
		console.log("Employee does not own provided timesheet!");
		return {
      success: false,
			message: 'Employee does not own provided timesheet!',
		};
	}

	// Ensure that timesheet is not signed
	try {
		const timesheetIsSigned = await sql`
		SELECT usercommitted
		FROM timesheets
		WHERE id = ${validatedTimesheetID};
		`
		console.log(timesheetIsSigned.rows[0]);
		if (timesheetIsSigned.rows[0].usercommitted) {
		return {
			success: false,
			message: 'Cannot edit a signed timesheet!'
		}
		}

	} catch(error) {
		console.error(error);
		return {
			success: false,
			errors: JSON.stringify(error),
			message: 'Error checking if timesheet is signed!'
		}
	}

	// Validate WeekEnding
  	let validatedWeekEnding;
	try {
		validatedWeekEnding = DateSchema.safeParse({
			date: formData.get('weekEnding')
		})
	} catch(error) {
		console.error(error);
		return {
		  success: false,
		  errors: JSON.stringify(error),
		  message: 'Error validating Week Ending value!'
		}
	}

	if (!validatedWeekEnding.success) {
		console.error(validatedWeekEnding.error);
		return {
			success: false,
			errors: validatedWeekEnding.error.flatten().fieldErrors,
			message: 'Error validating Week Ending value!',
		};
	}

	//console.log(validatedWeekEnding.data.weekEnding)

	// Update WeekEnding for timesheet
	try {
		await sql`
		UPDATE timesheets
		SET weekEnding = ${validatedWeekEnding.data.date}
		WHERE id = ${validatedTimesheetID};
	  `;
	} catch(error) {
		console.error(error);
		return {
		  success: false,
		  errors: JSON.stringify(error),
		  message: 'Error entering Week Ending value into database!'
		}
	}


	// Separate TDSs from formData
	const separateTSDs = separateTimesheetFormData(formData);

	// Validate each TSD and add it to array

  type validatedTSDType = {
		id: number;
		project: number;
    	phase_costcode: string;
		// phase: number;
		// costcode: number;
		description: string;
		mon: number;
		tues: number;
		wed: number;
		thurs: number;
		fri: number;
		sat: number;
		sun: number;
		monot: number;
		tuesot: number;
		wedot: number;
		thursot: number;
		friot: number;
		satot: number;
		sunot: number;
	};

	const validatedTSDs: validatedTSDType[] = [];

 	for (const tsdkey in separateTSDs) {
		const validatedTSD = EditTimesheetDetails.safeParse({
			id: Number(separateTSDs[tsdkey]['id']),
			project: Number(separateTSDs[tsdkey]['project']),
      		phase_costcode: separateTSDs[tsdkey]['phase_costcode'],
			// phase: Number(separateTSDs[tsdkey]['phase']),
			// costcode: Number(separateTSDs[tsdkey]['costcode']),
			description: separateTSDs[tsdkey]['description'],
			mon: Number(separateTSDs[tsdkey]['mon']),
			tues: Number(separateTSDs[tsdkey]['tues']),
			wed: Number(separateTSDs[tsdkey]['wed']),
			thurs: Number(separateTSDs[tsdkey]['thurs']),
			fri: Number(separateTSDs[tsdkey]['fri']),
			sat: Number(separateTSDs[tsdkey]['sat']),
			sun: Number(separateTSDs[tsdkey]['sun']),
			monot: Number(separateTSDs[tsdkey]['monOT']),
			tuesot: Number(separateTSDs[tsdkey]['tuesOT']),
			wedot: Number(separateTSDs[tsdkey]['wedOT']),
			thursot: Number(separateTSDs[tsdkey]['thursOT']),
			friot: Number(separateTSDs[tsdkey]['friOT']),
			satot: Number(separateTSDs[tsdkey]['satOT']),
			sunot: Number(separateTSDs[tsdkey]['sunOT'])
		});


		if (!validatedTSD.success) {
			console.error(validatedTSD.error);
			return {
        		success: false,
				errors: validatedTSD.error.flatten().fieldErrors,
				message: 'Incorrect or Missing Fields. Failed to Validate timesheet ID.',
			};
		}

		validatedTSDs.push(validatedTSD.data);

	}

  // Delete all TSDs associated with the timesheet
  try{ // Note - could make this more robost by temporarily storing the TSDs in DB before deletion
    await sql`
      DELETE FROM timesheetdetails
      WHERE timesheetid = ${validatedTimesheetID};
    `;
  } catch(error) {
    console.error(error);
    return {
      success: false,
      errors: JSON.stringify(error),
      message: 'Failed to delete old TSDs'
    }
  }

  // Add all validated TSDs to Database
  let totalReg = 0.0;
  let totalOT = 0.0;
	for (const TSD of validatedTSDs) {
		const {id, project, phase_costcode, description,
			mon, tues, wed, thurs, fri, sat, sun,
			monot, tuesot, wedot, thursot, friot, satot, sunot} = TSD;

    const phase_costcode_split = phase_costcode.split('-');
    const phase = Number(phase_costcode_split[0]);
    const costcode = Number(phase_costcode_split[1]);

    try{
      const addTimesheetDetailsRes = await addTimesheetDetailsHelper({
        timesheetid: validatedTimesheetID,
        employeeid: employeeID,
        projectid: project,
        phase: phase,
        costcode: costcode,
        description: description,
        mon: mon,
        monot: monot,
        tues: tues,
        tuesot: tuesot,
        wed: wed,
        wedot: wedot,
        thurs: thurs,
        thursot: thursot,
        fri: fri,
        friot: friot,
        sat: sat,
        satot: satot,
        sun: sun,
        sunot: sunot,
      });

      totalReg += (mon + tues + wed + thurs + fri + sat + sun);
      totalOT += (monot + tuesot + wedot + thursot + friot + satot + sunot);
    
      if(!addTimesheetDetailsRes.success) {
        return {
          success: false,
          message: 'Failed to Create Timesheet Details.',
        };
      }
  
    } catch(error) {
      console.error(error);
      return {
        success: false,
        errors: JSON.stringify(error),
        message: 'Failed to Create Timesheet Details.',
      };
    }
	}

  // Update the associated timesheet's totalreghours and totalovertime
  try {
    await sql`
      UPDATE timesheets
      SET totalreghours = ${totalReg}, 
        totalovertime =${totalOT}
      WHERE id = ${validatedTimesheetID};    
    `;
  } catch(error) {
    console.error(error);
    return {
      success: false,
      errors: JSON.stringify(error),
      message: 'Failed to Update Timesheet Details',
    };
  }

  // Return success
  return {
    success: true,
    message: 'Timesheet Details were successfully updated!'
  }

}

// Deprecated
async function timesheetDetailsBelongsToTimesheet(timesheetDetailsID: number, timesheetID: number) {
	try{
		const belongsData = await sql`
			SELECT EXISTS (
				SELECT 1
				FROM timesheetdetails
				WHERE id = ${timesheetDetailsID} AND timesheetid = ${timesheetID}
			) AS belongs;
		`;
		
		return belongsData.rows[0].belongs;
	} catch(error) {
		console.error(error);
		throw error;
	}
}

async function employeeOwnsTimesheet(employeeID: number, timesheetID: number) {
	try{
		const validOwnership = await sql`
		SELECT EXISTS (
			SELECT 1
			FROM timesheets
			WHERE id = ${timesheetID}
			AND (employeeid = ${employeeID} OR id IS NULL)
		) AS timesheet_exists;	
		`;

		return validOwnership.rows[0].timesheet_exists;
	} catch(error) {
		console.error(error);
		throw error;
	}
}

interface SeparatedFormData {
  [key: string]: {
      [key: string]: string;
  };
}

function separateTimesheetFormData(formData: FormData): SeparatedFormData {
  const result: SeparatedFormData = {};
  
  formData.forEach((value, name) => {
      const matches = name.match(/^TSD(\d+)\[([^]+)\]$/);
      
      if (matches) {
          const [, index, key] = matches;
          if (!result[`TSD${index}`]) {
              result[`TSD${index}`] = {};
          }
          if (typeof value === 'string') {
              result[`TSD${index}`][key] = value;
          }
      }
  });
  
  return result;
}

export async function fetchTimesheetDetailsEditFormData(
  timesheetID: number
) {
	unstable_noStore();

	const validatedTimesheet = z.number().safeParse(timesheetID);

	if (!validatedTimesheet.success) {
		console.error(validatedTimesheet.error.flatten().fieldErrors);
		throw new Error('Failed to Validate TimesheetID.')
	}

	// Ensure user is logged in
	const session = await getServerSession(authOptions);

	if (!session) {
		throw new Error('Failed to user Session.');
	}
	
	const employeeID = Number(session.user.id);
	const validatedTimesheetID = validatedTimesheet.data;

	// Ensure timesheetID belongs to employee
	const validOwnership = await employeeOwnsTimesheet(employeeID, validatedTimesheetID);
	if (!validOwnership) {
		throw new Error("Employee does not own provided timesheet!")
	}

	try {
		const TSDData = await sql<TimesheetDetails>`
			SELECT
				id, timesheetid, employeeid, projectid,
				phase, costcode, description,
				mon, monot,
				tues, tuesot,
				wed, wedot,
				thurs, thursot,
				fri, friot,
				sat, satot,
				sun, sunot,
				lasteditdate
			FROM timesheetdetails
			WHERE timesheetdetails.timesheetid = ${validatedTimesheetID}
		`;
		const timesheetDetails = TSDData.rows;
		const projectsData = await sql<ProjectOption>`
		SELECT id, number, shortname, description FROM projects;
		`;
	
		// const phasesData = await sql<PhaseOption>`
		//   SELECT id, description FROM phases;
		// `;

		// const costCodesData = await sql<CostCodeOption>`
		//   SELECT id, description FROM costcodes;
		// `;

		const phaseCostCodesData = await sql<PhaseCostCodeOption>`
		SELECT phase, costcode, description FROM phase_costcodes;
		`;

		const projects = projectsData.rows;
		const phaseCostCodes = phaseCostCodesData.rows;
		// const phases = phasesData.rows;
		// const costcodes = costCodesData.rows;

		const options: Options = {
		projects,
		phaseCostCodes,
		// phases,
		// costcodes,
		}
		
		return {options, timesheetDetails};

	} catch (error) {
		console.error('Database Error:', error);
		throw error;
	}

}

// Deprecated
export async function deleteTimesheetDetails(
	timesheetDetailsID: number,
) {
	const validatedTSDID = z.number().safeParse(timesheetDetailsID);

	if (!validatedTSDID.success) {
		return {
			errors: validatedTSDID.error.flatten().fieldErrors,
			message: 'Failed to Validate TSD.',
		};
	}

	// Ensure user is logged in
	const session = await getServerSession(authOptions);

	if (!session) {
		console.log("Session was unable to be retrieved!");
		return {
			message: 'Session was unable to be retrieved!',
		};
	}
	
	const employeeid = Number(session.user.id);
	const TSDID = validatedTSDID.data;
	let timesheetid = null;

  console.log(TSDID)

	try {
		const timesheetData = await sql`
			SELECT timesheetid
			FROM timesheetdetails
			WHERE id = ${TSDID};
		`;
		if (timesheetData.rows.length < 1) {
			const error = "Timesheet was not found!"
			console.error(error);
			return {
				message: error,
			};
		}
		timesheetid = timesheetData.rows[0].timesheetid;
	} catch(error) {
		console.error(error);
		return {
			message: 'Failed to retrieve timesheet!',
		};
	}

	try {
		await sql`
		DELETE FROM timesheetdetails
		WHERE id = ${TSDID}
		  AND employeeid = ${employeeid}
		  AND EXISTS (
			SELECT 1
			FROM timesheetdetails
			WHERE timesheetid = (
				SELECT timesheetid
				FROM timesheetdetails
				WHERE id = ${TSDID}
			  )
			AND id != ${TSDID}
		  );
		`;
	} catch(error) {
		console.error(error);
		return {
			message: 'Failed to delete timesheet details!',
		};
	}

	if (timesheetid == null){
		return {
			message: 'Failed to delete timesheet details!',
		};
	}

  console.log(timesheetid)

	revalidatePath('/dashboard/' + timesheetid + '/edit/details');
	redirect('/dashboard/' + timesheetid + '/edit/details');
}

// Deprecated
export async function editTimesheet( // Check if user has permissions to edit
	timesheetid: number,
	prevState: EmployeeState,
	formData: FormData,
) {
  const validatedFields = EditTimesheet.safeParse({
    id: timesheetid,
    weekending: formData.get('weekending'),
    usercommitted: formData.get('usercommitted'),
    totalreghours: formData.get('totalreghours'),
    totalovertime: formData.get('totalovertime'),
    message: formData.get('message'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Project.',
    };
  }

  const {
    id, weekending, usercommitted, totalreghours, totalovertime, message
  } = validatedFields.data;

  // Ensure user is logged in
  const session = await getServerSession(authOptions);

  if (!session) {
    console.log("Session was unable to be retrieved!");
    return {
      message: 'Session was unable to be retrieved!',
    };
  }

  const sessionEmployeeid = Number(session.user.id);

  // Get database data
  const DBtimesheetData = await sql`
    SELECT 
      employeeid,
      weekending,
      processed,
      mgrapproved,
      usercommitted,
      totalreghours,
      totalovertime,
      approvedby,
      submittedby,
      processedby,
      dateprocessed,
      message
    FROM timesheets
    WHERE timesheets.id = ${id};
  `;

  if (!(DBtimesheetData && DBtimesheetData.rowCount > 0)) {
    console.log("Timesheet of ID was not found!");
    return {
      message: 'Timesheet of ID was not found!',
    };
  }

  const DBdata = DBtimesheetData.rows[0];

  // Validate the user is trying to edit their own timesheet
  const DBemployeeid = DBdata.employeeid;

  if (Number(DBemployeeid) != sessionEmployeeid) {
    console.log("Session user id did not match with associated timesheet!");
    return {
      message: 'Session user id did not match with associated timesheet!',
    };
  }

  // Ensure the timesheet is not already approved or processed
  const DBmgrapproved = DBdata.mgrapproved;
  const DBprocessed = DBdata.processed;

  if (DBmgrapproved == true || DBprocessed == true) {
    console.log("Timesheet has already been approved or processed!");
    return {
      message: 'Timesheet has already been approved or processed!',
    };
  }

  // Make sure data was actually updated
  if (
    weekending == DBdata.weekending &&
    usercommitted == DBdata.usercommitted &&
    totalreghours == DBdata.totalreghours &&
    totalovertime == DBdata.totalovertime &&
    message == DBdata.message
  ) {
    console.log("No new data was present in the edited form!");
    return {
      message: 'No new data was present in the edited form!',
    };
  }

  // Get username of user
  const usernameData = await sql`
    SELECT username
    FROM employees
    WHERE employees.id = ${DBemployeeid}
  `;

  if (!(usernameData && usernameData.rowCount > 0)) {
    console.log("Timesheet of ID was not found!");
    return {
      message: 'Timesheet of ID was not found!',
    };
  }

  const username = usernameData.rows[0].username;

  // Set the rest of the values to be updated
  const processed = false;
  const mgrapproved = false;
  const submittedby = username;


  try {
    await sql`
    UPDATE timesheets
    SET
      weekending = ${weekending.toLocaleDateString('en-us')},
      processed = ${processed ? 1 : 0},
      mgrapproved = ${mgrapproved ? 1 : 0},
      usercommitted = ${usercommitted ? 1 : 0},
      totalreghours = ${totalreghours},
      totalovertime = ${totalovertime},
      submittedby = ${submittedby},
      message = ${message}
    WHERE id = ${id}
  `;
  } catch (error) {
    console.log(error);
    return {
      message: 'Database Error: Failed to Edit Timesheet.',
    };
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function editEmployee(
  id: number,
	prevState: EmployeeState,
	formData: FormData,
) {
  const validatedFields = EditEmployee.safeParse({
    number: formData.get('number'),
    username: formData.get('username'),
    password: formData.get('password'),
    firstname: formData.get('firstname'),
    lastname: formData.get('lastname'),
    cellphone: formData.get('cellphone'),
    homephone: formData.get('homephone'),
    email: formData.get('email'),
    managerid: formData.get('managerid'),
    accesslevel: formData.get('accesslevel'),
    timesheetrequired: formData.get('timesheetrequired'),
    overtimeeligible: formData.get('overtimeeligible'),
    tabnavigateot: formData.get('tabnavigateot'),
    emailexpensecopy: formData.get('emailexpensecopy'),
    activeemployee: formData.get('activeemployee'),
    ientertimedata: formData.get('ientertimedata'),
    numtimesheetsummaries: formData.get('numtimesheetsummaries'),
    numexpensesummaries: formData.get('numexpensesummaries'),
    numdefaulttimerows: formData.get('numdefaulttimerows'),
    contractor: formData.get('contractor'),
  });

  console.log(validatedFields);
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    console.log(validatedFields.error)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Edit Employee.',
    };
  }

  const {number, username, password, firstname, lastname, cellphone, homephone,
    email, managerid, accesslevel, timesheetrequired, overtimeeligible, tabnavigateot,
    emailexpensecopy, activeemployee, ientertimedata, numtimesheetsummaries,
    numexpensesummaries, numdefaulttimerows, contractor
  } = validatedFields.data;

  // Prepare data for insertion into the database
  // Noting needed as of now

  try {
    await sql`
    UPDATE employees
    SET
      number = ${number},
      username = ${username},
      password = ${password},
      firstname = ${firstname},
      lastname = ${lastname},
      cellphone = ${cellphone},
      homephone = ${homephone},
      email = ${email},
      managerid = ${managerid},
      accesslevel = ${accesslevel},
      timesheetrequired = ${timesheetrequired ? 1 : 0},
      overtimeeligible = ${overtimeeligible ? 1 : 0},
      tabnavigateot = ${tabnavigateot ? 1 : 0},
      emailexpensecopy = ${emailexpensecopy ? 1 : 0},
      activeemployee = ${activeemployee ? 1 : 0},
      ientertimedata = ${ientertimedata ? 1 : 0},
      numtimesheetsummaries = ${numtimesheetsummaries},
      numexpensesummaries = ${numexpensesummaries},
      numdefaulttimerows = ${numdefaulttimerows},
      contractor = ${contractor ? 1 : 0}
    WHERE id = ${id};
  `;
  } catch (error) {
    console.log(error);
    return {
      message: 'Database Error: Failed to Edit Employee.',
    };
  }

  revalidatePath('/dashboard/employees');
  redirect('/dashboard/employees');
}

export async function editProject(
  id: number,
	prevState: ProjectState,
	formData: FormData,
) {
  const validatedFields = EditProject.safeParse({
    number: formData.get('number'),
    description: formData.get('description'),
    startdate: formData.get('startdate'),
    enddate: formData.get('enddate'),
    shortname: formData.get('shortname'),
    customerpo: formData.get('customerpo'),
    customercontact: formData.get('customercontact'),
    comments: formData.get('comments'),
    overtime: formData.get('overtime'),
    sgaflag: formData.get('sgaflag'),
  });

  console.log(validatedFields);
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    console.log(validatedFields.error)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Edit Project.',
    };
  }

  const {
    number, description, startdate, enddate, shortname,
    customerpo, customercontact, comments, overtime, sgaflag
  } = validatedFields.data;

  // Prepare data for insertion into the database
  // Noting needed as of now

  try {
    await sql`
    UPDATE projects
    SET
      number = ${number},
      description = ${description},
      startdate = ${startdate.toLocaleDateString('en-us')},
      enddate = ${enddate.toLocaleDateString('en-us')},
      shortname = ${shortname},
      customerpo = ${customerpo},
      customercontact = ${customercontact},
      comments = ${comments},
      overtime = ${overtime ? 1 : 0},
      sgaflag = ${sgaflag ? 1 : 0}
    WHERE id = ${id};
  `;
  } catch (error) {
    console.log(error);
    return {
      message: 'Database Error: Failed to Edit Project.',
    };
  }

  revalidatePath('/dashboard/projects');
  redirect('/dashboard/projects');
}

export async function deleteTimesheet(
  timesheetid: number
) {
  const validatedFields = OnlyTimesheetID.safeParse({
    id: timesheetid,
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Project.',
    };
  }

  const { id } = validatedFields.data;

  // Get the user session to ensure they are who they say they are
  const session = await getServerSession(authOptions);

  if (!session) {
    console.log("Session was unable to be retrieved!");
    return {
      message: 'Session was unable to be retrieved!',
    };

  }

  const sessionEmployeeid = Number(session.user.id);

  // Get database data
  var DBtimesheetData;
  try {
	DBtimesheetData = await sql`
		SELECT 
		employeeid
		FROM timesheets
		WHERE timesheets.id = ${id};
	`;
  } catch (error) {
	return {
		message: 'Database Error: Failed to get Timesheet Data.',
	};
}

  if (!(DBtimesheetData && DBtimesheetData.rowCount > 0)) {
    console.log("Timesheet of ID was not found!");
    return {
      message: 'Timesheet of ID was not found!',
    };
  }

  const DBdata = DBtimesheetData.rows[0];

  // Validate the user is trying to delete their own timesheet
  const DBemployeeid = DBdata.employeeid;

  if (Number(DBemployeeid) != sessionEmployeeid) {
    console.log("Session user id did not match with associated timesheet!");
    return {
      message: 'Session user id did not match with associated timesheet!',
    };
  }

  try {
	await deleteTimesheetDetailsByTimesheet(id);

    await sql`
      DELETE FROM timesheets
      WHERE id = ${id}; 
    `;
  } catch (error) {
    console.log(error);
    return {
      message: 'Database Error: Failed to Delete Timesheet.',
    };
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

async function deleteTimesheetDetailsByTimesheet(timesheetid: number) {
	try {
		await sql`
			DELETE FROM timesheetdetails WHERE timesheetid = ${timesheetid};
		`;
	} catch(error) {
		console.log(error);
		return;
	}
}

export async function toggleTimesheetSignedValue(timesheetid: number) {
	const validatedFields = OnlyTimesheetID.safeParse({
		id: timesheetid,
	});
	
	  // If form validation fails, return errors early. Otherwise, continue.
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Missing fields. Failed to validate timesheet ID.',
		};
	}
	
	const { id } = validatedFields.data;

	// Get the user session to ensure they are who they say they are
	const session = await getServerSession(authOptions);

	if (!session) {
		console.log("Session was unable to be retrieved!");
		return {
			message: 'Session was unable to be retrieved!',
		};
	}
	
	const employeeid = Number(session.user.id);

	try {
		await sql`
			UPDATE timesheets
			SET usercommitted = NOT usercommitted
			WHERE id = ${id} AND employeeid = ${employeeid};
		`;
	} catch(error) {
		console.error(error);
		return {
			message: 'Failed to toggle signed value!',
		};
	}
}

export async function createInvoice(prevState: InvoiceState, formData: FormData) {
    const validatedFields = CreateInvoice.safeParse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Invoice.',
        };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(
    id: string,
    prevState: InvoiceState,
    formData: FormData
) {
    const validatedFields = UpdateInvoice.safeParse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
   
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
        };
    }
    
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
   
    try {
        await sql`
            UPDATE invoices
            SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
            WHERE id = ${id}
        `;
    } catch (error) {
        return {
            message: 'Database Error: Failed to Update Invoice.',
        };
    }

   
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
        return { message: 'Deleted Invoice.' };
    } catch (error) {
        return {
            message: 'Database Error: Failed to Delete Invoice.',
        };
    }
}