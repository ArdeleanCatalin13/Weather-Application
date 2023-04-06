const slider = document.querySelector(".hourlyforecast");
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



let weather = {
    "apiKey": "aedaa0616d345b9f3724c29de166f186",
    fetchWeather: function (city){
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + this.apiKey)
    .then((response) => response.json())
    .then((data) => this.displayWeather(data));
    },
    displayWeather: function(data) {
        const { name } = data
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        document.querySelector(".city").innerText =  name;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temperature").innerText = temp + "°C";
        document.querySelector(".humidity").innerText = humidity + "%";
        document.querySelector(".wind").innerText = speed + " km/h";
        document.querySelector(".weather").classList.remove("loading");
        document.body.style.backgroundImage = "url('https://source.unsplash.com/1920x1080/?" + description + "')"
    },
    search: function () {
       this.fetchWeather(document.querySelector(".search-bar").value);
    }
};

document.querySelector(".search-bar").addEventListener("keyup", function (event) {
    if(event.key == "Enter") {
        weather.search();
    }
});

weather.fetchWeather("Oradea");
