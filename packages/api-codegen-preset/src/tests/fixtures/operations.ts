export const Query = `#graphql
  query testQuery {
    testQuery {
      test
    }
  }
`;

export const Mutation = `#graphql
  mutation testMutation($input: Int!) {
    testMutation(input: $input) {
      test
    }
  }
`;
