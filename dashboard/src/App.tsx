import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Models from './pages/Models';
import Settings from './pages/Settings';

const pageTitles: Record<string, string> = {
  '/': 'Home',
  '/projects': 'Projects',
  '/models': 'Model Serving',
  '/settings': 'Settings',
};

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-logo">AI</div>
        <div>
          <div className="sidebar-brand-name">AI Platform</div>
          <div className="sidebar-brand-sub">Open Data Hub</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Overview</div>
        <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <span className="nav-icon">⊞</span> Home
        </NavLink>

        <div className="nav-section-label">Workloads</div>
        <NavLink to="/projects" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <span className="nav-icon">◫</span> Projects
        </NavLink>
        <NavLink to="/models" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <span className="nav-icon">⬡</span> Model Serving
        </NavLink>

        <div className="nav-section-label">Administration</div>
        <NavLink to="/settings" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <span className="nav-icon">⚙</span> Settings
        </NavLink>
      </nav>

      <div className="sidebar-footer">v2.14.0 · demo</div>
    </aside>
  );
}

function Topbar() {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] ?? 'Dashboard';
  return (
    <header className="topbar">
      <span className="topbar-title">{title}</span>
      <div className="topbar-right">
        <div className="avatar">AS</div>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Sidebar />
        <div className="main-content">
          <Topbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/models" element={<Models />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
