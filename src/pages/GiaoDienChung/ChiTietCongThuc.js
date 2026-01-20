import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DanhGiaSao from '../NguoiDung/DanhGiaSao'; // Trâm - import DanhGiaSao

const ChitietCongthuc = () => {
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState(null);
  const [commentContent, setCommentContent] = useState("");

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

    fetch(`http://127.0.0.1:8000/api/cong-thuc/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        setRecipe(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

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
                      ? `http://127.0.0.1:8000/storage/img/NguoiDung/${recipe.nguoidung.AnhDaiDien}`
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
                src={`http://127.0.0.1:8000/storage/img/CongThuc/${recipe.HinhAnh}`}
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
                  {recipe.nguyen_lieu.map((item) => (
                    <li key={item.Ma_NL}>
                      <i className="fa-solid fa-check"></i>
                      {item.pivot.DinhLuong} {item.DonViDo} {item.TenNguyenLieu}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* CÁC BƯỚC */}
            {/* CÁC BƯỚC THỰC HIỆN */}
            <div className="main-instructions">
              <h2>Hướng dẫn thực hiện</h2>
              <div className="steps-container">
                {recipe.buoc_thuc_hien.map((step) => (
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
                          {step.HinhAnh.split(";").map((imgName, index) => (
                            <img
                              key={index}
                              className="step-img"
                              src={`http://127.0.0.1:8000/storage/img/BuocThucHien/${imgName}`}
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
                        // Lấy TrungBinhSao từ API trả về, nếu chưa có thì hiện 0
                        initialAvgRating={recipe.TrungBinhSao || 0} 
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
                    src={`http://127.0.0.1:8000/storage/img/CongThuc/${item.HinhAnh}`}
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
