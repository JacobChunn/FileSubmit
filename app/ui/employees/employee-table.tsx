import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import { fetchEmployees } from '@/app/lib/data';
import { join } from 'path';

export default async function EmployeeTable() {
  const employees = await fetchEmployees();
  const employeesProperties = Object.entries(employees);
  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Employees
      </h2>

      <div className="bg-white px-6">
        <div
          className='flex flex-row items-center py-4'
        >
          <table className={`grid gap-4 justify-around`}>
            <thead>
              <tr className='justify-around'>
                <th>#</th>
                <th>Number</th>
                <th>Name</th>
                <th>Email</th>
                <th>Cell Phone</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {employees.map((employee, i) => {
                  return (
                    <div key={employee.id}>
                      {employee.firstname}
                    </div>
                  );
                })}
              </tr>
            </tbody>
          </table>
         </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
      </div>
    </div>
    
  );
}