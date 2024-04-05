# SwagGraphQLMesh

## Why?
This is a proof of concept to test GraphQL Mesh for Shopware 6.

We used [GraphQL Mesh](https://the-guild.dev/graphql/mesh/docs) as base because you can combine different sources and it is easy to setup.

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
:warning: Be careful not to expose sensitive data. So if you do not need the admin API source remove it from `.meshrc.yaml`. There is also an option to filter out specific endpoints, check GraphQL Mesh documentation for that.

- With `pnpm run build` you generate the GraphQL Schema for every source
- With `pnpm run start` you starting the production server  

**Hint:** We did __not__ finished testing in production mode.

## Example Queries & Mutations
**GraphQL Operations**
- **Query**: A GraphQL query is similar to a REST API’s **GET** method.
- **Mutation**: A mutation is a request to add or modify data. This is similar to the REST API’s **POST, PUT, PATCH, or DELETE** methods.

### store API

**readProduct**
```graphQL
mutation ProductMutation {
  readProduct(input: {filter: {value: "blue", field: "name", type: "contains"}}) {
    total
    elements {
      active
      name
    }
  }
}
```

**readSitemap**
```graphQL
query reatSitemap {
  readSitemap {
    filename
  }
}
```

**readProductListing**
```graphQL
mutation readProductListing {
  readProductListing(
    categoryId: "018e7f525bbb731491a9690a75fb1a23"
    sw_include_seo_urls: true
  ) {
    elements {
      active
      id
      name
      seoUrls {
        seoPathInfo
        pathInfo
        routeName
      }
    }
  }
}
```

### admin API

**infoShopwareVersion**
```graphQL
query CurrenShopwareVersionQuery {
  infoShopwareVersion {
    version
  }
}
```
:warning: Filters, aggregations and some fields are not workig or returning data. More investigation needed.

## Troubleshooting

### Query missing in Explorer?
If your Endpoint is a POST Request use a mutation instead. In Explorer (dev mode) you can switch the view to mutations.

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