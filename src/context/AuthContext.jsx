import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { ROLE_PERMISSIONS } from "../data/roles";

const AuthContext = createContext(null);

const DEFAULT_USERS = [
  { id: 1, name: "Khopotso", membershipId: "ADMIN001", role: "admin" },
  { id: 2, name: "David", membershipId: "LIB001", role: "librarian" },
  { id: 3, name: "Carol", membershipId: "MEM001", role: "member" },
];

export function AuthProvider({ children }) {
  const [users, setUsers] = useLocalStorage("users", DEFAULT_USERS);
  const [currentUser, setCurrentUser] = useLocalStorage("currentUser", null);

  const assignableRoles = ROLE_PERMISSIONS[currentUser?.role] ?? [];
  const canManage = (role) => assignableRoles.includes(role);

  const login = (name, membershipId) => {
    const found = users.find(
      (u) =>
        u.name.toLowerCase() === name.trim().toLowerCase() &&
        u.membershipId.toLowerCase() === membershipId.trim().toLowerCase()
    );
    if (found) {
      setCurrentUser(found);
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);

  const addUser = (user) => {
    if (!canManage(user.role)) return "You are not allowed to add this role.";
    setUsers((prev) => [...prev, { ...user, id: Date.now() }]);
    return null;
  };

  const updateUser = (id, updates) => {
    const target = users.find((u) => u.id === id);
    if (!target) return "User not found.";
    if (!canManage(target.role) || !canManage(updates.role)) {
      return "You are not allowed to change this user.";
    }
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
    if (currentUser && currentUser.id === id) {
      setCurrentUser({ ...currentUser, ...updates });
    }
    return null;
  };

  const deleteUser = (id) => {
    const target = users.find((u) => u.id === id);
    if (!target || id === currentUser?.id || !canManage(target.role)) {
      return "You are not allowed to delete this user.";
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        users,
        currentUser,
        assignableRoles,
        canManage,
        login,
        logout,
        addUser,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}