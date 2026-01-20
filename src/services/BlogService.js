// const API_URL = "http://127.0.0.1:8000/api";
// // Thi - 17/01/2026 - lập service để gọi API từ BE
// // Lấy danh sách blog mới nhất (6 món mới nhất)
// export const layDSCongThucMoiNhat = async () => {
//   try {
//     const response = await fetch(`${API_URL}/cong-thuc/mon-moi`);
//     if (!response.ok) {
//       throw new Error("Lỗi khi lấy danh sách công thức");
//     }   
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Lỗi khi lấy danh sách công thức:", error);
//     throw error;
//   } 
// };