import React, { useEffect, useMemo, useState } from 'react';
import { changePassword } from '../../api/doimatkhauApi';

const DoiMatKhau = () => {
  const API_URL = 'http://127.0.0.1:8000';

  // Trâm - đã thêm: load thông tin user + ảnh đại diện (tránh hiển thị NA tĩnh)

  // State để quản lý việc ẩn/hiện cho 3 ô input
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = useMemo(() => {
    return (
      localStorage.getItem('access_token') ||
      localStorage.getItem('token') ||
      localStorage.getItem('user_token')
    );
  }, []);

  useEffect(() => {
    if (!token) return;

    // Load hồ sơ để có HoTen/TenTK/AnhDaiDien (tránh hiển thị tĩnh NA)
    fetch(`${API_URL}/api/user/ho-so`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json?.success && json?.data) {
          setCurrentUser(json.data);
          // Đồng bộ lại localStorage để header/avatar các nơi khác cũng cập nhật
          try {
            localStorage.setItem('user', JSON.stringify(json.data));
          } catch {}
        }
      })
      .catch(() => {
        // ignore
      });
  }, [token]);

  const avatarSrc = useMemo(() => {
    const filename = currentUser?.AnhDaiDien;
    if (!filename) return `${API_URL}/storage/img/NguoiDung/default-avatar.png`;
    if (typeof filename === 'string' && filename.startsWith('http')) return filename;
    return `${API_URL}/storage/img/NguoiDung/${encodeURIComponent(filename)}`;
  }, [currentUser]);

  const joinedDate = useMemo(() => {
    const v = currentUser?.created_at;
    if (!v) return 'N/A';
    try {
      return new Date(v).toLocaleDateString('vi-VN');
    } catch {
      return 'N/A';
    }
  }, [currentUser]);

  const onChange = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    try {
      setSubmitting(true);

      // NOTE: Nếu backend dùng tên field khác (vd: oldPassword/newPassword), sửa lại tại đây cho khớp.
      const payload = await changePassword({
        current_password: form.currentPassword,          // Sửa thành current_password
        new_password: form.newPassword,                  // Sửa thành new_password
        new_password_confirmation: form.confirmPassword
      });

      // Chấp nhận vài dạng response phổ biến
      const msg =
        (payload && (payload.message || payload.msg)) ||
        'Đổi mật khẩu thành công.';
      setSuccess(msg);

      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err?.message || 'Đổi mật khẩu thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="main-content">
      <div className="content-header">
        <h1>Đổi mật khẩu</h1>
        <p>Cập nhật mật khẩu thường xuyên để bảo vệ tài khoản của bạn.</p>
      </div>

      {/* Profile Card */}
      <div className="profile-card" style={{ marginBottom: '20px' }}>
        <div className="avatar-wrapper">
          <img
            src={avatarSrc}
            alt="Avatar"
            className="avatar-circle2"
            onError={(e) => {
              e.currentTarget.src = `${API_URL}/storage/img/NguoiDung/default-avatar.png`;
            }}
          />
        </div>
        <h2 className="user-fullname">{currentUser?.HoTen || 'N/A'}</h2>
        <p className="user-handle">@{currentUser?.TenTK || '...'}</p>
        <div className="member-since">
          <i className="fa-solid fa-shield-halved"></i> Thành viên từ: {joinedDate}
        </div>
      </div>

      {/* Form Đổi mật khẩu */}
      <div className="password-form-container">
        <form onSubmit={handleSubmit}>
          {error ? <div className="alert alert-danger">{error}</div> : null}
          {success ? <div className="alert alert-success">{success}</div> : null}

          <div className="form-group">
            <label>Mật khẩu hiện tại</label>
            <div className="password-input-wrapper">
              <input
                type={showCurrentPass ? "text" : "password"}
                placeholder="Nhập mật khẩu hiện tại"
                value={form.currentPassword}
                onChange={onChange('currentPassword')}
                autoComplete="current-password"
              />
              <i 
                className={`fa-regular ${showCurrentPass ? "fa-eye-slash" : "fa-eye"} toggle-password`}
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                style={{ cursor: 'pointer' }}
              ></i>
            </div>
          </div>

          <div className="form-group">
            <label>Mật khẩu mới</label>
            <div className="password-input-wrapper">
              <input
                type={showNewPass ? "text" : "password"}
                placeholder="Nhập mật khẩu mới"
                value={form.newPassword}
                onChange={onChange('newPassword')}
                autoComplete="new-password"
              />
              <i 
                className={`fa-regular ${showNewPass ? "fa-eye-slash" : "fa-eye"} toggle-password`}
                onClick={() => setShowNewPass(!showNewPass)}
                style={{ cursor: 'pointer' }}
              ></i>
            </div>
          </div>

          <div className="form-group">
            <label>Xác nhận mật khẩu mới</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPass ? "text" : "password"}
                placeholder="Nhập lại mật khẩu mới"
                value={form.confirmPassword}
                onChange={onChange('confirmPassword')}
                autoComplete="new-password"
              />
              <i 
                className={`fa-regular ${showConfirmPass ? "fa-eye-slash" : "fa-eye"} toggle-password`}
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                style={{ cursor: 'pointer' }}
              ></i>
            </div>
          </div>

          <div className="form-actions-left">
            <button
              type="button"
              className="btn btn-outline-gray"
              onClick={() => {
                setError('');
                setSuccess('');
                setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
              }}
              disabled={submitting}
            >
              Hủy bỏ
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default DoiMatKhau;