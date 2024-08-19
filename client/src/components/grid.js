"use client"

import { useState, useRef } from 'react'
import axios from 'axios';
import Answer from './answer';

export default function Grid() {
    const [grid, setGrid] = useState(Array(4).fill().map(() => Array(4).fill('')));
    const [error, setError] = useState('');
    const [answers, setAnswers] = useState([]);
    const inputRefs = useRef(Array(4).fill().map(() => Array(4)));

    const handleInputChange = (rowIndex, colIndex, value) => {
        setError('');
        const newGrid = grid.map((row, rIndex) => 
            row.map((cell, cIndex) => 
                rIndex === rowIndex && cIndex === colIndex ? value.toLowerCase() : cell
            )
        );
        setGrid(newGrid);

        if (value !== '') {
            focusNextInput(rowIndex, colIndex);
        } else {
            focusPreviousInput(rowIndex, colIndex);
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text').replace(/[^a-zA-Z]/g, '').toLowerCase().slice(0, 16);
        const newGrid = Array(4).fill().map(() => Array(4).fill(''));
        
        for (let i = 0; i < pastedText.length; i++) {
            const row = Math.floor(i / 4);
            const col = i % 4;
            newGrid[row][col] = pastedText[i];
        }

        setGrid(newGrid);
        setError('');

        
        const lastFilledIndex = Math.min(pastedText.length, 16) - 1;
        const lastRow = Math.floor(lastFilledIndex / 4);
        const lastCol = lastFilledIndex % 4;
        if (inputRefs.current[lastRow] && inputRefs.current[lastRow][lastCol]) {
            inputRefs.current[lastRow][lastCol].focus();
        }
    };

    const focusNextInput = (rowIndex, colIndex) => {
        let nextRow = rowIndex;
        let nextCol = colIndex + 1;

        if (nextCol > 3) {
            nextRow++;
            nextCol = 0;
        }

        if (nextRow <= 3) {
            inputRefs.current[nextRow][nextCol].focus();
        }
    };

    const focusPreviousInput = (rowIndex, colIndex) => {
        let prevRow = rowIndex;
        let prevCol = colIndex - 1;

        if (prevCol < 0) {
            prevRow--;
            prevCol = 3;
        }

        if (prevRow >= 0) {
            inputRefs.current[prevRow][prevCol].focus();
        }
    };

    const handleKeyDown = (event, rowIndex, colIndex) => {
        if (!/[a-zA-Z]/.test(event.key) && !['Backspace', 'Enter'].includes(event.key)) {
            event.preventDefault();
        }
        if (event.key === 'Backspace' && grid[rowIndex][colIndex] === '') {
            event.preventDefault();
            focusPreviousInput(rowIndex, colIndex);
        }
        if (event.key === 'Enter') {
            handleSubmit();
        }
        // Handle Ctrl+A (or Cmd+A on Mac)
        if ((event.ctrlKey || event.metaKey) && event.key === 'Backspace') {
            event.preventDefault();
            selectAllText();
        }
    };

    const selectAllText = () => {
        const allText = grid.flat().join('');
        setGrid(Array(4).fill().map(() => Array(4).fill('')));
        if (inputRefs.current[0] && inputRefs.current[0][0]) {
            const input = inputRefs.current[0][0];
            input.focus();
            input.value = allText;
            input.setSelectionRange(0, allText.length);
        }
    };

    const handleSubmit = async () => {
        const board = grid.flat().join('');
        if (board.length !== 16) {
            setError('You must fill all 16 cells before submitting.');
            return;
        }

        try {
            setError('');
            const response = await axios.post('http://127.0.0.1:5000/solve', { board });
            setAnswers(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while submitting. Please try again.');
        }
    };

    return (
        <>
        <div className='flex flex-col mx-auto'>
            <table>
                <tbody>
                    {grid.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, colIndex) => (
                                <td key={colIndex} >
                                    <input 
                                        ref={el => inputRefs.current[rowIndex][colIndex] = el}
                                        maxLength={1}
                                        value={cell}
                                        onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                                        onPaste={rowIndex === 0 && colIndex === 0 ? handlePaste : undefined}
                                        className="w-16 h-16 text-2xl bg-[#1f2937] text-center focus:outline-none focus:border-[#374151] border border-[#1f2937] rounded-md text-slate-100"
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <button
                onClick={handleSubmit}
                className="text-slate-100 bg-gradient-to-r from-indigo-500 via-pink-500 to-indigo-500 bg-[length:200%_200%] animate-gradient-move hover:from-indigo-600 hover:via-pink-600 hover:to-indigo-600 font-medium rounded-lg text-sm mt-2 px-5 py-2.5 text-center mb-2"
            >
                Solve
            </button>
        </div>

        {error && <p className='text-red-400'>{error}</p>}
        
        {answers.length > 0 && (
            <div className="mt-8">
                <h2 className="font-bold text-3xl text-center pb-8 animate-move-bg bg-gradient-to-r from-indigo-500 
                    via-pink-500 to-indigo-500 bg-[length:400%] bg-clip-text
                    text-transparent">Answers:
                </h2>
                <div className="flex justify-center w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 items-center">
                        {answers.map((answer, index) => (
                            <Answer key={index} grid={grid} answer={answer} />
                        ))}
                    </div>
                </div>
            </div>
        )}
        </>
    )
}