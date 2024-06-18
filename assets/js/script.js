const apiKey = 'YOUR_API_KEY';

document.getElementById('city-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const city = document.getElementById('city-input').value;
    fetchWeather(city);
    saveSearchHistory(city);
    displaySearchHistory();
});

function fetchWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            displayForecast(data);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function displayCurrentWeather(data) {
    const currentWeather = document.getElementById('current-weather');
    currentWeather.innerHTML = `
        <div class="weather-details">
            <h3>${data.city.name}</h3>
            <p>${new Date(data.list[0].dt_txt).toLocaleDateString()}</p>
            <p><img src="https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png" alt="${data.list[0].weather[0].description}"></p>
            <p>Temperature: ${data.list[0].main.temp} °C</p>
            <p>Humidity: ${data.list[0].main.humidity} %</p>
            <p>Wind Speed: ${data.list[0].wind.speed} m/s</p>
        </div>
    `;
}

function displayForecast(data) {
    const forecast = document.getElementById('forecast');
    forecast.innerHTML = '';
    for (let i = 0; i < data.list.length; i += 8) {
        forecast.innerHTML += `
            <div class="forecast-details">
                <p>${new Date(data.list[i].dt_txt).toLocaleDateString()}</p>
                <p><img src="https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png" alt="${data.list[i].weather[0].description}"></p>
                <p>Temperature: ${data.list[i].main.temp} °C</p>
                <p>Humidity: ${data.list[i].main.humidity} %</p>
                <p>Wind Speed: ${data.list[i].wind.speed} m/s</p>
            </div>
        `;
    }
}

function saveSearchHistory(city) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
}

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

// Display search history on page load
document.addEventListener('DOMContentLoaded', displaySearchHistory);
