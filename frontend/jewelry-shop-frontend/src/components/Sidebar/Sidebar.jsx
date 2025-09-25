import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  Users, 
  Package, 
  Store, 
  CreditCard,
  ChevronRight
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      exact: true
    },
    {
      path: '/transactions',
      label: 'Transactions',
      icon: CreditCard
    },
    {
      path: '/bills',
      label: 'Bills',
      icon: Receipt
    },
    {
      path: '/items',
      label: 'Items',
      icon: Package
    },
    {
      path: '/shops',
      label: 'Shops',
      icon: Store
    },
    {
      path: '/customers',
      label: 'Customers',
      icon: Users
    }
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <Package className="logo-icon" />
          <span className="logo-text">Jewelry Shop Entry Tracker</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item) ? 'active' : ''}`}
            >
              <Icon className="nav-icon" size={20} />
              <span className="nav-label">{item.label}</span>
              <ChevronRight className="nav-arrow" size={16} />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;