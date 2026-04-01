import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Landmark,
  ArrowLeftRight,
  Wallet,
  UserCog,
  Bell,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import "../AdminCss/AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const logout = () => {
    // Clear all stored data
    localStorage.clear();

    // Optional: clear specific keys instead
    // localStorage.removeItem("token");
    // localStorage.removeItem("accountNumber");

    // Redirect to login page
    navigate("/login");
  };
  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-top">
          <div className="brand-box">
            <div className="brand-icon">
              <Landmark size={22} />
            </div>
            <div>
              <h2>Neo Bank</h2>
              <p>Admin Portal</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/loans"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Landmark size={18} />
            <span>Loans</span>
          </NavLink>

          <NavLink
            to="/all-users"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Users size={18} />
            <span>Users</span>
          </NavLink>

          <NavLink
            to="/all-transactions"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <ArrowLeftRight size={18} />
            <span>Transactions</span>
          </NavLink>

          <NavLink
            to="/user-balance"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Wallet size={18} />
            <span>User Balance</span>
          </NavLink>

          <NavLink
            to="/profile-management"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <UserCog size={18} />
            <span>Profile Management</span>
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <div className="security-box">
            <ShieldCheck size={18} />
            <div>
              <strong>Secure Access</strong>
              <p>Admin actions are monitored</p>
            </div>
          </div>

          <button className="logout-btn" onClick={logout}>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Section */}
      <div className="admin-main">
        <header className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Monitor and manage banking operations</p>
          </div>

          <div className="header-right">
            <button className="notification-btn">
              <Bell size={18} />
            </button>

            <div className="admin-profile-box">
              <div className="admin-avatar">A</div>
              <div>
                <h4>Admin User</h4>
                <p>System Administrator</p>
              </div>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
