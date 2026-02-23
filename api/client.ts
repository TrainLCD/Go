import { GraphQLClient } from "graphql-request";

export const graphqlClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8080/graphql",
);
