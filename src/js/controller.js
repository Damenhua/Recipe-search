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

    // change ID in URL
    //使用 replaceState 而不是 pushState：>>目前正常
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    ////test
    // const newId = model.state.recipe.id;
    // window.location.hash = newId;
    // console.log('Attempting to change URL hash to:', newId);

    // window.history.back();
    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('!!!', err);
    addRecipeView.renderError(err.message);
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
};

init();

// 項目改進建議:

// 顯示分頁總數
// 允許根據時長或原料數量排序搜索結果
// 在視圖中驗證原料輸入
// 改進原料輸入界面
// 添加購物清單功能
// 實現每週餐點計劃功能
// 使用食品API獲取營養數據