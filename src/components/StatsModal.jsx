export default function StatsModal({ stats, onClose }) {
  const best = Math.max(...stats.distribution, 1);

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="stats-modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <p className="eyebrow">YOUR PROGRESS</p>
        <h2>Statistics</h2>

        <div className="stat-grid">
          <div><strong>{stats.played}</strong><span>Played</span></div>
          <div><strong>{stats.played ? Math.round((stats.wins / stats.played) * 100) : 0}%</strong><span>Win rate</span></div>
          <div><strong>{stats.streak}</strong><span>Streak</span></div>
          <div><strong>{stats.maxStreak}</strong><span>Best streak</span></div>
        </div>

        <h3>Guess distribution</h3>
        <div className="distribution">
          {stats.distribution.map((count, index) => (
            <div className="distribution-row" key={index}>
              <span>{index + 1}</span>
              <div className="bar-track">
                <div className="bar" style={{ width: `${Math.max((count / best) * 100, count ? 8 : 0)}%` }}>
                  {count}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
