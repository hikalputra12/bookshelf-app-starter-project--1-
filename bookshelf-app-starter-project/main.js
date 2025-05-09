window.addEventListener('DOMContentLoaded', () => {
  const bookFormTitle = document.getElementById("bookFormTitle");
  const bookFormAuthor = document.getElementById("bookFormAuthor");
  const bookFormYear = document.getElementById("bookFormYear");
  const bookFormSubmit = document.getElementById("bookFormSubmit");
  const  bookForm = document.getElementById("bookForm");

  bookForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addBook();
  });

  const books = [];
  const RENDER_EVENT = 'render-book';

  function generateId() { //mentod membuat ID secara random
    return +new Date();
  }
  function generateBookObject(id, title, author, year) { //method untuk membuat objek buku
    return {
      id,
      title,
      author,
      year,
      isCompleted: false
    };
  };
  function addBook () {
    const bookId = generateId();
    const bookTitle = bookFormTitle.value;
    const bookAuthor = bookFormAuthor.value;
    const bookYear = bookFormYear.value;
    const bookObject = generateBookObject(bookId, bookTitle, bookAuthor, bookYear);
    books.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
  };
  function findBook(bookId){
    for (const bookItem of books){
      if (bookItem.id = bookId){
        return bookItem;
      }
      return null;
    };
  };
  function addBookToComplate(bookId){
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  };
  function undoBookFromComplate(bookId){
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
};
  function removeTaskFromCompleted(bookId) {
    const bookIndex = books.findIndex(book => book.id === bookId);
    if (bookIndex !== -1) {
      books.splice(bookIndex, 1);
      document.dispatchEvent(new Event(RENDER_EVENT));
    };
  }
  function makeBook(bookObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;
  textTitle.setAttribute('data-testid', 'bookItemTitle');

  const writerBook = document.createElement("p");
  writerBook.innerText = `Penulis: ${bookObject.author}`;
  writerBook.setAttribute('data-testid', 'bookItemAuthor');

  const yearBook = document.createElement("p");
  yearBook.innerText = `Tahun: ${bookObject.year}`;
  yearBook.setAttribute('data-testid', 'bookItemYear');

  const textContainer = document.createElement('div');
  textContainer.classList.add('book-item');
  textContainer.setAttribute('data-bookid', bookObject.id);
  textContainer.setAttribute('data-testid', 'bookItem');
  textContainer.append(textTitle, writerBook, yearBook);

  const buttonContainer = document.createElement('div');

  const trashButton = document.createElement('button');
  trashButton.innerText = "Hapus Buku";
  trashButton.addEventListener('click', function () {
    removeTaskFromCompleted(bookObject.id);
  });
  trashButton.setAttribute('data-testid', 'bookItemDeleteButton');
  buttonContainer.append(trashButton);

  if (bookObject.isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.innerText = "Belum Selesai Dibaca";
    undoButton.addEventListener('click', function () {
      undoBookFromComplate(bookObject.id);
    });
    undoButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
    buttonContainer.append(undoButton);
  } else {
    const checkButton = document.createElement('button');
    checkButton.innerText = "Selesai Dibaca";
    checkButton.addEventListener('click', function () {
      addBookToComplate(bookObject.id);
    });
    checkButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
    buttonContainer.append(checkButton);
  }

  // Optional: tombol edit jika ingin ditambahkan
  const editButton = document.createElement('button');
  editButton.innerText = "Edit Buku";
  editButton.setAttribute('data-testid', 'bookItemEditButton');
  buttonContainer.append(editButton);

  textContainer.append(buttonContainer);

  return textContainer;
};

  document.addEventListener(RENDER_EVENT, function() {
    const uncompletedBookList = document.getElementById('incompleteBookList');
    uncompletedBookList.innerHTML = '';
    const completedBookList = document.getElementById('completeBookList');
    completedBookList.innerHTML = '';

    for (const bookItem of books) {
      const bookElement = makeBook(bookItem);
      if (!bookItem.isCompleted) {
        uncompletedBookList.append(bookElement);
      } else {
        completedBookList.append(bookElement);
      }
    }
  });
});

