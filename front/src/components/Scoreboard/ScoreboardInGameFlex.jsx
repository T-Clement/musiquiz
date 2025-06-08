import { motion, AnimatePresence } from "framer-motion";
import ScoreboardInGameRowFlex from "./ScoreboardInGameRowFlex";
import { useAnsweredPlayers } from "../../hooks/useAnsweredPlayers";


export default function ScoreboardInGameFlex({
  scores,
  currentRound,
}) {

  // hook who returns a Set of userIds who have answered in the current round
  // used for the vibrate animation of row
  const {answeredSet} = useAnsweredPlayers(currentRound);

  return (
    // flexbox layout set as a fake table
    <div className="
      relative w-full
      rounded-xl bg-slate-900/85 backdrop-blur
      ring-2 ring-violet-500/60 shadow-[0_0_20px_4px_rgba(124,58,237,0.25)]
      overflow-hidden p-2
    ">
      {/* fake table header */}
      <div className="
        flex 
        bg-violet-700/80 text-xs uppercase tracking-wider text-white
        px-4 py-3 rounded-t-md
      ">
        <span className="w-10 text-center">#</span>
        <span className="flex-1">Pseudo</span>
        <span className="w-20 text-right">Score</span>
      </div>

      {/* animated rows */}
      <AnimatePresence>
        {scores.map((row, i) => (
          // reorder each row with a key based on userId
          <motion.div
            key={row.userId}
            layout="position"
            transition={{ duration: 0.6, type: "spring", stiffness: 550, damping: 28 }}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
          >
            <ScoreboardInGameRowFlex
              rank={i + 1}
              row={row}
              hasAnswered={answeredSet.has(row.userId)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

}
