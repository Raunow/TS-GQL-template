import { FieldsByTypeName, ResolveTree } from "graphql-parse-resolve-info";
import { connectionEdgeName, connectionReturnTypeName } from "../ApolloSetup";
import { DBEntity } from "../typeORM";

export function GetConnectionFields(entity: typeof DBEntity, fields: ResolveTree & FieldsByTypeName) {
	return fields.fieldsByTypeName?.[connectionReturnTypeName(entity)].edges.fieldsByTypeName[connectionEdgeName(entity)].node.fieldsByTypeName[entity.identifier];
}

export function GetArgs(fields: ResolveTree & FieldsByTypeName) {
	return JSON.parse(JSON.stringify(fields.args));
}
