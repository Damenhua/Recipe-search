import View from './View.js';
import PreviewView from './previewView.js';

class ResultView extends View {
  _parentEL = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query. Please try again!';
  _message = '';

  _generateMarkup() {
    return this._data
      .map(result => PreviewView.render(result, false))
      .join('');
  }
}

export default new ResultView();
