import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';

    const QuanLyNguoiDung = () => {
        const [users, setUsers] = useState([]);
        const [tuKhoa, setTuKhoa] = useState('');
        const [vaiTro, setVaiTro] = useState('');
        const TOKEN = localStorage.getItem('token');

        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${TOKEN}`
        };
        

        // API chung để lấy danh sách người dùng
        const fetchUsers = async (
            keyword = tuKhoa,
            role = vaiTro,
            page = meta.current_page
            ) => {
                let url = `http://localhost:8000/api/admin/quan-ly-nguoi-dung?`;

                if (keyword) url += `tuKhoa=${encodeURIComponent(keyword)}&`;
                if (role !== '') url += `vaiTro=${role}&`;
                url += `page=${page}`;

                try {
                    const res = await fetch(url, { headers });
                    const json = await res.json();

                    setUsers(json.data || []);
                    setMeta(json.meta);
                } catch (err) {
                    console.error('Lỗi load users', err);
                }
            };
        // Phân trang
        const [meta, setMeta] = useState({
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 0
        });
        // Hàm chuyển trang
        const changePage = (page) => {
            if (page < 1 || page > meta.last_page) return;
            fetchUsers(tuKhoa, vaiTro, page);
        };
        // Tìm kiếm
        const handleSearch = (e) => {
            const value = e.target.value;
            setTuKhoa(value);
            fetchUsers(value, vaiTro);
        };

        // Lọc theo vai trò
        const handleFilterRole = (e) => {
            const value = e.target.value;
            setVaiTro(value);
            fetchUsers(tuKhoa, value);
        };

        useEffect(() => {
            fetchUsers();
        }, []);

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
                        <Link to="/quan-tri/quan-ly-nguoi-dung/them-nguoi-dung" className="btn btn-primary">
                            <i className="fa-solid fa-user-plus"></i> Thêm người dùng
                        </Link>
                    </div>
                </div>

                <div className="card">
                    {/* --- TOOLBAR (Tìm kiếm & Filter) --- */}
                    <div className="card-toolbar" style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid #eee' }}>
                        <div className="search-wrap custom-search" style={{ width: '400px' }}>
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <input
                            type="text"
                            placeholder="Tìm kiếm theo tên hoặc email..."
                            value={tuKhoa}
                            onChange={handleSearch}
                            />
                        </div>

                        <div className="filter-dropdown">
                            <select className="form-select" value={vaiTro} onChange={handleFilterRole}>
                                <option value="">Tất cả vai trò</option>
                                <option value="0">Quản trị viên</option>
                                <option value="1">Người dùng</option>
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
                                    <tr key={user.Ma_ND}>
                                        <td>
                                            <div className="user-info-cell">
                                                <img src={user.AnhDaiDien} className="avatar-md" alt="Avatar" />
                                                <strong>{user.HoTen}</strong>
                                            </div>
                                        </td>
                                        <td>{user.Email}</td>
                                        <td>
                                            {user.VaiTro === 0 ? (
                                                <span className="badge-role admin">Admin</span>
                                            ) : (
                                                <span className="badge-role user">Người dùng</span>
                                            )}
                                        </td>
                                        <td className="text-right">
                                            <div className="action-group">
                                                <Link to={`/quan-tri/quan-ly-nguoi-dung/sua-nguoi-dung/${user.Ma_ND}`} className="btn-icon">
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </Link>
                                                <button
                                                    className="btn-icon"
                                                    onClick={() => handleDelete(user.Ma_ND)}
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
                        <span className="text-gray">
                            Hiển thị {users.length} / {meta.total} kết quả
                        </span>

                        <div className="pagination">
                            {/* Prev */}
                            <button
                                disabled={meta.current_page === 1}
                                onClick={() => changePage(meta.current_page - 1)}
                            >
                                <i className="fa-solid fa-chevron-left"></i>
                            </button>

                            {/* Page numbers */}
                            {Array.from({ length: meta.last_page }, (_, i) => i + 1)
                                .slice(
                                    Math.max(meta.current_page - 3, 0),
                                    Math.min(meta.current_page + 2, meta.last_page)
                                )
                                .map((page) => (
                                    <button
                                        key={page}
                                        className={page === meta.current_page ? 'active' : ''}
                                        onClick={() => changePage(page)}
                                    >
                                        {page}
                                    </button>
                                ))}

                            {/* Next */}
                            <button
                                disabled={meta.current_page === meta.last_page}
                                onClick={() => changePage(meta.current_page + 1)}
                            >
                                <i className="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        );
    };

export default QuanLyNguoiDung;