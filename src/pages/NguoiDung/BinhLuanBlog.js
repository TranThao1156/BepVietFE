import React, { useState, useEffect } from 'react';
import { addBlogComment, updateComment, deleteComment, getBlogComments } from '../../api/binhLuanBlogApi'; 

const BinhLuanBlog = ({ blogId, currentUser }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [replyingId, setReplyingId] = useState(null); 
    const [replyContent, setReplyContent] = useState("");

    // --- Hệ thống Styles Nội bộ ---
    const styles = {
        container: { padding: '25px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', maxWidth: '100%', margin: '20px 0' },
        header: { fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' },
        inputSection: { display: 'flex', gap: '12px', marginBottom: '25px', padding: '12px', backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #ddd', alignItems: 'center' },
        inputField: { flex: 1, padding: '10px 15px', borderRadius: '20px', border: '1px solid #eee', fontSize: '14px', outline: 'none', backgroundColor: '#f9f9f9' },
        buttonPrimary: { padding: '8px 20px', backgroundColor: '#ff6600', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
        commentWrapper: { marginBottom: '20px' },
        commentBody: { backgroundColor: '#f0f2f5', padding: '12px 16px', borderRadius: '18px', display: 'inline-block', maxWidth: '90%' },
        avatar: { width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' },
        authorName: { fontSize: '14px', fontWeight: '700', color: '#050505' },
        commentText: { fontSize: '15px', color: '#050505', margin: '4px 0' },
        actionLink: { fontSize: '12px', color: '#65676b', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginRight: '15px', padding: '5px' },
        replyContainer: { marginLeft: '50px', borderLeft: '2px solid #ddd', paddingLeft: '12px', marginTop: '8px' }
    };

    // --- 1. LOAD DANH SÁCH BÌNH LUẬN ---
    useEffect(() => {
        const loadComments = async () => {
            try {
                const res = await getBlogComments(blogId);
                if (res.success) { setComments(res.data); }
            } catch (error) { console.error("Lỗi tải bình luận:", error); }
        };
        loadComments();
    }, [blogId]);

    const refreshData = async () => {
        const res = await getBlogComments(blogId);
        if (res.success) setComments(res.data);
    };

    // --- 2. XỬ LÝ THÊM MỚI ---
    const handleAdd = async () => {
        if (!newComment.trim()) return;
        if (!currentUser) return alert("Vui lòng đăng nhập để bình luận!");
        try {
            const res = await addBlogComment(blogId, newComment);
            if (res.success) {
                setNewComment(""); 
                refreshData();
            }
        } catch (error) { alert("Lỗi kết nối server"); }
    };

    // --- 3. XỬ LÝ TRẢ LỜI ---
    const handleReply = async (parentId) => {
        if (!replyContent.trim()) return;
        try {
            const res = await addBlogComment(blogId, replyContent, parentId);
            if (res.success) {
                setReplyingId(null);
                setReplyContent("");
                refreshData();
            }
        } catch (error) { console.error(error); }
    };

    // --- 4. XỬ LÝ XÓA ---
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa bình luận này?")) return;
        try {
            const res = await deleteComment(id);
            if (res.success) refreshData();
        } catch (error) { console.error(error); }
    };

    // --- 5. XỬ LÝ CẬP NHẬT ---
    const handleUpdate = async (id) => {
        if (!editContent.trim()) return;
        try {
            const res = await updateComment(id, editContent);
            if (res.success) {
                setEditingId(null); 
                refreshData();
            }
        } catch (error) { console.error(error); }
    };

    const renderComment = (item, isReply = false) => (
        (() => {
            // Trâm - đã sửa: chuẩn hóa lấy id người dùng (Ma_ND) và mapping quan hệ nguoi_dung từ Backend
            const currentUserId = currentUser?.Ma_ND ?? currentUser?.id;
            const isOwner = Number(currentUserId) === Number(item.Ma_ND);
            const canDelete = !!currentUser && (isOwner || currentUser?.VaiTro === 0);
            const avatarUrl = item.nguoi_dung?.AnhDaiDien
                ? `http://127.0.0.1:8000/storage/img/NguoiDung/${item.nguoi_dung.AnhDaiDien}`
                : 'http://127.0.0.1:8000/storage/img/NguoiDung/default-avatar.png';

            return (
        <div key={item.Ma_BL} style={{ 
            ...styles.commentWrapper,
            marginLeft: isReply ? '45px' : '0',
            borderLeft: isReply ? '2px solid #ff660022' : 'none',
            paddingLeft: isReply ? '12px' : '0'
        }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <img 
                    src={avatarUrl}
                    style={styles.avatar} alt="avatar"
                />
                <div style={{ flex: 1 }}>
                    <div style={styles.commentBody}>
                        <div style={styles.authorName}>{item.nguoi_dung?.HoTen || "Người dùng"}</div>
                        {editingId === item.Ma_BL ? (
                            <div style={{ marginTop: '5px' }}>
                                <input 
                                    value={editContent} 
                                    onChange={(e) => setEditContent(e.target.value)} 
                                    style={{...styles.inputField, borderRadius: '8px', width: '100%'}} 
                                />
                                <div style={{marginTop: '5px'}}>
                                    <button onClick={() => handleUpdate(item.Ma_BL)} style={{...styles.actionLink, color: '#ff6600'}}>Lưu</button>
                                    <button onClick={() => { setEditingId(null); setEditContent(""); }} style={styles.actionLink}>Hủy</button>
                                </div>
                            </div>
                        ) : (
                            <p style={styles.commentText}>{item.NoiDungBL}</p>
                        )}
                    </div>

                    <div style={{ paddingLeft: '8px' }}>
                        {!isReply && (
                            <button 
                                onClick={() => {
                                    if (!currentUser) return alert("Bạn cần đăng nhập để trả lời!");
                                    setReplyingId(item.Ma_BL);
                                }} 
                                style={styles.actionLink}
                            >
                                Trả lời
                            </button>
                        )}
                        {isOwner && (
                            <>
                                <button onClick={() => { setEditingId(item.Ma_BL); setEditContent(item.NoiDungBL); }} style={styles.actionLink}>Sửa</button>
                                <button onClick={() => handleDelete(item.Ma_BL)} style={{...styles.actionLink, color: '#e74c3c'}}>Xóa</button>
                            </>
                        )}
                        {!isOwner && canDelete && (
                            <>
                                <button onClick={() => handleDelete(item.Ma_BL)} style={{...styles.actionLink, color: '#e74c3c'}}>Xóa</button>
                            </>
                        )}
                    </div>

                    {replyingId === item.Ma_BL && currentUser && (
                        <div style={{ ...styles.inputSection, marginTop: '10px' }}>
                            <input 
                                value={replyContent} 
                                onChange={(e) => setReplyContent(e.target.value)} 
                                placeholder="Viết phản hồi..."
                                style={styles.inputField}
                            />
                            <button onClick={() => handleReply(item.Ma_BL)} style={styles.buttonPrimary}>Gửi</button>
                            <button onClick={() => {setReplyingId(null); setReplyContent("");}} style={{ ...styles.actionLink, marginLeft: '10px' }}>Hủy</button>
                        </div>
                    )}
                </div>
            </div>
            {item.replies && item.replies.map(reply => renderComment(reply, true))}
        </div>
            );
        })()
    );

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <i className="fa-regular fa-comments"></i> Bình luận bài viết
            </div>
            
            <div style={styles.inputSection}>
                <input 
                    type="text" 
                    value={newComment} 
                    onChange={(e) => setNewComment(e.target.value)} 
                    placeholder={currentUser ? "Để lại bình luận của bạn..." : "Đăng nhập để tham gia thảo luận"} 
                    style={styles.inputField}
                    disabled={!currentUser}
                />
                <button 
                    onClick={handleAdd} 
                    style={{...styles.buttonPrimary, opacity: currentUser ? 1 : 0.6}}
                >
                    Gửi
                </button>
                {/* NÚT HỦY CHO BÌNH LUẬN CHÍNH */}
                {newComment.length > 0 && (
                    <button 
                        onClick={() => setNewComment("")} 
                        style={{ ...styles.actionLink, marginLeft: '5px' }}
                    >
                        Hủy
                    </button>
                )}
            </div>

            <div className="comment-list">
                {comments.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>Chưa có bình luận nào.</div>
                ) : (
                    comments.map(item => renderComment(item))
                )}
            </div>
        </div>
    );
};

export default BinhLuanBlog;