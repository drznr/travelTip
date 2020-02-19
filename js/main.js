console.log('Main!');

import locService from './services/loc.service.js';
import mapService from './services/map.service.js';
import {weatherService} from './services/weather-service.js';



locService.getLocs()
    .then(locs => console.log('locs', locs))

window.onload = () => {
    onCurrLocFocused();
    

    
}

document.querySelector('.btn').addEventListener('click', () => {
    onCurrLocFocused();
})

function onCurrLocFocused() {
    locService.getPosition()
        .then(pos => {
            mapService.initMap(pos.coords.latitude, pos.coords.longitude)
            .then(() => {
                mapService.addMarker({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            })
            .catch(err=> console.log('INIT MAP ERROR', err));
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}