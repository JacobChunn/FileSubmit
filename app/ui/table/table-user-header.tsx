import Link from "next/link";
import { Button, Typography } from "../material-tailwind-wrapper";
import { UserPlusIcon } from "@heroicons/react/24/solid";

export default function TableUserHeader({
    title,
    addHref,
    addText,
}: {
    title: string,
    addHref: string,
    addText: string,
}) {

    return (
        <div  className="sticky top-0 h-fit rounded-lg w-full bg-white z-50">
            <div className="mb-8 flex items-center justify-between gap-8">
                <div>
                    <Typography variant="h5" color="blue-gray">
                        {title}
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
        </div>
    )
}