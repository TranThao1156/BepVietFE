import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const QlBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cho mọi nguoi dùng đều có thể xem được danh sách blog của chính họ
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(
          `http://127.0.0.1:8000/api/user/blog-ca-nhan`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        const result = await response.json();
        if(result.success) {
          setBlogs(result.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <p style={{ textAlign: 'center' }}>Đang tải dữ liệu...</p>;

  // Hàm xử lý xóa bài viết
  const handleDelete = (e, blogTitle) => {
    // Ngăn chặn hành vi mặc định nếu nút nằm trong thẻ Link (dù ở đây là button, nhưng thói quen tốt)
    e.preventDefault(); 
    if (window.confirm(`Bạn có chắc muốn xóa bài viết "${blogTitle}"?`)) {
      console.log('Đã xóa bài viết:', blogTitle);
      // Gọi API xóa ở đây
    }
  };

  return (
    <main className="main-content">

      <div className="content-header">
        <h1>Quản lý Blog</h1>
        <p>Chia sẻ kinh nghiệm nấu ăn, mẹo vặt nhà bếp hoặc review quán ăn.</p>
      </div>

      <div className="blog-manage-grid">

        {/* Card Tạo mới - Tôi đã chuyển div thành Link để có thể click được */}
        <Link to="/nguoi-dung/ql-blog/tao-blog" className="blog-create-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="create-icon">
            <i className="fa-solid fa-plus"></i>
          </div>
          <h3>Viết bài chia sẻ mới</h3>
          <p>Lan tỏa niềm đam mê ẩm thực của bạn</p>
        </Link>

        {/* Blog Card  */}
        {blogs.map((blog) => (
          <div className="blog-manage-card" key={blog.Ma_Blog}>
            <div className="blog-card-thumb">
              <Link to={`/blog/${blog.Ma_Blog}`} className="card-img">
                <img
                  // src={`http://127.0.0.1:8000/storage/img/Blog/${blog.HinhAnh}`}
                  src={blog.HinhAnh}
                  alt={blog.TieuDe}
                />
              </Link>
              <span
                className={`status-label ${
                  blog.TrangThaiDuyet === 'Chấp nhận'
                    ? 'label-success'
                    : blog.TrangThaiDuyet === 'Từ chối'
                    ? 'label-danger'
                    : 'label-warning'
                }`}
              >
                {blog.TrangThaiDuyet}
              </span>
            </div>
            <div className="blog-card-body">
              <div className="blog-meta-date">
                <i className="fa-regular fa-clock"></i>{" "}
                {/* Điều chỉnh Ngày đăng chỉ hiện dd/mm/yyyy */}
                {(new Date(blog.created_at)).toLocaleDateString()}
              </div>
              <Link to={`/blog/${blog.Ma_Blog}`} className="blog-card-link" >
              <h3 className="blog-card-title">{blog.TieuDe}</h3>
              </Link>
              <p className="blog-card-desc">
                {blog.ND_ChiTiet?.slice(0, 120)}...
              </p>

              <div className="blog-card-footer">
                <span><i className="fa-regular fa-comment"></i> {blog.binh_luan_count ?? 0}</span>
              </div>
            </div>

            <div className="blog-actions">
              <Link
                to={`/nguoi-dung/ql-blog/sua-blog/${blog.Ma_Blog}`}
                className="btn-icon btn-edit"
              >
                <i className="fa-regular fa-pen-to-square"></i>
              </Link>

              <button
                className="btn-icon btn-delete"
                onClick={(e) => handleDelete(e, blog.TieuDe)}
              >
                <i className="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default QlBlog;