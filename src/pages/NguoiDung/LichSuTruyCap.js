import React from 'react';

const LichSuTruyCap = () => {
  return (
    <main className="main-content">
      <div className="content-header">
        <h1>Lịch sử công thức</h1>
        <p>Xem lại các món ăn bạn đã truy cập gần đây.</p>
      </div>

      <div className="manage-card">
        <div className="manage-card-header">
          <h3>Danh sách món ăn</h3>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '150px' }}>Ảnh</th>
                <th>Tên món</th>
              </tr>
            </thead>
            <tbody>
              {/* Item 1 */}
              <tr>
                <td>
                  <img 
                    src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=150&q=80" 
                    alt="Phở Bò" 
                    className="table-thumb" 
                  />
                </td>
                <td>
                  <div className="table-title">Phở Bò Nam Định</div>
                  <div className="table-subtitle">Món nước • Miền Bắc</div>
                </td>
              </tr>

              {/* Item 2 */}
              <tr>
                <td>
                  <img 
                    src="https://images.unsplash.com/photo-1564436872-f6d81182789b?auto=format&fit=crop&w=150&q=80" 
                    alt="Nem Rán" 
                    className="table-thumb" 
                  />
                </td>
                <td>
                  <div className="table-title">Nem Rán Giòn</div>
                  <div className="table-subtitle">Món khai vị • Toàn quốc</div>
                </td>
              </tr>

              {/* Item 3 */}
              <tr>
                <td>
                  <img 
                    src="https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?auto=format&fit=crop&w=150&q=80" 
                    alt="Cá lóc" 
                    className="table-thumb" 
                  />
                </td>
                <td>
                  <div className="table-title">Cá lóc nướng trui</div>
                  <div className="table-subtitle">Món chính • Miền Tây</div>
                </td>
              </tr>

              {/* Item 4 */}
              <tr>
                <td>
                  <img 
                    src="https://images.unsplash.com/photo-1503764654157-72d979d9af2f?auto=format&fit=crop&w=150&q=80" 
                    alt="Bún Bò" 
                    className="table-thumb" 
                  />
                </td>
                <td>
                  <div className="table-title">Bún Bò Huế</div>
                  <div className="table-subtitle">Món nước • Miền Trung</div>
                </td>
              </tr>

              {/* Item 5 */}
              <tr>
                <td>
                  <img 
                    src="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=150&q=80" 
                    alt="Gỏi cuốn" 
                    className="table-thumb" 
                  />
                </td>
                <td>
                  <div className="table-title">Gỏi Cuốn Tôm Thịt</div>
                  <div className="table-subtitle">Món khai vị • Miền Nam</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="manage-card-footer">
          <div className="pagination-info">
            Hiển thị 1-5 trong số 12 món ăn
          </div>
          <div className="table-pagination">
            <button className="p-btn disabled">
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button className="p-btn active">1</button>
            <button className="p-btn">2</button>
            <button className="p-btn">
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LichSuTruyCap;