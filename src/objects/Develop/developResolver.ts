import GraphQLJSON from 'graphql-type-json';
import { Arg, Query, Resolver } from 'type-graphql';
import { ENV } from '../../extensions/ApolloSetup';
import { Stats } from './develop';

@Resolver()
export class DevelopResolver {
	@Query(() => GraphQLJSON, { description: 'Read current settings' })
	Settings(
		@Arg('path', { nullable: true, description: 'Period "." separated string for digging into the object' })
		pathStr?: string,
	) {
		let clone: Record<string, any> = {
			API: {
				BRANCH: ENV.API.BRANCH,
				VERSION: ENV.API.VERSION,
				PORT: ENV.API.PORT,
			},
		};

		if (pathStr) {
			const paths = pathStr.split('.');

			paths.forEach(path => {
				clone = clone[path];
			});
		}

		return clone;
	}

	@Query(() => Stats, { nullable: false })
	stats() {
		return new Stats();
	}
}
