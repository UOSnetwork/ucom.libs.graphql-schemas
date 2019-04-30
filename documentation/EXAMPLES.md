# Examples

## Usage with the default response keys

It is OK if there is only one call of one GraphQL function

```
const oneUserParams = {
  filters: {
    user_id: userId,
  },
};

const trustedByParams = {
  filters: {
    user_id: userId,
  },
  order_by: '-id',
  page: 1,
  per_page: 10,
};

const parts = [];

parts.push(GraphQLSchema.getOneUserQueryPart(oneUserParams));
parts.push(GraphQLSchema.getOneUserTrustedByQueryPart(trustedByParams));

const query = GraphQLSchema.getQueryMadeFromParts(parts);
```

## Usage with the custom aliases

It is required in order to call one GraphQL function in one request but with the different parameters.
The response will contain all mentioned keys with the appropriate data.

```
const firstUserParams = {
  filters: {
    user_id: 1,
  },
};

const secondUserParams = {
  filters: {
    user_id: 2,
  },
};

const firstUserTrustedByParams = {
  filters: {
    user_id: 1,
  },
  order_by: '-id',
  page: 1,
  per_page: 10,
};

const secondUserTrustedByParams = {
  filters: {
    user_id: 2,
  },
  order_by: '-id',
  page: 1,
  per_page: 10,
};

const partsWithAliases = {};

partsWithAliases['first_user'] = GraphQLSchema.getOneUserQueryPart(firstUserParams);
partsWithAliases['second_user'] = GraphQLSchema.getOneUserQueryPart(secondUserParams);

partsWithAliases['first_user_trusted_by'] = GraphQLSchema.getOneUserTrustedByQueryPart(firstUserTrustedByParams);
partsWithAliases['second_user_trusted_by'] = GraphQLSchema.getOneUserTrustedByQueryPart(secondUserTrustedByParams);

const query = GraphQLSchema.getQueryMadeFromPartsWithAliases(partsWithAliases);
```
