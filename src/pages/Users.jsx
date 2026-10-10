import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import UserForm from "../components/UserForm";
import UserTable from "../components/UserTable";

export default function Users() {
  const { users, currentUser, addUser, updateUser, deleteUser } = useAuth();
  const [editingUser, setEditingUser] = useState(null);

  const handleSubmit = (userData) => {
    if (editingUser) {
      updateUser(editingUser.id, userData);
      setEditingUser(null);
    } else {
      addUser(userData);
    }
  };

  const handleDelete = (user) => {
    if (window.confirm(`Delete user "${user.name}"?`)) {
      deleteUser(user.id);
      if (editingUser?.id === user.id) setEditingUser(null);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <h2>User Management</h2>
      <UserForm
        key={editingUser ? editingUser.id : "new-user"}
        users={users}
        editingUser={editingUser}
        lockRole={editingUser?.id === currentUser.id}
        onSubmit={handleSubmit}
        onCancel={() => setEditingUser(null)}
      />
      <h3>All Users ({users.length})</h3>
      <UserTable
        users={users}
        currentUserId={currentUser.id}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}