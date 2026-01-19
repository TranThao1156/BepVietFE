import React from 'react';
import { Link } from 'react-router';
import { useEffect, useState } from 'react';

const Blog = () => {
  const [loading, setLoading] = useState(true);
  const [blogsData, setBlogsData] = useState({data: [],current_page: 1,last_page: 1,});
  const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/blog?page=${currentPage}`);

        if (!response.ok) {
          throw new Error("Lỗi khi lấy danh sách blog");
        }

        const data = await response.json();
        setBlogsData(data.data);
        // Kiểm tra dữ liệu nhận được
        console.log(Array.isArray(blogsData), blogsData);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage]);

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

//   const blogs = blogsData;

  return (
    <main className="container">
        <div className="blog-header-section">
            <div className="breadcrumb" style={{justifyContent: 'center'}}>
                <Link to="/">Trang chủ</Link> <i className="fa-solid fa-chevron-right"></i> <span>Blog & Chia sẻ</span>
            </div>
            <h1>Góc Chia Sẻ & Mẹo Vặt</h1>
            <p>Nơi lưu giữ những câu chuyện bếp núc, mẹo vặt cuộc sống và văn hóa ẩm thực ba miền.</p>
        </div>

        <div className="blog-toolbar">
            <span className="result-count">Hiển thị <b>{blogsData?.data?.length}</b> bài viết mới nhất</span>
            <div className="sort-box">
                <i className="fa-solid fa-arrow-up-wide-short"></i>
                <span>Sắp xếp:</span>
                <select defaultValue="newest">
                    <option value="newest">Mới nhất</option>
                    <option value="popular">Xem nhiều nhất</option>
                </select>
            </div>
        </div>

        <div className="grid-4">
            {blogsData.data.map((blog) => (
                <article className="card blog-card" key={blog.Ma_Blog}>
                    <div className="card-img-wrapper">
                        <Link to={`/blog/${blog.Ma_Blog}`}>
                            <img src={`http://127.0.0.1:8000/storage/img/Blog/${blog.HinhAnh}`} 
                            
                            alt={blog.TieuDe}
                            className="card-img" />
                        </Link>
                    </div>
                    <div className="card-body">
                        <Link to={`/blog/${blog.Ma_Blog}`} className="card-title">{blog.TieuDe}</Link>
                        {/* Nội dung chỉ hiển thị 1 đoạn ngắn */}
                        <p className="blog-desc">{blog.MoTaNgan}</p>
                        <div className="card-footer">
                            <div className="blog-date">
                                <i className="fa-regular fa-calendar"></i> {blog.NgayDang}
                            </div>
                        </div>
                    </div>
                </article>
            ))}
        </div>

        {/* Phân trang */}
        {blogsData && (
        <div className="pagination">
            {/* Prev */}
            <a
            href="#"
            className="page-link"
            onClick={(e) => {
                e.preventDefault();
                if (blogsData.current_page > 1) {
                setCurrentPage(blogsData.current_page - 1);
                }
            }}
            >
            <i className="fa-solid fa-chevron-left"></i>
            </a>

            {/* Pages */}
            {Array.from({ length: blogsData.last_page }, (_, index) => {
            const page = index + 1;
            return (
                <a
                href="#"
                key={page}
                className={`page-link ${
                    page === blogsData.current_page ? 'active' : ''
                }`}
                onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(page);
                }}
                >
                {page}
                </a>
            );
            })}

            {/* Next */}
            <a
            href="#"
            className="page-link"
            onClick={(e) => {
                e.preventDefault();
                if (blogsData.current_page < blogsData.last_page) {
                setCurrentPage(blogsData.current_page + 1);
                }
            }}
            >
            <i className="fa-solid fa-chevron-right"></i>
            </a>
        </div>
        )}

    </main>
  );
};

export default Blog;