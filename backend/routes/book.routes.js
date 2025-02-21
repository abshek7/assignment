const express = require("express");
const bookController = require("../controllers/book.controller");

const router = express.Router();

router.get("/", bookController.getBooks); // GET all books with pagination
router.get("/all", bookController.getAllBooks); // GET all books (without pagination)
router.get("/:id", bookController.getBookById); // GET single book by ID
router.post("/", bookController.createBook); // CREATE a new book
router.put("/:id", bookController.updateBook); // UPDATE a book
router.delete("/:id", bookController.deleteBook); // DELETE a book

module.exports = router;
