// Convert weather code to condition text
function getCondition(code) {
    if (code === 0) return "Clear Sky";
    if (code <= 3) return "Partly Cloudy";
    if (code <= 48) return "Foggy";
    if (code <= 67) return "Rainy";
    if (code <= 77) return "Snowy";
    if (code <= 99) return "Thunderstorm";
    return "Unknown";
}

// Weather by city name
async function getWeatherByCity() {
    const city = document.getElementById("cityInput").value.trim();
    const error = document.getElementById("error");
    const result = document.getElementById("weatherResult");

    error.textContent = "";
    result.style.display = "none";

    if (city === "") {
        error.textContent = "Please enter a city name";
        return;
    }

    try {
        // Get latitude & longitude
        const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
        );
        const geoData = await geoRes.json();

        if (!geoData.results) {
            error.textContent = "City not found";
            return;
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        fetchWeather(latitude, longitude, `${name}, ${country}`);
    } catch {
        error.textContent = "Error fetching location data";
    }
}

// Weather by current location
function getWeatherByLocation() {
    if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        position => {
            fetchWeather(
                position.coords.latitude,
                position.coords.longitude,
                "Your Location"
            );
        },
        () => {
            alert("Location permission denied");
        }
    );
}

// Fetch weather using latitude & longitude
async function fetchWeather(lat, lon, locationName) {
    const result = document.getElementById("weatherResult");

    const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );
    const data = await res.json();

    const weather = data.current_weather;

    document.getElementById("locationName").textContent = locationName;
    document.getElementById("temperature").textContent =
        `${weather.temperature}°C`;
    document.getElementById("condition").textContent =
        getCondition(weather.weathercode);
    document.getElementById("details").innerHTML =
        `Wind Speed: ${weather.windspeed} km/h`;

    result.style.display = "block";
}
