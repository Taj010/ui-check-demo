export default function Home() {
  const stats = [
    { label: 'Active Projects', value: '12', trend: '↑ 3 this week', dir: 'up' },
    { label: 'Running Models', value: '7', trend: '↑ 1 today', dir: 'up' },
    { label: 'Training Jobs', value: '3', trend: '— same as yesterday', dir: '' },
    { label: 'GPU Utilization', value: '68%', trend: '↓ 4% from peak', dir: 'down' },
  ];

  const activity = [
    { text: 'Model "fraud-detector-v2" deployed to production', time: '2 minutes ago' },
    { text: 'Project "customer-segmentation" created by alice@example.com', time: '14 minutes ago' },
    { text: 'Notebook server "data-prep-01" stopped (idle timeout)', time: '1 hour ago' },
    { text: 'Pipeline run "etl-weekly" completed successfully', time: '3 hours ago' },
    { text: 'Storage class "standard-ssd" added by admin', time: '5 hours ago' },
    { text: 'Model "sentiment-analysis" retrained with new dataset', time: 'Yesterday at 4:32 PM' },
  ];

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <div className="page-header-title">Welcome back</div>
          <div className="page-header-sub">Here's what's happening across your AI platform today.</div>
        </div>
      </div>

      <div className="stats-grid section-gap">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className={`stat-trend ${s.dir}`}>{s.trend}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Recent Activity</div>
          <div className="card-subtitle" style={{ marginBottom: 16 }}>Platform events across all projects</div>
          <div className="activity-list">
            {activity.map((a, i) => (
              <div className="activity-item" key={i}>
                <div className="activity-dot" />
                <div>
                  <div className="activity-text">{a.text}</div>
                  <div className="activity-time">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="card-title">Quick Links</div>
            <div className="card-subtitle" style={{ marginBottom: 16 }}>Jump to common tasks</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: '+ Create a new project', href: '/projects' },
                { label: '⬡ Deploy a model', href: '/models' },
                { label: '⚙ Manage settings', href: '/settings' },
              ].map((l) => (
                <a key={l.label} href={l.href} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">Cluster Status</div>
            <div className="card-subtitle" style={{ marginBottom: 14 }}>OpenShift cluster — us-east-1</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'API Server', status: 'Healthy', badge: 'badge-success' },
                { label: 'GPU Operator', status: 'Healthy', badge: 'badge-success' },
                { label: 'Model Mesh', status: 'Degraded', badge: 'badge-warning' },
                { label: 'Pipelines', status: 'Healthy', badge: 'badge-success' },
              ].map((r) => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14 }}>{r.label}</span>
                  <span className={`badge ${r.badge}`}>{r.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
