import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
const KiemDuyetNoiDung = () => {
  // --- CẤU HÌNH API ---
  const API_URL = "http://localhost:8000/api/admin";
  // --- QUẢN LÝ STATE ---
  // Mặc định hiển thị 'blogs' để dùng API ngay
  const [contentType, setContentType] = useState("blogs");
  const [statusFilter, setStatusFilter] = useState("pending"); // 'pending', 'approved', 'rejected'
  // Dữ liệu Blog lấy từ API
  const [blogData, setBlogData] = useState([]);
  const [loading, setLoading] = useState(false);
  // --- HELPER 1: Map trạng thái từ Database (Tiếng Việt) -> UI (Tiếng Anh) ---
  const mapStatusFromDB = (dbStatus) => {
    switch (dbStatus) {
      case "Chờ duyệt":
        return "pending";
      case "Chấp nhận":
        return "approved";
      case "Từ chối":
        return "rejected";
      default:
        return "pending";
    }
  };

  // --- 1. HÀM GỌI API LẤY DANH SÁCH ---
  const fetchBlogs = useCallback(async () => {
    // Chỉ xử lý API cho Blog
    if (contentType !== "blogs") return;

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      // Gọi API với filter hiện tại
      const response = await fetch(
        `${API_URL}/duyet-blog?trang_thai=${statusFilter}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        if (response.status === 401) throw new Error("UNAUTHORIZED");
        throw new Error("Lỗi kết nối server");
      }

      const result = await response.json();

      // Map dữ liệu API vào State
      const formattedData = result.data.map((item) => ({
        id: item.Ma_Blog, // ID dùng để hiển thị
        title: item.TieuDe, // Tiêu đề
        author: item.Ma_ND, // ID Tác giả
        status: mapStatusFromDB(item.TrangThaiDuyet), // Chuyển đổi trạng thái
        originalId: item.Ma_Blog, // ID gốc để gửi lại API khi xử lý
      }));

      setBlogData(formattedData);
    } catch (error) {
      console.error("Lỗi:", error);
      if (error.message === "UNAUTHORIZED") {
        alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      }
    } finally {
      setLoading(false);
    }
  }, [contentType, statusFilter]);

  // --- 2. HÀM XỬ LÝ DUYỆT / TỪ CHỐI (CẬP NHẬT TỨC THÌ) ---
  const handleAction = async (id, action) => {
    // 1. Xác nhận người dùng
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn ${action === "approve" ? "duyệt" : "từ chối"} bài viết này?`,
      )
    )
      return;

    const token = localStorage.getItem("token");

    try {
      // 2. Gọi API Backend để lưu vào DB
      const response = await fetch(`${API_URL}/duyet-blog/xu-ly`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ma_blog: id,
          hanh_dong: action,
        }),
      });

      if (!response.ok) throw new Error("Lỗi xử lý từ Server");

      // 3. CẬP NHẬT GIAO DIỆN NGAY LẬP TỨC (Optimistic UI Update)
      setBlogData((prevData) => {
        return prevData.filter((item) => item.originalId !== id);
      });
    } catch (error) {
      alert("Có lỗi xảy ra: " + error.message);
      fetchBlogs();
    }
  };

  // --- USE EFFECT: Gọi API khi chuyển tab hoặc đổi filter ---
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // --- HELPER: Badge trạng thái ---
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="status-badge warning">Chờ duyệt</span>;
      case "approved":
        return <span className="status-badge success">Đã duyệt</span>;
      case "rejected":
        return <span className="status-badge danger">Từ chối</span>;
      default:
        return null;
    }
  };

  return (
    <main className="main-content">
      <div className="page-header-flex">
        <div className="header-text">
          <h1>Kiểm duyệt nội dung</h1>
          <p className="subtitle">Quản lý các bài viết.</p>
        </div>

        {/* Nếu bạn chưa làm API Công thức, có thể ẩn nút này hoặc giữ làm placeholder */}
        <div className="header-actions">
          <button
            className={`btn ${contentType === "blogs" ? "btn-primary" : "btn-white"}`}
            onClick={() => setContentType("blogs")}
          >
            Duyệt bài viết
          </button>
          <button
            className={`btn ${contentType === "recipes" ? "btn-primary" : "btn-white"}`}
            onClick={() => setContentType("recipes")}
          >
            Duyệt công thức
          </button>
        </div>
      </div>

      <div className="card">
        {/* Tab trạng thái */}
        <div className="tabs-nav">
          {["pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              className={`tab-link ${statusFilter === status ? "active" : ""}`}
              onClick={() => setStatusFilter(status)}
            >
              {status === "pending"
                ? "Chờ duyệt"
                : status === "approved"
                  ? "Đã duyệt"
                  : "Từ chối"}
            </button>
          ))}
        </div>

        {/* Bảng dữ liệu */}
        <div className="table-responsive">
          {loading ? (
            <div
              style={{ padding: "30px", textAlign: "center", color: "#666" }}
            >
              Đang tải dữ liệu từ API...
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th width="40%">Tiêu đề bài viết</th>
                  <th width="20%">Tác giả (Mã ND)</th>
                  <th width="15%">Trạng thái</th>
                  <th width="15%" className="text-right">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Logic hiển thị: Nếu là blogs thì hiện data từ API, recipes thì hiện thông báo */}
                {contentType === "blogs" ? (
                  blogData.length > 0 ? (
                    blogData.map((item) => (
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
                            {/* Nút Xem chi tiết */}

                            {/* Nút Duyệt/Từ chối chỉ hiện khi trạng thái là Pending */}
                            {item.status === "pending" && (
                              <>
                                <Link
                                  to={`/cong-thuc/${item.id}-${item.title
                                    .toLowerCase()
                                    .normalize("NFD")
                                    .replace(/[\u0300-\u036f]/g, "")
                                    .replace(/đ/g, "d")
                                    .replace(/[^a-z0-9]+/g, "-")
                                    .replace(/^-+|-+$/g, "")}`}
                                  className="btn-icon"
                                  title="Xem chi tiết"
                                >
                                  <i className="fa-solid fa-eye"></i>
                                </Link>
                                <button
                                  className="btn-icon success"
                                  title="Phê duyệt"
                                  onClick={() =>
                                    handleAction(item.originalId, "approve")
                                  }
                                >
                                  <i className="fa-solid fa-check"></i>
                                </button>
                                <button
                                  className="btn-icon danger"
                                  title="Từ chối"
                                  onClick={() =>
                                    handleAction(item.originalId, "reject")
                                  }
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
                      <td
                        colSpan="4"
                        style={{
                          textAlign: "center",
                          padding: "30px",
                          color: "#888",
                        }}
                      >
                        Không có bài viết nào ở trạng thái này.
                      </td>
                    </tr>
                  )
                ) : (
                  // Placeholder cho phần Recipes
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        textAlign: "center",
                        padding: "30px",
                        color: "#888",
                      }}
                    >
                      Tính năng duyệt công thức đang được phát triển.
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

export default KiemDuyetNoiDung;
