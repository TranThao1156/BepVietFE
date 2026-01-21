import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const CookBook = () => {
  const [dsCookbook, setDsCookbook] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCookbooks = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          navigate("/dang-nhap");
          return;
        }

        const response = await fetch(
          "http://localhost:8000/api/user/cookbook",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          },
        );

        const data = await response.json();
        if (data.success) {
          // Lọc dữ liệu ngay khi lấy về: Chỉ lấy những cái có TrangThai != 0
          // (Phòng trường hợp API trả về cả những cái đã xóa)
          const activeCookbooks = data.data.filter((cb) => cb.TrangThai !== 0);
          setDsCookbook(activeCookbooks);
        }
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCookbooks();
  }, [navigate]);

  // --- HÀM XỬ LÝ XÓA MỀM (ẨN ĐI) ---
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn ẩn bộ sưu tập này không?")) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");

      // Lưu ý: Backend cần có route nhận method PUT để cập nhật
      // Chúng ta gửi TrangThai = 0 lên
      const response = await fetch(
        `http://localhost:8000/api/user/cookbook/${id}/xoa`,
        {
          method: "PUT", // Dùng PUT để cập nhật
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json", // Bắt buộc có dòng này khi gửi body
          },
          body: JSON.stringify({
            TrangThai: 0, // Gửi trạng thái muốn cập nhật
          }),
        },
      );

      const data = await response.json();

      if (data.success || response.ok) {
        // Xóa thành công thì loại bỏ khỏi danh sách trên giao diện ngay lập tức
        setDsCookbook((current) => current.filter((cb) => cb.id !== id));
        alert("Đã xóa bộ sưu tập thành công!");
      } else {
        alert(data.message || "Lỗi khi cập nhật trạng thái.");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Lỗi kết nối server.");
    }
  };

  const filteredCookbooks = dsCookbook.filter((cb) =>
    cb.TenCookBook.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <main className="main-content">
      <div className="content-header-flex">
        <div className="header-text">
          <h1>Cookbook của tôi</h1>
          <p>Bộ sưu tập các công thức yêu thích của bạn.</p>
        </div>
        <Link
          to="/nguoi-dung/cookbook/tao-cookbook"
          className="btn btn-primary"
        >
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
          <p style={{ gridColumn: "1/-1", textAlign: "center" }}>
            Đang tải dữ liệu...
          </p>
        ) : filteredCookbooks.length === 0 ? (
          <div
            style={{ gridColumn: "1/-1", textAlign: "center", color: "#666" }}
          >
            <i
              className="fa-regular fa-folder-open"
              style={{ fontSize: "40px" }}
            ></i>
            <p>
              {searchTerm
                ? "Không tìm thấy kết quả."
                : "Bạn chưa có bộ sưu tập nào."}
            </p>
          </div>
        ) : (
          filteredCookbooks.map((cookbook) => (
            <div className="cb-card" key={cookbook.id}>
              <div className="cb-img-wrapper">
                <Link to={`/nguoi-dung/cookbook/chi-tiet/${cookbook.id}`}>
                  <img
                    src={cookbook.AnhBia} // 1. Dùng tên biến AnhBia. 2. Dùng trực tiếp link backend trả về
                    alt={cookbook.TenCookBook}
                    className="cb-img" // Nên thêm class để CSS object-fit: cover cho đẹp
                    onError={(e) => {
                      e.target.src =
                        "https://placehold.co/600x400?text=No+Image";
                    }}
                  />
                </Link>
                <span className="cb-count">
                  <i className="fa-solid fa-book-open"></i>{" "}
                  {cookbook.SoLuongMon} món
                </span>
              </div>

              <div className="cb-body">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "10px",
                  }}
                >
                  <h3
                    className="cb-title"
                    style={{ margin: 0, paddingRight: "10px" }}
                  >
                    {cookbook.TenCookBook}
                  </h3>

                  <button
                    onClick={() => handleDelete(cookbook.id)}
                    title="Xóa bộ sưu tập"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#ff4d4f",
                      fontSize: "16px",
                      padding: "0 5px",
                    }}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>

                <div className="cb-footer">
                  <span className="cb-time">
                    {cookbook.TrangThai === 0 ? (
                      <i className="fa-solid fa-lock" title="Riêng tư"></i>
                    ) : (
                      <i className="fa-solid fa-globe" title="Công khai"></i>
                    )}
                    {" " + cookbook.NgayTao}
                  </span>
                  <Link
                    to={`/nguoi-dung/cookbook/chi-tiet/${cookbook.id}`}
                    className="cb-link"
                  >
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
