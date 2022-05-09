"use strict";

const btn = document.querySelector('h1');
const contentContainer = document.querySelector('.content-container');
const temp = document.querySelector('.temp');
const feelsLike = document.querySelector('.feels-like');
const wind = document.querySelector('.wind');
const inputCity = document.querySelector('.input-city');
const submitBtn = document.getElementById('submit-btn');
const city = document.querySelector('.city');
const mainData = document.querySelector('.main-data');
const forcastImage = document.querySelector('.forcast-image');
const backBtn = document.querySelector('.back-btn');


// btn.addEventListener('click', function() {
//     contentContainer.style.top = '20rem';
//     console.log('yo');
// })

const state = {
    temp: '',
    feelsLike: ''
    
};


const windDirection = function (dir) {
    if(dir >= 337.5 || dir < 22.5) return 'N';
    if(dir >= 22.5 && dir < 67.5) return 'NE';
    if(dir >= 67.5 && dir < 112.5) return 'E';
    if(dir >= 112.5 && dir < 157.5) return 'SE';
    if(dir >= 157.5 && dir < 202.5) return 'S';
    if(dir >= 202.5 && dir < 247.5) return 'SW';
    if(dir >= 247.5 && dir < 292.5) return 'W';
    if(dir >= 292.5 && dir < 337.5) return 'NW';
};

console.log(windDirection(22.5));

const weatherData = async function(query) {
    try {
        if(!query) return; 
        const url = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=d9819c90d382ddc65dcc500f8e98498f&units=metric`);
        const data = await url.json();

        const {lon, lat} = data.coord;

        const geoUrl = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=dc94ec613b76428babfbfada00a1a5f1`);
        const geoData = await geoUrl.json();
        console.log(geoData);

        state.temp = data.main.temp

        state.feelsLike = data.main.feels_like
        city.textContent = `${data.name}${geoData.features[0].properties.state_code ? ', ' + geoData.features[0].properties.state_code : ', ' + (geoData.features[0].properties.country_code).toUpperCase()}`;
        temp.textContent = `Current temp: ${Math.round(state.temp)}℃`;
        feelsLike.textContent = `Feels like: ${Math.round(state.feelsLike)}℃`;
        wind.textContent = `Wind: ${windDirection(data.wind.deg)} at ${Math.round(data.wind.speed)} kph`;
        console.log(data);
        const icon = data.weather[0].icon;
        console.log(icon);

        const imageUrl = await `http://openweathermap.org/img/wn/${icon}@2x.png`;

        forcastImage.src = imageUrl;

    } catch (err) {
        console.error('Problem retrieving weather data', err)
    };
};


submitBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const query = inputCity.value;
    if(!query) return;
    weatherData(query);
    inputCity.value = '';
    contentContainer.style.top = '-5rem';
});

const forecast = async function() {
    const url = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=saskatoon&appid=d9819c90d382ddc65dcc500f8e98498f&units=metric`);
    const data = await url.json();
    console.log(data);
};

forecast();

// Temp, make main section drop;

backBtn.addEventListener('click', function() {
    contentContainer.style.top = '80rem';
    inputCity.focus();
    // backBtn.style.transform = 'rotate(180deg)';
    // setTimneout(() => {
    //     backBtn.style.transform = 'rotate(-180deg)';
    // }, 500)
});

// console.log(data);
