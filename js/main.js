console.log('Main!');

import locService from './services/loc.service.js';
import mapService from './services/map.service.js';
import { weatherService } from './services/weather-service.js';



locService.getLocs()
    .then(locs => console.log('locs', locs))

window.onload = () => {
    focusGeoLocation();

}

document.querySelector('.btn').addEventListener('click', (ev) => {
    focusGeoLocation();
})

function focusGeoLocation() {
    locService.getPosition()
        .then(pos => {
            mapService.initMap(pos.coords.latitude, pos.coords.longitude)
                .then(() => {

                    mapService.addMarker({ lat: pos.coords.latitude, lng: pos.coords.longitude });

                    weatherService.getCurrentWeather()
                        .then(res => renderWeatherWidg(res))
                })
                .catch(console.log('INIT MAP ERROR'));
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}


function renderWeatherWidg(weather) {
    const strHTML = `<li><ul>
                    <li class="w-icon"><img src="http://openweathermap.org/img/wn/${weather.icon}@2x.png"></li>
                    <li class="location">${weather.loaction}, ${weather.country} <img class="flag" src="https://lipis.github.io/flag-icon-css/flags/4x3/${weather.country.toLowerCase()}.svg"> ${weather.type}</li>
                    <li class="temp">${weather.tempC}°C | ${weather.tempF}°F</li>
                    <li class="wind">Wind Speed ${weather.windKmHr} km/h</li>
                    </ul></li>`

    document.querySelector('.weather-breakdown').innerHTML = strHTML
}
