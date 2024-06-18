const apiKey = '056338c5c3523a1d4e8c5724d60213d7';

// Add event listener to the form to handle the submit event
document.getElementById('city-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const city = document.getElementById('city-input').value;
    fetchWeather(city);
    saveSearchHistory(city);
    displaySearchHistory();
});

// Function to fetch weather data for a given city
function fetchWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            displayCurrentWeather(data);
            displayForecast(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            displayErrorMessage('City not found. Please try again.');
        });
}

// Function to display current weather data
function displayCurrentWeather(data) {
    const currentWeather = document.getElementById('current-weather');
    const localTime = convertToUserLocalTime(new Date(data.list[0].dt * 1000));
    currentWeather.innerHTML = `
        <div class="weather-details">
            <h3>${data.city.name}</h3>
            <p>${localTime.toLocaleString()}</p>
            <p><img src="https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png" alt="${data.list[0].weather[0].description}"></p>
            <p>Temperature: ${data.list[0].main.temp} °F</p>
            <p>Humidity: ${data.list[0].main.humidity} %</p>
            <p>Wind Speed: ${data.list[0].wind.speed} mph</p>
        </div>
    `;
}

// Function to display 5-day weather forecast data
function displayForecast(data) {
    const forecast = document.getElementById('forecast');
    forecast.innerHTML = '';
    for (let i = 0; i < data.list.length; i += 8) {
        const localTime = convertToUserLocalTime(new Date(data.list[i].dt * 1000));
        forecast.innerHTML += `
            <div class="forecast-details">
                <p>${localTime.toLocaleString()}</p>
                <p><img src="https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png" alt="${data.list[i].weather[0].description}"></p>
                <p>Temperature: ${data.list[i].main.temp} °F</p>
                <p>Humidity: ${data.list[i].main.humidity} %</p>
                <p>Wind Speed: ${data.list[i].wind.speed} mph</p>
            </div>
        `;
    }
}

// Function to convert UTC time to user's local time
function convertToUserLocalTime(date) {
    const userTimeZoneOffset = new Date().getTimezoneOffset() * 60000;
    const localTime = new Date(date.getTime() - userTimeZoneOffset);
    return localTime;
}

// Function to save a city to the search history in localStorage
function saveSearchHistory(city) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
}

// Function to display the search history
function displaySearchHistory() {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const searchHistoryContainer = document.getElementById('search-history');
    searchHistoryContainer.innerHTML = '';
    searchHistory.forEach(city => {
        const button = document.createElement('button');
        button.textContent = city;
        button.addEventListener('click', () => fetchWeather(city));
        searchHistoryContainer.appendChild(button);
    });
}

// Function to display error messages
function displayErrorMessage(message) {
    const currentWeather = document.getElementById('current-weather');
    currentWeather.innerHTML = `
        <div class="weather-details">
            <p>${message}</p>
        </div>
    `;
}
