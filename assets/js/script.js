// global variables
cityInputEl = document.querySelector("#city-input");
// eventsContainerEl = document.querySelector("#)

// form handler function: needs to prevent default and run getEvents and getBreweries
var formSubmitHandler = function (event) {
  event.preventDefault();

  var city = cityInputEl.value.trim();

  if (city) {
    cityInputEl.value = "";
  } else {
    alert("Please enter a city name.");
  }

  getEvents(city);
  getBreweries(city);
};

// getEvents function: return info from Ticketmaster
var getEvents = function (city) {
  var apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?size=1&apikey=4328UK6uESMfw57GtWI99vk5Gb15zK1Q&city=${city}`;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          displayEvents(data);
        });
      } else {
        alert("Error: City not found.");
      }
    })
    .catch(function (error) {
      alert("Unable to connect to server.");
    });
};

getEvents("Durham");

// getBreweries: return info from Open Breweries
var getBreweries = function (city) {
  var apiUrl = `https://api.openbrewerydb.org/breweries?by_city=${city}`;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          displayBreweries(data);
        });
      } else {
        alert("Error: City not found.");
      }
    })
    .catch(function (error) {
      alert("Unable to connect to server.");
    });
};

getBreweries("Durham");

// displayBreweries: displays brewery information to the page
var displayBreweries = function (data) {
  for (var i = 0; i < 5; i++) {
    data[i].name;
    data[i].street;
    data[i].postal_code;
  }
};

// displayEvents: displays event information to the page
var displayEvents = function (data) {
  for (var i = 0; i < 5; i++) {
    data._embedded.events[i].name;
    data._embedded.events[i].dates.start.localDate;
    data._embedded.events[i].dates.start.localTime;
    data._embedded.events[i].priceRanges[i].min;
    data._embedded.events[i].priceRanges[i].max;
    data._embedded.events[i].images[0].url;
    //need to look at image ratio information for embedding in card
    data._embedded.events[i].url;
    data._embedded.events[i]._embedded.venues[0];
  }
};

// storeCities function: needs to save search history to local storage
var storeCities = function (city) {
  citiesArray = JSON.parse(localStorage.getItem("search-history")) || [];
  citiesArray.push(city);
  localStorage.setItem("search-history", JSON.stringify(citiesArray));
};

var loadCities = function () {
  var storedCities = JSON.parse(localStorage.getItem("search-history"));

  for (var i = 0; i < storedCities.length; i++) {
    searchHistoryButtonEl.setAttribute("data-search", storedCities[i]);
  }
};

//   $(document).ready(loadCities);

//event listener for submit form
submitButtonEl.addEventListener("click", formSubmitHandler);

//event listener for search history buttons
document
  .querySelector("#search-history")
  .addEventListener("click", function (event) {
    event.preventDefault();
    var city = event.target.dataset.search;
    getBreweries(city);
    getEvents(city);
  });
