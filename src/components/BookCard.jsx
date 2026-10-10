export default function BookCard({ book }) {
  const isOut = book.quantity === 0;
  const isLow = book.quantity < 2;

  return (
    <div className={`book-card ${isLow ? "low-stock" : ""}`}>
      <div className="book-card-header">
        <h3>{book.title}</h3>
        {isLow && (
          <span className="badge badge-low">{isOut ? "Out of stock" : "Low stock"}</span>
        )}
      </div>
      <p className="book-meta">{book.author}</p>
      <p className="book-meta">{book.genre} · ISBN {book.isbn}</p>
      <p className="book-qty">
        {book.quantity} <span>{book.quantity === 1 ? "copy" : "copies"} available</span>
      </p>
    </div>
  );
}
