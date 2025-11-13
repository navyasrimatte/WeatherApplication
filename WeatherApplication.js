// WeatherApplication.js
// Replace the existing file with this one. Uses the same asset filenames you uploaded.

const apiKey = "746c3a6f4db2574e47027215dd408035";

document.addEventListener("DOMContentLoaded", () => {
  // get elements safely
  const searchInputBox = document.getElementById("search_input_box");
  const searchIcon = document.getElementById("search_icon");

  const cityName = document.getElementById("city_name");
  const tempValue = document.getElementById("temp_value");
  const weatherContent = document.getElementById("weather_content");
  const humidityValue = document.getElementById("humidityValue");
  const windValue = document.getElementById("wind_value");
  const weatherImage = document.getElementById("weather_image");

  // guard: required elements must exist
  if (!searchInputBox || !searchIcon || !cityName || !tempValue || !weatherContent || !humidityValue || !windValue || !weatherImage) {
    console.warn("One or more required DOM elements are missing. Check your HTML IDs.");
    return;
  }

  // small UI helpers
  function setLoading(on) {
    searchIcon.style.pointerEvents = on ? "none" : "";
    searchIcon.style.opacity = on ? "0.6" : "1";
  }

  function showError(msg) {
    alert(msg);
  }

  // Map API weather codes / main -> asset path (from your repo)
  function pickImageByWeather(data) {
    // try using weather id (more precise)
    const id = data.weather && data.weather[0] && data.weather[0].id ? data.weather[0].id : 0;
    const main = (data.weather && data.weather[0] && data.weather[0].main) ? data.weather[0].main.toLowerCase() : "";

    // Prefer id-range mapping (covers thunder, drizzle, rain, snow, atmosphere, clouds, clear)
    if (id >= 200 && id <= 232) {
      return "assets/5729387_cloudy_lightning_weather_cloud_forecast_icon.png"; // thunder
    }
    if (id >= 300 && id <= 321) {
      return "assets/2682827_cloud_day_light_bolt_rain_sun_icon.png"; // drizzle
    }
    if (id >= 500 && id <= 531) {
      return "assets/2682832_cloud_day_forecast_sun_weather_icon.png"; // rain
    }
    if (id >= 600 && id <= 622) {
      return "assets/2682823_forecast_snow_snowflake_weather_icon.png"; // snow
    }
    if (id >= 701 && id <= 781) {
      return "assets/2682802_cloudy_day_fog_foggy_mist_icon.png"; // atmosphere (mist/fog)
    }
    if (id === 800) {
      return "assets/2682848_day_forecast_sun_sunny_weather_icon.png"; // clear
    }
    if (id >= 801 && id <= 804) {
      return "assets/2682849_cloud_cloudy_day_forecast_sun_icon.png"; // clouds
    }

    // fallback: if id not present, use main string
    if (main.includes("cloud")) return "assets/2682832_cloud_day_forecast_sun_weather_icon.png";
    if (main.includes("rain")) return "assets/2682832_cloud_day_forecast_sun_weather_icon.png";
    if (main.includes("clear")) return "assets/2682848_day_forecast_sun_sunny_weather_icon.png";
    if (main.includes("mist") || main.includes("haze") || main.includes("fog")) return "assets/2682802_cloudy_day_fog_foggy_mist_icon.png";

    // final fallback image (you have this file in repo)
    return "assets/5729389_cloud_foggy_weather_cloudy_forecast_icon.png";
  }

  // main function: fetch & update UI
  async function getWeatherData() {
    const city = searchInputBox.value.trim();
    if (city === "") {
      showError("Please enter a city name!");
      return;
    }

    try {
      setLoading(true);

      const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
      const response = await fetch(apiURL);

      if (!response.ok) {
        // handle 404 or other errors gracefully
        if (response.status === 404) throw new Error("City not found. Please check the spelling.");
        else throw new Error(`Error fetching weather (${response.status})`);
      }

      const data = await response.json();

      // Update UI with safe checks
      cityName.textContent = data.name || city;
      tempValue.innerHTML = data.main && typeof data.main.temp === "number" ? `${Math.round(data.main.temp)}<sup>°</sup>C` : "--";
      weatherContent.textContent = data.weather && data.weather[0] && data.weather[0].description ? data.weather[0].description : "--";
      humidityValue.textContent = data.main && typeof data.main.humidity === "number" ? `${data.main.humidity}%` : "--";
      windValue.textContent = data.wind && typeof data.wind.speed === "number" ? `${data.wind.speed} km/hr` : "--";

      // Set weather image
      const imgPath = pickImageByWeather(data);
      weatherImage.src = imgPath;
      weatherImage.alt = data.weather && data.weather[0] && data.weather[0].main ? data.weather[0].main : "weather";

      // optional: clear input or keep it — you can change
      // searchInputBox.value = "";

    } catch (err) {
      showError(err.message || "Unable to fetch weather. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  // events: click & enter
  searchIcon.addEventListener("click", getWeatherData);
  searchInputBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") getWeatherData();
  });

  // Accessibility: allow Enter on search icon if focused
  searchIcon.setAttribute("tabindex", "0");
  searchIcon.addEventListener("keypress", (e) => {
    if (e.key === "Enter") getWeatherData();
  });

});
