import { Context } from '../..';
import { DBEntity } from '../../../typeORM';

export class BaseMutation {
	async defaults(_ctx: Context): Promise<void> { }

	async preCreate(_input: Array<DBEntity>, _ctx: Context): Promise<void> { }
	async postCreate(_input: Array<DBEntity>, _created: Array<DBEntity>, _ctx: Context): Promise<void> { }

	async preUpdate(_input: DBEntity, _toUpdate: Array<number>, _ctx: Context): Promise<Array<DBEntity> | void | undefined> {
	}
	async postUpdate(_input: DBEntity, _updated: Array<DBEntity>, _ctx: Context): Promise<void> { }

	async preDelete(_toDelete: number[], _ctx: Context): Promise<Array<DBEntity> | undefined> {
		return;
	}
	async postDelete(_deleted: Array<DBEntity>, _ctx: Context): Promise<void> { }
}
