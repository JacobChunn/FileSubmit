// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type Employee = {
  id: number;
  number: number;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  cellphone: string;
  homephone: string;
  email: string;
  managerid: number;
  accesslevel: number;
  timesheetrequired: boolean;
  overtimeeligible: boolean;
  tabnavigateot: boolean;
  emailexpensecopy: boolean;
  activeemployee: boolean;
  ientertimedata: boolean;
  numtimesheetsummaries: number;
  numexpensesummaries: number;
  numdefaulttimerows: number;
  contractor: boolean;
};

export type EmployeeState = {
  errors?:
    | {
        [key: string]: string[] | undefined;
        id?: string[];
        number?: string[];
        username?: string[];
        password?: string[];
        firstname?: string[];
        lastname?: string[];
        cellphone?: string[];
        homephone?: string[];
        email?: string[];
        managerid?: string[];
        accesslevel?: string[];
        timesheetrequired?: string[];
        overtimeeligible?: string[];
        tabnavigateot?: string[];
        emailexpensecopy?: string[];
        activeemployee?: string[];
        ientertimedata?: string[];
        numtimesheetsummaries?: string[];
        numexpensesummaries?: string[];
        numdefaulttimerows?: string[];
        contractor?: string[];
      }
    | undefined;
  message?: string | null;
};

export type Project = {
  id: number;
  number: string;
  description: string;
  startdate: string;
  enddate: string;
  shortname: string;
  customerpo: string;
  customercontact: string;
  comments: string;
  overtime: boolean;
  sgaflag: boolean;
};

export type ProjectState = {
  errors?:
    | {
        [key: string]: string[] | undefined;
        id?: string[];
        number?: string[];
        description?: string[];
        startdate?: string[];
        enddate?: string[];
        shortname?: string[];
        customerpo?: string[];
        customercontact?: string[];
        comments?: string[];
        overtime?: string[];
        sgaflag?: string[];
      }
    | undefined;
  message?: string | null;
};

export type Timesheet = {
  id: number;
  employeeid: number;
  weekending: string;
  processed: boolean;
  mgrapproved: boolean;
  usercommitted: boolean;
  totalreghours: number;
  totalovertime: number;
  approvedby: string;
  submittedby: string;
  processedby: string;
  dateprocessed: string;
  message: string;
};

export type TimesheetEditInfo = {
  weekending: string;
  usercommitted: boolean;
  totalreghours: number;
  totalovertime: number;
  message: string;
};

export type TimesheetState = {
  errors?:
    | {
        [key: string]: string[] | undefined;
        id?: string[];
        employeeid?: string[];
        weekending?: string[];
        processed?: string[];
        mgrapproved?: string[];
        usercommitted?: string[];
        totalreghours?: string[];
        totalovertime?: string[];
        approvedby?: string[];
        submittedby?: string[];
        processedby?: string[];
        dateprocessed?: string[];
        message?: string[];
      }
    | undefined;
  message?: string | null;
};

export type TimesheetDetails = {
  id: number;
  timesheetid: number;
  employeeid: number;
  projectid: number;
  phase: number;
  costcode: number;
  description?: string | null;
  mon: number;
  monot: number;
  tues: number;
  tuesot: number;
  wed: number;
  wedot: number;
  thurs: number;
  thursot: number;
  fri: number;
  friot: number;
  sat: number;
  satot: number;
  sun: number;
  sunot: number;
  lasteditdate: string;
};

export type TimesheetDetailsEditInfo = {
  id: number;
  timesheetid: number;
  employeeid: number;
  projectid: number;
  phase: number;
  costcode: number;
  description: string | null ;
  mon: number;
  monot: number;
  tues: number;
  tuesot: number;
  wed: number;
  wedot: number;
  thurs: number;
  thursot: number;
  fri: number;
  friot: number;
  sat: number;
  satot: number;
  sun: number;
  sunot: number;
  lasteditdate: string;
};

export const timesheetDetailsLabels = {
	id: "id",
	project: 'project',
	phase: 'phase',
	costcode: 'costcode',
	description: 'description',
	mon: 'mon',
	monot: 'monOT',
	tues: 'tues',
	tuesot: 'tuesOT',
	wed: 'wed',
	wedot: 'wedOT',
	thurs: 'thurs',
	thursot: 'thursOT',
	fri: 'fri',
	friot: 'friOT',
	sat: 'sat',
	satot: 'satOT',
	sun: 'sun',
	sunot: 'sunOT',
};

export type ProjectOption = {
  id: number;
  number: string;
  shortname: string;
  description: string;
};

export type PhaseOption = {
  id: number;
  description: string;
};

export type CostCodeOption = {
  id: number;
  description: string;
};

export type Options = {
  projects: ProjectOption[];
  phases: PhaseOption[];
  costcodes: CostCodeOption[];
};

export type TabType = {
  label: string;
  value: string;
};

export type StateType = {
  errors?: {
    [key: string]: string[] | undefined;
  };
  message?: string | null;
};

export type CustomUser = {
  id: string;
  role: 'normalUser' | 'admin';
};
