import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const toSlug = (str) => {
    if (!str) return '';
    return str.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/([^0-9a-z-\s])/g, "")
        .replace(/(\s+)/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
};
const ChiTietCookbook = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();
  const realId = id ? parseInt(id.split("-")[0]) : null;
  const [cookbook, setCookbook] = useState(null); // Thông tin cookbook
  const [recipes, setRecipes] = useState([]); // Danh sách món ăn
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  
  

  // 1. Fetch dữ liệu từ API
  useEffect(() => {
    const fetchDetail = async () => {
      if (!realId) return;
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

        const response = await fetch(`http://localhost:8000/api/user/cookbook/chi-tiet/${realId}`, {
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
  const handleStartEdit = () => {
    setEditName(cookbook.TenCookBook);
    setPreviewImage(cookbook.AnhBia); 
    setSelectedFile(null);
    setIsEditing(true);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setSelectedFile(file);
        setPreviewImage(URL.createObjectURL(file)); // Xem trước ảnh vừa chọn
    }
  };

  // Hàm 3: Lưu thay đổi (Gọi API)
  const handleSave = async () => {
    if (!editName.trim()) {
        alert("Tên không được để trống!");
        return;
    }

    const token = localStorage.getItem('access_token');
    
    // Tạo FormData để chứa text và file
    const formData = new FormData();
    formData.append('TenCookBook', editName);
    formData.append('_method', 'PUT'); // Để Laravel hiểu là PUT
    
    if (selectedFile) {
        formData.append('AnhBia', selectedFile);
    }

    try {
        const response = await fetch(`http://localhost:8000/api/user/cookbook/${realId}`, {
            method: 'POST', // Gửi POST kèm _method: PUT
            headers: { 'Authorization': `Bearer ${token}` }, // Không set Content-Type!
            body: formData
        });

        const data = await response.json();

        if (response.ok && data.success) {
            setCookbook(prev => ({ 
                ...prev, 
                TenCookBook: data.data.TenCookBook,
                AnhBia: data.data.AnhBia 
            }));
            setIsEditing(false); // Tắt chế độ sửa
            alert("Cập nhật thành công!");
        } else {
            alert(data.message || "Lỗi cập nhật.");
        }
    } catch (error) {
        console.error("Lỗi:", error);
        alert("Lỗi kết nối server.");
    }
  };
  

  // 3. Hàm Bỏ lưu món ăn (Cần backend hỗ trợ API xóa record trong ct_cookbook)
  const handleUnsave = async (recipeId, recipeName) => {
    if (!window.confirm(`Bạn có chắc muốn xóa món "${recipeName}" khỏi bộ sưu tập này không?`)) {
        return;
    }
    
    const token = localStorage.getItem('access_token');
    if (!token) {
        alert("Vui lòng đăng nhập lại.");
        return;
    }

    try {
        // 👇 ĐỔI THÀNH POST (cho dễ chạy)
        const response = await fetch(`http://localhost:8000/api/user/cookbook/${realId}/xoa-mon/${recipeId}`, {
            method: 'POST', // Đã đổi từ DELETE sang POST
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // 👇 ĐOẠN NÀY QUAN TRỌNG: Kiểm tra xem server trả về cái gì
        const text = await response.text(); // Đọc dữ liệu thô trước
        
        try {
            const data = JSON.parse(text); // Thử chuyển sang JSON
            
            if (response.ok && data.success) {
                // Xóa thành công -> Cập nhật giao diện
                setRecipes(currentRecipes => currentRecipes.filter(r => r.Ma_CT !== recipeId));
                setCookbook(prev => ({ ...prev, SoLuongMon: prev.SoLuongMon - 1 }));
                alert("Đã xóa thành công!");
            } else {
                alert(data.message || "Có lỗi xảy ra: " + text);
            }
        } catch (e) {
            // Nếu không phải JSON (nghĩa là Lỗi 500 HTML) -> Hiện nội dung lỗi ra luôn
            console.error("Server trả về lỗi HTML:", text);
            alert("LỖI SERVER (Xem chi tiết trong Console):\n" + text.substring(0, 200)); 
            // Cắt 200 ký tự đầu để hiện thông báo ngắn gọn
        }

    } catch (error) {
        console.error("Lỗi mạng:", error);
        alert("Không thể kết nối đến Server!");
    }
  };

  // 4. Lọc danh sách món ăn theo ô tìm kiếm
  const filteredRecipes = recipes.filter(r =>
    r.TenMon.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div style={{ textAlign: 'center', marginTop: 50 }}>Đang tải dữ liệu...</div>;
  if (!cookbook) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2 style={{ color: 'red' }}>⚠️ Đã xảy ra lỗi!</h2>
        <p>Không thể tải dữ liệu Cookbook.</p>
        <p>Vui lòng mở <b>Console</b> (F12 - Console) để xem chi tiết lỗi màu đỏ.</p>
        <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Thử tải lại trang
        </button>
        <br /><br />
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

      <div className="cookbook-hero">
        <div className="hero-cover" style={{ position: 'relative' }}>
          {/* Ảnh bìa (Mờ đi khi đang sửa) */}
          <img 
            src={isEditing ? previewImage : cookbook.AnhBia} 
            alt={cookbook.TenCookBook} 
            onError={(e) => {e.target.src = 'https://placehold.co/600x400?text=No+Image'}}
            style={{ opacity: isEditing ? 0.7 : 1, transition: '0.3s' }}
          />
          
          {/* Nút chọn ảnh (Chỉ hiện khi isEditing = true) */}
          {isEditing && (
            <div style={{
                position: 'absolute', top: '50%', left: '50%', 
                transform: 'translate(-50%, -50%)', textAlign: 'center'
            }}>
                <label className="btn btn-primary" style={{ cursor: 'pointer', backgroundColor: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '5px' }}>
                    <i className="fa-solid fa-camera"></i> Đổi ảnh
                    <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                </label>
            </div>
          )}
        </div>

        <div className="hero-info">
          <div className="hero-meta">
            <span><i className="fa-solid fa-layer-group"></i> {cookbook.SoLuongMon} Công thức</span>
            <span style={{marginLeft: '15px'}}>
                 {cookbook.TrangThai === 0 ? <i className="fa-solid fa-lock"></i> : <i className="fa-solid fa-globe"></i>}
            </span>
          </div>

          {/* LOGIC HIỂN THỊ TÊN HOẶC Ô INPUT */}
          {isEditing ? (
             <input 
                type="text" 
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="form-control"
                style={{ fontSize: '2rem', fontWeight: 'bold', width: '100%', marginBottom: '10px', padding: '5px' }}
             />
          ) : (
             <h1 className="hero-title">{cookbook.TenCookBook}</h1>
          )}
          
          <div className="hero-actions">
            {/* LOGIC ĐỔI NÚT BẤM */}
            {isEditing ? (
                <>
                    <button onClick={handleSave} className="btn btn-primary" style={{ marginRight: '10px', backgroundColor: '#F59E0B', border: 'none', color: 'white', padding: '8px 20px' }}>
                        <i className="fa-solid fa-floppy-disk"></i> Lưu
                    </button>
                    <button onClick={() => setIsEditing(false)} className="btn btn-outline-gray" style={{ padding: '8px 20px' }}>
                        Hủy
                    </button>
                </>
            ) : (
                <>
                    {/* Nút Sửa gọi hàm handleStartEdit thay vì Link */}
                    <button onClick={handleStartEdit} className="btn btn-outline-gray" style={{ marginRight: '10px', padding: '8px 20px' }}>
                        <i className="fa-solid fa-pen"></i> Chỉnh sửa
                    </button>
                </>
            )}
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
                <Link to={`/cong-thuc/${recipe.Ma_CT}-${toSlug(recipe.TenMon)}`}>
                  <img
                    src={recipe.HinhAnh}
                    alt={recipe.TenMon}
                    onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=No+Image' }}
                  />
                </Link>
                <button
                  className="btn-unsave"
                  title="Bỏ lưu khỏi Cookbook này"
                  onClick={() => handleUnsave(recipe.Ma_CT, recipe.TenMon)}
                >
                  <i className="fa-solid fa-minus"></i>
                </button>
              </div>
              <div className="saved-body">
                <div className="saved-author">
                  <img
                    src={recipe.AvatarTacGia}
                    alt={recipe.TacGia}
                    onError={(e) => { e.target.src = 'https://placehold.co/100?text=U' }}
                  />
                  <span>{recipe.TacGia}</span>
                </div>
                <Link to={`/cong-thuc/${recipe.Ma_CT}-${toSlug(recipe.TenMon)}`} className="saved-title">
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