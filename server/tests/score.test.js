const { getScoreFromResponseTime, MAX_SCORE } = require("../core/game/ScoreCalculator");


describe("test on score scenarios", () => {
    it("response from under THRESHOLD returns MAX_SCORE",  () => {
        expect(getScoreFromResponseTime(500)).toBe(MAX_SCORE);
    });
  });
  