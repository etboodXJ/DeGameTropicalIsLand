import React, { useState } from 'react';

const TestNav: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '20px', 
      border: '1px solid #ccc',
      pointerEvents: 'auto',
      position: 'relative',
      zIndex: 9999
    }}>
      <h3>测试导航</h3>
      <p>如果你能看到这段文字，说明组件渲染正常</p>
      
      <button 
        onClick={() => {
          alert('按钮点击成功!');
          setExpanded(!expanded);
        }}
        onMouseDown={() => console.log('鼠标按下')}
        onMouseUp={() => console.log('鼠标释放')}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          margin: '10px 0',
          pointerEvents: 'auto',
          position: 'relative',
          zIndex: 10000
        }}
      >
        测试按钮 {expanded ? '(展开)' : '(收起)'}
      </button>

      <div 
        onClick={() => {
          alert('DIV点击成功!');
          setExpanded(!expanded);
        }}
        style={{
          padding: '15px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          cursor: 'pointer',
          margin: '10px 0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>🎮 游戏专区 (点击测试)</span>
          <span>{expanded ? '▼' : '▶'}</span>
        </div>
      </div>

      {expanded && (
        <div style={{ marginLeft: '20px', padding: '10px', backgroundColor: '#e9ecef' }}>
          <div>子菜单项 1</div>
          <div>子菜单项 2</div>
        </div>
      )}
    </div>
  );
};

export default TestNav;