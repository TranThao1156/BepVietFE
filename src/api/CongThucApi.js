const API_URL = "http://127.0.0.1:8000/api";

export async function themCongThuc(data) {
  const response = await fetch(`${API_URL}/cong-thuc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
      // nếu có login:
      // "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
}
