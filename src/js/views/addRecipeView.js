import View from './View.js';
import PreviewView from './previewView.js';

class AddRecipeView extends View {
  _formEl = document.querySelector('.upload');

  _window = document.querySelector('.add-recipe-window');
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
    this._formEl.addEventListener('submit', function (e) {
      e.preventDefault();
      const formDataArray = [...new FormData(this)];
      const data = Object.fromEntries(formDataArray);
      
      handler(data);
      console.log(formDataArray);
      console.log(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
