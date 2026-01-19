// import React, { useEffect, useState, useRef } from "react";
// import { Link, useParams } from "react-router-dom";

// const ChitietCongthuc = () => {
//   const { id } = useParams();

//   const [recipe, setRecipe] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [userRating, setUserRating] = useState(0);
//   const [hoverStar, setHoverStar] = useState(0);
//   const [commentContent, setCommentContent] = useState("");

//   useEffect(() => {
//     fetch(`http://127.0.0.1:8000/api/cong-thuc/${id}`, {
//       credentials: "include",
//     })
//       .then((res) => res.json())
//       .then((res) => {
//         setRecipe(res.data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         setLoading(false);
//       });
//   }, [id]);

//   if (loading) return <p>Đang tải dữ liệu...</p>;
//   if (!recipe) return <p>Không tìm thấy công thức</p>;

//   return (
//     <div className="recipe-bottom-layout">
//       {/* CỘT TRÁI */}
//       <div className="recipe-main">
//         <main className="container recipe-container">
//           <div className="recipe-header">
//             <h1 className="recipe-title">{recipe.TenMon}</h1>
//             <p className="recipe-desc">{recipe.MoTa}</p>

//             <div className="recipe-meta-top">
//               <div className="author-info">
//                 <img
//                   src={
//                     recipe.nguoidung?.AnhDaiDien
//                       ? `http://127.0.0.1:8000/storage/img/NguoiDung/${recipe.nguoidung.AnhDaiDien}`
//                       : "https://i.pravatar.cc/150"
//                   }
//                   alt={recipe.nguoidung?.HoTen}
//                 />
//                 <div>
//                   <span className="author-name">
//                     {recipe.nguoidung?.HoTen || "Ẩn danh"}
//                   </span>
//                   <span className="post-date">
//                     Lượt xem: {recipe.SoLuotXem}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="recipe-hero-img">
//               <img
//                 src={`http://127.0.0.1:8000/storage/img/CongThuc/${recipe.HinhAnh}`}
//                 alt={recipe.TenMon}
//               />
//             </div>

//             <div className="recipe-quick-info">
//               <div className="info-item">
//                 <i className="fa-solid fa-fire-burner"></i>
//                 <div>
//                   <span>Thời gian nấu</span>
//                   <strong>{recipe.ThoiGianNau} phút</strong>
//                 </div>
//               </div>
//               <div className="info-item">
//                 <i className="fa-solid fa-chart-simple"></i>
//                 <div>
//                   <span>Độ khó</span>
//                   <strong>{recipe.DoKho}</strong>
//                 </div>
//               </div>
//               <div className="info-item">
//                 <i className="fa-solid fa-user-group"></i>
//                 <div>
//                   <span>Khẩu phần</span>
//                   <strong>{recipe.KhauPhan} người</strong>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="recipe-content-grid">
//             {/* NGUYÊN LIỆU */}
//             <aside className="recipe-left-sidebar">
//               <div className="ingredients-box">
//                 <h3>Nguyên liệu</h3>
//                 <ul className="ingredients-list">
//                   {recipe.nguyen_lieu.map((item) => (
//                     <li key={item.Ma_NL}>
//                       <i className="fa-solid fa-check"></i>
//                       {item.pivot.DinhLuong} {item.DonViDo} {item.TenNguyenLieu}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </aside>

//             {/* CÁC BƯỚC */}
//             {/* CÁC BƯỚC THỰC HIỆN */}
//             <div className="main-instructions">
//               <h2>Hướng dẫn thực hiện</h2>
//               <div className="steps-container">
//                 {recipe.buoc_thuc_hien.map((step) => (
//                   <div className="step-item" key={step.Ma_BTH}>
//                     <div className="step-number">{step.STT}</div>
//                     <div className="step-content">
//                       <p>{step.NoiDung}</p>

//                       {/* SỬA PHẦN HIỂN THỊ ẢNH Ở ĐÂY */}
//                       {step.HinhAnh && (
//                         <div
//                           className="step-images-grid"
//                           style={{
//                             display: "flex",
//                             gap: "10px",
//                             flexWrap: "wrap",
//                             marginTop: "10px",
//                           }}
//                         >
//                           {/* 1. Tách chuỗi ảnh thành mảng bằng dấu chấm phẩy ; */}
//                           {step.HinhAnh.split(";").map((imgName, index) => (
//                             <img
//                               key={index}
//                               className="step-img"
//                               src={`http://127.0.0.1:8000/storage/img/BuocThucHien/${imgName}`}
//                               alt={`Bước ${step.STT} - Ảnh ${index + 1}`}
//                               style={{
//                                 maxWidth: "200px", // Giới hạn kích thước ảnh cho đẹp
//                                 height: "auto",
//                                 borderRadius: "8px",
//                                 objectFit: "cover",
//                               }}
//                             />
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* ĐÁNH GIÁ */}
//           <div className="comments-section">
//             <h3 className="section-title">Đánh giá</h3>

//             <div className="rating-row">
//               <span>Đánh giá của bạn:</span>
//               <div className="stars-select">
//                 {[...Array(5)].map((_, index) => {
//                   const value = index + 1;
//                   return (
//                     <i
//                       key={index}
//                       className="fa-solid fa-star"
//                       style={{
//                         cursor: "pointer",
//                         color:
//                           value <= (hoverStar || userRating)
//                             ? "#ffc107"
//                             : "#e4e5e9",
//                       }}
//                       onClick={() => setUserRating(value)}
//                       onMouseEnter={() => setHoverStar(value)}
//                       onMouseLeave={() => setHoverStar(0)}
//                     ></i>
//                   );
//                 })}
//               </div>
//             </div>

//             <textarea
//               className="review-textarea-clean"
//               placeholder="Chia sẻ cảm nhận của bạn..."
//               value={commentContent}
//               onChange={(e) => setCommentContent(e.target.value)}
//             ></textarea>

//             <button className="btn-submit-review">Gửi bình luận</button>
//           </div>
//         </main>
//       </div>

//       {/* SIDEBAR PHẢI */}
//       <aside className="recipe-right-sidebar">
//         <h3 className="sidebar-title">Món liên quan</h3>

//         <div className="related-list">
//           {recipe.mon_lien_quan?.length > 0 ? (
//             recipe.mon_lien_quan.map((item) => (
//               <article className="related-item" key={item.Ma_CT}>
//                 <Link to={`/cong-thuc/${item.Ma_CT}`}>
//                   <img
//                     src={`http://127.0.0.1:8000/storage/img/CongThuc/${item.HinhAnh}`}
//                     alt={item.TenMon}
//                   />
//                 </Link>
//                 <div>
//                   <Link to={`/cong-thuc/${item.Ma_CT}`}>{item.TenMon}</Link>
//                 </div>
//               </article>
//             ))
//           ) : (
//             <p>Không có món liên quan</p>
//           )}
//         </div>
//       </aside>
//     </div>
//   );
// };

// export default ChitietCongthuc;
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const ChitietCongthuc = () => {
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  // State cho bình luận
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  
  // State đánh giá (UI)
  const [userRating, setUserRating] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);

  // --- 1. Lấy chi tiết công thức (Công khai - Không cần Token) ---
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/cong-thuc/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setRecipe(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    // Gọi hàm lấy bình luận
    fetchComments();
  }, [id]);

  // --- 2. Hàm lấy danh sách bình luận (SỬA LẠI ĐỂ KHỚP VỚI BACKEND BẢO MẬT) ---
  const fetchComments = () => {
    // Vì route nằm trong nhóm 'auth:sanctum' và prefix 'user', nên cần Token
    const token = localStorage.getItem("access_token");

    // Nếu không có token (chưa đăng nhập), thì không gọi API này để tránh lỗi 401
    if (!token) {
        console.log("Khách chưa đăng nhập -> Không tải bình luận.");
        return; 
    }

    // Thêm /user vào URL và thêm Header Authorization
    fetch(`http://127.0.0.1:8000/api/user/cong-thuc/${id}/binh-luan`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Quan trọng!
        }
    })
      .then((res) => {
        if (!res.ok) {
            // Nếu Token hết hạn hoặc lỗi 401
            if (res.status === 401) {
                console.log("Token hết hạn hoặc không hợp lệ");
                return null;
            }
            throw new Error("Lỗi kết nối");
        }
        return res.json();
      })
      .then((res) => {
        if (res && res.data) {
          setComments(res.data);
        }
      })
      .catch((err) => console.error("Lỗi lấy bình luận:", err));
  };

  // --- 3. Hàm gửi bình luận (Đã có Auth) ---
  const handlePostComment = () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Bạn cần đăng nhập để bình luận!");
      return;
    }

    if (!commentContent.trim()) {
      alert("Vui lòng nhập nội dung bình luận.");
      return;
    }

    const payload = {
      Ma_CT: id,
      NoiDungBL: commentContent,
    };

    fetch("http://127.0.0.1:8000/api/user/binh-luan/them", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === true || res.message?.includes("thành công")) {
          alert("Gửi bình luận thành công!");
          setCommentContent(""); 
          fetchComments(); // Load lại danh sách sau khi gửi
        } else {
          alert(res.message || "Có lỗi xảy ra.");
        }
      })
      .catch((err) => {
        console.error("Lỗi gửi bình luận:", err);
        alert("Lỗi kết nối server.");
      });
  };

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
                 <div><span>Thời gian nấu</span><strong>{recipe.ThoiGianNau} phút</strong></div>
              </div>
              <div className="info-item">
                 <i className="fa-solid fa-chart-simple"></i>
                 <div><span>Độ khó</span><strong>{recipe.DoKho}</strong></div>
              </div>
              <div className="info-item">
                 <i className="fa-solid fa-user-group"></i>
                 <div><span>Khẩu phần</span><strong>{recipe.KhauPhan} người</strong></div>
              </div>
            </div>
          </div>

          <div className="recipe-content-grid">
            {/* NGUYÊN LIỆU */}
            <aside className="recipe-left-sidebar">
              <div className="ingredients-box">
                <h3>Nguyên liệu</h3>
                <ul className="ingredients-list">
                  {recipe.nguyen_lieu && recipe.nguyen_lieu.map((item) => (
                    <li key={item.Ma_NL}>
                      <i className="fa-solid fa-check"></i>
                      {item.pivot.DinhLuong} {item.DonViDo} {item.TenNguyenLieu}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* HƯỚNG DẪN THỰC HIỆN */}
            <div className="main-instructions">
              <h2>Hướng dẫn thực hiện</h2>
              <div className="steps-container">
                {recipe.buoc_thuc_hien && recipe.buoc_thuc_hien.map((step) => (
                  <div className="step-item" key={step.Ma_BTH}>
                    <div className="step-number">{step.STT}</div>
                    <div className="step-content">
                      <p>{step.NoiDung}</p>
                      {step.HinhAnh && (
                        <div
                          className="step-images-grid"
                          style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}
                        >
                          {step.HinhAnh.split(";").map((imgName, index) => (
                            <img
                              key={index}
                              className="step-img"
                              src={`http://127.0.0.1:8000/storage/img/BuocThucHien/${imgName}`}
                              alt={`Bước ${step.STT}`}
                              style={{ maxWidth: "200px", borderRadius: "8px", objectFit: "cover" }}
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

          {/* --- PHẦN BÌNH LUẬN & ĐÁNH GIÁ --- */}
          <div className="comments-section" style={{ marginTop: "40px" }}>
            <h3 className="section-title">Bình luận & Đánh giá</h3>

            {/* Form nhập bình luận */}
            <div className="comment-form-box" style={{ background: "#f9f9f9", padding: "20px", borderRadius: "8px", marginBottom: "30px" }}>
                <div className="rating-row" style={{ marginBottom: "15px" }}>
                <span>Đánh giá món ăn: </span>
                <div className="stars-select" style={{ display: "inline-block", marginLeft: "10px" }}>
                    {[...Array(5)].map((_, index) => {
                    const value = index + 1;
                    return (
                        <i
                        key={index}
                        className="fa-solid fa-star"
                        style={{
                            cursor: "pointer",
                            fontSize: "1.2rem",
                            color: value <= (hoverStar || userRating) ? "#ffc107" : "#e4e5e9",
                            marginRight: "5px"
                        }}
                        onClick={() => setUserRating(value)}
                        onMouseEnter={() => setHoverStar(value)}
                        onMouseLeave={() => setHoverStar(0)}
                        ></i>
                    );
                    })}
                </div>
                </div>

                <textarea
                className="review-textarea-clean"
                placeholder="Chia sẻ cảm nhận của bạn về món ăn này..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", minHeight: "100px" }}
                ></textarea>

                <button 
                    className="btn-submit-review" 
                    onClick={handlePostComment}
                    style={{ marginTop: "10px", padding: "10px 20px", background: "#ff642f", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
                >
                Gửi bình luận
                </button>
            </div>

            {/* Danh sách bình luận */}
            <div className="comments-list">
                {!localStorage.getItem("access_token") ? (
                    <p style={{ color: "#d9534f", textAlign: "center", padding: "20px", background: "#fff", border: "1px dashed #d9534f" }}>
                        Vui lòng <Link to="/login" style={{fontWeight:"bold", textDecoration:"underline"}}>đăng nhập</Link> để xem bình luận.
                    </p>
                ) : comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.Ma_BL} className="comment-item" style={{ display: "flex", gap: "15px", marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "15px" }}>
                            <img 
                                src={comment.nguoi_dung?.AnhDaiDien 
                                    ? `http://127.0.0.1:8000/storage/img/NguoiDung/${comment.nguoi_dung.AnhDaiDien}` 
                                    : "https://i.pravatar.cc/150"} 
                                alt={comment.nguoi_dung?.HoTen}
                                style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }}
                            />
                            <div className="comment-body">
                                <div className="comment-meta" style={{ marginBottom: "5px" }}>
                                    <strong style={{ fontSize: "1.1rem", marginRight: "10px" }}>
                                        {comment.nguoi_dung?.HoTen || "Người dùng ẩn danh"}
                                    </strong>
                                    <span style={{ color: "#888", fontSize: "0.9rem" }}>
                                        {comment.created_at ? new Date(comment.created_at).toLocaleDateString("vi-VN") : ""}
                                    </span>
                                </div>
                                <p className="comment-content" style={{ margin: 0, color: "#333", lineHeight: "1.5" }}>
                                    {comment.NoiDungBL}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ color: "#777", fontStyle: "italic" }}>Chưa có bình luận nào.</p>
                )}
            </div>

          </div>
        </main>
      </div>

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