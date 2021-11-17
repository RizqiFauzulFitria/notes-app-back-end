/* eslint-disable max-len */
/* eslint linebreak-style: ["error", "windows"] */
/* eslint no-multiple-empty-lines: "off" */

const { nanoid } = require('nanoid');
const { fullBooks, sumBooks } = require('./books');


// Kriteria 1
const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  // before : createdAt || after : insertedAt
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  let finished = false;

  if (pageCount !== readPage) {
    finished = false;
  } else {
    finished = true;
  }

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
  };


  // logika dbawah ini harus diletakkan sebelum fungsi fullBooks.push(newBook);
  // before : name.length < 1
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const newSumBook = {
    id, name, publisher,
  };

  fullBooks.push(newBook);
  sumBooks.push(newSumBook);


  if (name.length > 0 && readPage <= pageCount) {
    const isSuccess = fullBooks.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }
  }


  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// Kriteria 2
const getAllBooksHandler = (request, h) => {
  const books = sumBooks;

  const response = h.response({
    status: 'success',
    data: {
      books,
    },
  });
  response.code(200)
  return response;
};

// Kriteria 3
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = fullBooks.filter((thisBook) => thisBook.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };    
  };

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Kriteria 4
const editBookByIdHandler = (request, h) => {
  // const { id } = request.params;
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = fullBooks.findIndex((book) => book.id === bookId);

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    fullBooks[index] = {
      ...fullBooks[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Kriteria 5
const deleteBookByIdHandler = (request, h) => {
  // const { id } = request.params;
  const { bookId } = request.params;

  const index = fullBooks.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    fullBooks.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
