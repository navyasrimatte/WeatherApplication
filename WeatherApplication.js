const apiKey = "746c3a6f4db2574e47027215dd408035";

const searchInputBox = document.getElementById("search_input_box");
const searchIcon = document.getElementById("search_icon");

const cityName = document.getElementById("city_name");
const tempValue = document.getElementById("temp_value");
const weatherContent = document.getElementById("weather_content");
const humidityValue = document.getElementById("humidityValue");
const windValue = document.getElementById("wind_value");
const weatherImage = document.getElementById("weather_image");

// ✅ Single async function that handles everything
async function getWeatherData() {
    const city = searchInputBox.value.trim();
    if (city === "") {
        alert("Please enter a city name!");
        return;
    }

    try {
        const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const response = await fetch(apiURL);

        if (!response.ok) {
            throw new Error("City not found!");
        }

        const data = await response.json();

        // Update UI directly here
        cityName.textContent = data.name;
        tempValue.innerHTML = `${Math.round(data.main.temp)}<sup>°</sup>C`;
        weatherContent.textContent = data.weather[0].description;
        humidityValue.textContent = `${data.main.humidity}%`;
        windValue.textContent = `${data.wind.speed} km/hr`;

        // Set weather image based on condition
        const weatherMain = data.weather[0].main.toLowerCase();
       if (weatherMain.includes("cloud")) {
    weatherImage.src = "assets/images/2682832_cloud_day_forecast_sun_weather_icon.png";
} else if (weatherMain.includes("rain")) {
    weatherImage.src = "assets/images/5729387_cloudy_lightning_weather_cloud_forecast_icon.png";
} else if (weatherMain.includes("clear")) {
    weatherImage.src = "assets/images/2682848_day_forecast_sun_sunny_weather_icon.png";
} else if (weatherMain.includes("haze") || weatherMain.includes("mist")) {
    weatherImage.src = "assets/images/5729389_cloud_foggy_weather_cloudy_forecast_icon.png";
} else {
    weatherImage.src = "assets/images/default.png"; // optional fallback
}


    } catch (error) {
        alert(error.message);
    }
}

searchIcon.addEventListener("click", getWeatherData);
searchInputBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") getWeatherData();
});
