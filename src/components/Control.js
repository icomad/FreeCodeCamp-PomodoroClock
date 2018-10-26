import React from 'react'

const Control = ({ style, type, handleControl, value, children }) => {
  return (
    <div className='control' style={style}>
      <span id={type + '-label'}>{children}</span>
      <div className='control-com'>
        <button className='control-button' data-value={-1} id={type + '-decrement'} onClick={(e) => handleControl(e, type)}>-</button>
        <span id={type + '-length'}>{value}</span>
        <button className='control-button' data-value={1} id={type + '-increment'} onClick={(e) => handleControl(e, type)}>+</button>
      </div>
    </div>
  )
}

export default Control;
