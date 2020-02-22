

import locService from './services/loc.service.js';
import mapService from './services/map.service.js';
import { weatherService } from './services/weather-service.js';
import { utilsService } from './utils.js';



window.onload = () => {
    focusGeoLocation();
    _handleEventListeners();
}



function focusGeoLocation(location) {
    if (location) {
        mapService.getLocationCoords(location)
            .then(_renderMap)
            .catch(err => { throw new Error(err) });
        return;
    }
    locService.getPosition()
        .then(pos => {
            let { latitude, longitude } = pos.coords;
            if (+utilsService.getParameterByName('lat') && +utilsService.getParameterByName('lng')) {
                latitude = +utilsService.getParameterByName('lat');
                longitude = +utilsService.getParameterByName('lng');
                _removeParams()
            }
            _renderMap({ lat: latitude, lng: longitude });
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

function renderLocationName(city, country, loc) {
    const elLocContainer = document.querySelector('.location');

    let strHtml = `<h2 data-url="${window.location.href + `?&lat=${loc.lat}&lng=${loc.lng}`}"><strong>Location</strong>: ${city}, ${country}</h2>`;

    elLocContainer.innerHTML = strHtml;
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

function _renderMap(pos) {
    mapService.initMap(pos.lat, pos.lng)
        .then(() => {
            mapService.getLocationName({ lat: pos.lat, lng: pos.lng })
                .then(res => renderLocationName(res.street, res.city, { lat: pos.lat, lng: pos.lng }))
                .catch(err => { throw new Error(err) });
            mapService.addMarker({ lat: pos.lat, lng: pos.lng });

            weatherService.getCurrentWeather(pos.lat, pos.lng)
                .then(res => renderWeatherWidg(res));
        })
        .catch(console.log('INIT MAP ERROR'));
}

function _handleEventListeners() {
    document.querySelector('.btn').addEventListener('click', (ev) => {
        focusGeoLocation();
    });
    document.querySelector('.btn-submit').addEventListener('click', () => {
        const query = document.querySelector('.search').value;
        focusGeoLocation(query);
    })
    document.querySelector('.copy').addEventListener('click', () => {
        const locUrl = document.querySelector('.location h2').dataset.url;
        utilsService.copyToClipBoard(locUrl);
    });
    document.querySelector('.search').addEventListener("keyup", (ev) => {
        if (ev.key === 'Enter') {
            ev.preventDefault();
            document.querySelector('.btn-submit').click();
        }
    });
}

function _removeParams() {
    const urlParams = new URLSearchParams(location.search);

    urlParams.delete('lat');
    urlParams.delete('lng');

    const url = `${location.href.split('?')[0]}?${urlParams.toString()}`;

    history.replaceState({}, document.title, url);
}