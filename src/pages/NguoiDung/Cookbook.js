import React from 'react';
import { Link } from 'react-router-dom';

const CookBook = () => {
  return (
    <main className="main-content">
      <div className="content-header-flex">
        <div className="header-text">
          <h1>Cookbook của tôi</h1>
          <p>Bộ sưu tập các công thức yêu thích được phân loại theo chủ đề.</p>
        </div>
        {/* Lưu ý: Trong Blade cũ bạn để thẻ <a> bên trong <button>, điều này không hợp lệ trong HTML/React.
            Tôi đã gộp lại thành một thẻ <Link> có class button để giữ nguyên giao diện.
        */}
        <Link to="/nguoidung/taocookbook" className="btn btn-primary">
          <i className="fa-solid fa-plus"></i> Tạo Cookbook mới
        </Link>
      </div>

      <div className="dashboard-search">
        <i className="fa-solid fa-magnifying-glass"></i>
        <input type="text" placeholder="Tìm kiếm bộ sưu tập..." />
      </div>

      <div className="cookbook-grid">
        {/* Card 1 */}
        <div className="cb-card">
          <div className="cb-img-wrapper">
            <Link to="/nguoidung/chitietcookbook">
              <img 
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop" 
                alt="Eat Clean" 
              />
            </Link>
            <span className="cb-count">
              <i className="fa-solid fa-book-open"></i> 12 món
            </span>
          </div>
          <div className="cb-body">
            <h3 className="cb-title">Thực đơn Eat Clean</h3>
            <p className="cb-desc">Các món ăn ít calo, tốt cho sức khỏe và giữ dáng mỗi ngày.</p>
            <div className="cb-footer">
              <span className="cb-time">
                <i className="fa-regular fa-clock"></i> 2 giờ trước
              </span>
              <Link to="/nguoidung/chitietcookbook" className="cb-link">
                Xem chi tiết <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="cb-card">
          <div className="cb-img-wrapper">
            <Link to="/nguoidung/chitietcookbook">
              <img 
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop" 
                alt="Món ngon đãi tiệc" 
              />
            </Link>
            <span className="cb-count">
              <i className="fa-solid fa-book-open"></i> 8 món
            </span>
          </div>
          <div className="cb-body">
            <h3 className="cb-title">Món ngon đãi tiệc</h3>
            <p className="cb-desc">Danh sách các món nướng và lẩu phù hợp cho tụ tập bạn bè cuối tuần.</p>
            <div className="cb-footer">
              <span className="cb-time">
                <i className="fa-regular fa-clock"></i> 1 ngày trước
              </span>
              <Link to="/nguoidung/chitietcookbook" className="cb-link">
                Xem chi tiết <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="cb-card">
          <div className="cb-img-wrapper">
            <Link to="/nguoidung/chitietcookbook">
              <img 
                src="https://images.unsplash.com/photo-1496116218417-1a781b1c423c?q=80&w=1000&auto=format&fit=crop" 
                alt="Bữa sáng" 
              />
            </Link>
            <span className="cb-count">
              <i className="fa-solid fa-book-open"></i> 5 món
            </span>
          </div>
          <div className="cb-body">
            <h3 className="cb-title">Bữa sáng 15 phút</h3>
            <p className="cb-desc">Nhanh gọn, đầy đủ dinh dưỡng cho buổi sáng bận rộn.</p>
            <div className="cb-footer">
              <span className="cb-time">
                <i className="fa-regular fa-clock"></i> 3 ngày trước
              </span>
              <Link to="/nguoidung/chitietcookbook" className="cb-link">
                Xem chi tiết <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};

export default CookBook;