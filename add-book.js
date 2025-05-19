class AddBook extends HTMLElement {
  constructor() {
    super();
    this.render();
  }
  render() {
    this.innerHTML = `
      <section class="form">
        <h2>Tambah Buku Baru</h2>
        <form id="bookForm" data-testid="bookForm">
          <div>
            <label for="bookFormTitle">Judul</label>
            <input id="bookFormTitle" id="judul" name="judul" type="text" autocomplete="judul" required minlength="3" pattern="[A-Za-z0-9\\s]+" data-testid="bookFormTitleInput" aria-describedby="titleValidation"/>
          </div>
          <div>
            <label for="bookFormAuthor">Penulis</label>
            <input id="bookFormAuthor" id="penulis" type="text" name="penulis" autocomplete="penulis" minlength="3" required data-testid="bookFormAuthorInput" />
          </div>
          <div>
            <label for="bookFormYear">Tahun</label>
            <input id="bookFormYear" id="tahun" type="number" name="tahun" autocomplete="tahun" data-testid="bookFormYearInput" />
          </div>
          <div>
            <label for="bookFormIsComplete">Selesai dibaca</label>
            <input id="bookFormIsComplete" type="checkbox" data-testid="bookFormIsCompleteCheckbox" />
          </div>
          <button class="button-field" id="bookFormSubmit" type="submit" data-testid="bookFormSubmitButton">
            Masukkan Buku ke rak <span>Belum selesai dibaca</span>
          </button>
        </form>
      </section>
    `;
  }
}
customElements.define("add-book", AddBook);