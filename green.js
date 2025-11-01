import fs from "fs/promises";

export default function addFullStats(players) {
  // Helper: calcula estadísticas básicas
  const calcStats = (entries) => {
    const values = entries.map(v => v.value);
    if (values.length === 0) return { avg: 0, mode: 0, min: 0 };

    let avg = values.reduce((a, b) => a + b, 0) / values.length;
    avg = Math.trunc(avg); // 👈 trunca el promedio

    const min = Math.min(...values);

    // Calcular moda
    const freq = {};
    values.forEach(v => freq[v] = (freq[v] || 0) + 1);
    const mode = +Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];

    return { avg, mode, min };
  };

  const calcGreen = (entries, line) => {
    const total = entries.length;
    const over = entries.filter(v => v.value > line).length;
    const under = total - over;
    return { over, under, total };
  };

  const calcStreak = (entries, line) => {
    const sorted = [...entries].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    let streak = 0;
    for (const e of sorted) {
      if (e.value > line) streak++;
      else break;
    }
    return streak;
  };

  return players.map(player => {
    const updatedMarkets = {};

    for (const [marketName, marketData] of Object.entries(player.markets)) {
      const line = marketData.line;

      const lastFiveEntries = Object.values(marketData.lastFive || {});
      const lastAgainstEntries = Object.values(marketData.lastAgainst || {});

      const green = {
        lastFive: calcGreen(lastFiveEntries, line),
        lastAgainst: calcGreen(lastAgainstEntries, line),
      };

      const statistics = calcStats(lastFiveEntries);

      const streak = {
        lastFive: calcStreak(lastFiveEntries, line),
        lastAgainst: calcStreak(lastAgainstEntries, line),
      };

      updatedMarkets[marketName] = {
        ...marketData,
        green,
        statistics,
        streak,
      };
    }

    return {
      ...player,
      markets: updatedMarkets,
    };
  });
}

/*const tp = addFullStats(playerArray)
await fs.writeFile(`05-green.json`, JSON.stringify(tp, null, 2));*/