import React from 'react';
import { Link } from 'react-router-dom';

const SuaBlog = () => {
  // Hàm xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic cập nhật bài viết (API call) sẽ đặt ở đây
    console.log('Đang lưu thay đổi bài viết...');
    alert('Đã cập nhật bài viết thành công!');
  };

  return (
    <main className="main-content">
      
      <div className="page-header-flex">
        <div>
          <h2>Chỉnh sửa bài viết</h2>
          <p>Cập nhật nội dung chia sẻ của bạn.</p>
        </div>
        <Link to="/nguoidung/qlblog" className="btn-outline-gray">
          <i className="fa-solid fa-arrow-left"></i> Quay lại
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="create-blog-container">
        
        <div className="form-group">
          <label>Tiêu đề bài viết</label>
          <input 
            type="text" 
            className="input-lg" 
            defaultValue="10 mẹo nấu ăn ngon bất bại cho người mới bắt đầu" 
            placeholder="Ví dụ: 10 mẹo nấu ăn ngon bất bại..." 
          />
        </div>

        <div className="form-group">
          <label>Ảnh bìa bài viết</label>
          <div 
            className="upload-area-large has-image" 
            style={{ backgroundImage: "url('https://i.pinimg.com/564x/b8/67/20/b86720464975f7827cb63a44d8b9d8d6.jpg')" }}
          >
            <div className="upload-content">
              <i className="fa-solid fa-pen-to-square upload-icon"></i>
              <p><strong>Nhấn để thay đổi ảnh</strong></p>
            </div>
            <input type="file" className="hidden-input" />
          </div>
        </div>

        <div className="form-group">
          <label>Nội dung chi tiết</label>
          <div className="editor-wrapper">
            <div className="editor-toolbar">
              <button type="button" className="editor-btn"><i className="fa-solid fa-bold"></i></button>
              <button type="button" className="editor-btn"><i className="fa-solid fa-italic"></i></button>
              <button type="button" className="editor-btn"><i className="fa-solid fa-underline"></i></button>
              <div className="editor-separator"></div>
              <button type="button" className="editor-btn">H2</button>
              <button type="button" className="editor-btn">H3</button>
              <div className="editor-separator"></div>
              <button type="button" className="editor-btn"><i className="fa-solid fa-list-ul"></i></button>
              <button type="button" className="editor-btn"><i className="fa-regular fa-image"></i></button>
              <button type="button" className="editor-btn"><i className="fa-solid fa-link"></i></button>
            </div>
            <textarea 
              className="editor-textarea"
              defaultValue={`Bắt đầu với việc chuẩn bị nguyên liệu tươi ngon là chìa khóa của mọi món ăn. Hôm nay mình sẽ chia sẻ với các bạn những kinh nghiệm mình đúc kết được sau 5 năm đứng bếp.

1. Chọn dao đúng cách
Một con dao sắc bén không chỉ giúp bạn cắt thái dễ dàng mà còn giữ được nước ngọt trong thực phẩm...

2. Canh lửa
Lửa to hay nhỏ quyết định độ chín và màu sắc của món ăn. Với các món xào, hãy để lửa lớn...`}
            ></textarea>
          </div>
        </div>

        <div className="form-submit-group">
          <button 
            type="submit" 
            className="btn" 
            style={{ 
              background: 'var(--primary-color)', 
              color: 'white', 
              padding: '12px 30px', 
              borderRadius: '8px', 
              border: 'none', 
              fontWeight: 600, 
              fontSize: '1rem', 
              cursor: 'pointer' 
            }}
          >
            <i className="fa-solid fa-floppy-disk"></i> Lưu thay đổi
          </button>
        </div>

      </form>

    </main>
  );
};

export default SuaBlog;