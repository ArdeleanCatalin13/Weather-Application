const slider = document.querySelector(".hourly-forecast");
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener("mousedown", (e) => {
    isDown = true;
    slider.classList.add("active");
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});
slider.addEventListener("mouseleave", () => {
    isDown = false;
    slider.classList.remove("active");

});
slider.addEventListener("mouseup", () => {
    isDown = false;
    slider.classList.remove("active");

});
slider.addEventListener("mousemove", (e) => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft  = scrollLeft - walk;
    
});


const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const countryEl = document.getElementById('city');
const searchEl = document.getElementById('search-bar');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const currentForecastEl = document.getElementById('current-forecast');
const weatherForecastEl = document.getElementById('weather-forecast');
const hourlyForecastEl = document.getElementById('hourly-forecast');
const currentTempEl = document.getElementById('current-temp');


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY ='aedaa0616d345b9f3724c29de166f186';

navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    fetch(url)
    .then(response => response.json())
    .then(data => {
        
        getWeatherData(data.name);
    })
}, (error) => {
    console.error(error);
   
    getWeatherData('Oradea');
});

setInterval(() => {
    const time = new Date();
    const day = time.getDay();
    const hour = time.getHours();
}, 1000);

searchEl.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const city = searchEl.value;
        getWeatherData(city);
    }
});

function getWeatherData (city) {

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`)
    .then(response => response.json())
    .then(data1 => {
    const lat = data1.coord.lat;
    const lon = data1.coord.lon;
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=${API_KEY}`)
    .then(res => res.json())
    .then(data => {

    console.log(data)
    showWeatherData(data, city);
    })
});
}

function showWeatherData (data, city){
    const background = data.current.weather[0].icon;

    let {humidity, pressure, dew_point, wind_speed} = data.current;

    countryEl.innerHTML = city;
    currentTempEl.innerHTML = `${data.current.temp}&#176;C`;

    

    switch(background){
        case '01n':
            document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1496467606013-2b7b9caa2a67?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')";
            break;
        case '04n':
            document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1604083142449-79b1babd12d4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')";
            break;
    }

    currentForecastEl.innerHTML = `
    <div class="current-forecast">
                <div class="flex">
                    <h2 id="city" class="city">${city}</h2>
                    <div class="description">${data.current.weather[0].description}</div>
                    <h1 class="temperature">${data.current.temp}&#176;C</h1>
                </div>
                <img src="http://openweathermap.org/img/wn/${data.current.weather[0].icon}@4x.png" alt="weather icon" class="icon">
            </div>
`;

    currentWeatherItemsEl.innerHTML = 
    `
    <div class="pair1">
        <div class="weather-item">
            <p>Humidity</p>
            <div class="humidity">${humidity}%</div>
        </div>
        <div class="weather-item">
            <p>Air Pressure</p>
            <div class="presure">${pressure}</div>
        </div>
    </div> 
    <div class="pair2">
        <div class="weather-item">
            <p>Wind Speed</p>
            <div class="wind">${wind_speed}km/h</div>
        </div>
        <div class="weather-item">
            <p>Dew Point</p>
            <div class="Dew Point">${dew_point}</div>
        </div>
    </div>
     `
    
     let hourlyForecast = '';
     data.hourly.forEach((hour, idx) => {
         if (idx < 24) {
             hourlyForecast += `
             <div class="hourly-forecast-item">
                 <div class="time">${new Date(hour.dt * 1000).getHours()}:00</div>
                 <img src="http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png" alt="weather icon" class="icon">
                 <p>${hour.temp}&#176;C</p>
             </div>
             `;
         }
     });

     hourlyForecastEl.innerHTML = hourlyForecast;

    let otherDayForcast = ''
    data.daily.forEach((day, idx) => {
        if(idx == 0){
            currentTempEl.innerHTML = `
            <div class="day">Today</div>
            <div class="midelements">
                <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@2x.png" alt="weather icon" class="icon">
                <p class="desc">${day.weather[0].description}</p>
            </div>
                <div class="temp">${day.temp.day}&#176;C</div>
            </div>
            
            `
        }else if(idx < 7){
            otherDayForcast += `
            <div class="weather-forecast-item id="weather-forecast-7">
                <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                <div class="midelements">
                    <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="icon">
                    <p class="desc">${day.weather[0].description}</p>
                </div>
                <div class="temp">${day.temp.day}&#176;C</div>
            </div>
            
            `
        }
    })
    
    document.querySelector(".search-bar").addEventListener("keyup", function (event) {
        if(event.key == "Enter") {
            const searchValue = document.getElementById('search-bar').value;
        document.getElementById('search-bar').value = '';
        console.log(searchValue);
        getWeatherData(searchValue);
        }
    });

    weatherForecastEl.innerHTML = otherDayForcast;

    
}
