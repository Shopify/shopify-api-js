import { ApiClient } from "@shopify/graphql-client";

import { AdminApiClientConfig } from "../types";

export interface AdminQueries {
  [key: string]: { variables: any; return: any };
  [key: number | symbol]: never;
}
export interface AdminMutations {
  [key: string]: { variables: any; return: any };
  [key: number | symbol]: never;
}
export type AdminOperations = AdminQueries & AdminMutations;

export type AdminApiClient = ApiClient<AdminApiClientConfig, AdminOperations>;
