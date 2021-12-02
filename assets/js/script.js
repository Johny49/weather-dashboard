var tempUnitBtn = document.getElementById("temp-unit-btn");
var cityInputEl = document.getElementById("city-input");
var searchBtn = document.getElementById("search-btn");
// main section elements
var cityNameEl = document.getElementById("city-name");
var CurrDateEl = document.getElementById("current-date");
var tempEl = document.getElementById("temp");
var windEl = document.getElementById("wind");
var humidityEl = document.getElementById("humidity");
var uvIndexEl = document.getElementById("uv-index");

function formSubmitHandler(event) {
    event.preventDefault();

    var cityInput = cityInputEl.value.trim();
    citySearch(cityInput);
}

function citySearch(cityInput) {
    // search api using user input
    if (cityInput != null) {
        // retrieve current weather data
        getWeatherData()
    } else {
        alert("Please enter a city");
    }
}

function getWeatherData() {
    //  
}


changeTempUnit() {
    
}

// Event Handlers
submitBtn.addEventListener("submit", formSubmitHandler);
tempUnitBtn.addEventListener("click", changeTempUnit);