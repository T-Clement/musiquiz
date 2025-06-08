import { useEffect, useState } from "react";


export default function ScoreboardInGameRowFlex({ rank, row, hasAnswered }) {
  const [display, setDisplay] = useState(row.score); // animated counter of incrementing score
  const [isShaking, setIsShaking] = useState(false); // state to trigger vibration animation

  useEffect(() => {
    // make the incrementation of the score
    const start = display, end = row.score, d = 450, t0 = performance.now();

    // recursive function to animate the score increment
    const step = (now) => {
      // calculate the progress of the animation
      const k = Math.min((now - t0) / d, 1);  
      // set the display score based on the progress
      setDisplay(Math.floor(start + (end - start) * k)); 
      // continue the animation until it reaches the end
      if (k < 1) requestAnimationFrame(step); 
    };
    // start the animation
    requestAnimationFrame(step);
  }, [row.score]);

  // add vibration when player make a response
  useEffect(() => {
    if ( hasAnswered) {
      setIsShaking(true);
      const timeout = setTimeout(() => setIsShaking(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [hasAnswered]);


    return (
    <div className={[
      "flex items-center gap-2 px-4 py-3 ",
      isShaking && "animate-vibrate", // CSS class for vibration
      "even:bg-white/5 bg-white/10 transition-colors border-t border-slate-600 ",
    ].filter(Boolean).join(" ")}>
      
      <span className="w-10 text-center">{rank}</span>

      <span className="flex-1 flex items-center">
        {row.pseudo}
        {/* green dot to show response of player */}
        {hasAnswered && (
          <span className="relative ml-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
        )}
      </span>

      <span className="w-20 text-right font-mono">{display.toLocaleString()}</span>
    </div>
  );
}
