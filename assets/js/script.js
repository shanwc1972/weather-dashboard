// Global variables for the form elements
const submitEl = document.querySelector('#searchbutton');
const citySelectionEl = document.querySelector('#city-selection');

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
            historyItem.addEventListener('click', handleCitySearch);
        }       
    }
}

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

function updateCitySelection(callResult) {
    
    let strDate = new Date(callResult.list[0].dt*1000);
    strDate = strDate.toLocaleDateString();
    let strCityAndDate = callResult.city.name + "(" + strDate + ")";
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

function updateForecast(callResult) {

    let arrForecastData = [];
    let strDate = '';
    let strTemp = '';
    let strWindSpeed = ''
    let strHumidity = '';
    let strWicon = '';
    objWeather = {};
    
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
    console.log(arrForecastData);

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

function handleCitySearch(event) {
    //From the city input text, query the API and capture the output
    event.preventDefault();

    console.log(event);
    console.log(event.target.id);

    const cityInput = document.querySelector('#city');

    if(event.target.id != "searchbutton") {
        cityInput.value = event.target.id
    } else{
            if (!cityInput.value) {
                alert('You need to enter a city. Please try again')
                return;
            }
        }

    const queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput.value}&appid=c5b8bb91e48454aab366682512e22626&units=metric`
    console.log(queryURL);

    fetch(queryURL)
        .then(function (response) {
            if (response.status !== 200) {
                alert("City not recognized");
            }
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function (callResult) {
            
            updateCitySelection(callResult);
            updateForecast(callResult);
            updateSearchHistory(callResult.city.name);
        })
        .catch(function (error) {
            console.error(error);
        });

        cityInput.value = "";
}

submitEl.addEventListener('click', handleCitySearch);

retrieveSearchHistory();