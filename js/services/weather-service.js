'use strict'

export const weatherService = {
    getCurrentWeather,
}

const WEATHER_KEY = '0842198d900c6bb69d303eab2504a6fa'


function getCurrentWeather(lat = 32.0749831, lng = 34.9120554) {
    return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_KEY}`)
        .then(res => {
            console.log(res);
            
            var currentWeather = {
                type: res.data.weather[0].description,
                tempC: (res.data.main.temp - 273.15).toFixed(2),
                tempF: ((res.data.main.temp - 273.15)* 9/5 + 32).toFixed(2),
                windKmHr: (res.data.wind.speed * 3.6).toFixed(1),
                loaction: res.data.name,
                country: res.data.sys.country,
                icon: res.data.weather[0].icon
            }
            return currentWeather
        })
}
