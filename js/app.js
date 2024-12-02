// Main Event Listener for Search Button
const result = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
let userLocation = null; // To store user's location (latitude and longitude)

// Initialize the user's location detection when the page loads
window.onload = function () {
    if (!userLocation) {
        try {
            userLocation = getUserLocationAndUpdateCityInput(); // Detect and update location
        } catch (error) {
            console.error("Error:", error.message);
        }
    }
};

// Function to get the user's location and update the city input field
function getUserLocationAndUpdateCityInput() {
    try {
        const location = getUserLocation(); // Simulated geolocation function
        userLocation = location;

        // Reverse geocoding to get city name from latitude and longitude
        fetchCityNameFromCoordinates(location.latitude, location.longitude);
    } catch (error) {
        console.error("Error detecting location:", error.message);
        alert("Unable to retrieve your location.");
    }
}

// Simulate geolocation and handle possible errors
function getUserLocation() {
    const isLocationAvailable = Math.random() > 0.2; // Simulate 80% success rate
    if (!isLocationAvailable) {
        throw new Error("Failed to detect location. Geolocation data is unavailable.");
    }
    return {
        latitude: 40.7128, // Dummy latitude
        longitude: -74.0060, // Dummy longitude
    };
}

// Function to fetch the city name using reverse geocoding API (OpenWeather API in this case)
async function fetchCityNameFromCoordinates(latitude, longitude) {
    const apiKey = "74041282b1fd89abaf997bc9c3180053"; // Replace with your OpenWeather API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
            const cityName = data.name;
            cityInput.value = cityName; // Update the input field with the detected city name
            console.log("Detected city:", cityName);
        } else {
            throw new Error("Unable to determine location.");
        }
    } catch (error) {
        console.error("Error fetching city name:", error.message);
        alert("Error fetching city name.");
    }
}

// Validate city input and throw error if invalid
function generateWeatherForecast(city, latitude, longitude) {
    if (typeof city !== "string" || city.trim() === "") {
        throw new Error("Invalid city name. Please provide a valid city.");
    }

    const weatherConditions = ["Sunny", "Cloudy", "Rainy", "Snowy"];
    const forecast = [];
    const currentDate = new Date();

    for (let i = 0; i < 3; i++) {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() + i);

        const temperature = (Math.random() * 45 - 10).toFixed(1); // Random temperature
        const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
        const humidity = Math.round(Math.random() * 100); // Random humidity
        const windSpeed = (Math.random() * 15).toFixed(1); // Random wind speed

        forecast.push({
            date: date.toLocaleDateString(),
            temperature: `${temperature}°C`,
            condition,
            humidity: `${humidity}%`,
            windSpeed: `${windSpeed} m/s`,
            latitude: latitude.toFixed(2),
            longitude: longitude.toFixed(2),
        });
    }

    return forecast;
}

// Handle Search and Fetch Weather Data when Search Button is Clicked
result.addEventListener("click", (event) => {
    event.preventDefault();
    const city = cityInput.value;

    try {
        const location = getUserLocation(); // Get user location
        const forecast = generateWeatherForecast(city, location.latitude, location.longitude); // Generate forecast
        console.log("Weather Forecast:", forecast);
    } catch (error) {
        console.error("Error:", error.message);
        alert(error.message);
    }
});
