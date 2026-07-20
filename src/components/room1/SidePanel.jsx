import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

// Panel thuyết minh hiện vật bên phải/trái màn hình (được tái sử dụng cho tất cả các phòng)
function SidePanel({ selectedObjectId, showUI, isEditMode, roomData, onClose, detailedContent, tourActive, tourIndex, tourLength, isLastRoom, onNext, onPrev, onExit, roadmapStage = 0, setRoadmapStage }) {
  const [lightboxImage, setLightboxImage] = React.useState(null);

  if (!selectedObjectId || !showUI || isEditMode || !detailedContent) return null;

  // obj_hanhtrinh: Hiển thị chỉ mini-bar tour ở giữa màn hình, mờ mặc định, rõ khi hover
  if (selectedObjectId === 'obj_hanhtrinh') {
    return (
      <React.Fragment>
        <button
          className="side-panel-close-btn ui-interactive hanhtrinh-close-btn"
          onClick={tourActive ? onExit : onClose}
          style={{ position: 'fixed', top: 20, right: 24, zIndex: 3000, opacity: 0.35, transition: 'opacity 0.35s ease' }}
          onMouseEnter={e => e.currentTarget.style.opacity = 1}
          onMouseLeave={e => e.currentTarget.style.opacity = 0.35}
        >
          <X size={18} />
        </button>
        {tourActive && (
          <div className="museum-tour-mini-bar ui-interactive hanhtrinh-tour-bar">
            <button
              className="tour-mini-btn prev"
              onClick={onPrev}
              disabled={tourIndex === 0}
              title="Hiện vật trước"
            >
              ◀ Trước
            </button>
            <span className="tour-mini-progress">{tourIndex + 1} / {tourLength}</span>
            <button
              className="tour-mini-btn next primary"
              onClick={onNext}
              title={tourIndex === tourLength - 1 && !isLastRoom ? "Sang phòng kế tiếp" : "Hoàn thành tour"}
            >
              {tourIndex === tourLength - 1 && !isLastRoom ? "Sang phòng kế ▶" : "Hoàn thành ✕"}
            </button>
            <button className="tour-mini-btn exit" onClick={onExit} title="Thoát Tour">✕</button>
          </div>
        )}
      </React.Fragment>
    );
  }

  // Nếu hiện vật nằm ở góc bên phải, ta lật Panel thuyết minh sang trái để không bị đè lên nhau
  const isRightAlignedObj = selectedObjectId === 'obj_loa' || selectedObjectId === 'obj_radio' || selectedObjectId === 'obj_diacau';

  // Lấy dữ liệu theo chặng nếu là obj_roadmap
  const roadmapData = detailedContent['obj_roadmap'];
  const currentStageData = (selectedObjectId === 'obj_roadmap' && roadmapStage > 0)
    ? roadmapData?.stages?.find(s => s.id === roadmapStage)
    : null;

  const title = currentStageData?.title || detailedContent[selectedObjectId]?.title || roomData.interactive_objects.find(o => o.id === selectedObjectId)?.content.title;
  const subtitle = currentStageData?.subtitle || detailedContent[selectedObjectId]?.subtitle || "";
  const paragraphs = currentStageData?.paragraphs || detailedContent[selectedObjectId]?.paragraphs || [];

  return (
    <React.Fragment>
      <div className={`museum-side-panel ui-interactive ${isRightAlignedObj ? 'left-aligned' : ''} ${tourActive ? 'tour-active-adjust' : ''}`}>
        <button className="side-panel-close-btn" onClick={tourActive ? onExit : onClose}>
          <X size={18} />
        </button>

        <div className="side-panel-content">
          <span className="panel-badge">
            {selectedObjectId === 'obj_roadmap' && roadmapStage > 0 ? `Lộ Trình Z-Pattern — ${roadmapStage}/4` : "Hiện Vật Trưng Bày"}
          </span>
          <h2 className="panel-title">{title}</h2>
          <h4 className="panel-subtitle">{subtitle}</h4>

          <div className="panel-divider"></div>

          <div className="panel-body">
            {paragraphs.map((p, idx) => {
              const activeDetail = detailedContent[selectedObjectId];
              let paragraphImages = [];

              if (activeDetail?.images && Array.isArray(activeDetail.images)) {
                paragraphImages = activeDetail.images.filter(img => img.paragraphIndex === idx);
              }

              if (paragraphImages.length === 0 && activeDetail?.imageUrl && selectedObjectId !== 'obj_roadmap') {
                const isTargetParagraph = selectedObjectId === 'obj_sogao'
                  ? (p.includes("Lương thực, thực phẩm") || p.includes("đôi khi phải đặt gạch"))
                  : (idx === 0);

                if (isTargetParagraph) {
                  paragraphImages = [{
                    url: activeDetail.imageUrl,
                    note: activeDetail.imageNote || null
                  }];
                }
              }

              return (
                <React.Fragment key={idx}>
                  <p className="panel-paragraph">{p}</p>
                  
                  {paragraphImages.map((imgItem, imgIdx) => (
                    <div
                      key={imgIdx}
                      className="panel-image-container"
                      style={{
                        margin: '1.2rem auto',
                        width: '100%',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.18)',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                        transition: 'transform 0.2s, border-color 0.2s',
                        background: 'rgba(12, 16, 25, 0.7)'
                      }}
                      onClick={() => setLightboxImage(imgItem)}
                      title="Click để phóng to xem chi tiết"
                    >
                      <img
                        src={imgItem.url}
                        alt={title}
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                      />
                      {imgItem.note && (
                        <div
                          className="panel-image-note"
                          style={{
                            padding: '8px 12px',
                            fontSize: '0.85rem',
                            color: '#e2e8f0',
                            fontStyle: 'italic',
                            lineHeight: '1.45',
                            textAlign: 'center',
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(0, 0, 0, 0.5)'
                          }}
                        >
                          {imgItem.note}
                        </div>
                      )}
                    </div>
                  ))}
                </React.Fragment>
              );
            })}

            {/* Nút kích hoạt / chuyển chặng Z-Pattern cho Roadmap */}
            {selectedObjectId === 'obj_roadmap' && setRoadmapStage && (
              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                {roadmapStage === 0 && (
                  <button
                    onClick={() => setRoadmapStage(1)}
                    style={{
                      background: 'linear-gradient(135deg, #00ffcc 0%, #00b386 100%)',
                      color: '#0a192f',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(0, 255, 204, 0.3)',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    ▶ Bắt đầu Chuyến tham quan Z-Pattern
                  </button>
                )}
                {roadmapStage > 0 && roadmapStage < 4 && (
                  <button
                    onClick={() => setRoadmapStage(roadmapStage + 1)}
                    style={{
                      background: 'linear-gradient(135deg, #ff7b00 0%, #ff4500 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(255, 123, 0, 0.3)',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {roadmapStage === 1 && "▶ Sang Chặng 2: Đại hội VI"}
                    {roadmapStage === 2 && "▶ Sang Chặng 3: Bứt phá Khoán 10"}
                    {roadmapStage === 3 && "▶ Sang Chặng 4: Thành tựu & Hội nhập"}
                  </button>
                )}
                {roadmapStage === 4 && (
                  <button
                    onClick={() => { setRoadmapStage(0); onClose(); }}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    🎉 Hoàn thành Chuyến tham quan
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Thanh công cụ mini-tour nằm tách biệt trực quan ở phía dưới khối nội dung */}
      {tourActive && (
        <div className={`museum-tour-mini-bar ui-interactive ${isRightAlignedObj ? 'left-aligned' : ''}`}>
          <button
            className="tour-mini-btn prev"
            onClick={onPrev}
            disabled={tourIndex === 0}
            title="Hiện vật trước"
          >
            ◀ Trước
          </button>

          <span className="tour-mini-progress">
            {tourIndex + 1} / {tourLength}
          </span>

          <button
            className="tour-mini-btn next primary"
            onClick={onNext}
            title={tourIndex === tourLength - 1 && !isLastRoom ? "Sang phòng kế tiếp" : "Hoàn thành tour"}
          >
            {tourIndex === tourLength - 1 && !isLastRoom ? "Sang phòng kế ▶" : "Hoàn thành ✕"}
          </button>

          <button
            className="tour-mini-btn exit"
            onClick={onExit}
            title="Thoát Tour"
          >
            ✕
          </button>
        </div>
      )}

      {/* Hộp Modal Lightbox phóng to ảnh có hỗ trợ Zoom & Kéo thả (Pan) */}
      {lightboxImage && (
        <LightboxModal
          lightboxImage={lightboxImage}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </React.Fragment>
  );
}

// Sub-component cho Modal Lightbox với tính năng Zoom & Pan (Kéo thả & Cuộn chuột Zoom)
function LightboxModal({ lightboxImage, onClose }) {
  const [zoomScale, setZoomScale] = React.useState(1);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStartRef = React.useRef({ x: 0, y: 0 });
  const posStartRef = React.useRef({ x: 0, y: 0 });

  const imgUrl = typeof lightboxImage === 'string' ? lightboxImage : lightboxImage?.url;
  const imgNote = typeof lightboxImage === 'object' ? lightboxImage?.note : null;

  React.useEffect(() => {
    setZoomScale(1);
    setPosition({ x: 0, y: 0 });
  }, [lightboxImage]);

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setZoomScale(prev => {
      const nextScale = Math.min(Math.max(1, prev + delta), 4);
      if (nextScale === 1) setPosition({ x: 0, y: 0 });
      return nextScale;
    });
  };

  const handleMouseDown = (e) => {
    if (zoomScale <= 1) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    posStartRef.current = { ...position };
  };

  const handleMouseMove = (e) => {
    if (!isDragging || zoomScale <= 1) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPosition({
      x: posStartRef.current.x + dx,
      y: posStartRef.current.y + dy
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = () => {
    if (zoomScale > 1) {
      setZoomScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setZoomScale(2);
    }
  };

  const zoomIn = () => setZoomScale(prev => Math.min(4, prev + 0.35));
  const zoomOut = () => setZoomScale(prev => {
    const next = Math.max(1, prev - 0.35);
    if (next === 1) setPosition({ x: 0, y: 0 });
    return next;
  });
  const resetZoom = () => {
    setZoomScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return createPortal(
    <div
      className="lightbox-overlay ui-interactive"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.94)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        animation: 'fadeIn 0.25s ease'
      }}
      onClick={onClose}
      onWheel={handleWheel}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        className="lightbox-content"
        style={{
          position: 'relative',
          maxWidth: '94vw',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Zoom & Control Toolbar */}
        <div style={{
          position: 'absolute',
          top: '-54px',
          right: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(249, 115, 22, 0.45)',
          borderRadius: '24px',
          padding: '4px 14px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
          zIndex: 10
        }}>
          <button
            onClick={zoomOut}
            disabled={zoomScale <= 1}
            style={{
              background: 'transparent',
              border: 'none',
              color: zoomScale <= 1 ? '#64748b' : '#fdba74',
              cursor: zoomScale <= 1 ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              padding: '4px 8px'
            }}
            title="Thu nhỏ (- / Cuộn chuột xuống)"
          >
            🔍-
          </button>

          <span style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 'bold', minWidth: '45px', textAlign: 'center' }}>
            {Math.round(zoomScale * 100)}%
          </span>

          <button
            onClick={zoomIn}
            disabled={zoomScale >= 4}
            style={{
              background: 'transparent',
              border: 'none',
              color: zoomScale >= 4 ? '#64748b' : '#fdba74',
              cursor: zoomScale >= 4 ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              padding: '4px 8px'
            }}
            title="Phóng to (+ / Cuộn chuột lên / Cuộn đúp)"
          >
            🔍+
          </button>

          {zoomScale > 1 && (
            <button
              onClick={resetZoom}
              style={{
                background: 'rgba(239, 68, 68, 0.25)',
                color: '#fca5a5',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '16px',
                padding: '2px 10px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                transition: 'background 0.2s'
              }}
              title="Đặt lại độ zoom 100%"
            >
              🎯 Reset
            </button>
          )}

          <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.2)', margin: '0 2px' }}></div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#f87171',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              padding: '2px 6px'
            }}
            title="Đóng ảnh (✕)"
          >
            ✕
          </button>
        </div>

        {/* Khung Ảnh hỗ trợ Zoom & Kéo thả (Pan) */}
        <div
          style={{
            overflow: 'hidden',
            borderRadius: '10px',
            border: '2px solid rgba(255,255,255,0.2)',
            boxShadow: '0 12px 45px rgba(0,0,0,0.9)',
            background: '#000000',
            cursor: zoomScale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
          }}
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
        >
          <img
            src={imgUrl}
            alt="Phóng to ảnh tư liệu"
            style={{
              width: '85vw',
              maxWidth: '2000px',
              height: 'auto',
              maxHeight: '78vh',
              objectFit: 'contain',
              display: 'block',
              transform: `scale(${zoomScale}) translate(${position.x / zoomScale}px, ${position.y / zoomScale}px)`,
              transition: isDragging ? 'none' : 'transform 0.2s ease-out'
            }}
            draggable={false}
          />
        </div>

        {imgNote && (
          <div style={{
            color: '#ffedd5',
            marginTop: '0.8rem',
            fontSize: '0.98rem',
            fontStyle: 'italic',
            textAlign: 'center',
            maxWidth: '85vw',
            lineHeight: '1.5',
            background: 'rgba(15, 23, 42, 0.9)',
            padding: '10px 20px',
            borderRadius: '8px',
            border: '1px solid rgba(249, 115, 22, 0.4)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
          }}>
            {imgNote}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

export default SidePanel;
