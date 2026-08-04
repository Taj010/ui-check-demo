const models = [
  {
    name: 'fraud-detector-v2',
    type: 'Scikit-learn',
    project: 'fraud-detection',
    endpoint: 'https://fraud-v2.apps.cluster.example.com',
    replicas: 2,
    requests: '1.2k / min',
    latency: '38 ms',
    status: 'Running',
  },
  {
    name: 'sentiment-analysis',
    type: 'HuggingFace Transformer',
    project: 'nlp-summarizer',
    endpoint: 'https://sentiment.apps.cluster.example.com',
    replicas: 1,
    requests: '340 / min',
    latency: '112 ms',
    status: 'Running',
  },
  {
    name: 'segmentation-kmeans',
    type: 'Scikit-learn',
    project: 'customer-segmentation',
    endpoint: 'https://kmeans.apps.cluster.example.com',
    replicas: 3,
    requests: '56 / min',
    latency: '22 ms',
    status: 'Running',
  },
  {
    name: 'image-clf-resnet',
    type: 'PyTorch',
    project: 'image-classification',
    endpoint: '—',
    replicas: 0,
    requests: '—',
    latency: '—',
    status: 'Stopped',
  },
  {
    name: 'ts-prophet-v1',
    type: 'Prophet',
    project: 'time-series-forecast',
    endpoint: '—',
    replicas: 0,
    requests: '—',
    latency: '—',
    status: 'Error',
  },
];

const statusBadge: Record<string, string> = {
  Running: 'badge-success',
  Stopped: 'badge-neutral',
  Error: 'badge-danger',
  Starting: 'badge-warning',
};

export default function Models() {
  return (
    <main className="page">
      <div className="page-header">
        <div>
          <div className="page-header-title">Model Serving</div>
          <div className="page-header-sub">Deployed models and inference endpoints</div>
        </div>
        <button className="btn btn-primary">+ Deploy model</button>
      </div>

      <div className="cards-grid">
        {models.map((m) => (
          <div className="model-card" key={m.name}>
            <div className="model-card-header">
              <div>
                <div className="model-card-name">{m.name}</div>
                <div className="model-card-type">{m.type}</div>
              </div>
              <span className={`badge ${statusBadge[m.status] ?? 'badge-neutral'}`}>{m.status}</span>
            </div>

            <div className="model-card-meta">
              <span>Project: <strong>{m.project}</strong></span>
              <span>Replicas: <strong>{m.replicas}</strong></span>
              <span>Requests: <strong>{m.requests}</strong></span>
              <span>Avg latency: <strong>{m.latency}</strong></span>
            </div>

            {m.endpoint !== '—' && (
              <div style={{ fontSize: 12, color: 'var(--color-info)', wordBreak: 'break-all' }}>
                {m.endpoint}
              </div>
            )}

            <div className="model-card-actions">
              <button className="btn btn-secondary" style={{ fontSize: 12, padding: '4px 10px' }}>
                Details
              </button>
              {m.status === 'Running' && (
                <button className="btn btn-secondary" style={{ fontSize: 12, padding: '4px 10px', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}>
                  Stop
                </button>
              )}
              {m.status !== 'Running' && (
                <button className="btn btn-primary" style={{ fontSize: 12, padding: '4px 10px' }}>
                  Start
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
