import { useBooks } from "../context/BookContext";
import { useAuth } from "../context/AuthContext";
import TransactionForm from "../components/TransactionForm";
import TransactionHistory from "../components/TransactionHistory";

export default function Transactions() {
  const { books, transactions, recordTransaction } = useBooks();
  const { users, currentUser } = useAuth();

  const handleSubmit = (data) =>
    recordTransaction({ ...data, recordedBy: currentUser.name });

  return (
    <div>
      <h2>Transactions</h2>
      <TransactionForm books={books} users={users} onSubmit={handleSubmit} />
      <h3>Transaction History ({transactions.length})</h3>
      <TransactionHistory transactions={transactions} />
    </div>
  );
}