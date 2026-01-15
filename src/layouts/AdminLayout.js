import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../assets/admin.css'; // Import CSS riêng cho Admin

const AdminLayout = () => {
    return (
        <div className="admin-container">
            {/* --- SIDEBAR --- */}
            <nav className="sidebar">
                <div className="logo-area">
                    <i className="fas fa-utensils"></i> Bếp Việt
                </div>

                <div className="admin-profile">
                    <div className="avatar-circle">
                        <img src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff" alt="Admin Avatar" />
                    </div>
                    <div className="profile-info">
                        <h3>Admin</h3>
                        <span>Quản trị viên</span>
                    </div>
                </div>

                <div className="sidebar-nav">
                    <ul>
                        <li>
                            {/* end: Để chỉ active khi đúng chính xác đường dẫn /admin */}
                            <NavLink to="/admin" end className={({ isActive }) => isActive ? "active" : ""}>
                                <i className="fas fa-chart-pie"></i> Bảng điều khiển
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/quanlynguoidung" className={({ isActive }) => isActive ? "active" : ""}>
                                <i className="fas fa-users"></i> Quản lý Người dùng
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/kiemduyet" className={({ isActive }) => isActive ? "active" : ""}>
                                <i className="fas fa-file-alt"></i> Kiểm duyệt nội dung
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/quanlydanhmuc" className={({ isActive }) => isActive ? "active" : ""}>
                                <i className="fas fa-tags"></i> Quản lý Danh mục
                            </NavLink>
                        </li>
                    </ul>
                </div>

                <div className="sidebar-footer">
                    <a href="/" className="logout-btn">
                        <i className="fas fa-sign-out-alt"></i> Đăng xuất
                    </a>
                </div>
            </nav>

            {/* --- NỘI DUNG CHÍNH (Thay thế @yield) --- */}
            <Outlet />

        </div>
    );
};

export default AdminLayout;