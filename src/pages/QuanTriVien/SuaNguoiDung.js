import React, { useState, useEffect,useRef } from 'react';
import { Link, useParams,useNavigate } from 'react-router-dom';

const SuaNguoiDung = () => {

    const { id } = useParams(); 
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const TOKEN = localStorage.getItem('token');
    
    const [loading, setLoading] = useState(true);
     
    const [form, setForm] = useState({
        TenTK:"",
        MatKhau:"",
        HoTen:"",
        AnhDaiDien:"",
        Email:"",
        Sdt:"",
        DiaChi:"",
        GioiTinh:"",
        QuocTich:"",
        VaiTro:""
    });
    
    
    const headers = {
        Authorization: `Bearer ${TOKEN}`,
        Accept: 'application/json'
    }

    // State xem trước ảnh mới (nếu có thay đổi)
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(null);


    // Xử lý thay đổi input text
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // Xử lý chọn ảnh mới
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
            setForm(prev => ({ ...prev, AnhDaiDien: file }));
        }
    };

   useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8000/api/admin/quan-ly-nguoi-dung/${id}`,
                    { headers }
                );
                const json = await res.json();
                setForm(json.data);
                setAvatarUrl(json.data.AnhDaiDien);
                setForm({
                    ...json.data,
                    MatKhau: ""   // LUÔN ĐỂ RỖNG
                });
            } catch (err) {
                console.error('Lỗi load user', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);
    // 
    const handleSubmit = async () => {
        const formData = new FormData();

        Object.entries(form).forEach(([key, value]) => {
            if (key === 'AnhDaiDien') {
                if (value instanceof File) {
                    formData.append(key, value);
                }
            } else if (value !== "") {
                formData.append(key, key ==='VaiTro' ? Number(value) : value);
            }
        });


        try {
            const res = await fetch(
                `http://localhost:8000/api/admin/quan-ly-nguoi-dung/cap-nhat/${id}`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${TOKEN}`
                    },
                    body: formData
                }
            );

            const json = await res.json();

            if (json.success) {
                alert('Cập nhật thành công');
                
                navigate('/quan-tri/quan-ly-nguoi-dung');
            } else {
                alert(json.message || 'Cập nhật thất bại');
            }
        } catch (err) {
            console.error('Lỗi cập nhật', err);
        }
    };
        if (loading) return <p>Đang tải dữ liệu...</p>;
    return (
    <main className="main-content">

        {/* --- HEADER --- */}
        <div className="page-header-flex">
            <div className="header-text">
                <h1>Chỉnh sửa người dùng</h1>
                <p className="subtitle">Cập nhật thông tin cho tài khoản ID: <strong>{id}</strong></p>
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

                    {/* --- AVATAR --- */}
                    <div className="avatar-upload-area">
                        <span className="avatar-label">Ảnh đại diện</span>
                        <div className="avatar-preview" style={{ overflow: 'hidden' }}>
                            {/* Ưu tiên hiển thị ảnh mới chọn, nếu không thì hiện ảnh cũ */}
                            <img 
                                src={avatarPreview || avatarUrl} 
                                alt="Avatar" 
                                className="avatar-img"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                            
                            <label htmlFor="avatarInput" className="btn-upload-icon">
                                <i className="fa-solid fa-camera"></i>
                            </label>
                            <input
                                type="file"
                                hidden
                                name="AnhDaiDien"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>

                    {/* --- THÔNG TIN TÀI KHOẢN --- */}
                    <h4 className="form-section-title">Thông tin tài khoản</h4>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Tên tài khoản</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="TenTK"
                                value={form.TenTK} 
                                readOnly 
                                style={{backgroundColor: '#f9fafb', cursor: 'not-allowed'}}
                            />
                            <small className="text-gray">Tên tài khoản không được phép thay đổi.</small>
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                name="Email"
                                value={form.Email} 
                                readOnly
                                style={{backgroundColor: '#f9fafb', cursor: 'not-allowed'}}
                            />
                        </div>
                        
                        {/* Mật khẩu để trống, chỉ nhập khi muốn đổi */}
                        <div className="form-group">
                            <label>Mật khẩu mới</label>
                            <input
                            type="password"
                            className="form-control"
                            name="MatKhau"
                            value={form.MatKhau}
                            onChange={handleChange}
                            placeholder="Để trống nếu không muốn thay đổi..."
                            />
                        </div>
                        <div className="form-group">
                            <label>Vai trò (Phân quyền)</label>
                            <select 
                                className="form-control" 
                                name="VaiTro"
                                value={form.VaiTro}
                                onChange={handleChange}
                            >
                                <option value="1">Người dùng thành viên</option>
                                <option value="0">Quản trị viên (Admin)</option>
                            </select>
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
                                className="form-control" 
                                name="HoTen"
                                value={form.HoTen}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Số điện thoại</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="Sdt"
                                value={form.Sdt}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Giới tính</label>
                            <select 
                                className="form-control" 
                                name="GioiTinh"
                                value={form.GioiTinh}
                                onChange={handleChange}
                            >
                                <option>Nam</option>
                                <option>Nữ</option>
                                <option>Khác</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Quốc tịch</label>
                            <select 
                                className="form-control"
                                name="QuocTich"
                                value={form.QuocTich}
                                onChange={handleChange}
                            >
                                <option>Việt Nam</option>
                                <option>Mỹ</option>
                                <option>Nhật Bản</option>
                                <option>Hàn Quốc</option>
                            </select>
                        </div>

                        <div className="form-group full-width">
                            <label>Địa chỉ</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="DiaChi"
                                value={form.DiaChi}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                </div>

                <div className="card-footer-between">
                    <button type="button" className="btn-text-danger" onClick={() => alert('Chức năng xóa người dùng')}>
                        <i className="fa-solid fa-user-slash"></i> Khóa tài khoản này
                    </button>

                    <div className="action-right" style={{ display: 'flex', alignItems: 'center' }}>
                        <Link to="/quan-tri/quan-ly-nguoi-dung" className="btn-text-gray">Hủy bỏ</Link>
                        <button type="button" className="btn btn-primary" style={{marginLeft: '15px'}} onClick={handleSubmit}>
                            <i className="fa-solid fa-save" style={{marginRight: '8px'}}></i> Lưu thay đổi
                        </button>
                    </div>
                </div>
            </form>
        </div>

    </main>
    );
};

export default SuaNguoiDung;