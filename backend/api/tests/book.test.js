const request = require('supertest');
const mongoose = require('mongoose');
const Book = require('../models/Book');
const app = require('../app');

// Test Data
const bookData = {
  title: 'Test Book',
  author: 'John Doe',
  publishedDate: '2023-05-12',
  genre: 'Fiction',
};

describe('Book API', () => {
  let bookId;

  // Ensure test cleanup after each test
  afterEach(async () => {
    if (bookId) {
      await Book.findByIdAndDelete(bookId);
      bookId = null; // Prevent duplicate deletion attempts
    }
  });

  // Close DB connection after all tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should create a new book', async () => {
    const res = await request(app).post('/api/books').send(bookData);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe(bookData.title);

    bookId = res.body._id; // Store the ID for cleanup
  });

  test('should get all books', async () => {
    const createdBook = await Book.create(bookData);

    const res = await request(app).get('/api/books');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.books)).toBeTruthy();
    expect(res.body.books.length).toBeGreaterThan(0);

    bookId = createdBook._id; // Store ID for cleanup
  });

  test('should get a book by ID', async () => {
    const createdBook = await Book.create(bookData);
    bookId = createdBook._id;

    const res = await request(app).get(`/api/books/${bookId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', bookId.toString());
  });

  test('should update a book', async () => {
    const createdBook = await Book.create(bookData);
    bookId = createdBook._id;

    const updatedData = { title: 'Updated Book Title' };
    const res = await request(app).put(`/api/books/${bookId}`).send(updatedData);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(updatedData.title);
  });

  test('should delete a book', async () => {
    const createdBook = await Book.create(bookData);
    bookId = createdBook._id;

    const res = await request(app).delete(`/api/books/${bookId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Book deleted');

    // Verify book is deleted
    const checkBook = await request(app).get(`/api/books/${bookId}`);
    expect(checkBook.statusCode).toBe(404);

    bookId = null; // Prevent afterEach from trying to delete again
  });
});
