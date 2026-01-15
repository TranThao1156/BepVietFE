import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ThemNguoiDung = () => {
  // State để lưu ảnh xem trước
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Hàm xử lý khi chọn file ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarPreview(imageUrl);
    }
  };

  return (
    <main className="main-content">

        {/* --- HEADER --- */}
        <div className="page-header-flex">
            <div className="header-text">
                <h1>Thêm người dùng mới</h1> {/* Đã đổi tên tiêu đề */}
                <p className="subtitle">Tạo tài khoản thành viên hoặc quản trị viên mới</p>
            </div>
            <div className="header-actions">
                <Link to="/admin/quanlynguoidung" className="btn btn-white">
                    <i className="fa-solid fa-arrow-left"></i> Quay lại danh sách
                </Link>
            </div>
        </div>

        <div className="card">
            <form>
                <div className="form-body">

                    {/* --- AVATAR UPLOAD --- */}
                    <div className="avatar-upload-area">
                        <span className="avatar-label">Ảnh đại diện</span>
                        
                        <div className="avatar-preview" id="previewBox" style={{ overflow: 'hidden' }}>
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                            ) : (
                                <div style={{color: '#ccc', fontSize: '2rem'}}><i className="fa-solid fa-user"></i></div>
                            )}
                            
                            <label htmlFor="avatarInput" className="btn-upload-icon">
                                <i className="fa-solid fa-camera"></i>
                            </label>
                            <input 
                                type="file" 
                                id="avatarInput" 
                                hidden 
                                accept="image/*" 
                                onChange={handleImageChange} 
                            />
                        </div>
                        <span className="avatar-note">Chấp nhận .jpg, .png (Tối đa 2MB)</span>
                    </div>

                    {/* --- THÔNG TIN TÀI KHOẢN --- */}
                    <h4 className="form-section-title">Thông tin tài khoản</h4>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Tên tài khoản <span className="text-red">*</span></label>
                            <input type="text" className="form-control" placeholder="Nhập tên đăng nhập..." />
                        </div>
                        <div className="form-group">
                            <label>Email <span className="text-red">*</span></label>
                            <input type="email" className="form-control" placeholder="example@bepviet.com" />
                        </div>
                        <div className="form-group">
                            <label>Mật khẩu <span className="text-red">*</span></label>
                            <input type="password" className="form-control" placeholder="Nhập mật khẩu..." />
                        </div>
                        <div className="form-group">
                            <label>Xác nhận mật khẩu <span className="text-red">*</span></label>
                            <input type="password" className="form-control" placeholder="Nhập lại mật khẩu..." />
                        </div>
                    </div>

                    <hr style={{ border: 0, borderTop: '1px solid #eee', margin: '30px 0' }} />

                    {/* --- THÔNG TIN CÁ NHÂN --- */}
                    <h4 className="form-section-title">Thông tin cá nhân</h4>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Họ và tên <span className="text-red">*</span></label>
                            <input type="text" className="form-control" placeholder="Nguyễn Văn A" />
                        </div>
                        <div className="form-group">
                            <label>Số điện thoại</label>
                            <input type="text" className="form-control" placeholder="09xxxxxxx" />
                        </div>

                        <div className="form-group">
                            <label>Giới tính</label>
                            <select className="form-control" defaultValue="Nam">
                                <option>Nam</option>
                                <option>Nữ</option>
                                <option>Khác</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Quốc tịch</label>
                            <input type="text" className="form-control" defaultValue="Việt Nam" />
                        </div>

                        <div className="form-group full-width">
                            <label>Địa chỉ</label>
                            <input type="text" className="form-control" placeholder="Nhập địa chỉ liên hệ..." />
                        </div>

                        <div className="form-group">
                            <label>Vai trò</label>
                            {/* Chuyển từ readonly sang select để linh hoạt thêm User hoặc Admin */}
                            <select className="form-control" defaultValue="user">
                                <option value="user">Người dùng thành viên</option>
                                <option value="admin">Quản trị viên (Admin)</option>
                            </select>
                        </div>
                    </div>

                </div>

                <div className="card-footer" style={{ justifyContent: 'flex-end' }}>
                    <button type="button" className="btn btn-primary">
                        <i className="fa-solid fa-user-plus" style={{ marginRight: '8px' }}></i> Thêm người dùng
                    </button>
                </div>
            </form>
        </div>

    </main>
  );
};

export default ThemNguoiDung;