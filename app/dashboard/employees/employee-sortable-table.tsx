import { Employee } from "@/app/lib/definitions";
import SortableTable from "@/app/ui/sortable-table";

export default function EmployeeSortableTable({
	employeePromise,
}: {
	employeePromise: Promise<Employee[]>;
}) {
    // Define tabs + logic
    const TABS = [
        {
            label: "Active",
            value: "active",
        },
        {
            label: "Inactive",
            value: "inactive",
        },
        {
            label: "All",
            value: "all",
        },
    ] as const;

    function tabFilter(employee: Employee, tabValue: typeof TABS[number]['value']) {
		switch (tabValue){
			case "active":
				return employee.activeemployee == true;
			case "inactive":
				return employee.activeemployee == false;
			case "all":
				return true;
		}
	}


    return (
        <SortableTable<Employee>
            employeePromise={employeePromise}
            TABS={TABS}
            tabFilter={tabFilter}
        />
    )

}