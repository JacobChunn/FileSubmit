import { Metadata } from 'next';
import { fetchEmployees } from '@/app/lib/data';
import EmployeeTable from '@/app/ui/employees/main/employee-table';

export const metadata: Metadata = {
  title: 'Employees',
};


export default async function Page() {
  console.log("Hello from employee page");
  const employeePromise = (await fetchEmployees()).json();
  return (
    <main>
		  <EmployeeTable employeePromise={employeePromise}/>
    </main>
  )
}