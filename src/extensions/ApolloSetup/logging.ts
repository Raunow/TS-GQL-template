import { appendFile } from 'fs';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { ArgumentValidationError } from 'type-graphql';
import { ENV } from './env';

const override = ['log', 'table', 'error'];

export function enableFileLogging() {
	override.forEach((method: string) => {
		const path = `${process.cwd()}/log`;
		const Func = (console as any)[method];
		(console as any)[method] = (message: string = '', ...optionalParams: any[]) => {
			if (message.length > 2000) message = message.slice(0, 2000) + '[Message Trunkated]';

			appendFile(path, `${message.toString()}\n`, err => {
				if (err) console.error(err);
			});

			Func(message, ...optionalParams);
		};
	});
}

export function formatError(error: GraphQLError): GraphQLFormattedError {
	let { extensions, locations, message, path } = error;

	if (ENV.API.BRANCH.toLocaleLowerCase() === 'prod') {
		extensions = { code: extensions?.code };
	}

	if (error.originalError instanceof ArgumentValidationError) {
		extensions = {
			...extensions,
			code: 'GRAPHQL_VALIDATION_FAILED',
		};
	}

	if (extensions) extensions.ENV = ENV.API.BRANCH.toUpperCase();

	return {
		message,
		locations,
		path,
		extensions,
	};
}

