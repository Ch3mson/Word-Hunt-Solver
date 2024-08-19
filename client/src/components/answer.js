import React from 'react';

export default function Answer({ grid, answer }) {
  const highlightGrid = Array(4).fill().map(() => Array(4).fill(false));
  
  answer.path.forEach(([row, col]) => {
    highlightGrid[row][col] = true;
  });

  const cellSize = 32;

  const PathElement = ({ start, end, isLast }) => {
    const [startX, startY] = [start[1] * cellSize + cellSize / 2, start[0] * cellSize + cellSize / 2];
    const [endX, endY] = [end[1] * cellSize + cellSize / 2, end[0] * cellSize + cellSize / 2];
    
    return (
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke="#df4ca4"
        strokeWidth="2"
        strokeLinecap="round"   // Makes the ends of the lines rounded
        strokeLinejoin="round"  // Makes the corners where lines meet rounded
        markerEnd={isLast ? "url(#arrowhead)" : ""}
      />
    );
  };

  return (
    <div className="mb-4 text-center">
      <h3 className="text-lg font-semibold mb-2 text-white">
        {answer.word.charAt(0).toUpperCase() + answer.word.slice(1)}
      </h3>
      <div className="relative inline-block rounded-2xl overflow-hidden border-2 border-[#1f2937]">
        <table className="border-collapse">
          <tbody>
            {grid.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td 
                    key={colIndex}
                    className={`w-8 h-8 text-center ${
                      highlightGrid[rowIndex][colIndex] 
                        ? 'bg-[#617ee6] text-slate-100' 
                        : 'bg-[#0A1120] text-slate-100'
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#df4ca4" />
            </marker>
          </defs>
          {answer.path.slice(0, -1).map((start, index) => (
            <PathElement 
              key={index} 
              start={start} 
              end={answer.path[index + 1]} 
              isLast={index === answer.path.length - 2}
            />
          ))}
          {/* Circle at the first position */}
          <circle
            cx={answer.path[0][1] * cellSize + cellSize / 2}
            cy={answer.path[0][0] * cellSize + cellSize / 2}
            r="4"
            fill="#df4ca4"
          />
        </svg>
      </div>
    </div>
  )
}
