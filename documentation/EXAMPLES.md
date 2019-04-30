# Examples

## Usage with the default response keys

It is OK if there is only one call of one GraphQL function

```
const oneUserParams = {
  filters: {
    user_id: 1,
  },
};

const trustedByParams = {
  filters: {
    user_id: 1,
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

Example response:
```
{
  "data": {
    "one_user": {
      "id": 1,
      "account_name": "vlad",
      "nickname": "vlad",
      "first_name": "Vlad",
      "last_name": "Ivanov",
      // ... other one user parameters
    },
    "one_user_trusted_by": {
      "data": [
        {
          "id": 380,
          "account_name": "halloohalloo",
          "first_name": "Pavel I",
          "nickname": "halloohalloo",
          
          // ... other one user parameters
        }
      ],
      "metadata": {
        "page": 1,
        "per_page": 10,
        "has_more": false,
        "total_amount": 1
      }
    }
  }
}
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


Example response
```
{
  "data": {
    "first_user": {
      "id": 1,
      "account_name": "vlad",
      "nickname": "vlad",
      "first_name": "Vlad",
      "last_name": "Ivanov",
      // ... other one user params 
    },
    "second_user": {
      "id": 2,
      "account_name": "jane",
      "nickname": "jane",
      "first_name": "Jane Magika .✫*ﾟ･ﾟ｡.☆.*",
      "last_name": "O",
      // ... other one user params 
    },
    "first_user_trusted_by": {
      "data": [
        {
          "I_follow": null,
          "followed_by": null,
          "id": 380,
          "account_name": "halloohalloo",
          "first_name": "Pavel I",
          "last_name": null,
          "nickname": "halloohalloo",
          // ... other one user params
        }
      ],
      "metadata": {
        "page": 1,
        "per_page": 10,
        "has_more": false,
        "total_amount": 1
      }
    },
    "second_user_trusted_by": {
      "data": [
        {
          "I_follow": null,
          "followed_by": null,
          "id": 459,
          "account_name": "qqqqqqqqqqqq",
          // ... other one user params
        },
        {
          "I_follow": null,
          "followed_by": null,
          "id": 381,
          "account_name": "455534343434",
          // ... other one user params
        },
        {
          "I_follow": null,
          "followed_by": null,
          "id": 380,
          "account_name": "halloohalloo",
          // ... other one user params
        }
      ],
      "metadata": {
        "page": 1,
        "per_page": 10,
        "has_more": false,
        "total_amount": 3
      }
    }
  }
}
```
