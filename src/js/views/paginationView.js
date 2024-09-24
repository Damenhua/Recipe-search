import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentEL = document.querySelector('.pagination');

  addHandlerPageClick(handler) {
    this._parentEL.addEventListener('click', function(e) {
      const btn = e.target.closest('.btn--inline');
      if(!btn) return;
      const goToPage = +btn.dataset.goto;

      console.log(goToPage);

      handler(goToPage);
    })
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const totalPage = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    

    // 1) page 1, and there are other pages
    if (curPage === 1 && totalPage > 1) {
      return this._generateNextButton(curPage);
    }

    // 2) Last page
    if (curPage === totalPage) {
      return this._generatePrevButton(curPage);
    }

    // 3) Other page
    if (curPage < totalPage) {
      return this._generatePrevButton(curPage) + this._generateNextButton(curPage);
    }

    // 4) just one page
    return ``;
  }

  _generatePrevButton(curPage) {
    return `
      <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>
    `;
  }
  
  _generateNextButton(curPage) {
    return `
      <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
        <span> Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
    `;
  }
}

export default new PaginationView();
