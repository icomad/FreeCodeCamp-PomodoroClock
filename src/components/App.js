import React, { Component } from 'react';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import accurateInterval from 'accurate-interval';

import Clock from './Clock';
import Control from './Control';
import alarm from '../fire_pager.mp3';

momentDurationFormatSetup(moment);

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      timerState: 1,
      timerIsActive: 0,
      timeLeft: 1500,
      timer: '',
      hover: 0,
    }
  }

  reset = () => {
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      timerState: 1,
      timerIsActive: 0,
      timeLeft: 1500,
      timer: '',
      hover: 0,
    });
    document.querySelector('circle').classList.remove('circle-anim');
    document.querySelector('#time-left').classList.remove('color-time-anim');
    document.querySelector('#timer-label').classList.remove('color-time-anim');
    this.alarm.pause();
    this.alarm.currentTime = 0;
    this.state.timer && this.state.timer.clear();
  }

  handleTimer = () => {
    const { timerIsActive } = this.state;
    const _ = timerIsActive ?
      (
        this.setState({ timerIsActive: !timerIsActive }),
        this.state.timer && this.state.timer.clear()
      )
      :
      (
        this.startTimer(),
        document.querySelector('circle').classList.add('circle-anim'),
        document.querySelector('#time-left').classList.add('color-time-anim'),
        document.querySelector('#timer-label').classList.add('color-time-anim'),
        this.setState({ timerIsActive: !timerIsActive })
      );
  }

  startTimer = () => {
    document.querySelector('circle').classList.add('circle-anim');
    document.querySelector('#time-left').classList.add('color-time-anim');
    document.querySelector('#timer-label').classList.add('color-time-anim');
    this.setState({
      timer: accurateInterval(() => {
        this.decrementTimer();
        this.timerStateControl();
      }, 1000)
    })
  }

  decrementTimer = () => {
    this.setState(prevState => ({ timeLeft: prevState.timeLeft - 1 }));
  }

  timerStateControl = () => {

    const { timeLeft, breakLength, sessionLength, timerState, timer } = this.state;
    this.playAlarm(timeLeft);
    if (timeLeft === 0) {
      document.querySelector('circle').classList.remove('circle-anim');
      document.querySelector('#time-left').classList.remove('color-time-anim');
      document.querySelector('#timer-label').classList.remove('color-time-anim');
    }
    let _ = timeLeft < 0 ? (
      timerState ? (
        timer && timer.clear(),
        this.setState({ timeLeft: breakLength * 60, timerState: 0 }),
        this.startTimer()
      ) : (
          timer && timer.clear(),
          this.setState({ timeLeft: sessionLength * 60, timerState: 1 }),
          this.startTimer()
        )
    ) : null
  }

  parseSeconds = () => {
    const timeLeft = moment.duration(this.state.timeLeft, 'seconds');
    return timeLeft.format('mm:ss', { trim: false });
  }

  playAlarm = (timeLeft) => {
    if (timeLeft === 0) this.alarm.play();
  }

  handleControl = (e, type) => {
    let { sessionLength, breakLength, timerState, timeLeft, timerIsActive } = this.state;
    if (timerIsActive) return;
    if ((timerState && type === 'session') || (!timerState && type === 'break')) {
      document.querySelector('circle').classList.remove('circle-anim');
      document.querySelector('#time-left').classList.remove('color-time-anim');
      document.querySelector('#timer-label').classList.remove('color-time-anim');
    }
    if (type === 'session') {
      sessionLength += parseInt(e.target.dataset.value);
      sessionLength += sessionLength > 60 ? -1 : (sessionLength < 1 ? 1 : 0);
      timeLeft = timerState ? sessionLength * 60 : timeLeft;
      this.setState({ sessionLength, timeLeft });
    }
    else {
      breakLength += parseInt(e.target.dataset.value);
      breakLength += breakLength > 60 ? -1 : (breakLength < 1 ? 1 : 0);
      timeLeft = timerState ? timeLeft : breakLength * 60;
      this.setState({ breakLength, timeLeft });
    }
  }

  handleOverOut = (e) => {
    const hover = e.type === 'mouseover' ? 1 : 0;
    this.setState({ hover });
  }

  render() {
    const { timerState, breakLength, sessionLength, timerIsActive, hover } = this.state;
    const style = {
      opacity: timerIsActive ? '0.2' : '1',
    }
    const anim = {
      animationDuration: timerState ? `${this.state.sessionLength * 60}s` : `${this.state.breakLength * 60}s`,
      animationPlayState: timerIsActive && this.state.timer ? 'running' : 'paused',
    }
    return (
      <div className='container'>
        <Header />

        <Clock
          handleMouse={this.handleOverOut}
          timerState={timerState}
          handleTimer={this.handleTimer}
          parseSeconds={this.parseSeconds}
          hover={hover}
          timerIsActive={timerIsActive}
          anim={anim} />


        <div className='control-container'>
          <Control
            style={style}
            type='break'
            value={breakLength}
            handleControl={this.handleControl} >
            Break Length
        </Control>

          <Control
            style={style}
            type='session'
            value={sessionLength}
            handleControl={this.handleControl} >
            Session Length
        </Control>
        </div>

        <button id='reset' onClick={this.reset}>RESET</button>

        <audio id="beep" preload="auto"
          ref={(node) => { this.alarm = node; }}
          src={alarm} />
      </div >
    )
  }
}

const Header = _ => (
  <header>
    <h1>Pomodoro Clock</h1>
  </header>
)

export default App
