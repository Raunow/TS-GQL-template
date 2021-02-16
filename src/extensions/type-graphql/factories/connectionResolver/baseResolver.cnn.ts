import { FieldsByTypeName, ResolveTree } from 'graphql-parse-resolve-info';
import { Arg, Args, ClassType, Ctx, Query, Resolver } from 'type-graphql';
import { SelectQueryBuilder } from 'typeorm';
import { BaseFilter, BaseOrderBy, ConnectionArgs, connectionFromArraySlice, connectionType, Context, Fields } from '../..';
import { connectionQueryName } from '../../../ApolloSetup';
import { DBEntity } from '../../../typeORM';

export function createConnectionResolver(
	entity: typeof DBEntity & ClassType<DBEntity>,
	GetQuery: (ctx: Context, Args: { offset?: number; limit?: number }, fields: ResolveTree & FieldsByTypeName) => SelectQueryBuilder<DBEntity>,
	filter: ClassType<BaseFilter>,
	orderBy: ClassType<BaseOrderBy>,
	options: { rawQuery?: boolean; filterNullable?: boolean } = { rawQuery: false, filterNullable: true },
) {
	const returnedType = connectionType(entity);

	@Resolver(entity)
	class BaseConnectionResolver {
		@Query(() => returnedType, { name: connectionQueryName(entity) })
		async queryAndPaginate(
			@Arg('orderby', () => [orderBy], { nullable: true }) orders: Array<BaseOrderBy>,
			@Arg('filter', () => filter, { nullable: options.filterNullable }) filter: BaseFilter,
			@Args(() => ConnectionArgs) data: ConnectionArgs,
			@Ctx() ctx: Context,
			@Fields() fields: ResolveTree & FieldsByTypeName,
		) {
			const args = data.pagingParams();
			const queryBuilder = GetQuery(ctx, args, fields)
				.skip(args.offset)
				.take(args.limit + 1);

			filter?.SetFilter(queryBuilder, ctx, fields);
			orders?.forEach(ordering => queryBuilder.addOrderBy(ordering.fieldName, ordering.sortDirection));

			let entities: Array<DBEntity>;

			entities = await queryBuilder.getMany();

			let count = entities.length;
			if (args.direction !== 'none') {
				count += args.offset;
			}


			return connectionFromArraySlice<DBEntity>(entities, data, {
				arrayLength: count,
				sliceStart: args.offset,
			});
		}
	}

	return BaseConnectionResolver;
}
