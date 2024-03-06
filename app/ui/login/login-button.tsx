'use client'
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { signIn } from "next-auth/react";

export default function LoginButton({callback}: {callback: string}) {
    return (
        <div
            onClick={() => signIn(undefined, { callbackUrl: callback })}
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
        >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
        </div>
    );
}