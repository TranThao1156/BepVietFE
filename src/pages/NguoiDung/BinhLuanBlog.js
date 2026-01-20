// File: src/pages/NguoiDung/BinhLuanBlog.js (hoặc đường dẫn như trong ảnh của bạn)
import React, { useState, useEffect } from 'react';
// Nhớ kiểm tra kỹ đường dẫn import API này có đúng với thư mục của bạn không
import { addBlogComment, updateComment, deleteComment } from '../../api/binhLuanBlogApi'; 

// ĐỔI TÊN COMPONENT THÀNH BinhLuanBlog CHO KHỚP TÊN FILE
const BinhLuanBlog = ({ blogId, initialComments = [], currentUser }) => {
    
    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState("");
    
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState("");

    // --- XỬ LÝ 1: THÊM BÌNH LUẬN ---
    const handleAdd = async () => {
        if (!newComment.trim()) return; 

        if (!currentUser) {
            alert("Bạn cần đăng nhập để bình luận!");
            return;
        }

        try {
            const res = await addBlogComment(blogId, newComment);
            if (res.success) {
                setComments([res.data, ...comments]);
                setNewComment(""); 
            } else {
                alert(res.message || "Lỗi khi thêm");
            }
        } catch (error) {
            console.error(error);
            alert("Lỗi kết nối server");
        }
    };

    // --- XỬ LÝ 2: XÓA BÌNH LUẬN ---
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;

        try {
            const res = await deleteComment(id);
            if (res.success) {
                setComments(comments.filter(c => c.Ma_BL !== id));
            } else {
                alert(res.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // --- XỬ LÝ 3: SỬA BÌNH LUẬN ---
    const startEdit = (comment) => {
        setEditingId(comment.Ma_BL);       
        setEditContent(comment.NoiDungBL); 
    };

    const handleUpdate = async (id) => {
        try {
            const res = await updateComment(id, editContent);
            if (res.success) {
                setComments(comments.map(c => 
                    c.Ma_BL === id ? { ...c, NoiDungBL: editContent } : c
                ));
                setEditingId(null); 
            } else {
                alert(res.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="blog-comments-section" style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            <h3>Bình luận</h3>

            {/* Ô NHẬP BÌNH LUẬN */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input 
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Viết bình luận của bạn..."
                    style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <button 
                    onClick={handleAdd}
                    style={{ padding: '10px 20px', backgroundColor: '#ff6600', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Gửi
                </button>
            </div>

            {/* DANH SÁCH BÌNH LUẬN */}
            <div className="comment-list">
                {comments.length === 0 && <p>Chưa có bình luận nào.</p>}
                
                {comments.map((item) => (
                    <div key={item.Ma_BL} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '40px', height: '40px', backgroundColor: '#ddd', borderRadius: '50%' }}>
                                <img 
                                    src={item.nguoi_dung?.AnhDaiDien || "https://via.placeholder.com/40"} 
                                    alt="Avatar" 
                                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                />
                            </div>
                            
                            <div style={{ flex: 1 }}>
                                <strong>{item.nguoi_dung?.HoTen || "Người dùng"}</strong>
                                
                                {editingId === item.Ma_BL ? (
                                    <div style={{ marginTop: '5px' }}>
                                        <input 
                                            value={editContent} 
                                            onChange={(e) => setEditContent(e.target.value)}
                                            style={{ width: '100%', padding: '5px' }}
                                        />
                                        <div style={{ marginTop: '5px', fontSize: '12px' }}>
                                            <button onClick={() => handleUpdate(item.Ma_BL)} style={{ color: 'blue', marginRight: '10px', cursor: 'pointer', background:'none', border:'none' }}>Lưu</button>
                                            <button onClick={() => setEditingId(null)} style={{ color: 'gray', cursor: 'pointer', background:'none', border:'none' }}>Hủy</button>
                                        </div>
                                    </div>
                                ) : (
                                    <p style={{ margin: '5px 0' }}>{item.NoiDungBL}</p>
                                )}
                            </div>

                            {currentUser && (currentUser.id === item.Ma_ND || currentUser.VaiTro === 0) && editingId !== item.Ma_BL && (
                                <div style={{ fontSize: '12px' }}>
                                    {currentUser.id === item.Ma_ND && (
                                        <button onClick={() => startEdit(item)} style={{ color: 'blue', marginRight: '10px', background:'none', border:'none', cursor:'pointer' }}>Sửa</button>
                                    )}
                                    <button onClick={() => handleDelete(item.Ma_BL)} style={{ color: 'red', background:'none', border:'none', cursor:'pointer' }}>Xóa</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 👇 XUẤT RA ĐÚNG TÊN COMPONENT MỚI
export default BinhLuanBlog;