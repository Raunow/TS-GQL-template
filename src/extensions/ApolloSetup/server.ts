import { ApolloServer } from 'apollo-server-express';
import { Request } from 'express';
import { GraphQLSchema } from 'graphql';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import * as Resolvers from '../../objects/ResolverIndex';
import { Context } from '../type-graphql';
import './config/trimGQLStrings';


async function createSchema(): Promise<GraphQLSchema> {
	try {
		return await buildSchema({
			resolvers: Object.values(Resolvers) as [Function, ...any[]],
			validate: false
		});
	} catch (error) {
		error.details && console.log('schema creation error details: ', error.details);
		throw error;
	}
}

export async function createServer(): Promise<ApolloServer> {
	const server = new ApolloServer({
		playground: true,
		introspection: true,
		context: async ({ req }: { req: Request }) => {
			return {
				userAgent: req.get('user-agent')!
			} as Context;
		},
		schema: await createSchema(),
	});

	return server;
}
