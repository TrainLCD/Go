import useSWR from "swr";
import { graphqlClient } from "@/api/client";
import { LINE_BY_ID } from "@/graphql/queries";
import type { Line } from "@/types/stationapi";
import { generateSWRKey } from "@/utils/generateSWRKey";

export const useFetchLineById = (lineId: number | undefined) => {
  const variables = { lineId };
  const swrKey = generateSWRKey("lineById", variables);

  const {
    data: line,
    error,
    isLoading,
  } = useSWR(swrKey, async () => {
    if (!lineId) {
      return;
    }

    const res = await graphqlClient.request<{ line: Line }>(
      LINE_BY_ID,
      variables,
    );
    return res.line;
  });

  return { line, error, isLoading };
};
