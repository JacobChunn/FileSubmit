export default function TimesheetWrapper({
	children,
}: {
	children: React.ReactNode,
}) {

	return (
		<div className="w-min h-full">
			{children}
		</div>
	)
}