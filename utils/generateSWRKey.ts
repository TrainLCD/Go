export const generateSWRKey = (
  method: string,
  request: Record<string, unknown>,
) =>
  `${method}:${Object.entries(request)
    .map(([key, value]) => `${key}:${value}`)
    .join(":")}`;
