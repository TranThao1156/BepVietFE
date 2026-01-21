import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../assets/css/admin.css"; // Import CSS riêng cho Admin

const AdminLayout = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("access_token");
  const user = isLoggedIn
    ? JSON.parse(localStorage.getItem("user") || "{}")
    : null;
  // Khanh -  Hàm xử lý đăng xuất
  const handleLogout = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn đăng xuất?")) return;

    const token = localStorage.getItem("access_token");

    // Gọi API logout (nếu backend có route)
    try {
      if (token) {
        const response = await fetch("http://127.0.0.1:8000/api/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.warn("API logout thất bại, vẫn xóa token local");
        }
      }
    } catch (error) {
      console.error("Lỗi gọi API logout:", error);
    }

    // Xóa token và user ở localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    alert("Đăng xuất thành công!");
    navigate("/");
    window.location.reload();
  };
  return (
    <div className="admin-container">
      {/* --- SIDEBAR --- */}
      <nav className="sidebar">
        {/* <div className="logo-area">
                    <i className="fas fa-utensils"></i> Bếp Việt
                </div> */}
        <Link to="/" className="logo-area">
          <i className="fa-solid fa-utensils"></i> Bếp Việt
        </Link>

        <div className="admin-profile">
          <div className="avatar-circle">
            <img
              src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff"
              alt="Admin Avatar"
            />
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
              <NavLink
                to="/quan-tri"
                end
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="fas fa-chart-pie"></i> Bảng điều khiển
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/quan-tri/quan-ly-nguoi-dung"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="fas fa-users"></i> Quản lý Người dùng
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/quan-tri/kiem-duyet"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="fas fa-file-alt"></i> Kiểm duyệt nội dung
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/quan-tri/quan-ly-danh-muc"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="fas fa-tags"></i> Quản lý Danh mục
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i> Đăng xuất
          </button>
        </div>
        <div className="sidebar-footer">
          <a href="/" className="logout-btn">
            <i className="fas fa-sign-out-alt"></i> Trở về trang chính
          </a>
        </div>
      </nav>

      {/* --- NỘI DUNG CHÍNH (Thay thế @yield) --- */}
      <Outlet />
    </div>
  );
};

export default AdminLayout;
