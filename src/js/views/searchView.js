class SearchView {
  _parentEl = document.querySelector('.search');

  constructor() {
    // 當頁面載入時,自動填入 pizza 並觸發搜尋
    window.addEventListener('load', () => {
      this._parentEl.querySelector('.search__field').value = 'pizza';
      this._parentEl.dispatchEvent(new Event('submit'));
    });
  }

  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      const query = this.querySelector('.search__field').value.trim();
      if (!query) {
        alert('請輸入搜尋內容');
        return;
      }
      handler();
    });
  }
}

export default new SearchView();
