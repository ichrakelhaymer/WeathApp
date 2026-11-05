
// State Management
const state = {
  unit: localStorage.getItem('skypulse_unit') || 'metric', // 'metric' (°C, km/h) | 'imperial' (°F, mph)
  currentCity: JSON.parse(localStorage.getItem('skypulse_last_city') || 'null') || {
    name: 'London',
    country: 'United Kingdom',
    admin1: 'England',
    latitude: 51.5085,
    longitude: -0.1257,
    timezone: 'Europe/London'
  },
  weatherData: null,
  activeSuggestionIndex: -1,
  suggestions: []
};


// SVG Icon Generator
const WeatherIcons = {
  sun: () => `
    <svg viewBox="0 0 64 64" fill="none">
      <defs>
        <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFF176"/>
          <stop offset="100%" stop-color="#F59E0B"/>
        </radialGradient>
        <filter id="sunGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>
      <circle cx="32" cy="32" r="14" fill="url(#sunGrad)" filter="url(#sunGlow)"/>
      <g stroke="#F59E0B" stroke-width="3" stroke-linecap="round">
        <line x1="32" y1="6" x2="32" y2="12"/>
        <line x1="32" y1="52" x2="32" y2="58"/>
        <line x1="6" y1="32" x2="12" y2="32"/>
        <line x1="52" y1="32" x2="58" y2="32"/>
        <line x1="13.6" y1="13.6" x2="17.8" y2="17.8"/>
        <line x1="46.2" y1="46.2" x2="50.4" y2="50.4"/>
        <line x1="13.6" y1="50.4" x2="17.8" y2="46.2"/>
        <line x1="46.2" y1="17.8" x2="50.4" y2="13.6"/>
      </g>
    </svg>`,

  moon: () => `
    <svg viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#E0E7FF"/>
          <stop offset="100%" stop-color="#818CF8"/>
        </linearGradient>
      </defs>
      <path d="M40 12A20 20 0 1 0 52 44 22 22 0 0 1 40 12z" fill="url(#moonGrad)"/>
      <circle cx="18" cy="20" r="1.5" fill="#C7D2FE"/>
      <circle cx="48" cy="18" r="1" fill="#E0E7FF"/>
      <circle cx="44" cy="48" r="1.5" fill="#C7D2FE"/>
    </svg>`,

  cloudSun: () => `
    <svg viewBox="0 0 64 64" fill="none">
      <defs>
        <radialGradient id="csSunGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FDE047"/>
          <stop offset="100%" stop-color="#F59E0B"/>
        </radialGradient>
        <linearGradient id="csCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="100%" stop-color="#CBD5E1"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="22" r="10" fill="url(#csSunGrad)"/>
      <path d="M42 46H20a12 12 0 0 1-2.4-23.76A14 14 0 0 1 44.5 25.5 10 10 0 0 1 42 46z" fill="url(#csCloudGrad)"/>
    </svg>`,

  cloudMoon: () => `
    <svg viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="cmMoonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#C7D2FE"/>
          <stop offset="100%" stop-color="#6366F1"/>
        </linearGradient>
        <linearGradient id="cmCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#E2E8F0"/>
          <stop offset="100%" stop-color="#94A3B8"/>
        </linearGradient>
      </defs>
      <path d="M44 14a12 12 0 0 0 6 20 14 14 0 0 1-12-19c2-1 4-1 6-1z" fill="url(#cmMoonGrad)"/>
      <path d="M42 46H20a12 12 0 0 1-2.4-23.76A14 14 0 0 1 44.5 25.5 10 10 0 0 1 42 46z" fill="url(#cmCloudGrad)"/>
    </svg>`,

  cloud: () => `
    <svg viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="100%" stop-color="#94A3B8"/>
        </linearGradient>
      </defs>
      <path d="M44 48H18a12 12 0 0 1-2.2-23.8A15 15 0 0 1 44 24a12 12 0 0 1 0 24z" fill="url(#cloudGrad)"/>
    </svg>`,

  fog: () => `
    <svg viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="fogCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#E2E8F0"/>
          <stop offset="100%" stop-color="#94A3B8"/>
        </linearGradient>
      </defs>
      <path d="M44 38H20a10 10 0 0 1-2-19.8A12 12 0 0 1 41 18a9 9 0 0 1 3 20z" fill="url(#fogCloudGrad)"/>
      <line x1="14" y1="44" x2="50" y2="44" stroke="#CBD5E1" stroke-width="3" stroke-linecap="round"/>
      <line x1="18" y1="50" x2="46" y2="50" stroke="#94A3B8" stroke-width="3" stroke-linecap="round"/>
      <line x1="22" y1="56" x2="42" y2="56" stroke="#64748B" stroke-width="3" stroke-linecap="round"/>
    </svg>`,

  drizzle: () => `
    <svg viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="drizCloud" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#F1F5F9"/>
          <stop offset="100%" stop-color="#94A3B8"/>
        </linearGradient>
      </defs>
      <path d="M44 38H18a11 11 0 0 1-2.2-21.8A13 13 0 0 1 41 16a10 10 0 0 1 3 22z" fill="url(#drizCloud)"/>
      <line x1="22" y1="44" x2="20" y2="50" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="32" y1="44" x2="30" y2="50" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="42" y1="44" x2="40" y2="50" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,

  rain: () => `
    <svg viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="rainCloud" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#CBD5E1"/>
          <stop offset="100%" stop-color="#64748B"/>
        </linearGradient>
      </defs>
      <path d="M46 36H18a12 12 0 0 1-2.2-23.8A14 14 0 0 1 43 14a11 11 0 0 1 3 22z" fill="url(#rainCloud)"/>
      <g stroke="#0284C7" stroke-width="3" stroke-linecap="round">
        <line x1="22" y1="42" x2="18" y2="54"/>
        <line x1="33" y1="42" x2="29" y2="54"/>
        <line x1="44" y1="42" x2="40" y2="54"/>
      </g>
    </svg>`,

  snow: () => `
    <svg viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="snowCloud" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#F8FAFC"/>
          <stop offset="100%" stop-color="#94A3B8"/>
        </linearGradient>
      </defs>
      <path d="M46 34H18a11 11 0 0 1-2-21.8A13 13 0 0 1 43 14a10 10 0 0 1 3 20z" fill="url(#snowCloud)"/>
      <g fill="#BAE6FD">
        <circle cx="22" cy="44" r="2.5"/>
        <circle cx="34" cy="42" r="2.5"/>
        <circle cx="44" cy="45" r="2.5"/>
        <circle cx="28" cy="53" r="2.5"/>
        <circle cx="39" cy="52" r="2.5"/>
      </g>
    </svg>`,

  thunderstorm: () => `
    <svg viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="tsCloud" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#475569"/>
          <stop offset="100%" stop-color="#1E293B"/>
        </linearGradient>
      </defs>
      <path d="M46 34H18a12 12 0 0 1-2.2-23.8A14 14 0 0 1 43 12a11 11 0 0 1 3 22z" fill="url(#tsCloud)"/>
      <polygon points="33,34 26,45 32,45 28,58 40,43 34,43" fill="#FACC15" stroke="#EAB308" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>`
};


// WMO Weather Codes Dictionary (World Meteorological Organization)
const WMO_CODES = {
  0: { description: 'Clear sky', dayIcon: WeatherIcons.sun, nightIcon: WeatherIcons.moon, theme: (isDay) => isDay ? 'theme-clear-day' : 'theme-clear-night' },
  1: { description: 'Mainly clear', dayIcon: WeatherIcons.cloudSun, nightIcon: WeatherIcons.cloudMoon, theme: (isDay) => isDay ? 'theme-clear-day' : 'theme-clear-night' },
  2: { description: 'Partly cloudy', dayIcon: WeatherIcons.cloudSun, nightIcon: WeatherIcons.cloudMoon, theme: (isDay) => isDay ? 'theme-clear-day' : 'theme-clear-night' },
  3: { description: 'Overcast', dayIcon: WeatherIcons.cloud, nightIcon: WeatherIcons.cloud, theme: () => 'theme-clouds' },
  45: { description: 'Foggy', dayIcon: WeatherIcons.fog, nightIcon: WeatherIcons.fog, theme: () => 'theme-fog' },
  48: { description: 'Depositing rime fog', dayIcon: WeatherIcons.fog, nightIcon: WeatherIcons.fog, theme: () => 'theme-fog' },
  51: { description: 'Light drizzle', dayIcon: WeatherIcons.drizzle, nightIcon: WeatherIcons.drizzle, theme: () => 'theme-rain' },
  53: { description: 'Moderate drizzle', dayIcon: WeatherIcons.drizzle, nightIcon: WeatherIcons.drizzle, theme: () => 'theme-rain' },
  55: { description: 'Dense drizzle', dayIcon: WeatherIcons.drizzle, nightIcon: WeatherIcons.drizzle, theme: () => 'theme-rain' },
  56: { description: 'Light freezing drizzle', dayIcon: WeatherIcons.drizzle, nightIcon: WeatherIcons.drizzle, theme: () => 'theme-snow' },
  57: { description: 'Dense freezing drizzle', dayIcon: WeatherIcons.drizzle, nightIcon: WeatherIcons.drizzle, theme: () => 'theme-snow' },
  61: { description: 'Slight rain', dayIcon: WeatherIcons.rain, nightIcon: WeatherIcons.rain, theme: () => 'theme-rain' },
  63: { description: 'Moderate rain', dayIcon: WeatherIcons.rain, nightIcon: WeatherIcons.rain, theme: () => 'theme-rain' },
  65: { description: 'Heavy rain', dayIcon: WeatherIcons.rain, nightIcon: WeatherIcons.rain, theme: () => 'theme-rain' },
  66: { description: 'Light freezing rain', dayIcon: WeatherIcons.rain, nightIcon: WeatherIcons.rain, theme: () => 'theme-snow' },
  67: { description: 'Heavy freezing rain', dayIcon: WeatherIcons.rain, nightIcon: WeatherIcons.rain, theme: () => 'theme-snow' },
  71: { description: 'Slight snow fall', dayIcon: WeatherIcons.snow, nightIcon: WeatherIcons.snow, theme: () => 'theme-snow' },
  73: { description: 'Moderate snow fall', dayIcon: WeatherIcons.snow, nightIcon: WeatherIcons.snow, theme: () => 'theme-snow' },
  75: { description: 'Heavy snow fall', dayIcon: WeatherIcons.snow, nightIcon: WeatherIcons.snow, theme: () => 'theme-snow' },
  77: { description: 'Snow grains', dayIcon: WeatherIcons.snow, nightIcon: WeatherIcons.snow, theme: () => 'theme-snow' },
  80: { description: 'Slight rain showers', dayIcon: WeatherIcons.rain, nightIcon: WeatherIcons.rain, theme: () => 'theme-rain' },
  81: { description: 'Moderate rain showers', dayIcon: WeatherIcons.rain, nightIcon: WeatherIcons.rain, theme: () => 'theme-rain' },
  82: { description: 'Violent rain showers', dayIcon: WeatherIcons.rain, nightIcon: WeatherIcons.rain, theme: () => 'theme-rain' },
  85: { description: 'Slight snow showers', dayIcon: WeatherIcons.snow, nightIcon: WeatherIcons.snow, theme: () => 'theme-snow' },
  86: { description: 'Heavy snow showers', dayIcon: WeatherIcons.snow, nightIcon: WeatherIcons.snow, theme: () => 'theme-snow' },
  95: { description: 'Thunderstorm', dayIcon: WeatherIcons.thunderstorm, nightIcon: WeatherIcons.thunderstorm, theme: () => 'theme-thunderstorm' },
  96: { description: 'Thunderstorm with slight hail', dayIcon: WeatherIcons.thunderstorm, nightIcon: WeatherIcons.thunderstorm, theme: () => 'theme-thunderstorm' },
  99: { description: 'Thunderstorm with heavy hail', dayIcon: WeatherIcons.thunderstorm, nightIcon: WeatherIcons.thunderstorm, theme: () => 'theme-thunderstorm' }
};

function getWeatherDetails(code, isDay = 1) {
  const match = WMO_CODES[code] || WMO_CODES[0];
  const iconSvg = (isDay ? match.dayIcon : match.nightIcon)();
  const themeClass = match.theme(isDay);
  return {
    description: match.description,
    icon: iconSvg,
    theme: themeClass
  };
}


// Unit Conversion Helpers

function convertTemp(celsius) {
  if (celsius === null || celsius === undefined || isNaN(celsius)) return '--';
  if (state.unit === 'imperial') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

function convertWindSpeed(kmh) {
  if (kmh === null || kmh === undefined || isNaN(kmh)) return '--';
  if (state.unit === 'imperial') {
    // 1 km/h = 0.621371 mph
    return (kmh * 0.621371).toFixed(1);
  }
  return Number(kmh).toFixed(1);
}

function getWindUnit() {
  return state.unit === 'imperial' ? 'mph' : 'km/h';
}

function getTempUnit() {
  return state.unit === 'imperial' ? '°F' : '°C';
}

function getWindCompass(deg) {
  if (deg === null || deg === undefined) return '--';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return `${deg}° ${directions[index]}`;
}

function getUVDescription(uv) {
  if (uv < 3) return { text: 'Low', class: 'uv-low' };
  if (uv < 6) return { text: 'Moderate', class: 'uv-moderate' };
  if (uv < 8) return { text: 'High', class: 'uv-high' };
  if (uv < 11) return { text: 'Very High', class: 'uv-very-high' };
  return { text: 'Extreme', class: 'uv-extreme' };
}


// API Calls 
async function searchCitySuggestions(query) {
  if (!query || query.trim().length < 2) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error('Error fetching city suggestions:', err);
    return [];
  }
}

//Fetch full weather dataset
async function fetchWeatherData(lat, lon, timezone = 'auto') {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,uv_index&hourly=temperature_2m,weather_code,precipitation_probability,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max,wind_speed_10m_max&timezone=${encodeURIComponent(timezone)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to retrieve forecast from Open-Meteo.');
  return await res.json();
}

//Reverse geocode coordinates to find city & country name
async function reverseGeocodeCoords(lat, lon) {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      return {
        name: data.city || data.locality || data.principalSubdivision || 'Current Location',
        country: data.countryName || '',
        admin1: data.principalSubdivision || '',
        latitude: lat,
        longitude: lon,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto'
      };
    }
  } catch (e) {
    console.warn('Reverse geocoding failed, using coordinates fallback:', e);
  }

  return {
    name: `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`,
    country: '',
    admin1: '',
    latitude: lat,
    longitude: lon,
    timezone: 'auto'
  };
}

// UI Renderers

function showLoading(show) {
  const loader = document.getElementById('loading');
  if (loader) {
    if (show) loader.classList.remove('hidden');
    else loader.classList.add('hidden');
  }
}

function showError(msg) {
  const errBox = document.getElementById('error-message');
  const errText = document.getElementById('error-text');
  if (errBox && errText) {
    if (msg) {
      errText.textContent = msg;
      errBox.classList.remove('hidden');
    } else {
      errBox.classList.add('hidden');
    }
  }
}

//Main render function
function renderAll() {
  if (!state.weatherData) return;
  const current = state.weatherData.current;
  const daily = state.weatherData.daily;
  const hourly = state.weatherData.hourly;
  const isDay = current.is_day === 1;

  // 1. Weather details & theme
  const details = getWeatherDetails(current.weather_code, isDay ? 1 : 0);
  document.body.className = details.theme;

  // 2. City & Location
  document.getElementById('city-name').textContent = state.currentCity.name;
  const locationSubtitle = [state.currentCity.admin1, state.currentCity.country]
    .filter(Boolean)
    .join(', ');
  document.getElementById('city-details').textContent = locationSubtitle || 'Worldwide';

  // 3. Local Time
  const timeZone = state.weatherData.timezone || state.currentCity.timezone || 'UTC';
  try {
    const localTimeStr = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timeZone
    }).format(new Date());
    document.getElementById('current-time').textContent = `Local: ${localTimeStr}`;
  } catch (e) {
    document.getElementById('current-time').textContent = `Local: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }

  // 4. Current temperature & description
  document.getElementById('current-weather-icon').innerHTML = details.icon;
  document.getElementById('current-temp').textContent = convertTemp(current.temperature_2m);
  document.getElementById('temp-unit').textContent = getTempUnit();
  document.getElementById('weather-desc').textContent = details.description;

  // 5. Day High, Low, Feels like
  const todayHigh = daily && daily.temperature_2m_max ? daily.temperature_2m_max[0] : current.temperature_2m;
  const todayLow = daily && daily.temperature_2m_min ? daily.temperature_2m_min[0] : current.temperature_2m;
  document.getElementById('today-high').textContent = `${convertTemp(todayHigh)}°`;
  document.getElementById('today-low').textContent = `${convertTemp(todayLow)}°`;
  document.getElementById('feels-like').textContent = `${convertTemp(current.apparent_temperature)}°`;

  // 6. Date & updated time
  const now = new Date();
  document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  document.getElementById('last-updated').textContent = `Live updated ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  // 7. Meteorological Metrics Cards
  // Wind
  document.getElementById('wind-speed').textContent = convertWindSpeed(current.wind_speed_10m);
  document.getElementById('wind-unit').textContent = getWindUnit();
  document.getElementById('wind-direction').textContent = `Direction: ${getWindCompass(current.wind_direction_10m)}`;

  // Humidity
  document.getElementById('humidity').textContent = Math.round(current.relative_humidity_2m);
  let humDesc = 'Comfortable';
  if (current.relative_humidity_2m > 70) humDesc = 'High humidity';
  else if (current.relative_humidity_2m < 30) humDesc = 'Dry atmosphere';
  document.getElementById('humidity-desc').textContent = humDesc;

  // Pressure
  document.getElementById('pressure').textContent = Math.round(current.surface_pressure || 1013);
  let presDesc = 'Normal';
  if (current.surface_pressure > 1020) presDesc = 'High pressure (Fair)';
  else if (current.surface_pressure < 1005) presDesc = 'Low pressure (Stormy)';
  document.getElementById('pressure-desc').textContent = presDesc;

  // UV Index
  const uvVal = current.uv_index !== undefined ? current.uv_index : (daily?.uv_index_max?.[0] || 0);
  document.getElementById('uv-index').textContent = Number(uvVal).toFixed(1);
  const uvInfo = getUVDescription(uvVal);
  const uvBadge = document.getElementById('uv-desc');
  uvBadge.textContent = uvInfo.text;
  uvBadge.className = `uv-badge ${uvInfo.class}`;

  // Precipitation
  const rainProb = daily?.precipitation_probability_max?.[0] || 0;
  document.getElementById('precip-prob').textContent = rainProb;
  const precipAmt = current.precipitation !== undefined ? current.precipitation : 0;
  document.getElementById('precip-amount').textContent = `Current: ${precipAmt.toFixed(1)} mm`;

  // Sun Schedule (Sunrise / Sunset)
  if (daily?.sunrise?.[0] && daily?.sunset?.[0]) {
    const sunriseDate = new Date(daily.sunrise[0]);
    const sunsetDate = new Date(daily.sunset[0]);
    document.getElementById('sunrise-time').textContent = sunriseDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timeZone
    });
    document.getElementById('sunset-time').textContent = sunsetDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timeZone
    });
  }

  // 8. Hourly Forecast (24 Hours)
  renderHourlyForecast(hourly, timeZone);

  // 9. 7-Day Forecast
  renderWeeklyForecast(daily);
}

 //Render 24-Hour Slider
function renderHourlyForecast(hourly, timeZone) {
  const container = document.getElementById('hourly-list');
  if (!container || !hourly || !hourly.time) return;

  container.innerHTML = '';
  const now = new Date();
  
  // Find index of current hour
  let startIndex = 0;
  const currentIsoPrefix = now.toISOString().slice(0, 13);
  for (let i = 0; i < hourly.time.length; i++) {
    if (hourly.time[i].startsWith(currentIsoPrefix)) {
      startIndex = i;
      break;
    }
  }

  // Display next 24 hours
  const hoursToShow = 24;
  for (let i = startIndex; i < Math.min(startIndex + hoursToShow, hourly.time.length); i++) {
    const timeEntry = new Date(hourly.time[i]);
    const isCurrentHour = i === startIndex;
    const isDay = hourly.is_day ? hourly.is_day[i] === 1 : 1;
    const code = hourly.weather_code[i];
    const temp = convertTemp(hourly.temperature_2m[i]);
    const precipProb = hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0;
    const weather = getWeatherDetails(code, isDay ? 1 : 0);

    const timeLabel = isCurrentHour
      ? 'Now'
      : timeEntry.toLocaleTimeString('en-US', {
          hour: 'numeric',
          hour12: true,
          timeZone: timeZone
        });

    const item = document.createElement('div');
    item.className = `hourly-item ${isCurrentHour ? 'now' : ''}`;
    item.innerHTML = `
      <span class="hourly-time">${timeLabel}</span>
      <div class="hourly-icon">${weather.icon}</div>
      <span class="hourly-temp">${temp}°</span>
      ${
        precipProb > 0
          ? `<span class="hourly-precip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
              </svg>
              ${precipProb}%
            </span>`
          : '<span class="hourly-precip" style="visibility:hidden">0%</span>'
      }
    `;
    container.appendChild(item);
  }
}

 //Render 7-Day Table with Range Bar
function renderWeeklyForecast(daily) {
  const container = document.getElementById('forecast-list');
  if (!container || !daily || !daily.time) return;

  container.innerHTML = '';

  // Calculate week min and max across all days for proportional range bar
  let weekMin = Infinity;
  let weekMax = -Infinity;
  for (let i = 0; i < daily.time.length; i++) {
    if (daily.temperature_2m_min[i] < weekMin) weekMin = daily.temperature_2m_min[i];
    if (daily.temperature_2m_max[i] > weekMax) weekMax = daily.temperature_2m_max[i];
  }
  const weekRange = weekMax - weekMin || 1;

  for (let i = 0; i < daily.time.length; i++) {
    const dateObj = new Date(daily.time[i] + 'T00:00:00');
    const isToday = i === 0;
    const isTomorrow = i === 1;

    let dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    if (isToday) dayName = 'Today';
    else if (isTomorrow) dayName = 'Tomorrow';

    const dateFormatted = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const code = daily.weather_code[i];
    const details = getWeatherDetails(code, 1);
    const minTemp = convertTemp(daily.temperature_2m_min[i]);
    const maxTemp = convertTemp(daily.temperature_2m_max[i]);
    const rainProb = daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 0;

    // Relative bar widths
    const leftPercent = Math.max(0, Math.min(100, ((daily.temperature_2m_min[i] - weekMin) / weekRange) * 100));
    const widthPercent = Math.max(10, Math.min(100 - leftPercent, ((daily.temperature_2m_max[i] - daily.temperature_2m_min[i]) / weekRange) * 100));

    const row = document.createElement('div');
    row.className = 'forecast-row';
    row.innerHTML = `
      <div class="forecast-day-group">
        <span class="forecast-day-name">${dayName}</span>
        <span class="forecast-day-date">${dateFormatted}</span>
      </div>
      <div class="forecast-condition">
        <div class="forecast-row-icon">${details.icon}</div>
        <span class="forecast-desc">${details.description}</span>
      </div>
      <div class="forecast-rain-chance">
        ${
          rainProb > 5
            ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
              </svg>
              <span>${rainProb}%</span>`
            : ''
        }
      </div>
      <div class="forecast-temp-range">
        <span class="temp-min">${minTemp}°</span>
        <div class="range-bar-track">
          <div class="range-bar-fill" style="left: ${leftPercent}%; width: ${widthPercent}%;"></div>
        </div>
        <span class="temp-max">${maxTemp}°</span>
      </div>
    `;
    container.appendChild(row);
  }
}

// Core Execution Logic

async function loadWeatherForCity(cityObj) {
  showError(false);
  showLoading(true);

  try {
    const data = await fetchWeatherData(cityObj.latitude, cityObj.longitude, cityObj.timezone);
    state.currentCity = cityObj;
    state.weatherData = data;
    localStorage.setItem('skypulse_last_city', JSON.stringify(cityObj));
    renderAll();
  } catch (err) {
    console.error('Error fetching weather:', err);
    showError(err.message || 'Unable to retrieve weather. Please check your connection and try again.');
  } finally {
    showLoading(false);
  }
}

async function handleCitySearch(query) {
  if (!query || !query.trim()) {
    showError('Please enter a city or location name.');
    return;
  }

  showLoading(true);
  showError(false);

  try {
    const suggestions = await searchCitySuggestions(query);
    if (!suggestions || suggestions.length === 0) {
      showError(`No locations found matching "${query}". Try searching another city.`);
      showLoading(false);
      return;
    }

    const first = suggestions[0];
    const cityObj = {
      name: first.name,
      country: first.country || '',
      admin1: first.admin1 || '',
      latitude: first.latitude,
      longitude: first.longitude,
      timezone: first.timezone || 'auto'
    };

    closeSuggestions();
    await loadWeatherForCity(cityObj);
  } catch (err) {
    showError('Search failed. Please try again.');
    showLoading(false);
  }
}

// Autocomplete Suggestions Dropdown
let debounceTimer = null;

function renderSuggestions(items) {
  const box = document.getElementById('suggestions-box');
  if (!box) return;

  state.suggestions = items;
  state.activeSuggestionIndex = -1;

  if (items.length === 0) {
    box.classList.add('hidden');
    box.innerHTML = '';
    return;
  }

  box.innerHTML = items
    .map((item, idx) => {
      const locationParts = [item.admin1, item.country].filter(Boolean).join(', ');
      return `
        <div class="suggestion-item" data-index="${idx}" role="option">
          <span class="suggestion-city">${item.name}</span>
          <span class="suggestion-country">${locationParts}</span>
        </div>
      `;
    })
    .join('');

  box.classList.remove('hidden');

  // Click on suggestion
  box.querySelectorAll('.suggestion-item').forEach((el) => {
    el.addEventListener('click', () => {
      const idx = parseInt(el.getAttribute('data-index'), 10);
      const chosen = state.suggestions[idx];
      if (chosen) {
        document.getElementById('search-input').value = chosen.name;
        closeSuggestions();
        loadWeatherForCity({
          name: chosen.name,
          country: chosen.country || '',
          admin1: chosen.admin1 || '',
          latitude: chosen.latitude,
          longitude: chosen.longitude,
          timezone: chosen.timezone || 'auto'
        });
      }
    });
  });
}

function closeSuggestions() {
  const box = document.getElementById('suggestions-box');
  if (box) {
    box.classList.add('hidden');
    box.innerHTML = '';
  }
  state.suggestions = [];
  state.activeSuggestionIndex = -1;
}

// Event Listeners Setup

function initEventListeners() {
  const searchInput = document.getElementById('search-input');
  const searchForm = document.getElementById('search-form');
  const clearBtn = document.getElementById('clear-search-btn');
  const geoBtn = document.getElementById('geo-btn');
  const unitCBtn = document.getElementById('unit-c');
  const unitFBtn = document.getElementById('unit-f');
  const retryBtn = document.getElementById('error-retry-btn');
  const suggestionsBox = document.getElementById('suggestions-box');

  // Search input typing with debounce
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (clearBtn) {
        if (val.length > 0) clearBtn.classList.remove('hidden');
        else clearBtn.classList.add('hidden');
      }

      clearTimeout(debounceTimer);
      if (val.length < 2) {
        closeSuggestions();
        return;
      }

      debounceTimer = setTimeout(async () => {
        const results = await searchCitySuggestions(val);
        renderSuggestions(results);
      }, 250);
    });

    // Keyboard navigation in suggestions
    searchInput.addEventListener('keydown', (e) => {
      if (!suggestionsBox || suggestionsBox.classList.contains('hidden')) {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleCitySearch(searchInput.value);
        }
        return;
      }

      const items = suggestionsBox.querySelectorAll('.suggestion-item');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        state.activeSuggestionIndex = (state.activeSuggestionIndex + 1) % items.length;
        updateActiveSuggestion(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        state.activeSuggestionIndex = (state.activeSuggestionIndex - 1 + items.length) % items.length;
        updateActiveSuggestion(items);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (state.activeSuggestionIndex >= 0 && state.suggestions[state.activeSuggestionIndex]) {
          const chosen = state.suggestions[state.activeSuggestionIndex];
          searchInput.value = chosen.name;
          closeSuggestions();
          loadWeatherForCity({
            name: chosen.name,
            country: chosen.country || '',
            admin1: chosen.admin1 || '',
            latitude: chosen.latitude,
            longitude: chosen.longitude,
            timezone: chosen.timezone || 'auto'
          });
        } else {
          handleCitySearch(searchInput.value);
        }
      } else if (e.key === 'Escape') {
        closeSuggestions();
      }
    });
  }

  function updateActiveSuggestion(items) {
    items.forEach((item, index) => {
      if (index === state.activeSuggestionIndex) {
        item.classList.add('active');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('active');
      }
    });
  }

  // Clear button
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      clearBtn.classList.add('hidden');
      closeSuggestions();
    });
  }

  // Form submit
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (searchInput) handleCitySearch(searchInput.value);
    });
  }

  // Close suggestions if clicked outside
  document.addEventListener('click', (e) => {
    if (searchForm && !searchForm.contains(e.target)) {
      closeSuggestions();
    }
  });

  // Trending City Chips
  document.querySelectorAll('.quick-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const cityName = chip.getAttribute('data-city');
      if (cityName) {
        if (searchInput) searchInput.value = cityName;
        handleCitySearch(cityName);
      }
    });
  });

  // Unit Selector Toggle
  function updateUnitSelection(newUnit) {
    state.unit = newUnit;
    localStorage.setItem('skypulse_unit', newUnit);
    if (newUnit === 'metric') {
      unitCBtn?.classList.add('active');
      unitCBtn?.setAttribute('aria-checked', 'true');
      unitFBtn?.classList.remove('active');
      unitFBtn?.setAttribute('aria-checked', 'false');
    } else {
      unitFBtn?.classList.add('active');
      unitFBtn?.setAttribute('aria-checked', 'true');
      unitCBtn?.classList.remove('active');
      unitCBtn?.setAttribute('aria-checked', 'false');
    }
    renderAll();
  }

  if (unitCBtn) unitCBtn.addEventListener('click', () => updateUnitSelection('metric'));
  if (unitFBtn) unitFBtn.addEventListener('click', () => updateUnitSelection('imperial'));

  // Locate Me (HTML5 Geolocation)
  if (geoBtn) {
    geoBtn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser.');
        return;
      }

      showLoading(true);
      showError(false);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const cityObj = await reverseGeocodeCoords(lat, lon);
          if (searchInput) searchInput.value = cityObj.name;
          await loadWeatherForCity(cityObj);
        },
        (error) => {
          showLoading(false);
          let message = 'Unable to determine your location.';
          if (error.code === error.PERMISSION_DENIED) {
            message = 'Location access was denied. Please allow location permissions or search for a city.';
          }
          showError(message);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  }

  // Retry Button
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      loadWeatherForCity(state.currentCity);
    });
  }
}

// Initialization on page load

window.addEventListener('DOMContentLoaded', () => {
  // Apply initial unit switch state
  if (state.unit === 'imperial') {
    document.getElementById('unit-f')?.classList.add('active');
    document.getElementById('unit-c')?.classList.remove('active');
  }

  initEventListeners();

  // Load weather for default or last cached city
  loadWeatherForCity(state.currentCity);
});
