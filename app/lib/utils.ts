import { DateTime } from 'luxon';
import { ExpenseDetailsExtended, Revenue, TimesheetDetailsExtended } from './definitions';

export function compareTimesheetDetailsExtended(
    tsds1: TimesheetDetailsExtended[] | null,
    tsds2: TimesheetDetailsExtended[] | null,
): boolean {
	if (!tsds1 && !tsds2) return true;
	if (!tsds1 || !tsds2) return false;

    if (tsds1.length !== tsds2.length) return false;

    for (let index = 0; index < tsds1.length; index++) {
        const v1 = tsds1[index];
        const v2 = tsds2[index];

		for (const key of Object.keys(v1) as Array<keyof TimesheetDetailsExtended>) {
			if (v1[key] !== v2[key]) {
				return false;
			}
		}
    }

    return true;
}

export function compareExpenseDetailsExtended(
    exds1: ExpenseDetailsExtended[] | null,
    exds2: ExpenseDetailsExtended[] | null,
): boolean {
	if (!exds1 && !exds2) return true;
	if (!exds1 || !exds2) return false;

    if (exds1.length !== exds2.length) return false;

    for (let index = 0; index < exds1.length; index++) {
        const v1 = exds1[index];
        const v2 = exds2[index];

		for (const key of Object.keys(v1) as Array<keyof ExpenseDetailsExtended>) {
			if (v1[key] !== v2[key]) {
				return false;
			}
		}
    }

    return true;
}

export function compareDates(
	local: DateTime<true> | DateTime<false> | null,
	database: DateTime<true> | DateTime<false> | null,
): boolean {
	if (!local || !database) return false;

	return local.equals(database);
}

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const generateYAxis = (revenue: Revenue[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};
