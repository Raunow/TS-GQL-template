import { DBEntity } from '../../typeORM';

export const baseLookupQueryName = (entity: typeof DBEntity): string => `${entity.identifier}s`;
export const baseQueryName = (entity: typeof DBEntity): string => `${entity.identifier}`;

export const connectionQueryName = (entity: typeof DBEntity): string => `${entity.identifier}s`;
export const connectionEdgeName = (entity: typeof DBEntity): string => `${entity.identifier}Edge`;
export const connectionReturnTypeName = (entity: typeof DBEntity): string => `${entity.identifier}sConnection`;

export const mutationQueryName = (entity: typeof DBEntity): string => `${entity.identifier}s`;
export const mutationReturnTypeName = (entity: typeof DBEntity): string => `${entity.identifier}Result`;

export const InputTypeName = (entity: typeof DBEntity): string => `${entity.identifier}Input`;

export const InputTypeFieldDefault = (title: string) => {
	return {
		description: `The Base64 encoded ID for ${title}`,
		nullable: true,
		name: title,
	};
};
