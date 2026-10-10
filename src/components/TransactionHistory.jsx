export default function TransactionHistory({ transactions }) {
  if (transactions.length === 0) {
    return <p>No transactions recorded yet.</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Book</th>
            <th>Type</th>
            <th>Qty</th>
            <th>Member</th>
            <th>Recorded by</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{new Date(t.date).toLocaleString()}</td>
              <td>{t.bookTitle}</td>
              <td>
                <span className={`badge ${t.type === "add" ? "badge-add" : "badge-borrow"}`}>
                  {t.type === "add" ? "Stock added" : "Borrowed"}
                </span>
              </td>
              <td>{t.type === "add" ? `+${t.quantity}` : `-${t.quantity}`}</td>
              <td>{t.member || "-"}</td>
              <td>{t.recordedBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}