import icons from 'url:../../img/icons.svg'; //parcel@2

export default class View {
  _data;

/**
 * Render the received object to the DOM
 * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
 * @param {boolean} [render=true] If set to false, the method will return the markup string instead of rendering to the DOM
 * @returns {undefined | string} A markup string is returned if render = false
 * @this {Object} View instance
 * @author Jeffrey
 * @date 2024-09-30
 * @version 1.0
 * @todo Finish implementation
 */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;

    const markup = this._generateMarkup();
    if (!render) return markup;

    this._clear();
    this._parentEL.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Update the DOM with new data without re-rendering the entire view
   * @param {Object | Object[]} data The new data to update the view with
   */
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

  /**
   * Clear the parent element's content
   * @private
   */
  _clear() {
    this._parentEL.innerHTML = '';
  }

  /**
   * Render a spinner to indicate loading state
   * This method clears the parent element and inserts a spinner icon
   */
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
  /**
   * Render an error message to the DOM
   * @param {string} [message=this._errorMessage] The error message to display
   */
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

    /**
   * Render a success message to the DOM
   * @param {string} [message=this._successMessage] The success message to display
   */
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
