import React, { Component } from 'react';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';

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
    this.alarm.pause();
    this.alarm.currentTime = 0;
    this.state.timer && clearInterval(this.state.timer);
  }

  handleTimer = () => {
    this.setState(
      (prevState) => ({
        timerIsActive: !prevState.timerIsActive,
      }),
      _ => {
        _ = this.state.timerIsActive ? this.startTimer() : this.state.timer && clearInterval(this.state.timer)
      }
    );
  }

  startTimer = () => {
    document.querySelector('circle').classList.add('circle-anim');
    this.setState({
      timer: setInterval(() => {
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
    if (timeLeft === 0) document.querySelector('circle').classList.remove('circle-anim');
    let _ = timeLeft < 0 ? (
      timerState ? (
        timer && clearInterval(timer),
        this.setState({ timeLeft: breakLength * 60, timerState: 0 }),
        this.startTimer()
      ) : (
          timer && clearInterval(timer),
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
    if (type === 'session') {
      sessionLength += parseInt(e.target.dataset.value);
      sessionLength += sessionLength > 60 ? -1 : (sessionLength < 1 ? 1 : 0);
      this.setState({ sessionLength, timeLeft: timerState ? sessionLength * 60 : timeLeft });
    }
    else {
      breakLength += parseInt(e.target.dataset.value);
      breakLength += breakLength > 60 ? -1 : (breakLength < 1 ? 1 : 0);
      this.setState({ breakLength, timeLeft: timerState ? timeLeft : breakLength * 60 });
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
