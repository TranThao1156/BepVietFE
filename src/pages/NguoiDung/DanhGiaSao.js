import React, { useState, useEffect } from 'react';
import { guiDanhGia, layDanhGiaCuaToi } from '../../api/danhGiaApi';

// Thêm prop initialReviews để nhận danh sách người đánh giá từ component cha
const DanhGiaSao = ({ maCongThuc, currentUser, initialAvgRating, initialReviews, onRatingSuccess }) => {
    const [myRating, setMyRating] = useState(0); 
    const [avgRating, setAvgRating] = useState(initialAvgRating || 0); 
    const [hover, setHover] = useState(0); 

    useEffect(() => {
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

    useEffect(() => {
        if (window.Echo) {
            const channel = window.Echo.channel(`cong-thuc.${maCongThuc}`);

            // Thêm dấu chấm trước tên event vì bạn dùng broadcastAs ở Backend
            channel.listen('.rating.updated', (event) => {
                console.log("Realtime: Sao TB mới là", event.trungBinhSao);
                setAvgRating(event.trungBinhSao);
                
                // Nếu muốn danh sách người đánh giá cũng cập nhật realtime, 
                // ta nên gọi callback để component cha fetch lại dữ liệu
                if (onRatingSuccess) onRatingSuccess();
            });

            return () => {
                channel.stopListening('.rating.updated');
            };
        }
    }, [maCongThuc, onRatingSuccess]);

    const handleRate = async (star) => {
        if (!currentUser) {
            alert("Vui lòng đăng nhập để đánh giá!");
            return;
        }

        if (myRating > 0) {
            const confirmChange = window.confirm(`Bạn muốn thay đổi đánh giá từ ${myRating} sao thành ${star} sao?`);
            if (!confirmChange) return;
        }

        const previousRating = myRating;
        setMyRating(star);

        try {
            const res = await guiDanhGia(maCongThuc, star);
            if (res.success) {
                setAvgRating(res.data.trung_binh_moi);
                alert("Đánh giá thành công!");
                
                // Kích hoạt callback để component cha (ChitietCongthuc) load lại danh sách đánh giá
                if (onRatingSuccess) onRatingSuccess();
            }
        } catch (error) {
            alert("Lỗi kết nối!");
            setMyRating(previousRating);
        }
    };

    return (
        <div className="rating-container">
            {/* 1. Hộp hiển thị số sao trung bình và chọn sao */}
            <div className="rating-box" style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffc107' }}>
                    {avgRating} <span style={{ fontSize: '1rem', color: '#333' }}>/ 5</span>
                </div>
                <p style={{ margin: '5px 0', color: '#666' }}>Sao trung bình</p>

                <div className="stars-input" style={{ marginTop: '10px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            style={{
                                fontSize: '30px',
                                cursor: 'pointer',
                                transition: 'color 0.2s',
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

                {/* 2. HIỂN THỊ DANH SÁCH NGƯỜI ĐÁNH GIÁ (Phần mới thêm) */}
                <div className="review-list" style={{ marginTop: '20px', textAlign: 'left', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                    <h5 style={{ fontSize: '1rem', marginBottom: '10px' }}>Người dùng đã đánh giá ({initialReviews?.length || 0})</h5>
                    
                    {initialReviews && initialReviews.length > 0 ? (
                        initialReviews.map((dg) => (
                            <div key={dg.Ma_DG} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <img 
                                    src={dg.nguoidung?.AnhDaiDien 
                                        ? `http://localhost:8000/storage/img/NguoiDung/${dg.nguoidung.AnhDaiDien}` 
                                        : "https://via.placeholder.com/35"} 
                                    style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover' }}
                                    alt="avatar"
                                />
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                                        {dg.nguoidung?.HoTen || "Người dùng ẩn danh"}
                                        <span style={{ color: '#ffc107', marginLeft: '8px' }}>
                                            {dg.SoSao} <i className="fa-solid fa-star" style={{ fontSize: '12px' }}></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ fontSize: '13px', color: '#999', fontStyle: 'italic' }}>Chưa có lượt đánh giá nào.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DanhGiaSao;