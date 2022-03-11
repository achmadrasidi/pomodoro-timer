import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";

const Break = ({ breakLength, decrementBreakLength, incrementBreakLength }) => {
  return (
    <>
      <h5 id="break-label">Break Time</h5>
      <h3 id="break-length">{breakLength} Min</h3>
      <button className="btn btn-md btn-primary" id="break-decrement" onClick={decrementBreakLength}>
        -
      </button>
      <button className="btn btn-md btn-primary" id="break-increment" onClick={incrementBreakLength}>
        +
      </button>
    </>
  );
};

const Session = ({ sessionLength, decrementSessionLength, incrementSessionLength }) => {
  return (
    <>
      <h5 id="session-label">Session Time</h5>
      <h3 id="session-length">{sessionLength} Min</h3>
      <button className="btn btn-md btn-primary" id="session-decrement" onClick={decrementSessionLength}>
        -
      </button>
      <button className="btn btn-md btn-primary" id="session-increment" onClick={incrementSessionLength}>
        +
      </button>
    </>
  );
};

let timer = 1500;
let interval;

const TimeLeft = ({ setBreakLength, setSessionLength, breakLength, sessionLength }) => {
  const [timeLeft, setTimeLeft] = useState(1500);
  const [intervalId, setIntervalId] = useState(false);
  const [breakTime, setBreakTime] = useState(false);
  const [currentSession, setCurrentSession] = useState("SESSION");

  const pad = (num, place) => String(num).padStart(place, "0");

  const getTimer = (s) => {
    const minutes = Math.floor(s / 60);
    const seconds = s - minutes * 60;
    return pad(minutes, 2) + ":" + pad(seconds, 2);
  };

  useEffect(() => {
    timer = sessionLength * 60;
    setTimeLeft(timer);
  }, [sessionLength]);

  const started = () => {
    intervalId ? setIntervalId(false) : setIntervalId(true);
  };

  useEffect(() => {
    if (intervalId) {
      interval = setInterval(() => {
        timer = timer - 1;
        setTimeLeft(timer);
      }, 1000);
    } else {
      clearInterval(interval);
    }
  }, [intervalId]);

  useEffect(() => {
    if (timeLeft === 0) {
      const beep = document.getElementById("beep");
      beep.currentTime = 0;
      beep.play();
      breakTime ? setBreakTime(false) : setBreakTime(true);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (breakTime) {
      timer = breakLength * 60;
      setTimeLeft(timer);
      setCurrentSession("BREAK");
    } else {
      timer = sessionLength * 60;
      setTimeLeft(timer);
      setCurrentSession("SESSION");
    }
  }, [breakTime]);

  const resetTimer = () => {
    clearInterval(interval);
    timer = 1500;
    setTimeLeft(timer);
    setCurrentSession("SESSION");
    setIntervalId(false);
    setBreakTime(false);
    setBreakLength(5);
    setSessionLength(25);
    const beep = document.getElementById("beep");
    beep.pause();
    beep.currentTime = 0;
  };

  return (
    <div className="row " id="timer">
      <div className="col">
        <h2 id="timer-label">{currentSession}</h2>
        <p>Time Left:</p>
        <h4 id="time-left">{getTimer(timeLeft)}</h4>
        <button className="btn btn-success" id="start_stop" onClick={started}>
          {intervalId ? "STOP" : "START"}
        </button>
        <button className="btn btn-success" id="reset" onClick={resetTimer}>
          RESET
        </button>
        <audio id="beep" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" preload="auto"></audio>
      </div>
    </div>
  );
};

function Timer() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);

  const decrementSessionLength = () => {
    if (sessionLength <= 1) {
      setSessionLength(1);
    } else {
      setSessionLength(sessionLength - 1);
    }
  };

  const incrementSessionLength = () => {
    if (sessionLength >= 60) {
      setSessionLength(60);
    } else {
      setSessionLength(sessionLength + 1);
    }
  };

  const decrementBreakLength = () => {
    if (breakLength <= 1) {
      setBreakLength(1);
    } else {
      setBreakLength(breakLength - 1);
    }
  };

  const incrementBreakLength = () => {
    if (breakLength >= 60) {
      setBreakLength(60);
    } else {
      setBreakLength(breakLength + 1);
    }
  };
  return (
    <div className="container border border-secondary rounded">
      <h1>Pomodoro Timer</h1>
      <div className="row mt-3 mb-1 bg-light">
        <div className="col-md-6">
          <Break breakLength={breakLength} decrementBreakLength={decrementBreakLength} incrementBreakLength={incrementBreakLength} />
        </div>
        <div className="col-md-6 border-start border-secondary">
          <Session sessionLength={sessionLength} decrementSessionLength={decrementSessionLength} incrementSessionLength={incrementSessionLength} />
        </div>
      </div>
      <TimeLeft breakLength={breakLength} sessionLength={sessionLength} setBreakLength={setBreakLength} setSessionLength={setSessionLength} />
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Timer />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
