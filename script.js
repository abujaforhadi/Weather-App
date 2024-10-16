document
  .getElementById("weatherFilter")
  .addEventListener("change", function () {
    const selectedCondition = this.value.toLowerCase();
    filterWeather(selectedCondition);
  });
  const filterWeather = (condition) => {
    const nextDays = document.getElementById("nextDays");
    const errorMessage = document.getElementById("errordata");
    const allDays = Array.from(nextDays.children);
  
    // Show all days if the "all" option is selected
    if (condition === "all") {
      allDays.forEach((day) => {
        day.classList.remove("hidden");
        const errorMessage = document.getElementById("errordata");
        errorMessage.classList.add("hidden");
        nextDays.classList.remove("hidden");
      });
      return;
    }
  
    // Normalize the condition by removing '%' and converting to lowercase
    const normalizedCondition = condition.toLowerCase();
  
    // Define keywords associated with each weather condition
    const conditionKeywords = {
      rain: ["rain", "drizzle", "shower", "patchy rain", "light rain", "heavy rain"],
      sunny: ["sunny", "clear"],
      cloudy: ["cloudy", "overcast"],
      clear: ["clear"],
    };
  
    // Check if the selected condition has defined keywords
    const keywords = conditionKeywords[normalizedCondition] || [];
  
    let dataFound = false; // Track if any matching data is found
  
    allDays.forEach((day) => {
      const dayConditionText = day
        .querySelector(".card-body p:nth-child(1)")
        .textContent.toLowerCase();
  
      // Check if any keyword for the selected condition matches the day's condition text
      const matchesCondition = keywords.some(keyword => dayConditionText.includes(keyword));
  
      if (matchesCondition) {
        errorMessage.classList.add("hidden");

        day.classList.remove("hidden");
        dataFound = true; 
      } else {
        errorMessage.classList.add("hidden");

        day.classList.add("hidden");
      }
    });
  
   
   
    if (!dataFound) {
      errorMessage.textContent = `${condition.charAt(0).toUpperCase() + condition.slice(1)} Condition data not found`;
      errorMessage.classList.remove("hidden");
      nextDays.classList.add("hidden");
    } else {
      errorMessage.classList.add("hidden");
      nextDays.classList.remove("hidden");
    }
  };
  
  
  

document.getElementById("getWeather").addEventListener("click", function () {
  const city = document.getElementById("city");
  const cityN = city.value;
  const cityName = cityN.toLowerCase();
  city.value = "";
  displayWeatherByCity(cityName);
});

const displayWeatherByCity = async (cityName) => {
  const apiKey = "93baeb4ced524ec5ad8142345241510";
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=5`
    );

    const weatherData = await response.json();
    displayWeather(weatherData);
    const todayWeather = document.getElementById("todayWeather");
    todayWeather.classList.remove("hidden");
    const errorMessage = document.getElementById("error");
    errorMessage.classList.add("hidden");
    const nextDays = document.getElementById("nextDays");
    nextDays.classList.remove("hidden");
    const Filterdiv = document.getElementById("Filterdiv");
    Filterdiv.classList.remove("hidden");
  } catch (error) {
    console.error("Failed to fetch weather data:", error.message);
    const errorMessage = document.getElementById("error");
    errorMessage.textContent = `${cityName} weather data not found. Please try again...`;
    errorMessage.classList.remove("hidden");
    const todayWeather = document.getElementById("todayWeather");
    todayWeather.classList.add("hidden");
    const nextDays = document.getElementById("nextDays");
    nextDays.classList.add("hidden");
    const Filterdiv = document.getElementById("Filterdiv");
    Filterdiv.classList.add("hidden");
  }
};

const displayWeather = (weatherData) => {
  const errorMessage = document.getElementById("errordata");
  errorMessage.classList.add("hidden");
  // Today weather
  const today = weatherData.current;
  let bgClass = "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700";

  if (today.condition.text.includes("Sunny")) {
    bgClass = "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-700";
  } else if (today.condition.text.toLowerCase().includes("cloudy")) {
    bgClass = "bg-gradient-to-r from-gray-400 via-gray-500 to-gray-700";
  } else if (today.condition.text.toLowerCase().includes("rain")) {
    bgClass = "bg-gradient-to-r from-blue-500 via-blue-600 to-gray-700";
  } else if (today.condition.text.toLowerCase().includes("clear")) {
    bgClass = "bg-gradient-to-r from-blue-300 via-blue-400 to-blue-600";
  }

  const location = weatherData.location;
  const todayWeatherDiv = document.getElementById("todayWeather");
  todayWeatherDiv.innerHTML = `
        <div class="card mx-10 ${bgClass} text-white shadow-xl">
            <div class="card-body items-center text-center">
                <h2 class="card-title">
                    <p class="flex justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg> ${location.name}, ${location.country}</p>
                </h2>
            </div>
            <figure class="px-10">
                <img src="${today.condition.icon}" alt="Weather icon" class="rounded-xl" />
            </figure>
            <div class="card-body items-center">
                <h2 class="card-title">Temp: ${today.temp_c}°C / ${today.temp_f}°F</h2>
                <p>Condition: ${today.condition.text}</p>
                <p class="text-sm">Feels like: ${today.feelslike_c}</p>
                <div class="flex gap-10 md:gap-52">
                    <div>Humidity: ${today.humidity} %</div>
                    <div>Wind Speed: ${today.wind_kph} km/h</div>
                </div>
            </div>
        </div>
    `;

  // Next 5 day weather
  const nextDays = document.getElementById("nextDays");
  nextDays.innerHTML = "";
  const nextDay = weatherData.forecast.forecastday;

  nextDay.forEach((element) => {
    const div = document.createElement("div");
    let bgClass = "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700";

    if (element.day.condition.text.includes("Sunny")) {
      bgClass = "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-700";
    } else if (element.day.condition.text.toLowerCase().includes("cloudy")) {
      bgClass = "bg-gradient-to-r from-gray-400 via-gray-500 to-gray-700";
    } else if (element.day.condition.text.toLowerCase().includes("rain")) {
      bgClass = "bg-gradient-to-r from-blue-500 via-blue-600 to-gray-700";
    } else if (element.day.condition.text.toLowerCase().includes("clear")) {
      bgClass = "bg-gradient-to-r from-blue-300 via-blue-400 to-blue-600";
    }

    const dateStr = `${element.date}`;
    const dayName = getDayNameFromDate(dateStr);
    div.classList.add("carousel-item");

    div.innerHTML = `
            <div class="card ${bgClass} text-white shadow-xl">
                <div class="card-body items-center text-center">
                    <h2 class="card-title">${dayName}</h2>
                </div>
                <figure class="px-5">
                    <img src="${element.day.condition.icon}" alt="${element.day.condition.text}" class="rounded-xl" />
                </figure>
                <div class="card-body items-center">
                    <p>Condition: ${element.day.condition.text}</p>
                    <div class="flex gap-5 md:gap-10">
                        <div>Sunrise: ${element.astro.sunrise}</div>
                        <div>Sunset: ${element.astro.sunset}</div>
                    </div>
                    <div class="flex gap-5 md:gap-10">
                        <div>Min Temp: ${element.day.mintemp_c} °C</div>
                        <div>Max Temp: ${element.day.maxtemp_c} °C</div>
                    </div>
                </div>
            </div>
        `;
    nextDays.appendChild(div);
  });
};

displayWeatherByCity("dhaka");
