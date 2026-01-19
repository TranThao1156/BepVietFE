import React, { useState } from 'react';
import { changePassword } from '../../api/doimatkhauApi';

const DoiMatKhau = () => {
  // State để quản lý việc ẩn/hiện cho 3 ô input
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
          <div className="avatar-circle">NA</div>
          <button className="btn-upload-avatar">
            <i className="fa-solid fa-camera"></i>
          </button>
        </div>
        <h2 className="user-fullname">Nguyễn Văn A</h2>
        <p className="user-handle">@nguyenvana</p>
        <div className="member-since">
          <i className="fa-solid fa-shield-halved"></i> Thành viên từ: 20/10/2023
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