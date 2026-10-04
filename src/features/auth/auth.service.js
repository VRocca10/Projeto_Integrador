import { roles } from "../../data/roles.js";
import { ApiError, apiRequest } from "../../lib/api/client.js";
import { isApiMode } from "../../lib/api/config.js";

const validRoles = new Set(Object.keys(roles));

function normalizeUser(user) {
  if (
    !user
    || typeof user.email !== "string"
    || typeof user.role !== "string"
    || !validRoles.has(user.role)
  ) {
    throw new ApiError("A resposta da API contém um usuário ou perfil inválido.");
  }

  return {
    id: user.id,
    name: user.name ?? user.email.split("@")[0],
    email: user.email,
    role: user.role,
  };
}

export async function login({ email, password, role }) {
  if (!isApiMode) {
    return normalizeUser({ email, role });
  }

  const response = await apiRequest("/auth/login", {
    method: "POST",
    body: { email, password },
  });

  return normalizeUser(response?.user);
}

export async function getCurrentUser() {
  if (!isApiMode) return null;

  const response = await apiRequest("/auth/me");
  return normalizeUser(response?.user);
}

export async function logout() {
  if (isApiMode) {
    await apiRequest("/auth/logout", { method: "POST" });
  }
}
