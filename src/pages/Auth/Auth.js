import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Import CSS (theo yêu cầu của bạn đã để trong assets)
// Lưu ý: Đảm bảo file css tên là auth-style.css nằm đúng đường dẫn
import '../../assets/auth-style.css'; 

const Auth = () => {
    // --- STATE QUẢN LÝ ---
    const [activeTab, setActiveTab] = useState('login'); // 'login' hoặc 'register'
    const [showPassword, setShowPassword] = useState(false); // Ẩn/hiện mật khẩu đăng nhập

    // Giả lập thông báo lỗi/thành công (Sau này sẽ lấy từ API)
    const [error, setError] = useState(null); 
    const [success, setSuccess] = useState(null);

    // --- XỬ LÝ SỰ KIỆN ---
    const handleSwitchTab = (tab) => {
        setActiveTab(tab);
        setError(null); // Xóa thông báo lỗi khi chuyển tab
        setSuccess(null);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        // Logic gọi API đăng nhập sẽ viết ở đây
        console.log("Đang xử lý đăng nhập...");
    };

    const handleRegister = (e) => {
        e.preventDefault();
        // Logic gọi API đăng ký sẽ viết ở đây
        console.log("Đang xử lý đăng ký...");
    };

    return (
        <div className="auth-wrapper">
            
            {/* --- CỘT TRÁI: HÌNH ẢNH --- */}
            <div className="auth-image">
                <div className="image-overlay">
                    <h2>Welcome to Bếp Việt</h2>
                    <p>Khám phá hàng ngàn công thức nấu ăn chuẩn vị Việt.</p>
                </div>
            </div>

            {/* --- CỘT PHẢI: FORM --- */}
            <div className="auth-form-container">
                
                {/* Logo */}
                <Link to="/" className="auth-logo">
                    <i className="fa-solid fa-utensils"></i> Bếp Việt
                </Link>

                {/* --- KHU VỰC THÔNG BÁO LỖI/THÀNH CÔNG --- */}
                {success && <div className="alert alert-success">{success}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                {/* --- TABS CHUYỂN ĐỔI --- */}
                <div className="auth-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`} 
                        onClick={() => handleSwitchTab('login')}
                    >
                        Đăng nhập
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`} 
                        onClick={() => handleSwitchTab('register')}
                    >
                        Đăng ký
                    </button>
                </div>

                {/* --- FORM ĐĂNG NHẬP --- */}
                <form 
                    className={`auth-form ${activeTab === 'login' ? 'active' : ''}`} 
                    onSubmit={handleLogin}
                >
                    <div className="form-group">
                        <label>Tên tài khoản</label>
                        <input type="text" name="username" placeholder="Nhập tên tài khoản" required />
                    </div>

                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <div className="password-input-wrapper">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name="password" 
                                placeholder="Mật khẩu" 
                                required 
                            />
                            <i 
                                className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-password active`}
                                style={{cursor: 'pointer'}}
                                onClick={() => setShowPassword(!showPassword)}
                            ></i>
                        </div>
                    </div>

                    <button type="submit" className="btn-submit">Đăng nhập</button>
                </form>

                {/* --- FORM ĐĂNG KÝ --- */}
                <form 
                    className={`auth-form ${activeTab === 'register' ? 'active' : ''}`} 
                    onSubmit={handleRegister}
                >
                    <h3 className="form-section-title">Thông tin tài khoản</h3>

                    <div className="form-group">
                        <label>Tên tài khoản</label>
                        <input type="text" name="username" placeholder="Ví dụ: bepviet2024" required />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Mật khẩu</label>
                            <input type="password" name="password" placeholder="Mật khẩu" required />
                        </div>

                        <div className="form-group">
                            <label>Nhập lại mật khẩu</label>
                            <input type="password" name="password_confirmation" placeholder="Xác nhận" required />
                        </div>
                    </div>

                    <h3 className="form-section-title">Thông tin cá nhân</h3>

                    <div className="form-group">
                        <label>Họ và tên</label>
                        <input type="text" name="fullname" placeholder="Nguyễn Văn A" required />
                    </div>
                    <div className="form-group">
                        <label>Địa chỉ</label>
                        <input type="text" name="fullname" placeholder="Thành phố Hồ Chí Minh" required />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Giới tính</label>
                            <select name="gender" defaultValue="male">
                                <option value="male">Nam</option>
                                <option value="female">Nữ</option>
                                <option value="other">Khác</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Quốc tịch</label>
                            <select name="nationality" defaultValue="Vietnam">
                                <option value="Vietnam">Việt Nam</option>
                                <option value="USA">Mỹ</option>
                                <option value="Japan">Nhật Bản</option>
                                <option value="Korea">Hàn Quốc</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" placeholder="email@example.com" />
                        </div>

                        <div className="form-group">
                            <label>Số điện thoại</label>
                            <input type="tel" name="phone" placeholder="09xxxxxxxx" />
                        </div>
                    </div>

                    <button type="submit" className="btn-submit">Đăng ký thành viên</button>
                </form>

            </div>
        </div>
    );
};

export default Auth;