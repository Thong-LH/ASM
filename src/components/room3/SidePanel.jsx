import React from 'react';
import { X } from 'lucide-react';
import detailedContent from '../../data/detailedContent_room3';

// Panel thuyết minh hiện vật bên phải màn hình - Phòng 3
function SidePanel({ selectedObjectId, showUI, isEditMode, roomData, onClose }) {
  if (!selectedObjectId || !showUI || isEditMode) return null;

  // Nếu là quả địa cầu diacau (ở rìa phải), cho panel lệch trái để không che hiện vật
  const isLeftAligned = selectedObjectId === 'obj_diacau';

  return (
    <div className={`museum-side-panel ui-interactive ${isLeftAligned ? 'left-aligned' : ''}`}>
      <button className="side-panel-close-btn" onClick={onClose}>
        <X size={18} />
      </button>

      <div className="side-panel-content">
        <span className="panel-badge">Hiện Vật Trưng Bày</span>
        <h2 className="panel-title">
          {detailedContent[selectedObjectId]?.title ||
            roomData.interactive_objects.find(o => o.id === selectedObjectId)?.content.title}
        </h2>
        <h4 className="panel-subtitle">
          {detailedContent[selectedObjectId]?.subtitle || ""}
        </h4>

        <div className="panel-divider"></div>

        {detailedContent[selectedObjectId]?.imageUrl && (
          <div className="panel-image-container" style={{ margin: '0.8rem 0', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <img 
              src={detailedContent[selectedObjectId].imageUrl} 
              alt={detailedContent[selectedObjectId].title} 
              style={{ width: '100%', height: 'auto', display: 'block' }} 
            />
          </div>
        )}

        <div className="panel-body">
          {detailedContent[selectedObjectId]?.paragraphs.map((p, idx) => (
            <p key={idx} className="panel-paragraph">{p}</p>
          ))}
        </div>

        <button className="panel-action-btn" onClick={onClose}>
          Hoàn tất khám phá
        </button>
      </div>
    </div>
  );
}

export default SidePanel;
