import React, { useState,useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const TaoCookbook = () => {
  const navigate = useNavigate();

  // --- 1. KHAI BÁO STATE ---
  const [tenCookbook, setTenCookbook] = useState(''); // Lưu tên bộ sưu tập
  const [visibility, setVisibility] = useState('public'); // Lưu trạng thái hiển thị
  
  // Quản lý ảnh:
  const fileInputRef = useRef(null); // Tạo một tham chiếu đến thẻ input
  const [coverImagePreview, setCoverImagePreview] = useState(null); // 1. Để hiển thị xem trước
  const [fileAnh, setFileAnh] = useState(null); // 2. File thực tế để gửi về Server

  // --- 2. XỬ LÝ KHI CHỌN ẢNH ---
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Lấy file người dùng chọn
    if (file) {
        // Lưu file thật vào state
        setFileAnh(file); 
        // Tạo link ảo để xem trước
        setCoverImagePreview(URL.createObjectURL(file)); 
    }
  };

  // --- 3. XỬ LÝ SUBMIT FORM (GỌI API) ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Chuẩn bị FormData
    const formData = new FormData();
    
    // Gán các giá trị (Tên key phải khớp với Laravel Controller)
    formData.append('TenCookBook', tenCookbook);
    formData.append('Ma_ND', 1); // ID người dùng (tạm thời hardcode là 1)
    
    // Chuyển đổi trạng thái: 'public' -> 1, 'private' -> 0
    formData.append('TrangThai', visibility === 'public' ? 1 : 0);

    // Nếu có chọn ảnh thì mới gửi
    if (fileAnh) {
        formData.append('AnhBia', fileAnh);
    }

    try {
        // Gọi API Laravel
        const response = await fetch('http://127.0.0.1:8000/api/cookbook/create', {
            method: 'POST',
            body: formData, // Tự động nhận diện Multipart form data
        });

        const data = await response.json();

        if (response.ok) {
            alert('Đã tạo Cookbook thành công!');
            navigate('/nguoi-dung/cookbook');
        } else {
            console.error('Lỗi từ server:', data);
            alert('Lỗi: ' + JSON.stringify(data.errors || data.message));
        }
    } catch (error) {
        console.error('Lỗi kết nối:', error);
        alert('Không thể kết nối đến Server Laravel');
    }
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

        {/* --- FORM NHẬP TÊN --- */}
        <div className="form-group">
          <label>Tên bộ sưu tập <span style={{ color: 'red' }}>*</span></label>
          <input 
            type="text" 
            placeholder="Ví dụ: Món ngon đãi tiệc cuối tuần..." 
            required 
            value={tenCookbook}
            onChange={(e) => setTenCookbook(e.target.value)}
          />
        </div>

        {/* --- FORM CHỌN TRẠNG THÁI --- */}
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

        {/* --- FORM UPLOAD ẢNH --- */}
        <div className="form-group">
          <label>Ảnh bìa bộ sưu tập</label>
          
          {/* 1. Đây là cái hộp để hiển thị và Click */}
          <div 
            className="upload-area-minimal"
            // Khi click vào hộp này thì kích hoạt input bên dưới
            onClick={() => fileInputRef.current.click()} 
            style={{ 
              backgroundImage: coverImagePreview ? `url(${coverImagePreview})` : 'none', 
              backgroundSize: 'cover', 
              backgroundPosition: 'center',
              color: coverImagePreview ? 'white' : 'inherit', // Chữ trắng nếu có ảnh nền
              position: 'relative',
              cursor: 'pointer', // Hiện bàn tay để biết là bấm được
              border: '2px dashed #ccc', // Thêm viền để dễ nhìn vùng bấm
              padding: '40px 20px',
              textAlign: 'center',
              borderRadius: '8px'
            }}
          >
            {/* Lớp phủ mờ để đọc chữ dễ hơn khi đã có ảnh */}
            <div style={coverImagePreview ? { background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '8px', display: 'inline-block' } : {}}>
                <i className={coverImagePreview ? "fa-solid fa-pen" : "fa-regular fa-image"}></i>
                <span style={{ marginLeft: '8px', fontWeight: 500 }}>
                    {coverImagePreview ? " Thay đổi ảnh bìa" : " Tải ảnh bìa (Tùy chọn)"}
                </span>
            </div>
            
            {/* 2. Thẻ Input thật (được ẩn đi hoàn toàn) */}
            <input 
                type="file" 
                ref={fileInputRef} // Gắn ref vào đây
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: 'none' }} // Ẩn khỏi giao diện
            />
          </div>
        </div>

        <div className="form-actions" style={{ marginTop: '40px', borderTop: '1px solid #F3F4F6', paddingTop: '20px' }}>
          <Link to="/nguoi-dung/cookbook" className="btn-outline-gray" style={{ border: '1px solid #E5E7EB', textDecoration: 'none', display: 'inline-block', padding: '10px 24px', borderRadius: '8px', color: '#374151' }}>
            Hủy bỏ
          </Link>
          <button 
            type="submit" 
            className="btn" 
            style={{ 
              background: 'var(--primary-color, #f97316)', 
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