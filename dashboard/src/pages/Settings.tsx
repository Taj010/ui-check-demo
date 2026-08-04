import { useState } from 'react';

export default function Settings() {
  const [flags, setFlags] = useState({
    modelServing: true,
    pipelines: true,
    notebooks: true,
    modelRegistry: false,
    genAiStudio: false,
    customRuntimes: true,
  });

  const toggle = (key: keyof typeof flags) =>
    setFlags((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <div className="page-header-title">Settings</div>
          <div className="page-header-sub">Platform configuration and feature management</div>
        </div>
        <button className="btn btn-primary">Save changes</button>
      </div>

      <div className="settings-sections">
        {/* Cluster Info */}
        <div className="settings-section">
          <div className="settings-section-header">
            <div className="settings-section-title">Cluster Information</div>
            <div className="settings-section-desc">Read-only cluster metadata</div>
          </div>
          {[
            { label: 'Cluster name', value: 'odh-cluster-prod' },
            { label: 'OpenShift version', value: '4.16.3' },
            { label: 'Region', value: 'us-east-1' },
            { label: 'Dashboard version', value: 'v2.14.0' },
          ].map((r) => (
            <div className="settings-row" key={r.label}>
              <div>
                <div className="settings-row-label">{r.label}</div>
              </div>
              <span style={{ fontSize: 14, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                {r.value}
              </span>
            </div>
          ))}
        </div>

        {/* Feature Flags */}
        <div className="settings-section">
          <div className="settings-section-header">
            <div className="settings-section-title">Feature Flags</div>
            <div className="settings-section-desc">Enable or disable platform features</div>
          </div>
          {(
            [
              { key: 'modelServing', label: 'Model Serving', desc: 'Allow deploying models as REST endpoints' },
              { key: 'pipelines', label: 'Pipelines', desc: 'Kubeflow Pipelines v2 integration' },
              { key: 'notebooks', label: 'Jupyter Notebooks', desc: 'Spawn notebook servers per-project' },
              { key: 'modelRegistry', label: 'Model Registry', desc: 'Centralized model versioning and tracking' },
              { key: 'genAiStudio', label: 'Gen AI Studio', desc: 'Prompt playground and LLM evaluation tools' },
              { key: 'customRuntimes', label: 'Custom Serving Runtimes', desc: 'Let admins add custom model serving runtimes' },
            ] as { key: keyof typeof flags; label: string; desc: string }[]
          ).map((f) => (
            <div className="settings-row" key={f.key}>
              <div>
                <div className="settings-row-label">{f.label}</div>
                <div className="settings-row-desc">{f.desc}</div>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={flags[f.key]}
                  onChange={() => toggle(f.key)}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          ))}
        </div>

        {/* Notifications */}
        <div className="settings-section">
          <div className="settings-section-header">
            <div className="settings-section-title">Notifications</div>
            <div className="settings-section-desc">Alert destinations for platform events</div>
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-row-label">Slack webhook URL</div>
              <div className="settings-row-desc">Receive alerts in your Slack workspace</div>
            </div>
            <div className="form-field" style={{ alignItems: 'flex-end' }}>
              <input
                type="text"
                className="form-input"
                placeholder="https://hooks.slack.com/services/..."
                style={{ width: 280 }}
              />
            </div>
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-row-label">Alert email</div>
              <div className="settings-row-desc">Send critical alerts to this address</div>
            </div>
            <div className="form-field" style={{ alignItems: 'flex-end' }}>
              <input
                type="email"
                className="form-input"
                placeholder="ops-team@example.com"
                style={{ width: 280 }}
              />
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="settings-section" style={{ borderColor: 'var(--color-danger)' }}>
          <div className="settings-section-header" style={{ borderBottomColor: 'var(--color-danger)' }}>
            <div className="settings-section-title" style={{ color: 'var(--color-danger)' }}>Danger Zone</div>
            <div className="settings-section-desc">Irreversible actions — proceed with extreme caution</div>
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-row-label">Reset all dashboard configuration</div>
              <div className="settings-row-desc">Reverts all feature flags, notification settings, and custom runtimes to defaults</div>
            </div>
            <button className="btn" style={{ background: '#fff', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}>
              Reset config
            </button>
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-row-label">Remove this cluster from the dashboard</div>
              <div className="settings-row-desc">Disconnects this cluster. All project data remains on the cluster but will no longer appear here.</div>
            </div>
            <button className="btn" style={{ background: 'var(--color-danger)', color: '#fff', borderColor: 'var(--color-danger)' }}>
              Remove cluster
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
