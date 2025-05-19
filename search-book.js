class SearchBook extends HTMLElement{
  constructor(){
    super();
    this.render();
  }
  render(){
    this.innerHTML = `      
    <section class="form">
        <h2>Cari Buku</h2>
        <form id="searchBook" data-testid="searchBookForm">
          <label for="searchBookTitle">Judul</label>
          <input id="searchBookTitle" type="text" name="cari" id="cari" autocomplete="cari" data-testid="searchBookFormTitleInput" />
          <button class = "button-field" id="searchSubmit" type="submit" data-testid="searchBookFormSubmitButton">
            Cari
          </button>
        </form>
      </section>`
  }
}
customElements.define("search-book", SearchBook);