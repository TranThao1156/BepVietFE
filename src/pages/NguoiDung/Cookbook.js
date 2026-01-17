import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CookBook = () => {
  const [dsCookbook, setDsCookbook] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCookbooks = async () => {
      try {
        const token = localStorage.getItem('access_token');
        console.log("Token hiện tại:", token);
        if (!token) { navigate('/dang-nhap'); return; }

        const response = await fetch('http://localhost:8000/api/user/cookbook', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        const data = await response.json();
        if (data.success) {
          setDsCookbook(data.data);
        }
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCookbooks();
  }, [navigate]);

  const filteredCookbooks = dsCookbook.filter(cb => 
      cb.TenCookBook.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="main-content">
      <div className="content-header-flex">
        <div className="header-text">
          <h1>Cookbook của tôi</h1>
          <p>Bộ sưu tập các công thức yêu thích của bạn.</p>
        </div>
        <Link to="/nguoi-dung/cookbook/tao-cookbook" className="btn btn-primary">
          <i className="fa-solid fa-plus"></i> Tạo Cookbook mới
        </Link>
      </div>

      <div className="dashboard-search">
        <i className="fa-solid fa-magnifying-glass"></i>
        <input 
            type="text" 
            placeholder="Tìm kiếm bộ sưu tập..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="cookbook-grid">
        {loading ? (
            <p style={{gridColumn: '1/-1', textAlign: 'center'}}>Đang tải dữ liệu...</p>
        ) : filteredCookbooks.length === 0 ? (
            <div style={{gridColumn: '1/-1', textAlign: 'center', color: '#666'}}>
                <i className="fa-regular fa-folder-open" style={{fontSize: '40px'}}></i>
                <p>{searchTerm ? 'Không tìm thấy kết quả.' : 'Bạn chưa có bộ sưu tập nào.'}</p>
            </div>
        ) : (
            filteredCookbooks.map((cookbook) => (
                // Vì Service trả về 'id', nên ở đây dùng cookbook.id là ĐÚNG
                <div className="cb-card" key={cookbook.id}>
                    <div className="cb-img-wrapper">
                        <Link to={`/nguoi-dung/cookbook/chi-tiet/${cookbook.id}`}>
                            <img 
                                src={cookbook.AnhBia} // Service đã tạo link ảnh đầy đủ
                                alt={cookbook.TenCookBook}
                                onError={(e) => {e.target.src = 'https://placehold.co/600x400?text=No+Image'}}
                            />
                        </Link>
                        <span className="cb-count">
                            <i className="fa-solid fa-book-open"></i> {cookbook.SoLuongMon} món
                        </span>
                    </div>
                    
                    <div className="cb-body">
                        <h3 className="cb-title">{cookbook.TenCookBook}</h3>
                        <div className="cb-footer">
                            <span className="cb-time">
                                {cookbook.TrangThai === 0 
                                    ? <i className="fa-solid fa-lock" title="Riêng tư"></i> 
                                    : <i className="fa-solid fa-globe" title="Công khai"></i>} 
                                {' ' + cookbook.NgayTao}
                            </span>
                            <Link to={`/nguoi-dung/cookbook/chi-tiet/${cookbook.id}`} className="cb-link">
                                Xem chi tiết <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            ))
        )}
      </div>
    </main>
  );
};

export default CookBook;