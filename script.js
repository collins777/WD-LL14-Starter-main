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
