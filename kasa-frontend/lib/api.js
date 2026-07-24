const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
// Origine du backend (sans le préfixe /api) : utile pour les routes /auth/... et pour résoudre les images uploadées
const AUTH_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

// Les images uploadées (POST /api/uploads/image) sont renvoyées en URL relative (/uploads/xxx.jpg).
// Le frontend (Next.js) et le backend (Express) tournent sur des ports différents en local :
// une URL relative se résoudrait donc par erreur contre l'origine du frontend. On la préfixe
// avec l'origine du backend. Les URLs déjà absolues (http/https, blob:, data:) sont laissées telles quelles.
export function resolveImageUrl(url) {
  if (!url) return url;
  if (/^(https?:|blob:|data:)/i.test(url)) return url;
  return `${AUTH_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export async function getProperties() {
  const res = await fetch(`${API_BASE_URL}/properties`, { cache: "no-store" });
  if (!res.ok) throw new Error("Impossible de récupérer les logements");
  return res.json();
}

export async function getPropertyById(id) {
  const res = await fetch(`${API_BASE_URL}/properties/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Impossible de récupérer le logement");
  return res.json();
}

async function readAuthError(res, fallbackMessage) {
  try {
    const data = await res.json();
    return data?.error || data?.message || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${AUTH_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new Error(await readAuthError(res, "Adresse email ou mot de passe incorrect"));
  }
  return res.json();
}

export async function registerUser({ name, email, password, role }) {
  const res = await fetch(`${AUTH_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });
  if (!res.ok) {
    throw new Error(await readAuthError(res, "Impossible de créer le compte"));
  }
  return res.json();
}

export async function createProperty(payload, token) {
  const res = await fetch(`${API_BASE_URL}/properties`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(await readAuthError(res, "Impossible de créer le logement"));
  }
  return res.json();
}

export async function uploadImage(file, { purpose, token } = {}) {
  const formData = new FormData();
  formData.append("file", file);
  if (purpose) formData.append("purpose", purpose);

  const res = await fetch(`${API_BASE_URL}/uploads/image`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });
  if (!res.ok) {
    throw new Error(await readAuthError(res, "Impossible d'envoyer l'image"));
  }
  return res.json();
}

export async function updateUserProfile(id, changes, token) {
  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(changes),
  });
  if (!res.ok) {
    throw new Error(await readAuthError(res, "Impossible de mettre à jour le profil"));
  }
  return res.json();
}

export async function deleteProperty(id, token) {
  const res = await fetch(`${API_BASE_URL}/properties/${id}`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok && res.status !== 204) {
    throw new Error(await readAuthError(res, "Impossible de supprimer le logement"));
  }
}
