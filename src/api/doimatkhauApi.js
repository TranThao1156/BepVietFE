export const changePassword = async (data) => {
    // 1. Lấy token từ bộ nhớ (lúc đăng nhập bạn lưu tên gì thì điền vào đây)
    const token = localStorage.getItem('token'); 

    // 2. Gọi fetch
    const res = await fetch("http://localhost:8000/api/doi-mat-khau", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Gửi kèm token để server biết ai đang đổi pass
        },
        body: JSON.stringify(data)
    });

    // 3. Trả về kết quả JSON
    return res.json();
};