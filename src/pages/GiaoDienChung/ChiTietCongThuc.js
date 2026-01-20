// Trâm - đã sửa: gộp import React (tránh import trùng gây lỗi)
import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DanhGiaSao from '../NguoiDung/DanhGiaSao'; // Trâm - import DanhGiaSao

const ChitietCongthuc = () => {
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const [showModalCookbook, setShowModalCookbook] = useState(false); // Ẩn/Hiện modal
  const [myCookbooks, setMyCookbooks] = useState([]); // Danh sách cookbook tải về
  const [selectedCookbookId, setSelectedCookbookId] = useState("");

  const API_URL = "http://127.0.0.1:8000";

  // Trâm - đã sửa: thêm hàm fetchRecipeDetail để dùng lại khi cần reload (vd: sau khi đánh giá sao)
  const fetchRecipeDetail = useCallback(async () => {
    setLoading(true);

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    try {
      const res = await fetch(`${API_URL}/api/cong-thuc/${id}`, {
        credentials: "include",
        method: "GET",
        headers,
      });
      const json = await res.json();
      setRecipe(json?.data ?? null);
    } catch (err) {
      console.error(err);
      setRecipe(null);
    } finally {
      setLoading(false);
    }
  }, [id]);
  // Khôi---------------------------------
  const handleOpenCookbookModal = async () => {
    // Kiểm tra đăng nhập
    if (!currentUser) {
      alert("Vui lòng đăng nhập để sử dụng tính năng này!");
      return;
    }
    setShowModalCookbook(true)

    const token = localStorage.getItem('access_token');

    try {
      const res = await fetch(`${API_URL}/api/user/cookbooks/cua-toi`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",

          "Authorization": `Bearer ${token}`
        },
        credentials: "include"
      });
      const data = await res.json();
      if (data.success) {
        setMyCookbooks(data.data);
        // Mặc định chọn cái đầu tiên nếu có
        if (data.data.length > 0) {
          setSelectedCookbookId(data.data[0].Ma_CookBook);
        }
      }
    } catch (error) {
      console.error("Lỗi lấy cookbook:", error);
    }
  };
  const handleSubmitAddToCookbook = async () => {
    if (!selectedCookbookId) {
      alert("Vui lòng chọn một Cookbook!");
      return;
    }
    const token = localStorage.getItem('access_token');

    try {
      const res = await fetch(`${API_URL}/api/user/cookbooks/them-mon`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          // --- THÊM DÒNG NÀY ---
          "Authorization": `Bearer ${token}`
        },
        credentials: "include",
        body: JSON.stringify({
          Ma_CookBook: selectedCookbookId,
          Ma_CT: id
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert(data.message); // "Đã thêm thành công!"
        setShowModalCookbook(false); // Đóng modal
      } else {
        alert(data.message || "Có lỗi xảy ra.");
      }

    } catch (error) {
      console.error("Lỗi lưu cookbook:", error);
      alert("Lỗi kết nối server");
    }
  };
  // -------------------------
  useEffect(() => {
    //  Trâm - THÊM ĐOẠN NÀY: Lấy user từ localStorage khi mới vào trang
    const userStr = localStorage.getItem("user"); // Hoặc key mà bạn dùng lưu user
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Lỗi parse user", e);
      }
    }
    // hết phần của Trâm
    fetchRecipeDetail();
  }, [fetchRecipeDetail]);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (!recipe) return <p>Không tìm thấy công thức</p>;

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
                      : "https://i.pravatar.cc/150"
                  }
                  alt={recipe.nguoidung?.HoTen}
                />
                <div>
                  <span className="author-name">
                    {recipe.nguoidung?.HoTen || "Ẩn danh"}
                  </span>
                  <span className="post-date">
                    Lượt xem: {recipe.SoLuotXem}
                  </span>
                </div>
              </div>
            </div>

            <div className="recipe-hero-img">
              <img
                src={`${API_URL}/storage/img/CongThuc/${recipe.HinhAnh}`}
                alt={recipe.TenMon}
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
            {/* NGUYÊN LIỆU */}
            <aside className="recipe-left-sidebar">
              <div className="ingredients-box">
                <h3>Nguyên liệu</h3>
                <ul className="ingredients-list">
                  {/* Trâm - đã sửa: null-safe để tránh lỗi khi API chưa trả mảng */}
                  {(recipe.nguyen_lieu ?? []).map((item) => (
                    <li key={item.Ma_NL}>
                      <i className="fa-solid fa-check"></i>
                      {item.pivot.DinhLuong} {item.DonViDo} {item.TenNguyenLieu}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Khôi Lưu vào cookbookk */}
              <button className="btn-save-cookbook" onClick={handleOpenCookbookModal}>
                <i className="fa-regular fa-bookmark"></i> Lưu vào Cookbook
              </button>
            </aside>
            {showModalCookbook && (
              <div className="modal-overlay">
                <div className="modal-box">
                  <h3 className="modal-title">Chọn Cookbook để lưu</h3>

                  {myCookbooks.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#666' }}>
                      Bạn chưa có Cookbook nào. <br />Hãy tạo mới trong trang cá nhân.
                    </p>
                  ) : (
                    <div className="modal-body">
                      <label className="modal-label">Chọn bộ sưu tập:</label>
                      <select
                        className="modal-select"
                        value={selectedCookbookId}
                        onChange={(e) => setSelectedCookbookId(e.target.value)}
                      >
                        {myCookbooks.map(cb => (
                          <option key={cb.Ma_CookBook} value={cb.Ma_CookBook}>
                            {cb.TenCookBook} ({cb.congthucs_count || 0} món)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="modal-actions">
                    <button
                      className="modal-btn btn-cancel"
                      onClick={() => setShowModalCookbook(false)}
                    >
                      Hủy
                    </button>
                    {myCookbooks.length > 0 && (
                      <button
                        className="modal-btn btn-confirm"
                        onClick={handleSubmitAddToCookbook}
                      >
                        Lưu ngay
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* CÁC BƯỚC */}
            {/* CÁC BƯỚC THỰC HIỆN */}
            <div className="main-instructions">
              <h2>Hướng dẫn thực hiện</h2>
              <div className="steps-container">
                {/* Trâm - đã sửa: null-safe để tránh lỗi khi API chưa trả mảng */}
                {(recipe.buoc_thuc_hien ?? []).map((step) => (
                  <div className="step-item" key={step.Ma_BTH}>
                    <div className="step-number">{step.STT}</div>
                    <div className="step-content">
                      <p>{step.NoiDung}</p>

                      {/* SỬA PHẦN HIỂN THỊ ẢNH Ở ĐÂY */}
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
                          {/* 1. Tách chuỗi ảnh thành mảng bằng dấu chấm phẩy ; */}
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
                                  maxWidth: "200px", // Giới hạn kích thước ảnh cho đẹp
                                  height: "auto",
                                  borderRadius: "8px",
                                  objectFit: "cover",
                                }}
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

          {/*Trâm - ĐÁNH GIÁ */}
          <div className="comments-section" style={{ marginTop: '40px' }}>
            <h3 className="section-title">Đánh giá & Bình luận</h3>

            {/* 1. GỌI COMPONENT ĐÁNH GIÁ SAO VÀO ĐÂY */}
            <div style={{ marginBottom: '20px' }}>
              {/* Truyền dữ liệu vào component của Trâm */}
              <div style={{ marginBottom: '20px' }}>
                <DanhGiaSao
                  maCongThuc={id}
                  currentUser={currentUser}
                  initialAvgRating={recipe.TrungBinhSao || 0}
                  initialReviews={recipe.danh_gia ?? []} // Danh sách đánh giá lấy từ API show
                  onRatingSuccess={fetchRecipeDetail} // Truyền hàm để tải lại khi có đánh giá mới

                />
              </div>
            </div>


            <textarea
              className="review-textarea-clean"
              placeholder="Chia sẻ cảm nhận của bạn..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            ></textarea>

            <button className="btn-submit-review">Gửi bình luận</button>
          </div>
        </main>
      </div>

      {/* SIDEBAR PHẢI */}
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
                  />
                </Link>
                <div>
                  <Link to={`/cong-thuc/${item.Ma_CT}`}>{item.TenMon}</Link>
                </div>
              </article>
            ))
          ) : (
            <p>Không có món liên quan</p>
          )}
        </div>
      </aside>
    </div>
  );
};

export default ChitietCongthuc;
