const API_BASE = "http://localhost:5000/api";

export async function getProducts() {
  const res = await fetch(`${API_BASE}/products`);
  return await res.json();
}

