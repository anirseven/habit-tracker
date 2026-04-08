import StatCard from './StatCard';
import ProgressBar from './ProgressBar';
import {
  calculateTodayStats,
  calculateWeekStats,
  calculateActiveStreaks,
  calculateTotalHabits
} from '../utils/homeSummaryAnalytics';
import '../styles/trends.css';
import '../styles/summary.css';

function SummaryCards({ habits }) {
  // Return nothing if no habits exist
  if (!habits || habits.length === 0) {
    return null;
  }

  const todayStats = calculateTodayStats(habits);
  const weekStats = calculateWeekStats(habits);
  const activeStreaks = calculateActiveStreaks(habits);
  const totalHabits = calculateTotalHabits(habits);

  return (
    <div className="summary-section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{todayStats.completed}/{todayStats.total}</div>
            <div className="stat-label">Today's Progress</div>
            <ProgressBar value={todayStats.completed} max={todayStats.total} showPercent={false} className="stat-progress" />
          </div>
        </div>
        <StatCard
          icon="📊"
          value={`${weekStats.completionRate}%`}
          label="This Week"
        />
        <StatCard
          icon="🔥"
          value={activeStreaks}
          label="Active Streaks"
        />
        <StatCard
          icon="🎯"
          value={totalHabits}
          label="Total Habits"
        />
      </div>
    </div>
  );
}

export default SummaryCards;
