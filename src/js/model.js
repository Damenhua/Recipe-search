import { API_URL } from './config.js';
import { getJSON } from './helper.js';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
  },
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}`);
    console.log(data);
    let { recipe } = data.data;

    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    console.log(state.recipe);
  } catch (err) {
    console.error(`${err}`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    const data = await getJSON(`${API_URL}?search=${query}`);
    console.log(data);
    state.search.results = data.data.recipes.map(data => {
      return {
        id: data.id,
        title: data.title,
        publisher: data.publisher,
        image: data.image_url,
      };
    });
    console.log(state.search.results);
  } catch (err) {
    console.error(`${err}`);
    throw err;
  }
};
