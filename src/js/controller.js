import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import searchView from './views/searchView.js';
import recipeView from './views/recipeView.js';
import resultView from './views/resultView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

// Enable hot module replacement for development
if (module.hot) {
  module.hot.accept();
}
// https://forkify-api.herokuapp.com/v2

// Main function to control recipe display
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

    // update bookmarks view
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

// Function to handle search results
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

    console.log(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

// Function to handle pagination
const controlPagination = function (goToPage) {
  // 1) render NEW results
  resultView.render(model.getSearchResultsPage(goToPage));

  // 2) render NEW pagination buttons
  paginationView.render(model.state.search);
};

// Function to update recipe servings
const controlServings = function (newServings) {
  // 1)update the recipe servings (in state)
  model.updateServings(newServings);

  // 2) render recipe
  // recipeView.render(model.state.recipe) // no need to render whole recipe page, just update the servings
  recipeView.update(model.state.recipe);
};

// Function to add or remove bookmarks
const controlAddBookmark = function () {
  // 1) add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  console.log(model.state.recipe.bookmarked);

  // 2) update recipe view
  recipeView.update(model.state.recipe);

  // 3) render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

// Function to render bookmarks
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// Function to handle adding new recipe (to be implemented)
const controlAddRecipe = async function (newRecipe) {
  try {
    // Render spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Render success message
    addRecipeView.renderSuccess();

    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('!!!', err);
    addRecipeView.renderError(err.message);
  }
};

// Initialization function to set up event handler
const init = function () {
  // 1) search
  searchView.addHandlerSearch(controlSearchResults);
  // 2) render recipe
  recipeView.addHandlerRender(controlRecipe);
  // 2.5) render bookmarks
  bookmarksView.addHandlerRender(controlBookmarks);

  // 3) pagination
  paginationView.addHandlerPageClick(controlPagination);
  // 4) update servings
  recipeView.addHandlerUpdateServings(controlServings);
  // 5) add/remove bookmark
  recipeView.addHandlerBookmark(controlAddBookmark);
  // 6) add recipe
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
