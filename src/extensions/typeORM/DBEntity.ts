import { BaseEntity } from 'typeorm';

export abstract class DBEntity extends BaseEntity {
	static identifier: string;
	dbID: number;
}
