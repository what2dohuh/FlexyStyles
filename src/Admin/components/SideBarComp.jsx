import '../styles/Dashboard.css';

const Sidebar = ({ activeTab, setActiveTab, handleLogout }) => {
  return (
    <aside className="adm-sidebar">
      <div className="adm-logo">
        <h2>Admin Panel</h2>
      </div>
      <nav className="adm-nav">
        <button 
          className={`adm-nav-item ${activeTab === 'edit' ? 'active' : ''}`}
          onClick={() => setActiveTab('edit')}
        >
          <span className="adm-icon">📦</span>
          Edit Products
        </button>
        <button 
          className={`adm-nav-item ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          <span className="adm-icon">➕</span>
          Add New Product
        </button>
        <button 
          className={`adm-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <span className="adm-icon">📋</span>
          Orders
        </button>
      </nav>
      <div className="adm-sidebar-footer">
        <button className="adm-logout-btn" onClick={handleLogout}>
          <span className="adm-icon">🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;