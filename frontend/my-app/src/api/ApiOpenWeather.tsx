import axios from 'axios';

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY as string || "a8d29fe214736a44fd156d46c6f05ff1";
const GEOLOCATION_URL = process.env.REACT_APP_OPENWEATHER_GEOLOCATION_URL as string || "http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API_KEY}";
const WEATHER_URL = process.env.REACT_APP_OPENWEATHER_WEATHER_URL as string || "http://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API_KEY}";

if (!API_KEY || !GEOLOCATION_URL || !WEATHER_URL) {
  throw new Error('One or more environment variables are missing.');
}

export function fetchGeolocation(city: string, stateCode?: string, countryCode?: string, limit: number = 1) {
  const url = GEOLOCATION_URL
    .replace("{city name}", city)
    .replace("{state code}", stateCode || "")
    .replace("{country code}", countryCode || "")
    .replace("{limit}", limit.toString())
    .replace("{API_KEY}", API_KEY);
  
  console.log("Geolocation API URL:", url);

  return axios.get(url)
    .then(response => {
      const data = response.data;
      if (Array.isArray(data) && data.length > 0) {
        const geolocation = data[0];
        const lat = geolocation.lat;
        const lon = geolocation.lon;
        return { lat, lon };
      } else {
        throw new Error("Geolocation data not found");
      }
    })
    .catch(error => {
      console.error("Error fetching geolocation:", error);
      throw error;
    });
}


export function fetchWeather(lat: number, lon: number) {
  const url = WEATHER_URL
    .replace("{lat}", lat.toString())
    .replace("{lon}", lon.toString())
    .replace("{API_KEY}", API_KEY);

  console.log("Weather API URL:", url);

  return axios.get(url)
    .then(response => response.data)
    .catch(error => {
      console.error("Error fetching weather:", error);
      throw error;
    });
}
