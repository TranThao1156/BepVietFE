import React, { useState } from 'react';

const KiemDuyetNoiDung = () => {
  // --- QUẢN LÝ STATE ---
  const [contentType, setContentType] = useState('recipes'); // 'recipes' hoặc 'blogs'
  const [statusFilter, setStatusFilter] = useState('pending'); // 'pending', 'approved', 'rejected'

  // --- DỮ LIỆU GIẢ LẬP (MOCK DATA) ---
  const recipesData = [
    { id: 'REC-001', name: 'Phở Bò (Demo)', author: 'NguyenVanA', status: 'pending' },
    { id: 'REC-002', name: 'Bún Chả Hà Nội', author: 'LeThiB', status: 'approved' },
    { id: 'REC-003', name: 'Canh Cua (Ảnh mờ)', author: 'TranVanC', status: 'rejected' },
    { id: 'REC-004', name: 'Cơm Tấm Sườn Bì', author: 'ChefTuan', status: 'pending' },
  ];

  const blogsData = [
    { id: 'ART-001', title: '5 Mẹo nấu ăn ngon', author: 'ChefMaster', status: 'pending' },
    { id: 'ART-002', title: 'Review Quán Ngon Q1', author: 'FoodReviewer', status: 'approved' },
    { id: 'ART-003', title: 'Cách bảo quản rau củ', author: 'MomCook', status: 'pending' },
  ];

  // --- LOGIC LỌC DỮ LIỆU ---
  const currentList = contentType === 'recipes' ? recipesData : blogsData;
  const filteredData = currentList.filter(item => item.status === statusFilter);

  // --- HÀM HỖ TRỢ: Badge trạng thái ---
  const getStatusBadge = (status) => {
    switch(status) {
        case 'pending': return <span className="status-badge warning">Chờ duyệt</span>;
        case 'approved': return <span className="status-badge success">Đã duyệt</span>;
        case 'rejected': return <span className="status-badge danger">Từ chối</span>;
        default: return null;
    }
  };

  return (
    <main className="main-content">
        <div className="page-header-flex">
            <div className="header-text">
                <h1>Kiểm duyệt nội dung</h1>
                <p className="subtitle">Phê duyệt hoặc từ chối nội dung người dùng đóng góp.</p>
            </div>
            <div className="header-actions">
                <button 
                    className={`btn ${contentType === 'recipes' ? 'btn-primary' : 'btn-white'}`}
                    onClick={() => setContentType('recipes')}
                >
                    Duyệt công thức
                </button>
                <button 
                    className={`btn ${contentType === 'blogs' ? 'btn-primary' : 'btn-white'}`}
                    onClick={() => setContentType('blogs')}
                >
                    Duyệt bài viết
                </button>
            </div>
        </div>

        <div className="card">
            <div className="tabs-nav">
                <button 
                    className={`tab-link ${statusFilter === 'pending' ? 'active' : ''}`} 
                    onClick={() => setStatusFilter('pending')}
                >
                    Chờ duyệt 
                    <span className="badge-count">
                        {currentList.filter(i => i.status === 'pending').length}
                    </span>
                </button>

                <button 
                    className={`tab-link ${statusFilter === 'approved' ? 'active' : ''}`} 
                    onClick={() => setStatusFilter('approved')}
                >
                    Đã duyệt
                </button>

                <button 
                    className={`tab-link ${statusFilter === 'rejected' ? 'active' : ''}`} 
                    onClick={() => setStatusFilter('rejected')}
                >
                    Từ chối
                </button>
            </div>

            <div className="table-responsive">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th width="40%">
                                {contentType === 'recipes' ? 'Món ăn' : 'Tiêu đề bài viết'}
                            </th>
                            <th width="20%">Tác giả</th>
                            <th width="15%">Trạng thái</th>
                            <th width="15%" className="text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((item) => (
                                <tr key={item.id} className="item-row">
                                    <td>
                                        <strong>{item.name || item.title}</strong>
                                        <br/>
                                        <span className="sub-text">#{item.id}</span>
                                    </td>
                                    <td>{item.author}</td>
                                    <td>{getStatusBadge(item.status)}</td>
                                    <td className="text-right">
                                        <div className="action-group">
                                            <button className="btn-icon" title="Xem chi tiết">
                                                <i className="fa-regular fa-eye"></i>
                                            </button>
                                            
                                            {item.status === 'pending' && (
                                                <>
                                                    <button className="btn-icon success" title="Phê duyệt">
                                                        <i className="fa-solid fa-check"></i>
                                                    </button>
                                                    <button className="btn-icon danger" title="Từ chối">
                                                        <i className="fa-solid fa-xmark"></i>
                                                    </button>
                                                </>
                                            )}
                                            
                                            <button className="btn-icon" title="Xóa">
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{textAlign: 'center', padding: '30px', color: '#888'}}>
                                    Không có dữ liệu nào ở trạng thái này.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </main>
  );
};

export default KiemDuyetNoiDung;