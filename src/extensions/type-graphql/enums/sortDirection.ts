import { registerEnumType } from 'type-graphql';

export enum SortDirection {
	Ascending = 'ASC',
	Descending = 'DESC',
}
registerEnumType(SortDirection, {
	name: 'SortDirection',
});
