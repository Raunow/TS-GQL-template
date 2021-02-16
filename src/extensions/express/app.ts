import cors from 'cors';
import Express from 'express';
import { createServer, ENV } from '../ApolloSetup';
import { logger } from './logger';

export async function createExpress(): Promise<Express.Application> {
	const app = Express();
	const server = await createServer();

	const graphQLMW = server.getMiddleware({ disableHealthCheck: false, cors: true }); // the disable is redundant, but it's there to document it being active

	app.use(cors());
	ENV.LOGGING && app.use(logger()); //Simple log file

	app.use(graphQLMW);

	return app;
}
