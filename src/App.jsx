import { Routes, Route } from "react-router-dom";
import Navbar from "./components/NavigationBar";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/DashBoard";
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
          <Route path="/books" element={<ProtectedRoute><Books /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute adminOnly><Users /></ProtectedRoute>} />
        </Routes>
      </main>
    </>
  );
}