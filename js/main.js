console.log('Main!');

import locService from './services/loc.service.js'
import mapService from './services/map.service.js'


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
            })
            .catch(console.log('INIT MAP ERROR'));
    })
    .catch(err => {
        console.log('err!!!', err);
    })
}