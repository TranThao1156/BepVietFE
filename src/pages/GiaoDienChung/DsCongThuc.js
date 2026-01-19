// Thảo
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const DsCongThuc = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [recipes, setRecipes] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/cong-thuc?limit=6&page=${page}`)
      .then((res) => res.json())
      .then((json) => {
        setRecipes(json.data.data);
        setTotal(json.data.total);
        setLastPage(json.data.last_page);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  const mapDoKho = (value) => {
    if (value === 1 || value === "Dễ") return "Dễ";
    if (value === 2 || value === "Trung bình") return "Trung bình";
    if (value === 3 || value === "Khó") return "Khó";
    return "Không rõ";
  };

  // --- HÀM XỬ LÝ URL AVATAR ---
  const getAvatarUrl = (user) => {
    if (!user) return "https://ui-avatars.com/api/?name=User&background=random";
    
    // Nếu có ảnh trong DB
    if (user.AnhDaiDien) {
      // Nếu là link online (Google/Facebook)
      if (user.AnhDaiDien.startsWith("http")) return user.AnhDaiDien;
      
      // Nếu là ảnh upload local
      // Lưu ý: Đảm bảo đường dẫn này khớp với nơi bạn lưu ảnh user trong Laravel
      return `http://127.0.0.1:8000/storage/img/NguoiDung/${user.AnhDaiDien}`;
    }

    // Fallback: Tạo avatar theo tên
    return `https://ui-avatars.com/api/?name=${user.HoTen}&background=random`;
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
          <div className="filter-group">
            <h3>
              <i className="fa-solid fa-earth-asia"></i> Vùng miền
            </h3>
            <label className="custom-radio">
              <input type="radio" name="region" defaultChecked />
              <span className="radio-mark"></span>
              <span>Tất cả</span>
            </label>
            <label className="custom-radio">
              <input type="radio" name="region" />
              <span className="radio-mark"></span>
              <div>
                <span>Miền Bắc</span>
                <small>Thanh đạm, tinh tế</small>
              </div>
            </label>
            <label className="custom-radio">
              <input type="radio" name="region" />
              <span className="radio-mark"></span>
              <div>
                <span>Miền Trung</span>
                <small>Đậm đà, cay nồng</small>
              </div>
            </label>
            <label className="custom-radio">
              <input type="radio" name="region" />
              <span className="radio-mark"></span>
              <div>
                <span>Miền Nam</span>
                <small>Ngọt ngào, phong phú</small>
              </div>
            </label>
          </div>

          <div className="filter-group">
            <h3>
              <i className="fa-solid fa-utensils"></i> Loại món
            </h3>
            <label className="custom-checkbox">
              <input type="checkbox" />
              <span className="checkmark"></span> Món khai vị
            </label>
            <label className="custom-checkbox">
              <input type="checkbox" defaultChecked />
              <span className="checkmark"></span> Món chính
            </label>
            <label className="custom-checkbox">
              <input type="checkbox" />
              <span className="checkmark"></span> Tráng miệng
            </label>
            <label className="custom-checkbox">
              <input type="checkbox" />
              <span className="checkmark"></span> Đồ uống
            </label>
          </div>

          <div className="filter-group">
            <h3>
              <i className="fa-solid fa-clock"></i> Thời gian & Độ khó
            </h3>

            <div className="difficulty-tags">
              <label>
                <input
                  type="radio"
                  name="difficulty"
                  className="hidden-input"
                />
                <span className="tag-pill bg-red">Dễ</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="difficulty"
                  className="hidden-input"
                  defaultChecked
                />
                <span className="tag-pill bg-gray">Trung bình</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="difficulty"
                  className="hidden-input"
                />
                <span className="tag-pill bg-gray">Khó</span>
              </label>
            </div>

            <div className="time-filter">
              <label className="custom-radio">
                <input type="radio" name="time" defaultChecked />
                <span className="radio-mark"></span> Tất cả
              </label>
              <label className="custom-radio">
                <input type="radio" name="time" />
                <span className="radio-mark"></span> &lt; 30 phút
              </label>
              <label className="custom-radio">
                <input type="radio" name="time" />
                <span className="radio-mark"></span> 30 - 60 phút
              </label>
            </div>
          </div>
          <div className="filter-actions">
            <button className="btn-filter">
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
                <select>
                  <option value="newest">Mới nhất</option>
                  <option value="popular">Phổ biến</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
            <div className="grid-3">
              {recipes.map((recipe) => (
                <article className="card" key={recipe.Ma_CT}>
                  <div className="card-img-wrapper">
                    <Link to={`/cong-thuc/${recipe.Ma_CT}`}>
                      <img
                        src={`http://127.0.0.1:8000/storage/img/CongThuc/${recipe.HinhAnh}`}
                        alt={recipe.TenMon}
                        className="card-img"
                      />
                    </Link>
                  </div>

                  <div className="card-body">
                    {/* SỬA 1: recipe.danh_muc (khớp với model function danh_muc) */}
                    <span className="category-tag">
                      {recipe.danh_muc ? recipe.danh_muc.TenDM : "Món ngon"}
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
                        {recipe.ThoiGianNau}
                      </span>
                      <span>
                        <i className="fa-solid fa-chart-simple"></i>{" "}
                        {mapDoKho(recipe.DoKho)}
                      </span>
                    </div>

                    <div className="card-footer">
                      {/* SỬA 2: recipe.nguoidung (khớp với model function nguoidung) */}
                      <div className="author">
                        <img
                          src={getAvatarUrl(recipe.nguoi_dung)}
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
                        <i className="fa-solid fa-star"></i> 5.0
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              {/* Phân trang */}
              {lastPage > 1 && (
                <div className="pagination">
                  <button
                    className="page-link"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>

                  {[...Array(lastPage)].map((_, i) => (
                    <button
                      key={i}
                      className={`page-link ${page === i + 1 ? "active" : ""}`}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}

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