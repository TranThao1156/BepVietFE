import React from 'react';
import { Link } from 'react-router-dom';

const TaoDanhMuc = () => {
  return (
    <main className="main-content">

        {/* --- HEADER --- */}
        <div className="page-header-flex">
            <div className="header-text">
                <h1>Thêm danh mục mới</h1>
                <p className="subtitle">Tạo danh mục món ăn mới để phân loại công thức</p>
            </div>
            <div className="header-actions">
                <Link to="/quan-tri/quan-ly-danh-muc" className="btn btn-white">
                    <i className="fa-solid fa-arrow-left"></i> Quay lại danh sách
                </Link>
            </div>
        </div>

        {/* --- FORM CARD --- */}
        <div className="card">
            <form>
                <div className="form-body">

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Tên danh mục <span className="text-red">*</span></label>
                            <input type="text" className="form-control" placeholder="Ví dụ: Món nướng, Lẩu..." />
                        </div>
                        <div className="form-group">
                            <label>Loại danh mục</label>
                            <select className="form-control" defaultValue="">
                                <option value="">-- Chọn loại --</option>
                                <option value="mon-an">Món ăn</option>
                                <option value="do-uong">Đồ uống</option>
                                <option value="banh">Làm bánh</option>
                                <option value="khac">Khác</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group" style={{marginTop: '20px'}}>
                        <label>Mô tả ngắn</label>
                        <textarea className="form-control" placeholder="Nhập mô tả cho danh mục này..."></textarea>
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

                <div className="card-footer" style={{justifyContent: 'flex-end'}}>
                    <Link to="/quan-tri/quan-ly-danh-muc" className="btn-text-gray" style={{marginRight: '20px'}}>Hủy bỏ</Link>
                    <button type="button" className="btn btn-primary">
                        <i className="fa-solid fa-plus" style={{marginRight: '8px'}}></i> Tạo danh mục
                    </button>
                </div>
            </form>
        </div>

    </main>
  );
};

export default TaoDanhMuc;