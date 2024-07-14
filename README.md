# Task-Board

## Description

This application represents you with a weather dashboard that can display the current weather, plus a five day forecast for a given city derived from the openweather API. The dashboard will save a history of the past eight searches in local storage which can be accessed if the browser is closed and the dashboard reloaded.


## Installation

N/A

## Usage

Website can be reached by https://shanwc1972.github.io/weather-dashboard.


The following images shows the web application's appearance and functionality:

![Weather dashboard new startup](https://github.com/user-attachments/assets/044eafbf-23a1-4f49-8c40-9f62c988edb8)

![Weather dashboard with city displayed](https://github.com/user-attachments/assets/3eb15f31-1767-42e9-a01d-2be5c418f906)

![Weather dashboard with search history items](https://github.com/user-attachments/assets/1a531373-19cb-4560-82cc-78d2becae865)

The weather application dashboard is initially empty. By entering a city into a search field and clicking the search button, the dashboard should populate details pertaining to the city's weather including its temperature, wind speed, humidity along with a weather icon (sunny, cloudy, raining, etc.). The application will provide alerts if the provided city input is blank or invalid. Should a valid city be provided, the weather dashboard will retrieve data via the openweather API and present details of the city's current weather, as well as a five day forecast. The dashboard will also record a history of valid searches. Submit buttons will appear for each search history item as cities are searched for. The search history is limited to eight items, whereby the last item will be removed in favor of a new search. If the city is entered that already appears within the eight window history, it is not addded again. By clicking on any of these history buttons, the weather data for that city will populate accordingly.


## Credits

Javascript code located in assets/js, as well as supporting HTML and CSS files were composed by Warren Shan

## License

N/A
