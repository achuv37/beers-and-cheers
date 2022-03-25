// global variables
var cityInputEl = document.querySelector("#city-input");
var eventsContainerEl = document.querySelector("#events");
var breweriesContainerEl = document.querySelector("#breweries");
var submitButtonEl = document.querySelector("#button");

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
  for (var i = 0; i < 5; i++) {
    console.log("working");

    var breweryCard = document.createElement("div");
    breweryCard.setAttribute("class", "card");
    var breweryCardTitle = document.createElement("h2");
    breweryCardTitle.setAttribute("class", "card-header-title");
    breweryCardTitle.textContent = data[i].name;

    var breweryCardStreet = document.createElement("p");
    var breweryCardPostalCode = document.createElement("p");

    breweryCardStreet.textContent = `Address: ${data[i].street}`;
    breweryCardPostalCode.textContent = data[i].postal_code;
    breweryCardStreet.setAttribute("class", "card-content");
    breweryCardPostalCode.setAttribute("class", "card-content");

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
    eventCard.setAttribute("class", "card");
    var eventCardTitle = document.createElement("h2");
    eventCardTitle.setAttribute("class", "card-header-title");
    eventCardTitle.textContent = data._embedded.events[i].name;

    var eventCardStartDate = document.createElement("p");
    var eventCardStartTime = document.createElement("p");
    var eventCardPriceMin = document.createElement("p");
    var eventCardPriceMax = document.createElement("p");
    var eventCardUrl = document.createElement("p");
    var eventCardVenue = document.createElement("p");
    var eventCardImg = document.createElement("img");

    eventCardStartDate.setAttribute("class", "card-content");
    eventCardStartTime.setAttribute("class", "card-content");
    eventCardPriceMin.setAttribute("class", "card-content");
    eventCardPriceMax.setAttribute("class", "card-content");
    eventCardUrl.setAttribute("class", "card-content");
    eventCardVenue.setAttribute("class", "card-content");
    eventCardImg.setAttribute("class", "card-image");
    eventCardImg.setAttribute("class", "card-image image is-128x128 ml-2");
    eventCardImg.setAttribute("src", data._embedded.events[i].images[i].url)

    eventCardStartDate.textContent = `Start date: ${data._embedded.events[i].dates.start.localDate}`;
    eventCardStartTime.textContent = `Start time: ${data._embedded.events[i].dates.start.localTime}`;
    eventCardPriceMin.textContent = `Lowest price: ${data._embedded.events[i].priceRanges[0].min}`;
    eventCardPriceMax.textContent = `Highest price: ${data._embedded.events[i].priceRanges[0].max}`;
    eventCardImg.textContent = data._embedded.events[i].images[i].url;

    //need to look at image ratio information for embedding in card
    eventCardUrl.textContent = `URL: ${data._embedded.events[i].url}`;
    eventCardVenue.textContent = `Venue: ${data._embedded.events[i]._embedded.venues[0].name}`;

    eventCard.appendChild(eventCardTitle);
    eventCard.appendChild(eventCardImg);
    eventCard.appendChild(eventCardStartDate);
    eventCard.appendChild(eventCardStartTime);
    eventCard.appendChild(eventCardPriceMin);
    eventCard.appendChild(eventCardPriceMax);
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

  for (var i = 0; i < storedCities.length; i++) {
    searchHistoryButtonEl.setAttribute("data-search", storedCities[i]);
  }
};

//   $(document).ready(loadCities);

//event listener for submit form
submitButtonEl.addEventListener("click", formSubmitHandler);

//event listener for search history buttons
// document
//   .querySelector("#search-history")
//   .addEventListener("click", function (event) {
//     event.preventDefault();
//     var city = event.target.dataset.search;
//     getBreweries(city);
//     getEvents(city);
//   });
