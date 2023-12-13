import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import { fetchEmployees } from '@/app/lib/data';
import { join } from 'path';
export default async function EmployeeTable() {
  const employees = await fetchEmployees();
  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Employees
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">

        <div className="bg-white px-6">
          {employees.map((employee, i) => {
            const empPropsKeys = Object.keys(employee);
            const lastIndex = empPropsKeys.length - 1;
            console.log(lastIndex);
            for (let j in employee) {
              console.log(JSON.stringify(j) + " " + i);
              if (empPropsKeys.indexOf(j) == lastIndex) {console.log("LAST!!!!!!!!!!!!!!")};
            

              return (
                <div
                  key={employee.id}
                  className={clsx(
                    'flex flex-row items-center justify-between py-4',
                    {
                      'border-t': i !== 0,
                    },
                  )}
                >
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Number</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Cell Phone</th>
                      </tr>
                    </thead>
                  </table>
                  <div className="flex items-center">
                    <Image
                      src={'/customers/hector-simpson.png'}
                      alt={`${employee.firstname}'s profile picture`}
                      className="mr-4 rounded-full"
                      width={32}
                      height={32}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold md:text-base">
                        {employee.firstname} {employee.lastname}
                      </p>
                      <p className="hidden text-sm text-gray-500 sm:block">
                        {employee.email}
                      </p>
                    </div>
                    <div className=''>
                      <p
                      className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                      >
                      {employee.number}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}