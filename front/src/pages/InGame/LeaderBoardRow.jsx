import React, { useEffect, useState, forwardRef } from 'react'


const LeaderBoardRow = forwardRef(function LeaderBoardRow ({
  rank,
  pseudo,
  score,
  hasAnswered,
  currentRound
}, ref) {


  const [showResponseIndicator, setShowResponseIndicator] = useState(false);
  const [displayScore, setDisplayScore] = useState(score);

  useEffect(() => {
    if (hasAnswered) {
      setShowResponseIndicator(true);
    }
  }, [hasAnswered]);

  // toggle score animation
  useEffect(() => {
    if (score === displayScore) return;

    const start = displayScore;
    const end = score;
    const duration = 600; // in ms
    const startTime = performance.now();

    const step = now => {
      const t = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(start + (end - start) * t);
      setDisplayScore(value);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [score]);

  // reset when new round
  useEffect(() => {
    setShowResponseIndicator(false);
    setDisplayScore(score);
  }, [currentRound]);

  const vibrateClass = showResponseIndicator ? 'animate-vibrate' : '';


  return (
    <tr ref={ref} className={`border-b ${vibrateClass}`}>
      <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
        {rank}
      </th>
      <td className="px-6 py-4 flex items-center">
        <span className={`flex-1 `}>{pseudo}</span> 
        {showResponseIndicator && (
          <span
            className="w-2 h-2 bg-green-500 rounded-full ml-2 animate-pop-dot"
            aria-label="a répondu"
          />
        )}
      </td>
      <td className="px-6 py-4">{displayScore}</td>
    </tr>
  );
});


export default LeaderBoardRow;