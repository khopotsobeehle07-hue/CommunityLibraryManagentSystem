import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const BooksContext = createContext(null);

const SAMPLE_BOOKS = [
  { id: 1, title: "Things Fall Apart", author: "Chinua Achebe", genre: "Fiction", isbn: "9780385474542", quantity: 5 },
  { id: 2, title: "Clean Code", author: "Robert C. Martin", genre: "Technology", isbn: "9780132350884", quantity: 1 },
  { id: 3, title: "A Brief History of Time", author: "Stephen Hawking", genre: "Science", isbn: "9780553380163", quantity: 3 },
];

export function BooksProvider({ children }) {
  const [books, setBooks] = useLocalStorage("books", SAMPLE_BOOKS);
  const [transactions, setTransactions] = useLocalStorage("transactions", []);

  const addBook = (book) =>
    setBooks((prev) => [...prev, { ...book, id: Date.now() }]);

  const updateBook = (id, updates) =>
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));

  const deleteBook = (id) =>
    setBooks((prev) => prev.filter((b) => b.id !== id));

  const recordTransaction = ({ bookId, type, quantity, member, recordedBy }) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return "Book not found.";
    if (type === "borrow" && quantity > book.quantity) {
      return `Not enough stock. Only ${book.quantity} in stock.`;
    }

    const change = type === "add" ? quantity : -quantity;

    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, quantity: b.quantity + change } : b))
    );

    setTransactions((prev) => [
      {
        id: Date.now(),
        bookId,
        bookTitle: book.title,
        type,
        quantity,
        member: member || "",
        recordedBy,
        date: new Date().toISOString(),
      },
      ...prev,
    ]);

    return null;
  };

  return (
    <BooksContext.Provider
      value={{ books, addBook, updateBook, deleteBook, transactions, recordTransaction }}
    >
      {children}
    </BooksContext.Provider>
  );
}

export function useBooks() {
  return useContext(BooksContext);
}
