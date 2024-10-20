 const result=document.getElementById('search-btn')
 console.log(result)
 result.addEventListener('click',saveData)
 function saveData(event){
      event.preventDefault()
    const city = document.getElementById('city-input').value;
    console.log('City entered:', city);
    fetchWeatherData(city);
    };

    async function fetchWeatherData(city) {
      const apiKey = '74041282b1fd89abaf997bc9c3180053'; // Replace this with your actual API key
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`; // URL to fetch weather data, using Celsius
  
      try {
          const response = await fetch(apiUrl); // Make the request
          const data = await response.json(); // Parse the JSON response
  
          if (response.ok) {
              console.log('Weather data:', data); // Log the weather data
              updateDOM(data); // Call the function to update the DOM with weather information
          } else {
              console.error('City not found:', data.message); // Log error if the city is not found
              alert('City not found. Please enter a valid city name.'); // Show an alert for invalid city
          }
      } catch (error) {
          console.error('Error fetching weather data:', error); // Log any network errors
      }
  }
  
  function updateDOM(data) {
      // Extract weather information from the API response
      const cityName = data.name;
      const temperature = data.main.temp; // Temperature in Celsius
      const description = data.weather[0].description; // Weather description
  
      // Update DOM elements with the fetched data
      document.getElementById('city-name').textContent = `City: ${cityName}`;
      document.getElementById('temperature').textContent = `Temperature: ${temperature}°C`;
      document.getElementById('weather-description').textContent = `Description: ${description}`;
  }