import path from "path";

import { executeCodegen } from "@graphql-codegen/cli";
import { pluckConfig } from "@shopify/graphql-codegen";

import { ApiType, preset } from "..";

const getCodegenOptions = (fixture: string, output = "out.d.ts") => ({
  pluckConfig: pluckConfig as any,
  generates: {
    [output]: {
      preset,
      schema: path.join(__dirname, "fixtures", "schema.graphql"),
      documents: path.join(__dirname, `fixtures/${fixture}`),
      presetConfig: {
        apiType: ApiType.Admin,
      },
    },
  },
});

describe("Preset", () => {
  it("includes ESLint comments, types with Pick, generated operations and augments interfaces", async () => {
    const result = await executeCodegen(getCodegenOptions("operations.ts"));

    expect(result).toHaveLength(1);

    const generatedCode = result.find(
      (file) => file.filename === "out.d.ts",
    )!.content;

    // Disables ESLint
    expect(generatedCode).toMatch("/* eslint-disable */");

    // Imports Admin API
    expect(generatedCode).toMatch(
      `import * as AdminTypes from './admin.types.d.ts';`,
    );

    // Uses Pick<...>
    expect(generatedCode).toMatch(`Pick<AdminTypes.`);

    // Generates query and mutation types
    expect(generatedCode).toMatch(
      /interface GeneratedQueryTypes \{\s+"#graphql/,
    );
    expect(generatedCode).toMatch(
      /interface GeneratedMutationTypes \{\s+"#graphql/,
    );

    // Augments query/mutation types
    expect(generatedCode).toMatch(`declare module '@shopify/admin-api-client' {
  type InputMaybe<T> = AdminTypes.InputMaybe<T>;
  interface AdminQueries extends GeneratedQueryTypes {}
  interface AdminMutations extends GeneratedMutationTypes {}
}`);

    expect(generatedCode)
      .toBe(`/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import * as AdminTypes from './admin.types.d.ts';

export type TestQueryQueryVariables = AdminTypes.Exact<{ [key: string]: never; }>;


export type TestQueryQuery = { testQuery?: AdminTypes.Maybe<Pick<AdminTypes.QueryResponse, 'test'>> };

export type TestMutationMutationVariables = AdminTypes.Exact<{
  input: AdminTypes.Scalars['Int']['input'];
}>;


export type TestMutationMutation = { testMutation?: AdminTypes.Maybe<Pick<AdminTypes.QueryResponse, 'test'>> };

interface GeneratedQueryTypes {
  "#graphql\\n  query testQuery {\\n    testQuery {\\n      test\\n    }\\n  }\\n": {return: TestQueryQuery, variables: TestQueryQueryVariables},
}

interface GeneratedMutationTypes {
  "#graphql\\n  mutation testMutation($input: Int!) {\\n    testMutation(input: $input) {\\n      test\\n    }\\n  }\\n": {return: TestMutationMutation, variables: TestMutationMutationVariables},
}
declare module '@shopify/admin-api-client' {
  type InputMaybe<T> = AdminTypes.InputMaybe<T>;
  interface AdminQueries extends GeneratedQueryTypes {}
  interface AdminMutations extends GeneratedMutationTypes {}
}
`);
  });
});
