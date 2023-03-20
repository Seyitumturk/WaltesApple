const calculateScore = (dice) => {
  const counts = new Array(6).fill(0);
  let score = 0;

  dice.forEach((value) => {
    counts[value - 1]++;
  });

  for (let i = 0; i < counts.length; i++) {
    if (counts[i] === 3) {
      score += (i + 1) * 100;
    } else if (counts[i] === 2) {
      score += (i + 1) * 10;
    } else if (counts[i] === 1) {
      score += i + 1;
    }
  }

  return score;
};

export default { calculateScore };
