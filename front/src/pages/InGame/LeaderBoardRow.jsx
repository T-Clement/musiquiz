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


  return (
    <tr ref={ref} className='border-b'>
      <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
        {rank}
      </th>
      <td className="px-6 py-4">{pseudo} {showResponseIndicator && <span className='animate-pop'>✅</span>}</td>
      <td className="px-6 py-4">{displayScore}</td>
    </tr>
  );
});


export default LeaderBoardRow;