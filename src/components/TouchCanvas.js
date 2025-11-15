import { useRef, useEffect, useState } from 'react';

function TouchCanvas({
  isStarted,
  groups,
  touchPoints,
  onTouchPointsChange,
  totalPeople,
  hasGrouped,
}) {
  const canvasRef = useRef(null);
  const [localTouchPoints, setLocalTouchPoints] = useState([]);
  const [showInstruction, setShowInstruction] = useState(false);

  useEffect(() => {
    if (!isStarted) return;

    // 显示提示信息
    setShowInstruction(true);
    const timer = setTimeout(() => {
      setShowInstruction(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [isStarted]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!isStarted) return;

      // 决定使用哪个触摸点数据
      // 如果已分组且传入了touchPoints，使用传入的数据；否则使用本地状态
      const pointsToDraw =
        groups.length > 0 && touchPoints ? touchPoints : localTouchPoints;

      // 如果没有分组，显示所有触摸点
      if (groups.length === 0) {
        pointsToDraw.forEach((touch) => {
          drawTouchPoint(touch.x, touch.y, '#888');
        });
      } else {
        // 已分组状态：先绘制连线，再绘制触摸点

        // 绘制连线 - 连接同一组内的所有点，按顺序连接
        groups.forEach((group) => {
          if (group.length > 1) {
            for (let i = 0; i < group.length - 1; i++) {
              const touch = group[i];
              const nextTouch = group[i + 1];
              // 只在两个点都有坐标时绘制
              if (touch.x && touch.y && nextTouch.x && nextTouch.y) {
                drawLine(
                  touch.x,
                  touch.y,
                  nextTouch.x,
                  nextTouch.y,
                  touch.color,
                );
              }
            }
          }
        });

        // 绘制触摸点 - 只在有坐标时绘制
        pointsToDraw.forEach((touch) => {
          if (touch.x && touch.y)
            drawTouchPoint(touch.x, touch.y, touch.color || '#888');
        });
      }
    };

    const drawLine = (x1, y1, x2, y2, color) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const drawTouchPoint = (x, y, color) => {
      // 先绘制外圈
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(x, y, 35, 0, Math.PI * 2);
      ctx.stroke();

      // 再绘制填充圆
      ctx.fillStyle = color;
      ctx.shadowBlur = 20;
      ctx.shadowColor = color;
      ctx.beginPath();
      ctx.arc(x, y, 35, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 绘制内圈
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.stroke();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 确保每次依赖变化时都重绘
    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isStarted, touchPoints, localTouchPoints, groups]);

  useEffect(() => {
    if (isStarted && !touchPoints) {
      // 如果没有传入 touchPoints，使用本地状态
      onTouchPointsChange(localTouchPoints);
    }
  }, [localTouchPoints, onTouchPointsChange, isStarted, touchPoints]);

  useEffect(() => {
    if (!isStarted) {
      setLocalTouchPoints([]);
      return;
    }

    const handleTouchStart = (e) => {
      // 阻止默认行为，避免长按全选
      e.preventDefault();
      e.stopPropagation();

      const newTouches = Array.from(e.touches).map((touch) => ({
        id: touch.identifier,
        x: touch.clientX,
        y: touch.clientY,
        color: null,
        group: null,
      }));

      setLocalTouchPoints((prev) => {
        // 去重：只添加新的触摸点
        const existingIds = new Set(prev.map((p) => p.id));
        const uniqueNewTouches = newTouches.filter(
          (t) => !existingIds.has(t.id),
        );
        const newPoints = [...prev, ...uniqueNewTouches];
        return newPoints;
      });
    };

    const handleTouchMove = (e) => {
      if (!isStarted) return;

      // 阻止默认行为和冒泡
      e.preventDefault();
      e.stopPropagation();

      Array.from(e.touches).forEach((touch) => {
        setLocalTouchPoints((prev) =>
          prev.map((p) =>
            p.id === touch.identifier
              ? { ...p, x: touch.clientX, y: touch.clientY }
              : p,
          ),
        );
      });
    };

    const handleTouchEnd = (e) => {
      if (!isStarted) return;

      e.preventDefault();
      e.stopPropagation();

      const endedTouches = Array.from(e.changedTouches);

      // 若已经分组则立即清除；否则给予短暂缓冲，适配先后点击
      if (hasGrouped) {
        setLocalTouchPoints((prev) =>
          prev.filter((p) => !endedTouches.some((t) => t.identifier === p.id)),
        );
      } else {
        setTimeout(() => {
          setLocalTouchPoints((prev) =>
            prev.filter(
              (p) => !endedTouches.some((t) => t.identifier === p.id),
            ),
          );
        }, 250);
      }
    };

    const handleMouseDown = (e) => {
      if (!isStarted) return;

      // 阻止默认行为
      e.preventDefault();
      e.stopPropagation();

      const touchInfo = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        color: null,
        group: null,
      };

      setLocalTouchPoints((prev) => [...prev, touchInfo]);

      // 不在模拟模式下自动删除触摸点，让用户手动移除
      const handleMouseUp = (e) => {
        e.preventDefault();
        setLocalTouchPoints((prev) =>
          prev.filter((p) => p.id !== touchInfo.id),
        );
        document.removeEventListener('mouseup', handleMouseUp);
      };
      document.addEventListener('mouseup', handleMouseUp);
    };

    const canvas = canvasRef.current;
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    canvas.addEventListener('contextmenu', (e) => e.preventDefault()); // 阻止右键菜单
    canvas.addEventListener('selectstart', (e) => e.preventDefault()); // 阻止文本选择
    canvas.addEventListener('mousedown', handleMouseDown);

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('mousedown', handleMouseDown);
    };
  }, [isStarted, hasGrouped]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />
      {showInstruction && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(26, 26, 26, 0.95)',
            padding: '20px 40px',
            borderRadius: '15px',
            zIndex: 100,
            textAlign: 'center',
            animation: 'fadeIn 0.5s',
          }}
        >
          <h2>请将手指按在屏幕四周</h2>
          <p>目标人数: {totalPeople || '未设置'}</p>
          <p>当所有 {totalPeople || ''} 人准备好后，将进行自动分组</p>
        </div>
      )}
    </>
  );
}

export default TouchCanvas;
