import React from 'react'

const Clock = ({ timerState, handleTimer, parseSeconds, handleMouse, hover, timerIsActive, anim }) => {
  let timerLabel;
  if (hover) {
    if (timerIsActive) {
      if (timerState) timerLabel = 'Click to pause session';
      else timerLabel = 'Click to pause break';
    }
    else {
      if (timerState) timerLabel = 'Click to start session';
      else timerLabel = 'Click to start break';
    }
  } else {
    if (timerState) timerLabel = 'Session';
    else timerLabel = 'Break';
  }
  return (
    <div className='clock' id='clock'>
      <svg width='100%' height='100%'>
        <circle className="outer circle-anim" cx='50%' cy='50%' r='50%' style={anim} />
      </svg>
      <div id='start_stop' onClick={handleTimer} onMouseOver={(e) => handleMouse(e)} onMouseOut={(e) => handleMouse(e)}>
        <div id='timer-label'>
          {timerLabel}
        </div>

        <div id='time-left'>
          {parseSeconds()}
        </div>
      </div>
    </div >
  )
}

export default Clock
