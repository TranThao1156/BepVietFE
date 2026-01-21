// src/api/danhGiaApi.js

const BASE_URL = "http://127.0.0.1:8000/api/user";

const getHeaders = () => {
    // Trâm - đã sửa: hỗ trợ cả key cũ (access_token) và key mới (token)
    const token = localStorage.getItem("token") || localStorage.getItem("access_token") || localStorage.getItem("user_token");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
};

// 1. Gửi đánh giá (Backend tự hiểu là Thêm mới hay Sửa)
export const guiDanhGia = async (maCongThuc, soSao) => {
    const response = await fetch(`${BASE_URL}/danh-gia`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            Ma_CT: maCongThuc,
            SoSao: soSao
        })
    });
    return response.json();
};

// 2. Lấy số sao mình đã đánh giá trước đó (để tô màu vàng sẵn)
// src/api/danhGiaApi.js
export const layDanhGiaCuaToi = async (maCongThuc) => {
    // Thêm /cua-toi vào URL
    const response = await fetch(`${BASE_URL}/danh-gia/cua-toi/${maCongThuc}`, {
        method: "GET",
        headers: getHeaders()
    });
    return response.json();
};