import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Thi - Tạo blog mới
const TaoBlog = () => {
  const navigate = useNavigate();
  // State quản lý dữ liệu form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [coverImage, setCoverImage] = useState(null); // preview
  const [imageFile, setImageFile] = useState(null);   // file gửi BE

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);

  
  // Xử lý khi chọn ảnh để hiển thị preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setCoverImage(URL.createObjectURL(file)); // Tạo URL tạm để preview
    }
  };
  // Xử lý file ảnh drag and drop
  const handleFile = (file) => {
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Chỉ được chọn file ảnh");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("Ảnh tối đa 5MB");
    return;
  }

  setImageFile(file);
  setCoverImage(URL.createObjectURL(file));
};

  // Xử lý submit form
    const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || !imageFile) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("TieuDe", title);
    formData.append("ND_ChiTiet", content);
    formData.append("HinhAnh", imageFile);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/user/them-blog", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
        body: formData,
      });

      // ĐỌC TEXT TRƯỚC
      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("Server trả về HTML:", text);
        alert("Server đang lỗi, vui lòng thử lại");
        return;
      }

      if (!response.ok) {
        alert(data.message || "Đăng bài thất bại");
        return;
      }

      // Thành công
      alert("Đăng bài thành công! Bài viết đang chờ duyệt");
      navigate("/nguoi-dung/ql-blog");

    } catch (error) {
      console.error(error);
      alert("Không kết nối được server");
    } finally {
      setLoading(false);
    }
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          {/* ---------------Xử lý ảnh bìa-------------- */}
          <div className="form-group">
            <label>Ảnh bìa bài viết</label>
            <div
              className={`upload-area-large ${coverImage ? "has-image" : ""} ${
                isDragging ? "dragging" : ""
              }`}
              style={
                coverImage
                  ? { backgroundImage: `url(${coverImage})`, padding: "30px" }
                  : { padding: "30px" }
              }
              onClick={() => fileInputRef.current.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFile(e.dataTransfer.files[0]);
              }}
            >
              <div className="upload-content">
                {coverImage ? (
                  <>
                    <i className="fa-solid fa-pen-to-square upload-icon" style={{ fontSize: "2rem" }}></i>
                    <p style={{ fontSize: "0.9rem" }}>
                      <strong>Nhấn để thay đổi ảnh</strong>
                    </p>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-cloud-arrow-up upload-icon" style={{ fontSize: "2rem" }}></i>
                    <p style={{ fontSize: "0.9rem" }}>
                      <strong>Nhấn để tải ảnh hoặc kéo thả vào đây</strong>
                    </p>
                    <span className="upload-note">JPG, PNG (Tối đa 5MB)</span>
                  </>
                )}
              </div>

              {/* input ẩn */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden-input"
                accept="image/*"
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </div>
          </div>

          {/* ---------------Xử lý nội dung bài viết-------------- */}
          <div className="form-group">
            <label>Nội dung chi tiết</label>
            <div className="editor-wrapper">
              {/* <div className="editor-toolbar">
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
              </div> */}
              <textarea 
                className="editor-textarea" 
                placeholder="Bắt đầu viết câu chuyện của bạn tại đây..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              ></textarea>
              
            </div>
          </div>

          {/* ---------------Xử lý nút đăng bài-------------- */}
          <div className="form-submit-area">
            <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
              <i className="fa-regular fa-paper-plane"></i> {loading ? " Đang đăng..." : " Đăng bài"}
            </button>
          </div>

        </form>
      </div>

    </main>
  );
};

export default TaoBlog;