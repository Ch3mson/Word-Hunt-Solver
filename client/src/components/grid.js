"use client"

import { useState } from 'react'
import axios from 'axios';

export default function Grid() {

    const [grid, setGrid] = useState(Array(4).fill('').map(() => Array(4).fill('')));
    const [words, setWords] = useState([]);

    

    return(
        <p>
            hello world
        </p>
    )
}