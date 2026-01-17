import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const TaoCongThuc = () => {
  const [tenMon, setTenMon] = useState("");
  const [moTa, setMoTa] = useState("");
  const [thoiGianNau, setThoiGianNau] = useState(60);
  const [doKho, setDoKho] = useState(1);
  const [maVM, setMaVM] = useState(1);
  const [maLM, setMaLM] = useState(1);
  const [maDM, setMaDM] = useState(1);
  const [maND] = useState(5); // test cứng

  const [ingredients, setIngredients] = useState([
    { id: Date.now(), name: "", qty: "", unit: "" },
  ]);

  const [steps, setSteps] = useState([{ id: Date.now(), content: "" }]);

  const navigate = useNavigate();

  const [coverImage, setCoverImage] = useState(null);

  // Xử lý ảnh bìa
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(URL.createObjectURL(file));
    }
  };

  // Thêm nguyên liệu mới
  const addIngredient = () => {
    const newId =
      ingredients.length > 0
        ? Math.max(...ingredients.map((i) => i.id)) + 1
        : 1;
    setIngredients([
      ...ingredients,
      { id: newId, name: "", qty: "", unit: "" },
    ]);
  };

  // Xóa nguyên liệu
  const removeIngredient = (id) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((item) => item.id !== id));
    }
  };

  // Thêm bước làm mới
  const addStep = () => {
    const newId =
      steps.length > 0 ? Math.max(...steps.map((s) => s.id)) + 1 : 1;
    setSteps([...steps, { id: newId, content: "", image: null }]);
  };

  // Xóa bước làm
  const removeStep = (id) => {
    if (steps.length > 1) {
      setSteps(steps.filter((item) => item.id !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      TenMon: tenMon,
      MoTa: moTa,
      KhauPhan: 2,
      DoKho: doKho,
      ThoiGianNau: thoiGianNau,
      HinhAnh: null,
      Ma_VM: maVM,
      Ma_LM: maLM,
      Ma_DM: maDM,
      Ma_ND: maND,
      NguyenLieu: ingredients,
      CachLam: steps,
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/cong-thuc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw data;

      alert("Tạo công thức thành công");
    } catch (err) {
      console.error(err);
      alert(err.message || "Có lỗi xảy ra");
    }
  };

  return (
    <main className="main-content">
      <div className="content-header">
        <h1>Tạo công thức mới</h1>
        <p>Chia sẻ niềm đam mê nấu nướng của bạn với cộng đồng Bếp Việt.</p>
      </div>

      <form onSubmit={handleSubmit} className="create-recipe-form">
        {/* --- SECTION 1: ẢNH BÌA --- */}
        <div className="form-section-card">
          <div className="section-title-sm">
            <i className="fa-regular fa-image"></i> ẢNH BÌA MÓN ĂN
          </div>

          <div
            className={`upload-area-large ${coverImage ? "has-image" : ""}`}
            style={
              coverImage
                ? { backgroundImage: `url(${coverImage})`, padding: "40px" }
                : {}
            }
          >
            <div className="upload-content">
              {coverImage ? (
                <>
                  <i
                    className="fa-solid fa-pen-to-square upload-icon"
                    style={{
                      color: "white",
                      textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                    }}
                  ></i>
                  <p
                    style={{
                      color: "white",
                      textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                    }}
                  >
                    <strong>Nhấn để thay đổi ảnh</strong>
                  </p>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-cloud-arrow-up upload-icon"></i>
                  <p>
                    <strong>Nhấn để tải lên</strong> hoặc kéo thả ảnh vào đây
                  </p>
                  <span className="upload-note">
                    SVG, PNG, JPG (Tối đa 800x400px)
                  </span>
                </>
              )}
            </div>
            <input
              type="file"
              className="hidden-input"
              onChange={handleCoverChange}
              accept="image/*"
            />
          </div>
        </div>

        {/* --- SECTION 2: THÔNG TIN CHUNG --- */}
        <div className="form-section-card">
          <div className="section-title-sm">
            <i className="fa-solid fa-circle-info"></i> THÔNG TIN CHUNG
          </div>

          <div className="form-group">
            <label>Tên món ăn</label>
            <input
              type="text"
              placeholder="Ví dụ: Phở bò gia truyền"
              required
              value={tenMon}
              onChange={(e) => setTenMon(e.target.value)}
            />
          </div>

          <textarea
            placeholder="Giới thiệu đôi nét về món ăn của bạn..."
            value={moTa}
            onChange={(e) => setMoTa(e.target.value)}
          ></textarea>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Thời gian nấu (phút)</label>
              <div className="input-icon-group">
                <i className="fa-regular fa-clock"></i>
                <input
                  type="number"
                  value={thoiGianNau}
                  onChange={(e) => setThoiGianNau(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Độ khó</label>
              <div className="input-icon-group">
                <i className="fa-solid fa-chart-simple"></i>
                <select
                  value={doKho}
                  onChange={(e) => setDoKho(e.target.value)}
                >
                  <option value={1}>Dễ</option>
                  <option value={2}>Trung bình</option>
                  <option value={3}>Khó</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Vùng miền</label>
              <div className="input-icon-group">
                <i className="fa-solid fa-map-location-dot"></i>
                <select>
                  <option>Chọn vùng miền</option>
                  <option>Miền Bắc</option>
                  <option>Miền Trung</option>
                  <option>Miền Nam</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* --- SECTION 3: NGUYÊN LIỆU (DYNAMIC LIST) --- */}
        <div className="form-section-card">
          <div className="section-title-sm">
            <i className="fa-solid fa-basket-shopping"></i> NGUYÊN LIỆU
          </div>

          <div className="ingredients-wrapper">
            <div className="ingredients-header">
              <span>Tên nguyên liệu</span>
              <span>Số lượng</span>
              <span>Đơn vị</span>
            </div>

            {ingredients.map((ing, index) => (
              <div className="ingredient-row" key={ing.id}>
                <input
                  className="ing-name"
                  value={ing.name}
                  onChange={(e) => {
                    const d = [...ingredients];
                    d[index].name = e.target.value;
                    setIngredients(d);
                  }}
                />

                <input
                  className="ing-qty"
                  value={ing.qty}
                  onChange={(e) => {
                    const d = [...ingredients];
                    d[index].qty = e.target.value;
                    setIngredients(d);
                  }}
                />

                <input
                  className="ing-unit"
                  value={ing.unit}
                  onChange={(e) => {
                    const d = [...ingredients];
                    d[index].unit = e.target.value;
                    setIngredients(d);
                  }}
                />

                {/* Nút xóa dòng (chỉ hiện khi có nhiều hơn 1 dòng) */}
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    className="remove-img"
                    style={{
                      marginLeft: "10px",
                      background: "none",
                      color: "#EF4444",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => removeIngredient(ing.id)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            className="btn-dashed-full"
            onClick={addIngredient}
          >
            <i className="fa-solid fa-plus"></i> Thêm nguyên liệu
          </button>
        </div>

        {/* --- SECTION 4: CÁCH LÀM (DYNAMIC LIST) --- */}
        <div className="form-section-card">
          <div className="section-title-sm">
            <i className="fa-solid fa-list-ol"></i> CÁCH LÀM
          </div>

          <div className="steps-wrapper">
            {steps.map((step, index) => (
              <div className="step-input-item" key={step.id}>
                <div className="step-num-badge">{index + 1}</div>
                <div className="step-input-content">
                  <textarea
                    placeholder={`Mô tả chi tiết bước ${index + 1}...`}
                    value={step.content}
                    onChange={(e) => {
                      const d = [...steps];
                      d[index].content = e.target.value;
                      setSteps(d);
                    }}
                  ></textarea>

                  <div className="step-media-area">
                    {/* Demo UI: Nút thêm ảnh */}
                    <div className="add-step-img">
                      <i className="fa-solid fa-camera"></i>
                      <span>Thêm ảnh</span>
                    </div>
                  </div>
                </div>

                {/* Nút xóa bước */}
                {steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(step.id)}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      border: "none",
                      background: "transparent",
                      color: "#9CA3AF",
                      cursor: "pointer",
                    }}
                    title="Xóa bước này"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>
            ))}
          </div>

          <button type="button" className="btn-dashed-full" onClick={addStep}>
            <i className="fa-solid fa-plus"></i> Thêm bước mới
          </button>
        </div>

        {/* --- ACTIONS --- */}
        <div className="form-submit-area">
          <Link
            to="/nguoi-dung/ql-cong-thuc"
            className="btn-outline-gray"
            style={{ marginRight: "auto" }}
          >
            <i className="fa-solid fa-arrow-left"></i> Quay lại
          </Link>
          <button
            type="submit"
            className="btn btn-primary btn-large"
          >
            Đăng công thức
          </button>
        </div>
      </form>
    </main>
  );
};

export default TaoCongThuc;
