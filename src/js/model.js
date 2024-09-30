/**
 * Model module handling the application's data logic
 * @module model
 */

import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helper.js';
import { AJAX } from './helper.js';

/**
 * Application state object
 * @typedef {Object} State
 * @property {Object} recipe - Current recipe
 * @property {Object} search - Search-related information
 * @property {Array} bookmarks - List of bookmarks
 */

/**
 * Application state
 * @type {State}
 */
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

/**
 * Initialization function, loads bookmarks from local storage
 */
const init = function () {
  const data = localStorage.getItem('bookmarks');
  if (data) state.bookmarks = JSON.parse(data);
};

init();

/**
 * Creates a recipe object
 * @param {Object} data - Recipe data returned from API
 * @returns {Object} Formatted recipe object
 */
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

/**
 * Loads a recipe
 * @param {string} id - Recipe ID
 * @throws {Error} If loading fails
 */
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    // check if the recipe is already bookmarked
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(`${err}`);
    throw err;
  }
};

/**
 * Loads search results
 * @param {string} query - Search query
 * @throws {Error} If loading fails
 */
export const loadSearchResults = async function (query) {
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.results = data.data.recipes.map(data => {
      return {
        id: data.id,
        title: data.title,
        publisher: data.publisher,
        image: data.image_url,
        ...(data.key && { key: data.key }),
      };
    });
    // reset search page to 1
    state.search.page = 1;
  } catch (err) {
    console.error(`${err}`);
    throw err;
  }
};

/**
 * Gets search results for a specific page
 * @param {number} [page=state.search.page] - Page number
 * @returns {Array} Search results for the current page
 */
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 10
  return state.search.results.slice(start, end);
};

/**
 * Updates the servings of a recipe
 * @param {number} newServings - New number of servings
 */
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity / state.recipe.servings) * newServings;
  });
  state.recipe.servings = newServings;
};

/**
 * Persists bookmarks to local storage
 */
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

/**
 * Adds a bookmark
 * @param {Object} recipe - Recipe to be bookmarked
 */
export const addBookmark = function (recipe) {
  // add bookmark
  state.bookmarks.push(recipe);

  // mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

/**
 * Deletes a bookmark
 * @param {string} id - ID of the bookmark to be deleted
 */
export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  if (index === -1) return;
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

/**
 * Uploads a new recipe
 * @param {Object} newRecipe - Data for the new recipe
 * @throws {Error} If upload fails or format is incorrect
 */
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error('Wrong format, please use the correct format');
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
    console.log('Recipe created with ID:', state.recipe.id);

    // return state.recipe.id;
  } catch (err) {
    throw err;
  }
};

// const clearBookmarks = function () {
//   localStorage.clear('bookmarks');
// };
// clearBookmarks();
