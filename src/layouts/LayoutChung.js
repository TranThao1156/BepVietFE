import React, { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../assets/css/style.css";

const LayoutChung = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);

  // ✅ LOAD USER TỪ LOCALSTORAGE
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [location.pathname]);
  // ✅ LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    alert("👋 Đã đăng xuất");
  };

  // Hàm kiểm tra link active (thay thế cho request()->routeIs() của Laravel)
  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <header>
        <div className="container header-inner">
          {/* Logo */}
          <Link to="/" className="logo">
            <i className="fa-solid fa-utensils"></i> Bếp Việt
          </Link>

          {/* Menu điều hướng */}
          <nav>
            <ul className="nav-links">
              <li>
                <Link to="/" className={isActive("/")}>
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/cong-thuc" className={isActive("/cong-thuc")}>
                  Công thức
                </Link>
              </li>
              <li>
                <Link to="/blog" className={isActive("/blog")}>
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/ai-chat" className={isActive("/ai-chat")}>
                  AI Thông minh
                </Link>
              </li>
            </ul>
          </nav>

          {/* Khu vực bên phải */}
          <div className="header-right">
            <div className="toolbar-actions">
              <div className="search-box">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input type="text" placeholder="Tìm kiếm công thức..." />
                <button className="btn-search">Tìm</button>
              </div>
            </div>

            {user ? (
              <div className="user-dropdown">
                <img
                  className="user-avatar"
                  src={
                    user.AnhDaiDien
                      ? `http://localhost:8000/img/NguoiDung/${user.AnhDaiDien}`
                      : "http://localhost:8000/img/NguoiDung/default-avatar.png"
                  }
                  alt="avatar"
                />
                <div className="user-menu">
                  <p className="user-name">{user.HoTen}</p>
                  <p className="user-email">{user.Email}</p>
                  <p
                    className={`vai-tro ${user.VaiTro === 0 ? "admin" : "user"}`}
                  >
                    {user.VaiTro === 0 ? "Quản trị viên" : "Người dùng"}
                  </p>

                  <hr />

                  {/* --- LOGIC ĐIỀU HƯỚNG THEO VAI TRÒ --- */}
                  {user.VaiTro === 0 ? (
                    // Nếu là ADMIN (0) -> Link tới trang Quản trị
                    <Link to="/quan-tri/kiem-duyet">Quản lý hệ thống</Link>
                  ) : (
                    // Nếu là USER (1) -> Link tới trang Thông tin cá nhân
                    <Link to="/nguoi-dung/thong-tin-ca-nhan">
                      Thông tin cá nhân
                    </Link>
                  )}

                  <button onClick={handleLogout}>Đăng xuất</button>
                </div>
              </div>
            ) : (
              <Link to="/dang-nhap" className="btn btn-primary">
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      {/* <Outlet /> đóng vai trò như @yield('content') trong Blade.
         Nó sẽ hiển thị nội dung của các trang con (Home, Blog, AI...) tại đây.
      */}
      <Outlet />

      {/* ================= FOOTER ================= */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <Link to="/" className="logo">
                <i className="fa-solid fa-utensils"></i> Bếp Việt
              </Link>
              <p className="footer-desc">
                Nơi chia sẻ niềm đam mê nấu nướng và khám phá ẩm thực Việt Nam.
                Kết nối hàng triệu bếp ăn gia đình.
              </p>
            </div>
            <div className="footer-col">
              <h3>Khám phá</h3>
              <ul>
                <li>Công thức mới</li>
                <li>Món ngon theo mùa</li>
                <li>Video hướng dẫn</li>
                <li>Top đầu bếp</li>
              </ul>
            </div>
            <div className="footer-col">
              <h3>Cộng đồng</h3>
              <ul>
                <li>Chia sẻ công thức</li>
                <li>Blog ẩm thực</li>
                <li>Thử thách nấu ăn</li>
              </ul>
            </div>
            <div className="footer-col">
              <h3>Liên hệ</h3>
              <ul>
                <li>contact@bepviet.vn</li>
                <li>123 Đường ABC, Hà Nội</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LayoutChung;
