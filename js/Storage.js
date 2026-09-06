const Storage = {
  SCORES_KEY: "ecodash_highscores",

  saveScore(scoreEntry) {
    const existingScores = Storage.getHighScores();
    existingScores.push(scoreEntry);
    existingScores.sort((scoreA, scoreB) => scoreB.missionScore - scoreA.missionScore);
    const topScores = existingScores.slice(0, 5);
    localStorage.setItem(Storage.SCORES_KEY, JSON.stringify(topScores));
    return topScores;
  },

  getHighScores() {
    const storedValue = localStorage.getItem(Storage.SCORES_KEY);
    if (!storedValue) {
      return [];
    }

    try {
      return JSON.parse(storedValue);
    } catch (error) {
      return [];
    }
  },

  clearScores() {
    localStorage.removeItem(Storage.SCORES_KEY);
  }
};
