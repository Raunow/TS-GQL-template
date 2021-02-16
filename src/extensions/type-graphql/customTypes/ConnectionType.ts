import Relay from 'graphql-relay';
import { Field, ObjectType } from 'type-graphql';
import { connectionEdgeName, connectionReturnTypeName } from '../../ApolloSetup';
import { DBEntity } from '../../typeORM';

export function connectionType(entity: typeof DBEntity) {
	@ObjectType(connectionEdgeName(entity))
	abstract class Edge implements Relay.Edge<typeof entity> {
		@Field(() => entity)
		node: typeof entity;

		@Field(() => String, { description: 'Used in `before` and `after` args' })
		cursor!: Relay.ConnectionCursor;

		cursorDecoded() {
			return Relay.fromGlobalId(this.cursor);
		}
	}

	@ObjectType(connectionReturnTypeName(entity))
	abstract class Connection implements Relay.Connection<typeof entity> {
		@Field(() => [Edge])
		edges!: Edge[];

		@Field()
		pageInfo!: PageInfo;
	}

	return Connection;
}

@ObjectType()
export class PageInfo implements Relay.PageInfo {
	@Field(() => String, { nullable: true })
	startCursor?: Relay.ConnectionCursor | null;

	@Field(() => String, { nullable: true })
	endCursor?: Relay.ConnectionCursor | null;

	@Field(() => Boolean, { nullable: true })
	hasPreviousPage?: boolean | null;

	@Field(() => Boolean, { nullable: true })
	hasNextPage?: boolean | null;
}
