"use client"

interface InputProps {
	info: string;
	className?: string;
	value: string | number | null,
}

export default function Input({
	info,
	className='',
	value,
}: InputProps) {
	const defaultValue = value !== null ? value : '';

	return (
		<input
			id={info}
			key={info}
			name={info}
			className={className}
			defaultValue={defaultValue}
		/>
	)
}