import React from 'react';
import { Link, useParams } from 'react-router-dom';

const SuaDanhMuc = () => {
  const { id } = useParams(); // Lấy ID từ URL để biết đang sửa danh mục nào

  return (
    <main className="main-content">

        <div className="page-header-flex">
            <div className="header-text">
                <h1>Chỉnh sửa danh mục</h1>
                <p className="subtitle">Cập nhật thông tin cho danh mục ID: <strong>{id}</strong></p>
            </div>
            <div className="header-actions">
                <Link to="/admin/quan-ly-danh-muc" className="btn btn-white">
                    <i className="fa-solid fa-arrow-left"></i> Quay lại danh sách
                </Link>
            </div>
        </div>

        <div className="card">
            <form>
                <div className="form-body">

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Tên danh mục <span className="text-red">*</span></label>
                            {/* defaultValue giả lập dữ liệu cũ */}
                            <input type="text" className="form-control" defaultValue="Món nướng" />
                        </div>
                        <div className="form-group">
                            <label>Loại danh mục</label>
                            <input type="text" className="form-control" defaultValue="Món ăn" />
                        </div>
                    </div>

                    <div className="form-group" style={{marginTop: '20px'}}>
                        <label>Mô tả ngắn</label>
                        <textarea className="form-control" defaultValue="Tổng hợp các công thức món nướng ngon, dễ làm tại nhà như nướng than hoa, nướng giấy bạc..."></textarea>
                    </div>

                    <div className="form-group" style={{marginTop: '20px'}}>
                        <label>Trạng thái hiển thị</label>
                        <div className="status-toggle-group">
                            <label>
                                <input type="radio" name="displayStatus" className="btn-check-input" defaultChecked />
                                <span className="btn-check-label">
                                    <i className="fa-regular fa-eye"></i> Hiển thị
                                </span>
                            </label>

                            <label>
                                <input type="radio" name="displayStatus" className="btn-check-input" />
                                <span className="btn-check-label">
                                    <i className="fa-regular fa-eye-slash"></i> Ẩn
                                </span>
                            </label>
                        </div>
                    </div>

                </div>

                {/* Footer đặc biệt: Nút xóa bên trái, nút Lưu bên phải */}
                <div className="card-footer-between">
                    <button type="button" className="btn-text-danger">
                        <i className="fa-solid fa-trash-can"></i> Xóa danh mục
                    </button>

                    <div className="action-right">
                        <Link to="/admin/categories" className="btn-text-gray">Hủy bỏ</Link>
                        <button type="button" className="btn btn-primary" style={{marginLeft: '15px'}}>
                            <i className="fa-solid fa-save" style={{marginRight: '8px'}}></i> Lưu thay đổi
                        </button>
                    </div>
                </div>
            </form>
        </div>

    </main>
  );
};

export default SuaDanhMuc;