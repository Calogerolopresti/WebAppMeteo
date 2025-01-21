// Recuperiamo i pezzi necessari
const jsLoading = document.documentElement;
const nameCity = document.querySelector('.name-city');
const weatherNowIcon = document.querySelector('#now-icon');
const temperature = document.querySelector('.temperature');
const humidity = document.querySelector('.humidity');
const wind = document.querySelector('.wind');
const API_KEY = '7f6afbe6b56a128156bf47a100250330';

// Recupero della posizione
navigator.geolocation.getCurrentPosition(onSuccess, onError);

function onError() {
    nameCity.innerText = 'Per favore, attiva la localizzazione GPS';
    weatherNowIcon.alt = 'GPS Disabilitato';
    weatherNowIcon.src = 'images/geolocation_disabled.png';
    jsLoading.classList.remove('js-loading');
}

async function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    const endpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=it`;

    try {
        const response = await fetch(endpoint);
        const data = await response.json();

        // Recupero e inserimento dei dati meteo
        const { name } = data;
        const iconCode = data.weather[0].icon;
        const iconDescription = data.weather[0].description;
        const temperatureData = Math.floor(data.main.temp);
        const humidityData = data.main.humidity;
        const windData = Math.floor(data.wind.speed*3.6);
        const windDirection = getWindDirection(data.wind.deg);

        nameCity.innerText = name;
        weatherNowIcon.src = `images/${iconCode}.png`;
        weatherNowIcon.alt = iconDescription;
        temperature.innerText = `${temperatureData}°`;
        humidity.innerText = `${humidityData}%`;
        wind.innerText = `${windData}Km/h ${windDirection}`;

        // Recupero del forecast per i 4 giorni successivi
        const endpointForecast = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${latitude}&lon=${longitude}&cnt=4&appid=8e1880f460a20463565be25bc573bdc6&lang=it&units=metric`;
        const responseForecast = await fetch(endpointForecast);
        const dataForecast = await responseForecast.json();
        // inserisco i dati dei vari giorni dentro html 
        console.log(dataForecast);
        for (var i = 0; i < 4; i++) {
            if (i == 0) {
                var titleDay = document.querySelector(`#title-day${i + 1}`);
                titleDay.innerText = 'Oggi';
            } else {
                var titleDay = document.querySelector(`#title-day${i + 1}`);
                titleDay.innerText = date(dataForecast.list[i].dt);
            }
            var iconDay = document.querySelector(`#icon-day${i + 1}`);
            var temperatureDay = document.querySelector(`#temperature-day${i + 1}`);
            var windDay = document.querySelector(`#wind-day${i + 1}`);
            iconDay.src = `images/${dataForecast.list[i].weather[0].icon}.png`
            iconDay.alt = dataForecast.list[i].weather[0].description;
            temperatureDay.innerText = `${Math.floor(dataForecast.list[i].temp.min)} - ${Math.floor(dataForecast.list[0].temp.max)}°`;
            windDay.innerText = `${Math.floor(dataForecast.list[i].speed*3.6)} Km/h`;
        }

    } catch (error) {
        console.error('Errore nel recupero dei dati meteo:', error);
        nameCity.innerText = 'Errore nel recupero dei dati meteo';
    } finally {
        jsLoading.classList.remove('js-loading');
    }
}

function getWindDirection(degrees) {
    if (degrees < 40) return 'N';
    if (degrees < 80) return 'NE';
    if (degrees < 130) return 'E';
    if (degrees < 170) return 'SE';
    if (degrees < 220) return 'S';
    if (degrees < 260) return 'SW';
    if (degrees < 310) return 'W';
    return 'NW';
}

function date(timestamp) {
    var date = new Date(timestamp * 1000);
    var options = { weekday: 'short', day: '2-digit' };
    var formattedDate = date.toLocaleDateString('it-IT', options);
    return formattedDate;
}