// File: src/api/binhLuanBlogApi.js

const BASE_URL = "http://127.0.0.1:8000/api/user";

// Hàm lấy token từ LocalStorage để xác thực
const getHeaders = () => {
    const token = localStorage.getItem("token"); 
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
    };
};

// 1. Thêm bình luận Blog
export const addBlogComment = async (maBlog, noiDung) => {
    // Gọi đúng đường dẫn Backend đã quy ước
    const response = await fetch(`${BASE_URL}/binh-luan-blog`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            Ma_Blog: maBlog,
            NoiDungBL: noiDung // ⚠️ Key này phải khớp với database (NoiDungBL)
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