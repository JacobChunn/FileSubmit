const { db } = require('@vercel/postgres');
const {
  invoices,
  customers,
  revenue,
  employees,
  users,
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedInvoices(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "invoices" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID NOT NULL,
    amount INT NOT NULL,
    status VARCHAR(255) NOT NULL,
    date DATE NOT NULL
  );
`;

    console.log(`Created "invoices" table`);

    // Insert data into the "invoices" table
    const insertedInvoices = await Promise.all(
      invoices.map(
        (invoice) => client.sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedInvoices.length} invoices`);

    return {
      createTable,
      invoices: insertedInvoices,
    };
  } catch (error) {
    console.error('Error seeding invoices:', error);
    throw error;
  }
}

async function seedCustomers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "customers" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) NOT NULL
      );
    `;

    console.log(`Created "customers" table`);

    // Insert data into the "customers" table
    const insertedCustomers = await Promise.all(
      customers.map(
        (customer) => client.sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedCustomers.length} customers`);

    return {
      createTable,
      customers: insertedCustomers,
    };
  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  }
}

async function seedRevenue(client) {
  try {
    // Create the "revenue" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS revenue (
        month VARCHAR(4) NOT NULL UNIQUE,
        revenue INT NOT NULL
      );
    `;

    console.log(`Created "revenue" table`);

    // Insert data into the "revenue" table
    const insertedRevenue = await Promise.all(
      revenue.map(
        (rev) => client.sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedRevenue.length} revenue`);

    return {
      createTable,
      revenue: insertedRevenue,
    };
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  }
}

async function seedEmployees(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "employees" table if it doesn't exist
    // const createTable = await client.sql` <- This employees definition is outdated
    //   CREATE TABLE IF NOT EXISTS employees (
    //     ID UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    //     Number INTEGER NOT NULL,
    //     UserName VARCHAR(50) NOT NULL,
    //     Password VARCHAR(24) NOT NULL,
    //     FirstName VARCHAR(50) NOT NULL,
    //     LastName VARCHAR(50) NOT NULL,
    //     CellPhone VARCHAR(32) NOT NULL,
    //     HomePhone VARCHAR(32) NOT NULL,
    //     EMail VARCHAR(50) NOT NULL,
    //     ManagerID INTEGER NOT NULL,
    //     AccessLevel INTEGER NOT NULL,
    //     TimeSheetRequired BIT NOT NULL,
    //     OverTimeEligible BIT NOT NULL,
    //     TABNavigateOT BIT NOT NULL,
    //     EMailExpenseCopy BIT NOT NULL,
    //     ActiveEmployee BIT NOT NULL,
    //     IEnterTimedata BIT NOT NULL,
    //     NumTimeSheetSummaries INTEGER NOT NULL,
    //     NumExpenseSummaries INTEGER NOT NULL,
    //     NumDefaultTimeRows INTEGER NOT NULL,
    //     Contractor BIT NOT NULL
    //   );
    // `;

    // console.log(`Created "employee" table`);

    // Insert data into the "employee" table
    const insertedEmployees = await Promise.all(
      employees.map(
        async (employee) => {
			const hashedPassword = await bcrypt.hash(employee.password, 10);

			client.sql`
				INSERT INTO employees (
					ID, Number, UserName, Password,
					FirstName, LastName, CellPhone, HomePhone, EMail,
					ManagerID, AccessLevel,
					TimeSheetRequired, OverTimeEligible, TABNavigateOT, EMailExpenseCopy, ActiveEmployee, IEnterTimedata,
					NumTimeSheetSummaries, NumExpenseSummaries, NumDefaultTimeRows,
					Contractor
				)
				VALUES (
					${employee.id},${employee.number}, ${employee.username}, ${hashedPassword},
					${employee.firstName}, ${employee.lastName}, ${employee.cellPhone}, ${employee.homePhone}, ${employee.email},
					${employee.managerID}, ${employee.accessLevel},
					${employee.timeSheetRequired}, ${employee.overtimeEligible}, ${employee.TABNavigateOT}, ${employee.emailExpenseCopy}, ${employee.activeEmployee}, ${employee.iEnterTimeData},
					${employee.numTimeSheetSummaries}, ${employee.numExpenseSummaries}, ${employee.numDefaultTimeRows},
					${employee.contractor})
				ON CONFLICT (id) DO NOTHING;
      `}
      ),
    );

    console.log(`Seeded ${insertedEmployees.length} employees`);

    return {
      employees: insertedEmployees,
    };
  } catch (error) {
    console.error('Error seeding employees:', error);
    throw error;
  }
}

async function main() {
	console.log("Connecting to database...");
  	const client = await db.connect();
	console.log("Connected to database!");

//   await seedUsers(client);
//   await seedCustomers(client);
//   await seedInvoices(client);
//   await seedRevenue(client);
  await seedEmployees(client);


  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
