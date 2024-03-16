'use client'

import { useEffect, useState } from "react";

interface SelectWithDescriptionProps {
	info: string;
	children: React.ReactNode;
}

type oldDescType = {
	index: number;
	desc: string;
}

export default function SelectWithDescription({
	info,
	children
}: SelectWithDescriptionProps) {
	const [oldDesc, setOldDesc] = useState<oldDescType | null>(null);

	useEffect(() => {
		const element = document.getElementById(info) as HTMLSelectElement;
		if (!element) return;

		element.addEventListener('change', function(event) {
			if(oldDesc) {
				console.log("here")
				element.options[oldDesc.index].textContent = oldDesc.desc;
			}

			const selectedOption = element.options[element.selectedIndex];
			const shortenedLabel = selectedOption.getAttribute('data-shortened');

			if(!selectedOption.textContent) return;

			const currentDesc = {
				index: element.selectedIndex,
				desc: selectedOption.textContent,
			}
			setOldDesc(currentDesc);

			selectedOption.textContent = shortenedLabel;
		});
	})

	return (
		<select
			id={info}
			key={info}
			name={info}
		>
			{children}
		</select>
	)
}