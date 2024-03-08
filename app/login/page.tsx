import AcmeLogo from '@/app/ui/acme-logo';
import Logo from '@/app/EncoreLogo.jpg'
import Image from 'next/image';

export default function LoginPage() {
	return (
		<main className="flex items-center justify-center md:h-screen">
			<div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
				<div className="flex h-full w-auto justify-center items-center rounded-lg bg-blue-500 p-7">
					<Image
						src={Logo}
						alt={'Encore Logo'}
						style={{ borderRadius: '10px' }}
						className='h-full w-auto '
					/>
				</div>
				{/* <LoginForm /> */}
			</div>
		</main>
	);
}