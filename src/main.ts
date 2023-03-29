import { getWeather } from './weather';
import { ICON_MAP } from './iconMap';
import './styles/main.scss';

navigator.geolocation.getCurrentPosition(positionSuccess, positionError);

function positionSuccess({ coords }: { coords: GeolocationCoordinates }) {
  getWeather(
    coords.latitude,
    coords.longitude,
    Intl.DateTimeFormat().resolvedOptions().timeZone
  )
    .then(renderWeather)
    .catch((e: Error) => {
      console.error(e);
      alert('Something went wrong');
    });
}

function positionError() {
  alert(
    'There was an error getting your location. Please allow us to use your  location and refresh the page.'
  );
}

function renderWeather({ current, daily, hourly }: any): void {
  renderCurrentWeather(current);
  renderDailyWeather(daily);
  renderHourlyWeather(hourly);

  setTimeout(() => {
    document.body.classList.remove('blurred');
  }, 300);
}

function setValue(
  selector: string,
  value: string,
  { parent = document }: { parent?: Document | HTMLElement } = {}
) {
  const element = parent.querySelector(`[data-${selector}]`) as HTMLElement;

  if (element !== null) {
    element.innerText = value;
  }
}

function getIconUrl(iconCode: string): string {
  return `icons/${ICON_MAP.get(iconCode)}.svg`;
}

const currentIcon = document.querySelector(
  '[data-current-icon]'
) as HTMLImageElement;

function renderCurrentWeather(current: any) {
  currentIcon.src = getIconUrl(current.iconCode);
  setValue('current-temp', current.currentTemp);
  setValue('current-high', current.highTemp);
  setValue('current-fl-high', current.highFeelsLike);
  setValue('current-wind', current.windSpeed);
  setValue('current-low', current.lowTemp);
  setValue('current-fl-low', current.lowFeelsLike);
  setValue('current-precip', current.precip);
}

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: 'short' });
const dailySection = document.querySelector(
  '[data-day-section]'
) as HTMLElement;
const dayCardTemplate = document.getElementById('day-card-template') as any;

function renderDailyWeather(daily: any[]) {
  dailySection.innerHTML = '';
  daily.forEach((day) => {
    const element: any = dayCardTemplate.content.cloneNode(true);
    setValue('temp', day.maxTemp, { parent: element });
    setValue('date', DAY_FORMATTER.format(day.timestamp), { parent: element });
    element.querySelector('[data-icon]').src = getIconUrl(day.iconCode);
    dailySection.append(element);
  });
}

const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, { hour: 'numeric' });
const hourlySection = document.querySelector(
  '[data-hour-section]'
) as HTMLElement;
const hourRowTemplate = document.getElementById('hour-row-template') as any;
function renderHourlyWeather(hourly: any[]) {
  hourlySection.innerHTML = '';
  hourly.forEach((hour) => {
    const element = hourRowTemplate.content.cloneNode(true);
    setValue('temp', hour.temp, { parent: element });
    setValue('fl-temp', hour.feelsLike, { parent: element });
    setValue('wind', hour.windSpeed, { parent: element });
    setValue('precip', hour.precip, { parent: element });
    setValue('day', DAY_FORMATTER.format(hour.timestamp), { parent: element });
    setValue('time', HOUR_FORMATTER.format(hour.timestamp), {
      parent: element,
    });
    element.querySelector('[data-icon]').src = getIconUrl(hour.iconCode);
    hourlySection.append(element);
  });
}
