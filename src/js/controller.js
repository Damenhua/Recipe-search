import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';

import 'core-js/actual';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const controlRecipe = async function () {
  try {
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

// 3) Searching for results
const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;

    model.loadSearchResults(`${query}`);
  } catch (err) {
    console.error(err);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearch(controlSearchResults)
};

init();
