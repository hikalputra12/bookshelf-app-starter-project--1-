//menambhakan event listener pada window terlebih dahulu event di bawah terjadi ketika browser sebelum mengunduh semua berkas yang di perlukan
document.addEventListener('DOMContentLoaded', () => {
  //menambahkan data ke local storage
  //membuat fungsi load data from storage
  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    if (data !== null) { // jika buku ada di local storage
      for (const book of data) {
        books.push(book);
      }
    }
    document.dispatchEvent(new Event(RENDER_EVENT)); // untuk merender atau menampilkan nya kembali
  };
  // mendapatkan element dengan id 
  const bookFormTitle = document.getElementById("bookFormTitle");
  const bookFormAuthor = document.getElementById("bookFormAuthor");
  const bookFormYear = document.getElementById("bookFormYear");
  const bookForm = document.getElementById("bookForm");

// menerapkan realtime validasi

  const customValidationJudulHandler = (event) => {
    event.target.setCustomValidity('');
    if(event.target.validity.valueMissing){
      event.target.setCustomValidity('Judul buku tidak boleh kosong');
      return;
    }
    if(event.target.validity.tooShort){
      event.target.setCustomValidity('Judul buku minimal 3 karakter');
      return;
    }
  };
  bookFormTitle.addEventListener('input', customValidationJudulHandler);
  bookFormTitle.addEventListener('invalid', customValidationJudulHandler);
  const customValidationAuthorHandler = (event) => {
    event.target.setCustomValidity('');
    if(event.target.validity.valueMissing){
      event.target.setCustomValidity('nama penulis buku tidak boleh kosong');
      return;
    }
    if(event.target.validity.tooShort){
      event.target.setCustomValidity('nama penulis buku minimal 3 karakter');
      return;
    }
  };
  bookFormAuthor.addEventListener('input',customValidationAuthorHandler);
  bookFormAuthor.addEventListener('invalid',customValidationAuthorHandler);
  
  const customValidationYearHandler = (event) => {
    event.target.setCustomValidity('');
    if(event.target.validity.valueMissing){
      event.target.setCustomValidity('tahun buku tidak boleh kosong');
      return;
    }
  };
  bookFormYear.addEventListener('input',customValidationYearHandler);
  bookFormYear.addEventListener('invalid',customValidationYearHandler);

  bookForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addBook();
  });

  const books = []; // arrray yang berisi buku kosong dan akan di tambahkan nantinya
  const RENDER_EVENT = 'render-book';// event listener yang akan di buat nantinya dengan nama render-book
  const STORAGE_KEY = 'BOOK_APPS'; // key untuk local storage
  const SAVED_EVENT = 'saved-todo' //event untuk menyimpan buku di local storage
  function isStorageExist() { // method untuk mengecek apakah local storage ada
    if (typeof (Storage) === undefined) {
      alert('Browser tidak mendukung local storage');
      return false;
    }
    return true;
  }
  function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT)); // menambahkan event saved event
    }
    document.addEventListener(SAVED_EVENT, function () {
      console.log(localStorage.getItem(STORAGE_KEY));
    });
  };


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
  function addBook() {
    const bookId = generateId();
    const bookTitle = bookFormTitle.value;
    const bookAuthor = bookFormAuthor.value;
    const bookYear = bookFormYear.value;
    const isCompleted = document.getElementById('bookFormIsComplete').checked; // ambil status checkbox
    const bookObject = generateBookObject(bookId, bookTitle, bookAuthor, bookYear);
    bookObject.isCompleted = isCompleted; // set status selesai/belum
    books.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    console.log(books);
    saveData();
  };
  // fungsi untuk menemukan buku
  function findBook(bookId) {
    for (const bookItem of books) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
  };
  const searchSubmit = document.getElementById('searchSubmit');
  searchSubmit.addEventListener('click', function (event) {
    event.preventDefault();
    const searchInput = document.getElementById('searchBookTitle').value.toLowerCase();
    const bookItems = document.querySelectorAll('[data-testid="bookItem"]');
    bookItems.forEach(function (bookItem) {
      const title = bookItem.querySelector('[data-testid="bookItemTitle"]').innerText.toLowerCase();
      if (title.includes(searchInput)) {
        bookItem.style.display = '';
      } else {
        bookItem.style.display = 'none';
      }
    });
  });
  // fungsi untuk membuat book menjadi complate dari tidak complate
  function addBookToComplete(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData(); // menyimpan setiap data
  };
  // fungsi untuk mengembalikan buku dari complete ke uncomplete
  function undoBookFromComplete(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  };
  // fungsi untuk menghapus buku dari list
  function removeTaskFromCompleted(bookId) {
    const bookIndex = books.findIndex(book => book.id === bookId);
    if (bookIndex !== -1) {
      books.splice(bookIndex, 1);
      document.dispatchEvent(new Event(RENDER_EVENT));
    };
    saveData();
  }
  // fungsi untuk membuat elemen buku
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
    //menampilkan button
    if (bookObject.isCompleted) {
      const undoButton = document.createElement('button');
      undoButton.innerText = "Belum Selesai Dibaca";
      undoButton.addEventListener('click', function () {
        undoBookFromComplete(bookObject.id);
      });
      undoButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
      buttonContainer.append(undoButton);
    } else {
      const checkButton = document.createElement('button');
      checkButton.innerText = "Selesai Dibaca";
      checkButton.addEventListener('click', function () {
        addBookToComplete(bookObject.id);
      });
      checkButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
      buttonContainer.append(checkButton);
    }

    // Optional: tombol edit jika ingin ditambahkan
    const editButton = document.createElement('button');
    editButton.innerText = "Edit Buku";
    editButton.addEventListener('click', function () {
      const editTitle = prompt("Edit Judul Buku:", bookObject.title);
      const editAuthor = prompt("Edit Penulis Buku:", bookObject.author);
      const editYear = prompt("Edit Tahun Buku:", bookObject.year);

      if (editTitle !== null && editAuthor !== null && editYear !== null) {
        bookObject.title = editTitle;
        bookObject.author = editAuthor;
        bookObject.year = editYear;
        document.dispatchEvent(new Event(RENDER_EVENT));//igunakan untuk memicu (trigger) event custom bernama RENDER_EVENT pada dokumen
        saveData();
      }
      editButton.setAttribute('data-testid', 'bookItemEditButton');
    }
    );
    buttonContainer.append(editButton);

    textContainer.append(buttonContainer);

    return textContainer;
  };

  // merender dari buku yang sudah di baca ke yang belum di baca dan sebaliknua
  document.addEventListener(RENDER_EVENT, function () {
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
  loadDataFromStorage(); // memanggil fungsi load data
});
