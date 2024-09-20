import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './styles.css';

const Cell = ({ top, right, bottom, left, isPlayer, isEnd }) => {
  return (
    <div
      style={{
        width: '25px',
        height: '25px',
        position: 'relative',
        backgroundColor: isEnd ? 'green' : isPlayer ? 'red' : 'white',
        border: '1px solid gray',
      }}
    >
      {/* Walls */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', backgroundColor: top ? 'black' : 'transparent' }}></div>
      <div style={{ position: 'absolute', top: 0, right: 0, width: '3px', height: '100%', backgroundColor: right ? 'black' : 'transparent' }}></div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '3px', backgroundColor: bottom ? 'black' : 'transparent' }}></div>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', backgroundColor: left ? 'black' : 'transparent' }}></div>
    </div>
  );
};

const MazeGame = () => {
  const [maze, setMaze] = useState([]);
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [endPos, setEndPos] = useState({ x: 13, y: 13 });
  const [isGameWon, setIsGameWon] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [highScore, setHighScore] = useState(localStorage.getItem('highScore') || null);

  useEffect(() => {
    const newMaze = generateMaze(15, 15);
    setMaze(newMaze);
    setStartAndEndPositions(newMaze);
    setStartTime(Date.now());
  }, []);

  const setStartAndEndPositions = (maze) => {
    const width = maze[0].length;
    const height = maze.length;

    let startX = 1;
    let startY = 1;

    let endX, endY;
    do {
      endX = Math.floor(Math.random() * (width - 2)) + 1;
      endY = Math.floor(Math.random() * (height - 2)) + 1;
    } while (Math.abs(startX - endX) + Math.abs(startY - endY) < 5);

    setPlayerPos({ x: startX, y: startY });
    setEndPos({ x: endX, y: endY });
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isGameWon) {
        let newPos = { ...playerPos };
        const currentCell = maze[playerPos.y][playerPos.x];

        switch (event.key) {
          case 'ArrowUp':
            if (!currentCell.top) newPos.y = Math.max(0, playerPos.y - 1);
            break;
          case 'ArrowDown':
            if (!currentCell.bottom) newPos.y = Math.min(maze.length - 1, playerPos.y + 1);
            break;
          case 'ArrowLeft':
            if (!currentCell.left) newPos.x = Math.max(0, playerPos.x - 1);
            break;
          case 'ArrowRight':
            if (!currentCell.right) newPos.x = Math.min(maze[0].length - 1, playerPos.x + 1);
            break;
          default:
            return;
        }

        if (maze[newPos.y][newPos.x]) {
          setPlayerPos(newPos);
          if (newPos.x === endPos.x && newPos.y === endPos.y) {
            const currentTime = Date.now() - startTime;
            setElapsedTime(currentTime);
            setIsGameWon(true);

            if (!highScore || currentTime < highScore) {
              setHighScore(currentTime);
              localStorage.setItem('highScore', currentTime);
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [playerPos, maze, endPos, isGameWon, startTime, highScore]);

  const handleReplay = () => {
    const newMaze = generateMaze(15, 15);
    setMaze(newMaze);
    setStartAndEndPositions(newMaze);
    setPlayerPos({ x: 1, y: 1 });
    setIsGameWon(false);
    setStartTime(Date.now());
    setElapsedTime(0);
  };

  const renderMaze = () => {
    return maze.map((row, rowIndex) => (
      <div key={rowIndex} style={{ display: 'flex' }}>
        {row.map((cell, cellIndex) => {
          const isPlayer = playerPos.x === cellIndex && playerPos.y === rowIndex;
          const isEnd = endPos.x === cellIndex && endPos.y === rowIndex;

          return (
            <Cell
              key={cellIndex}
              top={cell.top}
              right={cell.right}
              bottom={cell.bottom}
              left={cell.left}
              isPlayer={isPlayer}
              isEnd={isEnd}
            />
          );
        })}
      </div>
    ));
  };

  const formatTime = (timeInMillis) => {
    const seconds = Math.floor(timeInMillis / 1000);
    return `${seconds}s`;
  };

  return (
    <div>
      <h1>Maze Game</h1>
      <div>{renderMaze()}</div>
      <div className='info-container'>
        <div>Elapsed Time: {formatTime(elapsedTime)}</div>
        {highScore && <div>High Score: {formatTime(highScore)}</div>}
      </div>
      {isGameWon && (
        <div className="win-message">
          <h2>You Win!</h2>
          <button className="replay-button" onClick={handleReplay}>Play Again</button>
        </div>
      )}
    </div>
  );
};

function generateMaze(width, height) {
  const maze = Array.from({ length: height }, () => Array(width).fill(null).map(() => ({
    top: true,
    right: true,
    bottom: true,
    left: true,
  })));
  const stack = [];

  const directions = [
    { dx: 1, dy: 0, wall: 'right', oppositeWall: 'left' },
    { dx: -1, dy: 0, wall: 'left', oppositeWall: 'right' },
    { dx: 0, dy: 1, wall: 'bottom', oppositeWall: 'top' },
    { dx: 0, dy: -1, wall: 'top', oppositeWall: 'bottom' },
  ];

  const isInBounds = (x, y) => x > 0 && x < width - 1 && y > 0 && y < height - 1;

  const carvePath = (x, y) => {
    stack.push({ x, y });

    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const availableDirections = directions.filter(({ dx, dy }) => {
        const nx = current.x + dx;
        const ny = current.y + dy;
        return isInBounds(nx, ny) && !maze[ny][nx].visited;
      });

      if (availableDirections.length === 0) {
        stack.pop();
      } else {
        const { dx, dy, wall, oppositeWall } = availableDirections[Math.floor(Math.random() * availableDirections.length)];
        const nextX = current.x + dx;
        const nextY = current.y + dy;

        maze[current.y][current.x][wall] = false;
        maze[nextY][nextX][oppositeWall] = false;
        maze[nextY][nextX].visited = true;
        stack.push({ x: nextX, y: nextY });
      }
    }
  };

  carvePath(1, 1);
  maze.forEach(row => row.forEach(cell => delete cell.visited));

  return maze;
}

ReactDOM.render(<MazeGame />, document.getElementById('root'));
