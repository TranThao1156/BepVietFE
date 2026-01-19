// File: src/api/doimatkhauApi.js

export const changePassword = async (data) => {
  const token = localStorage.getItem("token");

  // 1. Kiểm tra đăng nhập
  if (!token) {
    throw new Error("Bạn chưa đăng nhập!");
  }

  // 2. Gọi API (QUAN TRỌNG: Phải có http://localhost)
  // Sửa dòng này lại cho đúng:
  const res = await fetch("http://localhost:8000/api/user/doi-mat-khau", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${token}` // Gửi kèm token
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw result;
  }

  return result;
};