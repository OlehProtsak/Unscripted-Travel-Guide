// API key for accessing Unsplash and Restcountries APIs
const apiKey = "k9SrgKI8_B-JaT2ZrodZDd4IshQVVK8viOCG1HZQlL0";

// Variable to store the entered country name
let countryName;

// Function to fetch data from an API given a URL
const fetchDataFromAPI = async (url) => {
  // Fetch data from the API using the provided URL
  const response = await fetch(url);

  // Parse the JSON data from the response
  const data = await response.json();
  return data;
};

// Function to fetch combined data from Unsplash and Restcountries APIs
const fetchCombinedData = async () => {
  // Construct URLs for Unsplash (photos) and Restcountries (country information) APIs
  const photosUrl = `https://api.unsplash.com/search/photos?query=${countryName}&client_id=${apiKey}`;
  const countriesUrl = `https://restcountries.com/v3.1/name/${countryName}`;

  try {
    // Fetch data from both APIs concurrently
    const [photosApiResponse, countriesApiResponse] = await Promise.all([
      fetchDataFromAPI(photosUrl),
      fetchDataFromAPI(countriesUrl),
    ]);

    // Display country photos and information, and update search history
    showCountryPhotos(photosApiResponse);
    showCountriesInfo(countriesApiResponse);
    addToHistory(countryName);

    // Show a success modal with a green title
    const id = "countryModal";
    const text = `Scroll down to see pictures of ${countryName}.`;
    showModal(id, text, "green");
  } catch (error) {
    // Handle errors, show an error modal with a red title
    const id = "errorModal";
    const text = `Apologies, ${countryName} doesn't exist: Please ensure you have entered a valid country name.`;
    showModal(id, text, "red");
  }
};

// Event listener for form submission
$(".input-group").on("submit", async function (event) {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Get the entered country name from the input field
  countryName = $("#enterCity").val();

  // Check if the country name is empty; show an error modal if it is
  if (!countryName) {
    const id = "errorModal";
    const text = "Please enter a country name.";
    showModal(id, text, "red");
    return;
  }

  // Call fetchCombinedData to handle API requests and modal display
  await fetchCombinedData();

  // Clear the input field after processing
  $("#enterCity").val("");
});

// Function to display country information on the webpage
function showCountriesInfo(results) {
  // Clear the existing content in the element with the ID #country-info
  $("#country-info").empty();

  // Extract relevant information from the Restcountries API response
  const formatter = Intl.NumberFormat("en", { notation: "compact" });
  const flag = results[0].flags.png;
  const altFlag = results[0].flags.alt;
  const name = results[0].name.official;
  const capital = results[0].capital.join(", ");
  const population = formatter.format(results[0].population);
  const googleMaps = results[0].maps.googleMaps;

  // Append HTML content for country information to the #country-info element
  $("#country-info").append(`
    <div class="container">  
      <div class="row">
        <div class="col">
          <h2 class="section-heading"><img src=${flag} alt=${altFlag}/></h2>
        </div>
        <div class="col">
          <h2 class="section-heading">Country: ${name}</h2>
          <h2 class="section-heading">Capital City: ${capital}</h2>
          <h2 class="section-heading">Population: ${population}</h2>
          <h2 class="section-heading"><a href=${googleMaps} target="_blank">Google maps</a></h2>
        </div>
      </div>
    </div>
  `);
}

// Function to display country photos on the webpage
function showCountryPhotos(results) {
  // Clear the existing content in the element with the ID #country-photos
  $("#country-photos").empty();

  // Extract relevant information from the Unsplash API response (photos)
  const photos = results.results.slice(0, 4);

  // Append HTML content for each photo to the #country-photos element
  photos.forEach((photo) => {
    const alt = photo.alt_description;
    const url = photo.urls.small;

    // Dynamically create HTML content for each photo and append it to the #country-photos element
    $("#country-photos").append(`
      <div class="col-lg-3">
        <div class="blog-item mx-auto mb-5 mb-lg-0">
          <img class="img-fluid rounded-circle mb-4" src=${url} alt=${alt}>
        </div>
      </div>
    `);
  });
}

// Function to display a modal with a specified ID, text, and title color
function showModal(id, text, color) {
  // Remove existing modals with the same ID
  if ($(`#${id}`).length) {
    $(`#${id}`).remove();
  }

  // Dynamically create HTML content for the modal and append it to the body
  const modalHtml = `
    <div class="modal fade" id=${id} data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby=${id}Label aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id=${id}Label style="color: ${color};">Country Information</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            ${text}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Append the modal to the body and show it
  $("body").append(modalHtml);
  $(`#${id}`).modal("show");
}

// Function to add the entered country to the search history
function addToHistory(countryName) {
  // Retrieve existing search history from local storage
  const storedHistory = localStorage.getItem("countryHistory");
  const capitalizedCountryName =
    countryName.toLowerCase().charAt(0).toUpperCase() +
    countryName.toLowerCase().slice(1);

  let result = false;

  // Parse existing search history or initialize an empty array
  const existingHistory = JSON.parse(storedHistory) || [];

  // Check if the country is already in the search history
  if (Array.isArray(existingHistory)) {
    for (let i = 0; i < existingHistory.length; i++) {
      if (existingHistory[i] === capitalizedCountryName) {
        result = true;
      }
    }

    // Add the country to the search history if it's not already present
    if (!result) {
      existingHistory.unshift(capitalizedCountryName);
      localStorage.setItem("countryHistory", JSON.stringify(existingHistory));

      // Update the display of search history
      updateHistoryDisplay();
    }
  } else {
    // If no search history exists, create a new one
    const newHistory = [capitalizedCountryName];
    localStorage.setItem("countryHistory", JSON.stringify(newHistory));

    // Update the display of search history
    updateHistoryDisplay();
  }
}

// Function to update the display of search history on the webpage
function updateHistoryDisplay() {
  // Clear the existing content in the element with the ID #searchHistory
  $("#searchHistory").empty();

  // Retrieve the search history from local storage
  const countryHistory =
    JSON.parse(localStorage.getItem("countryHistory")) || [];

  // Append each country button to the #searchHistory element
  countryHistory.forEach((country) => {
    $("#searchHistory").append(
      `<li><button type="button" class="btn btn-secondary mb-2" data-country=${country}>${country}</button></li>`
    );
  });
}

// Event listener for clicking on a country in the search history
$("#searchHistory").on("click", "[data-country]", function () {
  // Get the selected country from the data attribute and fetch its data
  countryName = $(this).attr("data-country");
  fetchCombinedData();
});

// Initialize the display of search history on page load
updateHistoryDisplay();
