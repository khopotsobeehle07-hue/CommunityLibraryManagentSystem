import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const BooksContext = createContext(null);

const SAMPLE_BOOKS = [
  { id: 1, title: "Things Fall Apart", author: "Chinua Achebe", genre: "Fiction", isbn: "9780385474542", quantity: 5 },
  { id: 2, title: "Clean Code", author: "Robert C. Martin", genre: "Technology", isbn: "9780132350884", quantity: 11 },
  { id: 3, title: "A Brief History of Time", author: "Stephen Hawking", genre: "Science", isbn: "9780553380163", quantity: 3 },
  { id: 4, title: "The Narrow Path", author: "Francis Selormey", genre: "Fiction", isbn: "9780000000004", quantity: 43 },
  { id: 5, title: "Hello Sweet Baby", author: "Bruce and Carol Britten", genre: "Fiction", isbn: "9780000000011", quantity: 2 },
  { id: 6, title: "The Ninja", author: "James Vance Marshall", genre: "Fiction", isbn: "9780000000028", quantity: 3 },
  { id: 7, title: "Chaka", author: "Thomas Mofolo", genre: "Historical Fiction", isbn: "9780000000035", quantity: 67 },
  { id: 8, title: "Weep Not, Child", author: "Ngũgĩ wa Thiong'o", genre: "Fiction", isbn: "9780000000042", quantity: 5 },
  { id: 9, title: "Walkabout", author: "James Vance Marshall", genre: "Adventure", isbn: "9780141957814", quantity: 17 },
  { id: 10, title: "Half of a Yellow Sun", author: "Chimamanda Ngozi Adichie", genre: "Historical Fiction", isbn: "9780000000059", quantity: 64 },
  { id: 11, title: "So Long a Letter", author: "Mariama Bâ", genre: "Fiction", isbn: "9780000000066", quantity: 34 },
  { id: 12, title: "Nervous Conditions", author: "Tsitsi Dangarembga", genre: "Fiction", isbn: "9780000000073", quantity: 2 },
  { id: 13, title: "Cry, the Beloved Country", author: "Alan Paton", genre: "Fiction", isbn: "9780000000080", quantity: 58 },
];

function addMissingSampleBooks(storedBooks, sampleBooks) {
  if (!Array.isArray(storedBooks)) return sampleBooks;

  const mergedBooks = [...storedBooks];
  let nextId = Math.max(
    0,
    ...mergedBooks.map((book) => Number(book.id) || 0),
    ...sampleBooks.map((book) => book.id)
  ) + 1;

  for (const sampleBook of sampleBooks) {
    const alreadyExists = mergedBooks.some((book) => book.isbn === sampleBook.isbn);
    if (alreadyExists) continue;

    const idIsTaken = mergedBooks.some((book) => book.id === sampleBook.id);
    mergedBooks.push(idIsTaken ? { ...sampleBook, id: nextId++ } : sampleBook);
  }

  return mergedBooks;
}

export function BooksProvider({ children }) {
  const [books, setBooks] = useLocalStorage("books", SAMPLE_BOOKS, addMissingSampleBooks);
  const [transactions, setTransactions] = useLocalStorage("transactions", []);

  const addBook = (book) =>
    setBooks((prev) => [...prev, { ...book, id: Date.now() }]);

  const updateBook = (id, updates) =>
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));

  const deleteBook = (id) =>
    setBooks((prev) => prev.filter((b) => b.id !== id));

  // Returns an error message string, or null on success
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
      ...prev, // newest first
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