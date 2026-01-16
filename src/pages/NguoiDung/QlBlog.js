import React from 'react';
import { Link } from 'react-router-dom';

const QlBlog = () => {
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

        {/* Blog Card 1 */}
        <div className="blog-manage-card">
          <div className="blog-card-thumb">
            <Link to="/nguoi-dung/ql-blog/chi-tiet-blog/1">
              <img 
                src="https://images.unsplash.com/photo-1626082927389-d3164294050d?q=80&w=1000&auto=format&fit=crop" 
                alt="Thịt bò" 
              />
            </Link>
            <span className="status-label label-success">Đã đăng</span>
          </div>
          <div className="blog-card-body">
            <div className="blog-meta-date"><i className="fa-regular fa-clock"></i> 12/11/2023</div>
            <h3 className="blog-card-title">5 Mẹo chọn thịt bò tươi ngon cho món Phở</h3>
            <p className="blog-card-desc">Để nấu được nồi phở ngon, việc chọn thịt bò là quan trọng nhất. Hãy cùng tìm hiểu cách chọn...</p>
            <div className="blog-card-footer">
              <span><i className="fa-regular fa-eye"></i> 1.2k lượt xem</span>
              <span><i className="fa-regular fa-comment"></i> 45 bình luận</span>
            </div>
          </div>
          <div className="blog-actions">
            <Link to="/nguoi-dung/ql-blog/sua-blog" className="btn-icon btn-edit" title="Sửa">
              <i className="fa-regular fa-pen-to-square"></i>
            </Link>
            <button 
              className="btn-icon btn-delete" 
              title="Xóa" 
              onClick={(e) => handleDelete(e, '5 Mẹo chọn thịt bò')}
            >
              <i className="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </div>

        {/* Blog Card 2 */}
        <div className="blog-manage-card">
          <div className="blog-card-thumb">
            <Link to="/nguoi-dung/ql-blog/chi-tiet-blog/2">
              <img 
                src="https://images.unsplash.com/photo-1555243896-c709bfa0b564?q=80&w=1000&auto=format&fit=crop" 
                alt="Nhà hàng chay" 
              />
            </Link>
            <span className="status-label label-warning">Chờ duyệt</span>
          </div>
          <div className="blog-card-body">
            <div className="blog-meta-date"><i className="fa-regular fa-clock"></i> Hôm qua</div>
            <h3 className="blog-card-title">Review nhà hàng chay nổi tiếng tại Quận 1</h3>
            <p className="blog-card-desc">Trải nghiệm không gian và ẩm thực tại Bếp Chay Xanh, một điểm đến không thể bỏ qua...</p>
            <div className="blog-card-footer">
              <span><i className="fa-regular fa-eye"></i> 0 lượt xem</span>
              <span><i className="fa-regular fa-comment"></i> 0 bình luận</span>
            </div>
          </div>
          <div className="blog-actions">
            <Link to="/nguoi-dung/ql-blog/sua-blog" className="btn-icon btn-edit" title="Sửa">
              <i className="fa-regular fa-pen-to-square"></i>
            </Link>
            <button 
              className="btn-icon btn-delete" 
              title="Xóa" 
              onClick={(e) => handleDelete(e, 'Review nhà hàng chay')}
            >
              <i className="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </div>

        {/* Blog Card 3 */}
        <div className="blog-manage-card">
          <div className="blog-card-thumb">
            <Link to="/nguoi-dung/ql-blog/sua-blog">
              <img 
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop" 
                alt="Rau củ" 
              />
            </Link>
            <span className="status-label label-warning">Chờ duyệt</span>
          </div>
          <div className="blog-card-body">
            <div className="blog-meta-date"><i className="fa-regular fa-clock"></i> Vừa xong</div>
            <h3 className="blog-card-title">Cách bảo quản rau củ trong tủ lạnh được lâu</h3>
            <p className="blog-card-desc">Tổng hợp các phương pháp bảo quản rau củ quả tươi lâu mà không mất chất dinh dưỡng...</p>
            <div className="blog-card-footer">
              <span><i className="fa-regular fa-eye"></i> 0 lượt xem</span>
              <span><i className="fa-regular fa-comment"></i> 0 bình luận</span>
            </div>
          </div>

          <div className="blog-actions">
            <Link to="/nguoi-dung/ql-blog/sua-blog" className="btn-icon btn-edit" title="Sửa">
              <i className="fa-regular fa-pen-to-square"></i>
            </Link>
            <button 
              className="btn-icon btn-delete" 
              title="Xóa" 
              onClick={(e) => handleDelete(e, 'Cách bảo quản rau củ')}
            >
              <i className="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </div>

      </div>

    </main>
  );
};

export default QlBlog;