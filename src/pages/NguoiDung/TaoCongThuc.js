import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const TaoCongThuc = () => {
  const navigate = useNavigate();

  // --- STATE QUẢN LÝ ---
  
  // 1. Ảnh bìa
  const [coverImage, setCoverImage] = useState(null);

  // 2. Danh sách nguyên liệu (Mặc định có 1 dòng trống)
  const [ingredients, setIngredients] = useState([
    { id: 1, name: '', qty: '', unit: '' }
  ]);

  // 3. Danh sách các bước làm (Mặc định có 1 bước trống)
  const [steps, setSteps] = useState([
    { id: 1, content: '', image: null }
  ]);

  // --- HÀM XỬ LÝ (HANDLERS) ---

  // Xử lý ảnh bìa
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(URL.createObjectURL(file));
    }
  };

  // Thêm nguyên liệu mới
  const addIngredient = () => {
    const newId = ingredients.length > 0 ? Math.max(...ingredients.map(i => i.id)) + 1 : 1;
    setIngredients([...ingredients, { id: newId, name: '', qty: '', unit: '' }]);
  };

  // Xóa nguyên liệu
  const removeIngredient = (id) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter(item => item.id !== id));
    }
  };

  // Thêm bước làm mới
  const addStep = () => {
    const newId = steps.length > 0 ? Math.max(...steps.map(s => s.id)) + 1 : 1;
    setSteps([...steps, { id: newId, content: '', image: null }]);
  };

  // Xóa bước làm
  const removeStep = (id) => {
    if (steps.length > 1) {
      setSteps(steps.filter(item => item.id !== id));
    }
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic gọi API backend ở đây
    console.log({ ingredients, steps });
    alert('Công thức đã được tạo thành công!');
    navigate('/user/recipes');
  };

  return (
    <main className="main-content">
      
      <div className="content-header">
        <h1>Tạo công thức mới</h1>
        <p>Chia sẻ niềm đam mê nấu nướng của bạn với cộng đồng Bếp Việt.</p>
      </div>

      <form onSubmit={handleSubmit} className="create-recipe-form">
            
        {/* --- SECTION 1: ẢNH BÌA --- */}
        <div className="form-section-card">
          <div className="section-title-sm"><i className="fa-regular fa-image"></i> ẢNH BÌA MÓN ĂN</div>
          
          <div 
            className={`upload-area-large ${coverImage ? 'has-image' : ''}`}
            style={coverImage ? { backgroundImage: `url(${coverImage})`, padding: '40px' } : {}}
          >
            <div className="upload-content">
              {coverImage ? (
                <>
                  <i className="fa-solid fa-pen-to-square upload-icon" style={{color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}></i>
                  <p style={{color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}><strong>Nhấn để thay đổi ảnh</strong></p>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-cloud-arrow-up upload-icon"></i>
                  <p><strong>Nhấn để tải lên</strong> hoặc kéo thả ảnh vào đây</p>
                  <span className="upload-note">SVG, PNG, JPG (Tối đa 800x400px)</span>
                </>
              )}
            </div>
            <input type="file" className="hidden-input" onChange={handleCoverChange} accept="image/*" />
          </div>
        </div>

        {/* --- SECTION 2: THÔNG TIN CHUNG --- */}
        <div className="form-section-card">
          <div className="section-title-sm"><i className="fa-solid fa-circle-info"></i> THÔNG TIN CHUNG</div>
          
          <div className="form-group">
            <label>Tên món ăn</label>
            <input type="text" placeholder="Ví dụ: Phở bò gia truyền" required />
          </div>

          <div className="form-group">
            <label>Mô tả ngắn</label>
            <textarea placeholder="Giới thiệu đôi nét về món ăn của bạn..."></textarea>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Thời gian nấu (phút)</label>
              <div className="input-icon-group">
                <i className="fa-regular fa-clock"></i>
                <input type="number" defaultValue="60" />
              </div>
            </div>
            <div className="form-group">
              <label>Độ khó</label>
              <div className="input-icon-group">
                <i className="fa-solid fa-chart-simple"></i>
                <select>
                  <option>Dễ</option>
                  <option>Trung bình</option>
                  <option>Khó</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Vùng miền</label>
              <div className="input-icon-group">
                <i className="fa-solid fa-map-location-dot"></i>
                <select>
                  <option>Chọn vùng miền</option>
                  <option>Miền Bắc</option>
                  <option>Miền Trung</option>
                  <option>Miền Nam</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Nguyên liệu chính</label>
              <div className="tags-input-fake">
                <span className="tag-chip">Bò <i className="fa-solid fa-xmark"></i></span>
                <input type="text" placeholder="Thêm..." />
              </div>
            </div>
          </div>
        </div>

        {/* --- SECTION 3: NGUYÊN LIỆU (DYNAMIC LIST) --- */}
        <div className="form-section-card">
          <div className="section-title-sm"><i className="fa-solid fa-basket-shopping"></i> NGUYÊN LIỆU</div>
          
          <div className="ingredients-wrapper">
            <div className="ingredients-header">
              <span>Tên nguyên liệu</span>
              <span>Số lượng</span>
              <span>Đơn vị</span>
            </div>
            
            {ingredients.map((ing, index) => (
              <div className="ingredient-row" key={ing.id}>
                <input 
                  type="text" 
                  placeholder="Ví dụ: Thịt bò" 
                  className="ing-name" 
                />
                <input 
                  type="text" 
                  placeholder="SL" 
                  className="ing-qty" 
                />
                <input 
                  type="text" 
                  placeholder="Đv" 
                  className="ing-unit" 
                />
                {/* Nút xóa dòng (chỉ hiện khi có nhiều hơn 1 dòng) */}
                {ingredients.length > 1 && (
                  <button 
                    type="button" 
                    className="remove-img" 
                    style={{ marginLeft: '10px', background: 'none', color: '#EF4444', border: 'none', cursor: 'pointer' }}
                    onClick={() => removeIngredient(ing.id)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                )}
              </div>
            ))}
          </div>

          <button type="button" className="btn-dashed-full" onClick={addIngredient}>
            <i className="fa-solid fa-plus"></i> Thêm nguyên liệu
          </button>
        </div>

        {/* --- SECTION 4: CÁCH LÀM (DYNAMIC LIST) --- */}
        <div className="form-section-card">
          <div className="section-title-sm"><i className="fa-solid fa-list-ol"></i> CÁCH LÀM</div>
          
          <div className="steps-wrapper">
            
            {steps.map((step, index) => (
              <div className="step-input-item" key={step.id}>
                <div className="step-num-badge">{index + 1}</div>
                <div className="step-input-content">
                  <textarea placeholder={`Mô tả chi tiết bước ${index + 1}...`}></textarea>
                  
                  <div className="step-media-area">
                    {/* Demo UI: Nút thêm ảnh */}
                    <div className="add-step-img">
                      <i className="fa-solid fa-camera"></i>
                      <span>Thêm ảnh</span>
                    </div>
                  </div>
                </div>
                
                {/* Nút xóa bước */}
                {steps.length > 1 && (
                   <button 
                   type="button"
                   onClick={() => removeStep(step.id)}
                   style={{ position: 'absolute', top: '10px', right: '10px', border: 'none', background: 'transparent', color: '#9CA3AF', cursor: 'pointer' }}
                   title="Xóa bước này"
                 >
                   <i className="fa-solid fa-xmark"></i>
                 </button>
                )}
              </div>
            ))}

          </div>

          <button type="button" className="btn-dashed-full" onClick={addStep}>
            <i className="fa-solid fa-plus"></i> Thêm bước mới
          </button>
        </div>

        {/* --- ACTIONS --- */}
        <div className="form-submit-area">
          <Link to="/nguoidung/qlcongthuc" className="btn-outline-gray" style={{ marginRight: 'auto' }}>
            <i className="fa-solid fa-arrow-left"></i> Quay lại
          </Link>  
          <button type="submit" className="btn btn-primary btn-large">Đăng công thức</button>
        </div>

      </form>

    </main>
  );
};

export default TaoCongThuc;