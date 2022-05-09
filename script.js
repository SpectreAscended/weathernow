"use strict";

const btn = document.querySelector('h1');
const contentContainer = document.querySelector('.content-container');
const inputCity = document.querySelector('.input-city');
const submitBtn = document.getElementById('submit-btn');
const mainData = document.querySelector('.main-data');
// const forcastImage = document.querySelector('.forcast-image');
const backBtn = document.querySelector('.back-btn');





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
        console.log(data);
        if(data.cod === '404') {
            mainData.innerHTML = '<span>Couldn\'t find your city. Please try again!</span>'
            throw new Error(`Couldn't find your city.  Please try again! (${data.cod})`)
        }

        const {lon, lat} = data.coord;

        const geoUrl = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=dc94ec613b76428babfbfada00a1a5f1`);
        const geoData = await geoUrl.json();
        console.log(geoData);

        const state = {
            temp: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            windSpeed: data.wind.speed,
            windDir: data.wind.deg,
            gust: data?.wind.gust,
            humidity: data.main?.humidity,
            pressure: data.main.pressure,
            condition: data.weather[0].description,
            icon: data.weather[0].icon,
            provState: geoData.features[0].properties.state_code,
            country: geoData.features[0].properties.country,
            city: data.name,
            rain: data?.rain?.['1h'],
        };
        

        const imageUrl = await `http://openweathermap.org/img/wn/${state.icon}@2x.png`;

        const generateMarkup = function() {
            mainData.innerHTML = '';
            const markup = `
                <div class="current-info">
                    <img class="icon" src="${imageUrl}" alt="${state.condition}">
                    <span class="current-info--item country">${state.country}</span>
                    <span class="current-info--item city">${state.city}${state.provState ? ', ' + state.provState : ''}</span>
                    <span class="current-info--item condition">${state.condition.slice(0,1).toUpperCase() + state.condition.slice(1)}</span>
                    <span class="current-info--item current-temp">Current temp: ${state.temp}℃</span>
                    <span class="current-info--item feels-like">Feels like: ${state.feelsLike}℃</span>
                </div>
                <ul class="current-list">
                    <li class="current-list--item wind">Wind: ${windDirection(state.windDir)} at ${state.windSpeed} km/h</li>
                    <li class="current-list--item gusting">Gusting: ${state.gust ? state.gust : '0'} km/h</li>
                    <li class="current-list--item humidity">Humidity: ${state.humidity}%</li>
                    <li class="current-list--item percipitation">Percipitation: ${state.rain ? state.rain + ' mm' : '0 mm'}</li>
                    <li class="current-list--item pressure">Pressure: ${(state.pressure) / 10} kPa</li>
                </ul>
            `;
            mainData.insertAdjacentHTML('afterbegin', markup);
        };
        generateMarkup();
        
        // const renderMarkup = function(data) {
        //     mainData.insertAdjacentHTML('beforebegin', data)
        // }

        // renderMarkup(generateMarkup);
        

        // forcastImage.src = imageUrl;

    } catch (err) {
        console.error('Problem retrieving weather data', err)
    };
};


submitBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const query = inputCity.value;
    if(!query) return;
    mainData.innerHTML = 'Loading weather data...';
    // Load weather data
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

backBtn.addEventListener('click', function() {
    contentContainer.style.top = '100rem';
    inputCity.focus();
});

const backBtnBounce = function() {
    setInterval(() => {
        backBtn.style.transform = 'translateY(1rem)';
        setTimeout(() => {
            backBtn.style.transform = 'translateY(0)';
        }, 200);
    }, 2000)
};
backBtnBounce();


// console.log(data);
