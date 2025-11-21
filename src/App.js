import React, { useState } from 'react';
import './App.css';
import ControlPanel from './components/ControlPanel';
import TouchCanvas from './components/TouchCanvas';

function App() {
  const [groupCount, setGroupCount] = useState(null);
  const [totalPeople, setTotalPeople] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isGroupingScheduled, setIsGroupingScheduled] = useState(false);
  const [groupingTimerId, setGroupingTimerId] = useState(null);
  const [touchPoints, setTouchPoints] = useState([]);
  const [groups, setGroups] = useState([]);

  const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];

  const handleStart = () => {
    setIsStarted(true);
    setTouchPoints([]);
    setGroups([]);
  };

  const handleReset = () => {
    setIsStarted(false);
    setTouchPoints([]);
    setGroups([]);
    setGroupCount(null);
    setTotalPeople('');
    if (groupingTimerId) {
      clearTimeout(groupingTimerId);
      setGroupingTimerId(null);
      setIsGroupingScheduled(false);
    }
  };

  const handleTouchPointsChange = (points) => {
    setTouchPoints(points);

    // 如果触摸点数匹配目标人数，自动分组（去抖，兼容并发/顺序点击）
    const targetPeople = parseInt(totalPeople);
    if (
      targetPeople > 0 &&
      points.length === targetPeople &&
      isStarted &&
      groups.length === 0
    ) {
      if (!isGroupingScheduled) {
        setIsGroupingScheduled(true);
        const timer = setTimeout(() => {
          performGrouping(points);
          setIsGroupingScheduled(false);
          setGroupingTimerId(null);
        }, 200);
        setGroupingTimerId(timer);
      }
    }
  };

  const performGrouping = (points) => {
    if (points.length < groupCount) return;

    if (
      totalPeople &&
      parseInt(totalPeople) > 0 &&
      points.length !== parseInt(totalPeople)
    )
      return;

    // 随机打乱触摸点
    const shuffled = [...points].sort(() => Math.random() - 0.5);

    // 分组
    const newGroups = [];
    const updatedTouchPoints = [];

    for (let i = 0; i < groupCount; i++) newGroups[i] = [];

    shuffled.forEach((touch, index) => {
      const groupIndex = index % groupCount;
      const updatedTouch = {
        ...touch,
        group: groupIndex,
        color: colors[groupIndex],
      };
      newGroups[groupIndex].push(updatedTouch);
      updatedTouchPoints.push(updatedTouch);
    });

    // 更新 touchPoints 和 groups
    setTouchPoints(updatedTouchPoints);
    setGroups(newGroups);
  };

  return (
    <div className="App">
      {!isStarted && (
        <ControlPanel
          groupCount={groupCount}
          onGroupCountChange={setGroupCount}
          totalPeople={totalPeople}
          onTotalPeopleChange={setTotalPeople}
          touchCount={touchPoints.length}
          onStart={handleStart}
          canStart={
            groupCount >= 2 &&
            groupCount <= 4 &&
            totalPeople !== '' &&
            parseInt(totalPeople) > 0
          }
        />
      )}

      <TouchCanvas
        isStarted={isStarted}
        groups={groups}
        touchPoints={groups.length > 0 ? touchPoints : undefined}
        onTouchPointsChange={handleTouchPointsChange}
        colors={colors}
        totalPeople={totalPeople}
        hasGrouped={groups.length > 0}
      />

      {isStarted && groups.length > 0 && (
        <div className="bottom-bar">
          <button className="reset-btn" onClick={handleReset}>
            重新分组
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
