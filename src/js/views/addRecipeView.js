import View from './View.js';
import PreviewView from './previewView.js';

class AddRecipeView extends View {
  _parentEL = document.querySelector('.upload');// form
  _successMessage = 'Recipe was successfully uploaded!';

  _window = document.querySelector('.add-recipe-window');// 
  _btnClose = document.querySelector('.btn--close-modal');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _overlay = document.querySelector('.overlay');
  _upload = document.querySelector('.upload__btn');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerCloseWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerCloseWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentEL.addEventListener('submit', function (e) {
      e.preventDefault();
      console.log('form submitted');
      const formDataArray = [...new FormData(this)];
      const data = Object.fromEntries(formDataArray);

      handler(data);
      // 清除 URL 中的查詢參數
      // window.history.replaceState({}, document.title, window.location.pathname);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
