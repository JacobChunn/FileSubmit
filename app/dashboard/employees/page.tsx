import { Employee } from '@/app/lib/definitions';
import SortableTable from '@/app/ui/sortable-table';
import { LatestInvoicesSkeleton } from '@/app/ui/skeletons';
import { sql } from '@vercel/postgres';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { unstable_noStore as noStore } from 'next/cache';
import EmployeeSortableTable from '../../ui/employees/main/employee-sortable-table';

export const metadata: Metadata = {
  title: 'Employees',
};

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
          <EmployeeSortableTable employeePromise={employeePromise}/>
      </Suspense>
    </main>
  )
}