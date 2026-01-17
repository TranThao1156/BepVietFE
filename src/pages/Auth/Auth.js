import { useState } from "react";
import { login, register } from "../../api/authApi";
import "../../assets/css/auth-style.css";
import { useNavigate } from "react-router-dom";

export default function DangNhapDangKy() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [showPassword, setShowPassword] = useState({});

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();

    const data = {
      TenTK: e.target.TenTK.value,
      MatKhau: e.target.MatKhau.value,
    };

    const res = await login(data);

    if (res.success) {
      localStorage.setItem("user", JSON.stringify(res.user));
        alert("✅ Đăng nhập thành công");
        // localStorage.setItem("user", JSON.stringify(res.user));

        // Trâm- thêm Lưu Token (Thay vào chỗ dòng bị trùng)
        localStorage.setItem("token", res.token);
        navigate("/");
    } else {
      alert("❌ " + res.message);
    }
  };

  // ================= REGISTER =================
  const handleRegister = async (e) => {
    e.preventDefault();

    const matKhau = e.target.MatKhau.value;
    const confirm = e.target.MatKhauConfirm.value;

    if (matKhau !== confirm) {
      alert("❌ Mật khẩu xác nhận không khớp");
      return;
    }

    const data = {
        TenTK: e.target.TenTK.value,
        MatKhau: matKhau,
        HoTen: e.target.HoTen.value,
        Email: e.target.Email.value,
        Sdt: e.target.Sdt.value,
        GioiTinh: e.target.GioiTinh.value,
        QuocTich: e.target.QuocTich.value,
        DiaChi: e.target.DiaChi.value,
    };

    const res = await register(data);

    if (res.success) {
      alert("✅ Đăng ký thành công");
      setTab("login");
    } else {
      alert("❌ " + res.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-image">
        <div className="image-overlay">
          <h2>Welcome to Bếp Việt</h2>
          <p>Khám phá hàng ngàn công thức nấu ăn chuẩn vị Việt.</p>
        </div>
      </div>

      <div className="auth-form-container">
        <a href="/" className="auth-logo">
          <i className="fa-solid fa-utensils"></i> Bếp Việt
        </a>

        <div className="auth-tabs">
          <button
            className={`tab-btn ${tab === "login" ? "active" : ""}`}
            onClick={() => setTab("login")}
            type="button"
          >
            Đăng nhập
          </button>
          <button
            className={`tab-btn ${tab === "register" ? "active" : ""}`}
            onClick={() => setTab("register")}
            type="button"
          >
            Đăng ký
          </button>
        </div>

        {/* ========== LOGIN FORM ========== */}
        {tab === "login" && (
          <form className="auth-form active" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Tên tài khoản</label>
              <input
                type="text"
                name="TenTK"
                placeholder="Nhập tên tài khoản"
                required
              />
            </div>

            <div className="form-group">
              <label>Mật khẩu</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword.login ? "text" : "password"}
                  name="MatKhau"
                  placeholder="Nhập mật khẩu"
                  required
                />
                <i
                  className={`fa-regular fa-eye${
                    showPassword.login ? "-slash" : ""
                  } toggle-password`}
                  onClick={() => togglePassword("login")}
                ></i>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="forgot-pass">
                Quên mật khẩu?
              </button>
            </div>

            <button type="submit" className="btn-submit">
              Đăng nhập
            </button>
          </form>
        )}

        {/* ========== REGISTER FORM ========== */}
        {tab === "register" && (
          <form className="auth-form active" onSubmit={handleRegister}>
            <h3 className="form-section-title">Thông tin tài khoản</h3>

            <div className="form-group">
              <label>Tên tài khoản</label>
              <input
                type="text"
                name="TenTK"
                placeholder="Ví dụ: bepviet2024"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Mật khẩu</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword.reg ? "text" : "password"}
                    name="MatKhau"
                    placeholder="Mật khẩu"
                    required
                  />
                  <i
                    className={`fa-regular fa-eye${
                      showPassword.reg ? "-slash" : ""
                    } toggle-password`}
                    onClick={() => togglePassword("reg")}
                  ></i>
                </div>
              </div>

              <div className="form-group">
                <label>Nhập lại mật khẩu</label>
                <input
                  type="password"
                  name="MatKhauConfirm"
                  placeholder="Xác nhận"
                  required
                />
              </div>
            </div>

            <h3 className="form-section-title">Thông tin cá nhân</h3>

            <div className="form-group">
              <label>Họ và tên</label>
              <input
                type="text"
                name="HoTen"
                placeholder="Nguyễn Văn A"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="Email"
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label>Giới tính</label>
                    <select name="GioiTinh" required>
                    <option value="">-- Chọn --</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Quốc tịch</label>
                    <input
                    type="text"
                    name="QuocTich"
                    placeholder="Việt Nam"
                    required
                    />
                </div>
                </div>

                <div className="form-row">
                <div className="form-group">
                    <label>Số điện thoại</label>
                    <input
                    type="tel"
                    name="Sdt"
                    placeholder="09xxxxxxxx"
                    required
                    />
                </div>
                </div>

                <div className="form-group">
                <label>Địa chỉ</label>
                <input
                    type="text"
                    name="DiaChi"
                    placeholder="Số nhà, đường, quận..."
                    required
                />
                </div>

            <button type="submit" className="btn-submit">
              Đăng ký thành viên
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
