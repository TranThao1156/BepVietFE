import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';

const SuaNguoiDung = () => {
  const { id } = useParams(); // Lấy ID người dùng từ URL

  // State lưu thông tin người dùng (Giả lập dữ liệu ban đầu)
  const [userData, setUserData] = useState({
    username: 'nguyenvana',
    email: 'nguyenvana@gmail.com',
    fullname: 'Nguyễn Văn A',
    phone: '0987654321',
    gender: 'Nam',
    nationality: 'Việt Nam',
    address: '18 Hoàng Hoa Thám, Ba Đình, Hà Nội',
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=random'
  });

  // State xem trước ảnh mới (nếu có thay đổi)
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Xử lý thay đổi input text
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Xử lý chọn ảnh mới
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
                <h1>Chỉnh sửa người dùng</h1>
                <p className="subtitle">Cập nhật thông tin cho tài khoản ID: <strong>{id}</strong></p>
            </div>
            <div className="header-actions">
                <Link to="/quan-tri/quan-ly-nguoi-dung" className="btn btn-white">
                    <i className="fa-solid fa-arrow-left"></i> Quay lại danh sách
                </Link>
            </div>
        </div>

        <div className="card">
            <form>
                <div className="form-body">

                    {/* --- AVATAR --- */}
                    <div className="avatar-upload-area">
                        <span className="avatar-label">Ảnh đại diện</span>
                        <div className="avatar-preview" style={{ overflow: 'hidden' }}>
                            {/* Ưu tiên hiển thị ảnh mới chọn, nếu không thì hiện ảnh cũ */}
                            <img 
                                src={avatarPreview || userData.avatar} 
                                alt="Avatar" 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                            
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
                    </div>

                    {/* --- THÔNG TIN TÀI KHOẢN --- */}
                    <h4 className="form-section-title">Thông tin tài khoản</h4>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Tên tài khoản</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="username"
                                value={userData.username} 
                                readOnly 
                                style={{backgroundColor: '#f9fafb', cursor: 'not-allowed'}}
                            />
                            <small className="text-gray">Tên tài khoản không được phép thay đổi.</small>
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                name="email"
                                value={userData.email} 
                                readOnly
                                style={{backgroundColor: '#f9fafb', cursor: 'not-allowed'}}
                            />
                        </div>
                        
                        {/* Mật khẩu để trống, chỉ nhập khi muốn đổi */}
                        <div className="form-group">
                            <label>Mật khẩu mới</label>
                            <input type="password" className="form-control" placeholder="Để trống nếu không muốn thay đổi..." />
                        </div>
                        <div className="form-group">
                            <label>Vai trò (Phân quyền)</label>
                            <select 
                                className="form-control" 
                                name="role"
                                value={userData.role}
                                onChange={handleChange}
                            >
                                <option value="user">Người dùng thành viên</option>
                                <option value="admin">Quản trị viên (Admin)</option>
                            </select>
                        </div>
                    </div>

                    <hr style={{ border: 0, borderTop: '1px solid #eee', margin: '30px 0' }} />

                    {/* --- THÔNG TIN CÁ NHÂN --- */}
                    <h4 className="form-section-title">Thông tin cá nhân</h4>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Họ và tên <span className="text-red">*</span></label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="fullname"
                                value={userData.fullname}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Số điện thoại</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="phone"
                                value={userData.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Giới tính</label>
                            <select 
                                className="form-control" 
                                name="gender"
                                value={userData.gender}
                                onChange={handleChange}
                            >
                                <option>Nam</option>
                                <option>Nữ</option>
                                <option>Khác</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Quốc tịch</label>
                            <select 
                                className="form-control"
                                name="nationality"
                                value={userData.nationality}
                                onChange={handleChange}
                            >
                                <option>Việt Nam</option>
                                <option>Mỹ</option>
                                <option>Nhật Bản</option>
                                <option>Hàn Quốc</option>
                            </select>
                        </div>

                        <div className="form-group full-width">
                            <label>Địa chỉ</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="address"
                                value={userData.address}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                </div>

                <div className="card-footer-between">
                    <button type="button" className="btn-text-danger" onClick={() => alert('Chức năng xóa người dùng')}>
                        <i className="fa-solid fa-user-slash"></i> Khóa tài khoản này
                    </button>

                    <div className="action-right" style={{ display: 'flex', alignItems: 'center' }}>
                        <Link to="/quan-tri/quan-ly-nguoi-dung" className="btn-text-gray">Hủy bỏ</Link>
                        <button type="button" className="btn btn-primary" style={{marginLeft: '15px'}}>
                            <i className="fa-solid fa-save" style={{marginRight: '8px'}}></i> Lưu thay đổi
                        </button>
                    </div>
                </div>
            </form>
        </div>

    </main>
  );
};

export default SuaNguoiDung;