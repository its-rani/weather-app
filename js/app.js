const result=document.getElementById('search-btn')
console.log(result)
result.addEventListener('click',saveData)

function saveData(event) {
    event.preventDefault();
    const city = document.getElementById('city-input').value;
    console.log('City entered:', city);

    if (!city) {
        alert('Please enter a city name.');
        return;
    }

    fetchWeatherData(city); // Fetch live weather data
    updateForecast(city);   // Generate and display simulated forecast
}

// Fetch live weather data
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

// Update live weather details in DOM
function updateDOM(data) {
    const cityName = data.name;
    const temperature = data.main.temp;
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon; // Fetch the icon code
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // Construct icon URL

    document.getElementById('city-name').textContent = `City: ${cityName}`;
    document.getElementById('temperature').textContent = `Temperature: ${temperature}°C`;
    document.getElementById('weather-description').textContent = `Description: ${description}`;
    document.getElementById('weather-description').style.backgroundImage = `url(${iconUrl})`; // Set as a background if needed
}

// Generate 3-day forecast
// Function to generate and return a 3-day weather forecast
function generateWeatherForecast(city) {
    const weatherConditions = ["Sunny", "Cloudy", "Rainy", "Snowy"];
    const forecast = [];
    const currentDate = new Date();

    for (let i = 0; i < 3; i++) {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() + i);

        const temperature = Math.random() * 45 - 10; // Random temperature (-10°C to 35°C)
        const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
        const humidity = Math.round(Math.random() * 100); // Random humidity (0% - 100%)
        const windSpeed = (Math.random() * 15).toFixed(1); // Random wind speed (0 - 15 m/s)

        // Add day forecast to the array
        forecast.push({
            date: date.toLocaleDateString(), // Format: MM/DD/YYYY
            temperature: `${temperature.toFixed(1)}°C`,
            condition,
            humidity: `${humidity}%`,
            windSpeed: `${windSpeed} m/s`,
        });
    }

    return forecast; // Return the 3-day forecast array
}

// Update 3-day forecast in the DOM
function updateForecast(city) {
    const forecastData = generateWeatherForecast(city); // Get the 3-day forecast
    console.log("3-Day Forecast for", city, ":", forecastData);
    
    const forecastContainer = document.querySelector('.forecast-days');
    forecastContainer.innerHTML = ''; // Clear previous forecast

    forecastData.forEach(day => {
        const dayCard = document.createElement('div');
        dayCard.classList.add('day-card');

        // Add forecast details to the card
        dayCard.innerHTML = `
            <div class="day-date">${day.date}</div>
            <div class="day-condition">Condition: ${day.condition}</div>
            <div class="day-temperature">Temperature: ${day.temperature}</div>
            <div class="day-humidity">Humidity: ${day.humidity}</div>
            <div class="day-wind">Wind Speed: ${day.windSpeed}</div>
        `;

        forecastContainer.appendChild(dayCard); // Append card to the container
    });
}
