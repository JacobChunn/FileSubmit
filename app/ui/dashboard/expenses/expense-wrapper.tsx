export default function ExpenseWrapper({
	children,
}: {
	children: React.ReactNode,
}) {

	return (
		<div className="w-min h-full shadow-md rounded-lg pt-4 pb-6 px-4 transition-width duration-500 ease-in-out">
			{children}
		</div>
	)
}