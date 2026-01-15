import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const QuanLyNguoiDung = () => {
    // --- MOCK DATA ---
    const [users, setUsers] = useState([
        { id: 1, name: "Nguyen Van A", email: "a.nguyen@example.com", role: "admin", avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+A&background=random" },
        { id: 2, name: "Tran Thi B", email: "b.tran@cookshare.vn", role: "user", avatar: "https://ui-avatars.com/api/?name=Tran+Thi+B&background=random" },
        { id: 3, name: "Le Van C", email: "c.le@gmail.com", role: "user", avatar: "https://ui-avatars.com/api/?name=Le+Van+C&background=random" },
        { id: 4, name: "Pham Thi D", email: "pham.d@example.com", role: "user", avatar: "https://ui-avatars.com/api/?name=Pham+Thi+D&background=random" },
        { id: 5, name: "Vu Van E", email: "vu.e@cookshare.vn", role: "user", avatar: "https://ui-avatars.com/api/?name=Vu+Van+E&background=random" },
    ]);

    // --- HÀM XỬ LÝ XÓA ---
    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    return (
        <main className="main-content">

            {/* --- HEADER --- */}
            <div className="page-header-flex">
                <div className="header-text">
                    <h1>Quản lý người dùng</h1>
                    <p className="subtitle">Quản lý tất cả tài khoản, vai trò và phân quyền thành viên.</p>
                </div>
                <div className="header-actions">
                    {/* Link tới trang Thêm người dùng */}
                    <Link to="/admin/quanlynguoidung/themnguoidung" className="btn btn-primary">
                        <i className="fa-solid fa-user-plus"></i> Thêm người dùng
                    </Link>
                </div>
            </div>

            <div className="card">
                {/* --- TOOLBAR (Tìm kiếm & Filter) --- */}
                <div className="card-toolbar" style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid #eee' }}>
                    <div className="search-wrap custom-search" style={{ width: '400px' }}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input type="text" placeholder="Tìm kiếm theo tên hoặc email..." />
                    </div>

                    <div className="filter-dropdown">
                        <select className="form-select" defaultValue="">
                            <option value="">Tất cả vai trò</option>
                            <option value="admin">Quản trị viên</option>
                            <option value="user">Người dùng</option>
                        </select>
                    </div>
                </div>

                {/* --- TABLE --- */}
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th width="30%">Người dùng</th>
                                <th width="30%">Email</th>
                                <th width="20%">Vai trò</th>
                                <th width="20%" className="text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="user-info-cell">
                                            <img src={user.avatar} className="avatar-md" alt="Avatar" />
                                            <strong>{user.name}</strong>
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        {user.role === 'admin' ? (
                                            <span className="badge-role admin">Admin</span>
                                        ) : (
                                            <span className="badge-role user">Người dùng</span>
                                        )}
                                    </td>
                                    <td className="text-right">
                                        <div className="action-group">
                                            <Link to={`/admin/quanlynguoidung/suanguoidung/${user.id}`} className="btn-icon">
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </Link>
                                            <button
                                                className="btn-icon"
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* --- FOOTER --- */}
                <div className="card-footer">
                    <span className="text-gray">Hiển thị {users.length} kết quả</span>
                    <div className="pagination">
                        <button disabled><i className="fa-solid fa-chevron-left"></i></button>
                        <button className="active">1</button>
                        <button>2</button>
                        <button>3</button>
                        <span>...</span>
                        <button><i className="fa-solid fa-chevron-right"></i></button>
                    </div>
                </div>

            </div>
        </main>
    );
};

export default QuanLyNguoiDung;