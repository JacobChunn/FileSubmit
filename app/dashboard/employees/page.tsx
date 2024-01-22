
import { Employees } from '@/app/lib/definitions';
import SortableTable from '@/app/ui/employees/employee-sortable-table';
import { LatestInvoicesSkeleton } from '@/app/ui/skeletons';
import { sql } from '@vercel/postgres';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Employees',
};

export async function fetchEmployees() {
  try {
    const data = await sql<Employees>`
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
    console.log("Employee Fetch from route!")
    const dataRows = data.rows;
    return Response.json(dataRows);
  } catch (error) {
    console.error('Database Error:', error);
    return Response.error();
  }
}

export default async function Page() {
  console.log("Hello from employee page");
  const employeePromise = (await fetchEmployees()).json();
  return (
    <main>
      <Suspense >
          <SortableTable employeePromise={employeePromise}/>
      </Suspense>
    </main>
  )
}