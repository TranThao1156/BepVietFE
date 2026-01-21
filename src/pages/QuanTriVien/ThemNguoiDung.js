import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ThemNguoiDung = () => {
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    TenTK: '',
    Email: '',
    MatKhau: '',
    MatKhauConfirm: '',
    HoTen: '',
    Sdt: '',
    DiaChi: '',
    GioiTinh: 'Nam',
    QuocTich: 'Việt Nam',
    VaiTro: '1'
  });
  const resetForm = () => {
    setFormData({
            TenTK: '',
            Email: '',
            MatKhau: '',
            MatKhauConfirm: '',
            HoTen: '',
            Sdt: '',
            DiaChi: '',
            GioiTinh: 'Nam',
            QuocTich: 'Việt Nam',
            VaiTro: '1'
        });

        setAvatarFile(null);
        setAvatarPreview(null);
    };

    useEffect(() => {
    resetForm();
    }, []);


  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (formData.MatKhau !== formData.MatKhauConfirm) {
      alert('Mật khẩu xác nhận không khớp');
      return;
    }
    if (!formData.TenTK || !formData.Email || !formData.MatKhau || !formData.HoTen) {
        alert("Xin hãy nhập đủ thông tin");
        return;
    }

    const payload = new FormData();

    Object.keys(formData).forEach(key => {
      if (key !== 'MatKhauConfirm') {
        payload.append(key, formData[key]);
      }
    });

    if (avatarFile) {
      payload.append('AnhDaiDien', avatarFile);
    }

    try {
      setLoading(true);

      const response = await fetch(
        'http://localhost:8000/api/admin/quan-ly-nguoi-dung/them',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Accept: 'application/json'
          },
          body: payload
        }
      );

      const contentType = response.headers.get('content-type');
      let result;

      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const text = await response.text();
        console.error(text);
        throw new Error('Phiên đăng nhập hết hạn hoặc không có quyền');
      }

      if (!response.ok) {
        throw new Error(result.message || 'Tạo người dùng thất bại');
      }

      alert('Tạo người dùng thành công');
      resetForm(); 
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= CLEANUP ================= */
  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  return (
    <main className="main-content">

      {/* --- HEADER --- */}
      <div className="page-header-flex">
        <div className="header-text">
          <h1>Thêm người dùng mới</h1>
          <p className="subtitle">Tạo tài khoản thành viên hoặc quản trị viên mới</p>
        </div>
        <div className="header-actions">
          <Link to="/quan-tri/quan-ly-nguoi-dung" className="btn btn-white">
            <i className="fa-solid fa-arrow-left"></i> Quay lại danh sách
          </Link>
        </div>
      </div>

      <div className="card">
        <form>
          <div className="form-body">

            {/* --- AVATAR UPLOAD --- */}
            <div className="avatar-upload-area">
              <span className="avatar-label">Ảnh đại diện</span>

              <div className="avatar-preview" id="previewBox" style={{ overflow: 'hidden' }}>
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                ) : (
                  <div style={{ color: '#ccc', fontSize: '2rem' }}>
                    <i className="fa-solid fa-user"></i>
                  </div>
                )}

                <label htmlFor="avatarInput" className="btn-upload-icon">
                  <i className="fa-solid fa-camera"></i>
                </label>
                <input
                  type="file"
                  id="avatarInput"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              <span className="avatar-note">
                Chấp nhận .jpg, .png (Tối đa 2MB)
              </span>
            </div>

            {/* --- THÔNG TIN TÀI KHOẢN --- */}
            <h4 className="form-section-title">Thông tin tài khoản</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Tên tài khoản <span className="text-red">*</span></label>
                <input
                  type="text"
                  name="TenTK"
                  className="form-control"
                  value={formData.TenTK}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Email <span className="text-red">*</span></label>
                <input
                  type="email"
                  name="Email"
                  className="form-control"
                  value={formData.Email}
                  onChange={handleChange}
                  autoComplete="one-time-code"
                />
              </div>

              <div className="form-group">
                <label>Mật khẩu <span className="text-red">*</span></label>
                <input
                  type="password"
                  name="MatKhau"
                  className="form-control"
                  value={formData.MatKhau}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </div>

              <div className="form-group">
                <label>Xác nhận mật khẩu <span className="text-red">*</span></label>
                <input
                  type="password"
                  name="MatKhauConfirm"
                  className="form-control"
                  value={formData.MatKhauConfirm}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <hr style={{ border: 0, borderTop: '1px solid #eee', margin: '30px 0' }} />

            {/* --- THÔNG TIN CÁ NHÂN --- */}
            <h4 className="form-section-title">Thông tin cá nhân</h4>
            <div className="form-grid">

              <div className="form-group">
                <label>Họ và tên <span className="text-red">*</span></label>
                <input
                  type="text"
                  name="HoTen"
                  className="form-control"
                  value={formData.HoTen}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  name="Sdt"
                  className="form-control"
                  value={formData.Sdt}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Giới tính</label>
                <select
                  name="GioiTinh"
                  className="form-control"
                  value={formData.GioiTinh}
                  onChange={handleChange}
                >
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
                  className="form-control"
                  value={formData.QuocTich}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group full-width">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  name="DiaChi"
                  className="form-control"
                  value={formData.DiaChi}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Vai trò</label>
                <select
                  name="VaiTro"
                  className="form-control"
                  value={formData.VaiTro}
                  onChange={handleChange}
                >
                  <option value="1">Người dùng thành viên</option>
                  <option value="0">Quản trị viên (Admin)</option>
                </select>
              </div>

            </div>
          </div>

          <div className="card-footer" style={{ justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : (
                <>
                  <i className="fa-solid fa-user-plus"></i> Thêm người dùng
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ThemNguoiDung;
