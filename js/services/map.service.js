
var map;
const API_KEY = 'AIzaSyAGbEdxYFy-sQJvbvW1KEt3k4l1197qWN4'; 


export function initMap(lat, lng) {

    return _connectGoogleApi()
        .then(() => {
            map = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
        })
}

function addMarker(loc) {


    var marker = new google.maps.Marker({
        position: loc,
        map: map,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    map.panTo(laLatLng);
}

function getLocationName(loc) {
    
    return new Promise((resolve, reject) => {
        axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${loc.lat},${loc.lng}&key=${API_KEY}`)
        .then(res=> {
            const city = res.data.results[0].address_components[3].short_name;
            const street = res.data.results[0].address_components[1].long_name;
            resolve({city: city, street: street});
        })
        .catch(reject);
    })
}

function getLocationCoords(name) {
    return new Promise((resolve, reject) => {
        axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${name}&key=${API_KEY}`)
        .then(res=> {
            const pos = res.data.results[0].geometry.location;
            resolve(pos);
        })
        .catch(reject);
    })
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}



export default {
    initMap,
    addMarker,
    panTo,
    getLocationName,
    getLocationCoords
}
