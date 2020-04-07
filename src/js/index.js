/**
 * 
 *  CONTROLLER
 * 
 */ 
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';


/** Global state of the app
 * 
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Linked recipes
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    
    // 1) get query from view
    const query = searchView.getInput();
    // console.log(query);
    
    if (query) {
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput(); // clear the search field
        searchView.clearResults(); // clear results
        renderLoader(elements.searchRes); // render loader
        try {
            // 4) Search for recipes
            await state.search.getResults();

            // 5) Render results on UI
            // console.log(state.search.result);
            clearLoader(); // clear the loader
            searchView.renderResults(state.search.result);
        } catch (err) {
            alert ('Something wrong with the search...')
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault(); // dont refresh page
    controlSearch();
});

elements.searchResPages.addEventListener('click', e =>{
    const btn = e.target.closest('.btn-inline');
    //console.log(btn);
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        //console.log(goToPage);
    }
});

/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    // get id from hash
    const id = window.location.hash.replace('#', '');
    // console.log(id);
    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Create a new recipe object
        state.recipe = new Recipe(id);
      
        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

        // calculate servings and time
        state.recipe.calcTime();
        state.recipe.calcServings();

        // Render recipe
        //console.log(state.recipe);
        clearLoader();
        recipeView.renderRecipe(state.recipe);
        } catch (err) {
            alert('Error processing recipe!');
            console.log(err);
        }
    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));