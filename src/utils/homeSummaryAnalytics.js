// Calculate time-scoped statistics for Home page summary

export function calculateTodayStats(habits) {
  if (!habits || habits.length === 0) {
    return { total: 0, completed: 0, completionRate: 0 };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayHabits = habits.filter(habit => {
    const habitDate = new Date(habit.date + 'T00:00:00');
    habitDate.setHours(0, 0, 0, 0);
    return habitDate.getTime() === today.getTime();
  });

  const total = todayHabits.length;
  const completed = todayHabits.filter(h => h.status === 'Completed').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, completed, completionRate };
}

export function calculateWeekStats(habits) {
  if (!habits || habits.length === 0) {
    return { totalHabits: 0, completionRate: 0, daysTracked: 0 };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Last 7 days including today

  const weekHabits = habits.filter(habit => {
    const habitDate = new Date(habit.date + 'T00:00:00');
    habitDate.setHours(0, 0, 0, 0);
    return habitDate >= sevenDaysAgo && habitDate <= today;
  });

  const totalHabits = weekHabits.length;
  const completed = weekHabits.filter(h => h.status === 'Completed').length;
  const completionRate = totalHabits > 0 ? Math.round((completed / totalHabits) * 100) : 0;
  const daysTracked = new Set(weekHabits.map(h => h.date)).size;

  return { totalHabits, completionRate, daysTracked };
}

export function calculateActiveStreaks(habits) {
  if (!habits || habits.length === 0) {
    return 0;
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

  // Count habits with active streaks
  let activeStreakCount = 0;

  Object.values(habitGroups).forEach(entries => {
    const sortedEntries = entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    const streak = calculateCurrentStreak(sortedEntries);
    if (streak > 0) {
      activeStreakCount++;
    }
  });

  return activeStreakCount;
}

export function calculateTotalHabits(habits) {
  if (!habits || habits.length === 0) {
    return 0;
  }

  // Group habits by unique name (case-insensitive)
  const habitGroups = {};
  habits.forEach(habit => {
    const name = habit.habit.toLowerCase().trim();
    habitGroups[name] = true;
  });

  return Object.keys(habitGroups).length;
}

// Helper function to calculate current streak (copied pattern from habitAnalytics.js)
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
