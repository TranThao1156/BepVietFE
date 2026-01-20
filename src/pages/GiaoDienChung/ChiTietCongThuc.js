import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000";

// =================================================================================
// 1. COMPONENT HIỂN THỊ 1 BÌNH LUẬN
// =================================================================================
const CommentItem = ({
  comment,
  isReply = false,
  currentUser,
  onReplyClick,
  onDelete,
  onUpdate,
  onPostReply,
  replyingId,
  editingId,
  editContent,
  setEditContent,
  replyContent,
  setReplyContent,
}) => {


  const author = comment.nguoi_dung || {}; 
  
  // Lấy tên và avatar từ object author
  const authorName = author.HoTen || author.TenTK || "Người dùng";
  const authorAvatar = author.AnhDaiDien 
    ? `${API_URL}/storage/img/NguoiDung/${author.AnhDaiDien}` 
    : "https://i.pravatar.cc/150";

  // Kiểm tra quyền (ép kiểu số để so sánh an toàn)
  const currentUserId = currentUser?.Ma_ND || currentUser?.id;
  const isOwner = Number(currentUserId) === Number(comment.Ma_ND);

  // Format thời gian
  const timeString = comment.created_at
    ? new Date(comment.created_at).toLocaleString("vi-VN", {
        day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
      })
    : "";

  const isEditing = editingId === comment.Ma_BL;
  const isReplying = replyingId === comment.Ma_BL;

  return (
    <div className="comment-node" style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", gap: "12px" }}>
        {/* Avatar */}
        <div style={{ flexShrink: 0 }}>
          <img
            src={authorAvatar}
            alt={authorName}
            style={{
              width: isReply ? 36 : 44,
              height: isReply ? 36 : 44,
              borderRadius: "50%",
              objectFit: "cover",
              border: "1px solid #e4e6eb",
            }}
            onError={(e) => (e.target.src = "https://i.pravatar.cc/150")}
          />
        </div>

        <div style={{ flex: 1 }}>
          {!isEditing ? (
            <>
              {/* Nội dung bình luận */}
              <div
                style={{
                  background: isReply ? "#f7f8fa" : "#f0f2f5",
                  borderRadius: "18px",
                  padding: "8px 14px",
                  display: "inline-block",
                  maxWidth: "90%",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#050505" }}>
                  {authorName}
                </div>
                <div
                  style={{
                    fontSize: "0.96rem",
                    lineHeight: 1.45,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    marginTop: 3,
                    color: "#050505"
                  }}
                >
                  {comment.NoiDungBL}
                </div>
              </div>

              {/* Actions: Time, Reply, Edit, Delete */}
              <div style={{ display: "flex", gap: "14px", marginTop: 4, fontSize: "0.8rem", color: "#65676b", marginLeft: 12 }}>
                <span>{timeString}</span>

                <span
                  style={{ cursor: "pointer", fontWeight: 600, color: isReplying ? "#0866ff" : "inherit" }}
                  onClick={() => onReplyClick(comment.Ma_BL, "reply")}
                >
                  {isReplying ? "Hủy" : "Trả lời"}
                </span>

                {isOwner && (
                  <>
                    <span
                      style={{ cursor: "pointer", fontWeight: 600 }}
                      onClick={() => onReplyClick(comment.Ma_BL, "edit", comment.NoiDungBL)}
                    >
                      Sửa
                    </span>
                    <span
                      style={{ cursor: "pointer", fontWeight: 600, color: "#d32f2f" }}
                      onClick={() => onDelete(comment.Ma_BL)}
                    >
                      Xóa
                    </span>
                  </>
                )}
              </div>
            </>
          ) : (
            // Form Sửa
            <div>
              <textarea
                autoFocus
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={2}
                style={{ width: "100%", padding: 10, borderRadius: 12, border: "1px solid #ccc" }}
              />
              <div style={{ marginTop: 8, display: "flex", gap: 10 }}>
                <button onClick={() => onUpdate(comment.Ma_BL)} style={{ background: "#0866ff", color: "#fff", border: "none", padding: "5px 15px", borderRadius: 5, cursor: "pointer" }}>Lưu</button>
                <button onClick={() => onReplyClick(null, "cancel_edit")} style={{ background: "transparent", border: "none", cursor: "pointer" }}>Hủy</button>
              </div>
            </div>
          )}

          {/* Form Trả lời */}
          {isReplying && (
            <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
               <img
                src={currentUser?.AnhDaiDien ? `${API_URL}/storage/img/NguoiDung/${currentUser.AnhDaiDien}` : "https://i.pravatar.cc/150"}
                alt="" style={{ width: 32, height: 32, borderRadius: "50%" }}
              />
              <div style={{ flex: 1, position: "relative" }}>
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={`Trả lời ${authorName}...`}
                  autoFocus
                  style={{ width: "100%", padding: "8px 40px 8px 12px", borderRadius: 20, border: "1px solid #ccc", outline: "none" }}
                  onKeyDown={(e) => e.key === "Enter" && onPostReply(comment.Ma_BL)}
                />
                <button
                  onClick={() => onPostReply(comment.Ma_BL)}
                  style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", border: "none", background: "none", color: "#0866ff", cursor: "pointer" }}
                >
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// =================================================================================
// 2. COMPONENT DANH SÁCH ĐỆ QUY
// =================================================================================
const CommentThread = ({ comments = [], ...props }) => {
  return (
    <>
      {comments.map((comment) => (
        <div key={comment.Ma_BL}>
          <CommentItem comment={comment} {...props} />
          {/* Lưu ý: Nếu API trả về cấu trúc lồng nhau trong key 'replies', đoạn này sẽ hoạt động.
             Nếu API trả về danh sách phẳng, cần xử lý logic khác để nhóm cha-con.
             Giả định Backend đã có quan hệ hasMany('replies').
          */}
          {comment.replies && comment.replies.length > 0 && (
            <div style={{ paddingLeft: 44 }}>
               <div style={{ borderLeft: "2px solid #f0f2f5", paddingLeft: 10 }}>
                  <CommentThread comments={comment.replies} {...props} isReply={true} />
               </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

// =================================================================================
// 3. COMPONENT CHÍNH
// =================================================================================
const ChitietCongthuc = () => {
  const { idSlug } = useParams();
  const navigate = useNavigate();

  // Tách ID từ slug an toàn
  const currentId = idSlug ? parseInt(idSlug.split("-")[0]) : null;

  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  
  // State User
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);

  // State Inputs
  const [commentContent, setCommentContent] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [editContent, setEditContent] = useState("");

  // State Actions
  const [replyingCommentId, setReplyingCommentId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Load User & Token
  useEffect(() => {
    const u = localStorage.getItem("user");
    const t = localStorage.getItem("access_token");
    if (u) setCurrentUser(JSON.parse(u));
    if (t) setToken(t);
  }, []);

  // 2. Load Data
  useEffect(() => {
    if (currentId) {
      fetchRecipe();
      fetchComments();
    }
  }, [currentId]);

  const fetchRecipe = async () => {
    try {
      const res = await fetch(`${API_URL}/api/cong-thuc/${currentId}`);
      const data = await res.json();
      // Tùy backend trả về wrap trong data hay không
      setRecipe(data.data || data);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`${API_URL}/api/cong-thuc/${currentId}/binh-luan`);
      const json = await res.json();
      console.log("Comments Data:", json); // Debug xem cấu trúc
      // Postman cho thấy dữ liệu nằm trong json.data
      if (json.data) setComments(json.data);
    } catch (e) { console.error(e); }
  };

  const checkAuth = () => {
    if (!token) {
      if(window.confirm("Bạn cần đăng nhập để bình luận!")) navigate("/dang-nhap");
      return false;
    }
    return true;
  };

  // --- API GỬI BÌNH LUẬN (QUAN TRỌNG: Parent_ID) ---
  const handlePostComment = async (parentId = null) => {
    if (!checkAuth()) return;
    const content = parentId ? replyContent : commentContent;
    if (!content.trim()) return;

    try {
      // Chuẩn bị payload khớp với Backend Service
      const payload = {
        Ma_CT: currentId,
        NoiDungBL: content,
        Parent_ID: parentId // <--- Backend yêu cầu Parent_ID (viết hoa P)
      };

      const res = await fetch(`${API_URL}/api/user/binh-luan/them`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.status) {
        if (parentId) {
            setReplyContent("");
            setReplyingCommentId(null);
        } else {
            setCommentContent("");
        }
        fetchComments(); // Load lại danh sách
      } else {
        alert(json.message);
      }
    } catch (e) { console.error(e); }
  };

  // --- ACTIONS ---
  const handleActionClick = (id, action, text = "") => {
    if(!checkAuth()) return;
    if(action === "reply") {
        setReplyingCommentId(replyingCommentId === id ? null : id);
        setEditingCommentId(null);
        setReplyContent("");
    }
    if(action === "edit") {
        setEditingCommentId(id);
        setEditContent(text);
        setReplyingCommentId(null);
    }
    if(action === "cancel_edit") setEditingCommentId(null);
  };

  const onDelete = async (id) => {
      if(!checkAuth() || !window.confirm("Xóa bình luận này?")) return;
      const res = await fetch(`${API_URL}/api/user/binh-luan/xoa/${id}`, {
          method: "DELETE", headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if(json.status) fetchComments();
  };

  const onUpdate = async (id) => {
      if(!checkAuth()) return;
      const res = await fetch(`${API_URL}/api/user/binh-luan/sua/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ NoiDungBL: editContent })
      });
      const json = await res.json();
      if(json.status) {
          setEditingCommentId(null);
          fetchComments();
      }
  };

  if (loading) return <div style={{textAlign: "center", padding: 50}}>Đang tải dữ liệu...</div>;
  if (!recipe) return <div style={{textAlign: "center", padding: 50}}>Không tìm thấy công thức</div>;

  // Xử lý hiển thị công thức (nguyen_lieu, buoc_thuc_hien...)
  // Kiểm tra key trả về từ backend (nguyen_lieu hay nguyenLieu)
  const ingredients = recipe.nguyen_lieu || recipe.nguyenLieu || []; 
  const steps = recipe.buoc_thuc_hien || recipe.buocThucHien || [];
  const related = recipe.mon_lien_quan || recipe.monLienQuan || [];
  const author = recipe.nguoidung || {};

  return (
    <div className="recipe-page-wrapper">
      <main className="container recipe-container">
        {/* RECIPE HEADER */}
        <div className="recipe-header">
          <h1 className="recipe-title">{recipe.TenMon}</h1>
          <p className="recipe-desc">{recipe.MoTa}</p>
          
          <div className="author-info" style={{marginBottom: 15, display: 'flex', alignItems: 'center', gap: 10}}>
             <img src={author.AnhDaiDien ? `${API_URL}/storage/img/NguoiDung/${author.AnhDaiDien}` : "https://i.pravatar.cc/150"} alt="" style={{width: 40, height: 40, borderRadius: '50%'}} />
             <div>
                <strong>{author.HoTen || "Admin"}</strong>
                <div style={{fontSize: '0.9rem', color: '#666'}}>Lượt xem: {recipe.SoLuotXem}</div>
             </div>
          </div>

          <div className="recipe-hero-img">
            <img
              src={`${API_URL}/storage/img/CongThuc/${recipe.HinhAnh}`}
              alt={recipe.TenMon}
              onError={(e) => e.target.src = "https://placehold.co/800x500"}
            />
          </div>
          <div className="recipe-quick-info">
            <div className="info-item">
              <i className="fa-solid fa-fire-burner"></i>
              <div>
                <span>Thời gian</span>
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

        {/* INGREDIENTS & STEPS */}
        <div className="recipe-content-grid">
          <aside className="recipe-left-sidebar">
            <div className="ingredients-box">
              <h3>Nguyên liệu</h3>
              <ul className="ingredients-list">
                {ingredients.map((item, index) => (
                  <li key={item.Ma_NL || index}>
                    <i className="fa-solid fa-check"></i> 
                    {item.pivot?.DinhLuong} {item.DonViDo} {item.TenNguyenLieu}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          
          <div className="main-instructions">
            <h2>Hướng dẫn thực hiện</h2>
            <div className="steps-container">
              {steps.map((step) => (
                <div className="step-item" key={step.Ma_BTH || step.STT}>
                  <div className="step-number">{step.STT}</div>
                  <div className="step-content">
                    <p>{step.NoiDung}</p>
                    {step.HinhAnh && (
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          marginTop: "10px",
                          flexWrap: "wrap",
                        }}
                      >
                        {step.HinhAnh.split(";").map((img, idx) => (
                          img.trim() && (
                            <img
                                key={idx}
                                className="step-img"
                                src={`${API_URL}/storage/img/BuocThucHien/${img.trim()}`}
                                alt=""
                                style={{ maxWidth: "200px", borderRadius: 8 }}
                            />
                          )
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* COMMENTS SECTION */}
      <div className="recipe-bottom-layout">
        <div className="recipe-main-bottom">
          <div
            className="comments-section"
            style={{
              marginTop: "40px",
              borderTop: "1px solid #eee",
              paddingTop: "20px",
            }}
          >
            <h3 className="section-title">Bình luận</h3>

            {/* FORM NHẬP BÌNH LUẬN GỐC */}
            {token ? (
              <div
                className="review-dashboard"
                style={{ marginBottom: "30px" }}
              >
                <div className="dashboard-right">
                  <div style={{display: 'flex', gap: 10, alignItems: 'flex-start'}}>
                      <img 
                        src={currentUser?.AnhDaiDien ? `${API_URL}/storage/img/NguoiDung/${currentUser.AnhDaiDien}` : "https://i.pravatar.cc/150"} 
                        alt="me"
                        style={{width: 40, height: 40, borderRadius: '50%'}}
                      />
                      <textarea
                        className="review-textarea-clean"
                        placeholder="Viết bình luận công khai..."
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        style={{width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd'}}
                      />
                  </div>
                  <div className="action-row-right" style={{textAlign: 'right', marginTop: 10}}>
                    <button
                      className="btn-submit-review"
                      onClick={() => handlePostComment(null)}
                      disabled={!commentContent.trim()}
                      style={{
                          opacity: !commentContent.trim() ? 0.6 : 1,
                          cursor: !commentContent.trim() ? 'not-allowed' : 'pointer',
                          background: '#0866ff', color: 'white', padding: '8px 20px', border: 'none', borderRadius: 6
                      }}
                    >
                      Gửi bình luận
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  background: "#f9f9f9",
                  borderRadius: "8px",
                  marginBottom: "20px",
                }}
              >
                Vui lòng{" "}
                <Link
                  to="/dang-nhap"
                  style={{
                    color: "#0866ff",
                    fontWeight: "bold",
                    textDecoration: "none"
                  }}
                >
                  đăng nhập
                </Link>{" "}
                để tham gia bình luận.
              </div>
            )}

            {/* DANH SÁCH BÌNH LUẬN */}
            <div className="comments-list" style={{ marginTop: "24px" }}>
              {comments?.length > 0 ? (
                <CommentThread
                  comments={comments}
                  currentUser={currentUser}
                  onReplyClick={handleActionClick}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                  onPostReply={handlePostComment}
                  replyingId={replyingCommentId}
                  editingId={editingCommentId}
                  editContent={editContent}
                  setEditContent={setEditContent}
                  replyContent={replyContent}
                  setReplyContent={setReplyContent}
                  level={0}
                />
              ) : (
                <p style={{ textAlign: "center", color: "#777", padding: "40px 0" }}>
                  Chưa có bình luận nào. Hãy là người đầu tiên!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SIDEBAR MÓN LIÊN QUAN */}
        <aside className="recipe-right-sidebar">
          <h3 className="sidebar-title">Món liên quan</h3>
          <div className="related-list">
            {related.length > 0 ? related.map((item) => (
              <article className="related-item" key={item.Ma_CT}>
                <Link to={`/cong-thuc/${item.Ma_CT}-${item.slug_url || 'mon-an'}`}>
                  <img
                    src={`${API_URL}/storage/img/CongThuc/${item.HinhAnh}`}
                    alt={item.TenMon}
                    onError={(e) => e.target.src = "https://placehold.co/100"}
                  />
                </Link>
                <div className="related-info">
                  <Link to={`/cong-thuc/${item.Ma_CT}-${item.slug_url || 'mon-an'}`}>{item.TenMon}</Link>
                  <span>
                     {item.SoLuotXem} <i className="fa-solid fa-eye"></i>
                  </span>
                </div>
              </article>
            )) : <p>Chưa có món liên quan.</p>}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ChitietCongthuc;