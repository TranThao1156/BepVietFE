import React, { useState } from 'react';

const DoiMatKhau = () => {
  // State để quản lý việc ẩn/hiện cho 3 ô input
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý logic đổi mật khẩu ở đây
    alert('Đã gửi yêu cầu đổi mật khẩu!');
  };

  return (
    <main className="main-content">
      <div className="content-header">
        <h1>Đổi mật khẩu</h1>
        <p>Cập nhật mật khẩu thường xuyên để bảo vệ tài khoản của bạn.</p>
      </div>

      {/* Profile Card */}
      <div className="profile-card" style={{ marginBottom: '20px' }}>
        <div className="avatar-wrapper">
          <div className="avatar-circle">NA</div>
          <button className="btn-upload-avatar">
            <i className="fa-solid fa-camera"></i>
          </button>
        </div>
        <h2 className="user-fullname">Nguyễn Văn A</h2>
        <p className="user-handle">@nguyenvana</p>
        <div className="member-since">
          <i className="fa-solid fa-shield-halved"></i> Thành viên từ: 20/10/2023
        </div>
      </div>

      {/* Form Đổi mật khẩu */}
      <div className="password-form-container">
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Mật khẩu hiện tại</label>
            <div className="password-input-wrapper">
              <input 
                type={showCurrentPass ? "text" : "password"} 
                placeholder="Nhập mật khẩu hiện tại" 
              />
              <i 
                className={`fa-regular ${showCurrentPass ? "fa-eye-slash" : "fa-eye"} toggle-password`}
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                style={{ cursor: 'pointer' }}
              ></i>
            </div>
          </div>

          <div className="form-group">
            <label>Mật khẩu mới</label>
            <div className="password-input-wrapper">
              <input 
                type={showNewPass ? "text" : "password"} 
                placeholder="Nhập mật khẩu mới" 
              />
              <i 
                className={`fa-regular ${showNewPass ? "fa-eye-slash" : "fa-eye"} toggle-password`}
                onClick={() => setShowNewPass(!showNewPass)}
                style={{ cursor: 'pointer' }}
              ></i>
            </div>
          </div>

          <div className="form-group">
            <label>Xác nhận mật khẩu mới</label>
            <div className="password-input-wrapper">
              <input 
                type={showConfirmPass ? "text" : "password"} 
                placeholder="Nhập lại mật khẩu mới" 
              />
              <i 
                className={`fa-regular ${showConfirmPass ? "fa-eye-slash" : "fa-eye"} toggle-password`}
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                style={{ cursor: 'pointer' }}
              ></i>
            </div>
          </div>

          <div className="form-actions-left">
            <button type="button" className="btn btn-outline-gray">Hủy bỏ</button>
            <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
          </div>

        </form>
      </div>
    </main>
  );
};

export default DoiMatKhau;