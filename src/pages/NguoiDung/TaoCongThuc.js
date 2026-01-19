import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/css/congthuc.css";

const TaoCongThuc = () => {
  // State
  const [tenMon, setTenMon] = useState("");
  const [moTa, setMoTa] = useState("");
  const [thoiGianNau, setThoiGianNau] = useState(60);
  const [doKho, setDoKho] = useState("Dễ");
  const [khauPhan, setKhauPhan] = useState(2);
  const [maVM, setMaVM] = useState(1);
  const [maLM, setMaLM] = useState(2);
  const [maDM, setMaDM] = useState(3);

  const [dsDanhMuc, setDsDanhMuc] = useState([]);
  const [dsLoaiMon, setDsLoaiMon] = useState([]);
  const [dsVungMien, setDsVungMien] = useState([]);

  const [coverImage, setCoverImage] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  // State danh sách nguyên liệu
  const [ingredients, setIngredients] = useState([
    { id: 1, name: "", qty: "", unit: "" },
  ]);

  // STATE MỚI CHO GỢI Ý NGUYÊN LIỆU 
  const [suggestedIngredients, setSuggestedIngredients] = useState([]);
  const [activeIngIndex, setActiveIngIndex] = useState(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/tuy-chon-cong-thuc");
        const data = await res.json();
        setDsDanhMuc(data.danhmuc);
        setDsLoaiMon(data.loaimon);
        setDsVungMien(data.vungmien);

        if (data.danhmuc.length > 0) setMaDM(data.danhmuc[0].Ma_DM);
        if (data.loaimon.length > 0) setMaLM(data.loaimon[0].Ma_LM);
        if (data.vungmien.length > 0) setMaVM(data.vungmien[0].Ma_VM);
      } catch (error) {
        console.error("Lỗi tải dữ liệu tùy chọn:", error);
      }
    };
    fetchOptions();

    // Sự kiện click ra ngoài để đóng gợi ý
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSuggestedIngredients([]);
        setActiveIngIndex(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [steps, setSteps] = useState([
    { id: 1, STT: 1, content: "", image: "" },
  ]);

  const navigate = useNavigate();

  // --- HANDLERS ---

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setCoverImage(URL.createObjectURL(file));
    }
  };

  // HÀM MỚI: Xử lý tìm kiếm nguyên liệu
  const handleSearchIngredient = async (index, value) => {
    const d = [...ingredients];
    d[index].name = value;
    setIngredients(d);

    if (value.length > 1) {
      setActiveIngIndex(index);
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/nguyen-lieu/goi-y?q=${value}`
        );
        const data = await res.json();
        setSuggestedIngredients(data);
      } catch (err) {
        console.error("Lỗi tìm kiếm nguyên liệu", err);
      }
    } else {
      setSuggestedIngredients([]);
    }
  };

  // Chọn nguyên liệu từ gợi ý 
  const selectSuggestion = (index, item) => {
    const d = [...ingredients];
    d[index].name = item.TenNguyenLieu;
    d[index].unit = item.DonViDo;
    setIngredients(d);
    setSuggestedIngredients([]);
    setActiveIngIndex(null);
  };

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

  const removeIngredient = (id) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((item) => item.id !== id));
    }
  };

  const addStep = () => {
    const newId =
      steps.length > 0 ? Math.max(...steps.map((s) => s.id)) + 1 : 1;
    const nextSTT = steps.length + 1;
    setSteps([
      ...steps,
      { id: newId, STT: nextSTT, content: "", image: "" }, // Sửa null thành chuỗi rỗng để thống nhất
    ]);
  };

  const removeStep = (id) => {
    if (steps.length > 1) {
      const newSteps = steps.filter((item) => item.id !== id);
      const reorderedSteps = newSteps.map((step, index) => ({
        ...step,
        STT: index + 1,
      }));
      setSteps(reorderedSteps);
    }
  };

  const handleStepImageUpload = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("http://127.0.0.1:8000/api/upload-anh-buoc", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setSteps((prevSteps) => {
          const newSteps = [...prevSteps];
          const currentStep = { ...newSteps[index] };
          const currentImages = currentStep.image
            ? currentStep.image.split(";")
            : [];

          if (!currentImages.includes(data.image)) {
            currentImages.push(data.image);
          }
          currentStep.image = currentImages.join(";");
          newSteps[index] = currentStep;
          return newSteps;
        });
        e.target.value = null;
      } else {
        console.error("Lỗi từ server:", data.message);
      }
    } catch (err) {
      console.error("Lỗi upload ảnh bước:", err);
      alert("Lỗi upload ảnh!");
    }
  };

  const removeStepImage = (stepIndex, imgName) => {
    const newSteps = [...steps];
    if (!newSteps[stepIndex].image) return;
    let images = newSteps[stepIndex].image.split(";");
    images = images.filter((img) => img !== imgName);
    newSteps[stepIndex].image = images.join(";");
    setSteps(newSteps);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Bạn chưa đăng nhập");
      return;
    }

    const formData = new FormData();
    formData.append("TenMon", tenMon);
    formData.append("MoTa", moTa || "");
    formData.append("KhauPhan", khauPhan);
    formData.append("DoKho", doKho);
    formData.append("ThoiGianNau", thoiGianNau);
    formData.append("Ma_VM", maVM);
    formData.append("Ma_LM", maLM);
    formData.append("Ma_DM", maDM);

    if (coverFile) {
      formData.append("HinhAnh", coverFile);
    }

    ingredients.forEach((ing, index) => {
      formData.append(`NguyenLieu[${index}][TenNguyenLieu]`, ing.name);
      formData.append(`NguyenLieu[${index}][DonViDo]`, ing.unit);
      formData.append(`NguyenLieu[${index}][DinhLuong]`, ing.qty || 0.1);
    });

    steps.forEach((step, index) => {
      formData.append(`BuocThucHien[${index}][STT]`, step.STT);
      formData.append(`BuocThucHien[${index}][NoiDung]`, step.content);
      formData.append(`BuocThucHien[${index}][HinhAnh]`, step.image || "");
    });

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/user/cong-thuc/them-cong-thuc",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join("\n");
          throw new Error(errorMessages);
        }
        throw new Error(data.message || "Có lỗi xảy ra");
      }

      alert("Đăng công thức thành công! Hãy chờ duyệt để được đăng công khai");
      navigate("/nguoi-dung/ql-cong-thuc");
    } catch (err) {
      console.error(err);
      alert("Lỗi: \n" + err.message);
    }
  };

  return (
    <main className="main-content">
      <div className="content-header">
        <h1>Tạo công thức mới</h1>
        <p>Chia sẻ niềm đam mê nấu nướng của bạn với cộng đồng Bếp Việt.</p>
      </div>

      <form onSubmit={handleSubmit} className="create-recipe-form">
        {/* SECTION 1: ẢNH BÌA */}
        <label className="form-section-card">
          <div className="section-title-sm">
            <i className="fa-regular fa-image"></i> ẢNH BÌA MÓN ĂN
          </div>
          <div
            className={`upload-area-large ${coverImage ? "has-image" : ""}`}
            style={coverImage ? { backgroundImage: `url(${coverImage})` } : {}}
          >
            <div className="upload-content">
              {coverImage ? (
                <div className="cover-content-active">
                  <i className="fa-solid fa-pen-to-square upload-icon"></i>
                  <p>
                    <strong>Nhấn để thay đổi ảnh</strong>
                  </p>
                </div>
              ) : (
                <>
                  <i className="fa-solid fa-cloud-arrow-up upload-icon"></i>
                  <p>
                    <strong>Nhấn để tải lên</strong> hoặc kéo thả ảnh vào đây
                  </p>
                  <span className="upload-note">JPG, PNG (Tối đa 5MB)</span>
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
        </label>

        {/* SECTION 2: THÔNG TIN CHUNG */}
        <div className="form-section-card">
          <div className="section-title-sm">
            <i className="fa-solid fa-circle-info"></i> THÔNG TIN CHUNG
          </div>
          <div className="form-group">
            <label>
              Tên món ăn <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Phở bò gia truyền"
              required
              value={tenMon}
              onChange={(e) => setTenMon(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              placeholder="Giới thiệu đôi nét về món ăn của bạn..."
              value={moTa}
              onChange={(e) => setMoTa(e.target.value)}
            ></textarea>
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label>
                Thời gian nấu (phút) <span className="text-danger">*</span>
              </label>
              <div className="input-icon-group">
                <i className="fa-regular fa-clock"></i>
                <input
                  type="number"
                  min="1"
                  value={thoiGianNau}
                  onChange={(e) => setThoiGianNau(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label>
                Khẩu phần (người) <span className="text-danger">*</span>
              </label>
              <div className="input-icon-group">
                <i className="fa-solid fa-user-group"></i>
                <input
                  type="number"
                  min="1"
                  value={khauPhan}
                  onChange={(e) => setKhauPhan(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label>Độ khó</label>
              <div className="input-icon-group">
                <i className="fa-solid fa-chart-simple"></i>
                <select
                  value={doKho}
                  onChange={(e) => setDoKho(e.target.value)}
                >
                  <option value={"Dễ"}>Dễ</option>
                  <option value={"Trung bình"}>Trung bình</option>
                  <option value={"Khó"}>Khó</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Vùng miền</label>
              <div className="input-icon-group">
                <i className="fa-solid fa-map-location-dot"></i>
                <select
                  value={maVM}
                  onChange={(e) => setMaVM(e.target.value)}
                  required
                >
                  <option value="">-- Chọn vùng miền --</option>
                  {dsVungMien.map((vm) => (
                    <option key={vm.Ma_VM} value={vm.Ma_VM}>
                      {vm.TenVungMien}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label>Loại món</label>
              <div className="input-icon-group">
                <i className="fa-solid fa-utensils"></i>
                <select
                  value={maLM}
                  onChange={(e) => setMaLM(e.target.value)}
                  required
                >
                  <option value="">-- Chọn loại món --</option>
                  {dsLoaiMon.map((lm) => (
                    <option key={lm.Ma_LM} value={lm.Ma_LM}>
                      {lm.TenLoaiMon}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Danh mục</label>
              <div className="input-icon-group">
                <i className="fa-solid fa-list"></i>
                <select
                  value={maDM}
                  onChange={(e) => setMaDM(e.target.value)}
                  required
                >
                  <option value="">-- Chọn danh mục --</option>
                  {dsDanhMuc.map((dm) => (
                    <option key={dm.Ma_DM} value={dm.Ma_DM}>
                      {dm.TenDM}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: NGUYÊN LIỆU */}
        <div className="form-section-card" ref={wrapperRef}>
          <div className="section-title-sm">
            <i className="fa-solid fa-basket-shopping"></i> NGUYÊN LIỆU
          </div>

          <div className="ingredients-wrapper">
            {/* Header */}
            <div className="ingredients-header">
              <span className="col-name">Tên nguyên liệu</span>
              <span className="col-qty">Số lượng</span>
              <span className="col-unit">Đơn vị</span>
              <span className="col-action"></span>
            </div>

            {ingredients.map((ing, index) => (
              <div className="ingredient-row" key={ing.id}>
                {/* 1. TÊN NGUYÊN LIỆU */}
                <div className="ing-name-wrapper">
                  <input
                    className="ing-name"
                    placeholder="VD: Thịt bò"
                    value={ing.name}
                    required
                    onChange={(e) =>
                      handleSearchIngredient(index, e.target.value)
                    }
                  />

                  {/* Dropdown Gợi ý */}
                  {activeIngIndex === index &&
                    suggestedIngredients.length > 0 && (
                      <ul className="suggestions-list">
                        {suggestedIngredients.map((item, idx) => (
                          <li
                            key={idx}
                            onClick={() => selectSuggestion(index, item)}
                          >
                            <span>{item.TenNguyenLieu}</span>
                            <small>{item.DonViDo}</small>
                          </li>
                        ))}
                      </ul>
                    )}
                </div>

                {/* 2. SỐ LƯỢNG */}
                <input
                  className="ing-qty"
                  type="number"
                  step="0.1"
                  placeholder="SL"
                  value={ing.qty}
                  required
                  onChange={(e) => {
                    const d = [...ingredients];
                    d[index].qty = e.target.value;
                    setIngredients(d);
                  }}
                />

                {/* 3. ĐƠN VỊ */}
                <input
                  className="ing-unit"
                  placeholder="Đơn vị"
                  value={ing.unit}
                  required
                  onChange={(e) => {
                    const d = [...ingredients];
                    d[index].unit = e.target.value;
                    setIngredients(d);
                  }}
                />

                {/* Nút Xóa */}
                <div className="remove-btn-wrapper">
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      className="remove-img"
                      onClick={() => removeIngredient(ing.id)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  )}
                </div>
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

        {/* SECTION 4: CÁCH LÀM */}
        <div className="form-section-card">
          <div className="section-title-sm">
            <i className="fa-solid fa-list-ol"></i> CÁCH LÀM
          </div>

          <div className="steps-wrapper">
            {steps.map((step, index) => (
              <div className="step-input-item" key={step.id}>
                <div className="step-num-badge">{step.STT}</div>
                <div className="step-input-content">
                  <textarea
                    placeholder={`Mô tả chi tiết bước ${step.STT}...`}
                    required
                    value={step.content}
                    onChange={(e) => {
                      const d = [...steps];
                      d[index].content = e.target.value;
                      setSteps(d);
                    }}
                  ></textarea>

                  <div className="step-media-area">
                    <div className="add-step-img">
                      <label className="label-add-step-img">
                        <i className="fa-solid fa-camera"></i>
                        <span>Thêm ảnh</span>
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => handleStepImageUpload(index, e)}
                        />
                      </label>
                    </div>

                    {/* Danh sách ảnh đã upload */}
                    {step.image && (
                      <div className="step-images-list">
                        {step.image.split(";").map((imgName, imgIdx) => (
                          <div key={imgIdx} className="step-image-item">
                            <img
                              src={`http://127.0.0.1:8000/storage/img/BuocThucHien/${imgName}`}
                              alt={`Bước ${step.STT} - Ảnh ${imgIdx + 1}`}
                            />
                            <button
                              type="button"
                              className="btn-remove-step-img"
                              onClick={() => removeStepImage(index, imgName)}
                              title="Xóa ảnh này"
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {steps.length > 1 && (
                  <button
                    type="button"
                    className="btn-remove-step"
                    onClick={() => removeStep(step.id)}
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

        <div className="form-submit-area">
          <Link
            to="/nguoi-dung/ql-cong-thuc"
            className="btn-outline-gray btn-back"
          >
            <i className="fa-solid fa-arrow-left"></i> Quay lại
          </Link>
          <button type="submit" className="btn btn-primary btn-large">
            Đăng công thức
          </button>
        </div>
      </form>
    </main>
  );
};

export default TaoCongThuc;