const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

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
