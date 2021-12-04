var tempUnitBtn = document.getElementById("temp-unit-btn");
var cityInputEl = document.getElementById("location");
var searchFormEl = document.getElementById("location-form");
// main section elements
var cityNameEl = document.getElementById("city-name");
var currDateEl = document.getElementById("current-date");
var tempEl = document.getElementById("temp");
var windEl = document.getElementById("wind");
var humidityEl = document.getElementById("humidity");
var uvIndexEl = document.getElementById("uv-index");
// set unit type
var unitType = "imperial";

function formSubmitHandler(event) {
    event.preventDefault();
    var cityInput = cityInputEl.value.trim();
    citySearch(cityInput);
}

function citySearch(cityInput) {
    // search geo api using user input
    if (cityInput != null) {
        // use geo api to find lat,lon for input city
        apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityInput + "&limit=1&appid=858d2ac1d226880ff65be3ab6336fd05";
        fetch(apiUrl)
            .then(function (response) {
                if (response.ok) {
                    response.json().then(function (data) {
                        const lat = data[0].lat;
                        const lon = data[0].lon;
                        //  store standardized name from api for display
                        const loc = data[0].name;
                        getWeatherData(lat, lon, loc)
                    });
                } else {
                    alert('Error: ' + response.statusText);
                }
            })
            .catch(function (error) {
                alert('Unable to retrieve location');
            });
    } else {
        alert("Please enter a city");
    }
}

function getWeatherData(lat, lon, loc) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=" + unitType + "&appid=858d2ac1d226880ff65be3ab6336fd05"
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    // display returned info on screen
                    var current = [{loc: loc, temp: Math.round(data.current.temp), wind: data.current.wind_speed, humidity: data.current.humidity, uvi: data.current.uvi}];
                    displayCurrent(current);
                    // cityNameEl.textContent = loc
                    // currDateEl.textContent = moment().format("dddd, MMMM D, YYYY");
                    // tempEl.textContent = Math.round(data.current.temp);
                    // windEl.textContent = data.current.wind_speed;
                    // humidityEl.textContent = data.current.humidity;
                    // uvIndexEl.textContent = data.current.uvi;
                    var forecast = [];
                    displayForecast(forecast);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to connect");
        });
}

function displayCurrent(current) {
    // display returned info on 
    console.log(current);
    cityNameEl.textContent = current[0].loc;
    currDateEl.textContent = moment().format("dddd, MMMM D, YYYY");
    tempEl.textContent = current[0].temp;
    windEl.textContent = current[0].wind;
    humidityEl.textContent = current[0].humidity + "%";
    uvIndexEl.textContent = current[0].uvi;
    var forecast = [];
    displayForecast(forecast);
}

function displayForecast(forecast) {

}

function changeTempUnit() {
    // use to specify query param for units; stored in local storage; imperial is default
    if (unitType === "imperial") {
        unitType = "metric";
        tempUnitBtn.textContent = "C" 
    } else {
        unitType = "imperial";
        tempUnitBtn.textContent = "F";
    }
    // redo current search with new unit
    var cityInput = cityInputEl.value.trim();
    console.log(cityInput);
        if (cityInput != "") {
            citySearch(cityInput);
        }
}

// Event Handlers
searchFormEl.addEventListener('submit', formSubmitHandler);
tempUnitBtn.addEventListener("click", changeTempUnit);