// Thảo
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { timKiemCongThuc } from "../../api/CongThucApi";

const DsCongThuc = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [recipes, setRecipes] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Trâm-đã sửa: Thêm state cho Sắp xếp và lấy Keyword từ URL
  const [sort, setSort] = useState("newest");
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  // --- 👇 Trâm - chức năng: 1. KHAI BÁO STATE CHO BỘ LỌC 👇 ---
  const [filters, setFilters] = useState({
    region: "all",
    category: "all",
    difficulty: "all",
    time: "all",
  });
  // Biến này dùng để kích hoạt useEffect chạy lại khi bấm nút "Lọc kết quả"
  const [applyFilter, setApplyFilter] = useState(false);

  // --- 👇 Trâm - chức năng: 2. HÀM XỬ LÝ KHI CHỌN RADIO/CHECKBOX 👇 ---
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // --- 👇 Trâm - chức năng: 3. HÀM XỬ LÝ KHI BẤM NÚT "LỌC KẾT QUẢ" 👇 ---
  const handleApplyFilter = () => {
    setPage(1); // Reset về trang 1
    setApplyFilter(!applyFilter); // Đổi giá trị để kích hoạt useEffect
  };

  // Trâm-đã sửa: Viết lại useEffect để gọi API tìm kiếm
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Gọi hàm từ file api.js thay vì fetch trực tiếp
        const res = await timKiemCongThuc({
          page: page,
          limit: 6,
          sort: sort, // Gửi kèm kiểu sắp xếp
          keyword: keyword, // Gửi kèm từ khóa

          // Trâm - chức năng: 4. GỬI KÈM THAM SỐ LỌC XUỐNG API 
          region: filters.region,
          category: filters.category,
          difficulty: filters.difficulty,
          time: filters.time,
        });

        if (res.success) {
          setRecipes(res.data.data);
          setTotal(res.data.total);
          setLastPage(res.data.last_page);
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Trâm-đã sửa: Thêm applyFilter vào dependency để chạy lại khi bấm nút Lọc
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sort, keyword, applyFilter]);

  const mapDoKho = (value) => {
    // Vì database có thể lưu chữ hoặc số, map lại cho chắc chắn
    if (value === 1 || value === "Dễ") return "Dễ";
    if (value === 2 || value === "Trung bình") return "Trung bình";
    if (value === 3 || value === "Khó") return "Khó";
    return value;
  };

  // --- HÀM XỬ LÝ URL AVATAR ---
  const getAvatarUrl = (recipe) => {
    const nguoiDung = recipe?.nguoi_dung || recipe?.nguoidung || recipe?.nguoiDung;

    if (nguoiDung?.AnhDaiDien) {
      if (nguoiDung.AnhDaiDien.startsWith("http")) {
        return nguoiDung.AnhDaiDien;
      }
      return `http://127.0.0.1:8000/storage/img/NguoiDung/${nguoiDung.AnhDaiDien}`;
    }

    const name = nguoiDung?.HoTen || `User ${recipe.Ma_ND}`;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  };

  const handleCreateRecipe = () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/dang-nhap");
    } else {
      navigate("/nguoi-dung/ql-cong-thuc/tao-cong-thuc");
    }
  };

  return (
    <main className="container">
      <div className="page-header">
        <div className="breadcrumb">
          <Link to="/">Trang chủ</Link>{" "}
          <i className="fa-solid fa-chevron-right"></i> <span>Công thức</span>
        </div>
        <div className="header-row">
          <h1>Khám phá công thức</h1>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleCreateRecipe}
          >
            Thêm công thức mới
          </button>
        </div>
      </div>

      <div className="discovery-layout">
        {/* --- SIDEBAR BỘ LỌC (Giữ nguyên) --- */}
        <aside className="sidebar-filters">
          {/* 1. LỌC VÙNG MIỀN */}
          <div className="filter-group">
            <h3>
              <i className="fa-solid fa-earth-asia"></i> Vùng miền
            </h3>
            {/* Trâm - chức năng: Thêm value, checked, onChange */}
            <label className="custom-radio">
              <input
                type="radio"
                name="region"
                value="all"
                checked={filters.region === "all"}
                onChange={handleFilterChange}
              />
              <span className="radio-mark"></span>
              <span>Tất cả</span>
            </label>
            <label className="custom-radio">
              <input
                type="radio"
                name="region"
                value="1"
                checked={filters.region === "1"}
                onChange={handleFilterChange}
              />
              <span className="radio-mark"></span>
              <div>
                <span>Miền Bắc</span>
                <small>Thanh đạm, tinh tế</small>
              </div>
            </label>
            <label className="custom-radio">
              <input
                type="radio"
                name="region"
                value="2"
                checked={filters.region === "2"}
                onChange={handleFilterChange}
              />
              <span className="radio-mark"></span>
              <div>
                <span>Miền Trung</span>
                <small>Đậm đà, cay nồng</small>
              </div>
            </label>
            <label className="custom-radio">
              <input
                type="radio"
                name="region"
                value="3"
                checked={filters.region === "3"}
                onChange={handleFilterChange}
              />
              <span className="radio-mark"></span>
              <div>
                <span>Miền Nam</span>
                <small>Ngọt ngào, phong phú</small>
              </div>
            </label>
          </div>

          {/* 2. LỌC LOẠI MÓN */}
          <div className="filter-group">
            <h3>
              <i className="fa-solid fa-utensils"></i> Loại món
            </h3>

            {/* Trâm - chức năng: Thêm style trực tiếp để tạo thanh cuộn mà KHÔNG CẦN sửa CSS */}
            <div
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                paddingRight: "5px",
              }}
            >
              <label className="custom-radio">
                <input
                  type="radio"
                  name="category"
                  value="all"
                  checked={filters.category === "all"}
                  onChange={handleFilterChange}
                />
                <span className="radio-mark"></span> Tất cả
              </label>
              <label className="custom-radio">
                <input
                  type="radio"
                  name="category"
                  value="1"
                  checked={filters.category === "1"}
                  onChange={handleFilterChange}
                />
                <span className="radio-mark"></span> Món mặn
              </label>
              <label className="custom-radio">
                <input
                  type="radio"
                  name="category"
                  value="2"
                  checked={filters.category === "2"}
                  onChange={handleFilterChange}
                />
                <span className="radio-mark"></span> Món chay
              </label>
              <label className="custom-radio">
                <input
                  type="radio"
                  name="category"
                  value="3"
                  checked={filters.category === "3"}
                  onChange={handleFilterChange}
                />
                <span className="radio-mark"></span> Món ngọt
              </label>
              <label className="custom-radio">
                <input
                  type="radio"
                  name="category"
                  value="4"
                  checked={filters.category === "4"}
                  onChange={handleFilterChange}
                />
                <span className="radio-mark"></span> Món xào
              </label>
              <label className="custom-radio">
                <input
                  type="radio"
                  name="category"
                  value="5"
                  checked={filters.category === "5"}
                  onChange={handleFilterChange}
                />
                <span className="radio-mark"></span> Món chiên
              </label>
              <label className="custom-radio">
                <input
                  type="radio"
                  name="category"
                  value="6"
                  checked={filters.category === "6"}
                  onChange={handleFilterChange}
                />
                <span className="radio-mark"></span> Món hấp
              </label>
              <label className="custom-radio">
                <input
                  type="radio"
                  name="category"
                  value="7"
                  checked={filters.category === "7"}
                  onChange={handleFilterChange}
                />
                <span className="radio-mark"></span> Món nướng
              </label>
              <label className="custom-radio">
                <input
                  type="radio"
                  name="category"
                  value="8"
                  checked={filters.category === "8"}
                  onChange={handleFilterChange}
                />
                <span className="radio-mark"></span> Món canh
              </label>
              <label className="custom-radio">
                <input
                  type="radio"
                  name="category"
                  value="9"
                  checked={filters.category === "9"}
                  onChange={handleFilterChange}
                />
                <span className="radio-mark"></span> Món ăn vặt
              </label>
              <label className="custom-radio">
                <input
                  type="radio"
                  name="category"
                  value="10"
                  checked={filters.category === "10"}
                  onChange={handleFilterChange}
                />
                <span className="radio-mark"></span> Tráng miệng
              </label>
            </div>
          </div>

          {/* 3. LỌC THỜI GIAN & ĐỘ KHÓ */}
          <div className="filter-group">
            <h3>
              <i className="fa-solid fa-clock"></i> Thời gian & Độ khó
            </h3>

            {/* Độ khó - Trâm - chức năng: Thêm value, checked, onChange */}
            {/* DÙNG DROPDOWN (GỌN ĐẸP) */}
            <div className="difficulty-tags" style={{ marginBottom: "15px" }}>
              <select
                name="difficulty"
                value={filters.difficulty}
                onChange={handleFilterChange}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  outline: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  backgroundColor: "#fff",
                  color: "#333",
                }}
              >
                <option value="all">-- Tất cả độ khó --</option>
                <option value="1">Dễ</option>
                <option value="2">Trung bình</option>
                <option value="3">Khó</option>
              </select>
            </div>

            {/* Thời gian - Trâm - chức năng: Thêm value, checked, onChange và nút < 15 phút */}
            <div className="time-filter">
              <label className="custom-radio">
                <input
                  type="radio"
                  name="time"
                  value="all"
                  checked={filters.time === "all"}
                  onChange={handleFilterChange}
                />
                <span className="radio-mark"></span> Tất cả
              </label>
              {/* Thêm nút 15 phút */}
              <label className="custom-radio">
                <input
                  type="radio"
                  name="time"
                  value="under_15"
                  checked={filters.time === "under_15"}
                  onChange={handleFilterChange}
                />
                <span className="radio-mark"></span> &lt; 15 phút
              </label>
              <label className="custom-radio">
                <input
                  type="radio"
                  name="time"
                  value="under_30"
                  checked={filters.time === "under_30"}
                  onChange={handleFilterChange}
                />
                <span className="radio-mark"></span> &lt; 30 phút
              </label>
              <label className="custom-radio">
                <input
                  type="radio"
                  name="time"
                  value="30_60"
                  checked={filters.time === "30_60"}
                  onChange={handleFilterChange}
                />
                <span className="radio-mark"></span> 30 - 60 phút
              </label>
              <label className="custom-radio">
                <input
                  type="radio"
                  name="time"
                  value="over_60"
                  checked={filters.time === "over_60"}
                  onChange={handleFilterChange}
                />
                <span className="radio-mark"></span> &gt; 60 phút
              </label>
            </div>
          </div>

          <div className="filter-actions">
            {/* Trâm - chức năng: Thêm sự kiện onClick */}
            <button className="btn-filter" onClick={handleApplyFilter}>
              <i className="fa-solid fa-filter"></i> Lọc kết quả
            </button>
          </div>
        </aside>

        {/* MAIN LIST */}
        <div className="main-list">
          <div className="list-top-bar">
            <span className="result-count">
              Tìm thấy <b>{total}</b> kết quả
            </span>
            <div className="list-actions">
              <div className="sort-box">
                <span>Sắp xếp:</span>
                {/* Trâm-đã sửa: Thêm logic onChange cho Select */}
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1); // Reset về trang 1 khi đổi sắp xếp
                  }}
                >
                  <option value="newest">Mới nhất</option>
                  <option value="popular">Phổ biến</option>
                  <option value="oldest">Cũ nhất</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <p style={{ textAlign: "center", padding: "20px" }}>
              Đang tải dữ liệu...
            </p>
          ) : (
            <div className="grid-3">
              {recipes.length > 0 ? (
                recipes.map((recipe) => (
                  <article className="card" key={recipe.Ma_CT}>
                    <div className="card-img-wrapper">
                      <Link to={`/cong-thuc/${recipe.Ma_CT}-${recipe.slug_url}`}>
                        <img
                          src={`http://127.0.0.1:8000/storage/img/CongThuc/${recipe.HinhAnh}`}
                          alt={recipe.TenMon}
                          className="card-img"
                          onError={(e) => {
                            e.target.src = "https://placehold.co/600x400";
                          }}
                        />
                      </Link>
                    </div>

                    <div className="card-body">
                      {/* SỬA 1: recipe.danh_muc (khớp với model function danh_muc) */}
                      <span className="category-tag">
                        {/* Trâm -HIỂN THỊ DANH MỤC: Ưu tiên hiện Tên, nếu không có thì hiện Mã */}
                        {recipe.danh_muc
                          ? recipe.danh_muc.TenDM
                          : `DM #${recipe.Ma_DM}`}
                      </span>
                      <Link
                        to={`/cong-thuc/${recipe.Ma_CT}`}
                        className="card-title"
                      >
                        {recipe.TenMon}
                      </Link>

                      <div className="card-meta">
                        <span>
                          <i className="fa-regular fa-clock"></i>{" "}
                          {recipe.ThoiGianNau}p
                        </span>
                        <span>
                          <i className="fa-solid fa-chart-simple"></i>{" "}
                          {mapDoKho(recipe.DoKho)}
                        </span>
                      </div>

                      <div className="card-footer">
                        {/* SỬA 2: recipe.nguoidung (khớp với model function nguoidung) */}
                        {/* Phân trang */}
                        <div className="author">
                          <img
                            src={getAvatarUrl(recipe)}
                            alt="Avatar"
                            style={{ objectFit: "cover" }}
                          />
                          <span>
                            {recipe.nguoi_dung
                              ? recipe.nguoi_dung.HoTen
                              : "Ẩn danh"}
                          </span>
                        </div>
                        <div className="rating">
                          {/* Trâm-đã sửa: Hiển thị SoLuotXem thay vì rating cứng */}
                          <i className="fa-solid fa-eye"></i> {recipe.SoLuotXem}
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <p style={{ padding: "20px" }}>Không tìm thấy công thức nào.</p>
              )}

              {lastPage > 1 && (
                <div className="pagination">
                  <button
                    className="page-link"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>

                  {/* Trâm-đã sửa: Hiển thị số trang đơn giản */}
                  <span
                    style={{
                      margin: "0 10px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Trang {page} / {lastPage}
                  </span>

                  <button
                    className="page-link"
                    disabled={page === lastPage}
                    onClick={() => setPage(page + 1)}
                  >
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default DsCongThuc;
