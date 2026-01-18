import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const ChiTietCookbook = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();
  
  const [cookbook, setCookbook] = useState(null); // Thông tin cookbook
  const [recipes, setRecipes] = useState([]); // Danh sách món ăn
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Fetch dữ liệu từ API
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        // --- THÊM ĐOẠN NÀY ---
        const token = localStorage.getItem('access_token'); // Lấy token từ bộ nhớ
        
        // Nếu bắt buộc đăng nhập mà không có token thì đá về trang login
        // (Hoặc nếu muốn cho xem công khai thì phải sửa Route bên Laravel ra ngoài nhóm middleware)
        if (!token) {
             console.log("Chưa có token, không thể gọi API user");
             // navigate('/dang-nhap'); // Bỏ comment dòng này nếu muốn bắt buộc login
             return; 
        }
        // ---------------------

        const response = await fetch(`http://localhost:8000/api/user/cookbook/chi-tiet/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // <--- QUAN TRỌNG NHẤT: Gửi kèm Token
            }
        });

        // Nếu token hết hạn hoặc sai (Lỗi 401/403)
        if (response.status === 401 || response.status === 403) {
            alert("Phiên đăng nhập hết hạn.");
            navigate('/dang-nhap');
            return;
        }

        const result = await response.json();

        if (result.success) {
          setCookbook(result.data.info);
          setRecipes(result.data.recipes);
        } else {
          // Xử lý trường hợp không tìm thấy nhưng không phải lỗi server
          console.error(result.message);
        }
      } catch (error) {
        console.error("Lỗi kết nối:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, navigate]);;

  // 2. Hàm Xóa Cookbook (gọi API xóa đã làm ở bước trước)
  const handleDeleteCookbook = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa Cookbook này không?')) return;
    
    // Gọi API xóa (giả sử bạn đã có token)
    const token = localStorage.getItem('access_token');
    try {
        const res = await fetch(`http://localhost:8000/api/user/cookbook/${id}`, {
            method: 'PUT', // Hoặc DELETE tùy backend
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            navigate('/nguoi-dung/cookbook');
        }
    } catch (err) {
        console.error(err);
    }
  };

  // 3. Hàm Bỏ lưu món ăn (Cần backend hỗ trợ API xóa record trong ct_cookbook)
  const handleUnsave = async (recipeId) => {
    if (!window.confirm(`Bạn muốn bỏ món này khỏi bộ sưu tập?`)) return;
    
    // Tạm thời chỉ xóa ở Frontend để demo
    setRecipes(current => current.filter(r => r.Ma_CT !== recipeId));
    // TODO: Gọi API Backend để xóa thật trong CSDL
    // await fetch(...)
  };

  // 4. Lọc danh sách món ăn theo ô tìm kiếm
  const filteredRecipes = recipes.filter(r => 
    r.TenMon.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div style={{textAlign:'center', marginTop: 50}}>Đang tải dữ liệu...</div>;
if (!cookbook) {
    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h2 style={{ color: 'red' }}>⚠️ Đã xảy ra lỗi!</h2>
            <p>Không thể tải dữ liệu Cookbook.</p>
            <p>Vui lòng mở <b>Console</b> (F12 - Console) để xem chi tiết lỗi màu đỏ.</p>
            <button onClick={() => window.location.reload()} style={{padding: '10px 20px', cursor: 'pointer'}}>
                Thử tải lại trang
            </button>
            <br/><br/>
            <Link to="/nguoi-dung/cookbook">Quay lại danh sách</Link>
        </div>
    );
}

  return (
    <main className="main-content">
      {/* Nút Quay lại */}
      <div style={{ marginBottom: '20px' }}>
        <Link 
          to="/nguoi-dung/cookbook" 
          style={{ textDecoration: 'none', color: '#666', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <i className="fa-solid fa-arrow-left"></i> Quay lại danh sách Cookbook
        </Link>
      </div>

      {/* Hero Section */}
      <div className="cookbook-hero">
        <div className="hero-cover">
          <img 
            src={cookbook.AnhBia} 
            alt={cookbook.TenCookBook} 
            onError={(e) => {e.target.src = 'https://placehold.co/600x400?text=No+Image'}}
          />
        </div>
        <div className="hero-info">
          <div className="hero-meta">
            <span><i className="fa-solid fa-layer-group"></i> {cookbook.SoLuongMon} Công thức</span>
            <span style={{marginLeft: '15px'}}>
                 {cookbook.TrangThai === 0 ? <i className="fa-solid fa-lock"></i> : <i className="fa-solid fa-globe"></i>}
            </span>
          </div>

          <h1 className="hero-title">{cookbook.TenCookBook}</h1>
          
          <div className="hero-actions">
            <Link 
              to={`/nguoi-dung/sua-cookbook/${cookbook.id}`} 
              className="btn btn-outline-gray" 
              style={{ padding: '8px 20px' }}
            >
              <i className="fa-solid fa-pen"></i> Chỉnh sửa
            </Link>
            
            <button 
              className="btn btn-outline-gray" 
              onClick={handleDeleteCookbook}
              style={{ padding: '8px 20px', color: '#EF4444', borderColor: '#FECACA' }}
            >
              <i className="fa-regular fa-trash-can"></i> Xóa
            </button>
          </div>
        </div>
      </div>

      {/* Filter / Search Toolbar */}
      <div className="filter-toolbar">
        <div className="result-count">Danh sách món ăn ({filteredRecipes.length})</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="dashboard-search" style={{ marginBottom: 0, width: '250px' }}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <input 
              type="text" 
              placeholder="Tìm món trong bộ sưu tập..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '10px 10px 10px 40px' }}
            />
          </div>
        </div>
      </div>

      {/* Grid danh sách món ăn */}
      <div className="saved-recipe-grid">
        {filteredRecipes.length === 0 ? (
            <p>Chưa có món ăn nào trong bộ sưu tập này.</p>
        ) : (
            filteredRecipes.map((recipe) => (
                <div className="saved-card" key={recipe.Ma_CT}>
                  <div className="saved-thumb">
                    <Link to={`/cong-thuc/${recipe.Ma_CT}`}>
                        <img 
                            src={recipe.HinhAnh} 
                            alt={recipe.TenMon} 
                            onError={(e) => {e.target.src = 'https://placehold.co/600x400?text=No+Image'}}
                        />
                    </Link>
                    <button 
                      className="btn-unsave" 
                      title="Bỏ lưu khỏi Cookbook này"
                      onClick={() => handleUnsave(recipe.Ma_CT)}
                    >
                      <i className="fa-solid fa-minus"></i>
                    </button>
                  </div>
                  <div className="saved-body">
                    <div className="saved-author">
                      <img 
                        src={recipe.AvatarTacGia} 
                        alt={recipe.TacGia} 
                        onError={(e) => {e.target.src = 'https://placehold.co/100?text=U'}}
                      />
                      <span>{recipe.TacGia}</span>
                    </div>
                    <Link to={`/cong-thuc/${recipe.Ma_CT}`} className="saved-title">
                        {recipe.TenMon}
                    </Link>
                    <div className="saved-meta-row">
                      <div className="meta-item">
                        <i className="fa-regular fa-clock"></i> {recipe.ThoiGianNau}p
                      </div>
                      {/* Nếu có rating thì hiện ở đây */}
                      <div className="meta-item">
                        <i className="fa-solid fa-star" style={{ color: '#F59E0B' }}></i> --
                      </div>
                    </div>
                  </div>
                </div>
            ))
        )}
      </div>

    </main>
  );
};

export default ChiTietCookbook;