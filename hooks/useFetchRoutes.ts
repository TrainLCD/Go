import useSWR from "swr";
import { graphqlClient } from "@/api/client";
import { ROUTE_TYPES } from "@/graphql/queries";
import type { RouteTypesResponse, TrainType } from "@/types/stationapi";
import { generateSWRKey } from "@/utils/generateSWRKey";

export const useFetchRoutes = (
  fromStationGroupId: number,
  toStationGroupId: number,
) => {
  const variables = { fromStationGroupId, toStationGroupId };
  const swrKey = generateSWRKey("routeTypes", variables);

  const {
    data: trainTypes,
    error,
    isLoading,
  } = useSWR(swrKey, async () => {
    if (isNaN(fromStationGroupId) || isNaN(toStationGroupId)) {
      return [];
    }

    const res = await graphqlClient.request<{
      routeTypes: RouteTypesResponse;
    }>(ROUTE_TYPES, variables);
    return res.routeTypes.trainTypes;
  });

  return { trainTypes, error, isLoading };
};
