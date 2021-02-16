import { Arg, ClassType, ID, Query, Resolver } from 'type-graphql';
import { baseQueryName } from '../../../ApolloSetup';
import { DBEntity } from '../../../typeORM';

export function createGetterResolver(entity: typeof DBEntity & ClassType<DBEntity>) {
	@Resolver(entity)
	class BaseGetterResolver {
		@Query(() => entity, { name: baseQueryName(entity) })
		async resolver(@Arg('id', () => ID) id: string) {
			return entity.findOne(id);
		}
	}

	return BaseGetterResolver;
}
