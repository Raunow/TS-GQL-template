import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import * as Entities from '../../objects';
import { ENV } from '../ApolloSetup';

const mssqlDefaults = {
	type: 'mssql',
	schema: 'dbo',
	synchronize: false,
	logging: false,
	maxQueryExecutionTime: 3000,
	cache: 5000,
	options: {
		enableArithAbort: true,
	},
} as ConnectionOptions;

let DBConnection: Connection;

export async function GetOrCreateConnection(): Promise<Connection> {
	if (DBConnection?.isConnected) {
		return DBConnection;
	} else {
		DBConnection = await establishConnection('default');
		return DBConnection;
	}
}

async function establishConnection(name: string): Promise<Connection> {
	return createConnection({
		...mssqlDefaults,
		name,
		url: ENV.CONNECTION_STRING,
		entities: Object.values(Entities),
	} as ConnectionOptions);
}
