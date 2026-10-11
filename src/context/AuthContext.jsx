import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { ROLE_PERMISSIONS } from "../data/roles";

const AuthContext = createContext(null);

const DEFAULT_USERS = [
  { id: 1, name: "Khopotso", membershipId: "ADMIN001", role: "admin" },
  { id: 2, name: "David", membershipId: "LIB001", role: "librarian" },
  { id: 3, name: "Carol", membershipId: "MEM001", role: "member" },
];

export const MEMBERSHIP_PREFIXES = {
  admin: "ADMIN",
  librarian: "LIB",
  member: "MEM",
};

export function isValidMembershipId(role, membershipId) {
  const prefix = MEMBERSHIP_PREFIXES[role];
  return Boolean(prefix && new RegExp(`^${prefix}\\d{3,}$`, "i").test(membershipId));
}

function mergeDefaultUsers(storedUsers, defaultUsers) {
  if (!Array.isArray(storedUsers)) return defaultUsers;

  const mergedUsers = storedUsers.map((user) => ({ ...user }));
  const defaultAccounts = new Set();
  let nextId = Math.max(0, ...mergedUsers.map((user) => Number(user.id) || 0)) + 1;

  for (const defaultUser of defaultUsers) {
    const matchingName = mergedUsers.find(
      (user) => String(user.name ?? "").toLowerCase() === defaultUser.name.toLowerCase()
    );
    const matchingMembershipId = mergedUsers.find(
      (user) => String(user.membershipId ?? "").toLowerCase() === defaultUser.membershipId.toLowerCase()
    );

    if (matchingName) {
      matchingName.name = defaultUser.name;
      matchingName.membershipId = defaultUser.membershipId;
      matchingName.role = defaultUser.role;
      defaultAccounts.add(matchingName);
    } else if (matchingMembershipId) {
      matchingMembershipId.name = defaultUser.name;
      matchingMembershipId.membershipId = defaultUser.membershipId;
      matchingMembershipId.role = defaultUser.role;
      defaultAccounts.add(matchingMembershipId);
    } else {
      const newDefaultUser = { ...defaultUser, id: nextId++ };
      mergedUsers.push(newDefaultUser);
      defaultAccounts.add(newDefaultUser);
    }
  }

  const usedMembershipIds = new Set(defaultUsers.map((user) => user.membershipId));
  for (const user of mergedUsers) {
    if (defaultAccounts.has(user)) continue;

    const prefix = MEMBERSHIP_PREFIXES[user.role];
    if (!prefix) continue;

    const membershipId = String(user.membershipId ?? "").trim().toUpperCase();
    if (isValidMembershipId(user.role, membershipId) && !usedMembershipIds.has(membershipId)) {
      user.membershipId = membershipId;
      usedMembershipIds.add(membershipId);
      continue;
    }

    let suffix = 1;
    let nextMembershipId = `${prefix}${String(suffix).padStart(3, "0")}`;
    while (usedMembershipIds.has(nextMembershipId)) {
      suffix += 1;
      nextMembershipId = `${prefix}${String(suffix).padStart(3, "0")}`;
    }
    user.membershipId = nextMembershipId;
    usedMembershipIds.add(nextMembershipId);
  }

  return mergedUsers;
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useLocalStorage(
    "users",
    DEFAULT_USERS,
    mergeDefaultUsers,
    "role-membership-ids-v2"
  );
  const [currentUser, setCurrentUser] = useLocalStorage("currentUser", null);

  const assignableRoles = ROLE_PERMISSIONS[currentUser?.role] ?? [];
  const canManage = (role) => assignableRoles.includes(role);

  const login = (name, membershipId) => {
    const normalizedName = name.trim().toLowerCase();
    const normalizedMembershipId = membershipId.trim().toLowerCase();
    const found = users.find(
      (u) =>
        u.name.toLowerCase() === normalizedName &&
        u.membershipId.toLowerCase() === normalizedMembershipId
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
    if (!isValidMembershipId(user.role, user.membershipId)) {
      return `Membership ID must start with ${MEMBERSHIP_PREFIXES[user.role]}001.`;
    }
    setUsers((prev) => [
      ...prev,
      { ...user, membershipId: user.membershipId.trim().toUpperCase(), id: Date.now() },
    ]);
    return null;
  };

  const updateUser = (id, updates) => {
    const target = users.find((u) => u.id === id);
    if (!target) return "User not found.";
    if (!canManage(target.role) || !canManage(updates.role)) {
      return "You are not allowed to change this user.";
    }
    if (!isValidMembershipId(updates.role, updates.membershipId)) {
      return `Membership ID must start with ${MEMBERSHIP_PREFIXES[updates.role]}001.`;
    }
    const normalizedUpdates = { ...updates, membershipId: updates.membershipId.trim().toUpperCase() };
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...normalizedUpdates } : u)));
    if (currentUser && currentUser.id === id) {
      setCurrentUser({ ...currentUser, ...normalizedUpdates });
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