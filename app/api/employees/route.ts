// pages/api/employees.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { Employees } from '../../lib/definitions';
import { sql } from '@vercel/postgres';


// TODO: ADD AUTHORIZATION

export async function GET(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = await sql<Employees>`
      SELECT
        id, number, username,
        password, firstName, lastName,
        cellPhone, homePhone, email,
        managerID, accessLevel, timeSheetRequired,
        overtimeEligible, TABNavigateOT, emailExpenseCopy,
        activeEmployee, iEnterTimeData, numTimeSheetSummaries,
        numExpenseSummaries, numDefaultTimeRows, contractor
      FROM employees
      ORDER BY number;
    `;

    const dataRows = data.rows;
    return Response.json(dataRows);
  } catch (error) {
    console.error('Database Error:', error);
    return Response.error();
  }
}
