import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const TaoDanhMuc = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // --- 1. ĐỊNH NGHĨA DỮ LIỆU MẪU CHO COMBOBOX ---
  // Đây là danh sách chuẩn, sau này muốn thêm gì chỉ cần thêm vào đây
  const DANH_SACH_LOAI = [
    "Món ăn",
    "Đồ uống",
    "Làm bánh",
    "Tráng miệng",
    "Ăn vặt",
    "Khác"
  ];

  const [formData, setFormData] = useState({
    TenDM: '',
    LoaiDM: '', // Để rỗng ban đầu để bắt buộc người dùng phải chọn
    TrangThai: 1
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStatusChange = (value) => {
    setFormData({ ...formData, TrangThai: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate: Bắt buộc chọn loại
    if (!formData.LoaiDM) {
        alert("Vui lòng chọn loại danh mục!");
        return;
    }
    
    // ... (Code gọi API giữ nguyên như cũ) ...
    setLoading(true);
    try {
      const token = localStorage.getItem('user_token') || localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/admin/danh-muc/tao-danh-muc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Tạo danh mục thành công!");
        navigate('/quan-tri/quan-ly-danh-muc');
      } else {
        const errorData = await response.json();
        alert("Lỗi: " + (errorData.message || "Không thể tạo"));
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-content">
        <div className="page-header-flex">
            <div className="header-text">
                <h1>Thêm danh mục mới</h1>
            </div>
            <Link to="/quan-tri/quan-ly-danh-muc" className="btn btn-white">Quay lại</Link>
        </div>

        <div className="card">
            <form onSubmit={handleSubmit}>
                <div className="form-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Tên danh mục <span className="text-red">*</span></label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="TenDM"
                                value={formData.TenDM}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* --- 2. COMBOBOX ĐƯỢC BUILD DỮ LIỆU TỰ ĐỘNG --- */}
                        <div className="form-group">
                            <label>Loại danh mục <span className="text-red">*</span></label>
                            <select 
                                className="form-control" 
                                name="LoaiDM"
                                value={formData.LoaiDM}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Chọn loại danh mục --</option>
                                {DANH_SACH_LOAI.map((loai, index) => (
                                    <option key={index} value={loai}>
                                        {loai}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* ... (Phần Mô tả và Trạng thái giữ nguyên) ... */}
                     <div className="form-group" style={{marginTop: '20px'}}>
                        <label>Trạng thái hiển thị</label>
                        <div className="status-toggle-group">
                            <label style={{cursor: 'pointer'}}>
                                <input 
                                    type="radio" 
                                    name="displayStatus" 
                                    className="btn-check-input" 
                                    checked={formData.TrangThai === 1}
                                    onChange={() => handleStatusChange(1)}
                                />
                                <span className="btn-check-label">Hiển thị</span>
                            </label>
                            <label style={{cursor: 'pointer'}}>
                                <input 
                                    type="radio" 
                                    name="displayStatus" 
                                    className="btn-check-input" 
                                    checked={formData.TrangThai === 0}
                                    onChange={() => handleStatusChange(0)}
                                />
                                <span className="btn-check-label">Ẩn</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="card-footer">
                     <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Đang lưu...' : 'Tạo danh mục'}
                    </button>
                </div>
            </form>
        </div>
    </main>
  );
};

export default TaoDanhMuc;