export default function BookTable({ books, onEdit, onDelete }) {
  if (books.length === 0) {
    return <p>No books yet. Add one using the form above.</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>ISBN</th>
            <th>Qty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.genre}</td>
              <td>{book.isbn}</td>
              <td>{book.quantity}</td>
              <td className="actions">
                <button className="btn btn-small" onClick={() => onEdit(book)}>Update</button>
                <button className="btn btn-small btn-danger" onClick={() => onDelete(book)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}