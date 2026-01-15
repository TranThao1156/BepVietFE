import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const TaoCookbook = () => {
  const navigate = useNavigate();

  // State quản lý form
  const [visibility, setVisibility] = useState('public');
  const [coverImage, setCoverImage] = useState(null);

  // Xử lý xem trước ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(URL.createObjectURL(file));
    }
  };

  // Xử lý submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic gọi API tạo cookbook
    console.log({ visibility, coverImage });
    alert('Đã tạo Cookbook thành công!');
    navigate('/user/cookbook');
  };

  return (
    <main className="main-content">
      
      <form onSubmit={handleSubmit} className="create-cookbook-container">
        
        <div className="page-header-flex">
          <div>
            <h2>Tạo CookBook</h2>
            <p>Tạo nơi lưu trữ các công thức yêu thích của bạn.</p>
          </div>
        </div>

        <div className="form-group">
          <label>Tên bộ sưu tập <span style={{ color: 'red' }}>*</span></label>
          <input 
            type="text" 
            placeholder="Ví dụ: Món ngon đãi tiệc cuối tuần..." 
            required 
          />
        </div>

        <div className="form-group">
          <label>Trạng thái hiển thị</label>
          
          <div className="visibility-options">
            {/* Option Public */}
            <label className="vis-option-label">
              <input 
                type="radio" 
                name="visibility" 
                value="public" 
                checked={visibility === 'public'}
                onChange={() => setVisibility('public')}
              />
              <div className="vis-card">
                <div className="vis-icon-box">
                  <i className="fa-solid fa-globe"></i>
                </div>
                <div className="vis-content">
                  <span className="vis-title">Công khai (Public)</span>
                  <span className="vis-desc">Mọi người đều có thể xem bộ sưu tập này.</span>
                </div>
                <i className="fa-solid fa-circle-check vis-check-icon"></i>
              </div>
            </label>

            {/* Option Private */}
            <label className="vis-option-label">
              <input 
                type="radio" 
                name="visibility" 
                value="private"
                checked={visibility === 'private'}
                onChange={() => setVisibility('private')}
              />
              <div className="vis-card">
                <div className="vis-icon-box">
                  <i className="fa-solid fa-lock"></i>
                </div>
                <div className="vis-content">
                  <span className="vis-title">Riêng tư (Private)</span>
                  <span className="vis-desc">Chỉ mình bạn mới có thể xem.</span>
                </div>
                <i className="fa-solid fa-circle-check vis-check-icon"></i>
              </div>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Ảnh bìa bộ sưu tập</label>
          <div 
            className="upload-area-minimal"
            style={coverImage ? { 
              backgroundImage: `url(${coverImage})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center',
              color: 'white',
              border: 'none',
              position: 'relative' // Để lớp phủ (overlay) hoạt động nếu cần
            } : {}}
          >
            {/* Nếu có ảnh thì ẩn icon mặc định đi hoặc hiển thị icon sửa */}
            <div style={coverImage ? { background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '8px' } : {}}>
                <i className={coverImage ? "fa-solid fa-pen" : "fa-regular fa-image"}></i>
                <span style={{ marginLeft: '8px' }}>
                    {coverImage ? "Thay đổi ảnh bìa" : "Tải ảnh bìa (Tùy chọn)"}
                </span>
            </div>
            
            <input 
                type="file" 
                className="hidden-input" 
                accept="image/*"
                onChange={handleImageChange}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
            />
          </div>
        </div>

        <div className="form-actions" style={{ marginTop: '40px', borderTop: '1px solid #F3F4F6', paddingTop: '20px' }}>
          <Link to="/nguoidung/cookbook" className="btn-outline-gray" style={{ border: '1px solid #E5E7EB', textDecoration: 'none' }}>
            Hủy bỏ
          </Link>
          <button 
            type="submit" 
            className="btn" 
            style={{ 
              background: 'var(--primary-color)', 
              color: 'white', 
              padding: '10px 24px', 
              borderRadius: '8px', 
              border: 'none', 
              fontWeight: 600, 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px' 
            }}
          >
            <i className="fa-solid fa-plus"></i> Tạo Cookbook
          </button>
        </div>

      </form>

    </main>
  );
};

export default TaoCookbook;