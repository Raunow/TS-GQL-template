import { ConnectionArguments, ConnectionCursor, fromGlobalId } from 'graphql-relay';
import { ArgsType, Field, Int } from 'type-graphql';

@ArgsType()
export class ConnectionArgs implements ConnectionArguments {
	@Field(() => String, { nullable: true, description: 'Paginate before opaque cursor' })
	before?: ConnectionCursor;

	@Field(() => String, { nullable: true, description: 'Paginate after opaque cursor' })
	after?: ConnectionCursor;

	@Field(() => Int, { nullable: true, description: 'Paginate first' })
	first?: number;

	@Field(() => Int, { nullable: true, description: 'Paginate last' })
	last?: number;

	pagingParams() {
		return getPagingParameters(this);
	}
}

type PagingMeta =
	| { pagingType: 'forward'; after?: string; first: number }
	| { pagingType: 'backward'; before?: string; last: number }
	| { pagingType: 'none' };

function checkPagingSanity(args: ConnectionArgs): PagingMeta {
	const { first = 0, last = 0, after, before } = args;
	const isForwardPaging = !!first || !!after;
	const isBackwardPaging = !!last || !!before;

	if (isForwardPaging && isBackwardPaging) {
		throw new Error('cursor-based pagination cannot be forwards AND backwards');
	}
	if ((isForwardPaging && before) || (isBackwardPaging && after)) {
		throw new Error('paging must use either first/after or last/before');
	}
	if ((isForwardPaging && first < 0) || (isBackwardPaging && last < 0)) {
		throw new Error('paging limit must be positive');
	}
	// This is a weird corner case. We'd have to invert the ordering of query to get the last few items then re-invert it when emitting the results.
	// We'll just ignore it for now.
	if (last && !before) {
		throw new Error("when paging backwards, a 'before' argument is required");
	}

	if (isForwardPaging) {
		return {
			pagingType: 'forward',
			first,
			after,
		};
	} else if (isBackwardPaging) {
		return {
			pagingType: 'backward',
			last,
			before,
		};
	} else {
		return { pagingType: 'none' };
	}
}

const getId = (cursor: ConnectionCursor) => parseInt(fromGlobalId(cursor).id, 10);
const nextId = (cursor: ConnectionCursor) => getId(cursor) + 1;

function getPagingParameters(args: ConnectionArgs) {
	const meta = checkPagingSanity(args);

	let pagingParams: any;
	if (meta.pagingType === 'forward') {
		const { first, after } = meta;
		pagingParams = {
			limit: first,
			offset: after ? nextId(after) : 0,
		};
	} else if (meta.pagingType === 'backward') {
		const { last, before } = meta;
		let limit = last;
		let offset = getId(before!) - last;

		// Check to see if our before-page is underflowing past the 0th item
		if (offset < 0) {
			limit = Math.max(last + offset, 0);
			offset = 0;
		}

		pagingParams = { offset, limit };
	} else {
		pagingParams = { offset: 0 };
	}

	pagingParams.direction = meta.pagingType;

	if (!pagingParams.limit) {
		pagingParams.limit = 500;
	} else if (pagingParams.limit > 20000) {
		pagingParams.limit = 20000;
	}

	return pagingParams;
}
