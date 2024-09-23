import * as model from './model.js';
import searchView from './views/searchView.js';
import recipeView from './views/recipeView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import 'core-js/actual';

if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const controlRecipe = async function () {
  try {
    // resultView.renderSpinner();

    const id = window.location.hash.slice(1);
    console.log(id);

    if (!id) return;

    recipeView.renderSpinner();

    // 1) loading recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;

    // 2) Rendering recipe
    recipeView.render(recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

//  Searching for results
const controlSearchResults = async function () {
  try {
    resultView.renderSpinner();

    // 1) Get searched query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) load search results
    await model.loadSearchResults(`${query}`);

    // 3) render results
    resultView.render(model.getSearchResultsPage(1));

    // 4) render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearch(controlSearchResults);
};

init();
