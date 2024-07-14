// Global variables for the form elements
const submitEl = document.querySelector('#searchbutton');
const citySelectionEl = document.querySelector('#city-selection');
const forecastEl = document.querySelector('#five-day-forecast');

//The following function checks local storage for existing search history and populates the search history buttons
function retrieveSearchHistory(){
    let arrHistory = JSON.parse(localStorage.getItem('SearchHistory'));
    if (arrHistory != null) {
        let searchHistoryEl = document.querySelector('#search-history');
        //Empty out any child nodes if there are any
        while (searchHistoryEl.firstChild) {
            searchHistoryEl.removeChild(searchHistoryEl.firstChild);
        }
        for(let i=0; i<arrHistory.length; i++) {
            historyItem = document.createElement("button");
            historyItem.setAttribute('id', `${arrHistory[i]}`);
            historyItem.textContent = arrHistory[i];
            searchHistoryEl.appendChild(historyItem);
            //Create a listener for each spawned button
            historyItem.addEventListener('click', handleCitySearch);
        }       
    }
}

//The following function pushes the most recent search to the top of the search history updating the local storage accordingly
function updateSearchHistory(strCity) {
    let arrHistory = JSON.parse(localStorage.getItem('SearchHistory'));
    if(arrHistory == null){
        arrHistory = [];
    }
    if (!arrHistory.includes(strCity)) {
        arrHistory.unshift(strCity);
    }
    //Limit the history to 8 values by popping out the last item
    if(arrHistory.length > 8) {
        arrHistory.pop()
    }
   
    localStorage.setItem('SearchHistory', JSON.stringify(arrHistory));
    retrieveSearchHistory();
}

//The following function populates the current city selection from data gathered by the API 
function updateCitySelection(callResult) {
    
    let strDate = new Date(callResult.list[0].dt*1000);
    strDate = strDate.toLocaleDateString();
    let strCityAndDate = callResult.city.name + "(" + strDate + ")";
    //Add a weather icon to header
    let iconurl = "http://openweathermap.org/img/w/" + callResult.list[0].weather[0].icon + ".png";
    const wicon = document.createElement("img");
    wicon.setAttribute('src', iconurl);
    let strTemperature = callResult.list[0].main.temp;
    let strWindSpeed = (callResult.list[0].wind.speed * 3.6).toFixed(3);
    let strHumidity = callResult.list[0].main.humidity;
    
    // Populate the selected city with Temp, Wind amd Humidity data from the API
    citySelectionEl.children[0].textContent = strCityAndDate;
    citySelectionEl.children[0].appendChild(wicon);
    citySelectionEl.children[1].children[0].textContent = "Temp: " + strTemperature + " ° celsius";
    citySelectionEl.children[1].children[1].textContent = "Wind: " + strWindSpeed + " km/h";
    citySelectionEl.children[1].children[2].textContent = "Humidity: " + strHumidity + " %";
}

//The following function populates the 5 day forecast section using an an array of weather objects
function updateForecast(callResult) {

    let arrForecastData = [];
    let strDate = '';
    let strTemp = '';
    let strWindSpeed = ''
    let strHumidity = '';
    let strWicon = '';
    objWeather = {};
    
    //Display the 5 day forecast section
    forecastEl.style.display = "grid";
    
    //Build an array of weather objects comprising temp, wind speed and humidityfor next five days
    for(let i=0; i<5; i++) {
        //set the index offset for the forecast list table
        j=((i+1)*8-1);
        strDate = callResult.list[j].dt*1000;
        strTemp = callResult.list[j].main.temp;
        strWindSpeed = (callResult.list[j].wind.speed * 3.6).toFixed(3);
        strHumidity = callResult.list[j].main.humidity;
        strWicon = callResult.list[j].weather[0].icon;
        objWeather.date = strDate;
        objWeather.temp = strTemp;
        objWeather.windspeed = strWindSpeed;
        objWeather.humidity = strHumidity;
        objWeather.wicon = strWicon;
        arrForecastData.push(objWeather);
        objWeather= {};
    }

    let cardEl = null;
    let day = {};
    //Use the array to populate each of the Forecast cards
    for(let i=0; i<arrForecastData.length; i++){
        cardEl = document.querySelector(`#day${i+1}`);
        day = arrForecastData[i];
        let iconurl = "http://openweathermap.org/img/w/" + day.wicon + ".png";
        ForecastDate = new Date(day.date);
        cardEl.children[0].textContent = ForecastDate.toLocaleDateString();
        cardEl.children[1].children[0].setAttribute('src', iconurl);
        cardEl.children[1].children[1].children[0].textContent = "Temp: " + day.temp + " ° celsius";
        cardEl.children[1].children[1].children[1].textContent = "Wind: " + day.windspeed + " km/h";
        cardEl.children[1].children[1].children[2].textContent = "Humidity: " + day.humidity + " %";
    }

}

//This function is the handler for all button click events
function handleCitySearch(event) {
    //From the city input text, query the API and capture the output
    event.preventDefault();

    const cityInput = document.querySelector('#city');

    //Determine if the button is the search or one of the history buttons and then process acccordingly
    if(event.target.id != "searchbutton") {
        cityInput.value = event.target.id
    } else{
            if (!cityInput.value) {
                alert('You need to enter a city. Please try again')
                return;
            }
        }

    const queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput.value}&appid=c5b8bb91e48454aab366682512e22626&units=metric`
    //Log our query URL to the console.log to ensure that the API call is correct 
    console.log(queryURL);

    fetch(queryURL)
        .then(function (response) {
            //Provide an error alert if the there is API data
            if (response.status !== 200) {
                alert("City not recognized");
            }
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function (callResult) {
            //Process the API data if valid
            updateCitySelection(callResult);
            updateForecast(callResult);
            updateSearchHistory(callResult.city.name);
        })
        .catch(function (error) {
            console.error(error);
        });

        cityInput.value = "";
}

//Event listener for the search button 
submitEl.addEventListener('click', handleCitySearch);

//Hide the 5 day forecast by default
forecastEl.style.display = "none";
//Check and display any search history items
retrieveSearchHistory();