import { useState } from "react";
import { isValidMembershipId, MEMBERSHIP_PREFIXES, useAuth } from "../context/AuthContext";

export default function Users() {
  const { users, currentUser, assignableRoles, canManage, addUser, updateUser, deleteUser } =
    useAuth();
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState("");

  const isAdmin = currentUser.role === "admin";
  const visibleUsers = isAdmin ? users : users.filter((u) => u.role !== "admin");

  const handleSubmit = (userData) => {
    const result = editingUser ? updateUser(editingUser.id, userData) : addUser(userData);
    if (result) {
      setError(result);
      return;
    }
    setError("");
    setEditingUser(null);
  };

  const handleDelete = (user) => {
    if (!window.confirm(`Delete user "${user.name}"?`)) return;
    const result = deleteUser(user.id);
    if (result) {
      setError(result);
      return;
    }
    setError("");
    if (editingUser?.id === user.id) setEditingUser(null);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <h2>User Management</h2>
      {error && <p className="error">{error}</p>}
      <UserForm
        key={editingUser?.id ?? "new-user"}
        users={users}
        editingUser={editingUser}
        roles={assignableRoles}
        lockRole={editingUser?.id === currentUser.id}
        onSubmit={handleSubmit}
        onCancel={() => setEditingUser(null)}
      />
      <h3>All Users ({visibleUsers.length})</h3>
      <UserTable
        users={visibleUsers}
        currentUserId={currentUser.id}
        canManage={canManage}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

const EMPTY_USER = { name: "", membershipId: "", role: "member" };

function UserForm({ users, editingUser, roles, lockRole, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    editingUser ? { ...editingUser } : { ...EMPTY_USER, role: roles[0] ?? "member" }
  );
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setErrors({ ...errors, [event.target.name]: "" });
  };

  const validate = () => {
    const nextErrors = {};
    const name = form.name.trim();
    const memberId = form.membershipId.trim();

    if (!name) {
      nextErrors.name = "Name is required.";
    } else if (
      users.some((user) => user.name.toLowerCase() === name.toLowerCase() && user.id !== editingUser?.id)
    ) {
      nextErrors.name = "A user with this name already exists.";
    }

    if (!memberId) {
      nextErrors.membershipId = "Membership ID is required.";
    } else if (
      users.some(
        (user) =>
          user.membershipId.toLowerCase() === memberId.toLowerCase() &&
          user.id !== editingUser?.id
      )
    ) {
      nextErrors.membershipId = "This membership ID is already in use.";
    } else if (!isValidMembershipId(form.role, memberId)) {
      nextErrors.membershipId = `Use an ID beginning with ${MEMBERSHIP_PREFIXES[form.role]}001 for this role.`;
    }

    if (!roles.includes(form.role)) nextErrors.role = "Select a valid role.";
    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    onSubmit({
      name: form.name.trim(),
      membershipId: form.membershipId.trim().toUpperCase(),
      role: form.role,
    });
    setForm({ ...EMPTY_USER, role: roles[0] ?? "member" });
  };

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <h3>{editingUser ? "Update User" : "Add New User"}</h3>
      <div className="form-grid">
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="membershipId">Membership ID</label>
          <input
            id="membershipId"
            name="membershipId"
            value={form.membershipId}
            onChange={handleChange}
          />
          {errors.membershipId && <p className="field-error">{errors.membershipId}</p>}
        </div>
        <div>
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
            disabled={lockRole || roles.length === 1}
          >
            {roles.map((role) => (
              <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
            ))}
          </select>
          {lockRole && <p className="hint">You can't change your own role.</p>}
          {errors.role && <p className="field-error">{errors.role}</p>}
        </div>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn">{editingUser ? "Save Changes" : "Add User"}</button>
        {editingUser && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
}

const USER_GROUPS = [
  { role: "admin", label: "Admins" },
  { role: "librarian", label: "Librarians" },
  { role: "member", label: "Members" },
];

function UserTable({ users, currentUserId, canManage, onEdit, onDelete }) {
  if (users.length === 0) {
    return <p>No users to show.</p>;
  }

  return (
    <>
      {USER_GROUPS.map(({ role, label }) => {
        const groupUsers = users.filter((user) => user.role === role);
        if (groupUsers.length === 0) return null;

        return (
          <section key={role} className="category-section user-group">
            <h3 className="category-title">
              {label} <span>({groupUsers.length})</span>
            </h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Membership ID</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {groupUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        {user.name}
                        {user.id === currentUserId && <span className="you-tag"> (you)</span>}
                      </td>
                      <td>{user.membershipId}</td>
                      <td className="actions">
                        {canManage(user.role) ? (
                          <>
                            <button className="btn btn-small" onClick={() => onEdit(user)}>
                              Update
                            </button>
                            <button
                              className="btn btn-small btn-danger"
                              onClick={() => onDelete(user)}
                              disabled={user.id === currentUserId}
                              title={
                                user.id === currentUserId
                                  ? "You can't delete your own account"
                                  : ""
                              }
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          <span className="hint">View only</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </>
  );
}