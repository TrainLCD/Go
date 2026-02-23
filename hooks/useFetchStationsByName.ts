import useSWR from "swr";
import { graphqlClient } from "@/api/client";
import { STATIONS_BY_NAME } from "@/graphql/queries";
import type { Station } from "@/types/stationapi";
import { generateSWRKey } from "@/utils/generateSWRKey";
import { groupStations } from "@/utils/groupStations";

export const useFetchStationsByName = (
  stationName: string,
  fromStationGroupId?: number,
) => {
  const variables = { name: stationName, limit: 10, fromStationGroupId };
  const swrKey = generateSWRKey("stationsByName", variables);

  const {
    data: stations,
    error,
    isLoading,
  } = useSWR(swrKey, async () => {
    if (!stationName.length) {
      return [];
    }

    const res = await graphqlClient.request<{ stationsByName: Station[] }>(
      STATIONS_BY_NAME,
      variables,
    );
    return res.stationsByName;
  });

  return { stations: groupStations(stations ?? []), error, isLoading };
};
