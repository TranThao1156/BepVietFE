import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SuaCongThuc = () => {
  // State quản lý danh sách nguyên liệu (để demo tính năng thêm/xóa)
  const [ingredients, setIngredients] = useState([
    { id: 1, name: 'Bánh phở tươi', qty: '500', unit: 'g' },
    { id: 2, name: 'Thịt bò tái', qty: '300', unit: 'g' },
    { id: 3, name: 'Xương ống', qty: '1', unit: 'kg' },
  ]);

  // State quản lý các bước làm (demo thêm bước)
  const [steps, setSteps] = useState([
    { 
      id: 1, 
      content: 'Rửa sạch xương bò, trần qua nước sôi để khử mùi hôi. Nướng gừng, hành tím cho thơm rồi thả vào nồi nước dùng.', 
      image: 'https://i.pinimg.com/564x/0a/27/3f/0a273f1107297e55554477c956976214.jpg' 
    },
    { 
      id: 2, 
      content: 'Ninh xương trong khoảng 4-6 tiếng. Thường xuyên vớt bọt để nước dùng được trong. Nêm nếm gia vị vừa ăn.', 
      image: null 
    },
  ]);

  // Xử lý xóa nguyên liệu
  const removeIngredient = (id) => {
    setIngredients(ingredients.filter(item => item.id !== id));
  };

  // Xử lý thêm nguyên liệu mới (dòng trống)
  const addIngredient = () => {
    const newId = ingredients.length > 0 ? Math.max(...ingredients.map(i => i.id)) + 1 : 1;
    setIngredients([...ingredients, { id: newId, name: '', qty: '', unit: '' }]);
  };

  // Xử lý thêm bước mới
  const addStep = () => {
    const newId = steps.length > 0 ? Math.max(...steps.map(s => s.id)) + 1 : 1;
    setSteps([...steps, { id: newId, content: '', image: null }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Đã lưu thay đổi công thức!');
  };

  return (
    <main className="main-content">
      
      <div className="page-header-flex">
        <div>
          <h2>Chỉnh sửa công thức</h2>
          <p>Cập nhật thông tin cho món ăn của bạn.</p>
        </div>
        <Link to="/nguoi-dung/ql-cong-thuc" className="btn-outline-gray">
          <i className="fa-solid fa-arrow-left"></i> Quay lại
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="create-recipe-form">
        
        {/* Phần 1: Ảnh bìa */}
        <div className="form-section-card">
          <div className="section-title-sm"><i className="fa-regular fa-image"></i> ẢNH BÌA MÓN ĂN</div>
          
          <div className="upload-area-large has-image">
            <div className="upload-content">
              <i className="fa-solid fa-pen-to-square upload-icon"></i>
              <p><strong>Nhấn để thay đổi ảnh</strong></p>
              <span className="upload-note">Ảnh hiện tại: pho-bo.jpg</span>
            </div>
            <input type="file" className="hidden-input" />
          </div>
        </div>

        {/* Phần 2: Thông tin chung */}
        <div className="form-section-card">
          <div className="section-title-sm"><i className="fa-solid fa-circle-info"></i> THÔNG TIN CHUNG</div>
          
          <div className="form-group">
            <label>Tên món ăn</label>
            <input type="text" defaultValue="Phở bò gia truyền" placeholder="Ví dụ: Phở bò gia truyền" />
          </div>

          <div className="form-group">
            <label>Mô tả ngắn</label>
            <textarea 
              placeholder="Giới thiệu đôi nét về món ăn của bạn..."
              defaultValue="Phở bò là món ăn truyền thống lâu đời, mang hương vị đậm đà của nước dùng hầm xương và thảo mộc."
            ></textarea>
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
                <select defaultValue="tb">
                  <option value="de">Dễ</option>
                  <option value="tb">Trung bình</option>
                  <option value="kho">Khó</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Vùng miền</label>
              <div className="input-icon-group">
                <i className="fa-solid fa-map-location-dot"></i>
                <select defaultValue="Miền Bắc">
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
                <span className="tag-chip">Phở <i className="fa-solid fa-xmark"></i></span>
                <input type="text" placeholder="Thêm..." />
              </div>
            </div>
          </div>
        </div>

        {/* Phần 3: Nguyên liệu (Dynamic List) */}
        <div className="form-section-card">
          <div className="section-title-sm"><i className="fa-solid fa-basket-shopping"></i> NGUYÊN LIỆU</div>
          
          <div className="ingredients-wrapper">
            <div className="ingredients-header">
              <span>Tên nguyên liệu</span>
              <span>Số lượng</span>
              <span>Đơn vị</span>
            </div>
            
            {ingredients.map((ing) => (
              <div className="ingredient-row" key={ing.id}>
                <input type="text" defaultValue={ing.name} className="ing-name" placeholder="Tên..." />
                <input type="text" defaultValue={ing.qty} className="ing-qty" placeholder="SL" />
                <input type="text" defaultValue={ing.unit} className="ing-unit" placeholder="Đv" />
                <button 
                  type="button" 
                  className="action-btn delete"
                  onClick={() => removeIngredient(ing.id)}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            ))}
          </div>

          <button type="button" className="btn-dashed-full" onClick={addIngredient}>
            <i className="fa-solid fa-plus"></i> Thêm nguyên liệu
          </button>
        </div>

        {/* Phần 4: Cách làm (Dynamic List) */}
        <div className="form-section-card">
          <div className="section-title-sm"><i className="fa-solid fa-list-ol"></i> CÁCH LÀM</div>
          
          <div className="steps-wrapper">
            {steps.map((step, index) => (
              <div className="step-input-item" key={step.id}>
                <div className="step-num-badge">{index + 1}</div>
                <div className="step-input-content">
                  <textarea defaultValue={step.content} placeholder="Mô tả bước thực hiện..."></textarea>
                  <div className="step-media-area">
                    {step.image ? (
                      <div className="mini-img-preview">
                        <img src={step.image} alt="Preview" /> 
                        <button type="button" className="remove-img"><i className="fa-solid fa-xmark"></i></button>
                      </div>
                    ) : (
                      <div className="add-step-img">
                        <i className="fa-solid fa-camera"></i>
                        <span>Thêm ảnh</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button type="button" className="btn-dashed-full" onClick={addStep}>
            <i className="fa-solid fa-plus"></i> Thêm bước mới
          </button>
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

export default SuaCongThuc;