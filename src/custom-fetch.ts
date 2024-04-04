import { MeshContext } from "@graphql-mesh/runtime";
import { GraphQLResolveInfo } from "graphql";
import { createAdminAPIClient } from "@shopware/api-client";
import type {
  operations as adminOperations,
  operationPaths as adminOperationPaths,
} from "@shopware/api-client/admin-api-types";

export default async function (
  url: string,
  options: RequestInit = {},
  context?: MeshContext,
  info?: GraphQLResolveInfo,
) {
  // For the Shopware admin API, we need to authenticate (set Bearer token in headers)
  if (
    url.includes("/api") &&
    typeof options !== "undefined" &&
    typeof options.headers !== "undefined" &&
    context
  ) {
    const baseUrl = options.headers["openapi-json-url"];
    const username = options.headers["shopware-admin-username"];
    const password = options.headers["shopware-admin-password"];
    let accessToken = "";
    let expirationTime = 600;

    // create an instance of the Shopware admin API client
    const adminClient = createAdminAPIClient<
      adminOperations,
      adminOperationPaths
    >({
      baseURL: `${baseUrl}/api`,
      credentials: {
        grant_type: "password",
        client_id: "administration",
        scopes: "write",
        username: username,
        password: password,
      },
      onAuthChange: (auth) => {
        accessToken = auth.accessToken;
        expirationTime = auth.expirationTime;
      },
      sessionData: {
        accessToken: "",
        expirationTime: expirationTime,
      },
    });

    const response = await adminClient.invoke("token post /oauth/token", {
      grant_type: "password",
      client_id: "administration",
      scopes: "write",
      username: username,
      password: password,
    });

    const { access_token: newAccessToken, expires_in: newExpirationTime } =
      response;

    if (accessToken !== newAccessToken) {
      accessToken = newAccessToken;
      expirationTime = newExpirationTime;
    }

    // Set the Bearer token in the headers
    options.headers["authorization"] = "Bearer " + accessToken;
    // Clean up headers forwarded to the Rest API
    delete options.headers["authorization-bearer"];
    delete options.headers["openapi-json-url"];
    delete options.headers["shopware-admin-username"];
    delete options.headers["shopware-admin-password"];
  }

  // Execute the fetch with the new headers
  return fetch(url, options);
}
