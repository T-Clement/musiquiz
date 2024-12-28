import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

export default function CountDownCircle({currentRound, roundInProgress, timeLeft}) {
  
    // add custom handling
  
  
    return (
    <CountdownCircleTimer
      key={currentRound} // to rerender component in each round
      isPlaying={roundInProgress}
      duration={timeLeft}
      colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
      colorsTime={[timeLeft, timeLeft * 0.7, timeLeft * 0.3, 0]}
    >
      {({ remainingTime }) => remainingTime}
    </CountdownCircleTimer>
  );
}
