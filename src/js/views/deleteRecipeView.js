import View from './View.js';
import PreviewView from './previewView.js';

class DeleteRecipeView extends View {
  _parentEL = document.querySelector('.results');

  addHandlerDelete(handler) {
    this._parentEL.addEventListener('click', function (e) {
      const btn = e.target.closest('.preview__delete');
      if (!btn) return;
      const preview = btn.closest('.preview');
      const recipeId = preview
        .querySelector('.preview__link')
        .getAttribute('href')
        .slice(1);
      handler(recipeId);
    });
  }

  _generateMarkup() {
    return this._data.map(result => PreviewView.render(result, false)).join('');
  }
}

export default new DeleteRecipeView();
