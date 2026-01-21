import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const KiemDuyetCongThuc = () => {
  // Trâm - đã thêm: Trang kiểm duyệt công thức riêng (không chỉnh file kiểm duyệt nội dung cũ)
  // --- CẤU HÌNH API ---
  const API_URL = 'http://localhost:8000/api/admin';

  // Trâm - đã thêm: slugify title fallback (phòng khi BE không trả slug_url)
  const slugify = (text = '') =>
    text
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  // Trâm - đã thêm: Ưu tiên access_token, fallback token (tránh lệch key localStorage)
  const getAuthToken = () => localStorage.getItem('access_token') || localStorage.getItem('token');

  // --- QUẢN LÝ STATE ---
  const [statusFilter, setStatusFilter] = useState('pending'); // 'pending', 'approved', 'rejected'
  const [recipeData, setRecipeData] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- HELPER: Map trạng thái từ Database (Tiếng Việt) -> UI (Tiếng Anh) ---
  const mapStatusFromDB = (dbStatus) => {
    switch (dbStatus) {
      case 'Chờ duyệt':
        return 'pending';
      case 'Chấp nhận':
        return 'approved';
      case 'Từ chối':
        return 'rejected';
      default:
        return 'pending';
    }
  };

  // --- 1. HÀM GỌI API LẤY DANH SÁCH ---
  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    const token = getAuthToken();

    try {
      const response = await fetch(`${API_URL}/duyet-cong-thuc?trang_thai=${statusFilter}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error('UNAUTHORIZED');
        throw new Error('Lỗi kết nối server');
      }

      const result = await response.json();

      const formattedData = (result.data || []).map((item) => ({
        id: item.Ma_CT,
        title: item.TenMon,
        author: item.Ma_ND,
        status: mapStatusFromDB(item.TrangThaiDuyet),
        originalId: item.Ma_CT,
        slug: item.slug_url,
      }));

      setRecipeData(formattedData);
    } catch (error) {
      console.error('Lỗi:', error);
      if (error.message === 'UNAUTHORIZED') {
        alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
      }
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  // --- 2. HÀM XỬ LÝ DUYỆT / TỪ CHỐI ---
  const handleAction = async (id, action) => {
    if (!window.confirm(`Bạn có chắc chắn muốn ${action === 'approve' ? 'duyệt' : 'từ chối'} công thức này?`)) return;

    const token = getAuthToken();

    try {
      const response = await fetch(`${API_URL}/duyet-cong-thuc/xu-ly`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          ma_ct: id,
          hanh_dong: action,
        }),
      });

      if (!response.ok) throw new Error('Lỗi xử lý từ Server');

      // Optimistic UI Update: bỏ khỏi danh sách theo filter hiện tại
      setRecipeData((prev) => prev.filter((x) => x.originalId !== id));
    } catch (error) {
      alert('Có lỗi xảy ra: ' + error.message);
      fetchRecipes();
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="status-badge warning">Chờ duyệt</span>;
      case 'approved':
        return <span className="status-badge success">Đã duyệt</span>;
      case 'rejected':
        return <span className="status-badge danger">Từ chối</span>;
      default:
        return null;
    }
  };

  return (
    <main className="main-content">
      <div className="page-header-flex">
        <div className="header-text">
          <h1>Kiểm duyệt công thức</h1>
          <p className="subtitle">Quản lý các công thức chờ duyệt.</p>
        </div>

        <div className="header-actions">
          <button
            className="btn btn-white"
            onClick={() => {
              // Trâm - đã thêm: giữ cụm nút chuyển tab như trang Kiểm duyệt nội dung
              window.location.assign('/quan-tri/kiem-duyet');
            }}
          >
            Duyệt bài viết
          </button>
          <button className="btn btn-primary">Duyệt công thức</button>
        </div>
      </div>

      <div className="card">
        {/* Tab trạng thái */}
        <div className="tabs-nav">
          {['pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              className={`tab-link ${statusFilter === status ? 'active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status === 'pending' ? 'Chờ duyệt' : status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
            </button>
          ))}
        </div>

        <div className="table-responsive">
          {loading ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#666' }}>Đang tải dữ liệu từ API...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th width="40%">Tên món</th>
                  <th width="20%">Tác giả (Mã ND)</th>
                  <th width="15%">Trạng thái</th>
                  <th width="15%" className="text-right">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {recipeData.length > 0 ? (
                  recipeData.map((item) => (
                    <tr key={item.id} className="item-row">
                      <td>
                        <strong>{item.title}</strong>
                        <br />
                        <span className="sub-text">#{item.id}</span>
                      </td>
                      <td>{item.author}</td>
                      <td>{getStatusBadge(item.status)}</td>
                      <td className="text-right">
                        <div className="action-group">
                          <Link
                            className="btn-icon"
                            title="Xem chi tiết"
                            to={`/cong-thuc/${item.id}-${item.slug || slugify(item.title) || 'mon-an'}`}
                          >
                            <i className="fa-regular fa-eye"></i>
                          </Link>

                          {item.status === 'pending' && (
                            <>
                              <button
                                className="btn-icon success"
                                title="Phê duyệt"
                                onClick={() => handleAction(item.originalId, 'approve')}
                              >
                                <i className="fa-solid fa-check"></i>
                              </button>
                              <button
                                className="btn-icon danger"
                                title="Từ chối"
                                onClick={() => handleAction(item.originalId, 'reject')}
                              >
                                <i className="fa-solid fa-xmark"></i>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                      Không có công thức nào ở trạng thái này.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
};

export default KiemDuyetCongThuc;
