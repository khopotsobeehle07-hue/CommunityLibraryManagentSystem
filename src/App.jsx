import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navigationbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Transactions from "./pages/Transactions";
import Users from "./pages/Users";
import Login from "./pages/Login";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route
            path="/books"
            element={<ProtectedRoute roles={["admin", "librarian"]}><Books /></ProtectedRoute>}
          />
          <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
          <Route
            path="/users"
            element={<ProtectedRoute roles={["admin"]}><Users /></ProtectedRoute>}
          />
        </Routes>
      </main>
    </>
  );
}