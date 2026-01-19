// // import axios from "axios";
// const API_URL = "http://127.0.0.1:8000/api";
// // 17/01/2026 - Thi - lập service để gọi API từ BE
// // Lấy danh sách công thức mới nhất (4 món mới nhất)
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

//     // Lấy danh sách công thức được xem nhiều nhất (4 món nổi bật)
// export const layDSCongThucNoiBat = async () => {
//   try {
//     const response = await fetch(`${API_URL}/cong-thuc/mon-noi-bat`);

//     if (!response.ok) {
//       throw new Error("Lỗi khi lấy danh sách công thức nổi bật");
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Lỗi khi lấy danh sách công thức:", error);
//     throw error;
//   }
// };

//  // Hiển thị 1 công thức nổi bật theo vùng miền
 
// export const layCongThucNoiBatTheoVungMien = async (mien) => {
//   try {
//     const response = await fetch(
//       `${API_URL}/cong-thuc-noi-bat/${mien}`
//     );

//     if (!response.ok) {
//       throw new Error("Lỗi khi lấy công thức nổi bật theo vùng miền");
//     }

//     return await response.json();
//   } catch (error) {
//     console.error(
//       "Lỗi khi lấy công thức nổi bật theo vùng miền:",
//       error
//     );
//     throw error;
//   }
// };
