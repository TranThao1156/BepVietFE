import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ThongTinCaNhan = () => {
  const navigate = useNavigate();
  const API_URL = "http://127.0.0.1:8000"; // URL Laravel

  // State lưu toàn bộ thông tin người dùng
  const [userData, setUserData] = useState({
    TenTK: "",
    HoTen: "",
    Email: "",
    Sdt: "",
    DiaChi: "",
    GioiTinh: "Nam",
    QuocTich: "",
    AnhDaiDien: "",
    created_at: "", // Ngày tham gia
  });

  // State xử lý ảnh và giao diện
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Danh sách các quốc gia phổ biến (Bạn có thể thêm nếu cần)
  const DS_QUOC_GIA = [
    "Việt Nam",
    "Hoa Kỳ",
    "Nhật Bản",
    "Hàn Quốc",
    "Trung Quốc",
    "Anh",
    "Pháp",
    "Đức",
    "Nga",
    "Canada",
    "Úc",
    "Thái Lan",
    "Singapore",
    "Malaysia",
    "Lào",
    "Campuchia",
    "Khác",
  ];

  // 1. Lấy thông tin (Sử dụng GET theo chuẩn RESTful)
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/dang-nhap");
      return;
    }

    // Lưu ý: Đảm bảo route trong api.php là Route::get('/ho-so', ...)
    fetch(`${API_URL}/api/user/ho-so`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setUserData(json.data);
        } else {
          alert("Lỗi tải dữ liệu: " + json.message);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [navigate]);

  // 2. Xử lý nhập liệu (Text inputs)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Xử lý chọn ảnh Avatar (Xem trước)
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewAvatar(URL.createObjectURL(file)); // Tạo link ảo để xem ngay
    }
  };

  // 4. Gửi dữ liệu cập nhật
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);

    const token = localStorage.getItem("access_token");
    const formData = new FormData();

    // Chỉ gửi các trường cho phép sửa
    formData.append("HoTen", userData.HoTen);
    formData.append("Email", userData.Email); // Gửi để validate unique (dù ko sửa)
    formData.append("Sdt", userData.Sdt || "");
    formData.append("DiaChi", userData.DiaChi || "");
    formData.append("GioiTinh", userData.GioiTinh || "Nữ");
    formData.append("QuocTich", userData.QuocTich || "");

    // Nếu có file ảnh mới thì gửi lên
    if (selectedFile) {
      formData.append("AnhDaiDien", selectedFile);
    }

    fetch(`${API_URL}/api/user/ho-so/cap-nhat`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Không set Content-Type để browser tự set multipart/form-data
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          alert("Cập nhật hồ sơ thành công!");
          setUserData(json.data); // Cập nhật lại state với dữ liệu mới từ server
          setPreviewAvatar(null);
          setSelectedFile(null);
        } else {
          alert("Lỗi: " + json.message);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Lỗi kết nối server");
      })
      .finally(() => setIsSaving(false));
  };

  // Helper: Xử lý link ảnh
  const getAvatarUrl = () => {
    if (previewAvatar) return previewAvatar; // Ưu tiên ảnh vừa chọn
    if (userData.AnhDaiDien) {
      // Nếu là link online (Google/FB)
      if (userData.AnhDaiDien.startsWith("http")) return userData.AnhDaiDien;
      // Nếu là ảnh upload local
      return `${API_URL}/storage/img/NguoiDung/${userData.AnhDaiDien}`;
    }
    return "https://via.placeholder.com/150?text=User"; // Ảnh mặc định
  };

  // Helper: Format ngày
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (loading)
    return <div className="loading-state">Đang tải thông tin...</div>;

  return (
   
      <main className="main-content">
         <div className="user-profile-page">
        <div className="content-header">
          <h1>Thông tin cá nhân</h1>
          <p>Quản lý thông tin hồ sơ để bảo mật tài khoản.</p>
        </div>

        {/* Card Avatar & Thông tin chung */}
        <div className="profile-card">
          <div className="avatar-wrapper">
            <img
              src={getAvatarUrl()}
              alt="Avatar"
              className="avatar-circle2"
            />

            {/* Nút camera để chọn ảnh */}
            <label htmlFor="upload-avatar" className="btn-upload-avatar">
              <i className="fa-solid fa-camera"></i>
            </label>
            <input
              type="file"
              id="upload-avatar"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
          </div>

          <h2 className="user-fullname">{userData.HoTen}</h2>
          <p className="user-handle">@{userData.TenTK}</p>

          <div className="member-since">
            <i className="fa-solid fa-shield-halved"></i> Thành viên từ:{" "}
            {formatDate(userData.created_at)}
          </div>
        </div>

        {/* Form chi tiết */}
        <div className="password-form-container">
          <form onSubmit={handleSubmit}>
            {/* --- CÁC TRƯỜNG KHÔNG CHO SỬA (DISABLED) --- */}
            <div className="form-group">
              <label>Tên đăng nhập</label>
              <input
                type="text"
                value={userData.TenTK}
                className="form-control"
                disabled // Khóa
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <div className="input-icon-group">
                <input
                  type="email"
                  value={userData.Email}
                  className="form-control"
                  disabled // Khóa
                />
                <i className="fa-solid fa-envelope input-icon"></i>
              </div>
              <small className="helper-text">
                Không thể thay đổi email đăng nhập.
              </small>
            </div>

            {/* --- CÁC TRƯỜNG ĐƯỢC PHÉP SỬA --- */}
            <div className="form-group">
              <label>Họ và tên</label>
              <input
                type="text"
                name="HoTen"
                value={userData.HoTen}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                type="tel"
                name="Sdt"
                value={userData.Sdt}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Giới tính</label>
                <select
                  name="GioiTinh"
                  value={userData.GioiTinh}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>

              <div className="form-group">
                <label>Quốc tịch</label>
                <select
                  name="QuocTich"
                  value={userData.QuocTich}
                  onChange={handleInputChange}
                  className="form-select" // Dùng class form-select để đẹp hơn
                >
                  <option value="">-- Chọn quốc gia --</option>
                  {DS_QUOC_GIA.map((quocGia) => (
                    <option key={quocGia} value={quocGia}>
                      {quocGia}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Địa chỉ</label>
              <textarea
                name="DiaChi"
                rows="3"
                value={userData.DiaChi}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Nhập địa chỉ của bạn..."
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="form-actions-left">
              <button
                type="button"
                className="btn btn-outline-gray"
                onClick={() => window.location.reload()} // Reset form
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSaving}
              >
                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        </div>
        </div>
      </main>
  );
};

export default ThongTinCaNhan;
