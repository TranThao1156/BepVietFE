import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../assets/css/ChiTietCT.css";
import {
    addBlogComment,
    updateComment,
    deleteComment,
    getBlogComments,
} from "../../api/binhLuanBlogApi";

const API_URL = "http://127.0.0.1:8000";

// Trâm - đã sửa: đồng bộ UI bình luận blog theo code bình luận công thức (CommentItem + CommentThread + ChiTietCT.css)
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

    const currentUserId = currentUser?.Ma_ND ?? currentUser?.id;
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
                            <div
                                className={`comment-bubble ${isReply ? "reply-bg" : "primary"}`}
                            >
                                <div className="comment-author-name">{authorName}</div>
                                <div className="comment-text">{comment.NoiDungBL}</div>
                            </div>

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
                                onError={(e) => (e.target.src = "https://i.pravatar.cc/150")}
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

const BinhLuanBlog = ({ blogId, currentUser }) => {
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState("");

    const [replyingId, setReplyingId] = useState(null);
    const [replyContent, setReplyContent] = useState("");

    const token =
        localStorage.getItem("access_token") || localStorage.getItem("token");

    // --- 1. LOAD DANH SÁCH BÌNH LUẬN ---
    useEffect(() => {
        const loadComments = async () => {
            try {
                const res = await getBlogComments(blogId);
                if (res.success) setComments(res.data);
                else setComments([]); // Trâm - đã sửa: blog chưa duyệt (403) thì không hiển thị bình luận
            } catch (error) {
                console.error("Lỗi tải bình luận:", error);
            }
        };
        loadComments();
    }, [blogId]);

    const refreshData = async () => {
        const res = await getBlogComments(blogId);
        if (res.success) setComments(res.data);
        else setComments([]); // Trâm - đã sửa: blog chưa duyệt (403) thì không hiển thị bình luận
    };

    const handleActionClick = (commentId, actionType, currentContent = "") => {
        if (actionType === "reply") {
            if (!token || !currentUser) {
                alert("Vui lòng đăng nhập để trả lời!");
                return;
            }
            setReplyingId((prev) => (prev === commentId ? null : commentId));
            setEditingId(null);
            if (replyingId === commentId) setReplyContent("");
            return;
        }

        if (actionType === "edit") {
            if (!token || !currentUser) return;
            setEditingId(commentId);
            setEditContent(currentContent);
            setReplyingId(null);
            setReplyContent("");
            return;
        }

        if (actionType === "cancel_edit") {
            setEditingId(null);
            setEditContent("");
        }
    };

    const handlePostRootComment = async () => {
        if (!token || !currentUser) {
            alert("Vui lòng đăng nhập để bình luận!");
            return;
        }
        if (!commentContent.trim()) return;

        try {
            const res = await addBlogComment(blogId, commentContent);
            if (res.success) {
                setCommentContent("");
                refreshData();
            }
        } catch (error) {
            console.error(error);
            alert("Lỗi kết nối server");
        }
    };

    const handlePostReply = async (parentId) => {
        if (!token || !currentUser) {
            alert("Vui lòng đăng nhập để trả lời!");
            return;
        }
        if (!replyContent.trim()) return;

        try {
            const res = await addBlogComment(blogId, replyContent, parentId);
            if (res.success) {
                setReplyingId(null);
                setReplyContent("");
                refreshData();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa bình luận này?")) return;
        try {
            const res = await deleteComment(id);
            if (res.success) refreshData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdate = async (id) => {
        if (!editContent.trim()) return;
        try {
            const res = await updateComment(id, editContent);
            if (res.success) {
                setEditingId(null);
                setEditContent("");
                refreshData();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="comments-section" style={{ marginTop: 24 }}>
            <h3 className="section-title">
                <i className="fa-regular fa-comments"></i> Bình luận bài viết
            </h3>

            {token && currentUser ? (
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
                                onError={(e) => (e.target.src = "https://i.pravatar.cc/150")}
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
                                onClick={handlePostRootComment}
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

            <div className="comments-list">
                {comments?.length > 0 ? (
                    <CommentThread
                        comments={comments}
                        currentUser={currentUser}
                        onReplyClick={handleActionClick}
                        onDelete={handleDelete}
                        onUpdate={handleUpdate}
                        onPostReply={handlePostReply}
                        replyingId={replyingId}
                        editingId={editingId}
                        editContent={editContent}
                        setEditContent={setEditContent}
                        replyContent={replyContent}
                        setReplyContent={setReplyContent}
                    />
                ) : (
                    <p style={{ textAlign: "center", color: "#777", padding: "24px 0" }}>
                        Chưa có bình luận nào. Hãy là người đầu tiên!
                    </p>
                )}
            </div>
        </div>
    );
};

export default BinhLuanBlog;