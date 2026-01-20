import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

// --- 1. COMPONENT HIỂN THỊ TỪNG BÌNH LUẬN (Đã cập nhật giao diện & biến) ---
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
  const currentUserId = currentUser?.Ma_ND || currentUser?.id;
  const isOwner = Number(currentUserId) === Number(comment?.Ma_ND);

  const isEditing = editingId === comment.Ma_BL;
  const isReplying = replyingId === comment.Ma_BL;

  const timeString = comment.created_at
    ? new Date(comment.created_at).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const userName =
    comment.nguoiDung?.Ten_ND || comment.nguoi_dung?.Ten_ND || "Người dùng";
  const userAvatar =
    comment.nguoiDung?.AnhDaiDien || comment.nguoi_dung?.AnhDaiDien
      ? `http://127.0.0.1:8000/storage/img/NguoiDung/${comment.nguoiDung?.AnhDaiDien || comment.nguoi_dung?.AnhDaiDien}`
      : "https://i.pravatar.cc/150";

  return (
    <div className="comment-node" style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", gap: "12px" }}>
        <div style={{ flexShrink: 0 }}>
          <img
            src={userAvatar}
            alt="Avatar"
            style={{
              width: isReply ? 36 : 44,
              height: isReply ? 36 : 44,
              borderRadius: "50%",
              objectFit: "cover",
              border: "1px solid #e4e6eb",
            }}
          />
        </div>

        <div style={{ flex: 1 }}>
          {!isEditing ? (
            <>
              <div
                style={{
                  background: isReply ? "#f7f8fa" : "#f0f2f5",
                  borderRadius: "18px",
                  padding: "8px 14px",
                  display: "inline-block",
                  maxWidth: "85%",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                  {userName}
                </div>
                <div
                  style={{
                    fontSize: "0.96rem",
                    lineHeight: 1.45,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    marginTop: 3,
                  }}
                >
                  {comment.NoiDungBL}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "14px",
                  marginTop: 6,
                  fontSize: "0.82rem",
                  color: "#606770",
                }}
              >
                <span>{timeString || "Vừa xong"}</span>

                <span
                  style={{
                    cursor: "pointer",
                    fontWeight: 600,
                    color: isReplying ? "#0866ff" : "inherit",
                  }}
                  onClick={() => onReplyClick(comment.Ma_BL, "reply")}
                >
                  {isReplying ? "Hủy" : "Trả lời"}
                </span>

                {isOwner && (
                  <>
                    <span
                      style={{ cursor: "pointer", fontWeight: 600 }}
                      onClick={() =>
                        onReplyClick(comment.Ma_BL, "edit", comment.NoiDungBL)
                      }
                    >
                      Sửa
                    </span>
                    <span
                      style={{
                        cursor: "pointer",
                        color: "#d32f2f",
                        fontWeight: 600,
                      }}
                      onClick={() => onDelete(comment.Ma_BL)}
                    >
                      Xóa
                    </span>
                  </>
                )}
              </div>
            </>
          ) : (
            // Edit mode
            <div>
              <textarea
                autoFocus
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid #ccd0d5",
                  fontSize: "0.95rem",
                  resize: "vertical",
                  minHeight: 60,
                }}
              />
              <div style={{ marginTop: 8, display: "flex", gap: 16 }}>
                <button
                  onClick={() => onUpdate(comment.Ma_BL)}
                  style={{
                    background: "#0866ff",
                    color: "white",
                    border: "none",
                    padding: "6px 16px",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  Lưu
                </button>
                <button
                  onClick={() => onReplyClick(null, "cancel_edit")}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#606770",
                    cursor: "pointer",
                  }}
                >
                  Hủy
                </button>
              </div>
            </div>
          )}

          {/* Reply form */}
          {isReplying && (
            <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
              <img
                src={
                  currentUser?.AnhDaiDien
                    ? `http://127.0.0.1:8000/storage/img/NguoiDung/${currentUser.AnhDaiDien}`
                    : "https://i.pravatar.cc/150?50"
                }
                alt=""
                style={{ width: 32, height: 32, borderRadius: "50%" }}
              />
              <div style={{ flex: 1, position: "relative" }}>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={`Trả lời ${userName}...`}
                  autoFocus
                  rows={2}
                  style={{
                    width: "100%",
                    padding: "10px 50px 10px 12px",
                    borderRadius: 20,
                    border: "1px solid #ccd0d5",
                    fontSize: "0.95rem",
                    resize: "none",
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      onPostReply(comment.Ma_BL);
                    }
                  }}
                />
                <button
                  onClick={() => onPostReply(comment.Ma_BL)}
                  disabled={!replyContent.trim()}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: replyContent.trim() ? "#0866ff" : "#aaa",
                    fontSize: "1.3rem",
                    cursor: replyContent.trim() ? "pointer" : "not-allowed",
                  }}
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

const CommentThread = ({
  comments = [],
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
  level = 0,
  maxLevel = 5, // giới hạn độ sâu để tránh UI vỡ (tùy chọn)
}) => {
  if (level > maxLevel) {
    return (
      <div style={{ color: "#777", fontSize: "0.9rem", paddingLeft: 20 }}>
        ... còn {comments.length} bình luận nữa
      </div>
    );
  }

  return (
    <>
      {comments.map((comment) => {
        // Linh hoạt lấy replies (tùy backend trả về tên relation nào)
        const replies =
          comment.repliesRecursive ||
          comment.repliesRelation ||
          comment.replies ||
          comment.children ||
          [];

        return (
          <div key={comment.Ma_BL} style={{ position: "relative" }}>
            <CommentItem
              comment={comment}
              isReply={level > 0}
              currentUser={currentUser}
              onReplyClick={onReplyClick}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onPostReply={onPostReply}
              replyingId={replyingId}
              editingId={editingId}
              editContent={editContent}
              setEditContent={setEditContent}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
            />

            {replies.length > 0 && (
              <div
                style={{
                  paddingLeft: level === 0 ? 48 : 32,
                  marginTop: 8,
                }}
              >
                <div
                  style={{
                    borderLeft: level < maxLevel ? "2px solid #e4e6eb" : "none",
                    paddingLeft: 16,
                  }}
                >
                  <CommentThread
                    comments={replies}
                    currentUser={currentUser}
                    onReplyClick={onReplyClick}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                    onPostReply={onPostReply}
                    replyingId={replyingId}
                    editingId={editingId}
                    editContent={editContent}
                    setEditContent={setEditContent}
                    replyContent={replyContent}
                    setReplyContent={setReplyContent}
                    level={level + 1}
                    maxLevel={maxLevel}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

// --- 3. COMPONENT CHÍNH ---
const ChitietCongthuc = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);

  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);

  const [commentContent, setCommentContent] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [editContent, setEditContent] = useState("");

  const [replyingCommentId, setReplyingCommentId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [loading, setLoading] = useState(true);

  // 1. Load User & Recipe
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("access_token");

    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      console.log("User từ localStorage:", parsed);
      setCurrentUser(parsed);
    }
    if (storedToken) setToken(storedToken);

    fetch(`http://127.0.0.1:8000/api/cong-thuc/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setRecipe(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // 2. Load Comments
  useEffect(() => {
    fetchComments();
  }, [id]);

  const fetchComments = () => {
    const currentToken = localStorage.getItem("access_token");
    const headers = currentToken
      ? { Authorization: `Bearer ${currentToken}` }
      : {};

    fetch(`http://127.0.0.1:8000/api/user/cong-thuc/${id}/binh-luan`, {
      headers,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("=== DỮ LIỆU BÌNH LUẬN ===", res.data);
        if (res.data) setComments(res.data);
      })
      .catch((err) => console.error("Lỗi fetch bình luận:", err));
  };

  const checkAuth = () => {
    const tk = localStorage.getItem("access_token");
    if (!tk) {
      alert("Bạn cần đăng nhập để thực hiện thao tác này.");
      setToken(null);
      setCurrentUser(null);
      return null;
    }
    return tk;
  };

  const handleActionClick = (commentId, action, content = "") => {
    if (!checkAuth()) return;

    if (action === "reply") {
      setReplyingCommentId(replyingCommentId === commentId ? null : commentId);
      setEditingCommentId(null);
      setReplyContent("");
    } else if (action === "edit") {
      setEditingCommentId(commentId);
      setEditContent(content);
      setReplyingCommentId(null);
    } else if (action === "cancel_edit") {
      setEditingCommentId(null);
      setEditContent("");
    }
  };

  const handlePostComment = (parentId = null) => {
    const tk = checkAuth();
    if (!tk) return;

    const content = parentId ? replyContent : commentContent;
    if (!content.trim()) {
      alert("Nội dung không được để trống");
      return;
    }

    fetch("http://127.0.0.1:8000/api/user/binh-luan/them", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tk}`,
      },
      body: JSON.stringify({
        Ma_CT: Number(id),
        NoiDungBL: content.trim(),
        parent_id: parentId ? Number(parentId) : null,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status) {
          if (parentId) {
            setReplyContent("");
            setReplyingCommentId(null);
          } else {
            setCommentContent("");
            setUserRating(0);
          }
          fetchComments();
        } else {
          alert(res.message || "Có lỗi xảy ra");
        }
      })
      .catch((err) => console.error("Lỗi gửi bình luận:", err));
  };

  const onDelete = (cId) => {
    const tk = checkAuth();
    if (!tk) return;

    if (!window.confirm("Bạn có chắc chắn muốn xóa bình luận này không?"))
      return;

    fetch(`http://127.0.0.1:8000/api/user/binh-luan/xoa/${cId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${tk}` },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status) {
          fetchComments();
        } else {
          alert(res.message || "Không thể xóa bình luận này.");
        }
      });
  };

  const onUpdate = (cId) => {
    const tk = checkAuth();
    if (!tk) return;

    if (!editContent.trim()) {
      alert("Nội dung không được để trống");
      return;
    }

    fetch(`http://127.0.0.1:8000/api/user/binh-luan/sua/${cId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tk}`,
      },
      body: JSON.stringify({ NoiDungBL: editContent }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status) {
          setEditingCommentId(null);
          setEditContent("");
          fetchComments();
        } else {
          alert(res.message || "Không thể cập nhật bình luận.");
        }
      });
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>Đang tải...</p>
    );
  if (!recipe) return <p>Lỗi dữ liệu</p>;

  return (
    <div className="recipe-page-wrapper">
      <main className="container recipe-container">
        {/* RECIPE HEADER */}
        <div className="recipe-header">
          <h1 className="recipe-title">{recipe.TenMon}</h1>
          <p className="recipe-desc">{recipe.MoTa}</p>
          <div className="recipe-hero-img">
            <img
              src={`http://127.0.0.1:8000/storage/img/CongThuc/${recipe.HinhAnh}`}
              alt=""
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
                {recipe.nguyen_lieu?.map((item) => (
                  <li key={item.Ma_NL}>
                    <i className="fa-solid fa-check"></i> {item.pivot.DinhLuong}{" "}
                    {item.DonViDo} {item.TenNguyenLieu}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          <div className="main-instructions">
            <h2>Hướng dẫn thực hiện</h2>
            <div className="steps-container">
              {recipe.buoc_thuc_hien?.map((step) => (
                <div className="step-item" key={step.Ma_BTH}>
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
                          <img
                            key={idx}
                            className="step-img"
                            src={`http://127.0.0.1:8000/storage/img/BuocThucHien/${img}`}
                            alt=""
                            style={{ maxWidth: "200px" }}
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
                <div className="dashboard-left">
                  <div className="score-big">
                    {userRating > 0 ? userRating : "5.0"}
                  </div>
                  <div className="stars-display">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <i
                        key={s}
                        className={`fa-${
                          s <= (userRating || 5) ? "solid" : "regular"
                        } fa-star`}
                      ></i>
                    ))}
                  </div>
                </div>
                <div className="dashboard-right">
                  <textarea
                    className="review-textarea-clean"
                    placeholder="Viết bình luận của bạn..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                  />
                  <div className="action-row-right">
                    <button
                      className="btn-submit-review"
                      onClick={() => handlePostComment(null)}
                    >
                      Gửi đánh giá
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
                  to="/login"
                  style={{
                    color: "var(--primary-color)",
                    fontWeight: "bold",
                  }}
                >
                  đăng nhập
                </Link>{" "}
                để bình luận.
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
                  // maxLevel={6} // có thể mở nếu muốn giới hạn
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
            {recipe.mon_lien_quan?.map((item) => (
              <article className="related-item" key={item.Ma_CT}>
                <Link to={`/cong-thuc/${item.Ma_CT}`}>
                  <img
                    src={`http://127.0.0.1:8000/storage/img/CongThuc/${item.HinhAnh}`}
                    alt=""
                  />
                </Link>
                <div className="related-info">
                  <Link to={`/cong-thuc/${item.Ma_CT}`}>{item.TenMon}</Link>
                  <span>
                    <i className="fa-solid fa-clock"></i> {item.ThoiGianNau}p
                  </span>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ChitietCongthuc;
