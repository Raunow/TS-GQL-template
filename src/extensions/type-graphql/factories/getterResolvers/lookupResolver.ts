import { Arg, ClassType, ID, Query, Resolver } from 'type-graphql';
import { baseLookupQueryName } from '../../../ApolloSetup';
import { DBEntity } from '../../../typeORM';

export function createLookupResolver(entity: typeof DBEntity & ClassType<DBEntity>) {
	@Resolver(entity)
	class BaseLookupResolver {
		@Query(() => [entity], { name: baseLookupQueryName(entity) })
		async resolver(
			@Arg('id', () => [ID], { nullable: true }) ids: Array<string>
		) {
			if (!ids) {
				return entity.find();
			}

			return entity.findByIds(ids);
		}
	}

	return BaseLookupResolver;
}
