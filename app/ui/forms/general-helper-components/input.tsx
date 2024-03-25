"use client"

interface InputProps {
	info: string;
	className?: string;
	value: string | number | null | undefined,
	type?: string,
}

export default function Input({
	info,
	className='',
	value,
	type='number'
}: InputProps) {
	let defaultValue;

	if (type == 'number') {
		defaultValue = value !== null && value !== undefined ? value : 0;
	}

	if (type == 'text') {
		defaultValue = value !== null && value !== undefined ? value : '';
	}
	

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