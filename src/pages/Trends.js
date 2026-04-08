import { calculateHabitStats } from "../utils/habitAnalytics";
import ProgressBar from "../components/ProgressBar";

function Trends({ habits }) {
  const stats = calculateHabitStats(habits);

  const getTrendIcon = (trend) => {
    if (trend === 'improving') return '↗️';
    if (trend === 'declining') return '↘️';
    return '→';
  };

  const getTrendLabel = (trend) => {
    if (trend === 'improving') return 'Improving';
    if (trend === 'declining') return 'Declining';
    return 'Stable';
  };

  if (habits.length === 0) {
    return (
      <div className="trends-page">
        <div className="trends-empty">
          <div className="empty-icon">📊</div>
          <h2>No Data Yet</h2>
          <p>Start tracking habits to see your trends and analytics!</p>
        </div>
      </div>
    );
  }

  const topPerformers = stats.habitBreakdown
    .filter(h => h.totalDays >= 3)
    .slice(0, 3);

  const needsAttention = stats.habitBreakdown
    .filter(h => h.completionRate < 50 && h.totalDays >= 3)
    .slice(0, 3);

  return (
    <div className="trends-page">
      <h1 className="trends-title">📊 Trends & Analytics</h1>

      {/* Overall Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalHabits}</div>
            <div className="stat-label">Unique Habits</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalDays}</div>
            <div className="stat-label">Days Tracked</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <div className="stat-value">{stats.overallCompletionRate}%</div>
            <div className="stat-label">Completion Rate</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <div className="stat-value">{stats.activeStreaks}</div>
            <div className="stat-label">Active Streaks</div>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      {topPerformers.length > 0 && (
        <div className="insights-section">
          <h2 className="section-title">⭐ Top Performers</h2>
          <div className="insights-grid">
            {topPerformers.map((habit, index) => (
              <div key={habit.name} className="insight-card top-performer">
                <div className="insight-rank">#{index + 1}</div>
                <h3>{habit.name}</h3>
                <div className="insight-stat">{habit.completionRate}% completion</div>
                {habit.currentStreak > 0 && (
                  <div className="streak-badge">🔥 {habit.currentStreak} day streak</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Needs Attention */}
      {needsAttention.length > 0 && (
        <div className="insights-section">
          <h2 className="section-title">⚠️ Needs Attention</h2>
          <div className="insights-grid">
            {needsAttention.map((habit) => (
              <div key={habit.name} className="insight-card needs-attention">
                <h3>{habit.name}</h3>
                <div className="insight-stat">{habit.completionRate}% completion</div>
                <div className="insight-help">Keep pushing! You've got this 💪</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Breakdown */}
      <div className="breakdown-section">
        <h2 className="section-title">📋 Habit Breakdown</h2>
        <div className="habits-table">
          <div className="table-header">
            <div className="col-habit">Habit</div>
            <div className="col-days">Days</div>
            <div className="col-rate">Completion</div>
            <div className="col-streak">Streak</div>
            <div className="col-trend">Trend</div>
          </div>

          {stats.habitBreakdown.map((habit) => (
            <div key={habit.name} className="table-row">
              <div className="col-habit">
                <div className="habit-name-cell">{habit.name}</div>
                <div className="habit-meta">
                  Last: {new Date(habit.lastTracked + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>

              <div className="col-days">
                <span className="days-badge">{habit.totalDays}</span>
              </div>

              <div className="col-rate">
                <ProgressBar value={habit.completionRate} showPercent={false} />
                <div className="progress-label">{habit.completionRate}%</div>
              </div>

              <div className="col-streak">
                {habit.currentStreak > 0 ? (
                  <span className="streak-indicator">
                    🔥 {habit.currentStreak}
                    {habit.longestStreak > habit.currentStreak && (
                      <span className="longest-streak"> (best: {habit.longestStreak})</span>
                    )}
                  </span>
                ) : (
                  <span className="no-streak">—</span>
                )}
              </div>

              <div className="col-trend">
                <span className={`trend-badge trend-${habit.trend}`}>
                  {getTrendIcon(habit.trend)} {getTrendLabel(habit.trend)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Trends;
