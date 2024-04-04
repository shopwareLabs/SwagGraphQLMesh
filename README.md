# SwagGraphQLMesh

## Why?
This is a proof of concept to test GraphQL Mesh for Shopware 6.  
We used [GraphQL Mesh](https://the-guild.dev/graphql/mesh/docs) as base because you can combine different sources and it is easy to setup.

## Screens

**admin API**
![admin API screen GraphQL Mesh](https://raw.githubusercontent.com/shopwareLabs/SwagGraphQLMesh/main/assets/shopware-6-graphQL-mesh-admin.png)

**store API**
![store API screen GraphQL Mesh](https://raw.githubusercontent.com/shopwareLabs/SwagGraphQLMesh/main/assets/shopware-6-graphQL-mesh-store.png)

## Dependencies
- We rely on `@shopware/api-gen` and `@shopware/api-client`

## How to test it in development?
- Checkout this repository and run `pnpm install`
- Make sure you have a local or cloud instance of Shopware 6 running
- Put your URL and credentials in `.env.adminapi` and `.env.storeapi`
- Execute `pnpm run create:storeapi:json` to update the schema (with the schema from your instance)
- Execute `pnpm run create:adminapi:json` to update the schema (with the schema from your instance)
- Start the source you want to test with one of these commands `pnpm run start:storeapi` or `pnpm run start:adminapi`

## How to use it in production?
- With `pnpm run build` you generate the GraphQL Schema for every source
- With `pnpm run start` you starting the production server  

**Hint:** We did __not__ finished testing in production mode.

## Example Queries

### store API

**readProduct**
```graphQL
query ProductQuery {
  readProduct(input: {filter: {value: "blue", field: "name", type: "contains"}}) {
    total
    elements {
      active
      name
    }
  }
}
```

### admin API

**infoShopwareVersion**
```
query CurrenShopwareVersionQuery {
  infoShopwareVersion {
    version
  }
}
```

## Troubleshooting

### Query missing in Explorer?
If your Endpoint is a POST Request make sure the `operationId` of your Endpoint is present in `.meshrc.yaml` file. Only GET Requests are added by default as `Query` in GraphQL Mesh.

### Fetch failed
You see something like `"message": "fetch failed"` as a Response of your Query, make sure your local or cloud instance is running.

### NetworkError
If you see `"message": "NetworkError when attempting to fetch resource."` as a Response of your Query, make sure that the GraphQL Mesh Server is running.

### build or validate command not working
You execute `pnpm run validate` or `pnpm run build` and see some strange messages that some fields are missing or where removed but you are sure that you OpenAPI Schema is correct. Try to remove the `.mesh` folder and execute build again afterwards.

## Is that the final/stable solution for GraphQL?
No. There will be more POC's to evaluate the best possible solution.

---
Created with 💙 by Shopware AG