// src/shared/utils/remote-api.util.ts
export async function fetchRemoteData(url: string): Promise<any> {
  const response = await fetch(url);
  return response.json();
}
