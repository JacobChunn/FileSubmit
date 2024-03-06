import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import styles from '@/app/ui/home.module.css';
import { lusitana } from './ui/fonts';
import Image from 'next/image';
import Logo from '@/app/EncoreLogo.jpg'
import { signIn } from 'next-auth/react';
import LoginButton from './ui/login/login-button';

export default function Page() {
	return (
		<main className="flex min-h-screen flex-col p-6">
			<div className="flex h-24 items-start rounded-lg bg-blue-500"/>
			<div className="mt-4 flex grow flex-col gap-4 md:flex-row">
				<div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
					<p className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}>
						<strong>Welcome to Encore.</strong>
					</p>
					<LoginButton callback={'/dashboard'}/>
				</div>
				<div className="flex items-center justify-center p-6 bg-gray-50">
					{/* Add Hero Images Here */}
					<div className='h-full relative p-12'>
						<Image
							src={Logo}
							alt={'Encore Logo'}
							width={0}
							height={0}
							sizes="100vw"
							className='object-cover'
							style={{
								borderRadius: '10px',
								width: 'auto',
								height: '100%'
							}}
						/>
					</div>
				</div>
			</div>
		</main>
	);
}
