// Ensure DOM content is loaded before running scripts
document.addEventListener("DOMContentLoaded", () => {
    getWeather();
    getAirQuality();
    getEnergyData();
    getEarthquakeData();
});

// OpenWeatherMap API for real-time weather
async function getWeather() {
    const apiKey = 'YOUR_API_KEY';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${apiKey}&units=metric`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    const weatherInfo = `
        Location: ${data.name}<br>
        Temperature: ${data.main.temp}°C<br>
        Humidity: ${data.main.humidity}%<br>
        Conditions: ${data.weather[0].description}
    `;
    document.getElementById('weather-info').innerHTML = weatherInfo;
}

// AirVisual API for real-time air quality data
async function getAirQuality() {
    const apiKey = 'YOUR_API_KEY';
    const url = `https://api.airvisual.com/v2/nearest_city?key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    const airQuality = data.data.current.pollution.aqius;
    const airQualityData = {
        labels: ['Air Quality Index'],
        datasets: [{
            label: 'AQI',
            data: [airQuality],
            backgroundColor: ['rgba(255, 99, 132, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)'],
            borderWidth: 1
        }]
    };
    
    const airQualityChart = new Chart(document.getElementById('airQualityChart'), {
        type: 'bar',
        data: airQualityData,
    });
}

// ElectricityMap API for real-time energy data
async function getEnergyData() {
    const apiKey = 'YOUR_API_KEY';
    const url = `https://api.electricitymap.org/v3/consumption/real-time?zone=DE&auth-token=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    const energyData = {
        labels: ['Germany'],
        datasets: [{
            label: 'Energy Consumption (MW)',
            data: [data.total],
            backgroundColor: ['rgba(54, 162, 235, 0.2)'],
            borderColor: ['rgba(54, 162, 235, 1)'],
            borderWidth: 1
        }]
    };
    
    const energyChart = new Chart(document.getElementById('energyChart'), {
        type: 'bar',
        data: energyData,
    });
}

// USGS Earthquake API for real-time earthquake data
async function getEarthquakeData() {
    const url = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson`;

    const response = await fetch(url);
    const data = await response.json();
    
    const map = L.map('map').setView([37.7749, -122.4194], 5);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    data.features.forEach(earthquake => {
        const [longitude, latitude] = earthquake.geometry.coordinates;
        const magnitude = earthquake.properties.mag;
        
        L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup(`Magnitude: ${magnitude}<br>Location: ${earthquake.properties.place}`);
    });
}
