import useSWR from "swr";
import { graphqlClient } from "@/api/client";
import { ROUTES } from "@/graphql/queries";
import type { Route, RoutesResponse } from "@/types/stationapi";
import { generateSWRKey } from "@/utils/generateSWRKey";

const getRouteFingerprint = (route: Route): string =>
  route.stops
    .map((stop) => `${stop.line?.id ?? 0}:${stop.trainType?.typeId ?? 0}:${stop.groupId}`)
    .join("|");

const deduplicateRoutes = (routes: Route[]): Route[] => {
  const seen = new Set<string>();
  return routes.filter((route) => {
    const fingerprint = getRouteFingerprint(route);
    if (seen.has(fingerprint)) {
      return false;
    }
    seen.add(fingerprint);
    return true;
  });
};

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
    return deduplicateRoutes(res.routes.routes);
  });

  return { routes, error, isLoading };
};
