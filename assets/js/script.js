const apiKey = '056338c5c3523a1d4e8c5724d60213d7'; // Use your actual API key

// Add event listener to the form to handle the submit event
document.getElementById('city-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const city = document.getElementById('city-input').value.trim();
    if (city) {
        fetchWeatherData(city);
        saveSearchHistory(city);
        displaySearchHistory();
    } else {
        displayErrorMessage('Please enter a city name.');
    }
});

// Function to fetch current and forecast weather data for a given city
function fetchWeatherData(city) {
    fetchCurrentWeather(city);
    fetchForecast(city);
}

// Function to fetch current weather data for a given city
function fetchCurrentWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=imperial`;
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            displayCurrentWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            displayErrorMessage('City not found. Please try again.');
        });
}

// Function to fetch 5-day weather forecast data for a given city
function fetchForecast(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=imperial`;
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            displayForecast(data);
        })
        .catch(error => {
            console.error('Error fetching weather forecast data:', error);
            displayErrorMessage('City not found. Please try again.');
        });
}

// Function to display current weather data
function displayCurrentWeather(data) {
    const currentWeather = document.getElementById('current-weather');
    currentWeather.innerHTML = `
        <div class="weather-details">
            <h3>${data.name}</h3>
            <p>${new Date(data.dt * 1000).toLocaleString()}</p>
            <p><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}"></p>
            <p>Temperature: ${data.main.temp} °F</p>
            <p>Humidity: ${data.main.humidity} %</p>
            <p>Wind Speed: ${data.wind.speed} mph</p>
        </div>
    `;
}

// Function to display 5-day weather forecast data
function displayForecast(data) {
    const forecast = document.getElementById('forecast');
    forecast.innerHTML = '';
    for (let i = 0; i < data.list.length; i += 8) {
        forecast.innerHTML += `
            <div class="forecast-details">
                <p>${new Date(data.list[i].dt * 1000).toLocaleString()}</p>
                <p><img src="https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png" alt="${data.list[i].weather[0].description}"></p>
                <p>Temperature: ${data.list[i].main.temp} °F</p>
                <p>Humidity: ${data.list[i].main.humidity} %</p>
                <p>Wind Speed: ${data.list[i].wind.speed} mph</p>
            </div>
        `;
    }
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
    searchHistoryContainer.innerHTML = '<h2>Search History</h2>';
    searchHistory.forEach(city => {
        const button = document.createElement('button');
        button.textContent = city;
        button.addEventListener('click', () => {
            fetchWeatherData(city);
        });
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

// Initialize the search history display on page load
document.addEventListener('DOMContentLoaded', displaySearchHistory);
