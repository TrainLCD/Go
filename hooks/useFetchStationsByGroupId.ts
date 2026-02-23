import useSWR from "swr";
import { graphqlClient } from "@/api/client";
import { STATION_GROUP_STATIONS } from "@/graphql/queries";
import type { Station } from "@/types/stationapi";
import { generateSWRKey } from "@/utils/generateSWRKey";
import { groupStations } from "@/utils/groupStations";

export const useFetchStationsByGroupId = (groupId: number) => {
  const variables = { groupId };
  const swrKey = generateSWRKey("stationsByGroupId", variables);

  const {
    data: stations,
    error,
    isLoading,
  } = useSWR(swrKey, async () => {
    if (!groupId) {
      return [];
    }

    const res = await graphqlClient.request<{ stationsByGroupId: Station[] }>(
      STATION_GROUP_STATIONS,
      variables,
    );
    return res.stationsByGroupId;
  });

  return { stations: groupStations(stations ?? []), error, isLoading };
};
