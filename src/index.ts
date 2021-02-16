import { Application } from 'express';
import 'reflect-metadata';
import { enableFileLogging, ENV } from './extensions/ApolloSetup';
import { createExpress } from './extensions/express';


ENV.LOGGING && enableFileLogging();

(async () => {
	const app: Application = await createExpress();

	app.listen(ENV.API.PORT, () =>
		console.log(`Listening at http://localhost:${ENV.API.PORT}/graphql`),
	);
})();

