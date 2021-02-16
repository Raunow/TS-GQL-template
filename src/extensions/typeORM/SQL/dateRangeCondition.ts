import { DateRange } from '../../../objects';

export function getDateRangeCondition(dateRange: Array<DateRange>, columnName: string = 'datetime') {
	const values: { [index: string]: string } = {};
	const rangeCond = dateRange
		.map(({ from, to }, index) => {
			const fromTime = new Date(from);
			const toTime = new Date(to);

			//formatting to YYYY-MM-DD HH-mm-ss in order to get BETWEEN to work
			const formattedFromDate =
				fromTime.getFullYear() +
				'-' +
				(fromTime.getMonth() + 1) +
				'-' +
				fromTime.getDate() +
				' ' +
				fromTime.getHours() +
				':' +
				fromTime.getMinutes() +
				':' +
				fromTime.getSeconds();

			const formattedToDate =
				toTime.getFullYear() +
				'-' +
				(toTime.getMonth() + 1) +
				'-' +
				toTime.getDate() +
				' ' +
				toTime.getHours() +
				':' +
				toTime.getMinutes() +
				':' +
				toTime.getSeconds();

			values[`from${index}`] = formattedFromDate;
			values[`to${index}`] = formattedToDate;

			return `(${columnName} BETWEEN :from${index} AND :to${index})`;
		})
		.join(' OR ');

	return {
		values,
		rangeCondition: `(${rangeCond})`,
	};
}
