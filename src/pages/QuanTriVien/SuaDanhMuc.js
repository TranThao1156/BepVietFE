import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'; // Thêm useParams

const SuaDanhMuc = () => {
  const { id } = useParams(); // Lấy ID từ URL (ví dụ: /sua-danh-muc/10)
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Danh sách loại giống trang Thêm mới
  const DANH_SACH_LOAI = ["Món ăn", "Đồ uống", "Làm bánh", "Tráng miệng", "Ăn vặt", "Khác"];

  const [formData, setFormData] = useState({
    TenDM: '',
    LoaiDM: '',
    TrangThai: 1
  });

  // --- 1. USE EFFECT: LẤY DỮ LIỆU CŨ ĐỂ ĐIỀN VÀO FORM ---
  useEffect(() => {
    const fetchOldData = async () => {
      try {
        const token = localStorage.getItem('user_token') || localStorage.getItem('access_token');
        const response = await fetch(`http://localhost:8000/api/admin/danh-muc/sua-danh-muc/${id}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const result = await response.json();
            // Đổ dữ liệu từ API vào State
            setFormData({
                TenDM: result.data.TenDM,
                LoaiDM: result.data.LoaiDM,
                TrangThai: result.data.TrangThai
            });
        } else {
            alert("Không tìm thấy danh mục này!");
            navigate('/quan-tri/quan-ly-danh-muc');
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      }
    };

    if (id) fetchOldData();
  }, [id, navigate]);

  // --- 2. XỬ LÝ NHẬP LIỆU ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStatusChange = (value) => {
    setFormData({ ...formData, TrangThai: value });
  };

  // --- 3. GỬI DỮ LIỆU CẬP NHẬT (PUT) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('user_token') || localStorage.getItem('access_token');
      
      // Chú ý: Dùng method PUT và URL có ID
      const response = await fetch(`http://localhost:8000/api/admin/danh-muc/sua-danh-muc/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Cập nhật thành công!");
        navigate('/quan-tri/quan-ly-danh-muc');
      } else {
        const errorData = await response.json();
        alert("Lỗi: " + (errorData.message || "Không thể cập nhật"));
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-content">
        {/* HEADER: Đổi tiêu đề thành Cập nhật */}
        <div className="page-header-flex">
            <div className="header-text">
                <h1>Cập nhật danh mục</h1>
                <p className="subtitle">Chỉnh sửa thông tin danh mục ID: <strong>#{id}</strong></p>
            </div>
            <div className="header-actions">
                <Link to="/quan-tri/quan-ly-danh-muc" className="btn btn-white">
                    <i className="fa-solid fa-arrow-left"></i> Quay lại danh sách
                </Link>
            </div>
        </div>

        {/* FORM CARD: Giữ nguyên giao diện của trang Thêm */}
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
                                value={formData.TenDM || ''} // Thêm || '' để tránh lỗi controlled input
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Loại danh mục <span className="text-red">*</span></label>
                            <select 
                                className="form-control" 
                                name="LoaiDM"
                                value={formData.LoaiDM || ''}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Chọn loại --</option>
                                {DANH_SACH_LOAI.map((loai, index) => (
                                    <option key={index} value={loai}>{loai}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Phần Trạng thái */}
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
                                <span className="btn-check-label">
                                    <i className="fa-regular fa-eye"></i> Hiển thị
                                </span>
                            </label>

                            <label style={{cursor: 'pointer'}}>
                                <input 
                                    type="radio" 
                                    name="displayStatus" 
                                    className="btn-check-input" 
                                    checked={formData.TrangThai === 0}
                                    onChange={() => handleStatusChange(0)}
                                />
                                <span className="btn-check-label">
                                    <i className="fa-regular fa-eye-slash"></i> Ẩn
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="card-footer" style={{justifyContent: 'flex-end'}}>
                    <Link to="/quan-tri/quan-ly-danh-muc" className="btn-text-gray" style={{marginRight: '20px'}}>Hủy bỏ</Link>
                    
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Đang lưu...' : (
                            <>
                                <i className="fa-solid fa-save" style={{marginRight: '8px'}}></i> Lưu thay đổi
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    </main>
  );
};

export default SuaDanhMuc;