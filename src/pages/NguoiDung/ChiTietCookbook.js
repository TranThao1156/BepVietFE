import React from 'react';
import { Link } from 'react-router-dom';

const ChiTietCookbook = () => {
  // Hàm xử lý xóa cookbook
  const handleDelete = () => {
    if (window.confirm('Bạn có chắc muốn xóa Cookbook này không?')) {
      // Gọi API xóa ở đây
      console.log('Đã xóa cookbook');
    }
  };

  // Hàm xử lý bỏ lưu món ăn
  const handleUnsave = (recipeName) => {
    if (window.confirm(`Bạn muốn bỏ món "${recipeName}" khỏi bộ sưu tập?`)) {
      console.log('Đã bỏ lưu:', recipeName);
    }
  };

  return (
    <main className="main-content">
      {/* Nút Quay lại */}
      <div style={{ marginBottom: '20px' }}>
        <Link 
          to="/user/cookbook" 
          style={{ 
            textDecoration: 'none', 
            color: 'var(--text-gray)', 
            fontSize: '0.9rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '5px' 
          }}
        >
          <i className="fa-solid fa-arrow-left"></i> Quay lại danh sách Cookbook
        </Link>
      </div>

      {/* Hero Section - Thông tin Cookbook */}
      <div className="cookbook-hero">
        <div className="hero-cover">
          <img 
            src="https://i.pinimg.com/564x/a5/6e/b7/a56eb7232d398e4ba436fc713d3d6448.jpg" 
            alt="Cover" 
          />
        </div>
        <div className="hero-info">
          <div className="hero-meta">
            <span><i className="fa-solid fa-layer-group"></i> 12 Công thức</span>
          </div>

          <h1 className="hero-title">Món ngon đãi tiệc cuối tuần</h1>
          
          <div className="hero-actions">
            <Link 
              to="/user/cookbook/edit/1" // Giả sử ID là 1
              className="btn btn-outline-gray" 
              style={{ padding: '8px 20px' }}
            >
              <i className="fa-solid fa-pen"></i> Chỉnh sửa
            </Link>
            
            <button 
              className="btn btn-outline-gray" 
              onClick={handleDelete}
              style={{ padding: '8px 20px', color: '#EF4444', borderColor: '#FECACA' }}
            >
              <i className="fa-regular fa-trash-can"></i> Xóa
            </button>
          </div>
        </div>
      </div>

      {/* Filter / Search Toolbar */}
      <div className="filter-toolbar">
        <div className="result-count">Danh sách món ăn (4)</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="dashboard-search" style={{ marginBottom: 0, width: '250px' }}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <input 
              type="text" 
              placeholder="Tìm trong bộ sưu tập..." 
              style={{ padding: '10px 10px 10px 40px' }}
            />
          </div>
        </div>
      </div>

      {/* Grid danh sách món ăn đã lưu */}
      <div className="saved-recipe-grid">

        {/* Card 1 */}
        <div className="saved-card">
          <div className="saved-thumb">
            <img src="https://i.pinimg.com/564x/0a/27/3f/0a273f1107297e55554477c956976214.jpg" alt="Food" />
            <button 
              className="btn-unsave" 
              title="Bỏ lưu khỏi Cookbook này"
              onClick={() => handleUnsave('Phở Bò Gia Truyền')}
            >
              <i className="fa-solid fa-minus"></i>
            </button>
          </div>
          <div className="saved-body">
            <div className="saved-author">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" />
              <span>Bếp của Lan</span>
            </div>
            <Link to="#" className="saved-title">Phở Bò Gia Truyền Nam Định - Nước dùng đậm đà</Link>
            <div className="saved-meta-row">
              <div className="meta-item"><i className="fa-regular fa-clock"></i> 60p</div>
              <div className="meta-item"><i className="fa-solid fa-star" style={{ color: '#F59E0B' }}></i> 4.8</div>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="saved-card">
          <div className="saved-thumb">
            <img src="https://i.pinimg.com/564x/78/3d/e2/783de21b4a3a60e513511eb49594f6f2.jpg" alt="Food" />
            <button 
              className="btn-unsave" 
              title="Bỏ lưu"
              onClick={() => handleUnsave('Gà nướng mật ong')}
            >
              <i className="fa-solid fa-minus"></i>
            </button>
          </div>
          <div className="saved-body">
            <div className="saved-author">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" />
              <span>Chef Tuấn</span>
            </div>
            <Link to="#" className="saved-title">Gà nướng mật ong sốt tiêu đen</Link>
            <div className="saved-meta-row">
              <div className="meta-item"><i className="fa-regular fa-clock"></i> 45p</div>
              <div className="meta-item"><i className="fa-solid fa-star" style={{ color: '#F59E0B' }}></i> 4.5</div>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="saved-card">
          <div className="saved-thumb">
            <img src="https://i.pinimg.com/564x/4a/07/74/4a07747e9282855140d348006236b28b.jpg" alt="Food" />
            <button 
              className="btn-unsave" 
              title="Bỏ lưu"
              onClick={() => handleUnsave('Salad bơ trứng')}
            >
              <i className="fa-solid fa-minus"></i>
            </button>
          </div>
          <div className="saved-body">
            <div className="saved-author">
              <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="User" />
              <span>Mẹ Gấu</span>
            </div>
            <Link to="#" className="saved-title">Salad bơ trứng lòng đào Healthy</Link>
            <div className="saved-meta-row">
              <div className="meta-item"><i className="fa-regular fa-clock"></i> 15p</div>
              <div className="meta-item"><i className="fa-solid fa-star" style={{ color: '#F59E0B' }}></i> 4.9</div>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="saved-card">
          <div className="saved-thumb">
            <img src="https://i.pinimg.com/564x/55/54/10/5554101e406f52233800247657924619.jpg" alt="Food" />
            <button 
              className="btn-unsave" 
              title="Bỏ lưu"
              onClick={() => handleUnsave('Bò Lúc Lắc')}
            >
              <i className="fa-solid fa-minus"></i>
            </button>
          </div>
          <div className="saved-body">
            <div className="saved-author">
              <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="User" />
              <span>Huy MasterChef</span>
            </div>
            <Link to="#" className="saved-title">Bò Lúc Lắc khoai tây chiên kiểu Pháp</Link>
            <div className="saved-meta-row">
              <div className="meta-item"><i className="fa-regular fa-clock"></i> 30p</div>
              <div className="meta-item"><i className="fa-solid fa-star" style={{ color: '#F59E0B' }}></i> 4.7</div>
            </div>
          </div>
        </div>

      </div>

    </main>
  );
};

export default ChiTietCookbook;