import React, { useState, useEffect } from 'react';
import { guiDanhGia, layDanhGiaCuaToi } from '../../api/danhGiaApi'; // Import API

const DanhGiaSao = ({ maCongThuc, currentUser, initialAvgRating }) => {
    const [myRating, setMyRating] = useState(0);         // Sao của tôi
    const [avgRating, setAvgRating] = useState(initialAvgRating || 0); // Sao trung bình
    const [hover, setHover] = useState(0);               // Hiệu ứng rê chuột

    // 1. Load đánh giá cũ của user (nếu đã đăng nhập)
    useEffect(() => {
        // Trâm thêm: Reset lại các giá trị về mặc định khi chuyển món ăn
    setMyRating(0); 
    setAvgRating(initialAvgRating || 0);
        if (currentUser) {
            const fetchMyRating = async () => {
                try {
                    const res = await layDanhGiaCuaToi(maCongThuc);
                    if (res.rated) {
                        setMyRating(res.so_sao);
                    }
                } catch (error) {
                    console.error("Lỗi lấy đánh giá cũ", error);
                }
            };
            fetchMyRating();
        }
    }, [maCongThuc, currentUser, initialAvgRating]);

    // 2. LẮNG NGHE REALTIME (Pusher / Laravel Echo)
    useEffect(() => {
        if (window.Echo) {
            // Lắng nghe kênh: cong-thuc.{id}
            const channel = window.Echo.channel(`cong-thuc.${maCongThuc}`);

            channel.listen('.rating.updated', (event) => {
                console.log("Realtime: Sao TB mới là", event.trungBinhSao);
                // Cập nhật ngay số sao trung bình cho mọi người cùng xem
                setAvgRating(event.trungBinhSao);
            });

            return () => {
                channel.stopListening('.rating.updated');
            };
        }
    }, [maCongThuc]);

    // 3. Xử lý khi bấm vào ngôi sao
    const handleRate = async (star) => {
        if (!currentUser) {
            alert("Vui lòng đăng nhập để đánh giá!");
            return;
        }
        // Trâm sửa: Chỉ xác nhận nếu đã có đánh giá cũ (myRating > 0)
         if (myRating > 0) {
        const confirmChange = window.confirm(`Bạn muốn thay đổi đánh giá từ ${myRating} sao thành ${star} sao?`);
        if (!confirmChange) return; // Nếu chọn Cancel thì dừng lại, không sửa nữa
    }
        // Lưu lại giá trị cũ để rollback nếu gặp lỗi API
        const previousRating = myRating;
        // Optimistic UI: Hiện luôn cho mượt
        setMyRating(star);

        try {
            const res = await guiDanhGia(maCongThuc, star);
            if (res.success) {
                // Cập nhật lại số trung bình mới nhất từ phản hồi của server (nếu muốn chính xác tuyệt đối)
                setAvgRating(res.data.trung_binh_moi);
                alert("Cảm ơn bạn đã đánh giá!");
            }
        } catch (error) {
            alert("Lỗi kết nối!");
            setMyRating(previousRating); // Rollback nếu lỗi
        }
    };

    return (
        <div className="rating-box" style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
            {/* Hiển thị số sao trung bình to đùng */}
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffc107' }}>
                {avgRating} <span style={{ fontSize: '1rem', color: '#333' }}>/ 5</span>
            </div>
            <p style={{ margin: '5px 0', color: '#666' }}>Sao trung bình</p>

            {/* Dãy 5 ngôi sao để bấm */}
            <div className="stars-input" style={{ marginTop: '10px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        style={{
                            fontSize: '30px',
                            cursor: 'pointer',
                            transition: 'color 0.2s',
                            // Logic màu: Nếu sao này nhỏ hơn hoặc bằng (sao đang rê chuột HOẶC sao đã chọn) thì vàng, ko thì xám
                            color: star <= (hover || myRating) ? '#ffc107' : '#e4e5e9'
                        }}
                        onClick={() => handleRate(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                    >
                        ★
                    </span>
                ))}
            </div>
            <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>
                {myRating > 0 ? `Bạn đã đánh giá ${myRating} sao.` : "Chạm vào sao để đánh giá"}
            </p>
        </div>
    );
};

export default DanhGiaSao;