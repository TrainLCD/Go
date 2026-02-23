import useSWR from "swr";
import { graphqlClient } from "@/api/client";
import { LINES_BY_NAME } from "@/graphql/queries";
import type { Line } from "@/types/stationapi";
import { generateSWRKey } from "@/utils/generateSWRKey";

export const useFetchLinesByName = (lineIdOrName: string, limit = 10) => {
  const variables = { name: lineIdOrName, limit };
  const swrKey = generateSWRKey("linesByName", variables);

  const {
    data: lines,
    error,
    isLoading,
  } = useSWR(swrKey, async () => {
    if (typeof lineIdOrName === "number" || !lineIdOrName.length) {
      return [];
    }

    const res = await graphqlClient.request<{ linesByName: Line[] }>(
      LINES_BY_NAME,
      variables,
    );
    return res.linesByName;
  });

  return { lines, error, isLoading };
};
