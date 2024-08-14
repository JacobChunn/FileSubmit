"use client"
import React, { useContext, useEffect, useState } from 'react';
import { ApprovalContext } from './approval-context-wrapper';
import { Options, SavingState, TimesheetDetails, TimesheetDetailsExtended } from '@/app/lib/definitions';
import { fetchSubordinateTimesheetDetailsEditFormData, managerEditTimesheetDetails } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { notFound } from 'next/navigation';
import assert from 'assert';
import { compareTimesheetDetailsExtended } from '@/app/lib/utils';
import ControlledSelect from './timesheets/controlled-sel-w-desc';
import DoubleControlledSelect from './timesheets/double-controlled-sel-w-desc';
import InputDetailsDesc from './timesheets/input-details-desc';
import InputDetailsNumber from './timesheets/input-details-number';
import DeleteDetailButton from './timesheets/delete-detail-button';
import TimesheetDetailButtons from './timesheets/timesheet-detail-buttons';

export default function SubordinateTimesheetDetails({
    children,
}: {
    children?: React.ReactNode,
}) {
    const context = useContext(ApprovalContext);

	if (context == null) {
		throw new Error(
			"context has to be used within <ApprovalContext.Provider>"
		);
	}

    const subordinateID = context.selectedSubordinate ? context.selectedSubordinate[0] : null
    const localSelectedTimesheet = context.localSubordinateTimesheets?.find(timesheet => timesheet.subordinateid === subordinateID);
    const dBSelectedTimesheet = context.dBSubordinateTimesheets?.find(timesheet => timesheet.subordinateid === subordinateID);

	if (subordinateID == null) {
		throw new Error(
			"selectedSubordinate of ApprovalContext has not been set!"
		);
	}

    if (!localSelectedTimesheet || !dBSelectedTimesheet) {
		throw new Error(
			"employeeid does not exist in subordinate timesheets!"
		);
	}

    assert(localSelectedTimesheet.id == dBSelectedTimesheet.id);

    const timesheetID = dBSelectedTimesheet.id;

    const [TSDDataAndOptions, setTSDDataAndOptions] = useState<{options: Options, timesheetDetails: TimesheetDetails[]} | null>(null);
	const initialState = { message: null, errors: {} };
	const editTimesheetDetailsWithID = managerEditTimesheetDetails.bind(null, subordinateID, timesheetID);
    const [formState, dispatch] = useFormState(editTimesheetDetailsWithID, initialState);

    useEffect(() => {
		const fetchData = async () => {
			console.log('Approval TS-ID', timesheetID);
			try {
				context.setLocalSubordinateDetails(null);
				setTSDDataAndOptions(null);
				const TSDDataReturn = await fetchSubordinateTimesheetDetailsEditFormData(subordinateID, timesheetID);

				setTSDDataAndOptions(TSDDataReturn);

				context.setLocalSubordinateDetails(TSDDataReturn.timesheetDetails);
				context.setDbSubordinateDetails(TSDDataReturn.timesheetDetails);

				let initialTimesheetDetailsState: SavingState;
				if (context.localSubordinateTimesheets?.find(timesheet => timesheet.id == timesheetID)?.usercommitted) {
					initialTimesheetDetailsState = "signed";
				} else {
					initialTimesheetDetailsState = "saved";
				}
				context.setSubordinateDetailsState(initialTimesheetDetailsState);
			} catch (error) {
				console.error(error);
				notFound();
			}
		}

		fetchData();
	}, [context.selectedSubordinate]);

    // Change TSD state to saved upon successful save
	useEffect(() => {
		console.log("formState: " + JSON.stringify(formState));

		let timesheetDetailsState: SavingState;
		if (context.subordinateDetailsState === "signed") {
			timesheetDetailsState = "signed";
		} else if (context.subordinateDetailsState === null) {
			timesheetDetailsState = null;
		} else if (formState.success === true) {
			timesheetDetailsState = "saved";
		} else {
			timesheetDetailsState = "unsaved";
		}

		let newDbTimesheetDetails;
		if (formState.success == false) {
			newDbTimesheetDetails = context.dbSubordinateDetails;
		} else {
			newDbTimesheetDetails = context.localSubordinateDetails;
		}
		
		context.setDbSubordinateDetails(newDbTimesheetDetails);
		context.setSubordinateDetailsState(timesheetDetailsState);
	},[formState])

	useEffect(() => {
		const localTSDs = context.localSubordinateDetails as TimesheetDetailsExtended[];
		const dbTSDs = context.dbSubordinateDetails as TimesheetDetailsExtended[];

		let timesheetDetailsState: SavingState;
		if (context.subordinateDetailsState === "signed") {
			timesheetDetailsState = "signed";
		} else if (context.subordinateDetailsState === null) {
			timesheetDetailsState = null;
		} else if (
			compareTimesheetDetailsExtended(localTSDs, dbTSDs)
		) {
			timesheetDetailsState = "saved";
		} else {
			timesheetDetailsState = "unsaved";
		}
		context.setSubordinateDetailsState(timesheetDetailsState);
	}, [
		context.localSubordinateDetails,
		context.dbSubordinateDetails,
	]);

    if (!TSDDataAndOptions) {
		console.log("Loading...")
		return (<div>Loading...</div>)
	}

	const {options, timesheetDetails} = TSDDataAndOptions;
		
	if (timesheetDetails == null) {
		console.log("notfound2")
		notFound();
	}

    const topTableHeaders: [React.ReactNode, number][] = [
		["", 1], ["", 1], ["", 1],
		["", 1],
		["", 1],
		["", 1],
		["", 1],
        ["", 1],
		["", 1],
		["", 1],
		["", 1],
	];

	const tableSubheaders = [
		"Project", "Phase - Cost Code", "Description", 
		"Mo",
		"Tu",
		"We",
		"Th",
		"Fr",
		"Sa",
		"Su",
		"Tot",
	];

    const {projects, phaseCostCodes} = options;

    // Changes to focused version after focused
    const projectOptions = projects.map((val, index) => (
        <option
			value={val.id}
			className=' bg-white'
			key={"key-" + val.id + "-" + index}
			unfocused-label={val.number + ":" + val.shortname}
		>
			{val.number + ":" + val.description}
		</option>
    ));

	const phaseCostCodeOptions = phaseCostCodes.map((val, index) => (
        <option
			value={val.phase + "-" + val.costcode}
			className=' bg-white'
			key={"key-" + val.phase + val.costcode + "-" + index}
			unfocused-label={val.phase + "-" + val.costcode}
		>
			{val.phase + "-" + val.costcode + ": " + val.description}
		</option>
    ));

    type DayKey = 'mon' | 'tues' | 'wed' | 'thurs' | 'fri' | 'sat' | 'sun';
	type OvertimeKey = 'monot' | 'tuesot' | 'wedot' | 'thursot' | 'friot' | 'satot' | 'sunot';
	function calculateTotalHoursForDay(day: DayKey, overtime: OvertimeKey) {
		const details = context?.localSubordinateDetails as TimesheetDetailsExtended[];
		return details ? 
			details.reduce((accumulator, currentValue) => {
				return accumulator + Number(currentValue[day]) + Number(currentValue[overtime]);
			}, 0) :
			0;
	}

	const monTot = calculateTotalHoursForDay('mon', 'monot');
	const tuesTot = calculateTotalHoursForDay('tues', 'tuesot');
	const wedTot = calculateTotalHoursForDay('wed', 'wedot');
	const thursTot = calculateTotalHoursForDay('thurs', 'thursot');
	const friTot = calculateTotalHoursForDay('fri', 'friot');
	const satTot = calculateTotalHoursForDay('sat', 'satot');
	const sunTot = calculateTotalHoursForDay('sun', 'sunot');

	const totalTot = monTot + tuesTot + wedTot + thursTot + friTot + satTot + sunTot;

	const isNotEditable = !(
        context.subordinateDetailsState == "saved" || 
        context.subordinateDetailsState == "unsaved" ||
        context.subordinateDetailsState == "saving"
    );
	const isNotSubmitable =
		context.subordinateDetailsState == "saving" || 
		context.subordinateDetailsState == "saved" ||
		context.subordinateDetailsState == "signed" ||
        context.subordinateDetailsState == "approved";

	//const isNotEditable = false
	//const isNotSubmitable = false

	const dispatchWrapper = (payload: FormData) => {
		context.setSubordinateDetailsState("saving");
		dispatch(payload);
	}

    const projectRowStyle = 'w-48';
	const phaseCostCodeRowStyle = 'w-32';
	const descRowStyle = 'w-max h-10';
	const dayRowStyle = 'w-11';

    const dayStyle = 'h-1/2 w-full p-0';
	const selectStyle = 'h-full w-full';

    return (
        <form
            action={dispatchWrapper}
            className='w-full h-full'
            key={"form" + timesheetID}
            id={"form" + timesheetID}
        >
            <table className='w-full'>
                <thead className='w-full'>
                    <tr className='w-full'>
                        {topTableHeaders.map((val, index) => (
                            <th
                                key={"header"+index}
                                colSpan={val[1]}
                                className={`w-min h-min border-t ${index != 0 ? "border-l" : ""} border-blue-gray-100 bg-blue-gray-50/50 pt-4 px-2`}
                            >
                                <div
                                    className="flex items-center justify-center w-full h-full font-normal leading-none text-blue-gray-900 opacity-80 text-xs"
                                >
                                    {val[0]}
                                </div>
                            </th>
                        ))}
                    </tr>
                    <tr className='w-full'>
                        {tableSubheaders.map((val, index) => (
                            <th
                                key={"subheader"+index}
                                className={`w-min h-min border-b border-blue-gray-100 bg-blue-gray-50/50 pt-2 pb-4 px-2`}
                            >
                                <div
                                    className="w-min h-min font-normal leading-none text-blue-gray-900 opacity-80 text-xs"
                                >
                                    {val}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className='w-full'>
                {context.localSubordinateDetails && context.dbSubordinateDetails ? (context.localSubordinateDetails as TimesheetDetailsExtended[]).map((val, index) => {
                    const dbTSDs = context.dbSubordinateDetails;
                    const dbTSDsLen = dbTSDs ? dbTSDs.length : 0;

                    const dbVal = dbTSDsLen > index && dbTSDs ? 
                        dbTSDs[index] as TimesheetDetailsExtended : null;

                    return (
                        <tr
                            key={"k-" + index + timesheetID}
                            className='w-full h-full'
                        >
                            <td className={projectRowStyle}>
                                {/* Hidden TSD id */}
                                <input
                                    id={"TSD" + index + "[" + "id" + "]"}
                                    key={"TSD" + index + "[" + "id" + "]"}
                                    name={"TSD" + index + "[" + "id" + "]"}
                                    value={val.id}
                                    className='w-0'
                                    readOnly
                                    hidden
                                />

                                {/* Project */}
                                <ControlledSelect
                                    index={index}
                                    attr='projectid'
                                    info={"TSD" + index + "[" + "project" + "]"}
                                    value={val.projectid}
                                    dbValue={dbVal?.projectid}
                                    className = {selectStyle}
                                    disabled={isNotEditable}
                                >
                                    {projectOptions}
                                </ControlledSelect>
                            </td>

                            {/* PhaseCostCode*/}
                            <td className={phaseCostCodeRowStyle}>
                                <DoubleControlledSelect
                                    index={index}
                                    phaseAttr='phase'
                                    costcodeAttr='costcode'
                                    info={"TSD" + index + "[" + "phase_costcode" + "]"}
                                    phaseValue={val.phase}
                                    costcodeValue={val.costcode}
                                    phaseDbValue={dbVal?.phase}
                                    costcodeDbValue={dbVal?.costcode}
                                    className = {selectStyle}
                                    disabled={isNotEditable}
                                >
                                    {phaseCostCodeOptions}
                                </DoubleControlledSelect>
                            </td>

                            {/* Description */}
                            <td className={descRowStyle}>
                                <InputDetailsDesc
                                    index={index}
                                    attr='description'
                                    info={"TSD" + index + "[" + "description" + "]"}
                                    value={val.description}
                                    dbValue={dbVal?.description}
                                    readOnly={isNotEditable}
                                />
                            </td>
                            
                            {/* Monday */}
                            <td className={dayRowStyle}>
                                <InputDetailsNumber
                                    index={index}
                                    attr='mon'
                                    info={"TSD" + index + "[" + "mon" + "]"}
                                    className={dayStyle}
                                    value={val.mon}
                                    dbValue={dbVal?.mon}
                                    disabled={isNotEditable}
                                />
                                <InputDetailsNumber
                                    index={index}
                                    attr='monot'
                                    info={"TSD" + index + "[" + "monOT" + "]"}
                                    className={dayStyle}
                                    isOT={true}
                                    value={val.monot}
                                    dbValue={dbVal?.monot}
                                    disabled={isNotEditable}
                                />
                            </td>

                            {/* Tuesday */}
                            <td className={dayRowStyle}>
                                <InputDetailsNumber
                                    index={index}
                                    attr='tues'
                                    info={"TSD" + index + "[" + "tues" + "]"}
                                    className={dayStyle}
                                    value={val.tues}
                                    dbValue={dbVal?.tues}
                                    disabled={isNotEditable}
                                />
                                <InputDetailsNumber
                                    index={index}
                                    attr='tuesot'
                                    info={"TSD" + index + "[" + "tuesOT" + "]"}
                                    className={dayStyle}
                                    isOT={true}
                                    value={val.tuesot}
                                    dbValue={dbVal?.tuesot}
                                    disabled={isNotEditable}
                                />
                            </td>

                            {/* Wednesday */}
                            <td className={dayRowStyle}>
                                <InputDetailsNumber
                                    index={index}
                                    attr='wed'
                                    info={"TSD" + index + "[" + "wed" + "]"}
                                    className={dayStyle}
                                    value={val.wed}
                                    dbValue={dbVal?.wed}
                                    disabled={isNotEditable}
                                />
                                <InputDetailsNumber
                                    index={index}
                                    attr='wedot'
                                    info={"TSD" + index + "[" + "wedOT" + "]"}
                                    className={dayStyle}
                                    isOT={true}
                                    value={val.wedot}
                                    dbValue={dbVal?.wedot}
                                    disabled={isNotEditable}
                                />
                            </td>

                            {/* Thursday */}
                            <td className={dayRowStyle}>
                                <InputDetailsNumber
                                    index={index}
                                    attr='thurs'
                                    info={"TSD" + index + "[" + "thurs" + "]"}
                                    className={dayStyle}
                                    value={val.thurs}
                                    dbValue={dbVal?.thurs}
                                    disabled={isNotEditable}
                                />
                                <InputDetailsNumber
                                    index={index}
                                    attr='thursot'
                                    info={"TSD" + index + "[" + "thursOT" + "]"}
                                    className={dayStyle}
                                    isOT={true}
                                    value={val.thursot}
                                    dbValue={dbVal?.thursot}
                                    disabled={isNotEditable}
                                />
                            </td>

                            {/* Friday */}
                            <td className={dayRowStyle}>
                                <InputDetailsNumber
                                    index={index}
                                    attr='fri'
                                    info={"TSD" + index + "[" + "fri" + "]"}
                                    className={dayStyle}
                                    value={val.fri}
                                    dbValue={dbVal?.fri}
                                    disabled={isNotEditable}
                                />
                                <InputDetailsNumber
                                    index={index}
                                    attr='friot'
                                    info={"TSD" + index + "[" + "friOT" + "]"}
                                    className={dayStyle}
                                    isOT={true}
                                    value={val.friot}
                                    dbValue={dbVal?.friot}
                                    disabled={isNotEditable}
                                />
                            </td>

                            {/* Saturday */}
                            <td className={dayRowStyle}>
                                <InputDetailsNumber
                                    index={index}
                                    attr='sat'
                                    info={"TSD" + index + "[" + "sat" + "]"}
                                    className={dayStyle}
                                    value={val.sat}
                                    dbValue={dbVal?.sat}
                                    disabled={isNotEditable}
                                />
                                <InputDetailsNumber
                                    index={index}
                                    attr='satot'
                                    info={"TSD" + index + "[" + "satOT" + "]"}
                                    className={dayStyle}
                                    isOT={true}
                                    value={val.satot}
                                    dbValue={dbVal?.satot}
                                    disabled={isNotEditable}
                                />
                            </td>

                            {/* Sunday */}
                            <td className={dayRowStyle}>
                                <InputDetailsNumber
                                    index={index}
                                    attr='sun'
                                    info={"TSD" + index + "[" + "sun" + "]"}
                                    className={dayStyle}
                                    value={val.sun}
                                    dbValue={dbVal?.sun}
                                    disabled={isNotEditable}
                                />
                                <InputDetailsNumber
                                    index={index}
                                    attr='sunot'
                                    info={"TSD" + index + "[" + "sunOT" + "]"}
                                    className={dayStyle}
                                    isOT={true}
                                    value={val.sunot}
                                    dbValue={dbVal?.sunot}
                                    disabled={isNotEditable}
                                />
                            </td>

                            {/* Total */}
                            <td className={dayRowStyle}>
                                <div className="max-w-sm mx-auto m-0.5 bg-white border border-black">
                                    <p className='text-sm'>
                                        {Number(val.mon) + Number(val.tues) + Number(val.wed) + Number(val.thurs) + Number(val.fri) + Number(val.sat) + Number(val.sun)}
                                    </p>
                                </div>
                                <div className="max-w-sm mx-auto m-0.5 bg-zinc-200 border border-black">
                                    <p className='text-sm'>
                                        {Number(val.monot) + Number(val.tuesot) + Number(val.wedot) + Number(val.thursot) + Number(val.friot) + Number(val.satot) + Number(val.sunot)}

                                    </p>
                                </div>
                            </td>

                            {/* Delete TSD */}
                            <td className='h-10 w-11'>
                                <DeleteDetailButton
                                    index={index}
                                    hidden={isNotEditable}
                                />
                            </td>
                        </tr>
                    )
                }) : null}
                    <tr>
                        <td colSpan={3}>
                            <p className='text-right'>
                                Total: 
                            </p>
                        </td>
                        <td>
                            {monTot}
                        </td>
                        <td>
                            {tuesTot}
                        </td>
                        <td>
                            {wedTot}
                        </td>
                        <td>
                            {thursTot}
                        </td>
                        <td>
                            {friTot}
                        </td>
                        <td>
                            {satTot}
                        </td>
                        <td>
                            {sunTot}
                        </td>
                        <td>
                            {totalTot}
                        </td>
                    </tr>
                </tbody>
            </table>
            <TimesheetDetailButtons
                submitDisabled={isNotSubmitable}
            />
        </form>
    );
}