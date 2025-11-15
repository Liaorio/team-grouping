function ControlPanel({
  groupCount,
  onGroupCountChange,
  totalPeople,
  onTotalPeopleChange,
  touchCount,
  onStart,
  canStart,
}) {
  return (
    <div className="control-panel">
      <h1>随机分组工具</h1>

      <div className="input-group">
        <label>输入总人数</label>
        <input
          type="number"
          className="people-input"
          value={totalPeople}
          onChange={(e) => onTotalPeopleChange(e.target.value)}
          placeholder="请输入总人数"
          min="1"
        />
      </div>

      <div className="input-group">
        <label>选择分组数量：</label>
        <div className="button-group">
          {[2, 3, 4].map((num) => (
            <button
              key={num}
              className={`group-btn ${groupCount === num ? 'active' : ''}`}
              onClick={() => onGroupCountChange(num)}
            >
              {num}组
            </button>
          ))}
        </div>
      </div>

      <div className="info">
        <p>
          已选择: <span>{groupCount ? `${groupCount}组` : '未选择'}</span>
        </p>
        <p>
          目标人数: <span>{totalPeople || '未设置'}</span>
        </p>
        <p
          className={
            totalPeople && touchCount > parseInt(totalPeople) ? 'warning' : ''
          }
        >
          触摸点数: <span>{touchCount}</span>
        </p>
      </div>

      <button className="start-btn" onClick={onStart} disabled={!canStart}>
        开始触摸
      </button>
    </div>
  );
}

export default ControlPanel;
