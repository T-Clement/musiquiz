const MAX_SCORE = 1000;
const T = 20;
const THRESHOLD = 1.2; // if under or equals this value -> it's max score

function getScoreFromResponseTime(tMs) {
    const t = tMs / 1000; // convert ms to seconds
    
    // user responded in a very short time, so he gets max point
    if(t <= THRESHOLD) {
        return MAX_SCORE;
      }
  
    // it's here but it should not be concerned
    if(t >= T) {
    return 0;
    }

    const slope = MAX_SCORE / (T - THRESHOLD);
    return Math.floor(Math.max( 0, MAX_SCORE - slope * (t - THRESHOLD) ));

}

module.exports = {MAX_SCORE, getScoreFromResponseTime}