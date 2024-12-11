/**
 * Controller module for the recipe application.
 * This module handles the main application logic, including:
 * - Recipe display and manipulation
 * - Search functionality
 * - Pagination
 * - Bookmarking
 * - Adding new recipes
 *
 * It imports necessary modules and initializes event handlers.
 */

import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import searchView from './views/searchView.js';
import recipeView from './views/recipeView.js';
import resultView from './views/resultView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import deleteRecipeView from './views/deleteRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Enable hot module replacement for development
if (module.hot) {
  module.hot.accept();
}
// https://forkify-api.herokuapp.com/v2

/**
 * Handles the display and updating of a recipe.
 * Fetches recipe data, updates the view, and handles bookmarks.
 */
const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // resultView.renderSpinner();
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultView.update(model.getSearchResultsPage());

    // 1) loading recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;

    // 2) Rendering recipe
    recipeView.render(recipe);
    // 3) update bookmarks view
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

/**
 * Manages the search functionality.
 * Retrieves search query, loads results, and updates the view.
 */
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

/**
 * Handles pagination for search results.
 * @param {number} goToPage - The page number to display
 */
const controlPagination = function (goToPage) {
  // 1) render NEW results
  resultView.render(model.getSearchResultsPage(goToPage));

  // 2) render NEW pagination buttons
  paginationView.render(model.state.search);
};

/**
 * Updates the servings for a recipe.
 * @param {number} newServings - The new number of servings
 */
const controlServings = function (newServings) {
  // 1)update the recipe servings (in state)
  model.updateServings(newServings);

  // 2) render recipe
  // recipeView.render(model.state.recipe) // no need to render whole recipe page, just update the servings
  recipeView.update(model.state.recipe);
};

/**
 * Manages the bookmarking of recipes.
 * Adds or removes bookmarks and updates the view.
 */
const controlAddBookmark = function () {
  // 1) add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) update recipe view
  recipeView.update(model.state.recipe);

  // 3) render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

/**
 * Renders the bookmarks view.
 */
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

/**
 * Handles the addition of a new recipe.
 * Uploads the recipe, updates views, and manages URL state.
 * @param {Object} newRecipe - The new recipe data
 */
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

    // Render bookmarks view
    bookmarksView.render(model.state.bookmarks);

    // 更新搜尋結果視圖
    resultView.render(model.getSearchResultsPage());

    // change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView.toggleWindow();

      // 清空表單內容
      addRecipeView._parentEL.reset();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

/**
 * Handles the deletion of a recipe.
 * Deletes the recipe and updates the view.
 */
const controlDeleteRecipe = async function (id) {
  try {
    if (!confirm('確定要刪除這個食譜嗎？')) return;

    recipeView.renderSpinner();

    // 刪除食譜
    await model.deleteRecipe(id);

    // 更新搜尋結果視圖
    resultView.render(model.getSearchResultsPage());

    // 重新渲染書籤列表
    bookmarksView.render(model.state.bookmarks);

    // 顯示成功訊息
    recipeView.renderSuccess('Recipe deleted successfully!');

    // 清除 URL hash
    window.history.pushState(null, '', window.location.pathname);
  } catch (err) {
    console.error('💥', err);
    recipeView.renderError(err.message);
    return;
  }
};

/**
 * Initializes the application by setting up event handlers.
 */
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
  // 7) delete recipe
  deleteRecipeView.addHandlerDelete(controlDeleteRecipe);
};

init();
