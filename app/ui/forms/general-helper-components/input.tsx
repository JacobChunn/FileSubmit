"use client"

interface InputProps {
	info: string;
	className?: string;
}

export default function Input({
	info,
	className='',
}: InputProps) {
	return (
		<input
			id={info}
			key={info}
			name={info}
			className={className}
		/>
	)
}