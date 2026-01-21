import React from 'react';
import { Link } from 'react-router-dom';
import { useParams,useNavigate} from "react-router-dom";
import { useEffect, useState, useRef} from 'react';

const SuaBlog = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    TieuDe: "",
    ND_ChiTiet: "",
    HinhAnh: null,
    preview: null,
  });
  // Lấy dữ liệu blog để hiển thị trong form
    useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const res = await fetch(
          `http://127.0.0.1:8000/api/user/lay-blog-can-sua/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const result = await res.json();

        if (!res.ok) {
          alert(result.message);
          navigate("/nguoi-dung/ql-blog");
          return;
        }

        setForm({
          TieuDe: result.data.TieuDe,
          ND_ChiTiet: result.data.ND_ChiTiet,
          HinhAnh: null,
          preview: result.data.HinhAnh,
        });
      } catch (err) {
        alert("Không thể tải blog");
        navigate("/nguoi-dung/ql-blog");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id, navigate]);

  // Hàm xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.TieuDe || !form.ND_ChiTiet) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    const token = localStorage.getItem("access_token");
    const formData = new FormData();

    formData.append("TieuDe", form.TieuDe);
    formData.append("ND_ChiTiet", form.ND_ChiTiet);
    if (form.HinhAnh) {
      formData.append("HinhAnh", form.HinhAnh);
    }

    const res = await fetch(
      `http://127.0.0.1:8000/api/user/cap-nhat-blog/${id} `,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      }
    );

    const result = await res.json();

    if (!res.ok) {
      alert(result.message || "Cập nhật thất bại");
      return;
    }

    alert("Cập nhật blog thành công");
    navigate("/nguoi-dung/ql-blog");
  };
  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <main className="main-content">
      
      <div className="page-header-flex">
        <div>
          <h2>Chỉnh sửa bài viết</h2>
          <p>Cập nhật nội dung chia sẻ của bạn.</p>
        </div>
        <Link to="/nguoi-dung/ql-blog" className="btn-outline-gray">
          <i className="fa-solid fa-arrow-left"></i> Quay lại
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="create-blog-container">
        
        <div className="form-group">
          <label>Tiêu đề bài viết</label>
          <input 
            type="text" 
            className="input-lg"  
            value={form.TieuDe}
            onChange={(e)=> setForm({ ...form, TieuDe: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Ảnh bìa bài viết</label>
          <div
            className="upload-area-large has-image"
            style={{
              backgroundImage: form.preview
                ? `url(${form.preview})`
                : "none",
            }}
            onClick={() => fileInputRef.current.click()}
          >
            <div className="upload-content">
              <i className="fa-solid fa-pen-to-square upload-icon"></i>
              <p><strong>Nhấn để thay đổi ảnh</strong></p>
            </div>
            <input
              type="file"
              className="hidden-input"
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                if (form.preview && form.preview.startsWith("blob:")) {
                  URL.revokeObjectURL(form.preview);
                }

                setForm({
                  ...form,
                  HinhAnh: file,
                  preview: URL.createObjectURL(file),
                });
              }}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Nội dung chi tiết</label>
          <div className="editor-wrapper">
            <div className="editor-toolbar">
              <button type="button" className="editor-btn"><i className="fa-solid fa-bold"></i></button>
              <button type="button" className="editor-btn"><i className="fa-solid fa-italic"></i></button>
              <button type="button" className="editor-btn"><i className="fa-solid fa-underline"></i></button>
              <div className="editor-separator"></div>
              <button type="button" className="editor-btn">H2</button>
              <button type="button" className="editor-btn">H3</button>
              <div className="editor-separator"></div>
              <button type="button" className="editor-btn"><i className="fa-solid fa-list-ul"></i></button>
              <button type="button" className="editor-btn"><i className="fa-regular fa-image"></i></button>
              <button type="button" className="editor-btn"><i className="fa-solid fa-link"></i></button>
            </div>
            <textarea
            className="editor-textarea"
            value={form.ND_ChiTiet}
            onChange={(e) =>
              setForm({ ...form, ND_ChiTiet: e.target.value })
            }
          ></textarea>
          </div>
        </div>

        <div className="form-submit-group">
          <button 
            type="submit" 
            className="btn" 
            style={{ 
              background: 'var(--primary-color)', 
              color: 'white', 
              padding: '12px 30px', 
              borderRadius: '8px', 
              border: 'none', 
              fontWeight: 600, 
              fontSize: '1rem', 
              cursor: 'pointer' 
            }}
          >
            <i className="fa-solid fa-floppy-disk"></i> Lưu thay đổi
          </button>
        </div>

      </form>

    </main>
  );
};

export default SuaBlog;