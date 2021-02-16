import { FieldsByTypeName, ResolveTree } from 'graphql-parse-resolve-info';
import { BaseEntity, SelectQueryBuilder } from 'typeorm';
import { Context } from '..';

export interface BaseFilter {
	SetFilter(queryBuilder: SelectQueryBuilder<BaseEntity>, ctx: Context, fields: ResolveTree & FieldsByTypeName): void | SelectQueryBuilder<BaseEntity>;
}
