// // Thảo

// import React, { useEffect, useState } from "react";

// import { Link } from "react-router-dom";



// const DsCongThuc = () => {

//   const [page, setPage] = useState(1);

//   const [lastPage, setLastPage] = useState(1);



//   const [recipes, setRecipes] = useState([]);

//   const [total, setTotal] = useState(0);

//   const [loading, setLoading] = useState(true);



//   useEffect(() => {

//     setLoading(true);

//     fetch(`http://127.0.0.1:8000/api/cong-thuc?limit=6&page=${page}`)

//       .then((res) => res.json())

//       .then((json) => {

//         setRecipes(json.data.data);

//         setTotal(json.data.total);

//         setLastPage(json.data.last_page);

//       })

//       .catch(console.error)

//       .finally(() => setLoading(false));

//   }, [page]);



//   const mapDoKho = (value) => {

//     if (value === 1 || value === "Dễ") return "Dễ";

//     if (value === 2 || value === "Trung bình") return "Trung bình";

//     if (value === 3 || value === "Khó") return "Khó";

//     return "Không rõ";

//   };



//   return (

//     <main className="container">

//       <div className="page-header">

//         <div className="breadcrumb">

//           <Link to="/">Trang chủ</Link>{" "}

//           <i className="fa-solid fa-chevron-right"></i> <span>Công thức</span>

//         </div>

//         <div className="header-row">

//           <h1>Khám phá công thức</h1>

//           <button className="btn btn-primary">

//             <Link to="/tao-cong-thuc" style={{ color: "white" }}>

//               Thêm công thức mới

//             </Link>

//           </button>

//         </div>

//       </div>



//       <div className="discovery-layout">

//         {/* --- SIDEBAR BỘ LỌC --- */}

//         <aside className="sidebar-filters">

//           <div className="filter-group">

//             <h3>

//               <i className="fa-solid fa-earth-asia"></i> Vùng miền

//             </h3>

//             <label className="custom-radio">

//               <input type="radio" name="region" defaultChecked />

//               <span className="radio-mark"></span>

//               <span>Tất cả</span>

//             </label>

//             <label className="custom-radio">

//               <input type="radio" name="region" />

//               <span className="radio-mark"></span>

//               <div>

//                 <span>Miền Bắc</span>

//                 <small>Thanh đạm, tinh tế</small>

//               </div>

//             </label>

//             <label className="custom-radio">

//               <input type="radio" name="region" />

//               <span className="radio-mark"></span>

//               <div>

//                 <span>Miền Trung</span>

//                 <small>Đậm đà, cay nồng</small>

//               </div>

//             </label>

//             <label className="custom-radio">

//               <input type="radio" name="region" />

//               <span className="radio-mark"></span>

//               <div>

//                 <span>Miền Nam</span>

//                 <small>Ngọt ngào, phong phú</small>

//               </div>

//             </label>

//           </div>



//           <div className="filter-group">

//             <h3>

//               <i className="fa-solid fa-utensils"></i> Loại món

//             </h3>

//             <label className="custom-checkbox">

//               <input type="checkbox" />

//               <span className="checkmark"></span> Món khai vị

//             </label>

//             <label className="custom-checkbox">

//               <input type="checkbox" defaultChecked />

//               <span className="checkmark"></span> Món chính

//             </label>

//             <label className="custom-checkbox">

//               <input type="checkbox" />

//               <span className="checkmark"></span> Tráng miệng

//             </label>

//             <label className="custom-checkbox">

//               <input type="checkbox" />

//               <span className="checkmark"></span> Đồ uống

//             </label>

//           </div>



//           <div className="filter-group">

//             <h3>

//               <i className="fa-solid fa-clock"></i> Thời gian & Độ khó

//             </h3>



//             <div className="difficulty-tags">

//               <label>

//                 <input

//                   type="radio"

//                   name="difficulty"

//                   className="hidden-input"

//                 />

//                 <span className="tag-pill bg-red">Dễ</span>

//               </label>

//               <label>

//                 <input

//                   type="radio"

//                   name="difficulty"

//                   className="hidden-input"

//                   defaultChecked

//                 />

//                 <span className="tag-pill bg-gray">Trung bình</span>

//               </label>

//               <label>

//                 <input

//                   type="radio"

//                   name="difficulty"

//                   className="hidden-input"

//                 />

//                 <span className="tag-pill bg-gray">Khó</span>

//               </label>

//             </div>



//             <div className="time-filter">

//               <label className="custom-radio">

//                 <input type="radio" name="time" defaultChecked />

//                 <span className="radio-mark"></span> Tất cả

//               </label>

//               <label className="custom-radio">

//                 <input type="radio" name="time" />

//                 <span className="radio-mark"></span> &lt; 30 phút

//               </label>

//               <label className="custom-radio">

//                 <input type="radio" name="time" />

//                 <span className="radio-mark"></span> 30 - 60 phút

//               </label>

//             </div>

//           </div>

//           <div className="filter-actions">

//             <button className="btn-filter">

//               <i className="fa-solid fa-filter"></i> Lọc kết quả

//             </button>

//           </div>

//         </aside>



//         {/* MAIN LIST */}

//         <div className="main-list">

//           <div className="list-top-bar">

//             <span className="result-count">

//               Tìm thấy <b>{total}</b> kết quả

//             </span>

//             <div className="list-actions">

//               <div className="sort-box">

//                 <span>Sắp xếp:</span>

//                 <select>

//                   <option value="newest">Mới nhất</option>

//                   <option value="popular">Phổ biến</option>

//                 </select>

//               </div>

//             </div>

//           </div>



//           {loading ? (

//             <p>Đang tải dữ liệu...</p>

//           ) : (

//             <div className="grid-3">

//               {recipes.map((recipe) => (

//                 <article className="card" key={recipe.Ma_CT}>

//                   <div className="card-img-wrapper">

//                     <Link to={`/cong-thuc/${recipe.Ma_CT}`}>

//                       <img

//                         src={`http://127.0.0.1:8000/storage/img/CongThuc/${recipe.HinhAnh}`}

//                         alt={recipe.TenMon}

//                         className="card-img"

//                       />

//                     </Link>

//                   </div>



//                   <div className="card-body">

//                     <span className="category-tag">DM #{recipe.Ma_DM}</span>



//                     <Link

//                       to={`/cong-thuc/${recipe.Ma_CT}`}

//                       className="card-title"

//                     >

//                       {recipe.TenMon}

//                     </Link>



//                     <div className="card-meta">

//                       <span>

//                         <i className="fa-regular fa-clock"></i>{" "}

//                         {recipe.ThoiGianNau}

//                       </span>

//                       <span>

//                         <i className="fa-solid fa-chart-simple"></i>{" "}

//                         {mapDoKho(recipe.DoKho)}

//                       </span>

//                     </div>



//                     <div className="card-footer">

//                       <div className="author">

//                         <img

//                           src={`https://ui-avatars.com/api/?name=BepViet&background=random`}

//                           alt="Avatar"

//                         />

//                         <span>Bếp Việt</span>

//                       </div>

//                       <div className="rating">

//                         <i className="fa-solid fa-star"></i> 5.0

//                       </div>

//                     </div>

//                   </div>

//                 </article>

//               ))}

//               {lastPage > 1 && (

//                 <div className="pagination">

//                   <button

//                     className="page-link"

//                     disabled={page === 1}

//                     onClick={() => setPage(page - 1)}

//                   >

//                     <i className="fa-solid fa-chevron-left"></i>

//                   </button>



//                   {[...Array(lastPage)].map((_, i) => (

//                     <button

//                       key={i}

//                       className={`page-link ${page === i + 1 ? "active" : ""}`}

//                       onClick={() => setPage(i + 1)}

//                     >

//                       {i + 1}

//                     </button>

//                   ))}



//                   <button

//                     className="page-link"

//                     disabled={page === lastPage}

//                     onClick={() => setPage(page + 1)}

//                   >

//                     <i className="fa-solid fa-chevron-right"></i>

//                   </button>

//                 </div>

//               )}

//             </div>

//           )}

//         </div>

//       </div>

//     </main>

//   );

// };



// export default DsCongThuc;





import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom"; // Thêm useSearchParams để bắt từ khóa

const DsCongThuc = () => {
  // --- 1. STATE QUẢN LÝ ---
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ total: 0, last_page: 1, current_page: 1 });

  // Hook lấy tham số trên URL (Ví dụ: ?keyword=pho&page=1)
  const [searchParams, setSearchParams] = useSearchParams();

  // State bộ lọc (Chỉ quan tâm Sort và Page, Keyword lấy từ URL)
  const [filter, setFilter] = useState({
    page: 1,
    sort: 'newest'
  });

  // --- 2. GỌI API ---
  const fetchData = async () => {
    setLoading(true);
    try {
      // Lấy từ khóa đang có trên URL (do Header truyền xuống)
      const keyword = searchParams.get('keyword') || '';

      // Tạo chuỗi query gửi xuống Backend
      const queryString = new URLSearchParams({
        page: filter.page,
        sort: filter.sort,
        keyword: keyword // Gửi kèm từ khóa
      }).toString();

      const response = await fetch(`http://127.0.0.1:8000/api/tim-kiem?${queryString}`);
      const json = await response.json();

      if (json.success) {
        setRecipes(json.data.data);
        setMeta({
          total: json.data.total,
          last_page: json.data.last_page,
          current_page: json.data.current_page
        });
      }
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tự động gọi lại API khi: URL thay đổi (tìm kiếm), Sort đổi, hoặc Page đổi
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, filter.sort, filter.page]);

  // --- 3. XỬ LÝ SỰ KIỆN ---
  const handleSortChange = (e) => {
    setFilter({ ...filter, sort: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= meta.last_page) {
        setFilter({ ...filter, page: newPage });
        window.scrollTo(0, 0);
    }
  };

  // Helper hiển thị độ khó
  const mapDoKho = (value) => {
    if (String(value) === "1" || value === "Dễ") return "Dễ";
    if (String(value) === "2" || value === "Trung bình") return "Trung bình";
    if (String(value) === "3" || value === "Khó") return "Khó";
    return value;
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
        
        {/* --- SIDEBAR (GIỮ NGUYÊN HTML TĨNH CHO NGƯỜI KHÁC CODE) --- */}
        <aside className="sidebar-filters">
          <div className="filter-group">
            <h3><i className="fa-solid fa-earth-asia"></i> Vùng miền</h3>
            <label className="custom-radio">
              <input type="radio" name="region" defaultChecked />
              <span className="radio-mark"></span> <span>Tất cả</span>
            </label>
            <label className="custom-radio">
              <input type="radio" name="region" />
              <span className="radio-mark"></span> 
              <div><span>Miền Bắc</span><small>Thanh đạm, tinh tế</small></div>
            </label>
            <label className="custom-radio">
              <input type="radio" name="region" />
              <span className="radio-mark"></span>
              <div><span>Miền Trung</span><small>Đậm đà, cay nồng</small></div>
            </label>
            <label className="custom-radio">
              <input type="radio" name="region" />
              <span className="radio-mark"></span>
              <div><span>Miền Nam</span><small>Ngọt ngào, phong phú</small></div>
            </label>
          </div>

          <div className="filter-group">
            <h3><i className="fa-solid fa-utensils"></i> Loại món</h3>
            <label className="custom-checkbox"><input type="checkbox" /><span className="checkmark"></span> Món khai vị</label>
            <label className="custom-checkbox"><input type="checkbox" defaultChecked /><span className="checkmark"></span> Món chính</label>
            <label className="custom-checkbox"><input type="checkbox" /><span className="checkmark"></span> Tráng miệng</label>
            <label className="custom-checkbox"><input type="checkbox" /><span className="checkmark"></span> Đồ uống</label>
          </div>

          <div className="filter-group">
            <h3><i className="fa-solid fa-clock"></i> Thời gian & Độ khó</h3>
            <div className="difficulty-tags">
              <label><input type="radio" name="difficulty" className="hidden-input"/><span className="tag-pill bg-green">Dễ</span></label>
              <label><input type="radio" name="difficulty" className="hidden-input" defaultChecked/><span className="tag-pill bg-yellow">Trung bình</span></label>
              <label><input type="radio" name="difficulty" className="hidden-input"/><span className="tag-pill bg-red">Khó</span></label>
            </div>
            <div className="time-filter">
               <label className="custom-radio"><input type="radio" name="time" defaultChecked /><span className="radio-mark"></span> Tất cả</label>
               <label className="custom-radio"><input type="radio" name="time" /><span className="radio-mark"></span> &lt; 30 phút</label>
               <label className="custom-radio"><input type="radio" name="time" /><span className="radio-mark"></span> 30 - 60 phút</label>
            </div>
          </div>

          <div className="filter-actions">
            <button className="btn-filter">
              <i className="fa-solid fa-filter"></i> Lọc kết quả
            </button>
          </div>
        </aside>

        {/* --- MAIN LIST --- */}
        <div className="main-list">
          <div className="list-top-bar">
            {/* Cập nhật số lượng tìm thấy */}
            <span className="result-count">
              Tìm thấy <b>{meta.total}</b> kết quả
            </span>
            <div className="list-actions">
              <div className="sort-box">
                <span>Sắp xếp:</span>
                {/* --- LOGIC SẮP XẾP --- */}
                <select value={filter.sort} onChange={handleSortChange}>
                  <option value="newest">Mới nhất</option>
                  <option value="popular">Phổ biến</option>
                  <option value="oldest">Cũ nhất</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
             <div style={{textAlign:'center', padding:'20px'}}>Đang tải dữ liệu...</div>
          ) : (
            <div className="grid-3">
              {/* --- VÒNG LẶP HIỂN THỊ DỮ LIỆU THẬT --- */}
              {recipes.length > 0 ? recipes.map((recipe) => (
                <article className="card" key={recipe.Ma_CT}>
                  <div className="card-img-wrapper">
                    <Link to={`/cong-thuc/${recipe.Ma_CT}`}>
                      <img
                        src={recipe.HinhAnh ? `http://127.0.0.1:8000/storage/img/CongThuc/${recipe.HinhAnh}` : "https://placehold.co/600x400"}
                        alt={recipe.TenMon}
                        className="card-img"
                        onError={(e) => {e.target.src = "https://placehold.co/600x400"}}
                      />
                    </Link>
                  </div>

                  <div className="card-body">
                    <span className="category-tag">DM #{recipe.Ma_DM}</span>

                    <Link to={`/cong-thuc/${recipe.Ma_CT}`} className="card-title">
                      {recipe.TenMon}
                    </Link>

                    <div className="card-meta">
                      <span><i className="fa-regular fa-clock"></i> {recipe.ThoiGianNau}p</span>
                      <span><i className="fa-solid fa-chart-simple"></i> {mapDoKho(recipe.DoKho)}</span>
                    </div>

                    <div className="card-footer">
                      <div className="author">
                        <img src={`https://ui-avatars.com/api/?name=User+${recipe.Ma_ND}&background=random`} alt="Avt" />
                        <span>Đầu bếp #{recipe.Ma_ND}</span>
                      </div>
                      <div className="rating">
                        <i className="fa-solid fa-eye"></i> {recipe.SoLuotXem}
                      </div>
                    </div>
                  </div>
                </article>
              )) : (
                 <p style={{padding:'20px'}}>Không tìm thấy kết quả nào.</p>
              )}

              {/* --- PHÂN TRANG --- */}
              {meta.last_page > 1 && (
                <div className="pagination">
                  <button
                    className="page-link"
                    disabled={filter.page === 1}
                    onClick={() => handlePageChange(filter.page - 1)}
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                  <span style={{margin:'0 10px', display:'flex', alignItems:'center'}}>
                      Trang {meta.current_page} / {meta.last_page}
                  </span>
                  <button
                    className="page-link"
                    disabled={filter.page === meta.last_page}
                    onClick={() => handlePageChange(filter.page + 1)}
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