import { useState } from "react";
import { login, register } from "../../api/authApi";
import "../../assets/css/auth-style.css";
import { useNavigate } from "react-router-dom";

export default function DangNhapDangKy() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [showPassword, setShowPassword] = useState({
    login: false,
    reg: false,
    confirm: false,
  });

  // State lỗi cho từng trường ở form đăng ký
  const [registerErrors, setRegisterErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);

    const data = {
      TenTK: e.target.TenTK.value.trim(),
      MatKhau: e.target.MatKhau.value,
    };

    try {
      // CHỈ GỌI API 1 LẦN DUY NHẤT Ở ĐÂY
      const res = await login(data);

      if (res.success) {
        localStorage.setItem("access_token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        alert("Đăng nhập thành công!");
        navigate("/");
      } else {
        setLoginError(res.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      setLoginError(
        error.response?.data?.message || "Tài khoản hoặc mật khẩu không đúng",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ================= REGISTER =================
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterErrors({});
    setIsLoading(true);

    const matKhau = e.target.MatKhau.value;
    const confirm = e.target.MatKhauConfirm.value;

    if (matKhau !== confirm) {
      setRegisterErrors({ MatKhauConfirm: "Mật khẩu xác nhận không khớp" });
      setIsLoading(false);
      return;
    }

    const data = {
      TenTK: e.target.TenTK.value.trim(),
      MatKhau: matKhau,
      HoTen: e.target.HoTen.value.trim(),
      Email: e.target.Email.value.trim(),
      Sdt: e.target.Sdt.value.trim(),
      GioiTinh: e.target.GioiTinh.value,
      QuocTich: e.target.QuocTich.value.trim(),
      DiaChi: e.target.DiaChi.value.trim(),
    };

    try {
      const res = await register(data);

      if (res.success) {
        // TỰ ĐỘNG ĐĂNG NHẬP NGAY SAU KHI ĐĂNG KÝ THÀNH CÔNG
        const loginData = {
          TenTK: data.TenTK,
          MatKhau: data.MatKhau,
        };

        const loginRes = await login(loginData);

        if (loginRes.success) {
          localStorage.setItem("access_token", loginRes.token);
          localStorage.setItem("user", JSON.stringify(loginRes.user));

          alert("Đăng ký và đăng nhập thành công!");
          navigate("/");
        } else {
          alert(
            "Đăng ký thành công nhưng đăng nhập tự động thất bại. Vui lòng đăng nhập thủ công.",
          );
          setTab("login");
        }
      } else {
        // Xử lý lỗi từ backend (409 Conflict cho trùng TenTK, hoặc 422 Validation)
        if (res.message?.includes("Tên tài khoản đã tồn tại")) {
          setRegisterErrors({ TenTK: "Tên tài khoản đã tồn tại" });
        } else if (res.errors) {
          const backendErrors = {};
          Object.keys(res.errors).forEach((key) => {
            backendErrors[key] = res.errors[key][0];
          });
          setRegisterErrors(backendErrors);
        } else {
          setRegisterErrors({ general: res.message || "Đăng ký thất bại" });
        }
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);

      if (error.response?.status === 409) {
        setRegisterErrors({ TenTK: "Tên tài khoản đã tồn tại" });
      } else if (error.response?.status === 422) {
        const backendErrors = {};
        Object.keys(error.response.data.errors || {}).forEach((key) => {
          backendErrors[key] = error.response.data.errors[key][0];
        });
        setRegisterErrors(backendErrors);
      } else {
        setRegisterErrors({
          general: "Lỗi kết nối server. Vui lòng thử lại!",
        });
      }
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
          >
            Đăng nhập
          </button>
          <button
            className={`tab-btn ${tab === "register" ? "active" : ""}`}
            onClick={() => setTab("register")}
            type="button"
            disabled={isLoading}
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
                disabled={isLoading}
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
                  disabled={isLoading}
                />
                <i
                  className={`fa-regular fa-eye${
                    showPassword.login ? "-slash" : ""
                  } toggle-password`}
                  onClick={() => togglePassword("login")}
                ></i>
              </div>
            </div>

            {loginError && <div className="error-message">{loginError}</div>}

            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
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
                disabled={isLoading}
              />
              {registerErrors.TenTK && (
                <div className="error-message">{registerErrors.TenTK}</div>
              )}
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
                    disabled={isLoading}
                  />
                  <i
                    className={`fa-regular fa-eye${showPassword.reg ? "-slash" : ""} toggle-password`}
                    onClick={() => togglePassword("reg")}
                  ></i>
                </div>
                {registerErrors.MatKhau && (
                  <div className="error-message">{registerErrors.MatKhau}</div>
                )}
              </div>

              <div className="form-group">
                <label>Nhập lại mật khẩu</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    name="MatKhauConfirm"
                    placeholder="Xác nhận"
                    required
                    disabled={isLoading}
                  />
                  <i
                    className={`fa-regular fa-eye${showPassword.confirm ? "-slash" : ""} toggle-password`}
                    onClick={() => togglePassword("confirm")}
                  ></i>
                </div>
                {registerErrors.MatKhauConfirm && (
                  <div className="error-message">
                    {registerErrors.MatKhauConfirm}
                  </div>
                )}
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
                disabled={isLoading}
              />
              {registerErrors.HoTen && (
                <div className="error-message">{registerErrors.HoTen}</div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="Email"
                  placeholder="email@example.com"
                  required
                  disabled={isLoading}
                />
                {registerErrors.Email && (
                  <div className="error-message">{registerErrors.Email}</div>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Giới tính</label>
                <select name="GioiTinh" required disabled={isLoading}>
                  <option value="">-- Chọn --</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
                {registerErrors.GioiTinh && (
                  <div className="error-message">{registerErrors.GioiTinh}</div>
                )}
              </div>

              <div className="form-group">
                <label>Quốc tịch</label>
                <input
                  type="text"
                  name="QuocTich"
                  placeholder="Việt Nam"
                  required
                  disabled={isLoading}
                />
                {registerErrors.QuocTich && (
                  <div className="error-message">{registerErrors.QuocTich}</div>
                )}
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
                  disabled={isLoading}
                />
                {registerErrors.Sdt && (
                  <div className="error-message">{registerErrors.Sdt}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Địa chỉ</label>
              <input
                type="text"
                name="DiaChi"
                placeholder="Số nhà, đường, quận..."
                required
                disabled={isLoading}
              />
              {registerErrors.DiaChi && (
                <div className="error-message">{registerErrors.DiaChi}</div>
              )}
            </div>

            {/* Lỗi chung cho toàn form đăng ký */}
            {registerErrors.general && (
              <div className="error-message" style={{ marginTop: "16px" }}>
                {registerErrors.general}
              </div>
            )}

            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? "Đang đăng ký..." : "Đăng ký thành viên"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
