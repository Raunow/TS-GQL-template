import { Arg, Ctx, FieldResolver, ID, Mutation, ObjectType, Resolver, Root } from 'type-graphql';
import { BaseMutation, Context } from '../..';
import { mutationQueryName, mutationReturnTypeName } from '../../../ApolloSetup';
import { DBEntity } from '../../../typeORM';


export function createMutationResolver(entity: typeof DBEntity, mutations?: BaseMutation, inputType?: typeof DBEntity,) {
	inputType ??= entity;
	mutations ??= new BaseMutation();

	@ObjectType(mutationReturnTypeName(entity), { isAbstract: true })
	class MutationReturnType {
		create: Array<DBEntity>;
		update: Array<DBEntity>;
		delete: Array<DBEntity>;
	}

	@Resolver(() => MutationReturnType)
	class BaseMutationResolver {
		@Mutation(() => MutationReturnType, { name: mutationQueryName(entity), nullable: true })
		async mutate(@Arg('id', () => [ID], { nullable: true }) ids: Array<string>): Promise<number[] | {}> {
			if (!ids || ids.length === 0) return {};

			return ids;
		}

		@FieldResolver(() => [entity])
		async create(@Arg('data', () => [inputType]) input: Array<DBEntity>, @Ctx() ctx: Context) {
			await mutations!.preCreate(input, ctx);

			const created = await entity.save(input);
			await mutations!.postCreate(input, created, ctx);

			return created;
		}

		@FieldResolver(() => [entity])
		async update(@Root() root: number[], @Arg('data', () => inputType!) input: DBEntity, @Ctx() ctx: Context) {
			const toUpdate = await mutations!.preUpdate(input, root, ctx) || await entity.findByIds(root)

			await entity.update(toUpdate.map(({ dbID }) => dbID), input);

			await mutations!.postUpdate(input, toUpdate, ctx);

			return toUpdate.map(obj => Object.assign(obj, input));
		}

		@FieldResolver(() => [entity])
		async delete(@Root() root: number[], @Arg('fast', { nullable: true, defaultValue: false, description: `Entities are not guarenteed to be deleted.` }) fast: boolean, @Ctx() ctx: Context): Promise<Array<DBEntity>> {
			let toDelete = await mutations!.preDelete(root, ctx);

			await mutations!.preDelete(root, ctx);

			let deleted: Array<DBEntity>;

			const ids = toDelete?.map(({ dbID }) => dbID) || root;

			if (fast) {
				deleted = await entity.findByIds(ids);
				entity.delete(ids);
			} else {
				toDelete ??= await entity.findByIds(ids);
				deleted = await entity.remove(toDelete);
			}

			await mutations!.postDelete(deleted, ctx);

			return deleted!;
		}
	}

	return BaseMutationResolver;
}
