import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const QuanLyDanhMuc = () => {
    // 1. Khai báo State
    const [categories, setCategories] = useState([]); // Chứa danh sách danh mục
    const [loading, setLoading] = useState(true);     // Trạng thái đang tải
    const [pagination, setPagination] = useState({}); // Thông tin phân trang
    const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm
    const [suggestions, setSuggestions] = useState([]); // Lưu danh sách gợi ý
    const [showSuggestions, setShowSuggestions] = useState(false); // Ẩn/Hiện gợi ý
    const searchTimeoutRef = useRef(null); // Dùng để Debounce (tránh gọi API liên tục)

    // 2. Hàm gọi API
    const fetchCategories = async (page = 1, search = '') => {
        setLoading(true);
        try {
            // 1. Lấy Token từ bộ nhớ (Giả sử lúc đăng nhập bạn lưu là 'user_token' hoặc 'access_token')
            // Bạn cần kiểm tra lại file Login.js xem bạn lưu token tên là gì nhé!
            const token = localStorage.getItem('user_token') || localStorage.getItem('access_token');

            // Nếu không có token thì thông báo hoặc chuyển về login
            if (!token) {
                console.error("Chưa tìm thấy Token đăng nhập!");
                // Có thể redirect về login tại đây nếu muốn
            }

            const url = `http://localhost:8000/api/admin/danh-muc?page=${page}&search=${search}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // 2. BẮT BUỘC: Thêm dòng này để Laravel trả về JSON khi lỗi
                    'Accept': 'application/json',
                    // 3. QUAN TRỌNG NHẤT: Gửi kèm Token để chứng minh "Tôi là Admin"
                    'Authorization': `Bearer ${token}`
                }
            });

            // Xử lý trường hợp Token hết hạn hoặc không hợp lệ (Lỗi 401)
            if (response.status === 401) {
                alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                // window.location.href = "/login"; // Chuyển hướng về trang đăng nhập
                return;
            }

            const data = await response.json();

            // Cập nhật State
            setCategories(data.data);
            setPagination({
                current_page: data.current_page,
                last_page: data.last_page,
                from: data.from,
                to: data.to,
                total: data.total
            });

        } catch (error) {
            console.error("Lỗi kết nối:", error);
        } finally {
            setLoading(false);
        }
    };

    // 3. useEffect: Chạy 1 lần khi trang vừa load
    useEffect(() => {
        fetchCategories();
    }, []);

    // 4. Xử lý tìm kiếm khi nhấn Enter
    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Nếu xóa hết chữ thì ẩn gợi ý
        if (value.length === 0) {
            setSuggestions([]);
            setShowSuggestions(false);
            fetchCategories(1, ''); // Load lại bảng đầy đủ
            return;
        }

        // --- KỸ THUẬT DEBOUNCE (Chờ người dùng dừng gõ 300ms mới gọi API) ---
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(async () => {
            try {
                // Gọi API tìm kiếm riêng cho gợi ý
                const token = localStorage.getItem('user_token') || localStorage.getItem('access_token');
                // Gọi đúng API search hiện tại
                const url = `http://localhost:8000/api/admin/danh-muc?search=${value}`;

                const response = await fetch(url, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();

                // Lấy danh sách kết quả (Laravel trả về data.data)
                if (data.data && data.data.length > 0) {
                    setSuggestions(data.data);
                    setShowSuggestions(true);
                } else {
                    setShowSuggestions(false);
                }
            } catch (error) {
                console.error("Lỗi gợi ý:", error);
            }
        }, 300); // 300ms
    };
    const selectSuggestion = (name) => {
        setSearchTerm(name);       // 1. Điền tên vào ô input
        setShowSuggestions(false); // 2. Ẩn danh sách gợi ý
        fetchCategories(1, name);  // 3. Kích hoạt tìm kiếm cho bảng chính
    };
    const handleDelete = async (id) => {
        // 1. Hỏi xác nhận
        if (!window.confirm("Bạn có chắc chắn muốn XÓA (Ẩn) danh mục này không?")) {
            return;
        }

        try {
            const token = localStorage.getItem('user_token') || localStorage.getItem('access_token');

            // 2. Gọi API Delete (Backend giờ sẽ chuyển TrangThai về 0)
            const response = await fetch(`http://localhost:8000/api/admin/danh-muc/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // 3. CẬP NHẬT GIAO DIỆN (Quan trọng)
                // Thay vì xóa dòng (filter), ta tìm dòng đó và sửa TrangThai = 0
                setCategories(categories.map(cat =>
                    cat.Ma_DM === id ? { ...cat, TrangThai: 0 } : cat
                ));

                alert("Đã chuyển danh mục sang trạng thái Ẩn!");
            } else {
                alert("Có lỗi xảy ra khi xóa.");
            }
        } catch (error) {
            console.error("Lỗi:", error);
            alert("Lỗi kết nối server.");
        }
    };

    // 5. Xử lý chuyển trang
    const changePage = (page) => {
        if (page >= 1 && page <= pagination.last_page) {
            fetchCategories(page, searchTerm);
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
                    <input
                        type="text"
                        placeholder="Tìm kiếm danh mục..."
                        value={searchTerm}
                        onChange={handleInputChange} // Đổi hàm onChange ở đây
                        onKeyDown={(e) => {
                            // Nếu nhấn Enter thì tắt gợi ý và tìm kiếm luôn
                            if (e.key === 'Enter') {
                                setShowSuggestions(false);
                                fetchCategories(1, searchTerm);
                            }
                        }}
                        // (Tùy chọn) Khi click ra ngoài thì ẩn (đơn giản nhất là dùng onBlur delay)
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    />

                    {/* --- DANH SÁCH GỢI Ý --- */}
                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="suggestions-list">
                            {suggestions.map((item) => (
                                <li
                                    key={item.Ma_DM}
                                    onClick={() => selectSuggestion(item.TenDM)}
                                >
                                    {item.TenDM}
                                    {/* (Có thể hiển thị thêm loại cho đẹp) */}
                                    <span style={{ float: 'right', fontSize: '0.8em', color: '#999' }}>
                                        {item.LoaiDM}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <Link to="/quan-tri/quan-ly-danh-muc/tao-danh-muc" className="btn btn-primary">
                    <i className="fas fa-plus-circle" style={{ marginRight: '8px' }}></i> Tạo danh mục mới
                </Link>
            </div>

            {/* --- TABLE HIỂN THỊ DỮ LIỆU --- */}
            <div className="card" style={{ height: 'auto', minHeight: 'unset' }}>
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th style={{ width: '10%' }}>ID</th>
                                <th style={{ width: '30%' }}>TÊN DANH MỤC</th>
                                <th style={{ width: '20%' }}>LOẠI</th>
                                <th style={{ width: '20%' }}>TRẠNG THÁI</th>
                                <th style={{ width: '20%', textAlign: 'right' }}>HÀNH ĐỘNG</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center' }}>Đang tải dữ liệu...</td></tr>
                            ) : categories.length > 0 ? (
                                categories.map((cat) => (
                                    <tr key={cat.Ma_DM}> {/* Dùng Ma_DM làm key */}

                                        <td>#{cat.Ma_DM}</td>

                                        <td><strong>{cat.TenDM}</strong></td>

                                        <td>
                                            <span className="badge-gray">{cat.LoaiDM}</span>
                                        </td>

                                        <td>
                                            {/* Xử lý hiển thị trạng thái 1/0 */}
                                            {cat.TrangThai === 1
                                                ? <span style={{ color: 'green', fontWeight: 'bold' }}>Hiển thị</span>
                                                : <span style={{ color: 'red' }}>Ẩn</span>
                                            }
                                        </td>

                                        <td>
                                            <div className="action-group">
                                                {/* Các nút này hiện tại chỉ để hiển thị, chưa cần logic */}
                                                <Link
                                                    to={`/quan-tri/quan-ly-danh-muc/sua-danh-muc/${cat.Ma_DM}`}
                                                    className="btn-icon"
                                                    title="Sửa danh mục" // Thêm title để di chuột vào thấy chữ
                                                >
                                                    <i className="fas fa-pen"></i>
                                                </Link>
                                                <button
                                                    className="btn-icon"
                                                    onClick={() => handleDelete(cat.Ma_DM)}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                        Không tìm thấy danh mục nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* --- PHÂN TRANG --- */}
                {!loading && pagination.total > 0 && (
                    <div className="card-footer">
                        <span className="text-gray" style={{ fontSize: '0.85rem' }}>
                            Hiển thị {pagination.from} - {pagination.to} trên tổng {pagination.total}
                        </span>
                        <div className="pagination">
                            <button
                                disabled={pagination.current_page === 1}
                                onClick={() => changePage(pagination.current_page - 1)}
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>

                            <button className="active">{pagination.current_page}</button>

                            <button
                                disabled={pagination.current_page === pagination.last_page}
                                onClick={() => changePage(pagination.current_page + 1)}
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default QuanLyDanhMuc;