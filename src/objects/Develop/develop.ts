import os from 'os';
import { Field, ObjectType } from 'type-graphql';
import { ENV } from '../../extensions/ApolloSetup';

@ObjectType()
export class Stats {
	constructor() {
		const include = ['hostname', 'type', 'platform', 'arch', 'homedir'];
		include.map((key: string) => (<any>this)[key] = (<any>os)[key]());
	}
	@Field()
	hostname: string;

	@Field()
	type: string;

	@Field()
	platform: string;

	@Field()
	arch: string;

	@Field()
	homedir: string;

	@Field()
	ram(): string {
		const totalMem = os.totalmem() / Math.pow(1000, 3);
		const usedMem = totalMem - os.freemem() / Math.pow(1000, 3);
		return `${Math.round(usedMem)}/${Math.round(totalMem)} gb`;
	}

	@Field()
	['version'](): string {
		return `${ENV.API.VERSION}-${ENV.API.BRANCH}`;
	}

	@Field()
	uptime(): string {
		return `${Math.round(process.uptime())}s`;
	}
}
