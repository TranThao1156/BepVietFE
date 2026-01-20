import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LichSuTruyCap = () => {
  const navigate = useNavigate();
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Gọi API khi trang load
  useEffect(() => {
    const token = localStorage.getItem("access_token"); // Hoặc nơi bạn lưu token

    if (!token) {
      navigate("/dang-nhap"); // Chưa đăng nhập thì đá về login
      return;
    }

    setLoading(true);
    fetch("http://127.0.0.1:8000/api/user/cong-thuc/lich-su-xem", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Gửi Token để BE biết là ai
      }
    })
    .then(res => res.json())
    .then(json => {
      if (json.success) {
        setHistoryList(json.data);
      } else {
        console.error("Lỗi tải lịch sử:", json.message);
      }
    })
    .catch(err => console.error("Lỗi mạng:", err))
    .finally(() => setLoading(false));
  }, [navigate]);

  // 2. Hàm xử lý ảnh (Lấy ảnh từ Storage Laravel)
  const getImageUrl = (imgName) => {
    if (!imgName) return "https://via.placeholder.com/150";
    if (imgName.startsWith("http")) return imgName;
    return `http://127.0.0.1:8000/storage/img/CongThuc/${imgName}`;
  };

  // 3. Format ngày giờ Việt Nam
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <main className="main-content">
      <div className="content-header">
        <h1>Lịch sử xem</h1>
        <p>Danh sách các món bạn đã xem gần đây.</p>
      </div>

      <div className="manage-card">
        <div className="manage-card-header">
          <h3>Món ăn vừa xem ({historyList.length})</h3>
        </div>

        <div className="table-responsive">
          {loading ? (
            <p style={{textAlign: 'center', padding: '20px'}}>Đang tải dữ liệu...</p>
          ) : historyList.length === 0 ? (
            <p style={{textAlign: 'center', padding: '20px'}}>Bạn chưa xem món nào.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '100px' }}>Ảnh</th>
                  <th>Tên món</th>
                  <th>Tác giả</th>
                  <th>Thời gian xem</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {historyList.map((item) => (
                  <tr key={item.Ma_CT}>
                    <td>
                      <img 
                        src={getImageUrl(item.HinhAnh)} 
                        alt={item.TenMon} 
                        className="table-thumb" 
                        style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px'}}
                      />
                    </td>
                    <td>
                      <div className="table-title">
                          <Link to={`/cong-thuc/${item.Ma_CT}`} style={{textDecoration: 'none', color: '#333', fontWeight: 'bold'}}>
                            {item.TenMon}
                          </Link>
                      </div>
                      <div className="table-subtitle">
                        <span className={`badge ${item.DoKho === 'Dễ' ? 'bg-success' : 'bg-warning'}`}>
                          {item.DoKho}
                        </span> 
                        &nbsp;• {item.ThoiGianNau} phút
                      </div>
                    </td>
                    <td>{item.TenTacGia}</td>
                    <td>{formatDate(item.NgayXem)}</td>
                    <td>
                        <Link to={`/cong-thuc/${item.Ma_CT}`} className="btn-icon">
                            <i className="fa-solid fa-arrow-right"></i>
                        </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
};

export default LichSuTruyCap;