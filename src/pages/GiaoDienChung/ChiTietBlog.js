import React from 'react';
import { Link, useParams } from 'react-router';
import BinhLuanBlog from '../NguoiDung/BinhLuanBlog'; //Trâm import BinhLuanBlog
import { useEffect, useState } from 'react';

const ChitietBlog = () => {

  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/blog/${id}`)
      .then(res => res.json())
      .then(res => {
        setBlog(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p style={{ textAlign: 'center' }}>Đang tải dữ liệu...</p>;
  if (!blog) return <p>Không tìm thấy bài viết</p>;
  

  return (
    <main className="container">
        <div className="breadcrumb" style={{ margin: '30px 0' }}>
            <Link to="/blog">Blog</Link> <i className="fa-solid fa-chevron-right"></i> <span>Chi tiết bài viết</span>
        </div>

        <div className="blog-detail-layout">
            {/* NỘI DUNG CHÍNH */}
            <article className="blog-article">
                <h1 className="article-title">{blog.TieuDe}</h1>

                <div className="article-meta">
                    <div className="author-mini">
                        <img src={`http://127.0.0.1:8000/storage/img/NguoiDung/${blog.TacGia.AnhDaiDien}`} alt={blog.TacGia.HoTen} />
                        <div>
                            <strong>{blog.TacGia.HoTen}</strong>
                            {/* Điều chỉnh Ngày đăng chỉ hiện đ/mm/yyyy */}
                            <span>Đăng ngày {(new Date(blog.NgayDang)).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="meta-stats">
                        <span><i className="fa-regular fa-comment"></i> {blog.SoBinhLuan} bình luận</span>
                    </div>
                </div>

                <div className="article-featured-img">
                    {/* <img src={`http://127.0.0.1:8000/storage/img/Blog/${blog.HinhAnh}`}  */}
                    <img src={blog.HinhAnh}
                    alt={blog.TieuDe} />
                </div>

                <div
                    className="article-content"
                    dangerouslySetInnerHTML={{ __html: blog.ND_ChiTiet }}
                />

                {/* BÌNH LUẬN */}
                <div className="comments-section" style={{ maxWidth: '100%' }}>
                    <h3>Bình luận ({blog.SoBinhLuan})</h3>

                    <div className="comment-form">
                        <textarea placeholder="Bạn nghĩ gì về bài viết này?"></textarea>
                        <button className="btn btn-primary" style={{ float: 'right' }}>
                            Gửi bình luận
                        </button>
                        <div style={{ clear: 'both' }}></div>
                    </div>

                    {/* DANH SÁCH BÌNH LUẬN */}
                    {blog.BinhLuan.length === 0 && (
                        <p style={{ marginTop: '20px', color: '#777' }}>
                            Chưa có bình luận nào
                        </p>
                    )}

                    {blog.BinhLuan.map((item) => (
                        <div
                            className="comment-item"
                            key={item.Ma_BL}
                            style={{ marginTop: '30px', display: 'flex', gap: '15px' }}
                        >
                            <img
                                src={`http://127.0.0.1:8000/storage/img/NguoiDung/${item.NguoiDung.AnhDaiDien}`}
                                alt={item.NguoiDung.HoTen}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    objectFit: 'cover'
                                }}
                            />

                            <div>
                                <div style={{ marginBottom: '5px' }}>
                                    <strong>{item.NguoiDung.HoTen}</strong>
                                </div>
                                <p style={{ color: 'var(--text-dark)' }}>{item.NoiDungBL}</p>
                                <div style={{color: 'var(--text-gray)',fontSize: '0.8rem',marginTop: '5px'}}>
                                    Trả lời • Ngày {item.NgayBL}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </article>
            {/* SIDEBAR PHẢI */}
            <aside className="sidebar-right">
                <div className="widget author-widget">
                    <div className="author-avatar-large">
                        <img src={`http://127.0.0.1:8000/storage/img/NguoiDung/${blog.TacGia.AnhDaiDien}`} alt={blog.TacGia.HoTen} />
                    </div>
                    <h3>{blog.TacGia.HoTen}</h3>
                    <p className="author-email">Email: {blog.TacGia.Email}</p>
                    <p className="author-gender">Giới tính: {blog.TacGia.GioiTinh}</p>
                    {/* <button className="btn btn-outline" style={{color: 'var(--primary-color)', borderColor: 'var(--primary-color)', width: '100%', marginTop: '15px'}}>Xem hồ sơ</button> */}
                </div>

            {/* BLOG LIÊN QUAN */}
                <div className="widget related-widget">
                    <h3>Bài viết liên quan</h3>
                    {blog.BlogLienQuan.length === 0 && (
                    <p>Không có bài viết liên quan</p>
                    )}

                    {blog.BlogLienQuan.map(item => (
                    <div className="related-item" key={item.Ma_Blog}>
                        <img
                        // src={`http://127.0.0.1:8000/storage/img/Blog/${item.HinhAnh}`}
                        src={item.HinhAnh}
                        alt={item.TieuDe}
                        />
                        <div className="related-info">
                        <Link to={`/blog/${item.Ma_Blog}`}>
                            {item.TieuDe}
                        </Link>
                        </div>
                    </div>
                    ))}
                </div>
            </aside>
        </div>
    </main>
  );
};

export default ChitietBlog;