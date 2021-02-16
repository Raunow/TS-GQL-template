import { GraphQLString } from 'graphql/type/scalars';

//Trim returned strings
const serialize = GraphQLString.serialize;
GraphQLString.serialize = (value?) => serialize(value).trim();

//Trim string inputs
const parseLiteral = GraphQLString.parseLiteral;
GraphQLString.parseLiteral = (value?) => parseLiteral(value, null).trim();
