import React, { forwardRef } from 'react'

const Marker = forwardRef(({color, ...props}, ref) => {
  return (
    <div
      {...props}
      ref={ref}
      style={{
        width: '16px',
        height: '16px',
        background: color,
        borderRadius: '50%',
        border: '2px solid black'
    }} />
  )
})

export default Marker