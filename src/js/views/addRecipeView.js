import View from './View.js';
import PreviewView from './previewView.js';

class AddRecipeView extends View {
  _parentEL = document.querySelector('.upload');

  _window = document.querySelector('.add-recipe-window');
  _closeModal = document.querySelector('.btn--close-modal');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _upload = document.querySelector('.upload__btn');

  constructor() {
    super();
    this._addHandlerShowWindwo();
  }

  _addHandlerShowWindwo() {
    this._parentEL.addEventListener('click', function (e) {
      this._overlay.classList.toggle('hidden');
      this._window.classList.toggle('hidden');
    });
  }
}

export default new AddRecipeView();
