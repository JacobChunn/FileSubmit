import { StateType } from "@/app/lib/definitions";

export type Props = {
	state: StateType,
}

export default function FormErrorHandling({
	state
}: Props
) {

	return (
		<div id="status-error" aria-live="polite" aria-atomic="true">
			{state.message &&
				<p className="mt-2 text-sm text-red-500" key={state.message}>
					{state.message}
				</p>
			}
		</div>
	)
}