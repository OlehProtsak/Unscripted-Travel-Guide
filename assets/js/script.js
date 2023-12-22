const apiKey = "k9SrgKI8_B-JaT2ZrodZDd4IshQVVK8viOCG1HZQlL0";
let countryName;

const fetchDataFromAPI = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const fetchCombinedData = () => {
  const photoshUrl = `https://api.unsplash.com/search/photos?query=${countryName}&client_id=${apiKey}`;
  const countriesUrl = `https://restcountries.com/v3.1/name/${countryName}`;

  Promise.all([fetchDataFromAPI(photoshUrl), fetchDataFromAPI(countriesUrl)])
    .then((results) => {
      showCountryPhotos(results[0]);
      showCountriesInfo(results[1]);
      addToHistory(countryName);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

$(".input-group").on("submit", function (event) {
  event.preventDefault();
  countryName = $("#enterCity").val();

  if (countryName) {
    fetchCombinedData();
    showCountryModal();
  }

  $("#enterCity").val("");
});

function showCountriesInfo(results) {
  $("#country-info").empty();

  const formatter = Intl.NumberFormat("en", { notation: "compact" });
  const flag = results[0].flags.png;
  const altFlag = results[0].flags.alt;
  const name = results[0].name.official;
  const capital = results[0].capital.join(", ");
  const population = formatter.format(results[0].population);
  const googleMaps = results[0].maps.googleMaps;

  $("#country-info").append(`
    <div class="row">
                <div class="col-md-8 mx-auto">
                    <h2 class="section-heading"><img src=${flag} alt=${altFlag}/></h2>
                </div>
                <div class="col-md-8 mx-auto">
                    <h2 class="section-heading">Country: ${name}</h2>
                </div>
                <div class="col-md-8 mx-auto">
                    <h2 class="section-heading">Capital City: ${capital}</h2>
                </div>
                <div class="col-md-8 mx-auto">
                    <h2 class="section-heading">Population: ${population}</h2>
                </div>
                <div class="col-md-8 mx-auto">
                    <h2 class="section-heading"><a href=${googleMaps}>Google maps</a></h2>
                </div>
            </div>
    `);
}

function showCountryPhotos(results) {
  $("#country-photos").empty();

  const photos = results.results.slice(0, 4);

  photos.forEach((photo) => {
    const alt = photo.alt_description;
    const url = photo.urls.small;

    $("#country-photos").append(`
    <div class="col-lg-3">
    <div class="blog-item mx-auto mb-5 mb-lg-0">
        <img class="img-fluid rounded-circle mb-4" src=${url}
            alt=${alt}>
    </div>
    </div>
    `);
  });
}

function showCountryModal() {
  const modalHtml = `
      <div class="modal fade" id="countryModal" tabindex="-1" aria-labelledby="countryModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="countryModalLabel">Country Information</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              Scroll down to see pictures of ${countryName}.
              <div id="country-info"></div>
              <div id="country-photos" class="row"></div>
            </div>
          </div>
        </div>
      </div>
    `;

  $("body").append(modalHtml);

  $("#countryModal").modal("show");
}

function addToHistory(countryName) {
  // Retrieve existing search history from local storage
  const storedHistory = localStorage.getItem("countryHistory");
  const capitalizedCountryName =
    countryName.toLowerCase().charAt(0).toUpperCase() +
    countryName.toLowerCase().slice(1);

  let result = false;

  // Parse existing search history or initialize an empty array
  const existingHistory = JSON.parse(storedHistory) || [];

  // Check if the city is already in the search history
  if (Array.isArray(existingHistory)) {
    for (let i = 0; i < existingHistory.length; i++) {
      if (
        existingHistory[i].toLowerCase() ===
        capitalizedCountryName.toLowerCase()
      ) {
        result = true;
      }
    }

    // Add the city to the search history if it's not already present
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

    updateHistoryDisplay();
  }
}

function updateHistoryDisplay() {
  $("#history").empty();

  // Retrieve the search history from local storage
  const countryHistory =
    JSON.parse(localStorage.getItem("countryHistory")) || [];

  // Append each city button to the search history display
  countryHistory.forEach((country) => {
    $("#searchHistory").append(
      `<li><button type="button" class="btn btn-secondary mb-2" data-country=${country.toLowerCase()}>${country}</button></li>`
    );
  });
}

// Event listener for clicking on a city in the search history
$("#searchHistory").on("click", "[data-country]", function () {
  countryName = $(this).attr("data-country");
  fetchCombinedData();
});

updateHistoryDisplay();
