//Dependencies
const getWeatherButton = document.getElementById("getWeather");
const locationInput = document.getElementById("location");
const currentWeather = document.getElementById("currentWeather");
const searchHistory = document.getElementById("historyList");
const forecast = document.getElementById("forecast");
const apiKey = "0615a270744e55b9a49bb04899dbef3a";

// Function to add a city to the search history and local storage
function addtoSearchHistory(city) {
    const listItem = document.createElement("li");
    listItem.textContent = city;
    listItem.classList.add("list-group-item");
    searchHistory.appendChild(listItem);

    // Save the search to local storage
    saveSearchToLocalStorage(city);
}

// Function to save it
function saveSearchToLocalStorage(city) {
    
    // Retrieve the existing search history from local or initialize it as empty
    const existingSearches = JSON.parse(localStorage.getItem("searchHistory")) || [];

    // Add the new search to the array
    existingSearches.push(city);

    // Save the updated search history back to local storage
    localStorage.setItem("searchHistory", JSON.stringify(existingSearches));
}

// Function to load and display search history from local storage
function loadSearchHistoryFromLocalStorage() {
    const savedSearches = JSON.parse(localStorage.getItem("searchHistory"));

    if (savedSearches && savedSearches.length > 0) {
        savedSearches.forEach((city) => {
            addtoSearchHistory(city);
        });
    }
}

// Load and display search history when the page loads
loadSearchHistoryFromLocalStorage();

//Get weather
getWeatherButton.addEventListener("click", () => {
    const city = locationInput.value;
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
    //for clicking a city in the search history
searchHistory.addEventListener("click", (event) => {
    if (event.target.classList.contains("list-group-item")){
        const city = event.target.textContent;
        fetchWeather(city);
    }
});

    //getting weather
function fetchWeather(city) {
    currentWeather.innerHTML = "";
    forecast.innerHTML = "";

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)

        .then((response) => response.json())
        .then((data) => {
            const weatherData = {
                name: data.name,
                description: data.weather[0].description,
                temperature: (data.main.temp - 273.15).toFixed(2),
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
            };
            currentWeather.innerHTML = `
                <h2>${weatherData.name}</h2>
                <p>${weatherData.description}</p>
                <p>Temp: ${weatherData.temperature}°C</p>
                <p>Humidity: ${weatherData.humidity}%</p>
                <p>Wind Speed: ${weatherData.windSpeed} m/s</p>
            `;

            fetch5DayForecast(city);
        })
        .catch((error) => {
            console.error("Error fetching weather data: ", error);
        });
}

//Function for fetching 5-Day forecast
function fetch5DayForecast(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
        .then((response) => response.json())
        .then((data) => {
            // Display forecast
            const forecastData = data.list.filter((item) => item.dt_txt.includes('12:00:00'));
            forecast.innerHTML = '<h2>5-Day Forecast</h2>';
            forecastData.forEach((day) => {
                const date = new Date(day.dt * 1000);
                const icon = day.weather[0].icon;
                const temperature = (day.main.temp - 273.15).toFixed(2);
                const humidity = day.main.humidity;
                const windSpeed = day.wind.speed;
                const iconUrl = `https://openweathermap.org/img/w/${icon}.png`;

                // Create an individual forecast box
                const forecastBox = document.createElement("div");
                forecastBox.classList.add("forecast-item");
                forecastBox.innerHTML = `
                    <p>Date: ${date.toDateString()}</p>
                    <p>Temp: ${temperature}°C</p>
                    <p>Humidity: ${humidity}%</p>
                    <p>Wind Speed: ${windSpeed} m/s</p>
                    <img src="${iconUrl}" alt="${day.weather[0].description}">
                `;

                // Append the box to the forecast container
                forecast.appendChild(forecastBox);
            });
        })
        .catch((error) => {
            console.error("Error fetching 5-Day Forecast data: ", error);
        });
}

//function for adding a city to the search history
function addtoSearchHistory(city) {
    const listItem = document.createElement("li");
    listItem.textContent = city;
    listItem.classList.add("list-group-item");
    searchHistory.appendChild(listItem);
}
