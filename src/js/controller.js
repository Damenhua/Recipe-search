import * as model from './model.js';
import recipeView from './views/recipeView.js';

import 'core-js/actual';

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
    console.error(`${err}`);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipe);
}

init();