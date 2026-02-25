import useSWR from "swr";
import { graphqlClient } from "@/api/client";
import { buildLineGroupStationsQuery, ROUTE_TYPES } from "@/graphql/queries";
import type { Route, RouteTypesResponse, Station } from "@/types/stationapi";
import { generateSWRKey } from "@/utils/generateSWRKey";

const CHUNK_SIZE = 10;

const fetchStationsByChunks = async (
  groupIds: number[],
): Promise<Map<number, Station[]>> => {
  const chunks: number[][] = [];
  for (let i = 0; i < groupIds.length; i += CHUNK_SIZE) {
    chunks.push(groupIds.slice(i, i + CHUNK_SIZE));
  }

  const results = await Promise.all(
    chunks.map((chunkIds) =>
      graphqlClient.request<Record<string, Station[]>>(
        buildLineGroupStationsQuery(chunkIds),
      ),
    ),
  );

  const grouped = new Map<number, Station[]>();
  for (let i = 0; i < chunks.length; i++) {
    for (const id of chunks[i]) {
      grouped.set(id, results[i][`g_${id}`] ?? []);
    }
  }

  return grouped;
};

export const useFetchRoutes = (
  fromStationGroupId: number,
  toStationGroupId: number,
) => {
  const variables = { fromStationGroupId, toStationGroupId };
  const swrKey = generateSWRKey("routeTypes", variables);

  const {
    data: routes,
    error,
    isLoading,
  } = useSWR<Route[]>(swrKey, async () => {
    if (isNaN(fromStationGroupId) || isNaN(toStationGroupId)) {
      return [];
    }

    const res = await graphqlClient.request<{
      routeTypes: RouteTypesResponse;
    }>(ROUTE_TYPES, variables);

    const trainTypes = res.routeTypes.trainTypes;
    if (trainTypes.length === 0) {
      return [];
    }

    const groupIds = trainTypes.map((tt) => tt.groupId);
    const grouped = await fetchStationsByChunks(groupIds);

    return trainTypes.map((tt) => ({
      id: tt.groupId,
      stops: grouped.get(tt.groupId) ?? [],
    }));
  });

  return { routes, error, isLoading };
};
