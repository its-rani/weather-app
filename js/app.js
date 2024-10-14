 const result=document.getElementById('search-btn')
 console.log(result)
 result.addEventListener('click',saveData)
 function saveData(event){
      event.preventDefault()
    const city = document.getElementById('city-input').value;
    console.log('City entered:', city);
    // Additional code to fetch weather data will be added later
    };