"use client"

import { Project } from "@/app/lib/definitions";
import ListTable from "../../table/list-table";
import TableTextEntry from "../../table/entries/table-text-entry";
import TableCheckEntry from "../../table/entries/table-check-entry";
import TableEditEntry from "../../table/entries/table-edit-entry";
import TableDateEntry from "../../table/entries/table-date-entry";


export default function ProjectTable({
	projectPromise,
}: {
	projectPromise: Promise<Project[]>;
}) {
    // Define table headers + tabs + logic
	const TABLE_HEAD = [
		"Number", "Description", "Start Date", "End Date", "Short Name",
		"CustomerPO", "Customer Contact", "Comments", "Overtime", "SGAFlag",
		"ID", "Edit",
	] as const;

    const TABS = [
        {
            label: "Open",
            value: "open",
        },
        {
            label: "Closed",
            value: "closed",
        },
        {
            label: "All",
            value: "all",
        },
    ] as const;

    function tabFilter(project: Project, tabValue: string) { // Implement once I know actual date format

		// Get current date
		switch (tabValue){
			default: return true;
		}
	}


    return (
        <ListTable<Project>
			title="Project list"
			description="See information about all projects"
			addText="Add Project"
			addHref="/dashboard/projects/add"
            dataPromise={projectPromise}
			TABLE_HEAD={TABLE_HEAD}
            TABS={TABS}
			defaultTabValue="open"
            tabFilterUnbound={tabFilter}
        >
            {/* Number */}
			<TableTextEntry<Project, keyof Project>
				dataProperty={'number'}
			/>

			{/* Description */}
			<TableTextEntry<Project, keyof Project>
				dataProperty={'description'}
			/>

			{/* StartDate */}
			<TableDateEntry<Project, keyof Project>
				dataProperty={'startdate'}
			/>

			{/* EndDate */}
			<TableDateEntry<Project, keyof Project>
				dataProperty={'enddate'}
			/>

			{/* ShortName */}
			<TableTextEntry<Project, keyof Project>
				dataProperty={'shortname'}
			/>

			{/* CustomerPO */}
			<TableTextEntry<Project, keyof Project>
				dataProperty={'customerpo'}
			/>

			{/* CustomerContact */}
			<TableTextEntry<Project, keyof Project>
				dataProperty={'customercontact'}
			/>

			{/* Comments */}
			<TableTextEntry<Project, keyof Project>
				dataProperty={'comments'}
			/>

			{/* Overtime */}
			<TableCheckEntry<Project, keyof Project>
				dataProperty={'overtime'}
			/>

			{/* SGAFlag */}
			<TableCheckEntry<Project, keyof Project>
				dataProperty={"sgaflag"}
			/>

			{/* id */}
			<TableTextEntry<Project, keyof Project>
				dataProperty={'id'}
			/>

			{/* Edit */}
			<TableEditEntry<Project, keyof Project>
				dataProperty={"id"}
				hrefBeforeID="/dashboard/projects/"
				hrefAfterID="/edit"
			/>
        </ListTable>
    )

}