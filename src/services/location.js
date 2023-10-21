const WEATHER_API_URL = import.meta.env.VITE_WEATHER_API_URL;
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const COORDS_API_URL = import.meta.env.VITE_COORDS_API_URL;

const getLocationCoords = () => {
  return fetch(COORDS_API_URL)
    .then((res) => res.json())
    .then(({ latitude, longitude }) => ({ latitude, longitude }));
};

const formatResponseData = (data) => {
  const newData = {
    place: data.name,
    temp: Math.round(data.main.temp),
    name: data.weather[0].main,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
  };

  return newData;
};

const getLocationByCoords = () => {
  const response = getLocationCoords().then(async (response) => {
    if (response.error) {
      return response;
    }

    const weatherData = await fetch(
      `${WEATHER_API_URL}?lat=${response.latitude}&lon=${response.longitude}&appid=${WEATHER_API_KEY}&units=metric`
    ).then((res) => res.json());

    return { weatherData: formatResponseData(weatherData) };
  });

  return response;
};

const getLocationBySearch = (query) => {
  const response = fetch(
    `${WEATHER_API_URL}?q=${query}&appid=${WEATHER_API_KEY}&units=metric`
  )
    .then((res) => res.json())
    .then((response) => {
      return { weatherData: formatResponseData(response) };
    });

  return response;
};

export { getLocationByCoords, getLocationBySearch };
