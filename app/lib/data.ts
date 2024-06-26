import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  Revenue,
  Employee,
  Project,
  Timesheet,
  TimesheetEditInfo,
  TimesheetDetails,
  Options,
  ProjectOption,
  PhaseOption,
  CostCodeOption,
} from './definitions';
import { formatCurrency } from './utils';
import { unstable_noStore as noStore } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/options';

// export async function getTest() {
// 	noStore();
// 	try {
// 		const data = await sql<Timesheet>`
// 			SELECT weekending
// 			FROM timesheets
// 		  `;
// 		  console.log(data.rows);
// 		return Response.json(data.rows[0]);
// 	} catch (error) {
// 		  console.error('Database Error:', error);
// 		  return Response.error();
// 		}
// }

export async function getEmployeeByUsername(username: string) {
  noStore();
  try {
    const data = await sql<Employee>`
		SELECT
		  id, number, username,
		  password, firstName, lastName,
		  cellPhone, homePhone, email,
		  managerID, accessLevel, timeSheetRequired,
		  overtimeEligible, TABNavigateOT, emailExpenseCopy,
		  activeEmployee, iEnterTimeData, numTimeSheetSummaries,
		  numExpenseSummaries, numDefaultTimeRows, contractor
		FROM employees
    WHERE employees.username = ${username}
	  `;
    return Response.json(data.rows[0]);
  } catch (error) {
	  console.error('Database Error:', error);
	  return Response.error();
	}
}

export async function fetchTimesheetsByEmployeeID(id: number) {
  noStore();
  
  //console.log(id);

  if (isNaN(id)) {
    console.error('id is not a number');
    return Response.error();
  }

  try {
	  const data = await sql<Timesheet>`
		SELECT
    id, employeeid, weekending, processed, mgrapproved,
    usercommitted, totalreghours, totalovertime, approvedby,
    submittedby, processedby, dateprocessed, message
		FROM timesheets
    WHERE timesheets.employeeid = ${id};
	  `;
	  const dataRows = data.rows;
    //console.log(dataRows);
	  return Response.json(dataRows);
	} catch (error) {
	  console.error('Database Error:', error);
	  return Response.error();
	}
}

export async function fetchTimesheetEditByID(id: number) {
	noStore();

	try {
		const data = await sql<TimesheetEditInfo>`
			SELECT
				weekending, usercommitted, totalreghours,
				totalovertime, message
			FROM timesheets
			WHERE timesheets.id = ${id}
		`;
		const resData = data.rows[0];
		return Response.json(resData);
	} catch (error) {
		console.error('Database Error:', error);
		return Response.error();
	}
}

export async function fetchTimesheetDetailsByTimesheetID(id: number) {
    noStore();
    try {
        const data = await sql<TimesheetDetails>`
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
            WHERE timesheetdetails.timesheetid = ${id}
        `;
        const resData = data.rows;
        return Response.json(resData);
    } catch (error) {
        console.error('Database Error:', error);
        return Response.error();
    }
}


export async function checkTimesheetOwnership(employeeid: number, timesheetid: number) {
	noStore();

	try {
		const data = await sql<{owns: boolean}>`
			SELECT EXISTS (
				SELECT 1
				FROM timesheetdetails
				WHERE timesheetid = ${timesheetid} AND employeeid = ${employeeid}
			) AS owns;
		`;
		const resData = data.rows[0].owns;
		return Response.json(resData);
	} catch (error) {
		console.error('Database Error:', error);
		return Response.error();
	}
}

export async function fetchRevenue() {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();

  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchEmployees() {
	noStore();
	try {
	  const data = await sql<Employee>`
		SELECT
		  id, number, username,
		  password, firstName, lastName,
		  cellPhone, homePhone, email,
		  managerID, accessLevel, timeSheetRequired,
		  overtimeEligible, TABNavigateOT, emailExpenseCopy,
		  activeEmployee, iEnterTimeData, numTimeSheetSummaries,
		  numExpenseSummaries, numDefaultTimeRows, contractor
		FROM employees
	  `;
	  const dataRows = data.rows;
	  return Response.json(dataRows);
	} catch (error) {
	  console.error('Database Error:', error);
	  return Response.error();
	}
}

export async function fetchEmployeeByID(id: number) {
	noStore();
	try {
	  const data = await sql<Employee>`
		SELECT
			id, number, username,
			password, firstName, lastName,
			cellPhone, homePhone, email,
			managerID, accessLevel, timeSheetRequired,
			overtimeEligible, TABNavigateOT, emailExpenseCopy,
			activeEmployee, iEnterTimeData, numTimeSheetSummaries,
			numExpenseSummaries, numDefaultTimeRows, contractor
		FROM employees
		WHERE employees.id = ${id};
	  `;
  
	  const employee = data.rows;
  
	  console.log(employee);
	  return employee[0];
	} catch (error) {
	  console.error('Database Error:', error);
	  throw new Error('Failed to fetch invoice.');
	}
}

export async function fetchProjects() { // Make it not error when table doesnt exist
	noStore();
	try {
	  const data = await sql<Project>`
		SELECT
		id, number, description, startdate, enddate,
		shortname, customerpo, customercontact,
		comments, overtime, sgaflag
		FROM projects
	  `;
	  const dataRows = data.rows;
    console.log(dataRows)
	  return Response.json(dataRows);
	} catch (error) {
	  console.error('Database Error:', error);
	  return Response.error();
	}
}

export async function fetchProjectByID(id: number) {
	noStore();
	try {
	  const data = await sql<Project>`
		SELECT
		id, number, description, startdate, enddate,
		shortname, customerpo, customercontact,
		comments, overtime, sgaflag
		FROM projects
		WHERE projects.id = ${id};
	  `;
  
	  const project = data.rows;
  
	  console.log(project);
	  return project[0];
	} catch (error) {
	  console.error('Database Error:', error);
	  throw new Error('Failed to fetch invoice.');
	}
}

export async function fetchLatestInvoices() {
  noStore();
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  noStore();
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  noStore();
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    console.log(invoice);
    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  noStore(); // may not need?
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  noStore();
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function getUser(email: string) {
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
