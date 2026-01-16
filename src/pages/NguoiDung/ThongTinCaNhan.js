import React from 'react';

const ThongTinCaNhan = () => {
  return (
    <main className="main-content">
      {/* Phần Header tiêu đề trang */}
      <div className="content-header">
        <h1>Thông tin cá nhân</h1>
        <p>Quản lý thông tin hồ sơ để bảo mật tài khoản.</p>
      </div>

      {/* Phần Card hiển thị Avatar & Thông tin tóm tắt 
          (Lấy mẫu từ DoiMatKhau.blade.php) 
      */}
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

      {/* Form chỉnh sửa thông tin */}
      <div className="password-form-container"> 
        {/* Lưu ý: Mình tái sử dụng class 'password-form-container' từ trang Đổi mật khẩu 
            để giữ form nằm gọn ở giữa (hoặc bạn có thể tạo class mới 'profile-form-container' tương tự) 
        */}
        
        <form>
          <div className="form-group">
            <label>Họ và tên</label>
            <input 
              type="text" 
              defaultValue="Nguyễn Văn A" 
              placeholder="Nhập họ và tên của bạn" 
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <div className="input-icon-group">
                {/* Giả sử email không cho sửa (readonly) hoặc sửa cần xác thực */}
                <input 
                  type="email" 
                  defaultValue="nguyenvana@gmail.com" 
                  disabled 
                  style={{ backgroundColor: '#f9fafb', cursor: 'not-allowed' }}
                />
                <i className="fa-solid fa-envelope" style={{ right: '15px', position: 'absolute', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}></i>
            </div>
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input 
              type="tel" 
              placeholder="Nhập số điện thoại" 
              defaultValue="0987654321"
            />
          </div>

          <div className="form-group">
            <label>Giới thiệu ngắn</label>
            <textarea 
              rows="4" 
              placeholder="Chia sẻ đôi điều về bản thân bạn..."
              defaultValue="Yêu thích nấu ăn và khám phá ẩm thực Việt Nam."
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
            ></textarea>
          </div>

          <div className="form-actions-left" style={{ marginTop: '20px' }}>
            <button type="button" className="btn btn-outline-gray">Hủy bỏ</button>
            <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ThongTinCaNhan;