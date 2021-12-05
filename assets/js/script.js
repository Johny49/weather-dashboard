var tempUnitBtn = document.getElementById("temp-unit-btn");
var cityInputEl = document.getElementById("location");
var searchFormEl = document.getElementById("location-form");
// main section elements
var cityNameEl = document.getElementById("city-name");
var currDateEl = document.getElementById("current-date");
var currentConditionsImg = document.getElementById("current-conditions-icon");
var tempEl = document.getElementById("temp");
var windEl = document.getElementById("wind");
var humidityEl = document.getElementById("humidity");
var uvIndexEl = document.getElementById("uv-index");
// set unit type
var unitType = "imperial";

function formSubmitHandler(event) {
    event.preventDefault();
    var cityInput = cityInputEl.value.trim();
    if (cityInput != "") {
        citySearch(cityInput);
    }
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
                        // save location to history
                        // saveLocation(loc);
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
                    // save current weather info, then call function to display on screen
                    var current = [{loc: loc, temp: Math.round(data.current.temp), wind: data.current.wind_speed, humidity: data.current.humidity, uvi: data.current.uvi, icon_info: data.current.weather}];
                    displayCurrent(current);

                    // save forecast info, then call function to display on screen
                    var forecast = [];
                    for (var i = 0; i < 5; i++) {
                        var day = [{maxTemp: Math.round(data.daily[i].temp.max), minTemp: Math.round(data.daily[i].temp.min), wind: data.daily[i].wind_speed, humidity: data.daily[i].humidity, icon_info: data.daily[i].weather
                        }];
                        forecast.push(day);
                    }
                    displayForecast(forecast);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to access weather data");
        });
}

function displayCurrent(current) {
    // display returned info on 
    cityNameEl.textContent = current[0].loc;
    currDateEl.textContent = moment().format("dddd, MMMM D, YYYY");
    currentConditionsImg.src = displayConditionsIcon(current[0].icon_info[0].icon);
    currentConditionsImg.alt = current[0].icon_info[0].description;
    if (unitType === "imperial") {
        tempEl.textContent = current[0].temp + "°F";
    } else {
        tempEl.textContent = current[0].temp + "°C";
    }
    windEl.textContent = current[0].wind;
    humidityEl.textContent = current[0].humidity + "%";
    uvIndexEl.textContent = current[0].uvi;
}

function displayForecast(forecast) {
    var forecastEl = document.querySelector(".forecast");
    // remove any existing child elements
    removeAllChildNodes(forecastEl);
    // loop through days in forecast and generate elements to display
    for (day in forecast) {
        var forecastCardEl = document.createElement("section");
        forecastCardEl.setAttribute("class", `col-md-3 col-sm-4 col-lg p-2 m-1 bg-primary text-white ${day}`);
        forecastEl.appendChild(forecastCardEl);
        var forecastDayEl = document.createElement("h5");
        forecastCardEl.appendChild(forecastDayEl);
        const tomorrow = moment().add(1, "days");
        forecastDayEl.textContent = tomorrow.add(day, "days").format("M/D/YYYY");
        console.log("day= " + day + "moment: " + forecastDayEl.textContent);
        forecastConditionImg = document.createElement('img');
        console.log(forecast[day][0]);
        forecastConditionImg.src = displayConditionsIcon(forecast[day][0].icon_info[0].icon);
        forecastConditionImg.alt = forecast[day][0].icon_info[0].description;
        // var conditionsIcon = "";
        forecastDayEl.appendChild(forecastConditionImg);
        var lowTempEl = document.createElement("p");
        if (unitType === "imperial") {
            lowTempEl.textContent = "L " + forecast[day][0].minTemp + "°F";
        } else {
            lowTempEl.textContent = "L " + forecast[day][0].minTemp + "°C";
        }       
        forecastCardEl.appendChild(lowTempEl);
        var highTempEl = document.createElement("p");
        if (unitType === "imperial") {
            highTempEl.textContent = "H " + forecast[day][0].maxTemp + "°F";
        } else {
            highTempEl.textContent = "H " + forecast[day][0].maxTemp + "°C";
        }  
        forecastCardEl.appendChild(highTempEl);
        var windEl = document.createElement("p");
        windEl.textContent = "Wind: " + forecast[day][0].wind;
        forecastCardEl.appendChild(windEl);
        var humidityEl = document.createElement("p");
        humidityEl.textContent = "Humidity:" + forecast[day][0].humidity + "%";
        forecastCardEl.appendChild(humidityEl);
    }
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function displayConditionsIcon(iconCode) { 
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

function saveLocation(loc) {
    // retrieve existing saved array or create new;
    var savedLocations = JSON.parse(localStorage.getItem("saved-locations")) || [];

    // check for duplicate and add location if unique; if exists already, move to top of list
    if (savedLocations.includes(loc)) {
        const index = savedLocations.indexOf(loc);
        savedLocations.push(savedLocations.splice(index, 1)[0]);
    } else {
        savedLocations.push(loc);
    }
    // save to localStorage
    localStorage.setItem("saved-locations", JSON.stringify(savedLocations));

    loadSavedLocations();
}

function loadSavedLocations() {
    // load any saved locations from localStorage and display as buttons
    const savedLocations = JSON.parse(localStorage.getItem("saved-locations")) || [];
    for (location of savedLocations) {
        var savedLocBtn = document.createElement("button");
        savedLocBtn.setAttribute("class", "btn btn-secondary");
        savedLocBtn.textContent = location;
        search-history.appendChild(savedLocBtn);
    }
}

function setUnits() {
//  retrieve preferred units from localStorage if exists
    var savedUnits = localStorage.getItem("saved-units");
    // set units
    unitType = savedUnits;
    if (unitType === "metric") {
        tempUnitBtn.textContent = "C";
    } else {
        tempUnitBtn.textContent = "F";
    }
}

function changeTempUnit() {
    // use to specify query param for units; stored in local storage; imperial is default
    if (unitType === "imperial") {
        unitType = "metric";
        tempUnitBtn.textContent = "C";
    } else {
        unitType = "imperial";
        tempUnitBtn.textContent = "F";
    }
    localStorage.setItem("saved-units", unitType);

    // redo current search with new unit unless search field is empty
    var cityInput = cityInputEl.value.trim();
        if (cityInput != "") {
            citySearch(cityInput);
        }
}

setUnits();
// loadSavedLocations();

// Event Handlers
tempUnitBtn.addEventListener("click", changeTempUnit);
searchFormEl.addEventListener('submit', formSubmitHandler);
