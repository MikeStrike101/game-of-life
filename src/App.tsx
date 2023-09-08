import React, { useState, useCallback, useRef } from 'react';
import produce from 'immer';

const numRows = 50;
const numCols = 50;

const operations = [
  [0, 1],
  [0 , -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const generateEmptyGrid = () => {
      const rows = [];
      for (let i = 0; i < numRows; i++) {
         rows.push(Array.from(Array(numCols), () => 0));
      }

      return rows;
};

const countNeighbors = (grid: any[][], x: number, y: number) => {
  return operations.reduce((acc, [i, j]) => {
    const row = (x + i + numRows) % numRows;
    const col = (y + j + numCols) % numCols;
    acc += grid[row][col];
    return acc;
  }, 0);
};

const App: React.FC = () => {
  const [grid, setGrid] = useState(() => {
     return generateEmptyGrid(); 
  });

const [running, setRunning] = useState(false);

const runningRef = useRef(running);

runningRef.current = running;

const runSimulation = useCallback(() => {
      if (!runningRef.current) {
        return;
      }
       
      setGrid((g) => {
        return produce(g, gridCopy => {
      for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            const neighbors = countNeighbors(g, i, j);
             if (neighbors < 2 || neighbors > 3) {
                gridCopy[i][j] = 0;
             } else if (g[i][j] === 0 && neighbors === 3) {
                 gridCopy[i][j] = 1;
             }
            }
          }
        });
      });
      setTimeout(runSimulation, 1000);
}, []);

  return (
    <>
    <button onClick={() => {
    setRunning(!running);
    if (!running) {    
      runningRef.current = true;
      runSimulation();
  }
    }}
    >
      {running ? 'stop' : 'start'}
    </button>
    <button onClick={() => {
       setGrid(generateEmptyGrid());
    }}>
      clear
    </button>
    <button onClick={() => {
          const rows = [];
      for (let i = 0; i < numRows; i++) {
         rows.push(Array.from(Array(numCols), () => Math.random() > 0.5 ? 1 : 0));
      }

      setGrid(rows);
    }}>
      random
    </button>
     <div style = {{
      display: 'grid',
      gridTemplateColumns: `repeat(${numCols}, 20px)`
     }}
     >
      {grid.map((rows, i) => 
        rows.map((col, j) => ( 
        <div
        key = {`${i}-${j}`} 
        onClick={() => {
          const newGrid = produce(grid, gridCopy => {
              gridCopy[i][j] = grid[i][j] ? 0 : 1;
          })
          setGrid(newGrid)
          grid[i][j] = 1
        }}
        style={{
          width: 20, 
          height:20, 
          backgroundColor: grid[i][j] ? 'purple' : undefined, 
          border: 'solid 1px black' 
          }} 
        />
        ))
      )}
      </div> 
      </>
  );
}

export default App;
