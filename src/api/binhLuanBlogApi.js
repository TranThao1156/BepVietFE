// File: src/api/binhLuanBlogApi.js
const BASE_URL_PUBLIC = "http://127.0.0.1:8000/api"; // Không có /user
const BASE_URL = "http://127.0.0.1:8000/api/user"; // Có /user cho Thêm/Sửa/Xóa

const getHeaders = () => {
    // Trâm - đã sửa: đồng bộ key token (ưu tiên access_token, fallback token)
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
    };
};

// 1. Thêm bình luận Blog (Phiên bản duy nhất - Hỗ trợ cả mới và trả lời)
export const addBlogComment = async (maBlog, noiDung, parentId = null) => {
    const response = await fetch(`${BASE_URL}/binh-luan-blog`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            Ma_Blog: maBlog,
            NoiDungBL: noiDung,
            Parent_ID: parentId // Khớp với BinhLuanBlogService đã sửa
        })
    });
    return response.json();
};

// 2. Sửa bình luận
export const updateComment = async (id, noiDung) => {
    const response = await fetch(`${BASE_URL}/binh-luan-blog/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ NoiDungBL: noiDung })
    });
    return response.json();
};

// 3. Xóa bình luận
export const deleteComment = async (id) => {
    const response = await fetch(`${BASE_URL}/binh-luan-blog/${id}`, {
        method: "DELETE",
        headers: getHeaders()
    });
    return response.json();
};

// 4. Lấy danh sách bình luận (SỬA LẠI URL Ở ĐÂY)
export const getBlogComments = async (maBlog) => {
    const response = await fetch(`${BASE_URL_PUBLIC}/binh-luan-blog/${maBlog}`, {
        method: "GET", // Khớp với Route::get trong api.php
        headers: { "Content-Type": "application/json" } // Không cần token để xem công khai
    });
    return response.json();

};