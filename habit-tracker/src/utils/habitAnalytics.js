// Calculate analytics for habits
export function calculateHabitStats(habits) {
  if (!habits || habits.length === 0) {
    return {
      totalHabits: 0,
      totalDays: 0,
      overallCompletionRate: 0,
      activeStreaks: 0,
      habitBreakdown: []
    };
  }

  // Group habits by name
  const habitGroups = {};
  habits.forEach(habit => {
    const name = habit.habit.toLowerCase().trim();
    if (!habitGroups[name]) {
      habitGroups[name] = [];
    }
    habitGroups[name].push(habit);
  });

  // Calculate stats for each habit
  const habitBreakdown = Object.entries(habitGroups).map(([name, entries]) => {
    // Sort by date
    const sortedEntries = entries.sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalDays = entries.length;
    const completedDays = entries.filter(e => e.status === 'Completed').length;
    const completionRate = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;

    const currentStreak = calculateCurrentStreak(sortedEntries);
    const longestStreak = calculateLongestStreak(sortedEntries);
    const lastTracked = sortedEntries[0]?.date;

    // Calculate trend (last 7 days vs previous 7 days)
    const trend = calculateTrend(sortedEntries);

    return {
      name: entries[0].habit, // Original case
      totalDays,
      completedDays,
      completionRate: Math.round(completionRate),
      currentStreak,
      longestStreak,
      lastTracked,
      trend,
      entries: sortedEntries
    };
  });

  // Sort by completion rate
  habitBreakdown.sort((a, b) => b.completionRate - a.completionRate);

  // Calculate overall stats
  const totalDays = new Set(habits.map(h => h.date)).size;
  const totalCompletions = habits.filter(h => h.status === 'Completed').length;
  const overallCompletionRate = habits.length > 0
    ? Math.round((totalCompletions / habits.length) * 100)
    : 0;
  const activeStreaks = habitBreakdown.filter(h => h.currentStreak > 0).length;

  return {
    totalHabits: Object.keys(habitGroups).length,
    totalDays,
    overallCompletionRate,
    activeStreaks,
    habitBreakdown
  };
}

function calculateCurrentStreak(sortedEntries) {
  if (sortedEntries.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let currentDate = new Date(today);

  // Create a map of dates with completed status
  const dateMap = new Map();
  sortedEntries.forEach(entry => {
    const date = new Date(entry.date + 'T00:00:00');
    date.setHours(0, 0, 0, 0);
    const dateKey = date.getTime();
    if (entry.status === 'Completed') {
      dateMap.set(dateKey, true);
    }
  });

  // Count backwards from today
  while (true) {
    const dateKey = currentDate.getTime();
    if (dateMap.has(dateKey)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

function calculateLongestStreak(sortedEntries) {
  if (sortedEntries.length === 0) return 0;

  const completedDates = sortedEntries
    .filter(e => e.status === 'Completed')
    .map(e => new Date(e.date + 'T00:00:00').setHours(0, 0, 0, 0))
    .sort((a, b) => a - b);

  if (completedDates.length === 0) return 0;

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < completedDates.length; i++) {
    const dayDiff = (completedDates[i] - completedDates[i - 1]) / (1000 * 60 * 60 * 24);

    if (dayDiff === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return maxStreak;
}

function calculateTrend(sortedEntries) {
  if (sortedEntries.length < 7) return 'stable';

  const last7Days = sortedEntries.slice(0, 7);
  const previous7Days = sortedEntries.slice(7, 14);

  if (previous7Days.length === 0) return 'stable';

  const recentRate = last7Days.filter(e => e.status === 'Completed').length / last7Days.length;
  const previousRate = previous7Days.filter(e => e.status === 'Completed').length / previous7Days.length;

  if (recentRate > previousRate + 0.1) return 'improving';
  if (recentRate < previousRate - 0.1) return 'declining';
  return 'stable';
}
