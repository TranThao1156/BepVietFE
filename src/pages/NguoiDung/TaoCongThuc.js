import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const TaoCongThuc = () => {
  // State
  const [tenMon, setTenMon] = useState("");
  const [moTa, setMoTa] = useState("");
  const [thoiGianNau, setThoiGianNau] = useState(60);
  const [doKho, setDoKho] = useState("Dễ"); // UI hiển thị text
  const [khauPhan, setKhauPhan] = useState(2); // Thêm state khẩu phần (backend required)
  const [maVM, setMaVM] = useState(1);
  const [maLM, setMaLM] = useState(2);
  const [maDM, setMaDM] = useState(3);

  const [dsDanhMuc, setDsDanhMuc] = useState([]);
  const [dsLoaiMon, setDsLoaiMon] = useState([]);
  const [dsVungMien, setDsVungMien] = useState([]);

  const [coverImage, setCoverImage] = useState(null); // Để hiển thị xem trước
  const [coverFile, setCoverFile] = useState(null); // Để gửi lên server

  // State danh sách nguyên liệu (Dùng key nội bộ frontend cho dễ quản lý UI)
  const [ingredients, setIngredients] = useState([
    { id: 1, name: "", qty: "", unit: "" },
  ]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/tuy-chon-cong-thuc");
        const data = await res.json();

        setDsDanhMuc(data.danhmuc);
        setDsLoaiMon(data.loaimon);
        setDsVungMien(data.vungmien);

        // (Tùy chọn) Set giá trị mặc định là phần tử đầu tiên nếu danh sách có dữ liệu
        if (data.danhmuc.length > 0) setMaDM(data.danhmuc[0].Ma_DM);
        if (data.loaimon.length > 0) setMaLM(data.loaimon[0].Ma_LM);
        if (data.vungmien.length > 0) setMaVM(data.vungmien[0].Ma_VM);
      } catch (error) {
        console.error("Lỗi tải dữ liệu tùy chọn:", error);
      }
    };

    fetchOptions();
  }, []);

  // State danh sách bước (Dùng key nội bộ frontend)
  const [steps, setSteps] = useState([
    { id: 1, STT: 1, content: "", image: "" },
  ]);

  const navigate = useNavigate();
  // --- HANDLERS ---

  // Xử lý ảnh bìa (Preview)
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file); // Lưu file thực tế
      setCoverImage(URL.createObjectURL(file)); // Tạo link xem trước
    }
  };

  // Thêm nguyên liệu
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

  // Thêm bước làm
  const addStep = () => {
    const newId =
      steps.length > 0 ? Math.max(...steps.map((s) => s.id)) + 1 : 1;
    // STT tự động tăng theo số lượng phần tử
    const nextSTT = steps.length + 1;
    setSteps([...steps, { id: newId, STT: nextSTT, content: "", image: null }]);
  };

  // Xóa bước làm
  const removeStep = (id) => {
    if (steps.length > 1) {
      const newSteps = steps.filter((item) => item.id !== id);
      // Cập nhật lại STT cho tuần tự sau khi xóa
      const reorderedSteps = newSteps.map((step, index) => ({
        ...step,
        STT: index + 1,
      }));
      setSteps(reorderedSteps);
    }
  };

  // --- HÀM MỚI: Xử lý Upload NHIỀU ẢNH (AJAX) ---
  const handleStepImageUpload = async (index, e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // 1. Tạo FormData để chứa nhiều file
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images[]", files[i]); // Chú ý: images[]
    }

    try {
      const token = localStorage.getItem("access_token");

      // 2. Gọi API Upload riêng
      const res = await fetch("http://127.0.0.1:8000/api/upload-anh-buoc", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          // KHÔNG set Content-Type, để trình duyệt tự set multipart/form-data
        },
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        const newSteps = [...steps];

        // 3. Logic nối chuỗi bằng dấu chấm phẩy ;
        // Lấy chuỗi ảnh cũ, tách ra thành mảng (nếu có)
        const currentImages = newSteps[index].image
          ? newSteps[index].image.split(";")
          : [];

        // Gộp ảnh cũ + ảnh mới vừa upload xong
        const newImages = [...currentImages, ...data.images];

        // Nối lại thành chuỗi để lưu vào state
        newSteps[index].image = newImages.join(";");

        setSteps(newSteps);
      }
    } catch (err) {
      console.error("Lỗi upload ảnh bước:", err);
      alert("Lỗi upload ảnh!");
    }
  };

  // --- HÀM MỚI: Xóa ảnh nhỏ trong bước ---
  const removeStepImage = (stepIndex, imgName) => {
    const newSteps = [...steps];
    if (!newSteps[stepIndex].image) return;

    let images = newSteps[stepIndex].image.split(";");
    // Lọc bỏ ảnh muốn xóa
    images = images.filter((img) => img !== imgName);

    // Nối lại và cập nhật state
    newSteps[stepIndex].image = images.join(";");
    setSteps(newSteps);
  };

  // --- SUBMIT FORM ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Bạn chưa đăng nhập");
      return;
    }

    // Tạo đối tượng FormData
    const formData = new FormData();

    // Append các trường text
    formData.append("TenMon", tenMon);
    formData.append("MoTa", moTa || "");
    formData.append("KhauPhan", khauPhan);
    formData.append("DoKho", doKho);
    formData.append("ThoiGianNau", thoiGianNau);
    formData.append("Ma_VM", maVM);
    formData.append("Ma_LM", maLM);
    formData.append("Ma_DM", maDM);

    // Append File ảnh (quan trọng nhất)
    if (coverFile) {
      formData.append("HinhAnh", coverFile);
    }

    // Xử lý mảng Nguyên Liệu cho Laravel (dạng NguyenLieu[0][TenNguyenLieu])
    ingredients.forEach((ing, index) => {
      formData.append(`NguyenLieu[${index}][TenNguyenLieu]`, ing.name);
      formData.append(`NguyenLieu[${index}][DonViDo]`, ing.unit);
      formData.append(`NguyenLieu[${index}][DinhLuong]`, ing.qty || 0.1);
    });

    // Xử lý mảng Bước Thực Hiện
    steps.forEach((step, index) => {
      formData.append(`BuocThucHien[${index}][STT]`, step.STT);
      formData.append(`BuocThucHien[${index}][NoiDung]`, step.content);
      formData.append(`BuocThucHien[${index}][HinhAnh]`, step.image || "");
    });

    try {
      // Gọi API
      const res = await fetch("http://127.0.0.1:8000/api/user/cong-thuc/them-cong-thuc", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        // Xử lý lỗi validation từ Laravel trả về (thường là errors object)
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join("\n");
          throw new Error(errorMessages);
        }
        throw new Error(data.message || "Có lỗi xảy ra");
      }

      alert("Tạo công thức thành công!");
      navigate("/nguoi-dung/ql-cong-thuc"); // Điều hướng sau khi thành công
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

        {/* --- SECTION 2: THÔNG TIN CHUNG --- */}
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
                  placeholder="VD: Thịt bò"
                  value={ing.name}
                  required
                  onChange={(e) => {
                    const d = [...ingredients];
                    d[index].name = e.target.value;
                    setIngredients(d);
                  }}
                />

                <input
                  className="ing-qty"
                  type="number"
                  step="0.1"
                  placeholder="VD: 500"
                  value={ing.qty}
                  required
                  onChange={(e) => {
                    const d = [...ingredients];
                    d[index].qty = e.target.value;
                    setIngredients(d);
                  }}
                />

                <input
                  className="ing-unit"
                  placeholder="VD: gram"
                  value={ing.unit}
                  required
                  onChange={(e) => {
                    const d = [...ingredients];
                    d[index].unit = e.target.value;
                    setIngredients(d);
                  }}
                />

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

                  {/* KHU VỰC HIỂN THỊ VÀ UPLOAD ẢNH */}
                  <div className="step-media-area">
                    <div className="add-step-img">
                      <label
                        style={{
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <i className="fa-solid fa-camera"></i>
                        <span>Thêm ảnh</span>
                        <input
                          type="file"
                          hidden
                          multiple // QUAN TRỌNG: Cho phép chọn nhiều ảnh
                          accept="image/*"
                          onChange={(e) => handleStepImageUpload(index, e)}
                        />
                      </label>
                    </div>

                    {/* Hiển thị danh sách ảnh đã upload */}
                    {step.image && (
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          marginTop: "10px",
                          flexWrap: "wrap",
                        }}
                      >
                        {step.image.split(";").map((imgName, imgIdx) => (
                          <div
                            key={imgIdx}
                            style={{
                              position: "relative",
                              width: "80px",
                              height: "80px",
                            }}
                          >
                            <img
                              // Lưu ý: Đảm bảo đường dẫn storage đúng với config của bạn
                              src={`http://127.0.0.1:8000/storage/img/BuocThucHien/${imgName}`}
                              alt="Step"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "4px",
                                border: "1px solid #ddd",
                              }}
                            />
                            {/* Nút xóa ảnh nhỏ */}
                            <button
                              type="button"
                              onClick={() => removeStepImage(index, imgName)}
                              style={{
                                position: "absolute",
                                top: -5,
                                right: -5,
                                background: "#EF4444",
                                color: "white",
                                borderRadius: "50%",
                                width: "20px",
                                height: "20px",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "10px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
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

          >
            <i className="fa-solid fa-arrow-left"></i> Quay lại
          </Link>
          <button type="submit" className="btn btn-primary btn-large" >
            Đăng công thức
          </button>
        </div>
      </form>
    </main>
  );
};

export default TaoCongThuc;
