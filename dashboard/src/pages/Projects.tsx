const projects = [
  {
    name: 'fraud-detection',
    owner: 'alice@example.com',
    notebooks: 2,
    models: 1,
    storage: '18 GiB',
    lastActive: '2 hours ago',
    status: 'Active',
    created: 'Jul 28, 2026',
  },
  {
    name: 'customer-segmentation',
    owner: 'bob@example.com',
    notebooks: 4,
    models: 3,
    storage: '42 GiB',
    lastActive: '15 min ago',
    status: 'Active',
    created: 'Jul 15, 2026',
  },
  {
    name: 'image-classification',
    owner: 'carol@example.com',
    notebooks: 1,
    models: 0,
    storage: '5 GiB',
    lastActive: '3 days ago',
    status: 'Inactive',
    created: 'Jun 30, 2026',
  },
  {
    name: 'nlp-summarizer',
    owner: 'dave@example.com',
    notebooks: 3,
    models: 2,
    storage: '27 GiB',
    lastActive: '1 hour ago',
    status: 'Active',
    created: 'Jun 12, 2026',
  },
  {
    name: 'time-series-forecast',
    owner: 'eve@example.com',
    notebooks: 2,
    models: 1,
    storage: '11 GiB',
    lastActive: '5 days ago',
    status: 'Error',
    created: 'May 5, 2026',
  },
  {
    name: 'legacy-recommender',
    owner: 'frank@example.com',
    notebooks: 0,
    models: 1,
    storage: '3 GiB',
    lastActive: '45 days ago',
    status: 'Archived',
    created: 'Jan 20, 2026',
  },
];

const statusBadge: Record<string, string> = {
  Active: 'badge-success',
  Inactive: 'badge-neutral',
  Error: 'badge-danger',
  Archived: 'badge-info',
};

export default function Projects() {
  return (
    <main className="page">
      <div className="page-header">
        <div>
          <div className="page-header-title">Projects</div>
          <div className="page-header-sub">Data science projects and their resources</div>
        </div>
        <button className="btn btn-primary">+ Create project</button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Owner</th>
              <th>Notebooks</th>
              <th>Models</th>
              <th>Storage</th>
              <th>Last Active</th>
              <th>Status</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.name}>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td style={{ color: 'var(--color-text-muted)' }}>{p.owner}</td>
                <td>{p.notebooks}</td>
                <td>{p.models}</td>
                <td>{p.storage}</td>
                <td style={{ color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{p.lastActive}</td>
                <td>
                  <span className={`badge ${statusBadge[p.status] ?? 'badge-neutral'}`}>
                    {p.status}
                  </span>
                </td>
                <td style={{ color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{p.created}</td>
                <td>
                  <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: 12 }}>
                    Open
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
