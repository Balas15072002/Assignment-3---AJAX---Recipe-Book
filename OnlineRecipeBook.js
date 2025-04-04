document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const recipesGrid = document.getElementById("recipes");
  const loadingElement = document.getElementById("loading");
  const errorElement = document.getElementById("error");
  const noResultsElement = document.getElementById("no-results");

  const toggleElement = (element, show) => {
    element.classList.toggle("hidden", !show);
  };

  const showError = (message) => {
    errorElement.textContent = message;
    toggleElement(errorElement, true);
    console.error(message);
  };

  const createRecipeCard = (recipe) => {
    return `
            <div class="recipe-card">
                <img src="${recipe.strMealThumb}" alt="${
      recipe.strMeal
    }" class="recipe-image">
                <h3 class="recipe-title">${recipe.strMeal}</h3>
                <p><strong>Category:</strong> ${recipe.strCategory}</p>
                <p><strong>Area:</strong> ${recipe.strArea}</p>
                <p>${recipe.strInstructions.substring(0, 100)}...</p>
                <a href="${
                  recipe.strSource ||
                  `https://www.themealdb.com/meal/${recipe.idMeal}`
                }" target="_blank" class="view-recipe">
                    View Recipe
                </a>
            </div>
        `;
  };

  const searchRecipes = async (query) => {
    query = query.trim();
    if (!query) return;

    recipesGrid.innerHTML = "";
    toggleElement(loadingElement, true);
    toggleElement(errorElement, false);
    toggleElement(noResultsElement, false);

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
          query
        )}`
      );
      if (!response.ok) throw new Error("Failed to fetch recipes");

      const data = await response.json();

      if (data.meals) {
        recipesGrid.innerHTML = data.meals.map(createRecipeCard).join("");
      } else {
        toggleElement(noResultsElement, true);
      }
    } catch (err) {
      showError("Failed to fetch recipes. Please try again.");
      console.error(err);
    } finally {
      toggleElement(loadingElement, false);
    }
  };

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    searchRecipes(searchInput.value);
  });
});
