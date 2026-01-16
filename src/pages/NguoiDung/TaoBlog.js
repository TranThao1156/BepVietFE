import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const TaoBlog = () => {
  const navigate = useNavigate();
  const [coverImage, setCoverImage] = useState(null);

  // Xử lý khi chọn ảnh để hiển thị preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCoverImage(imageUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic gọi API thêm bài viết sẽ nằm ở đây
    alert('Đã đăng bài viết thành công!');
    navigate('/user/blog'); // Chuyển hướng về trang quản lý
  };

  return (
    <main className="main-content">
      
      <div className="content-header-flex">
        <div className="header-text">
          <h1>Viết bài chia sẻ</h1>
          <p>Chia sẻ kinh nghiệm và mẹo vặt với cộng đồng.</p>
        </div>
        <Link to="/nguoi-dung/ql-blog" className="btn btn-outline-gray btn-sm">
          <i className="fa-solid fa-arrow-left"></i> Quay lại
        </Link>
      </div>

      <div className="create-blog-container">
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Tiêu đề bài viết</label>
            <input 
              type="text" 
              placeholder="Ví dụ: 10 mẹo nấu ăn ngon bất bại..." 
              className="input-lg" 
              required
            />
          </div>

          <div className="form-group">
            <label>Ảnh bìa bài viết</label>
            
            {/* Logic hiển thị: Nếu có ảnh preview thì dùng background image, nếu chưa có thì hiện khung upload */}
            <div 
              className={`upload-area-large ${coverImage ? 'has-image' : ''}`} 
              style={
                coverImage 
                ? { backgroundImage: `url(${coverImage})`, padding: '30px' } 
                : { padding: '30px' }
              }
            >
              <div className="upload-content">
                {coverImage ? (
                  <>
                    <i className="fa-solid fa-pen-to-square upload-icon" style={{ fontSize: '2rem' }}></i>
                    <p style={{ fontSize: '0.9rem' }}><strong>Nhấn để thay đổi ảnh</strong></p>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-cloud-arrow-up upload-icon" style={{ fontSize: '2rem' }}></i>
                    <p style={{ fontSize: '0.9rem' }}><strong>Nhấn để tải ảnh hoặc kéo thả vào đây</strong></p>
                    <span className="upload-note">JPG, PNG (Tối đa 5MB)</span>
                  </>
                )}
              </div>
              <input 
                type="file" 
                className="hidden-input" 
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Nội dung chi tiết</label>
            <div className="editor-wrapper">
              <div className="editor-toolbar">
                <button type="button" className="editor-btn" title="In đậm"><i className="fa-solid fa-bold"></i></button>
                <button type="button" className="editor-btn" title="In nghiêng"><i className="fa-solid fa-italic"></i></button>
                <button type="button" className="editor-btn" title="Gạch chân"><i className="fa-solid fa-underline"></i></button>
                <div className="editor-separator"></div>
                <button type="button" className="editor-btn">H2</button>
                <button type="button" className="editor-btn">H3</button>
                <div className="editor-separator"></div>
                <button type="button" className="editor-btn" title="Danh sách"><i className="fa-solid fa-list-ul"></i></button>
                <button type="button" className="editor-btn" title="Chèn ảnh"><i className="fa-regular fa-image"></i></button>
                <button type="button" className="editor-btn" title="Chèn link"><i className="fa-solid fa-link"></i></button>
              </div>
              <textarea 
                className="editor-textarea" 
                placeholder="Bắt đầu viết câu chuyện của bạn tại đây..."
              ></textarea>
            </div>
          </div>

          <div className="form-submit-area">
            <button type="submit" className="btn btn-primary btn-large">
              <i className="fa-regular fa-paper-plane"></i> Đăng bài
            </button>
          </div>

        </form>
      </div>

    </main>
  );
};

export default TaoBlog;