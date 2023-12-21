const apiKey = "k9SrgKI8_B-JaT2ZrodZDd4IshQVVK8viOCG1HZQlL0";
const cityName = "Ukraine";

const photoshUrl = `https://api.unsplash.com/search/photos?query=${cityName}&client_id=${apiKey}`;
const countriesUrl = `https://restcountries.com/v3.1/name/${cityName}`;

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

const execute = () => {
  Promise.all([fetchDataFromAPI(photoshUrl), fetchDataFromAPI(countriesUrl)])
    .then((results) => {
      console.log(results[0]);
      console.log(results[1]);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

execute();
