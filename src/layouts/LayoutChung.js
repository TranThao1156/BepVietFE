import React, { useEffect, useState, useRef } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"; // Trâm -thêm useNavigate
import "../assets/css/style.css";

const LayoutChung = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Trâm -thêm: Khai báo state lưu từ khóa và hook chuyển trang
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  // Khanh - State cho Thông báo
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);

  // LOAD USER TỪ LOCALSTORAGE
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [location.pathname]);

  // Khanh - Xử lý đăng xuất
  const handleLogout = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn đăng xuất?")) return;

    const token = localStorage.getItem("access_token");

    // Gọi API logout trên server (nếu có)
    try {
      if (token) {
        await fetch("http://127.0.0.1:8000/api/user/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      // Xử lý lỗi logout âm thầm
    }

    // Xóa token và user ở localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null); // Cập nhật state ngay lập tức

    alert("Đã đăng xuất thành công!");
    navigate("/");
  };

  // Trâm -thêm: Hàm xử lý khi bấm nút Tìm kiếm
  const handleSearch = () => {
    // Chuyển hướng sang trang công thức kèm từ khóa trên URL
    navigate(`/cong-thuc?keyword=${encodeURIComponent(keyword)}`);
  };

  // Hàm kiểm tra link active
  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  // Khanh - Hàm lấy thông báo
  const fetchNotifications = async () => {
    const token = localStorage.getItem("access_token");
    if (user && token) {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/user/thong-bao",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            const data = result.data || [];
            setNotifications(data);
          }
        }
      } catch (error) {
        // Xử lý lỗi fetch thầm lặng
      }
    }
  };

  // Gọi hàm lấy thông báo khi User thay đổi
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      const token = localStorage.getItem("access_token");
      if (token) {
        fetchNotifications();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [user]);

  const handleReadNotification = async (notif) => {
    // 1. GỌI API ĐÁNH DẤU ĐÃ ĐỌC (Giữ nguyên logic cũ của bạn)
    if (notif.TrangThai === 0) {
      const token = localStorage.getItem("access_token");
      try {
        await fetch(
          `http://127.0.0.1:8000/api/user/thong-bao/${notif.Ma_TB}/da-doc`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Cập nhật state local
        setNotifications(
          notifications.map((n) =>
            n.Ma_TB === notif.Ma_TB ? { ...n, TrangThai: 1 } : n
          )
        );
      } catch (error) {
        // Xử lý lỗi update thầm lặng
      }
    }

    // Đóng dropdown
    setShowNotif(false);

    // 2. XỬ LÝ CHUYỂN HƯỚNG
    // Chuyển về chữ thường để so sánh cho chắc chắn
    const loai = notif.LoaiThongBao ? notif.LoaiThongBao.toLowerCase() : "";

    // --- TRƯỜNG HỢP ADMIN (DUYỆT BÀI) ---
    if (
      notif.TieuDe.includes("Yêu cầu duyệt") ||
      notif.NoiDung.includes("chờ duyệt")
    ) {
      if (loai === "congthuc") {
        // Đúng với route: path="kiem-duyet-cong-thuc"
        navigate(`/quan-tri/kiem-duyet-cong-thuc?ma=${notif.MaLoai}`);
      } else if (loai === "blog") {
        // Đúng với route: path="kiem-duyet"
        navigate(`/quan-tri/kiem-duyet?ma=${notif.MaLoai}`);
      }
    }
    // --- TRƯỜNG HỢP USER (XEM CHI TIẾT) ---
    else {
      if (loai === "congthuc") {
        navigate(`/cong-thuc/${notif.MaLoai}`);
      } else if (loai === "blog") {
        navigate(`/blog/${notif.MaLoai}`);
      }
    }
  };

  // Xử lý click ra ngoài để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Tính số lượng chưa đọc
  const unreadCount = notifications.filter((n) => n.TrangThai === 0).length;

  return (
    <>
      {/* ================= HEADER ================= */}
      <div className="app-layout">
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

            <div className="header-right">
              <div className="toolbar-actions">
                <div className="search-box">
                  <i className="fa-solid fa-magnifying-glass"></i>

                  {/* Trâm -thêm: Sự kiện nhập liệu và bấm Enter */}
                  <input
                    type="text"
                    placeholder="Tìm kiếm công thức..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onFocus={(e) => e.target.select()}
                  />

                  {/* Trâm -thêm: Sự kiện click nút Tìm */}
                  <button className="btn-search" onClick={handleSearch}>
                    Tìm
                  </button>
                </div>
              </div>
              <div className="header-right-actions">
                {user && (
                  <div className="notification-wrapper" ref={notifRef}>
                    {/* NÚT CHUÔNG */}
                    <div
                      className="notification-btn"
                      onClick={() => setShowNotif(!showNotif)}
                    >
                      <i
                        className={`fa-regular fa-bell ${showNotif ? "active" : ""}`}
                      ></i>
                      {unreadCount > 0 && (
                        <span className="badge-count">{unreadCount}</span>
                      )}
                    </div>
                    {/* DROPDOWN */}
                    {showNotif && (
                      <div className="notification-dropdown">
                        <div className="notif-header">
                          <h3>Thông báo</h3>
                        </div>
                        <div className="notif-list">
                          {notifications.length > 0 ? (
                            notifications.map((item) => (
                              <div
                                key={item.Ma_TB}
                                className={`notif-item ${item.TrangThai === 0 ? "unread" : ""}`}
                                onClick={() => handleReadNotification(item)}
                              >
                                <div className="notif-content">
                                  <p className="notif-text">{item.NoiDung}</p>
                                </div>
                                {item.TrangThai === 0 && (
                                  <span className="dot-unread"></span>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="empty-notif">
                              Không có thông báo mới
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {user ? (
                <div className="user-dropdown">
                  <img
                    className="user-avatar"
                    src={
                      user.AnhDaiDien
                        ? `http://localhost:8000/storage/img/NguoiDung/${user.AnhDaiDien}`
                        : "http://localhost:8000/storage/img/NguoiDung/default-avatar.png"
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
                      <>
                        <Link to="/nguoi-dung/thong-tin-ca-nhan">
                          Hồ sơ cá nhân
                        </Link>

                        <Link to="/quan-tri">Quản lý hệ thống</Link>
                      </>
                    ) : (
                      // Nếu là USER (1) -> Link tới trang Thông tin cá nhân
                      <Link to="/nguoi-dung/thong-tin-ca-nhan">
                        Hồ sơ cá nhân
                      </Link>
                    )}

                    <div className="sidebar-footer">
                      <button onClick={handleLogout} className="logout-btn">
                        <i className="fas fa-sign-out-alt"></i> Đăng xuất
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="btn btn-primary">
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
                  Nơi chia sẻ niềm đam mê nấu nướng và khám phá ẩm thực Việt
                  Nam. Kết nối hàng triệu bếp ăn gia đình.
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
      </div>
    </>
  );
};

export default LayoutChung;