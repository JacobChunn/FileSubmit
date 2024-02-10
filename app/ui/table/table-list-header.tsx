import Link from "next/link";
import { Button, Tab, Tabs, TabsHeader, Typography } from "../material-tailwind-wrapper";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import { TabType } from "@/app/lib/definitions";
import { Dispatch, SetStateAction } from "react";

export default function TableListHeader({
    title,
    description,
    addHref,
    addText,
    TABS,
    defaultTabValue,
    setTabValue,

}: {
    title: string,
    description: string,
    addHref: string,
    addText: string,
    TABS: readonly TabType[];
    defaultTabValue: typeof TABS[number]['value'],
    setTabValue: Dispatch<SetStateAction<string>>,
}) {

    return (
        <div  className="sticky top-0 h-fit rounded-lg w-full bg-white z-50">
            <div className="mb-8 flex items-center justify-between gap-8">
                <div>
                    <Typography variant="h5" color="blue-gray">
                        {title}
                    </Typography>
                    <Typography color="gray" className="mt-1 font-normal">
                        {description}
                    </Typography>
                </div>
                <div className="sticky right-5">
                    <Link href={addHref}> 
                        <Button className="flex items-center gap-3" size="sm">
                            <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> {addText}
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <Tabs value={defaultTabValue} className="w-full md:w-max">
                    <TabsHeader>
                        {TABS.map(({ label, value }) => (
                            <Tab key={value} value={value} onClick={() => {setTabValue(value); console.log(value)}}>
                                &nbsp;&nbsp;{label}&nbsp;&nbsp;
                            </Tab>
                        ))}
                    </TabsHeader>
                </Tabs>
                {/* <div className="sticky right-5 w-full md:w-72">
                    <Input
                        label="Search"
                        icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                        crossOrigin="anonymous"
                    />
                </div> */}
            </div>
        </div>
    )
}