import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import UserForm from "../components/UserForm";
import UserTable from "../components/UserTable";

export default function Users() {
  const { users, currentUser, assignableRoles, canManage, addUser, updateUser, deleteUser } =
    useAuth();
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState("");

  const isAdmin = currentUser.role === "admin";
  const visibleUsers = isAdmin ? users : users.filter((u) => u.role === "member");

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
      <h2>{isAdmin ? "User Management" : "Member Management"}</h2>
      {error && <p className="error">{error}</p>}
      <UserForm
        users={users}
        editingUser={editingUser}
        roles={assignableRoles}
        lockRole={editingUser?.id === currentUser.id}
        onSubmit={handleSubmit}
        onCancel={() => setEditingUser(null)}
      />
      <h3>{isAdmin ? "All Users" : "All Members"} ({visibleUsers.length})</h3>
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