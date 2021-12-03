var tempUnitBtn = document.getElementById("temp-unit-btn");
var cityInputEl = document.getElementById("location");
var searchFormEl = document.getElementById("location-form");
// main section elements
var cityNameEl = document.getElementById("city-name");
var CurrDateEl = document.getElementById("current-date");
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
    apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=milwaukee&limit=1&appid=858d2ac1d226880ff65be3ab6336fd05";
    fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
             var lat = data[0].lat;
             var lon = data[0].lon;
            getWeatherData(lat, lon)
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

function getWeatherData(lat, lon) {
var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=metric&appid=858d2ac1d226880ff65be3ab6336fd05"
fetch(apiUrl)
.then(function (response) {
  if (response.ok) {
    response.json().then(function (data) {
    // display returned info on screen
    console.log(data);
    });
  } else {
    alert("Error: " + response.statusText);
  }
})
.catch(function (error) {
  alert("Unable to connect");
});
}

function changeTempUnit() {
// use to specify query param for units; stored in local storage; imperial is default
    (unitType = "imperial" ? "metric" : "imperial"); 
}

// Event Handlers
searchFormEl.addEventListener('submit', formSubmitHandler);
tempUnitBtn.addEventListener("click", changeTempUnit);