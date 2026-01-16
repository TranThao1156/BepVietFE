import React from 'react';
import { Link } from 'react-router-dom';

const QlCongThuc = () => {
  // Hàm xử lý giả lập xóa
  const handleDelete = (recipeName) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa món "${recipeName}" không?`)) {
      console.log('Đã xóa:', recipeName);
    }
  };

  return (
    <main className="main-content">
      <div className="content-header">
        <h1>Quản lý công thức</h1>
        <p>Xem lại các món ăn của bạn hoặc chia sẻ công thức mới cho cộng đồng.</p>
      </div>

      <div className="manage-card">
        <div className="manage-card-header">
          <h3>Danh sách món ăn</h3>
          {/* Sửa lại nút tạo mới: Thay vì button lồng a, dùng Link trực tiếp */}
          <Link to="/nguoi-dung/ql-cong-thuc/tao-cong-thuc" className="btn btn-primary btn-sm">
            <i className="fa-solid fa-plus"></i> Tạo mới
          </Link>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '10%' }}>Ảnh</th>
                <th style={{ width: '30%' }}>Tên món</th>
                <th style={{ width: '20%' }}>Ngày tạo</th>
                <th style={{ width: '20%' }}>Trạng thái</th>
                <th style={{ width: '10%' }} className="text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1 */}
              <tr>
                <td>
                  <img 
                    src="https://images.unsplash.com/photo-1582878826618-c05326eff935?q=80&w=2070&auto=format&fit=crop" 
                    className="table-thumb" 
                    alt="Phở bò" 
                  />
                </td>
                <td>
                  <div className="table-title">Phở Bò Nam Định</div>
                  <div className="table-subtitle">Món nước • Miền Bắc</div>
                </td>
                <td className="table-date">20/10/2023</td>
                <td><span className="badge badge-success">Đã duyệt</span></td>
                <td className="text-right">
                  <Link to="/nguoi-dung/ql-cong-thuc/sua-cong-thuc" className="action-btn edit" title="Sửa">
                    <i className="fa-solid fa-pen"></i>
                  </Link>
                  <button 
                    className="action-btn delete" 
                    onClick={() => handleDelete('Phở Bò Nam Định')}
                    title="Xóa"
                  >
                    <i className="fa-regular fa-trash-can"></i>
                  </button>
                </td>
              </tr>

              {/* Row 2 */}
              <tr>
                <td>
                  <img 
                    src="https://images.unsplash.com/photo-1548596638-349c25055b80?q=80&w=1000&auto=format&fit=crop" 
                    className="table-thumb" 
                    alt="Nem rán" 
                  />
                </td>
                <td>
                  <div className="table-title">Nem Rán Giòn</div>
                  <div className="table-subtitle">Món khai vị • Toàn quốc</div>
                </td>
                <td className="table-date">22/10/2023</td>
                <td><span className="badge badge-warning">Chờ duyệt</span></td>
                <td className="text-right">
                  <Link to="/nguoi-dung/ql-cong-thuc/sua-cong-thuc" className="action-btn edit">
                    <i className="fa-solid fa-pen"></i>
                  </Link>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDelete('Nem Rán Giòn')}
                  >
                    <i className="fa-regular fa-trash-can"></i>
                  </button>
                </td>
              </tr>

              {/* Row 3 */}
              <tr>
                <td>
                  <img 
                    src="https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=1000&auto=format&fit=crop" 
                    className="table-thumb" 
                    alt="Cá lóc" 
                  />
                </td>
                <td>
                  <div className="table-title">Cá lóc nướng trui</div>
                  <div className="table-subtitle">Món chính • Miền Tây</div>
                </td>
                <td className="table-date">15/10/2023</td>
                <td><span className="badge badge-danger">Từ chối</span></td>
                <td className="text-right">
                  <Link to="/nguoi-dung/ql-cong-thuc/sua-cong-thuc" className="action-btn edit">
                    <i className="fa-solid fa-pen"></i>
                  </Link>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDelete('Cá lóc nướng trui')}
                  >
                    <i className="fa-regular fa-trash-can"></i>
                  </button>
                </td>
              </tr>

              {/* Row 4 */}
              <tr>
                <td>
                  <img 
                    src="https://images.unsplash.com/photo-1551185627-2b7b3b421274?q=80&w=1000&auto=format&fit=crop" 
                    className="table-thumb" 
                    alt="Bún bò" 
                  />
                </td>
                <td>
                  <div className="table-title">Bún Bò Huế</div>
                  <div className="table-subtitle">Món nước • Miền Trung</div>
                </td>
                <td className="table-date">12/10/2023</td>
                <td><span className="badge badge-success">Đã duyệt</span></td>
                <td className="text-right">
                  <Link to="/nguoi-dung/ql-cong-thuc/sua-cong-thuc" className="action-btn edit">
                    <i className="fa-solid fa-pen"></i>
                  </Link>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDelete('Bún Bò Huế')}
                  >
                    <i className="fa-regular fa-trash-can"></i>
                  </button>
                </td>
              </tr>

              {/* Row 5 */}
              <tr>
                <td>
                  <img 
                    src="https://images.unsplash.com/photo-1548596638-349c25055b80?q=80&w=1000&auto=format&fit=crop" 
                    className="table-thumb" 
                    alt="Gỏi cuốn" 
                  />
                </td>
                <td>
                  <div className="table-title">Gỏi Cuốn Tôm Thịt</div>
                  <div className="table-subtitle">Món khai vị • Miền Nam</div>
                </td>
                <td className="table-date">28/10/2023</td>
                <td><span className="badge badge-warning">Chờ duyệt</span></td>
                <td className="text-right">
                  <Link to="/nguoi-dung/ql-cong-thuc/sua-cong-thuc" className="action-btn edit">
                    <i className="fa-solid fa-pen"></i>
                  </Link>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDelete('Gỏi Cuốn Tôm Thịt')}
                  >
                    <i className="fa-regular fa-trash-can"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="manage-card-footer">
          <div className="pagination-info">Hiển thị 1-5 trong số 12 món ăn</div>
          <div className="table-pagination">
            <button className="p-btn disabled"><i className="fa-solid fa-chevron-left"></i></button>
            <button className="p-btn active">1</button>
            <button className="p-btn">2</button>
            <button className="p-btn"><i className="fa-solid fa-chevron-right"></i></button>
          </div>
        </div>

      </div>
    </main>
  );
};

export default QlCongThuc;