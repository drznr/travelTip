console.log('Main!');

import locService from './services/loc.service.js';
import mapService from './services/map.service.js';
import { weatherService } from './services/weather-service.js';
import { copyToClipBoard } from './utils.js';



locService.getLocs()
    .then(locs => console.log('locs', locs))

window.onload = () => {
    focusGeoLocation();
    document.querySelector('.btn').addEventListener('click', (ev) => {
        focusGeoLocation();
    });
    document.querySelector('.btn-submit').addEventListener('click', ()=> {
        const query = document.querySelector('.search').value;
        focusGeoLocation(query);
    })
    document.querySelector('.copy').addEventListener('click', () => {
        const locUrl = document.querySelector('.location h2').dataset.url;
        copyToClipBoard(locUrl);
    });
}



function focusGeoLocation(location) {
    if (location) {
        mapService.getLocationCoords(location)
        .then(res=> {
            const pos = res.results[0].geometry.location;
            mapService.initMap(pos.lat, pos.lng)
                .then(() => {

                    mapService.getLocationName({ lat: pos.lat, lng: pos.lng })
                        .then(res=> renderLocationName(res.results[0].address_components[1].long_name, res.results[0].address_components[3].short_name, { lat: pos.lat, lng: pos.lng }))
                        .catch(err => { throw new Error(err) });
                    mapService.addMarker({ lat: pos.lat, lng: pos.lng });

                    weatherService.getCurrentWeather(pos.lat, pos.lng)
                        .then(res => renderWeatherWidg(res));
                })
                .catch(console.log('INIT MAP ERROR'));
        })
        .catch(err => { throw new Error(err)});
        return;
    }
    locService.getPosition()
        .then(pos => {
            mapService.initMap(pos.coords.latitude, pos.coords.longitude)
                .then(() => {

                    mapService.getLocationName({ lat: pos.coords.latitude, lng: pos.coords.longitude })
                        .then(res=> renderLocationName(res.results[0].address_components[1].long_name, res.results[0].address_components[3].short_name, { lat: pos.coords.latitude, lng: pos.coords.longitude }))
                        .catch(err => { throw new Error(err) });
                    mapService.addMarker({ lat: pos.coords.latitude, lng: pos.coords.longitude });

                    weatherService.getCurrentWeather(pos.coords.latitude, pos.coords.longitude)
                        .then(res => renderWeatherWidg(res));
                })
                .catch(console.log('INIT MAP ERROR'));
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
