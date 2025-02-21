import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";  
import { Link } from "react-router-dom"; 

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editBookId, setEditBookId] = useState(null);
  const [editBookData, setEditBookData] = useState({});
  const { toast } = useToast();

  const booksPerPage = 3; // Number of books per page
  const firstRender = useRef(true); // Track the first render

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const controller = new AbortController();
    const fetchBooks = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/books?page=${currentPage}&limit=${booksPerPage}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (!data.books || !Array.isArray(data.books) || typeof data.totalPages !== "number") {
          throw new Error("Invalid API response format");
        }

        setBooks(data.books);
        setTotalPages(data.totalPages);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching books:", error);
          toast({
            title: "Error",
            description: error.message || "Failed to fetch books. Please try again.",
            variant: "destructive",
          });
        }
      }
    };

    fetchBooks();

    return () => controller.abort();
  }, [currentPage, toast]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEdit = (book) => {
    setEditBookId(book._id);
    setEditBookData(book);
  };

  const handleInputChange = (e) => {
    setEditBookData({
      ...editBookData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      const { _id, __v, ...updateData } = editBookData;
      const originalBook = books.find(book => book._id === editBookId);
      if (!originalBook) return;
  
      const isDataChanged = Object.keys(updateData).some(key => originalBook[key] !== updateData[key]);
  
      if (!isDataChanged) {
        toast({ title: "No Changes", description: "No modifications were made.", variant: "default" });
        setEditBookId(null);
        return;
      }
  
      const response = await fetch(`http://localhost:5000/api/books/${editBookId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update book");
      }
  
      const updatedBook = await response.json();
  
      setBooks(books.map(book => (book._id === editBookId ? updatedBook : book)));
      setEditBookId(null);
      toast({ title: "Success", description: "Book updated successfully!", variant: "success" });
    } catch (error) {
      console.error("Error updating book:", error);
      toast({ title: "Error", description: error.message || "Failed to update book.", variant: "destructive" });
    }
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/books/${bookId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete book");
      }

      setBooks(books.filter(book => book._id !== bookId));
      toast({ title: "Deleted", description: "Book deleted successfully!", variant: "success" });
    } catch (error) {
      console.error("Error deleting book:", error);
      toast({ title: "Error", description: error.message || "Failed to delete book.", variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Book List</h1>
        <Link to="/">
          <Button variant="secondary">Go to Home</Button>
        </Link>
      </div>

      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {books.map((book, index) => (
              <li key={book._id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold">{book.title}</h2>
                    <p className="text-gray-600">Author: {book.author}</p>
                    <p className="text-gray-600">Serial No: {(currentPage - 1) * booksPerPage + index + 1}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="default" onClick={() => handleEdit(book)}>Edit</Button>
                    <Button variant="destructive" onClick={() => handleDelete(book._id)}>Delete</Button>
                  </div>
                </div>

                {editBookId === book._id && (
                  <div className="mt-4 border p-4 rounded-lg">
                    <h3 className="text-lg font-bold">Edit Book</h3>
                    <Input
                      type="text"
                      name="title"
                      value={editBookData.title}
                      onChange={handleInputChange}
                      placeholder="Book Title"
                      className="mt-2"
                    />
                    <Input
                      type="text"
                      name="author"
                      value={editBookData.author}
                      onChange={handleInputChange}
                      placeholder="Author"
                      className="mt-2"
                    />
                    <Input
                      type="text"
                      name="genre"
                      value={editBookData.genre}
                      onChange={handleInputChange}
                      placeholder="Genre"
                      className="mt-2"
                    />
                    <Button variant="default" onClick={handleUpdate} className="mt-2">
                      Save Changes
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <Button
                key={index + 1}
                variant={currentPage === index + 1 ? "default" : "outline"}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BookList;
