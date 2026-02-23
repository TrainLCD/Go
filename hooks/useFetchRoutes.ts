import useSWR from "swr";
import { graphqlClient } from "@/api/client";
import { ROUTES } from "@/graphql/queries";
import type { RoutesResponse } from "@/types/stationapi";
import { generateSWRKey } from "@/utils/generateSWRKey";

export const useFetchRoutes = (
  fromStationGroupId: number,
  toStationGroupId: number,
) => {
  const variables = { fromStationGroupId, toStationGroupId };
  const swrKey = generateSWRKey("routes", variables);

  const {
    data: routes,
    error,
    isLoading,
  } = useSWR(swrKey, async () => {
    if (isNaN(fromStationGroupId) || isNaN(toStationGroupId)) {
      return [];
    }

    const res = await graphqlClient.request<{ routes: RoutesResponse }>(
      ROUTES,
      variables,
    );
    return res.routes.routes;
  });

  return { routes, error, isLoading };
};
