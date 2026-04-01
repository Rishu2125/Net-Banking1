import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  RotateCcw,
  Users as UsersIcon,
  UserCheck,
  UserX,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Mail,
  Phone,
  MapPin,
  Landmark,
} from "lucide-react";
import "../AdminCss/AllUsers.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const loadUsers = () => {
    setLoading(true);
    setError("");

    axios
      .get("http://localhost:8080/admin/get-all-user")
      .then((res) => {
        const data = res.data?.data || res.data || [];
        setUsers(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setUsers([]);
        setError("Failed to load users");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSearch = () => {
    if (!search.trim()) {
      loadUsers();
      return;
    }

    setLoading(true);
    setError("");

    axios
      .get(`http://localhost:8080/admin/get-user/${search}`)
      .then((res) => {
        if (res.data?.data) {
          setUsers([res.data.data]);
        } else if (res.data) {
          setUsers([res.data]);
        } else {
          setUsers([]);
        }
      })
      .catch(() => {
        setUsers([]);
        setError("No user found for this account number");
      })
      .finally(() => setLoading(false));
  };

  const handleReset = () => {
    setSearch("");
    setError("");
    loadUsers();
  };

  const handleToggleStatus = (accountNumber) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.accountNumber === accountNumber
          ? {
              ...u,
              status:
                u.status?.toLowerCase() === "inactive" ? "active" : "inactive",
            }
          : u,
      ),
    );

    axios
      .patch(
        `http://localhost:8080/admin/deactivate-activate-user/${accountNumber}`,
      )
      .then((res) => {
        const updatedUser = res.data?.data;
        if (!updatedUser || !updatedUser.accountNumber) return;

        setUsers((prev) =>
          prev.map((u) =>
            u.accountNumber === updatedUser.accountNumber
              ? { ...u, status: updatedUser.status }
              : u,
          ),
        );
      })
      .catch(() => {
        setError("Failed to update user status");
        loadUsers();
      });
  };

  const getStatusClass = (status) => {
    if (!status) return "inactive";
    return status.toLowerCase() === "active" ? "active" : "inactive";
  };

  const getLockClass = (locked) => {
    return locked ? "locked" : "unlocked";
  };

  return (
    <div className="users-page">
      <div className="users-card">
        <div className="users-header">
          <div className="users-title-wrap">
            <div className="users-icon-box">
              <UsersIcon size={28} />
            </div>
            <div>
              <h2>Customer Management</h2>
              <p>Search, review, and manage all registered bank users</p>
            </div>
          </div>
        </div>

        <div className="search-panel">
          <div className="search-input-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Enter account number"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="search-btn" onClick={handleSearch}>
            <Search size={18} />
            Search
          </button>

          <button className="reset-btn" onClick={handleReset}>
            <RotateCcw size={18} />
            Reset
          </button>
        </div>

        {error && <div className="users-error">{error}</div>}

        <div className="users-summary">
          <div className="summary-box">
            <span>Total Records</span>
            <strong>{users.length}</strong>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Account</th>
                <th>Role</th>
                <th>Status</th>
                <th>Locked</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="empty-row">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="9" className="empty-row">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id || u.accountNumber}>
                    <td>{u.id}</td>

                    <td>
                      <div className="user-name-cell">
                        <strong>
                          {[u.firstName, u.middleName, u.lastName]
                            .filter(Boolean)
                            .join(" ")}
                        </strong>
                      </div>
                    </td>

                    <td>
                      <div className="info-stack">
                        <span>
                          <Mail size={14} />
                          {u.emailId || "-"}
                        </span>
                        <span>
                          <Phone size={14} />
                          {u.phoneNumber || "-"}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="info-stack">
                        <span>
                          <MapPin size={14} />
                          {[u.city, u.state].filter(Boolean).join(", ") || "-"}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="account-cell">
                        <Landmark size={14} />
                        <span>{u.accountNumber}</span>
                      </div>
                    </td>

                    <td>
                      <span className="role-badge">{u.role || "-"}</span>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${getStatusClass(u.status)}`}
                      >
                        {u.status?.toLowerCase() === "active" ? (
                          <UserCheck size={16} />
                        ) : (
                          <UserX size={16} />
                        )}
                        {u.status}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`lock-badge ${getLockClass(u.accountLocked)}`}
                      >
                        {u.accountLocked ? (
                          <Lock size={16} />
                        ) : (
                          <Unlock size={16} />
                        )}
                        {u.accountLocked ? "Locked" : "Unlocked"}
                      </span>
                    </td>

                    <td>
                      <button
                        className={
                          u.status?.toLowerCase() === "inactive"
                            ? "activate-btn"
                            : "deactivate-btn"
                        }
                        onClick={() => handleToggleStatus(u.accountNumber)}
                      >
                        {u.status?.toLowerCase() === "inactive" ? (
                          <>
                            <ShieldCheck size={16} />
                            Activate
                          </>
                        ) : (
                          <>
                            <ShieldAlert size={16} />
                            Deactivate
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Users;
