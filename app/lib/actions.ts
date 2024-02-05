'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { EmployeeState, ProjectState } from './definitions';
import { start } from 'repl';
 
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
	id: z.string(),
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
	id: z.string(),
	number: z.string().max(12),
	description: z.string().max(50),
	startdate: z.coerce.date(), // may need to change FORMAT: 2023-12-10
	enddate: z.coerce.date(), // may need to change
	shortname: z.string().max(8),
	customerpo: z.string().max(50),
	customercontact: z.string().max(50),
	comments: z.string().max(256),
	overtime: z.coerce.boolean(),
	sgaflag: z.coerce.boolean(),
});

const AddProject = ProjectSchema.omit({ id: true });

export type InvoiceState = {
    errors?: {
      customerId?: string[];
      amount?: string[];
      status?: string[];
    };
    message?: string | null;
};


export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
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

  const {number, username, password, firstname, lastname, cellphone, homephone,
    email, managerid, accesslevel, timesheetrequired, overtimeeligible, tabnavigateot,
    emailexpensecopy, activeemployee, ientertimedata, numtimesheetsummaries,
    numexpensesummaries, numdefaulttimerows, contractor
  } = validatedFields.data;

  // Prepare data for insertion into the database
  // Noting needed as of now

  try {
    await sql`
    INSERT INTO employees (
      number, username, password, firstname, lastname, cellphone, homephone,
      email, managerid, accesslevel, timesheetrequired, overtimeeligible, tabnavigateot,
      emailexpensecopy, activeemployee, ientertimedata, numtimesheetsummaries,
      numexpensesummaries, numdefaulttimerows, contractor
    )
    VALUES (
      ${number}, ${username}, ${password}, ${firstname}, ${lastname},
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
	number,
	description,
	startdate,
	enddate,
	shortname,
	customerpo,
	customercontact,
	comments,
	overtime,
	sgaflag
  } = validatedFields.data;

  // Prepare data for insertion into the database
  // Noting needed as of now

  try {
    await sql`
	INSERT INTO projects (
		number, description, startdate, enddate, shortname, customerpo, customercontact,
		comments, overtime, sgaflag
	)
	VALUES (
		${number}, ${description}, ${startdate.toLocaleDateString('en-US')}, ${enddate.toLocaleDateString('en-US')}, ${shortname},
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

export async function editEmployee(
  id: string,
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
      message: 'Missing Fields. Failed to Create Invoice.',
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
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  revalidatePath('/dashboard/employees');
  redirect('/dashboard/employees');
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