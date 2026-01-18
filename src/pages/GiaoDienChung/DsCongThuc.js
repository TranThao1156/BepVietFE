// Thảo
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom"; // Trâm-đã sửa: Thêm useSearchParams
import { timKiemCongThuc } from "../../api/CongThucApi"; // Trâm-đã sửa: Import API

const DsCongThuc = () => {
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [recipes, setRecipes] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Trâm-đã sửa: Thêm state cho Sắp xếp và lấy Keyword từ URL
  const [sort, setSort] = useState('newest');
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';

  // Trâm-đã sửa: Viết lại useEffect để gọi API tìm kiếm
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Gọi hàm từ file api.js thay vì fetch trực tiếp
        const res = await timKiemCongThuc({
          page: page,
          limit: 6,
          sort: sort,     // Gửi kèm kiểu sắp xếp
          keyword: keyword // Gửi kèm từ khóa
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
  }, [page, sort, keyword]); // Trâm-đã sửa: Chạy lại khi Page, Sort hoặc Keyword thay đổi

  const mapDoKho = (value) => {
    if (value === 1 || value === "Dễ") return "Dễ";
    if (value === 2 || value === "Trung bình") return "Trung bình";
    if (value === 3 || value === "Khó") return "Khó";
    return "Không rõ";
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
          <button className="btn btn-primary">
            <Link to="/tao-cong-thuc" style={{ color: "white" }}>
              Thêm công thức mới
            </Link>
          </button>
        </div>
      </div>

      <div className="discovery-layout">
        {/* --- SIDEBAR BỘ LỌC (GIỮ NGUYÊN) --- */}
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
            <p style={{textAlign: 'center', padding: '20px'}}>Đang tải dữ liệu...</p>
          ) : (
            <div className="grid-3">
              {recipes.length > 0 ? (
                  recipes.map((recipe) => (
                    <article className="card" key={recipe.Ma_CT}>
                      <div className="card-img-wrapper">
                        <Link to={`/cong-thuc/${recipe.Ma_CT}`}>
                          <img
                            src={`http://127.0.0.1:8000/storage/img/CongThuc/${recipe.HinhAnh}`}
                            alt={recipe.TenMon}
                            className="card-img"
                            onError={(e) => {e.target.src = "https://placehold.co/600x400"}}
                          />
                        </Link>
                      </div>

                      <div className="card-body">
                        <span className="category-tag">DM #{recipe.Ma_DM}</span>

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
                          <div className="author">
                            <img
                              src={`https://ui-avatars.com/api/?name=User+${recipe.Ma_ND}&background=random`}
                              alt="Avatar"
                            />
                            <span>Đầu bếp #{recipe.Ma_ND}</span>
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
                  <p style={{padding: '20px'}}>Không tìm thấy công thức nào.</p>
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
                  <span style={{margin: '0 10px', display:'flex', alignItems:'center'}}>
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