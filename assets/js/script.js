// global variables
var cityInputEl = document.querySelector("#city-input");
var eventsContainerEl = document.querySelector("#events");
var breweriesContainerEl = document.querySelector("#breweries");
var submitButtonEl = document.querySelector("#button");
var searchHistoryContainerEl = document.querySelector("#recent-searches");

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

  storeCities(city);
  loadCities();
};

// getEvents function: return info from Ticketmaster
var getEvents = function (city) {
  var apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?size=5&apikey=4328UK6uESMfw57GtWI99vk5Gb15zK1Q&city=${city}`;

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

// displayBreweries: displays brewery information to the page
var displayBreweries = function (data) {
  breweriesContainerEl.textContent = "";
  for (var i = 0; i < 9; i++) {
    console.log("working");

    var breweryCard = document.createElement("div");
    breweryCard.setAttribute("class", "card m-3 has-background-link-dark");
    var breweryCardTitle = document.createElement("h2");
    breweryCardTitle.setAttribute(
      "class",
      "has-text-weight-semibold has-text-centered is-size-3 has-text-white"
    );
    breweryCardTitle.textContent = data[i].name;

    var breweryCardStreet = document.createElement("p");
    var breweryCardPostalCode = document.createElement("p");

    breweryCardStreet.textContent = `Address: ${data[i].street}`;
    breweryCardPostalCode.textContent = data[i].postal_code;
    breweryCardStreet.setAttribute("class", "is-size-4 m-2 p-2 has-text-white");
    breweryCardPostalCode.setAttribute(
      "class",
      "is-size-4 m-2 p-2 has-text-white"
    );

    breweryCard.appendChild(breweryCardTitle);
    breweryCard.appendChild(breweryCardStreet);
    breweryCard.appendChild(breweryCardPostalCode);
    breweriesContainerEl.appendChild(breweryCard);
  }
};

// displayEvents: displays event information to the page
var displayEvents = function (data) {
  eventsContainerEl.textContent = "";

  for (var i = 0; i < data._embedded.events.length; i++) {
    console.log("working");

    var eventCard = document.createElement("div");
    eventCard.setAttribute("class", "card m-2 has-background-link-dark");
    var eventCardTitle = document.createElement("h2");
    eventCardTitle.setAttribute(
      "class",
      "has-text-weight-semibold has-text-centered is-size-3 has-text-white"
    );
    eventCardTitle.textContent = data._embedded.events[i].name;

    var eventCardStartDate = document.createElement("p");
    var eventCardStartTime = document.createElement("p");
    var eventCardUrl = document.createElement("a");
    var eventCardVenue = document.createElement("p");
    var eventCardImg = document.createElement("img");

    eventCardStartDate.setAttribute(
      "class",
      "ml-5 has-text-left is-size-4 has-text-white"
    );
    eventCardStartTime.setAttribute(
      "class",
      "ml-5 has-text-left is-size-4 has-text-white"
    );
    eventCardUrl.setAttribute(
      "class",
      "has-text-left is-size-4 m-2 has-text-white"
    );
    eventCardVenue.setAttribute(
      "class",
      "ml-5 has-text-left is-size-4 has-text-white"
    );
    eventCardImg.setAttribute("class", "card-image image is-128x128 ml-4 p-2");
    eventCardImg.setAttribute("src", data._embedded.events[i].images[i].url);

    eventCardStartDate.textContent = `Start date: ${data._embedded.events[i].dates.start.localDate}`;
    eventCardStartTime.textContent = `Start time: ${data._embedded.events[i].dates.start.localTime}`;
    eventCardImg.textContent = data._embedded.events[i].images[i].url;

    //need to look at image ratio information for embedding in card
    eventCardUrl.href = data._embedded.events[i].url;
    eventCardUrl.innerHTML = "For more details click here.";
    eventCardVenue.textContent = `Venue: ${data._embedded.events[i]._embedded.venues[0].name}`;

    eventCard.appendChild(eventCardTitle);
    eventCard.appendChild(eventCardImg);
    eventCard.appendChild(eventCardStartDate);
    eventCard.appendChild(eventCardStartTime);
    eventCard.appendChild(eventCardVenue);
    eventCard.appendChild(eventCardUrl);
    eventsContainerEl.appendChild(eventCard);
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

  searchHistoryContainerEl.textContent = "";

  for (var i = 0; i < storedCities.length; i++) {
    var searchHistoryButtonEl = document.createElement("button");
    searchHistoryButtonEl.textContent = storedCities[i];
    searchHistoryButtonEl.setAttribute("data-search", storedCities[i]);
    searchHistoryButtonEl.setAttribute("type", "submit");
    searchHistoryButtonEl.setAttribute(
      "class",
      "button is-link is-outlined is-rounded mx-3"
    );

    searchHistoryContainerEl.appendChild(searchHistoryButtonEl);
  }
};

$(document).ready(loadCities);

//event listener for submit form
submitButtonEl.addEventListener("click", formSubmitHandler);

//event listener for search history buttons
searchHistoryContainerEl.addEventListener("click", function (event) {
  event.preventDefault();
  var city = event.target.dataset.search;
  getBreweries(city);
  getEvents(city);
});
