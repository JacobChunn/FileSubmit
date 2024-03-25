export default function TimesheetDetailsWrapper({
	children
}: {
	children: React.ReactNode
}) {

	return (
		<div className="rounded-xl shadow-md p-6 w-full h-full">
			{children}
		</div>
	)

}