# ucom.libs.graphql-schemas

Goal: GraphQL schemas library to reuse between different services.


## How to use

Please prefer methods that have suffix `QueryPart`. Example:

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

const parts: string[] = [];

parts.push(GraphQLSchema.getOneUserQueryPart(oneUserParams));
parts.push(GraphQLSchema.getOneUserTrustedByQueryPart(trustedByParams));

const query = GraphQLSchema.getQueryMadeFromParts(parts);
```