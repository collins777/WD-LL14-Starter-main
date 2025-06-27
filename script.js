// Populate the area dropdown when the page loads
window.addEventListener("DOMContentLoaded", async function () {
  // Get the dropdown element from the HTML
  const areaSelect = document.getElementById("area-select");

  // Add a default option to the dropdown
  areaSelect.innerHTML = '<option value="">Select Area</option>';

  try {
    // Fetch the list of areas from the API
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
    );

    // Convert the response to JSON format
    const data = await response.json();

    // Log the response to the console so students can see the data structure
    console.log("Areas API response:", data);

    // Check if we got meals data back from the API
    if (data.meals) {
      // Loop through each area in the response
      data.meals.forEach((areaObj) => {
        // Create a new option element for each area
        const option = document.createElement("option");

        // Set both the value and display text to the area name
        option.value = areaObj.strArea;
        option.textContent = areaObj.strArea;

        // Add the option to the dropdown
        areaSelect.appendChild(option);
      });
    }
  } catch (error) {
    // Handle any errors that might occur during the fetch
    console.error("Error fetching areas:", error);
  }
});

// When the user selects an area, fetch and display meals for that area
document
  .getElementById("area-select")
  .addEventListener("change", async function () {
    // Get the selected area value
    const area = this.value;

    // Get the results container element
    const resultsDiv = document.getElementById("results");

    // Clear any previous results
    resultsDiv.innerHTML = "";

    // If no area is selected, don't do anything
    if (!area) return;

    try {
      // Fetch meals for the selected area using template literals
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(
          area
        )}`
      );

      // Convert the response to JSON format
      const data = await response.json();

      // Log the filtered recipes to the console so students can see the data
      console.log(`Filtered recipes for ${area}:`, data);

      // Check if we got meals data back from the API
      if (data.meals) {
        // Loop through each meal and create HTML elements
        data.meals.forEach((meal) => {
          // Create a container div for each meal
          const mealDiv = document.createElement("div");
          mealDiv.className = "meal";

          // Make the meal clickable by adding a cursor pointer style
          mealDiv.style.cursor = "pointer";

          // Create and set up the meal title
          const title = document.createElement("h3");
          title.textContent = meal.strMeal;

          // Create and set up the meal image
          const img = document.createElement("img");
          img.src = meal.strMealThumb;
          img.alt = meal.strMeal;

          // Add the title and image to the meal container
          mealDiv.appendChild(title);
          mealDiv.appendChild(img);

          // Add click event listener to show recipe details when clicked
          mealDiv.addEventListener("click", async function () {
            await showRecipeDetails(meal.idMeal);
          });

          // Add the meal container to the results area
          resultsDiv.appendChild(mealDiv);
        });
      } else {
        // Show a message if no meals were found
        resultsDiv.textContent = "No meals found for this area.";
      }
    } catch (error) {
      // Handle any errors that might occur during the fetch
      console.error("Error fetching meals:", error);
      resultsDiv.textContent = "Error loading meals. Please try again.";
    }
  });

// Function to fetch and display detailed recipe information in a modal
async function showRecipeDetails(mealId) {
  try {
    // Fetch detailed recipe information using the meal ID
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );

    // Convert the response to JSON format
    const data = await response.json();

    // Check if we got meal data back from the API
    if (data.meals && data.meals[0]) {
      const meal = data.meals[0];

      // Get the modal elements from the HTML
      const modalTitle = document.getElementById("recipeModalLabel");
      const modalBody = document.getElementById("recipeModalBody");

      // Set the modal title to the recipe name
      modalTitle.textContent = meal.strMeal;

      // Split instructions into individual steps and create bullet points
      const instructions = meal.strInstructions
        .split(/\r\n|\n|\. /) // Split by line breaks or periods followed by space
        .filter((step) => step.trim() !== "") // Remove empty steps
        .map((step) => step.trim()); // Clean up whitespace

      // Create bullet points for each instruction step
      let instructionsList = "";
      instructions.forEach((step) => {
        if (step.length > 0) {
          instructionsList += `<li>${step}</li>`;
        }
      });

      // Create the modal content using template literals
      modalBody.innerHTML = `
        <div class="text-center mb-3">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="img-fluid rounded" style="max-height: 300px;">
        </div>
        <h5>Category:</h5>
        <p>${meal.strCategory}</p>
        <h5>Area:</h5>
        <p>${meal.strArea}</p>
        <h5>Instructions:</h5>
        <ul class="text-start instruction-list">
          ${instructionsList}
        </ul>
      `;

      // Show the Bootstrap modal
      const modal = new bootstrap.Modal(document.getElementById("recipeModal"));
      modal.show();
    }
  } catch (error) {
    // Handle any errors that might occur during the fetch
    console.error("Error fetching recipe details:", error);
    alert("Error loading recipe details. Please try again.");
  }
}
