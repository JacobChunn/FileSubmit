"use client"
import Link from 'next/link';
import Image from 'next/image';
import NavLinks from '@/app/ui/dashboard/nav-links';
import Logo from '@/app/EncoreLogo.jpg'
import { ChevronLeftIcon, ChevronRightIcon, PowerIcon } from '@heroicons/react/24/outline';
import { useContext, useEffect, useState } from 'react';
import { LayoutContext } from './layout-context-wrapper';

export default function SideNav() {
	const context = useContext(LayoutContext);

	if (context == null) {
		throw new Error(
			"context has to be used within <LayoutContext.Provider>"
		);
	}

    useEffect(() => {
        const handleTransitionEnd = () => {
			context.setIsTransitioning(false);
        };

        document.addEventListener('transitionend', handleTransitionEnd);

        return () => {
            document.removeEventListener('transitionend', handleTransitionEnd);
        };
    }, []);

	const toggleNav = () => {
		context.setIsNavMin(!context.isNavMin);
		context.setIsTransitioning(true);
	}

	const displayText = !context.isTransitioning && !context.isNavMin;
	// console.log("transition", isTransitioning)
	// console.log("isNavMin", isNavMin);
	// console.log("displayText", displayText)
	// console.log("-----------------------")

	return (
		<div className={`flex ${context.isNavMin ? "w-16" : "w-64"} transition-all duration-500`}>
			<div className={`relative flex h-full flex-col px-2 py-4`}>
				<Link
					className="mb-2 flex items-start justify-start rounded-md bg-blue-600"
					href="/"
				>
					<Image
						src={Logo}
						alt={'Encore Logo'}
						style={{ borderRadius: '10px' }}
						className=''
					/>
				</Link>
				{/* Minimize nav button */}
				{context.isMinNavButtonVisible &&
				<div
					className='absolute w-5 h-6 top-4 right-1 translate-x-full bg-gray-300 rounded-sm flex items-center justify-center hover:bg-gray-400 active:bg-gray-500 select-none'
					onClick={toggleNav}
				>
					{context.isNavMin ? <ChevronRightIcon className='w-5 h-5'/> : <ChevronLeftIcon className='w-5 h-5'/>}
				</div>
				}
				{/* Main body of nav */}
				<div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
					<NavLinks
						displayText={displayText}
					/>
					<div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
					<Link href="/api/auth/signout?callbackUrl=/">
						<button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
							<PowerIcon className="w-6" />
							{displayText ? <div className="transition-opacity duration-300">Sign Out</div> : null}
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
}
