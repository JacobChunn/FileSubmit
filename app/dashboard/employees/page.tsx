import { Metadata } from 'next';
import EmployeeSortableTable from '../../ui/employees/main/employee-sortable-table';
import { fetchEmployees } from '@/app/lib/data';

export const metadata: Metadata = {
  title: 'Employees',
};


export default async function Page() {
  console.log("Hello from employee page");
  const employeePromise = (await fetchEmployees()).json();
  return (
    <main>
		<EmployeeSortableTable employeePromise={employeePromise}/>
    </main>
  )
}