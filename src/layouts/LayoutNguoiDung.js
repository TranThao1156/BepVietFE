import React from "react";
import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";

// Import CSS của bạn (đường dẫn có thể thay đổi tùy cấu trúc thư mục thực tế)
import "../assets/css/profile-style.css";
import "../assets/css/style.css";

const LayoutNguoiDung = () => {
  const navigate = useNavigate(); // 2. Khởi tạo hook điều hướng

  // Khanh -  Hàm xử lý đăng xuất 
  const handleLogout = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định nếu dùng thẻ a

    if (!window.confirm("Bạn có chắc chắn muốn đăng xuất?")) return;

    const token = localStorage.getItem("access_token");

    // Gọi API logout trên server
    try {
      if (token) {
        const response = await fetch("http://127.0.0.1:8000/api/user/logout", {
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

    // Thông báo và chuyển về trang chủ
    alert("Đã đăng xuất thành công!");
    navigate("/");
  };
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
          <NavLink
            to="/nguoi-dung/thong-tin-ca-nhan"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <i className="fa-regular fa-user"></i> Thông tin cá nhân
          </NavLink>

          <NavLink
            to="/nguoi-dung/ql-cong-thuc"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <i className="fa-solid fa-book-open"></i> Quản lý công thức
          </NavLink>

          <NavLink
            to="/nguoi-dung/cookbook"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <i className="fa-solid fa-book-bookmark"></i> Cookbook của tôi
          </NavLink>

          <NavLink
            to="/nguoi-dung/ql-blog"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <i className="fa-solid fa-pen-to-square"></i> Quản lý bài viết
          </NavLink>

          <NavLink
            to="/nguoi-dung/doi-mat-khau"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <i className="fa-solid fa-lock"></i> Đổi mật khẩu
          </NavLink>

          <NavLink
            to="/nguoi-dung/lich-su-truy-cap"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <i className="fa-solid fa-clock-rotate-left"></i> Lịch sử công thức
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <Link to="/" className="logout-btn">
            <i className="fa-solid fa-arrow-left"></i>Trang chủ
          </Link>
        </div>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Đây là nơi nội dung các trang con sẽ hiển thị (thay thế cho @yield('content')) */}
      <Outlet />
    </div>
  );
};

export default LayoutNguoiDung;
