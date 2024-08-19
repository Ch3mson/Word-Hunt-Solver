import React from 'react'

export default function Container({ children }) {
  return (
    <div className='max-w-[1100px] mx-auto min-h-screen flex flex-col text-slate-100'>
        {children}
    </div>
  )
}
