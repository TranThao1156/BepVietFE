import React from 'react';
import { Link } from 'react-router-dom';

const DsCongThuc = () => {
  // Dữ liệu giả (Mock Data)
  const recipes = [
    { id: 1, name: "Phở Bò Gia Truyền", time: "90p", diff: "Trung bình", img: "https://images.unsplash.com/photo-1582878826618-c05326eff935?q=80&w=2070&auto=format&fit=crop", author: "Bếp cô Minh", rating: 4.9, category: "Bữa sáng" },
    { id: 2, name: "Cơm Tấm Sườn Bì", time: "45p", diff: "Dễ", img: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=1000&auto=format&fit=crop", author: "Chef Tuấn", rating: 4.7, category: "Món chính" },
    { id: 3, name: "Gỏi Cuốn Tôm Thịt", time: "30p", diff: "Rất dễ", img: "https://images.unsplash.com/photo-1548596638-349c25055b80?q=80&w=1000&auto=format&fit=crop", author: "Lan Nhi", rating: 5.0, category: "Khai vị" },
    { id: 4, name: "Bánh Xèo Miền Tây", time: "60p", diff: "Khó", img: "https://images.unsplash.com/photo-1551185627-2b7b3b421274?q=80&w=1000&auto=format&fit=crop", author: "Mẹ Gấu", rating: 4.5, category: "Món chính" },
    { id: 5, name: "Bún Bò Huế", time: "120p", diff: "Khó", img: "https://images.unsplash.com/photo-1503764654157-72d979d98934?q=80&w=1000&auto=format&fit=crop", author: "Huế Thương", rating: 4.8, category: "Bữa sáng" },
    { id: 6, name: "Bánh Mì Pate", time: "20p", diff: "Dễ", img: "https://images.unsplash.com/photo-1628198640748-417c128063f8?q=80&w=1000&auto=format&fit=crop", author: "Bếp Việt", rating: 4.6, category: "Ăn nhanh" },
  ];

  return (
    <main className="container">
        <div className="page-header">
            <div className="breadcrumb">
                <Link to="/">Trang chủ</Link> <i className="fa-solid fa-chevron-right"></i> <span>Công thức</span>
            </div>
            <div className="header-row">
                <h1>Khám phá công thức</h1>
                <button className="btn btn-primary">
                    <Link to="/tao-cong-thuc" style={{color: 'white'}}>Thêm công thức mới</Link>
                </button>
            </div>
        </div>

        <div className="discovery-layout">

            {/* --- SIDEBAR BỘ LỌC --- */}
            <aside className="sidebar-filters">
                <div className="filter-group">
                    <h3><i className="fa-solid fa-earth-asia"></i> Vùng miền</h3>
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
                    <h3><i className="fa-solid fa-utensils"></i> Loại món</h3>
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
                    <h3><i className="fa-solid fa-clock"></i> Thời gian & Độ khó</h3>

                    <div className="difficulty-tags">
                        <label>
                            <input type="radio" name="difficulty" className="hidden-input" />
                            <span className="tag-pill bg-red">Dễ</span>
                        </label>
                        <label>
                            <input type="radio" name="difficulty" className="hidden-input" defaultChecked />
                            <span className="tag-pill bg-gray">Trung bình</span>
                        </label>
                        <label>
                            <input type="radio" name="difficulty" className="hidden-input" />
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

            {/* --- DANH SÁCH MAIN LIST --- */}
            <div className="main-list">
                <div className="list-top-bar">
                    <span className="result-count">Tìm thấy <b>{recipes.length}</b> kết quả</span>
                    <div className="list-actions">
                        <div className="sort-box">
                            <span>Sắp xếp:</span>
                            <select defaultValue="newest">
                                <option value="newest">Mới nhất</option>
                                <option value="popular">Phổ biến nhất</option>
                                <option value="rating">Đánh giá cao</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid-3">
                    {recipes.map((recipe) => (
                        <article className="card" key={recipe.id}>
                            <div className="card-img-wrapper">
                                <Link to={`/cong-thuc/${recipe.id}`}>
                                    <img src={recipe.img} alt={recipe.name} className="card-img" />
                                </Link>
                            </div>
                            <div className="card-body">
                                <span className="category-tag">{recipe.category}</span>
                                <Link to={`/cong-thuc/${recipe.id}`} className="card-title">{recipe.name}</Link>
                                <div className="card-meta">
                                    <span><i className="fa-regular fa-clock"></i> {recipe.time}</span>
                                    <span><i className="fa-solid fa-chart-simple"></i> {recipe.diff}</span>
                                </div>
                                <div className="card-footer">
                                    <div className="author">
                                        <img src={`https://ui-avatars.com/api/?name=${recipe.author}&background=random`} alt="Avatar" />
                                        <span>{recipe.author}</span>
                                    </div>
                                    <div className="rating"><i className="fa-solid fa-star"></i> {recipe.rating}</div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="pagination">
                    <a href="#" className="page-link"><i className="fa-solid fa-chevron-left"></i></a>
                    <a href="#" className="page-link active">1</a>
                    <a href="#" className="page-link">2</a>
                    <a href="#" className="page-link">3</a>
                    <span className="page-dots">...</span>
                    <a href="#" className="page-link">12</a>
                    <a href="#" className="page-link"><i className="fa-solid fa-chevron-right"></i></a>
                </div>

            </div>
        </div>
    </main>
  );
};

export default DsCongThuc;