'use client'

import { useEffect, useRef, useState } from "react";

interface SelectWithFocusControl {
	info: string;
	children: React.ReactElement<HTMLOptionElement & {"focused-label": string, "unfocused-label": string}>[];
}

export default function SelectWithFocusControl({
	info,
	children
}: SelectWithFocusControl) {
	const focusedInfoRef = useRef<string | null>(null);

	const saveFocusedContent = (data: string) => {
		focusedInfoRef.current = data;
	}

	const getFocusedContent = () => {
		return focusedInfoRef.current;
	}

	const changeToFocusedLabel = (element: HTMLSelectElement) => {
		// Restore the focused label info
		const focusedContent = getFocusedContent();
		if (!focusedContent) return;

		// Set the text content to the focused version
		const selectedOption = element.options[element.selectedIndex];
		if(!selectedOption.textContent) return;
		selectedOption.textContent = focusedContent;

	}

	const changeToUnfocusedLabel = (element: HTMLSelectElement) => {
		// Save the current focused label info
		const selectedOption = element.options[element.selectedIndex];
		if(!selectedOption.textContent) return;
		const currentFocusedContent = selectedOption.textContent;
		saveFocusedContent(currentFocusedContent);

		// Set the text content to the unfocused version
		const unfocusedLabel = selectedOption.getAttribute('unfocused-label');
		if (!unfocusedLabel) return;
		selectedOption.textContent = unfocusedLabel;
	}

	useEffect(() => {
		const element = document.getElementById(info) as HTMLSelectElement;
		if (!element) return;

		// Initialize drop downs to unfocused
		changeToUnfocusedLabel(element);

		// Add focus event listener to change label to focused label
		element.addEventListener('focus', (event) => {
			changeToFocusedLabel(element);
		});

		// Add blur event listener to change label to unfocused label
		element.addEventListener('blur', (event) => {
			changeToUnfocusedLabel(element);
		});

	}, []);

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