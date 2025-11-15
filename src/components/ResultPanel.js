function ResultPanel({ groups, colors, onReset }) {
  return (
    <div className="result-panel">
      <h2>分组完成！</h2>
      <div className="group-info">
        {groups.map((group, index) => (
          <div
            key={index}
            className="group-item"
            style={{ borderLeftColor: colors[index] }}
          >
            <strong style={{ color: colors[index] }}>组 {index + 1}:</strong>{' '}
            {group.length} 人
          </div>
        ))}
      </div>
      <button className="reset-btn" onClick={onReset}>
        重新分组
      </button>
    </div>
  );
}

export default ResultPanel;
