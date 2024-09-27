import icons from 'url:../../img/icons.svg'; //parcel@2

export default class View {
  _data;
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;

    const markup = this._generateMarkup();
    if (!render) return markup;

    this._clear();
    this._parentEL.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    // creat virtual DOM
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    //get all elements from new DOM,and array from
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    // this old elements are already rendered that data from API
    const oldElements = Array.from(this._parentEL.querySelectorAll('*'));
    ``;
    // update changed text
    newElements.forEach((newEl, i) => {
      const oldEl = oldElements[i];

      // compare old elements with new elements
      if (
        !newEl.isEqualNode(oldEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        oldEl.textContent = newEl.textContent;
      }

      // update changed attributes
      if (!newEl.isEqualNode(oldEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          oldEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  _clear() {
    this._parentEL.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
       </div>  
    `;
    this._clear();
    this._parentEL.insertAdjacentHTML('afterbegin', markup);
  }
  // render error message
  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
    this._clear();
    this._parentEL.insertAdjacentHTML('afterbegin', markup);
  }

  // render success message
  renderSuccess(message = this._successMessage) {
    const markup = `<div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
    this._clear();
    this._parentEL.insertAdjacentHTML('afterbegin', markup);
  }
}
