"use client"
import { useContext, useEffect } from "react";
import { fetchSubordinatesWithAuth } from "@/app/lib/actions";
import { ApprovalContext } from "./approval-context-wrapper";

export default function ApprovalDataFetcher({
	children,
}: {
	children?: React.ReactNode;
}) {
	const context = useContext(ApprovalContext);

	if (context == null) {
		throw new Error(
			"context has to be used within <ApprovalContext.Provider>"
		);
	}

    useEffect(() => {
		const handleDataPromise = async() => {
			const data = await fetchSubordinatesWithAuth();
			context.setSubordinates(data);
		}
		
		handleDataPromise();
	
	}, []);

	return (
		<>
			{context == undefined || context.subordinates == null ?
				null
				:
				<div className="w-full h-full shadow-md rounded-lg pt-4 pb-6 px-4">
					{children}
				</div>
			}
		</>
	)

}