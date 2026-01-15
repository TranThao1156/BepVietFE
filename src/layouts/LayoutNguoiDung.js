import React from 'react';
import { NavLink, Link, Outlet } from 'react-router-dom';

// Import CSS của bạn (đường dẫn có thể thay đổi tùy cấu trúc thư mục thực tế)
import '../assets/css/profile-style.css';
import '../assets/css/style.css';




const LayoutNguoiDung = () => {
  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar-menu">
        <div className="sidebar-logo">
          {/* Giả sử trang chủ là "/" */}
          <Link to="/" className="logo">
            <i className="fa-solid fa-utensils"></i> Bếp Việt
          </Link>
        </div>

        <nav className="sidebar-nav">
          {/* Sử dụng NavLink để tự động xử lý class "active".
             Logic: ({ isActive }) => isActive ? 'nav-item active' : 'nav-item'
          */}
          
          <NavLink 
            to="/nguoidung/thongtincanhan" 
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          >
            <i className="fa-regular fa-user"></i> Thông tin cá nhân
          </NavLink>

          <NavLink 
            to="/nguoidung/qlcongthuc" 
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          >
            <i className="fa-solid fa-book-open"></i> Quản lý công thức
          </NavLink>

          <NavLink 
            to="/nguoidung/cookbook" 
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          >
            <i className="fa-solid fa-book-bookmark"></i> Cookbook của tôi
          </NavLink>

          <NavLink 
            to="/nguoidung/qlblog" 
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          >
            <i className="fa-solid fa-pen-to-square"></i> Quản lý bài viết
          </NavLink>

          <NavLink 
            to="/nguoidung/doimatkhau" 
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          >
            <i className="fa-solid fa-lock"></i> Đổi mật khẩu
          </NavLink>

          <NavLink 
            to="/nguoidung/lichsutruycap" 
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          >
            <i className="fa-solid fa-clock-rotate-left"></i> Lịch sử công thức
          </NavLink>
        </nav>

        <div className="sidebar-footer" style={{ marginBottom: '10px' }}>
          <Link to="/" className="btn-logout">
            <i className="fa-solid fa-arrow-left"></i> Trở về trang chủ
          </Link>
        </div>

        <div className="sidebar-footer">
          <Link to="/logout" className="btn-logout">
            <i className="fa-solid fa-arrow-right-from-bracket"></i> Đăng xuất
          </Link>
        </div>
      </aside>

      {/* Đây là nơi nội dung các trang con sẽ hiển thị (thay thế cho @yield('content')) */}
      <Outlet />

    </div>
  );
};

export default LayoutNguoiDung;