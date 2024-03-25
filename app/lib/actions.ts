'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
//import { signIn } from '@/auth';
//import { AuthError } from 'next-auth';
import { EmployeeState, ProjectState } from './definitions';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/options';
import { fetchEmployeeByID } from './data';
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
  phase: z.coerce.number(),
  costcode: z.coerce.number(),
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
})

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

export async function addTimesheet(
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

  // Prepare data for insertion into the database
  const session = await getServerSession(authOptions);

  if (!session) {
    console.log("Session was unable to be retrieved!");
    return {
      message: 'Session was unable to be retrieved!',
    };

  }

  const employeeid = Number(session.user.id);

  const user = await fetchEmployeeByID(employeeid)

  const processed = false;
  const mgrapproved = false;
  const approvedby = null;
  const submittedby = user.username;
  const processedby = null;
  const dateprocessed = null;

  // Add a timesheet entry
  try {
    const timesheetIDData = await sql`
    INSERT INTO timesheets (
      employeeid, weekending, processed, mgrapproved, usercommitted, totalreghours,
      totalovertime, approvedby, submittedby, processedby, dateprocessed, message
    )
    VALUES (
      ${employeeid}, ${weekending.toLocaleDateString('en-us')}, ${processed ? 1 : 0},
      ${mgrapproved ? 1 : 0}, ${usercommitted ? 1 : 0}, ${totalreghours}, ${totalovertime},
      ${approvedby}, ${submittedby}, ${processedby}, ${dateprocessed}, ${message}
    )
	RETURNING id;
    `;
	
	const timesheetID: number = timesheetIDData.rows[0].id;

	const addSuccess = await addTimesheetDetailsHelper({
		timesheetid: timesheetID,
		employeeid: employeeid,
	});
	
	if(!addSuccess) {
		return {
			message: 'Database Error: Failed to Create TimesheetDetails.',
		};
	}

  } catch (error) {
    console.log(error);
    return {
      message: 'Database Error: Failed to Create Timesheet.',
    };
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
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
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
}

export async function addTimesheetDetails(timesheetID: number) {

	const session = await getServerSession(authOptions);

	if (!session) {
		console.log("Session was unable to be retrieved!");
		return {
			message: 'Session was unable to be retrieved!',
		};

	}

	const employeeID = Number(session.user.id);

	// Ensure timesheetID belongs to employee
	const validOwnership = await employeeOwnsTimesheet(employeeID, timesheetID);
	if (!validOwnership) {
		console.log("Employee does not own provided timesheet!");
		return {
			message: 'Employee does not own provided timesheet!',
		};
	}

	try{
		const addSuccess = await addTimesheetDetailsHelper({
			timesheetid: timesheetID,
			employeeid: employeeID,
		});
	
		if(!addSuccess) {
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
	revalidatePath(`/dashboard/${timesheetID}/edit/details`);
	redirect(`/dashboard/${timesheetID}/edit/details`);
}

export async function editTimesheetDetails(
	timesheetID: number,
	prevState: any,
	formData: FormData
) {
	//console.log(formData);

	// // Validate timesheetID
	// const validatedTimesheetID = SingleTimesheetID.safeParse({
	// 	timesheetid: Number(timesheetID)
	// })


	const validatedTimesheetID = z.number().safeParse(timesheetID);

	// If form validation fails, return errors early. Otherwise, continue.
	if (!validatedTimesheetID.success) {
		return {
			errors: validatedTimesheetID.error.flatten().fieldErrors,
			message: 'Failed to Validate timesheetID.',
		};
	}

	// Get user session and id
	const session = await getServerSession(authOptions);

	if (!session) {
		console.log("Session was unable to be retrieved!");
		return {
			message: 'Session was unable to be retrieved!',
		};

	}

	const employeeID = Number(session.user.id);

	// Ensure timesheetID belongs to employee
	const validOwnership = await employeeOwnsTimesheet(employeeID, timesheetID);
	if (!validOwnership) {
		console.log("Employee does not own provided timesheet!");
		return {
			message: 'Employee does not own provided timesheet!',
		};
	}

	// Separate TDSs from formData
	const separateTSDs = separateFormData(formData);

	// Validate each TSD and add it to array

  	type validatedTSDType = {
		id: number;
		project: number;
		phase: number;
		costcode: number;
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
		//console.log(separateTSDs[tsdkey])
		// for (const propertykey in separateTSDs[tsdkey]) {
		// 	console.log(propertykey)
		// 	console.log(separateTSDs[tsdkey][propertykey])
		// }
		const validatedTSD = EditTimesheetDetails.safeParse({
			id: Number(separateTSDs[tsdkey]['id']),
			project: Number(separateTSDs[tsdkey]['project']),
			phase: Number(separateTSDs[tsdkey]['phase']),
			costcode: Number(separateTSDs[tsdkey]['costcode']),
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
				errors: validatedTSD.error.flatten().fieldErrors,
				message: 'Incorrect or Missing Fields. Failed to Validate timesheetID.',
			};
		}
		
		// Ensure validatedTSD's id field is linked to the timesheet

		const TSDBelongsToTimesheet = await timesheetDetailsBelongsToTimesheet(validatedTSD.data.id, timesheetID);

		if (!TSDBelongsToTimesheet) {
			const error = 'Timesheet Details does not belong to Timesheet';
			console.error(error)
			return {
				message: error,
			}
		}

		validatedTSDs.push(validatedTSD.data)

	}

	//console.log(validatedTSDs);

	for (const TSD of validatedTSDs) {
		const {id, project, phase, costcode, description,
			mon, tues, wed, thurs, fri, sat, sun,
			monot, tuesot, wedot, thursot, friot, satot, sunot} = TSD;

		try{
			await sql`
			UPDATE timesheetdetails
			SET 
				projectid = ${project},
				phase = ${phase},
				costcode = ${costcode},
				description = ${description},
				mon = ${mon},
				monot = ${monot},
				tues = ${tues},
				tuesot = ${tuesot},
				wed = ${wed},
				wedot = ${wedot},
				thurs = ${thurs},
				thursot = ${thursot},
				fri = ${fri},
				friot = ${friot},
				sat = ${sat},
				satot = ${satot},
				sun = ${sun},
				sunot = ${sunot}
			WHERE id = ${id};
			`;
		} catch(error) {
			console.error(error);
			throw error;
		}
	}


  // formData.forEach((val, name) => {
  //   console.log(name, val);
  // })

  // const validatedFields = EditTimesheetDetails.safeParse({
  //   id: formData.f
  // })

  // console.log(validatedFields)
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

	revalidatePath(`/dashboard/${timesheetid}/edit/details`);
	redirect(`/dashboard/${timesheetid}/edit/details`);
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