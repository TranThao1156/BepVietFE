import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DanhGiaSao from '../NguoiDung/DanhGiaSao'; // Import component Đánh giá

const ChitietCongthuc = () => {
  const { idSlug } = useParams();
  
  // 1. Tách ID từ URL ngay đầu component để dùng chung cho toàn bộ file
  const currentId = idSlug ? parseInt(idSlug.split("-")[0]) : null;

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [commentContent, setCommentContent] = useState("");

  const API_URL = "http://127.0.0.1:8000";

  // 2. Hàm lấy chi tiết công thức (Dùng useCallback để không bị tạo lại mỗi lần render)
  const fetchRecipeDetail = useCallback(async () => {
    if (!currentId) return; // Nếu không có ID thì không gọi API

    setLoading(true);
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    try {
      const res = await fetch(`${API_URL}/api/cong-thuc/${currentId}`, {
        credentials: "include", // Quan trọng nếu dùng Sanctum cookie
        method: "GET",
        headers,
      });
      const json = await res.json();
      setRecipe(json?.data ?? null);
    } catch (err) {
      console.error("Lỗi tải công thức:", err);
      setRecipe(null);
    } finally {
      setLoading(false);
    }
  }, [currentId]); // Chỉ tạo lại hàm này khi currentId thay đổi

  // 3. Hàm lưu cookbook
  const handleSaveCookbook = () => {
    // Gọi API lưu cookbook ở đây
    console.log("Lưu công thức:", recipe?.Ma_CT);
    alert("Đã lưu công thức vào Cookbook của bạn!");
  };

  // 4. useEffect: Lấy thông tin User (Chạy 1 lần khi mount)
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Lỗi parse user", e);
      }
    }
  }, []);

  // 5. useEffect: Lấy dữ liệu công thức (Chạy khi ID thay đổi)
  useEffect(() => {
    fetchRecipeDetail();
  }, [fetchRecipeDetail]);

  // --- RENDER ---
  if (loading) return <p style={{ textAlign: "center", padding: "20px" }}>Đang tải dữ liệu...</p>;
  if (!recipe) return <p style={{ textAlign: "center", padding: "20px" }}>Không tìm thấy công thức.</p>;

  return (
    <div className="recipe-bottom-layout">
      {/* CỘT TRÁI */}
      <div className="recipe-main">
        <main className="container recipe-container">
          <div className="recipe-header">
            <h1 className="recipe-title">{recipe.TenMon}</h1>
            <p className="recipe-desc">{recipe.MoTa}</p>

            <div className="recipe-meta-top">
              <div className="author-info">
                <img
                  src={
                    recipe.nguoidung?.AnhDaiDien
                      ? `${API_URL}/storage/img/NguoiDung/${recipe.nguoidung.AnhDaiDien}`
                      : "https://ui-avatars.com/api/?name=User&background=random"
                  }
                  alt={recipe.nguoidung?.HoTen}
                  onError={(e) => e.target.src = "https://placehold.co/150"}
                />
                <div>
                  <span className="author-name">
                    {recipe.nguoidung?.HoTen || "Ẩn danh"}
                  </span>
                  <span className="post-date">
                    <i className="fa-solid fa-eye"></i> Lượt xem: {recipe.SoLuotXem}
                  </span>
                </div>
              </div>
            </div>

            <div className="recipe-hero-img">
              <img
                src={`${API_URL}/storage/img/CongThuc/${recipe.HinhAnh}`}
                alt={recipe.TenMon}
                onError={(e) => e.target.src = "https://placehold.co/800x500?text=No+Image"}
              />
            </div>

            <div className="recipe-quick-info">
              <div className="info-item">
                <i className="fa-solid fa-fire-burner"></i>
                <div>
                  <span>Thời gian nấu</span>
                  <strong>{recipe.ThoiGianNau} phút</strong>
                </div>
              </div>
              <div className="info-item">
                <i className="fa-solid fa-chart-simple"></i>
                <div>
                  <span>Độ khó</span>
                  <strong>{recipe.DoKho}</strong>
                </div>
              </div>
              <div className="info-item">
                <i className="fa-solid fa-user-group"></i>
                <div>
                  <span>Khẩu phần</span>
                  <strong>{recipe.KhauPhan} người</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="recipe-content-grid">
            {/* CỘT NGUYÊN LIỆU */}
            <aside className="recipe-left-sidebar">
              <div className="ingredients-box">
                <h3>Nguyên liệu</h3>
                <ul className="ingredients-list">
                  {(recipe.nguyen_lieu ?? []).map((item, index) => (
                    <li key={item.Ma_NL || index}>
                      <i className="fa-solid fa-check"></i>
                      {/* DinhLuong nằm trong pivot */}
                      <strong>{item.pivot?.DinhLuong} {item.DonViDo}</strong> {item.TenNguyenLieu}
                    </li>
                  ))}
                </ul>
              </div>
              <button className="btn-save-cookbook" onClick={handleSaveCookbook}>
                <i className="fa-regular fa-bookmark"></i> Lưu vào Cookbook
              </button>
            </aside>

            {/* CỘT CÁC BƯỚC THỰC HIỆN */}
            <div className="main-instructions">
              <h2>Hướng dẫn thực hiện</h2>
              <div className="steps-container">
                {(recipe.buoc_thuc_hien ?? []).map((step) => (
                  <div className="step-item" key={step.Ma_BTH}>
                    <div className="step-number">{step.STT}</div>
                    <div className="step-content">
                      <p>{step.NoiDung}</p>

                      {/* Xử lý hiển thị ảnh bước (nếu có) */}
                      {step.HinhAnh && (
                        <div
                          className="step-images-grid"
                          style={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap",
                            marginTop: "10px",
                          }}
                        >
                          {step.HinhAnh.split(";")
                            .map((x) => x.trim())
                            .filter(Boolean)
                            .map((imgName, index) => (
                              <img
                                key={index}
                                className="step-img"
                                src={`${API_URL}/storage/img/BuocThucHien/${imgName}`}
                                alt={`Bước ${step.STT} - Ảnh ${index + 1}`}
                                style={{
                                  maxWidth: "150px",
                                  height: "auto",
                                  borderRadius: "8px",
                                  objectFit: "cover",
                                  border: "1px solid #eee"
                                }}
                                onError={(e) => e.target.style.display = 'none'} // Ẩn nếu lỗi
                              />
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PHẦN ĐÁNH GIÁ CỦA TRÂM */}
          <div className="comments-section" style={{ marginTop: '40px' }}>
            <h3 className="section-title">Đánh giá & Bình luận</h3>

            <div style={{ marginBottom: '20px' }}>
              {/* Component DanhGiaSao */}
              <DanhGiaSao
                maCongThuc={currentId} // Truyền ID đã tách
                currentUser={currentUser}
                // Nếu API trả về trường TrungBinhSao thì dùng, ko thì tính toán hoặc để 0
                initialAvgRating={recipe.TrungBinhSao || 0}
                // Danh sách đánh giá lấy từ API chi tiết công thức
                initialReviews={recipe.danh_gia ?? []} 
                // Khi đánh giá thành công, gọi lại API để cập nhật list đánh giá mới
                onRatingSuccess={fetchRecipeDetail} 
              />
            </div>

            <textarea
              className="review-textarea-clean"
              placeholder="Viết bình luận khác (đang phát triển)..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            ></textarea>

            <button className="btn-submit-review">Gửi bình luận</button>
          </div>
        </main>
      </div>

      {/* SIDEBAR PHẢI (Món liên quan) */}
      <aside className="recipe-right-sidebar">
        <h3 className="sidebar-title">Món liên quan</h3>

        <div className="related-list">
          {recipe.mon_lien_quan?.length > 0 ? (
            recipe.mon_lien_quan.map((item) => (
              <article className="related-item" key={item.Ma_CT}>
                <Link to={`/cong-thuc/${item.Ma_CT}`}>
                  <img
                    src={`${API_URL}/storage/img/CongThuc/${item.HinhAnh}`}
                    alt={item.TenMon}
                    onError={(e) => e.target.src = "https://placehold.co/100x100"}
                  />
                </Link>
                <div>
                  <Link to={`/cong-thuc/${item.Ma_CT}`} className="related-title">
                    {item.TenMon}
                  </Link>
                  <span style={{ fontSize: '12px', color: '#666', display: 'block' }}>
                     <i className="fa-solid fa-eye"></i> {item.SoLuotXem}
                  </span>
                </div>
              </article>
            ))
          ) : (
            <p style={{ color: "#777", fontStyle: "italic" }}>Chưa có món liên quan</p>
          )}
        </div>
      </aside>
    </div>
  );
};

export default ChitietCongthuc;