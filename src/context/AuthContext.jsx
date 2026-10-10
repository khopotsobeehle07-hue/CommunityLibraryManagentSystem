import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const AuthContext = createContext(null);

const DEFAULT_USERS = [
  { id: 1, name: "Admin", membershipId: "ADMIN001", role: "admin" },
];

export function AuthProvider({ children }) {
  const [users, setUsers] = useLocalStorage("users", DEFAULT_USERS);
  const [currentUser, setCurrentUser] = useLocalStorage("currentUser", null);

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

  const addUser = (user) =>
    setUsers((prev) => [...prev, { ...user, id: Date.now() }]);

  const updateUser = (id, updates) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
    if (currentUser && currentUser.id === id) {
      setCurrentUser({ ...currentUser, ...updates });
    }
  };

  const deleteUser = (id) =>
    setUsers((prev) => prev.filter((u) => u.id !== id));

  return (
    <AuthContext.Provider
      value={{ users, currentUser, login, logout, addUser, updateUser, deleteUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
