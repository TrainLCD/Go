import useSWR from "swr";
import { graphqlClient } from "@/api/client";
import { LINE_STATIONS } from "@/graphql/queries";
import type { Station } from "@/types/stationapi";
import { generateSWRKey } from "@/utils/generateSWRKey";
import { groupStations } from "@/utils/groupStations";

export const useFetchStationsByLineId = (lineId: number) => {
  const variables = { lineId };
  const swrKey = generateSWRKey("stationsByLineId", variables);

  const {
    data: stations,
    error,
    isLoading,
  } = useSWR(swrKey, async () => {
    if (!lineId) {
      return [];
    }

    const res = await graphqlClient.request<{ lineStations: Station[] }>(
      LINE_STATIONS,
      variables,
    );
    return res.lineStations;
  });

  return { stations: groupStations(stations ?? []), error, isLoading };
};
