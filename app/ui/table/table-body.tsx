import { Children, cloneElement, useEffect, useState } from "react";

export default function TableBody<T>({
    children,
    dataPromise,
    TABLE_HEAD,
    tabFilter,
}: {
    children: React.ReactNode,
    dataPromise: Promise<T[]>,
    TABLE_HEAD: readonly string[],
    tabFilter: (data: T)=> boolean,
}) {

    const [data, setData] = useState<T[] | undefined>(undefined);

    useEffect(() => {
		const handleDataPromise = async() => {
			const returnedData = await dataPromise;
			setData(returnedData);
		}
		
		handleDataPromise();
	
	}, []);

    return (
        <div className="px-0 max-w-full">
            <div className="overflow-x-auto">
                <table id="employees-table" className="w-full mt-4 table-auto text-left">
                    <thead>
                        <tr>
                            {TABLE_HEAD.map((head, index) => (
                                <th
                                    key={head + index}
                                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 py-4 px-2 transition-colors hover:bg-blue-gray-50 text-left"
                                >
                                    <div
                                        className="font-normal leading-none text-blue-gray-900 opacity-80 text-xs"
                                    >
                                        {head}
                                    </div>
                                    {/*" "*/}{/*index !== TABLE_HEAD.length - 1 && (
                                            <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                                    )*/}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="min-w-full">
                        {data !== undefined ? (
                            Array.isArray(data) && 
                            data
                                .filter(tabFilter)
                                //.filter(searchFilter)
                                .map(
                                // Skip password
                                (rowData, index) => {
                                    const isLast = index === data.length - 1;
                                    const inAllClasses = "p-2 align-middle "
                                    const classes = isLast
                                        ? inAllClasses
                                        : inAllClasses + "border-b border-blue-gray-50";

                                    return (
                                        <tr key={index}>
                                            {Children.map(
                                                children,
                                                (child) => 
                                                    cloneElement(child as React.ReactElement<any>, {
                                                        data: rowData,
                                                        rowStyles: classes
                                                    })
                                                                
                                            )}
                                        </tr>
                                    );
                                },
                            )
                        ) : (
                            <tr>
                                <td>
                                    ...Loading
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}