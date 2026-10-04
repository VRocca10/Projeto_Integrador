const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(message, { status, details } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export async function apiRequest(path, { method = "GET", body, signal } = {}) {
  if (!apiBaseUrl) {
    throw new Error("Defina VITE_API_BASE_URL para conectar a API.");
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    method,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  });

  const responseText = await response.text();
  let data;

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }
  }

  if (!response.ok) {
    const message = typeof data === "object" && data !== null
      ? data.message ?? data.title
      : undefined;
    throw new ApiError(message ?? `A solicitação falhou (${response.status}).`, {
      status: response.status,
      details: data,
    });
  }

  return data;
}
