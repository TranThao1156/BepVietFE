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

// Trâm-đã thêm: Hàm tìm kiếm công thức (Gọi API /tim-kiem)
export async function timKiemCongThuc(params) {
  // params là object chứa: { page, sort, keyword... }
  // Chuyển object thành chuỗi query URL (vd: ?keyword=ga&sort=newest&page=1)
  const queryString = new URLSearchParams(params).toString();

  const response = await fetch(`${API_URL}/tim-kiem?${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
}