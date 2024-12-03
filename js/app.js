const result = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
let userLocation = null; // To store user's location (latitude and longitude)
let isFahrenheit = false; // Track temperature unit (Celsius or Fahrenheit)

window.onload = function () {
    if (!userLocation) {
        getUserLocationAndUpdateCityInput(); // Detect and update location on first load
    }
};

function getUserLocationAndUpdateCityInput() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // Store user's location
                userLocation = { latitude, longitude };

                // Reverse geocoding to get city name from latitude and longitude
                fetchCityNameFromCoordinates(latitude, longitude);
            },
            (error) => {
                console.error("Error getting location:", error);
                alert('Unable to retrieve your location. Please allow location access.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}

async function fetchCityNameFromCoordinates(latitude, longitude) {
    const apiKey = '74041282b1fd89abaf997bc9c3180053'; // Replace with your OpenWeather API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
            const cityName = data.name;
            // Update the input field with the detected city name
            cityInput.value = cityName;
            console.log('Detected city:', cityName);
        } else {
            alert('Unable to determine location. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching city name:', error);
        alert('Error fetching city name from coordinates.');
    }
}

result.addEventListener('click', saveData);

function saveData(event) {
    event.preventDefault();
    const city = cityInput.value;

    if (!city) {
        alert('Please enter a city name.');
        return;
    }

    fetchWeatherData(city); // Fetch live weather data for city

    // Use user location if detected, else set dummy coordinates
    const latitude = userLocation ? userLocation.latitude : 0;
    const longitude = userLocation ? userLocation.longitude : 0;

    updateForecastWithLocation(city, latitude, longitude);
}

async function fetchWeatherData(city) {
    const apiKey = '74041282b1fd89abaf997bc9c3180053'; // Replace with your API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
            updateDOM(data);
        } else {
            alert('City not found. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function updateDOM(data) {
    const cityName = data.name;
    const temperature = formatTemperature(data.main.temp);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    document.getElementById('city-name').textContent = `City: ${cityName}`;
    document.getElementById('temperature').textContent = `Temperature: ${temperature}`;
    document.getElementById('weather-description').textContent = `Description: ${description}`;
    document.getElementById('weather-description').style.backgroundImage = `url(${iconUrl})`;
}

function generateWeatherForecast(city, latitude, longitude) {
    const weatherConditions = ["Sunny", "Cloudy", "Rainy", "Snowy"];
    const forecast = [];
    const currentDate = new Date();

    for (let i = 0; i < 3; i++) {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() + i);

        const temperature = (Math.random() * 45 - 10).toFixed(1); // Random temperature (-10°C to 35°C)
        const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
        const humidity = Math.round(Math.random() * 100); // Random humidity (0% - 100%)

        forecast.push({
            date: date.toLocaleDateString(),
            temperature: formatTemperature(parseFloat(temperature)),
            condition,
            humidity: `${humidity}%`,
            latitude: latitude.toFixed(2),
            longitude: longitude.toFixed(2),
        });
    }

    console.log('3-Day Forecast:', forecast); // Print forecast in console
    return forecast;
}

function getWeatherIcon(condition) {
    switch (condition) {
        case "Sunny":
            return "☀️";
        case "Cloudy":
            return "☁️";
        case "Rainy":
            return "🌧️";
        case "Snowy":
            return "❄️";
        default:
            return "❓";
    }
}

function updateForecastWithLocation(city, latitude, longitude) {
    const forecastData = generateWeatherForecast(city, latitude, longitude);

    const forecastContainer = document.querySelector('.forecast-days');
    forecastContainer.innerHTML = ''; // Clear previous forecast

    forecastData.forEach(day => {
        const dayCard = document.createElement('div');
        dayCard.classList.add('day-card');

        const weatherIcon = getWeatherIcon(day.condition);

        dayCard.innerHTML = `
            <div class="day-date">${day.date}</div>
            <div class="day-condition">Condition: ${day.condition} ${weatherIcon}</div>
            <div class="day-temperature">Temperature: ${day.temperature}</div>
            <div class="day-humidity">Humidity: ${day.humidity}</div>
            <div class="day-coordinates">Coordinates: ${day.latitude}, ${day.longitude}</div>
        `;

        forecastContainer.appendChild(dayCard);
    });
}

function formatTemperature(tempInCelsius) {
    const temperature = isFahrenheit
        ? convertTemperature(tempInCelsius, true)
        : tempInCelsius;
    return `${temperature.toFixed(1)}°${isFahrenheit ? 'F' : 'C'}`; // Format temperature to 1 decimal place
}

function convertTemperature(tempInCelsius, toFahrenheit = true) {
    if (toFahrenheit) {
        return (tempInCelsius * 9) / 5 + 32; // Celsius to Fahrenheit
    } else {
        return tempInCelsius; // Return Celsius
    }
}

// Toggle temperature unit (Celsius/Fahrenheit) when the toggle button is clicked
document.getElementById('toggle-temp-unit').addEventListener('click', function () {
    isFahrenheit = !isFahrenheit; // Toggle the flag
    saveData(event); // Refresh weather and forecast data with the new temperature unit
});
