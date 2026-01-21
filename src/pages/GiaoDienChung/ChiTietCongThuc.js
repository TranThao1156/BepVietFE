import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "../../assets/css/ChiTietCT.css"
import DanhGiaSao from "../NguoiDung/DanhGiaSao";
// import "../../assets/css/ChiTietCT.css";

const API_URL = "http://127.0.0.1:8000";

// 1. COMPONENT HIỂN THỊ 1 BÌNH LUẬN
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
  const authorName = author.HoTen || author.TenTK || "Người dùng";
  const authorAvatar = author.AnhDaiDien
    ? `${API_URL}/storage/img/NguoiDung/${author.AnhDaiDien}`
    : "https://i.pravatar.cc/150";

  const currentUserId = currentUser?.Ma_ND || currentUser?.id;
  const isOwner = Number(currentUserId) === Number(comment.Ma_ND);

  const timeString = comment.created_at
    ? new Date(comment.created_at).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const isEditing = editingId === comment.Ma_BL;
  const isReplying = replyingId === comment.Ma_BL;

  return (
    <div className="comment-node">
      <div className="comment-row">
        {/* Avatar */}
        <div style={{ flexShrink: 0 }}>
          <img
            src={authorAvatar}
            alt={authorName}
            className={`comment-avatar ${isReply ? "reply" : "main"}`}
            onError={(e) => (e.target.src = "https://i.pravatar.cc/150")}
          />
        </div>

        <div className="comment-body">
          {!isEditing ? (
            <>
              {/* Nội dung bình luận */}
              <div
                className={`comment-bubble ${isReply ? "reply-bg" : "primary"}`}
              >
                <div className="comment-author-name">{authorName}</div>
                <div className="comment-text">{comment.NoiDungBL}</div>
              </div>

              {/* Actions: Time, Reply, Edit, Delete */}
              <div className="comment-actions">
                <span>{timeString}</span>
                <span
                  className={`action-btn ${isReplying ? "active" : ""}`}
                  onClick={() => onReplyClick(comment.Ma_BL, "reply")}
                >
                  {isReplying ? "Hủy" : "Trả lời"}
                </span>

                {isOwner && (
                  <>
                    <span
                      className="action-btn"
                      onClick={() =>
                        onReplyClick(comment.Ma_BL, "edit", comment.NoiDungBL)
                      }
                    >
                      Sửa
                    </span>
                    <span
                      className="action-btn delete"
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
            <div className="edit-form">
              <textarea
                autoFocus
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={2}
              />
              <div className="edit-actions">
                <button
                  className="btn-save-edit"
                  onClick={() => onUpdate(comment.Ma_BL)}
                >
                  Lưu
                </button>
                <button
                  className="btn-cancel-edit"
                  onClick={() => onReplyClick(null, "cancel_edit")}
                >
                  Hủy
                </button>
              </div>
            </div>
          )}

          {/* Form Trả lời */}
          {isReplying && (
            <div className="reply-input-container">
              <img
                src={
                  currentUser?.AnhDaiDien
                    ? `${API_URL}/storage/img/NguoiDung/${currentUser.AnhDaiDien}`
                    : "https://i.pravatar.cc/150"
                }
                alt=""
                className="user-avatar-input"
                style={{ width: 32, height: 32 }}
              />
              <div className="reply-input-wrapper">
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={`Trả lời ${authorName}...`}
                  autoFocus
                  className="reply-input"
                  onKeyDown={(e) =>
                    e.key === "Enter" && onPostReply(comment.Ma_BL)
                  }
                />
                <button
                  onClick={() => onPostReply(comment.Ma_BL)}
                  className="btn-send-reply"
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
          {comment.replies && comment.replies.length > 0 && (
            <div className="reply-thread">
              <div className="reply-line">
                <CommentThread
                  comments={comment.replies}
                  {...props}
                  isReply={true}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

// 3. COMPONENT CHÍNH

const ChitietCongthuc = () => {
  const { idSlug } = useParams();
  const navigate = useNavigate();
  const currentId = idSlug ? parseInt(idSlug.split("-")[0]) : null;

  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);

  const [showModalCookbook, setShowModalCookbook] = useState(false); // Ẩn/Hiện modal
  const [myCookbooks, setMyCookbooks] = useState([]); // Danh sách cookbook tải về
  const [selectedCookbookId, setSelectedCookbookId] = useState("");

  const [commentContent, setCommentContent] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [editContent, setEditContent] = useState("");
  const [replyingCommentId, setReplyingCommentId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Khôi---------------------------------
  const handleOpenCookbookModal = async () => {
    // Kiểm tra đăng nhập
    if (!currentUser) {
      alert("Vui lòng đăng nhập để sử dụng tính năng này!");
      return;
    }
    setShowModalCookbook(true);

    const token = localStorage.getItem("access_token");

    try {
      const res = await fetch(`${API_URL}/api/user/cookbooks/cua-toi`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",

          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
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
    const token = localStorage.getItem("access_token");

    try {
      const res = await fetch(`${API_URL}/api/user/cookbooks/them-mon`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",

          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          Ma_CookBook: parseInt(selectedCookbookId),
          Ma_CT: parseInt(idSlug),
        }),
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

  // 1. Load User & Token
  useEffect(() => {
    const u = localStorage.getItem("user");
    // Trâm - đã sửa: hỗ trợ cả key cũ (access_token) và key mới (token)
    const t = localStorage.getItem("token") || localStorage.getItem("access_token") || localStorage.getItem("user_token");
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
      setRecipe(data.data || data);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/cong-thuc/${currentId}/binh-luan`,
      );
      const json = await res.json();
      if (json.data) setComments(json.data);
    } catch (e) {
      console.error(e);
    }
  };

  const checkAuth = () => {
    if (!token) {
      if (window.confirm("Bạn cần đăng nhập để bình luận!"))
        navigate("/dang-nhap");
      return false;
    }
    return true;
  };

  const handlePostComment = async (parentId = null) => {
    if (!checkAuth()) return;
    const content = parentId ? replyContent : commentContent;
    if (!content.trim()) return;

    try {
      const payload = {
        Ma_CT: currentId,
        NoiDungBL: content,
        Parent_ID: parentId,
      };

      const res = await fetch(`${API_URL}/api/user/binh-luan/them`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.status) {
        if (parentId) {
          setReplyContent("");
          setReplyingCommentId(null);
        } else {
          setCommentContent("");
        }
        fetchComments();
      } else {
        alert(json.message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleActionClick = (id, action, text = "") => {
    if (!checkAuth()) return;
    if (action === "reply") {
      setReplyingCommentId(replyingCommentId === id ? null : id);
      setEditingCommentId(null);
      setReplyContent("");
    }
    if (action === "edit") {
      setEditingCommentId(id);
      setEditContent(text);
      setReplyingCommentId(null);
    }
    if (action === "cancel_edit") setEditingCommentId(null);
  };

  const onDelete = async (id) => {
    if (!checkAuth() || !window.confirm("Xóa bình luận này?")) return;
    const res = await fetch(`${API_URL}/api/user/binh-luan/xoa/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (json.status) fetchComments();
  };

  const onUpdate = async (id) => {
    if (!checkAuth()) return;
    const res = await fetch(`${API_URL}/api/user/binh-luan/sua/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ NoiDungBL: editContent }),
    });
    const json = await res.json();
    if (json.status) {
      setEditingCommentId(null);
      fetchComments();
    }
  };

  if (loading) return <div className="loading-state">Đang tải dữ liệu...</div>;
  if (!recipe)
    return <div className="error-state">Không tìm thấy công thức</div>;

  const ingredients = recipe.nguyen_lieu || recipe.nguyenLieu || [];
  const steps = recipe.buoc_thuc_hien || recipe.buocThucHien || [];
  const related = recipe.mon_lien_quan || recipe.monLienQuan || [];
  const author = recipe.nguoidung || {};

  // Trâm - đã thêm: chỉ cho hiển thị đánh giá khi công thức đã được duyệt (logic chuẩn kiểm duyệt)
  const trangThaiDuyet = recipe.TrangThaiDuyet ?? recipe.trang_thai_duyet;
  const trangThai = recipe.TrangThai ?? recipe.trang_thai;
  const coTheHienDanhGia =
    trangThaiDuyet === "Chấp nhận" &&
    (trangThai === 1 || trangThai === "1" || trangThai === true);

  // Trâm - đã sửa: normalize danh sách đánh giá để DanhGiaSao nhận được ở mọi dạng key
  const reviews = recipe.danhGia || recipe.danh_gia || recipe.danhgia || [];
  const avgRating = recipe.TrungBinhSao ?? recipe.trung_binh_sao ?? 0;

  return (
    <div className="recipe-page-wrapper">
      <main className="container recipe-container">
        {/* RECIPE HEADER */}
        <div className="recipe-header">
          <h1 className="recipe-title">{recipe.TenMon}</h1>
          <p className="recipe-desc">{recipe.MoTa}</p>

          <div className="author-info">
            <img
              src={
                author.AnhDaiDien
                  ? `${API_URL}/storage/img/NguoiDung/${author.AnhDaiDien}`
                  : "https://i.pravatar.cc/150"
              }
              alt=""
              className="author-avatar-small"
            />
            <div>
              <div className="author-name">{author.HoTen || "Admin"}</div>
              <div className="view-count">Lượt xem: {recipe.SoLuotXem}</div>
            </div>
          </div>

          <div className="recipe-hero-img">
            <img
              src={`${API_URL}/storage/img/CongThuc/${recipe.HinhAnh}`}
              alt={recipe.TenMon}
              onError={(e) => (e.target.src = "https://placehold.co/800x500")}
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

          {/* RATING SECTION */}
          {coTheHienDanhGia && (
            <div style={{ marginTop: 20 }}>
              <DanhGiaSao
                maCongThuc={currentId}
                currentUser={currentUser}
                initialAvgRating={avgRating}
                initialReviews={reviews}
                onRatingSuccess={fetchRecipe}
              />
            </div>
          )}
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
            {/* Khôi Lưu vào cookbookk */}
            <button
              className="btn-save-cookbook"
              onClick={handleOpenCookbookModal}
            >
              <i className="fa-regular fa-bookmark"></i> Lưu vào Cookbook
            </button>
          </aside>

          {showModalCookbook && (
            <div className="modal-overlay">
              <div className="modal-box">
                <h3 className="modal-title">Chọn Cookbook để lưu</h3>

                {myCookbooks.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#666" }}>
                    Bạn chưa có Cookbook nào. <br />
                    Hãy tạo mới trong trang cá nhân.
                  </p>
                ) : (
                  <div className="modal-body">
                    <label className="modal-label">Chọn bộ sưu tập:</label>
                    <select
                      className="modal-select"
                      value={selectedCookbookId}
                      onChange={(e) => setSelectedCookbookId(e.target.value)}
                    >
                      {myCookbooks.map((cb) => (
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
          {/* ------------------------------------------------------ */}

          <div className="main-instructions">
            <h2>Hướng dẫn thực hiện</h2>
            <div className="steps-container">
              {steps.map((step) => (
                <div className="step-item" key={step.Ma_BTH || step.STT}>
                  <div className="step-number">{step.STT}</div>
                  <div className="step-content">
                    <p>{step.NoiDung}</p>
                    {step.HinhAnh && (
                      <div className="step-images-grid">
                        {step.HinhAnh.split(";").map(
                          (img, idx) =>
                            img.trim() && (
                              <img
                                key={idx}
                                className="step-img"
                                src={`${API_URL}/storage/img/BuocThucHien/${img.trim()}`}
                                alt=""
                              />
                            ),
                        )}
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
          <div className="comments-section">
            <h3 className="section-title">Bình luận</h3>

            {/* FORM NHẬP BÌNH LUẬN GỐC */}
            {token ? (
              <div className="review-dashboard">
                <div className="dashboard-right">
                  <div className="input-row">
                    <img
                      src={
                        currentUser?.AnhDaiDien
                          ? `${API_URL}/storage/img/NguoiDung/${currentUser.AnhDaiDien}`
                          : "https://i.pravatar.cc/150"
                      }
                      alt="me"
                      className="user-avatar-input"
                    />
                    <textarea
                      className="review-textarea-clean"
                      placeholder="Viết bình luận công khai..."
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      rows={1}
                    />
                  </div>
                  <div style={{ textAlign: "right", marginTop: 10 }}>
                    <button
                      className="btn-submit-review"
                      onClick={() => handlePostComment(null)}
                      disabled={!commentContent.trim()}
                    >
                      Gửi bình luận
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="login-prompt">
                Vui lòng{" "}
                <Link
                  to="/dang-nhap"
                  style={{
                    color: "var(--primary-color)",
                    fontWeight: "bold",
                    textDecoration: "none",
                  }}
                >
                  đăng nhập
                </Link>{" "}
                để tham gia bình luận.
              </div>
            )}

            {/* DANH SÁCH BÌNH LUẬN */}
            <div className="comments-list">
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
                <p
                  style={{
                    textAlign: "center",
                    color: "#777",
                    padding: "40px 0",
                  }}
                >
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
            {related.length > 0 ? (
              related.map((item) => (
                <article className="related-item" key={item.Ma_CT}>
                  <Link
                    to={`/cong-thuc/${item.Ma_CT}-${item.slug_url || "mon-an"}`}
                  >
                    <img
                      src={`${API_URL}/storage/img/CongThuc/${item.HinhAnh}`}
                      alt={item.TenMon}
                      onError={(e) =>
                        (e.target.src = "https://placehold.co/100")
                      }
                    />
                  </Link>
                  <div className="related-info">
                    <Link
                      to={`/cong-thuc/${item.Ma_CT}-${item.slug_url || "mon-an"}`}
                    >
                      {item.TenMon}
                    </Link>
                    <span>
                      {item.SoLuotXem} <i className="fa-solid fa-eye"></i>
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <p>Chưa có món liên quan.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ChitietCongthuc;
