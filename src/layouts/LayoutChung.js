import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

// Đảm bảo bạn đã copy file style.css vào thư mục src/assets/
import '../assets/css/style.css'; 

const LayoutChung = () => {
  const location = useLocation();

  // MOCK DATA: Giả lập người dùng chưa đăng nhập (user = null)
  // Nếu muốn test giao diện đã đăng nhập, hãy bỏ comment dòng dưới:
  // const user = { HoTen: 'Nguyễn Văn A', AnhDaiDien: 'https://randomuser.me/api/portraits/men/32.jpg' };
  const user = null;

  // Hàm kiểm tra link active (thay thế cho request()->routeIs() của Laravel)
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
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
                        <Link to="/" className={isActive('/')}>
                            Trang chủ
                        </Link>
                    </li>
                    <li>
                        <Link to="/cong-thuc" className={isActive('/cong-thuc')}>
                            Công thức
                        </Link>
                    </li>
                    <li>
                        <Link to="/blog" className={isActive('/blog')}>
                            Blog
                        </Link>
                    </li>
                    <li>
                        <Link to="/ai-chat" className={isActive('/ai-chat')}>
                            AI Thông minh
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Khu vực bên phải (Tìm kiếm + User) */}
            <div className="header-right">
                <div className="toolbar-actions">
                    <div className="search-box">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input type="text" placeholder="Tìm kiếm công thức..." />
                        <button className="btn-search">Tìm</button>
                    </div>
                </div>

                {user ? (
                    // Đã đăng nhập
                    <div className="user-dropdown">
                        <Link to="/thong-tin-ca-nhan">
                            <img 
                                className="user-avatar"
                                src={user.AnhDaiDien || '/images/default-avatar.png'} 
                                alt={user.HoTen} 
                            /> 
                        </Link>
                        {/* Nút logout có thể xử lý sau */}
                    </div>
                ) : (
                    // Chưa đăng nhập
                    <Link to="/login" className="btn btn-primary login-btn">
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