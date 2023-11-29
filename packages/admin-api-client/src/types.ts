import {
  ApiClient,
  CustomFetchApi,
  ApiClientLogger,
  ApiClientLogContentTypes,
  ApiClientConfig,
} from "@shopify/graphql-client";

export type AdminApiClientLogContentTypes = ApiClientLogContentTypes;

export type AdminApiClientConfig = ApiClientConfig & {
  accessToken: string;
  userAgentPrefix?: string;
};

export type AdminApiClientOptions = Omit<
  AdminApiClientConfig,
  "headers" | "apiUrl"
> & {
  customFetchApi?: CustomFetchApi;
  logger?: ApiClientLogger<AdminApiClientLogContentTypes>;
};

export interface AdminQueries {
  [key: string]: { variables: any; return: any };
}
export interface AdminMutations {
  [key: string]: { variables: any; return: any };
}
export type AdminOperations = AdminQueries & AdminMutations;

export type AdminApiClient = ApiClient<AdminApiClientConfig, AdminOperations>;
