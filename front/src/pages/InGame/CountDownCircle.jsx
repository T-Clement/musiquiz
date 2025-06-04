import { useEffect, useRef, useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import "./CountDownCircle.css";

export default function CountDownCircle({currentRound, roundInProgress, timeLeft, className = ''}) {
  // function who handle the rendering of time in the circle
  const renderTime = ({ remainingTime }) => {
    const currentTime = useRef(remainingTime);
    const prevTime = useRef(null);
    const isNewTimeFirstTick = useRef(false);
    const [oneLastRerender, setOneLastRerender] = useState(0);


    // force a last re-render to trigger final animation
    useEffect(() => {
      if (remainingTime === 0) {
        setTimeout(() => {
          setOneLastRerender((val) => val + 1);
        }, 20);
      }
    }, [remainingTime]);



    // update the refs to handle transitions animations
    if (currentTime.current !== remainingTime) {
      isNewTimeFirstTick.current = true; // on a new second
      prevTime.current = currentTime.current; // update previous value 
      currentTime.current = remainingTime; // update current time with current value
    } else {
      isNewTimeFirstTick.current = false;
    }

    // use to know wich css class to use
    const isTimeUp = isNewTimeFirstTick.current;

    return (
      <div className={`time-wrapper ${{...className}}`}>
        <div key={remainingTime} className={`time ${isTimeUp ? "up" : ""}`}>
          {remainingTime}
        </div>
        {prevTime.current !== null && (
          <div
            key={prevTime.current}
            className={`time ${!isTimeUp ? "down" : ""}`}
          >
            {prevTime.current}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="timer-wrapper">
      <CountdownCircleTimer
        key={currentRound} // to rerender component in each round
        isPlaying={roundInProgress}
        duration={timeLeft}
        colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
        colorsTime={[
          timeLeft,
          Math.floor(timeLeft * 0.7),
          Math.floor(timeLeft * 0.3),
          0,
        ]}
        onComplete={() => {
          // console.log('Le compte à rebours est terminé !');
        }}
      >
        {renderTime}
      </CountdownCircleTimer>
    </div>
  );
}
