import * as model from './model.js';
import recipeView from './views/recipeView.js';

import 'core-js/actual';

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);

    if (!id) return;

    recipeView.renderSpinner();

    // loading recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;

    // Rendering recipe

    recipeView.render(recipe);
  } catch (err) {
    alert(err);
  }
};

['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));
window.addEventListener('hashchange', controlRecipe);
