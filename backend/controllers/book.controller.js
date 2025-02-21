const Book = require("../models/Book");
const Joi = require("joi");

// Validation schema for book creation
const bookSchema = Joi.object({
  title: Joi.string().trim().required(),
  author: Joi.string().trim().required(),
  publishedDate: Joi.date().iso().required(),
  genre: Joi.string().trim().required(),
});

// Validation schema for book update (all fields optional)
const updateBookSchema = Joi.object({
  title: Joi.string().trim(),
  author: Joi.string().trim(),
  publishedDate: Joi.date().iso(),
  genre: Joi.string().trim(),
});

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get books with pagination
exports.getBooks = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 5);
    const skip = (page - 1) * limit;

    const books = await Book.find().skip(skip).limit(limit);
    const totalBooks = await Book.countDocuments();

    res.status(200).json({
      books,
      currentPage: page,
      totalPages: Math.ceil(totalBooks / limit),
      totalBooks,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new book
exports.createBook = async (req, res) => {
  const { error } = bookSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    // Check if a book with the same details exists
    const existingBook = await Book.findOne(req.body);
    if (existingBook) {
      return res.status(400).json({ message: "A book with the same details already exists." });
    }

    // Create and save the book
    const book = new Book(req.body);
    const savedBook = await book.save();

    res.status(201).json(savedBook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a book
exports.updateBook = async (req, res) => {
  const { error } = updateBookSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Returns the updated document
      runValidators: true, // Ensures validation is applied
    });

    if (!updatedBook) return res.status(404).json({ message: "Book not found" });

    res.status(200).json(updatedBook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
