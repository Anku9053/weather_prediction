var swiper = new Swiper(".mySwiper", {
    slidesPerView: 3,
    spaceBetween: 15,
    freeMode: true,
  });
  
  const searchBtn = document.querySelector('.searchBtn');
  const cityNameInput = document.querySelector('.citySearch');
  const apiKey = 'b8e6343adb114d2c88af0939f6b1a6c4';
  const weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const WeatherDegree = document.querySelector('.weatherInput');
  const locationData = document.querySelector('.location-data');
  const weatherPallete = document.querySelector('.weather-pallete');
  const weatherUL = document.querySelector('.weather-ul');
  
  const gettingStartedBtn = document.querySelector('.getting-started-btn');
  
  gettingStartedBtn.addEventListener('click', function () {
    document.querySelector('.frontpage').classList.add('active');
    document.querySelector('.weather-container').classList.add('active');
  });
  
  function createWeatherCard(cityName2, weatherItem2, index2) {
    const date = new Date(weatherItem2.dt_txt);
    const dayName = weeks[date.getDay()];
  
    if (index2 === 0) {
      return `
          <div class="location-data">
          <div class="location-content">
          <i class='bx bxs-map'></i>
          <h3>${cityName2}</h3>
          </div>
          <p>${dayName}</p>
          </div>
          <div class="weather-Degree">
          <h1>${(weatherItem2.main.temp - 273.15).toFixed(2)}°</h1>
          <img src="https://openweathermap.org/img/wn/${weatherItem2.weather[0].icon}@4x.png" alt="weather-Degree-image" class="weather-Degree-img">
          <h2>${weatherItem2.weather[0].description}</h2>
          </div>
          <div class="weather-pallete">
          <div class="pallete-data">
              <i class='bx bx-water'></i>
              <small>${weatherItem2.main.pressure} M/B</small>
              <span>Pressure</span>
          </div>
          <div class="pallete-data">
              <i class='bx bxs-droplet-half' ></i>
              <small>${weatherItem2.main.humidity}%</small>
              <span>Humidity</span>
          </div>
          <div class="pallete-data">
              <i class='bx bx-wind' ></i>
              <small>${weatherItem2.wind.speed} M/S</small>
              <span>wind Speed</span>
          </div>
          </div>
          `;
    } else {
      return `
          <li class="swiper-slide weather-data">
              <span>${dayName}</span>
              <img src="http://openweathermap.org/img/wn/${weatherItem2.weather[0].icon}@2x.png" alt="forecast-image" class="forecast-img">
              <div class="icon-overlay"></div>
              <small>${(weatherItem2.main.temp - 273.15).toFixed(2)}°</small>
          </li>
          `;
    }
  }
  
  function changeBackgroundImage(cityWeather, lat, lon) {
    const weather_api_url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  
    fetch(weather_api_url)
      .then(response => response.json())
      .then(data => {
        console.log(data.list[0].weather[0].main);
  
        const weatherCondition = data.list[0].weather[0].main.toLowerCase();
        let imageUrl;
  
        switch (weatherCondition) {
          case 'Rain':
            imageUrl = 'https://i.pinimg.com/236x/7d/69/88/7d69881f5746960ebdd7d56f6f4adc6d.jpg';
            break;
          case 'clouds':
            imageUrl = 'https://i.pinimg.com/236x/8d/5e/89/8d5e89eb9432265467470d4b5259e484.jpg';
            break;
          case 'clear':
            imageUrl = 'https://i.pinimg.com/236x/91/a0/f5/91a0f5e67b83b8cadec2fe1b59a0f380.jpg';
            break;
          case 'storm':
            imageUrl = 'https://i.pinimg.com/236x/b1/a0/80/b1a0808d6bccd7655f61fe8b98d011c3.jpg';
            break;
          case 'Snow':
            imageUrl = 'https://i.pinimg.com/236x/47/3a/15/473a1533d864d94d16b7d37bf8f897b2.jpg';
            break;
          default:
            imageUrl = 'https://i.pinimg.com/originals/04/6f/51/046f5145ae962d44679c45198909043a.gif';
            break;
        }
  
        document.body.style.backgroundImage = `url(${imageUrl})`;
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
      });
  }
  
  function gettingWeatherDetails(cityWeather, lat, lon) {
    const weather_api_url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  
    fetch(weather_api_url)
      .then(res => res.json())
      .then(data => {
        const forecastDays = [];
        const fiveDaysForecast = data.list.filter(function (forecast) {
          const forecastdate = new Date(forecast.dt_txt).getDate();
          if (!forecastDays.includes(forecastdate)) {
            return forecastDays.push(forecastdate);
          }
        });
  
        console.log(data);
  
        cityNameInput.value = "";
        WeatherDegree.innerHTML = "";
        locationData.innerHTML = "";
        weatherPallete.innerHTML = "";
        weatherUL.innerHTML = "";
  
        fiveDaysForecast.forEach(function (weatherItem, index) {
          if (index === 0) {
            WeatherDegree.insertAdjacentHTML('beforeend', createWeatherCard(cityWeather, weatherItem, index));
          } else if (index > 0 && index <= 3) {
            weatherUL.insertAdjacentHTML('beforeend', createWeatherCard(cityWeather, weatherItem, index));
          }
        });
  
      }).catch(() => {
        alert('Error Occurred While Fetching the Coordinates of Weather');
      });
  }
  
  searchBtn.addEventListener('click', function () {
    const cityName = cityNameInput.value.trim(); //trim to remove extra spaces
    if (cityName == "") {
      alert("Please Enter the City Name");
      return;
    } else {
      const geocoding_api_url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
      fetch(geocoding_api_url).then(res => res.json()).then(data => {
        if (!data.length) {
          return alert(`${cityName} isn't a valid city Name`);
        } else {
          const { name, lat, lon } = data[0]; //storing the value of Name, latitude and value of longitude in data array
          gettingWeatherDetails(name, lat, lon); //Now We have to create a function named gettingWeatherDetails
          changeBackgroundImage(name, lat, lon);
        }
  
        // console.log(data);
  
      }).catch(() => {
        alert("Error Occurred While Fetching the Coordinates");
      })
    }
  });
  

  