'use server';

import { boolean, z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath, unstable_noStore } from 'next/cache';
import { redirect } from 'next/navigation';
//import { signIn } from '@/auth';
//import { AuthError } from 'next-auth';
import { CostCodeOption, EmployeeState, Options, PhaseCostCodeOption, PhaseOption, ProjectOption, ProjectState, Timesheet, TimesheetDetails } from './definitions';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/options';
import { fetchEmployeeByID, fetchTimesheetsByEmployeeID } from './data';
import * as bcrypt from 'bcrypt';
import { DateTime } from 'luxon';
import { time } from 'console';
 
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

const TimesheetSchema = z.object({
  id: z.coerce.number(),
  employeeid: z.coerce.number(),
  weekending: z.coerce.date(),
  processed: z.coerce.boolean(),
  mgrapproved: z.coerce.boolean(),
  usercommitted: z.coerce.boolean(),
  totalreghours: z.coerce.number(),
  totalovertime: z.coerce.number(),
  approvedby: z.string().max(32),
  submittedby: z.string().max(32),
  processedby: z.string().max(32),
  dateprocessed: z.coerce.date(),
  message: z.string().max(4096),
});

const AddTimesheet = TimesheetSchema.pick({
  weekending: true,
  usercommitted: true,
  totalreghours: true,
  totalovertime: true,
  message: true,
})
const EditTimesheet = TimesheetSchema.pick({
  id: true,
  weekending: true,
  usercommitted: true,
  totalreghours: true,
  totalovertime: true,
  message: true,
})
const DeleteTimesheet = TimesheetSchema.pick({ id: true })

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

//const EditTimesheetDetails = z.array(TimesheetDetailsSchema.omit({employeeid: true}));
const EditTimesheetDetails = TimesheetDetailsSchema.omit({
	timesheetid: true,
	employeeid: true,
	lasteditdate: true,
});

const SingleTimesheetID = z.object({
	timesheetid: z.coerce.number()
});

const WeekEndingSchema = z.object({
    weekEnding: z.string().regex(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|([+-]\d{2}:\d{2}))$/,
        "weekEnding must be in valid ISO 8601 format"
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

  console.log("Start Date: ")
  console.log(startdate)
  console.log(startdate.toISOString())
  console.log(startdate.toUTCString())
  console.log(startdate.toTimeString())
  console.log(startdate.toJSON())
  console.log(startdate.toDateString())
  console.log(startdate.getDate())
  console.log(startdate.getUTCDate())
  

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

export async function addTimesheetFromForm(
	prevState: ProjectState,
	formData: FormData,
) {
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
		dateprocessed,
	)

  if (!timesheetHelperRes.success || !timesheetHelperRes.employeeid) {
    return timesheetHelperRes;
  }

  const recentTimesheetRes = await getRecentTimesheet(timesheetHelperRes.employeeid);

  return {
    timesheetHelperRes,
    recentTimesheetRes
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
  if (!recentTimesheetRes.success || !recentTimesheetRes.recentTimesheet) return recentTimesheetRes;

  // Parse recent timesheet
  const recentTimesheet = recentTimesheetRes.recentTimesheet;
  const timesheetID = recentTimesheet.id;
  const recentTotalreghours = recentTimesheet.totalreghours;
  const recentTotalovertime = recentTimesheet.totalovertime;
  const recentMessage = recentTimesheet.message;

  // Get recent timesheet details
  const recentTimesheetDetailsRes = await getTimesheetDetails(timesheetID, employeeid);
  if (!recentTimesheetDetailsRes.success || !recentTimesheetDetailsRes.timesheetDetails) return recentTimesheetDetailsRes;

  // Parse recent timesheet details
  const recentTimesheetDetails = recentTimesheetDetailsRes.timesheetDetails;

  // Create new timesheet with recent totalreghours and totalovertime
  const addTimesheetHelperRes = await addTimesheetHelper(
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
  if (!addTimesheetHelperRes.success || !addTimesheetHelperRes.id) return addTimesheetHelperRes;
  const newTimesheetID = addTimesheetHelperRes.id;

  // Create new timesheet details with recent timesheet details' data but references newly created timesheet
  for (const tsd of recentTimesheetDetails) {
    const addTimesheetDetailsRes = await addTimesheetDetailsHelper(
      
    );
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
      WHERE timesheets.employeeid = ${employeeid};
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
      message: "Successfully added timesheet details!"
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

type FieldErrors = {
  [key: string]: string[] | undefined;
}

type EditTimesheetDetailsType = {
  success: boolean,
  errors?: string | FieldErrors,
  message: string,
}

export async function editTimesheetDetails(
	timesheetID: number,
	prevState: any,
	formData: FormData
): Promise<EditTimesheetDetailsType> {
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
		validatedWeekEnding = WeekEndingSchema.safeParse({
			weekEnding: formData.get('weekEnding')
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
		SET weekEnding = ${validatedWeekEnding.data.weekEnding}
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
	const separateTSDs = separateFormData(formData);

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

function separateFormData(formData: FormData): SeparatedFormData {
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
  const validatedFields = DeleteTimesheet.safeParse({
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
	const validatedFields = DeleteTimesheet.safeParse({
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