//Dependencies
const getWeatherButton = document.getElementById("getWeather");
const locationInput = document.getElementById("location");
const currentWeather = document.getElementById("currentWeather");
const searchHistory = document.getElementById("historyList");
const forecast = document.getElementById("forecast");
const apiKey = "some key";

//Get weather
getWeatherButton.addEventListener("click", () => {
    const city = location.locationInput.value;
    if (city) {
        fetchWeather(city);
        addtoSearchHistory(city);
        locationInput.value = "";
    }
});

//search history
searchHistory.addEventListener("click", (event) => {
    if (event.target.classList.contains("list-group-item")){
        const city =event.target.textContent;
        fetchWeather(city);
    }
});

//Fetches

