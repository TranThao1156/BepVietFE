import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../../assets/css/congthuc.css";

const SuaCongThuc = () => {
  const { Ma_CT } = useParams();
  const navigate = useNavigate();

  // --- STATES ---
  const [tenMon, setTenMon] = useState("");
  const [moTa, setMoTa] = useState("");
  const [thoiGianNau, setThoiGianNau] = useState(60);
  const [doKho, setDoKho] = useState("Dễ");
  const [khauPhan, setKhauPhan] = useState(2);
  const [maVM, setMaVM] = useState("");
  const [maLM, setMaLM] = useState("");
  const [maDM, setMaDM] = useState("");

  // Dữ liệu danh mục
  const [dsDanhMuc, setDsDanhMuc] = useState([]);
  const [dsLoaiMon, setDsLoaiMon] = useState([]);
  const [dsVungMien, setDsVungMien] = useState([]);

  // Ảnh bìa
  const [coverImage, setCoverImage] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  // Nguyên liệu
  const [ingredients, setIngredients] = useState([
    { id: 1, name: "", qty: "", unit: "" },
  ]);

  // Gợi ý nguyên liệu
  const [suggestedIngredients, setSuggestedIngredients] = useState([]);
  const [activeIngIndex, setActiveIngIndex] = useState(null);
  const wrapperRef = useRef(null);

  // Các bước
  const [steps, setSteps] = useState([
    { id: 1, STT: 1, content: "", image: "" },
  ]);

  // --- LOAD DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const optionsRes = await fetch("http://127.0.0.1:8000/api/tuy-chon-cong-thuc");
        const optionsData = await optionsRes.json();
        setDsDanhMuc(optionsData.danhmuc);
        setDsLoaiMon(optionsData.loaimon);
        setDsVungMien(optionsData.vungmien);

        const detailRes = await fetch(`http://127.0.0.1:8000/api/cong-thuc/${Ma_CT}`);
        const detailData = await detailRes.json();
        const data = detailData.data;

        setTenMon(data.TenMon);
        setMoTa(data.MoTa || "");
        setThoiGianNau(data.ThoiGianNau);
        setDoKho(data.DoKho);
        setKhauPhan(data.KhauPhan);
        setMaVM(data.Ma_VM);
        setMaLM(data.Ma_LM);
        setMaDM(data.Ma_DM);

        if (data.HinhAnh) {
          const imgUrl = data.HinhAnh.startsWith("http")
            ? data.HinhAnh
            : `http://127.0.0.1:8000/storage/img/CongThuc/${data.HinhAnh}`;
          setCoverImage(imgUrl);
        }

        if (data.nguyen_lieu && data.nguyen_lieu.length > 0) {
          const mappedIngredients = data.nguyen_lieu.map((ing, index) => ({
            id: index + 1,
            name: ing.TenNguyenLieu,
            unit: ing.DonViDo,
            qty: ing.pivot.DinhLuong,
          }));
          setIngredients(mappedIngredients);
        }

        if (data.buoc_thuc_hien && data.buoc_thuc_hien.length > 0) {
          const mappedSteps = data.buoc_thuc_hien.map((step) => ({
            id: step.Ma_BTH,
            STT: step.STT,
            content: step.NoiDung,
            image: step.HinhAnh || "",
          }));
          setSteps(mappedSteps);
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      }
    };

    fetchData();

    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSuggestedIngredients([]);
        setActiveIngIndex(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [Ma_CT]);

  // --- HANDLERS ---
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setCoverImage(URL.createObjectURL(file));
    }
  };

  const handleSearchIngredient = async (index, value) => {
    const d = [...ingredients];
    d[index].name = value;
    setIngredients(d);

    if (value.length > 1) {
      setActiveIngIndex(index);
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/nguyen-lieu/goi-y?q=${value}`);
        const data = await res.json();
        setSuggestedIngredients(data);
      } catch (err) {
        console.error("Lỗi tìm kiếm nguyên liệu", err);
      }
    } else {
      setSuggestedIngredients([]);
    }
  };

  const selectSuggestion = (index, item) => {
    const d = [...ingredients];
    d[index].name = item.TenNguyenLieu;
    d[index].unit = item.DonViDo;
    setIngredients(d);
    setSuggestedIngredients([]);
    setActiveIngIndex(null);
  };

  const addIngredient = () => {
    const newId = ingredients.length > 0 ? Math.max(...ingredients.map((i) => i.id)) + 1 : 1;
    setIngredients([...ingredients, { id: newId, name: "", qty: "", unit: "" }]);
  };

  const removeIngredient = (id) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((item) => item.id !== id));
    }
  };

  const addStep = () => {
    const newId = steps.length > 0 ? Math.max(...steps.map((s) => s.id)) + 1 : 1;
    const nextSTT = steps.length + 1;
    setSteps([...steps, { id: newId, STT: nextSTT, content: "", image: "" }]);
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
          const currentImages = currentStep.image ? currentStep.image.split(";") : [];

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
      formData.append(`NguyenLieu[${index}][DinhLuong]`, ing.qty);
    });

    steps.forEach((step, index) => {
      formData.append(`BuocThucHien[${index}][STT]`, step.STT);
      formData.append(`BuocThucHien[${index}][NoiDung]`, step.content);
      formData.append(`BuocThucHien[${index}][HinhAnh]`, step.image || "");
    });

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/user/cong-thuc/sua-cong-thuc/${Ma_CT}`,
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

      alert("Cập nhật công thức thành công!");
      navigate("/nguoi-dung/ql-cong-thuc");
    } catch (err) {
      console.error(err);
      alert("Lỗi: \n" + err.message);
    }
  };

  return (
    <main className="main-content">
      <div className="content-header">
        <h1>Chỉnh sửa công thức</h1>
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

        {/* SECTION 2: THÔNG TIN CHUNG  */}
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
              value={tenMon}
              onChange={(e) => setTenMon(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Mô tả</label>
            <textarea
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

            {/* List */}
            {ingredients.map((ing, index) => (
              <div className="ingredient-row" key={ing.id}>
                {/* 1. INPUT TÊN NGUYÊN LIỆU */}
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

                {/* NÚT XÓA */}
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

                    {step.image && (
                      <div className="step-images-list">
                        {step.image.split(";").map((imgName, imgIdx) => (
                          <div className="step-image-item" key={imgIdx}>
                            <img
                              src={`http://127.0.0.1:8000/storage/img/BuocThucHien/${imgName}`}
                              alt="Step"
                            />
                            <button
                              type="button"
                              className="btn-remove-step-img"
                              onClick={() => removeStepImage(index, imgName)}
                            >
                              <i className="fa-solid fa-times"></i>
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

        {/* ACTIONS */}
        <div className="form-submit-area">
          <Link
            to="/nguoi-dung/ql-cong-thuc"
            className="btn-outline-gray btn-back"
          >
            <i className="fa-solid fa-arrow-left"></i> Quay lại
          </Link>
          <button type="submit" className="btn btn-primary btn-large">
            Lưu thay đổi
          </button>
        </div>
      </form>
    </main>
  );
};

export default SuaCongThuc;