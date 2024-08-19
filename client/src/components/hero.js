import React from 'react'

export default function Hero() {
  return (
    <section className="col-span-full mb-4 mx-auto w-full max-w-7xl items-center px-5 pt-12 pb-6 md:px-12 lg:px-16">
      <div className="mx-auto flex w-full text-left">
        <div className="mx-auto inline-flex items-center align-middle">
          <div className="text-center">
            <h1
              className="max-w-8xl text-4xl font-extrabold leading-none tracking-tighter 
              text-slate-50 md:text-5xl lg:max-w-7xl lg:text-6xl"
            >
              <span
                className="animate-move-bg bg-gradient-to-r from-indigo-500 
                via-pink-500 to-indigo-500 bg-[length:400%] bg-clip-text
                text-transparent"
              >
                Word Hunt Solver
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-500">
                Created with a Flask backend and Next.js frotnend. Source code available {" "}
                <a className='underline hover:text-slate-300' href="https://github.com/Ch3mson/word-hunt-cheat">
                    here 
                </a>.
                Press {" "}
                <a className="animate-move-bg bg-gradient-to-r from-indigo-500 
                via-pink-500 to-indigo-500 bg-[length:400%] bg-clip-text
                text-transparent">
                    Ctrl/Cmd + Backspace
                </a>
                 {" "}to clear the board
            </p>
            <div className="mx-auto flex w-full max-w-2xl flex-col justify-center gap-2 sm:flex-row">
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
