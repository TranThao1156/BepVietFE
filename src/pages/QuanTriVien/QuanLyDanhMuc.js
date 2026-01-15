import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const QuanLyDanhMuc = () => {
  // --- MOCK DATA (Dữ liệu giả) ---
  const [categories, setCategories] = useState([
    { id: 1, name: "Món chay", count: 124, badgeClass: "badge-orange" },
    { id: 2, name: "Món nướng", count: 85, badgeClass: "badge-orange" },
    { id: 3, name: "Món lẩu", count: 32, badgeClass: "badge-gray" },
    { id: 4, name: "Ăn vặt", count: 210, badgeClass: "badge-orange" },
    { id: 5, name: "Đồ uống", count: 56, badgeClass: "badge-orange" },
  ]);

  // --- HÀM XỬ LÝ XÓA (Giả lập) ---
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  return (
    <main className="main-content">
        {/* --- HEADER --- */}
        <div className="page-header-flex">
            <div className="header-text">
                <h2>Quản lý danh mục</h2>
            </div>
        </div>

        {/* --- TOOLBAR --- */}
        <div className="toolbar-section">
            <div className="search-box">
                <i className="fas fa-search"></i>
                <input type="text" placeholder="Tìm kiếm danh mục..." />
            </div>
            
            {/* Link tới trang Tạo danh mục (Sẽ làm ở bước sau) */}
            <Link to="/admin/quanlydanhmuc/taodanhmuc" className="btn btn-primary">
                <i className="fas fa-plus-circle" style={{marginRight: '8px'}}></i> Tạo danh mục mới
            </Link>
        </div>

        {/* --- TABLE CARD --- */}
        <div className="card">
            <div className="table-responsive">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th style={{width: '50%'}}>TÊN DANH MỤC</th>
                            <th style={{width: '30%'}}>SỐ LƯỢNG</th>
                            <th style={{width: '20%', textAlign: 'right'}}>HÀNH ĐỘNG</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 ? (
                            categories.map((cat) => (
                                <tr key={cat.id}>
                                    <td><strong>{cat.name}</strong></td>
                                    <td>
                                        <span className={cat.badgeClass}>{cat.count}</span>
                                    </td>
                                    <td>
                                        <div className="action-group">
                                            {/* Link tới trang Sửa (Sẽ làm ở bước sau) */}
                                            <Link to={`/admin/quanlydanhmuc/suadanhmuc/${cat.id}`} className="btn-icon">
                                                <i className="fas fa-pen"></i>
                                            </Link>
                                            
                                            <button 
                                                className="btn-icon" 
                                                onClick={() => handleDelete(cat.id)}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" style={{textAlign: 'center', padding: '20px'}}>
                                    Không tìm thấy danh mục nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- FOOTER PAGINATION --- */}
            <div className="card-footer">
                <span className="text-gray" style={{fontSize: '0.85rem'}}>
                    Hiển thị <strong>1</strong> đến <strong>{categories.length}</strong> trong số <strong>12</strong> danh mục
                </span>
                <div className="pagination">
                    <button disabled><i className="fas fa-chevron-left"></i></button>
                    <button className="active">1</button>
                    <button>2</button>
                    <button>3</button>
                    <span style={{padding: '5px'}}>...</span>
                    <button>8</button>
                    <button><i className="fas fa-chevron-right"></i></button>
                </div>
            </div>
        </div>

    </main>
  );
};

export default QuanLyDanhMuc;