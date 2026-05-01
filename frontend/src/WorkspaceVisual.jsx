function WorkspaceVisual() {
  return (
    <div className="workspace-visual workspace-preview" aria-hidden="true">
      <div className="visual-topbar">
        <span />
        <span />
        <span />
      </div>
      <div className="visual-grid">
        <div className="visual-sidebar">
          <span className="visual-logo" />
          <span />
          <span />
          <span />
        </div>
        <div className="visual-main">
          <div className="visual-chart-card">
            <div>
              <span>Flujo semanal</span>
              <strong>86%</strong>
            </div>
            <div className="visual-bars">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="visual-kanban">
            <div>
              <strong>Plan</strong>
              <span />
              <span />
            </div>
            <div>
              <strong>Proceso</strong>
              <span />
              <span />
            </div>
            <div>
              <strong>Listo</strong>
              <span />
              <span />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkspaceVisual;
