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
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultView.update(model.getSearchResultsPage());

    // 1) Get id from URL
    const id = window.location.hash.slice(1);

    if (!id) return;

    // 2) loading recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;

    // 3) Rendering recipe
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
    resultView.render(model.getSearchResultsPage());

    // 4) render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) render NEW results
  resultView.render(model.getSearchResultsPage(goToPage));

  // 2) render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // 1)update the recipe servings (in state)
  model.updateServings(newServings);

  // 2) render recipe
  // recipeView.render(model.state.recipe) // no need to render whole recipe page, just update the servings
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  console.log(model.state.recipe.bookmarked);
  // 2) update recipe view
  recipeView.update(model.state.recipe);
};

const init = function () {
  // 1) search
  searchView.addHandlerSearch(controlSearchResults);
  // 2) render recipe
  recipeView.addHandlerRender(controlRecipe);

  // 3) pagination
  paginationView.addHandlerPageClick(controlPagination);
  // 4) update servings
  recipeView.addHandlerUpdateServings(controlServings);
  // 5) add/remove bookmark
  recipeView.addHandlerBookmark(controlAddBookmark);
};

init();
