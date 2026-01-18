import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const QlCongThuc = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0,
  });

  // Gọi API lấy danh sách công thức
  const fetchRecipes = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/user/cong-thuc?page=${page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      const result = await response.json();

      if (result.success) {
        setRecipes(result.data.data);
        setPagination({
          current_page: result.data.current_page,
          last_page: result.data.last_page,
          total: result.data.total,
          from: result.data.from,
          to: result.data.to,
        });
      }
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes(1);
  }, []);

  // Hàm chuyển trang
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      fetchRecipes(page);
    }
  };

  // Hàm xóa (Cần gọi API xóa thật)
  const handleDelete = async (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa món "${name}" không?`)) {
      try {
        const token = localStorage.getItem("access_token");
        // Gọi API xóa (Bạn cần tạo route này ở Backend sau)
        // await fetch(`http://127.0.0.1:8000/api/user/cong-thuc/${id}`, { method: 'DELETE', ... });

        // Tạm thời chỉ filter bỏ khỏi giao diện
        setRecipes(recipes.filter((r) => r.Ma_CT !== id));
        alert("Đã xóa thành công!");
      } catch (err) {
        alert("Xóa thất bại");
      }
    }
  };

  // Helper function để định dạng ngày
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Helper function để hiển thị badge trạng thái
  const getStatusBadge = (status) => {
    switch (status) {
      case "Đã duyệt":
        return <span className="badge badge-success">Đã duyệt</span>;
      case "Chờ duyệt":
        return <span className="badge badge-warning">Chờ duyệt</span>;
      case "Từ chối":
        return <span className="badge badge-danger">Từ chối</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <main className="main-content">
      <div className="content-header">
        <h1>Quản lý công thức</h1>
        <p>
          Xem lại các món ăn của bạn hoặc chia sẻ công thức mới cho cộng đồng.
        </p>
      </div>

      <div className="manage-card">
        <div className="manage-card-header">
          <h3>Danh sách món ăn</h3>
          <Link
            to="/nguoi-dung/ql-cong-thuc/tao-cong-thuc"
            className="btn btn-primary btn-sm"
          >
            <i className="fa-solid fa-plus"></i> Tạo mới
          </Link>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: "10%" }}>Ảnh</th>
                <th style={{ width: "30%" }}>Tên món</th>
                <th style={{ width: "20%" }}>Ngày tạo</th>
                <th style={{ width: "20%" }}>Trạng thái</th>
                <th style={{ width: "10%" }} className="text-right">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : recipes.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    Bạn chưa đăng công thức nào.
                  </td>
                </tr>
              ) : (
                recipes.map((recipe) => (
                  <tr key={recipe.Ma_CT}>
                    <td>
                      <img
                        // Kiểm tra nếu là link online hay link local
                        src={
                          recipe.HinhAnh && recipe.HinhAnh.startsWith("http")
                            ? recipe.HinhAnh
                            : recipe.HinhAnh
                              ? `http://127.0.0.1:8000/storage/img/CongThuc/${recipe.HinhAnh}`
                              : "https://via.placeholder.com/150?text=No+Image" // Ảnh mặc định nếu null
                        }
                        className="table-thumb"
                        alt={recipe.TenMon}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/80";
                        }} // Ảnh lỗi thì hiện placeholder
                      />
                    </td>
                    <td>
                      <div className="table-title">{recipe.TenMon}</div>
                      <div className="table-subtitle">
                        {recipe.loai_mon?.TenLoaiMon} •{" "}
                        {recipe.vung_mien?.TenVungMien}
                      </div>
                    </td>
                    <td className="table-date">
                      {formatDate(recipe.created_at)}
                    </td>
                    <td>{getStatusBadge(recipe.TrangThaiDuyet)}</td>
                    <td className="text-right">
                      <Link
                        to={`/nguoi-dung/ql-cong-thuc/sua-cong-thuc/${recipe.Ma_CT}`}
                        className="action-btn edit"
                        title="Sửa"
                      >
                        <i className="fa-solid fa-pen"></i>
                      </Link>
                      <button
                        className="action-btn delete"
                        onClick={() =>
                          handleDelete(recipe.Ma_CT, recipe.TenMon)
                        }
                        title="Xóa"
                      >
                        <i className="fa-regular fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Phân trang */}
        {!loading && recipes.length > 0 && (
          <div className="manage-card-footer">
            <div className="pagination-info">
              Hiển thị {pagination.from}-{pagination.to} trong số{" "}
              {pagination.total} món ăn
            </div>
            <div className="table-pagination">
              {/* Nút Previous */}
              <button
                className={`p-btn ${pagination.current_page === 1 ? "disabled" : ""}`}
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>

              {/* Các số trang */}
              {[...Array(pagination.last_page)].map((_, i) => (
                <button
                  key={i + 1}
                  className={`p-btn ${pagination.current_page === i + 1 ? "active" : ""}`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              {/* Nút Next */}
              <button
                className={`p-btn ${pagination.current_page === pagination.last_page ? "disabled" : ""}`}
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page}
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default QlCongThuc;
