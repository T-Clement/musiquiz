import { useEffect, useRef } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import "./CountDownCircle.css";

/**
 * Custom hook that keeps track of the previous value of a variable across renders
 * Useful for animation and comparison with previous states
 * @param {any} value - The value to track
 * @returns {any} The value from the previous render
 */
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;     // store current value after each render
  }, [value]);
  return ref.current;
}

/**
 * Component that displays the countdown time with sliding animation effects
 * Shows both current time and previous time during transitions
 * @param {Object} props component props
 * @param {number} props.remainingTime current time left in seconds
 * @param {string} props.className additional CSS classes
 */
function TimeDisplay({ remainingTime, className = "" }) {
  // track previous time for animation
  const prevTime = usePrevious(remainingTime);
  const isNewTime = prevTime !== remainingTime;

  return (
    <div className={`time-wrapper ${className}`}>
      {/* display current time with upward animation when changed */}
      <div key={remainingTime} className={`time ${isNewTime ? "up" : ""}`}>
        {remainingTime}
      </div>

      {/* display previous time with downward animation when changed */}
      {prevTime !== undefined && prevTime !== remainingTime && (
        <div key={prevTime} className="time down">
          {prevTime}
        </div>
      )}
    </div>
  );
}

/**
 * Main countdown component that displays a circular timer with color transitions
 * @param {Object} props component props
 * @param {number} props.currentRound current round number (used as key to reset timer)
 * @param {boolean} props.roundInProgress whether the round is active
 * @param {number} props.timeLeft total duration in seconds
 * @param {string} props.className additional CSS classes
 */
export default function CountDownCircle({
  currentRound,
  roundInProgress,
  timeLeft,
  className = "",
}) {
  return (
    <div className="timer-wrapper">
      <CountdownCircleTimer
        key={currentRound} // reset timer when round changes
        isPlaying={roundInProgress} // Control timer state
        duration={timeLeft}
        // color transitions from blue -> yellow -> red
        colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
        // time thresholds for color changes
        colorsTime={[
          timeLeft,
          Math.floor(timeLeft * 0.7), // 70% of time remaining
          Math.floor(timeLeft * 0.3), // 30% of time remaining
          0,
        ]}
      >
        {/* render the time display component with remaining time */}
        {({ remainingTime }) => (
          <TimeDisplay remainingTime={remainingTime} className={className} />
        )}
      </CountdownCircleTimer>
    </div>
  );
}
