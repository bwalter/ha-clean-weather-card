/*!
 * clean-weather-card
 * A clean, read-only weather card for Home Assistant.
 * https://github.com/bwalter/ha-clean-weather-card
 *
 * The card reads any `weather.*` entity. Forecasts are obtained through the
 * `weather/subscribe_forecast` websocket subscription (the same mechanism the
 * built-in weather card uses), so no helper, automation or entity is needed.
 */


/* ------------------------------------------------------------------ */
/* Defaults & i18n                                                     */
/* ------------------------------------------------------------------ */

const DEFAULTS = {
  title: "",
  icon_size: 96, // main icon in the header (px, 20..100)
  shortcuts_display: "icon", // icon | icon_label | label
  shortcuts: ["precipitation_probability", "wind_speed", "wind_gust_speed"], // current values below the header
  hourly: {
    enabled: true,
    visible_columns: 4, // 3..8
    total_columns: 8, // 3..24 (scrollable beyond visible_columns)
    interval: 2, // hours between two columns, 1..12
    main: "temperature",
    main_icon: false, // icon in front of the main attribute
    secondary: "none",
  },
  daily: {
    enabled: true,
    days: 5, // 1..14
    columns: 1, // 1 or 2, filled top to bottom
    day_label: "day_short", // day_short | day_long | day_date | date
    temperature: "range", // min_max | range | none
    precipitation: "none", // value | range | none
    wind: "icon", // icon | value | gust | none
    attributes: ["precipitation_probability"], // additional attributes, one column each
  },
};

const ATTRIBUTES = [
  "temperature", "apparent_temperature", "wind_speed", "wind_gust_speed", "precipitation",
  "precipitation_probability", "humidity", "cloud_coverage", "uv_index", "pressure", "dew_point", "visibility",
];

/*
 * TRANSLATIONS - to add a language, copy the `en` block below, change the key
 * to the language code (e.g. "es") and translate the values. Missing keys fall
 * back to English. Check with: node scripts/check-translations.js
 */
const I18N = {
  de: {
    today: "Heute",
    feels: "gefühlt",
    attr: {apparent_temperature:"Gefühlt",wind_speed:"Wind",wind_gust_speed:"Böen",precipitation:"Niederschlag",precipitation_probability:"Regenwahrscheinlichkeit",humidity:"Luftfeuchtigkeit",cloud_coverage:"Bewölkung",uv_index:"UV-Index",pressure:"Luftdruck",dew_point:"Taupunkt",visibility:"Sichtweite"},
    gusts: "Böen",
    to: "bis",
    nodata: "Keine Wetterdaten",
    unavailable: "Wetter-Entität nicht verfügbar",
    no_hourly: "Die stündliche Vorhersage wird von dieser Wetter-Integration nicht unterstützt.",
    no_daily: "Die tägliche Vorhersage wird von dieser Wetter-Integration nicht unterstützt.",
    cond: {
      sunny: "Sonnig",
      "clear-night": "Klar",
      partlycloudy: "Teils bewölkt",
      cloudy: "Bewölkt",
      fog: "Nebel",
      hail: "Hagel",
      lightning: "Gewitter",
      "lightning-rainy": "Gewitter",
      pouring: "Starkregen",
      rainy: "Regen",
      snowy: "Schnee",
      "snowy-rainy": "Schneeregen",
      windy: "Windig",
      "windy-variant": "Windig",
      exceptional: "Unwetter",
    },
    compass: ["N", "NNO", "NO", "ONO", "O", "OSO", "SO", "SSO", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"],
  },
  en: {
    today: "Today",
    feels: "feels like",
    attr: {apparent_temperature:"Feels like",wind_speed:"Wind",wind_gust_speed:"Wind gusts",precipitation:"Precipitation",precipitation_probability:"Rain probability",humidity:"Humidity",cloud_coverage:"Cloud cover",uv_index:"UV index",pressure:"Pressure",dew_point:"Dew point",visibility:"Visibility"},
    gusts: "Gusts",
    to: "to",
    nodata: "No weather data",
    unavailable: "Weather entity unavailable",
    no_hourly: "Hourly forecast is not supported by this weather integration.",
    no_daily: "Daily forecast is not supported by this weather integration.",
    cond: {
      sunny: "Sunny",
      "clear-night": "Clear",
      partlycloudy: "Partly cloudy",
      cloudy: "Cloudy",
      fog: "Fog",
      hail: "Hail",
      lightning: "Thunderstorm",
      "lightning-rainy": "Thunderstorm",
      pouring: "Heavy rain",
      rainy: "Rain",
      snowy: "Snow",
      "snowy-rainy": "Sleet",
      windy: "Windy",
      "windy-variant": "Windy",
      exceptional: "Severe weather",
    },
    compass: ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"],
  },
  fr: {
    today: "Auj.",
    feels: "ressenti",
    attr: {apparent_temperature:"Ressenti",wind_speed:"Vent",wind_gust_speed:"Rafales",precipitation:"Précipitations",precipitation_probability:"Probabilité de pluie",humidity:"Humidité",cloud_coverage:"Nébulosité",uv_index:"Indice UV",pressure:"Pression",dew_point:"Point de rosée",visibility:"Visibilité"},
    gusts: "Rafales",
    to: "à",
    nodata: "Pas de données météo",
    unavailable: "Entité météo indisponible",
    no_hourly: "Les prévisions horaires ne sont pas prises en charge par cette intégration météo.",
    no_daily: "Les prévisions quotidiennes ne sont pas prises en charge par cette intégration météo.",
    cond: {
      sunny: "Ensoleillé",
      "clear-night": "Dégagé",
      partlycloudy: "Partiellement nuageux",
      cloudy: "Nuageux",
      fog: "Brouillard",
      hail: "Grêle",
      lightning: "Orage",
      "lightning-rainy": "Orage",
      pouring: "Pluie forte",
      rainy: "Pluie",
      snowy: "Neige",
      "snowy-rainy": "Neige fondue",
      windy: "Venteux",
      "windy-variant": "Venteux",
      exceptional: "Alerte météo",
    },
    compass: ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSO", "SO", "OSO", "O", "ONO", "NO", "NNO"],
  },

  es: {
    today: "Hoy",
    feels: "sensación",
    attr: { apparent_temperature: "Sensación térmica",wind_speed: "Viento",wind_gust_speed: "Rachas",precipitation: "Precipitación",precipitation_probability: "Prob. de lluvia",humidity: "Humedad",cloud_coverage: "Nubosidad",uv_index: "Índice UV",pressure: "Presión",dew_point: "Punto de rocío",visibility: "Visibilidad" },
    gusts: "Rachas",
    to: "a",
    nodata: "Sin datos meteorológicos",
    unavailable: "Entidad meteorológica no disponible",
    no_hourly: "Esta integración meteorológica no admite la previsión por horas.",
    no_daily: "Esta integración meteorológica no admite la previsión diaria.",
    cond: {
      sunny: "Soleado",
      "clear-night": "Despejado",
      partlycloudy: "Parcialmente nublado",
      cloudy: "Nublado",
      fog: "Niebla",
      hail: "Granizo",
      lightning: "Tormenta",
      "lightning-rainy": "Tormenta",
      pouring: "Lluvia intensa",
      rainy: "Lluvia",
      snowy: "Nieve",
      "snowy-rainy": "Aguanieve",
      windy: "Ventoso",
      "windy-variant": "Ventoso",
      exceptional: "Tiempo severo",
    },
    compass: ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSO", "SO", "OSO", "O", "ONO", "NO", "NNO"],
  },
  it: {
    today: "Oggi",
    feels: "percepita",
    attr: { apparent_temperature: "Temperatura percepita",wind_speed: "Vento",wind_gust_speed: "Raffiche",precipitation: "Precipitazioni",precipitation_probability: "Prob. di pioggia",humidity: "Umidità",cloud_coverage: "Nuvolosità",uv_index: "Indice UV",pressure: "Pressione",dew_point: "Punto di rugiada",visibility: "Visibilità" },
    gusts: "Raffiche",
    to: "a",
    nodata: "Nessun dato meteo",
    unavailable: "Entità meteo non disponibile",
    no_hourly: "Questa integrazione meteo non supporta le previsioni orarie.",
    no_daily: "Questa integrazione meteo non supporta le previsioni giornaliere.",
    cond: {
      sunny: "Soleggiato",
      "clear-night": "Sereno",
      partlycloudy: "Parzialmente nuvoloso",
      cloudy: "Nuvoloso",
      fog: "Nebbia",
      hail: "Grandine",
      lightning: "Temporale",
      "lightning-rainy": "Temporale",
      pouring: "Pioggia forte",
      rainy: "Pioggia",
      snowy: "Neve",
      "snowy-rainy": "Nevischio",
      windy: "Ventoso",
      "windy-variant": "Ventoso",
      exceptional: "Maltempo",
    },
    compass: ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSO", "SO", "OSO", "O", "ONO", "NO", "NNO"],
  },
  nl: {
    today: "Vandaag",
    feels: "voelt als",
    attr: { apparent_temperature: "Gevoelstemperatuur",wind_speed: "Wind",wind_gust_speed: "Windstoten",precipitation: "Neerslag",precipitation_probability: "Regenkans",humidity: "Luchtvochtigheid",cloud_coverage: "Bewolking",uv_index: "UV-index",pressure: "Luchtdruk",dew_point: "Dauwpunt",visibility: "Zicht" },
    gusts: "Windstoten",
    to: "tot",
    nodata: "Geen weergegevens",
    unavailable: "Weerentiteit niet beschikbaar",
    no_hourly: "Deze weerintegratie ondersteunt geen uurlijkse voorspelling.",
    no_daily: "Deze weerintegratie ondersteunt geen dagelijkse voorspelling.",
    cond: {
      sunny: "Zonnig",
      "clear-night": "Helder",
      partlycloudy: "Half bewolkt",
      cloudy: "Bewolkt",
      fog: "Mist",
      hail: "Hagel",
      lightning: "Onweer",
      "lightning-rainy": "Onweer",
      pouring: "Zware regen",
      rainy: "Regen",
      snowy: "Sneeuw",
      "snowy-rainy": "Natte sneeuw",
      windy: "Winderig",
      "windy-variant": "Winderig",
      exceptional: "Extreem weer",
    },
    compass: ["N", "NNO", "NO", "ONO", "O", "OZO", "ZO", "ZZO", "Z", "ZZW", "ZW", "WZW", "W", "WNW", "NW", "NNW"],
  },
  pt: {
    today: "Hoje",
    feels: "sensação",
    attr: { apparent_temperature: "Sensação térmica",wind_speed: "Vento",wind_gust_speed: "Rajadas",precipitation: "Precipitação",precipitation_probability: "Prob. de chuva",humidity: "Humidade",cloud_coverage: "Nebulosidade",uv_index: "Índice UV",pressure: "Pressão",dew_point: "Ponto de orvalho",visibility: "Visibilidade" },
    gusts: "Rajadas",
    to: "a",
    nodata: "Sem dados meteorológicos",
    unavailable: "Entidade meteorológica indisponível",
    no_hourly: "Esta integração meteorológica não suporta a previsão horária.",
    no_daily: "Esta integração meteorológica não suporta a previsão diária.",
    cond: {
      sunny: "Ensolarado",
      "clear-night": "Limpo",
      partlycloudy: "Parcialmente nublado",
      cloudy: "Nublado",
      fog: "Nevoeiro",
      hail: "Granizo",
      lightning: "Trovoada",
      "lightning-rainy": "Trovoada",
      pouring: "Chuva forte",
      rainy: "Chuva",
      snowy: "Neve",
      "snowy-rainy": "Aguaneve",
      windy: "Ventoso",
      "windy-variant": "Ventoso",
      exceptional: "Tempo severo",
    },
    compass: ["N", "NNE", "NE", "ENE", "L", "ESE", "SE", "SSE", "S", "SSO", "SO", "OSO", "O", "ONO", "NO", "NNO"],
  },
  pl: {
    today: "Dziś",
    feels: "odczuwalna",
    attr: { apparent_temperature: "Temp. odczuwalna",wind_speed: "Wiatr",wind_gust_speed: "Porywy",precipitation: "Opady",precipitation_probability: "Prawdop. deszczu",humidity: "Wilgotność",cloud_coverage: "Zachmurzenie",uv_index: "Indeks UV",pressure: "Ciśnienie",dew_point: "Punkt rosy",visibility: "Widoczność" },
    gusts: "Porywy",
    to: "do",
    nodata: "Brak danych pogodowych",
    unavailable: "Encja pogody niedostępna",
    no_hourly: "Ta integracja pogody nie obsługuje prognozy godzinowej.",
    no_daily: "Ta integracja pogody nie obsługuje prognozy dziennej.",
    cond: {
      sunny: "Słonecznie",
      "clear-night": "Bezchmurnie",
      partlycloudy: "Częściowe zachmurzenie",
      cloudy: "Pochmurno",
      fog: "Mgła",
      hail: "Grad",
      lightning: "Burza",
      "lightning-rainy": "Burza",
      pouring: "Ulewa",
      rainy: "Deszcz",
      snowy: "Śnieg",
      "snowy-rainy": "Deszcz ze śniegiem",
      windy: "Wietrznie",
      "windy-variant": "Wietrznie",
      exceptional: "Niebezpieczna pogoda",
    },
    compass: ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"],
  },
};

/** Texts of a language; keys missing in a translation fall back to English. */
function translations(lang) {
  const en = I18N.en;
  const l = I18N[lang] || en;
  return { ...en, ...l, cond: { ...en.cond, ...l.cond }, attr: { ...en.attr, ...l.attr } };
}

const COMPASS_EN = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

const ICONS = {
  sunny: "mdi:weather-sunny",
  "clear-night": "mdi:weather-night",
  partlycloudy: "mdi:weather-partly-cloudy",
  "partlycloudy-night": "mdi:weather-night-partly-cloudy",
  fog: "mdi:weather-fog",
  hail: "mdi:weather-hail",
  lightning: "mdi:weather-lightning",
  "lightning-rainy": "mdi:weather-lightning-rainy",
  snowy: "mdi:weather-snowy",
  "snowy-rainy": "mdi:weather-snowy-rainy",
  windy: "mdi:weather-windy",
  "windy-variant": "mdi:weather-windy-variant",
  exceptional: "mdi:alert-circle-outline",
  unknown: "mdi:help-circle-outline",
};

/** Hourly columns can also show "temperature + feels like". */
const HOURLY_ATTRIBUTES = ["temperature", "temperature_feels", ...ATTRIBUTES.slice(1)];
const DAILY_ATTRIBUTES = ATTRIBUTES.filter((a) => a !== "temperature");
/** Shortcuts show the current state: no temperature (shown large already) and no precipitation amount. */
const SHORTCUT_ATTRIBUTES = DAILY_ATTRIBUTES.filter((a) => a !== "precipitation");

/** A list of attributes: missing -> default, empty -> none; always in catalog order. */
function normalizeList(raw, allowed, def) {
  let list = raw === undefined ? def : raw;
  if (!Array.isArray(list)) list = [];
  return allowed.filter((a) => list.includes(a));
}

/** Additional daily attributes (the old extra_1 / extra_2 keys are still read). */
function normalizeAttributes(daily) {
  let list = daily?.attributes;
  if (list === undefined && daily && (daily.extra_1 !== undefined || daily.extra_2 !== undefined)) {
    list = [daily.extra_1, daily.extra_2];
  }
  return normalizeList(list, DAILY_ATTRIBUTES, DEFAULTS.daily.attributes);
}

const ATTR_ICONS = {
  temperature: "mdi:thermometer",
  temperature_feels: "mdi:thermometer-lines",
  apparent_temperature: "mdi:thermometer-lines",
  precipitation: "mdi:water",
  precipitation_probability: "mdi:umbrella",
  humidity: "mdi:water-percent",
  cloud_coverage: "mdi:cloud-outline",
  uv_index: "mdi:weather-sunny-alert",
  pressure: "mdi:gauge",
  dew_point: "mdi:thermometer-water",
  visibility: "mdi:eye-outline",
};

/** Last forecasts per entity: shown immediately when the card is re-created (no flicker). */
const FORECAST_CACHE = new Map();

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const num = (v) => (v === null || v === undefined || v === "" || Number.isNaN(Number(v)) ? null : Number(v));
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const rnd = (v) => `${Math.round(v)}`;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const oneOf = (v, list, d) => (list.includes(v) ? v : d);
/** Option with a "none" value: missing -> default, empty/null (cleared in the editor) -> "none". */
const opt = (raw, list, d) => (raw === undefined ? d : raw === null || raw === "" ? "none" : list.includes(raw) ? raw : d);

function toKmh(v, unit) {
  if (v === null) return null;
  switch (String(unit || "km/h").toLowerCase()) {
    case "m/s": return v * 3.6;
    case "mph": return v * 1.609344;
    case "kn":
    case "kt": return v * 1.852;
    case "ft/s": return v * 1.09728;
    default: return v;
  }
}

function toMm(v, unit) {
  if (v === null) return null;
  const u = String(unit || "mm").toLowerCase();
  if (u === "in") return v * 25.4;
  if (u === "cm") return v * 10;
  return v;
}

/** Feels-like temperature: windchill (cold), heat index (hot), else T. */
function feelsLike(temp, windKmh, humidity, tempUnit) {
  const fahrenheit = String(tempUnit || "").includes("F");
  const c = fahrenheit ? ((temp - 32) * 5) / 9 : temp;
  let out = c;
  if (c <= 15 && windKmh !== null && windKmh > 4.8) {
    const p = Math.pow(windKmh, 0.16);
    out = Math.min(c, 13.12 + 0.6215 * c - 11.37 * p + 0.3965 * c * p);
  } else if (c >= 26 && humidity !== null) {
    const e = (humidity / 100) * 6.105 * Math.exp((17.27 * c) / (237.7 + c));
    out = c + 0.33 * e - 0.7 * ((windKmh ?? 0) / 3.6) - 4.0;
  }
  return fahrenheit ? (out * 9) / 5 + 32 : out;
}

/** Colour for a temperature: deep blue (-10 °C) ... green (12 °C) ... red (35 °C). */
function tempColor(t, unit) {
  const c = String(unit || "").includes("F") ? ((t - 32) * 5) / 9 : t;
  const hue = 220 - clamp((c + 10) / 45, 0, 1) * 220;
  return `hsl(${Math.round(hue)} 78% 52%)`;
}

const BEARINGS = {
  N: 0, NNE: 22.5, NE: 45, ENE: 67.5, E: 90, ESE: 112.5, SE: 135, SSE: 157.5,
  S: 180, SSW: 202.5, SW: 225, WSW: 247.5, W: 270, WNW: 292.5, NW: 315, NNW: 337.5,
};

function bearingDeg(v) {
  const n = num(v);
  if (n !== null) return ((n % 360) + 360) % 360;
  if (typeof v === "string" && v.toUpperCase() in BEARINGS) return BEARINGS[v.toUpperCase()];
  return null;
}

/** Rain level 1..4 (4 = downpour). Unknown amount -> 2 drops. `perDay` uses daily thresholds. */
function rainLevel(mm, perDay) {
  if (mm === null || mm === undefined) return 2;
  const t = perDay ? [5, 10, 20] : [2.5, 7.5, 15];
  if (mm < t[0]) return 1;
  if (mm < t[1]) return 2;
  if (mm < t[2]) return 3;
  return 4;
}

const windLevel = (gustKmh) => (gustKmh === null ? 0 : gustKmh >= 90 ? 3 : gustKmh >= 65 ? 2 : gustKmh >= 50 ? 1 : 0);

/**
 * One cloud shape for both "cloudy" and "rain": the cloud sits at exactly the
 * same place, rain only adds drops below it.
 */
const CLOUD_PATH = "M6 16A4.5 4.5 0 0 1 5.5 7A6.5 6.5 0 0 1 17.8 5.6A5 5 0 0 1 18 16Z";

function rainMarks(level) {
  const drop = (x, y = 0) =>
    `<path transform="translate(${x - 12} ${y})" d="M12 17.6c1 1.5 1.8 2.5 1.8 3.4a1.8 1.8 0 0 1-3.6 0c0-.9.8-1.9 1.8-3.4z" fill="var(--cwc-rain)"/>`;
  if (level === 0) return "";
  if (level === 1) return drop(12);
  if (level === 2) return drop(9) + drop(15);
  if (level === 3) return drop(7) + drop(12, 0.8) + drop(17);
  return [5, 8.5, 12, 15.5, 19]
    .map((x) => `<path d="M${x} 17.6v5.4" stroke="var(--cwc-rain)" stroke-width="1.8" stroke-linecap="round"/>`)
    .join("");
}

function cloudSvg(level) {
  return (
    `<svg viewBox="0 0 24 24" aria-hidden="true">` +
    `<path d="${CLOUD_PATH}" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/>` +
    `${rainMarks(level)}</svg>`
  );
}

/** Wind without any cloud: two or three curled lines (level < 2 -> two), hurricane for level 3. */
function windSvg(level) {
  if (level >= 3) return `<ha-icon icon="mdi:weather-hurricane"></ha-icon>`;
  const lines = [
    "M9.6 4.6A2 2 0 1 1 11 8H2",
    "M17.7 7.7A2.5 2.5 0 1 1 19.5 12H2",
  ];
  if (level >= 2) lines.push("M12.6 19.4A2 2 0 1 0 14 16H2");
  // viewBox cropped to the drawn lines (symmetric around the centre) so the glyph is not shifted upwards
  const vb = level >= 2 ? "1 2 22 20" : "1 2 22 11";
  return (
    `<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">` +
    lines.map((d) => `<path d="${d}"/>`).join("") + `</svg>`
  );
}

function iconHtml(cond, { size = 28, mm = null, perDay = false, night = false } = {}) {
  let inner;
  if (cond === "rainy" || cond === "pouring") inner = cloudSvg(rainLevel(mm, perDay));
  else if (cond === "cloudy") inner = cloudSvg(0);
  else {
    let key = cond in ICONS ? cond : "unknown";
    if (night && key === "sunny") key = "clear-night";
    if (night && key === "partlycloudy") key = "partlycloudy-night";
    inner = `<ha-icon icon="${ICONS[key]}"></ha-icon>`;
  }
  const cl = cond === "rainy" || cond === "pouring" || cond === "cloudy" ? " cl" : "";
  return `<span class="ico${cl}" style="--s:${size}px">${inner}</span>`;
}

/** Numeric value of a forecast attribute in the entity's own unit (null if unknown). */
function attrValue(key, e, ctx) {
  if (!e) return null;
  if (key === "apparent_temperature") {
    const v = num(e.apparent_temperature);
    if (v !== null) return v;
    const t = num(e.temperature);
    return t === null ? null : feelsLike(t, toKmh(num(e.wind_speed), ctx.wu), num(e.humidity), ctx.tu);
  }
  return num(e[key]);
}

/** Formatted value (HTML, unit in <small>). */
function attrFormat(key, v, ctx) {
  return `<span class="v">${attrFormatRaw(key, v, ctx)}</span>`;
}

/** Placeholder for a missing value, with the unit of the attribute: "– km/h". */
function attrMissing(key, ctx) {
  const unit = {
    wind_speed: ` ${ctx.wu}`, wind_gust_speed: ` ${ctx.wu}`, precipitation: ` ${ctx.pu}`,
    precipitation_probability: " %", humidity: " %", cloud_coverage: " %",
    pressure: ` ${ctx.presu}`, visibility: ` ${ctx.visu}`,
  }[key];
  const deg = ["temperature", "temperature_feels", "apparent_temperature", "dew_point"].includes(key) ? "°" : "";
  return `<span class="v">–${deg}${unit ? `<small>${esc(unit)}</small>` : ""}</span>`;
}

function attrFormatRaw(key, v, ctx) {
  const u = (s) => `<small>${esc(s)}</small>`;
  switch (key) {
    case "temperature":
    case "apparent_temperature":
    case "dew_point": return `${rnd(v)}°`;
    case "wind_speed":
    case "wind_gust_speed": return `${rnd(v)}${u(" " + ctx.wu)}`;
    case "precipitation": return `${v === 0 ? "0" : v < 10 ? v.toFixed(1) : rnd(v)}${u(" " + ctx.pu)}`;
    case "precipitation_probability":
    case "humidity":
    case "cloud_coverage": return `${rnd(v)}${u("%")}`;
    case "uv_index": return `${rnd(v)}`;
    case "pressure": return `${rnd(v)}${u(" " + ctx.presu)}`;
    case "visibility": return `${rnd(v)}${u(" " + ctx.visu)}`;
    default: return `${v}`;
  }
}

function attrIcon(key) {
  if (key === "wind_speed") return `<span class="wic ai">${windSvg(2)}</span>`;
  if (key === "wind_gust_speed") return `<span class="wic ai">${windSvg(3)}</span>`;
  return ATTR_ICONS[key] ? `<ha-icon class="ai" icon="${ATTR_ICONS[key]}"></ha-icon>` : "";
}

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */

class CleanWeatherCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hourly = null;
    this._daily = null;
    this._unsubs = [];
    this._pollers = [];
    this._subEntity = null;
    this._gen = 0;
    this._timers = [];
    this._unsupported = { hourly: false, daily: false };
  }

  /* ---------- HA card API ---------- */

  static getConfigElement() {
    return document.createElement("clean-weather-card-editor");
  }

  static getStubConfig(hass) {
    const entity = Object.keys(hass?.states || {}).find((e) => e.startsWith("weather.")) || "weather.home";
    return { entity };
  }

  setConfig(config) {
    if (!config || !config.entity) throw new Error("clean-weather-card: please select a weather entity (`entity`).");
    const int = (v, d, min, max) => clamp(Math.round(num(v) ?? d), min, max);
    const h = { ...DEFAULTS.hourly, ...(config.hourly || {}) };
    const d = { ...DEFAULTS.daily, ...(config.daily || {}) };
    const hourly = {
      enabled: h.enabled !== false,
      visible_columns: int(h.visible_columns, 4, 3, 8),
      total_columns: int(h.total_columns, 8, 3, 24),
      interval: int(h.interval, 2, 1, 12),
      main: oneOf(h.main, HOURLY_ATTRIBUTES, "temperature"),
      main_icon: h.main_icon === true,
      secondary: opt(h.secondary, [...HOURLY_ATTRIBUTES, "none"], "none"),
    };
    const daily = {
      enabled: d.enabled !== false,
      days: int(d.days, 5, 1, 14),
      columns: int(d.columns, 1, 1, 2),
      day_label: oneOf(d.day_label, ["day_short", "day_long", "day_date", "date"], "day_short"),
      temperature: opt(d.temperature, ["min_max", "range", "none"], "range"),
      precipitation: opt(d.precipitation, ["value", "range", "none"], "none"),
      wind: opt(d.wind, ["icon", "value", "gust", "none"], "icon"),
      attributes: normalizeAttributes(config.daily),
    };
    this._config = { entity: config.entity, title: config.title || "", icon_size: clamp(Math.round(num(config.icon_size) ?? DEFAULTS.icon_size), 20, 100), shortcuts_display: oneOf(config.shortcuts_display, ["icon", "icon_label", "label"], "icon"), shortcuts: normalizeList(config.shortcuts, SHORTCUT_ATTRIBUTES, DEFAULTS.shortcuts), hourly, daily };
    this._ensureSubscribed(true);
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._config) return;
    const st = hass.states[this._config.entity];
    if (st !== this._stateObj) {
      const first = !this._stateObj;
      this._stateObj = st;
      this._ensureSubscribed(first);
      this._render();
    }
  }

  getCardSize() {
    const c = this._config;
    return 3 + (c?.hourly.enabled ? 2 : 0) + (c?.daily.enabled ? Math.ceil(c.daily.days / c.daily.columns) : 0);
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: "auto" };
  }

  connectedCallback() {
    this._ensureSubscribed(true);
    this._timers.push(setInterval(() => this._render(), 5 * 60 * 1000));
  }

  disconnectedCallback() {
    this._unsubscribeAll();
    this._timers.forEach((t) => clearInterval(t));
    this._timers = [];
  }

  /* ---------- Forecast data (read-only, no entity created) ---------- */

  _unsubscribeAll() {
    this._gen++;
    this._unsubs.forEach((u) => {
      try { u(); } catch (_) { /* ignore */ }
    });
    this._unsubs = [];
    this._pollers.forEach((t) => clearInterval(t));
    this._pollers = [];
    this._subEntity = null;
  }

  _ensureSubscribed(force) {
    if (!this._hass || !this._config || !this.isConnected) return;
    const entity = this._config.entity;
    if (!force && this._subEntity === entity) return;
    if (this._subEntity === entity && this._unsubs.length) return;
    this._unsubscribeAll();
    this._subEntity = entity;
    const cached = FORECAST_CACHE.get(entity);
    this._hourly = cached?.hourly ?? null;
    this._daily = cached?.daily ?? null;
    this._unsupported = { hourly: false, daily: false };
    const features = num(this._hass.states[entity]?.attributes?.supported_features);
    // bit 1 = daily, bit 2 = hourly (unknown -> try both)
    if (features === null || features & 1) this._subscribe("daily");
    else this._unsupported.daily = true;
    if (features === null || features & 2) this._subscribe("hourly");
    else this._unsupported.hourly = true;
  }

  _setForecast(entity, type, forecast) {
    this[`_${type}`] = forecast;
    const c = FORECAST_CACHE.get(entity) || {};
    c[type] = forecast;
    FORECAST_CACHE.set(entity, c);
  }

  async _subscribe(type) {
    const gen = this._gen;
    const entity = this._config.entity;
    try {
      const unsub = await this._hass.connection.subscribeMessage(
        (ev) => {
          if (gen !== this._gen) return;
          this._setForecast(entity, type, ev.forecast || []);
          this._render();
        },
        { type: "weather/subscribe_forecast", forecast_type: type, entity_id: entity }
      );
      if (gen !== this._gen) unsub();
      else this._unsubs.push(unsub);
    } catch (err) {
      if (gen === this._gen) this._poll(type, gen, entity);
    }
  }

  /** Fallback for integrations without forecast subscriptions: weather.get_forecasts. */
  _poll(type, gen, entity) {
    const fetchOnce = async () => {
      try {
        const res = await this._hass.callWS({
          type: "call_service",
          domain: "weather",
          service: "get_forecasts",
          service_data: { type },
          target: { entity_id: entity },
          return_response: true,
        });
        if (gen !== this._gen) return;
        this._setForecast(entity, type, res?.response?.[entity]?.forecast || []);
      } catch (_) {
        if (gen !== this._gen) return;
        this._unsupported[type] = true; // forecast type not provided by this integration
      }
      this._render();
    };
    fetchOnce();
    this._pollers.push(setInterval(fetchOnce, 30 * 60 * 1000));
  }

  /* ---------- Time helpers (Home Assistant time zone) ---------- */

  get _tz() {
    return this._hass?.config?.time_zone || undefined;
  }

  _parts(date) {
    const p = new Intl.DateTimeFormat("en-GB", {
      timeZone: this._tz, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    }).formatToParts(date);
    const o = {};
    p.forEach((x) => (o[x.type] = x.value));
    return { key: `${o.year}-${o.month}-${o.day}`, hour: +o.hour, minute: +o.minute };
  }

  _isNight(date) {
    const sun = this._hass?.states?.["sun.sun"]?.attributes;
    if (!sun?.next_rising || !sun?.next_setting) return false;
    const mod = (iso) => {
      const p = this._parts(new Date(iso));
      return p.hour * 60 + p.minute;
    };
    const rise = mod(sun.next_rising);
    const set = mod(sun.next_setting);
    const p = this._parts(date);
    const now = p.hour * 60 + p.minute;
    return rise < set ? now < rise || now >= set : now >= set && now < rise;
  }

  /* ---------- Model ---------- */

  _model() {
    const hass = this._hass;
    const s = this._stateObj;
    const a = s.attributes;
    const cfg = this._config;
    const lang = ((hass.locale?.language || hass.language || "en") + "").slice(0, 2);
    const t = translations(lang);
    const ctx = {
      wu: a.wind_speed_unit || "km/h",
      pu: a.precipitation_unit || "mm",
      presu: a.pressure_unit || "hPa",
      visu: a.visibility_unit || "km",
      tu: a.temperature_unit || hass.config?.unit_system?.temperature || "°C",
    };
    const now = new Date();
    const hourly = this._hourly || [];
    const daily = this._daily || [];
    const names = t.compass || COMPASS_EN;

    // Current hour entry (gusts, precipitation)
    const cur = hourly.find((h) => Math.abs(new Date(h.datetime) - now) <= 30 * 60 * 1000) ||
      hourly.find((h) => new Date(h.datetime) <= now && now - new Date(h.datetime) < 3600e3);

    const temp = num(a.temperature);
    const wind = num(a.wind_speed);
    const windKmh = toKmh(wind, ctx.wu);
    const gust = num(a.wind_gust_speed) ?? num(cur?.wind_gust_speed);
    const gustKmh = toKmh(gust, ctx.wu);
    const humidity = num(a.humidity);
    const bearing = bearingDeg(a.wind_bearing ?? cur?.wind_bearing);

    let feels = null;
    if (temp !== null) feels = num(a.apparent_temperature) ?? feelsLike(temp, windKmh, humidity, ctx.tu);

    const curMm = num(cur?.precipitation);
    const current = {
      cond: s.state,
      night: s.state === "clear-night",
      label: t.cond[s.state] || "",
      service: a.friendly_name || "",
      temp,
      feels: temp !== null && feels !== null && Math.abs(feels - temp) >= 2 ? feels : null,
      wind,
      windUnit: ctx.wu,
      bearing,
      bearingName: bearing === null ? "" : names[Math.round(bearing / 22.5) % 16],
      gust,
      showGust: gust !== null && gustKmh !== null && windKmh !== null && (gustKmh >= 40 || gustKmh >= 1.5 * windKmh),
      mm: toMm(curMm, ctx.pu),
    };

    // Hourly columns
    const h = cfg.hourly;
    const hoursOn = h.enabled && !this._unsupported.hourly;
    const cols = [];
    const first = new Date(now.getTime() + h.interval * 3600e3);
    const base = new Date(first);
    base.setMinutes(0, 0, 0);
    if (first.getTime() - base.getTime() >= 1800e3) base.setTime(base.getTime() + 3600e3);
    const hc = new Intl.DateTimeFormat(lang, { hour: "numeric" }).resolvedOptions().hourCycle;
    const hour24 = hc === "h23" || hc === "h24";
    for (let i = 0; i < h.total_columns && hoursOn; i++) {
      const at = new Date(base.getTime() + i * h.interval * 3600e3);
      const entry = hourly.find((x) => Math.abs(new Date(x.datetime) - at) < 1800e3);
      const hr = this._parts(at).hour;
      // 24 h locales: "15h"; 12 h locales (e.g. English): "3 PM"
      const label = hour24 ? `${hr}h` : new Intl.DateTimeFormat(lang, { hour: "numeric", timeZone: this._tz }).format(at);
      const val = (key) => {
        if (key === "none" || !entry) return null;
        if (key === "temperature_feels") {
          const tv = attrValue("temperature", entry, ctx);
          if (tv === null) return null;
          const fv = attrValue("apparent_temperature", entry, ctx);
          // feels-like is omitted when it differs by 1 degree or less
          const showFeels = fv !== null && Math.abs(Math.round(fv) - Math.round(tv)) >= 2;
          return `<span class="v">${rnd(tv)}°${showFeels ? ` <small>(${rnd(fv)}°)</small>` : ""}</span>`;
        }
        const v = attrValue(key, entry, ctx);
        return v === null ? null : attrFormat(key, v, ctx);
      };
      // Rain of the column: average hourly amount over the hours it covers (so a 2 h column is not under-counted)
      const covered = hourly
        .filter((x) => { const t = new Date(x.datetime).getTime(); return t >= at.getTime() - 1800e3 && t < at.getTime() + h.interval * 3600e3 - 1800e3; })
        .map((x) => num(x.precipitation))
        .filter((v) => v !== null);
      const hourMm = covered.length ? covered.reduce((a, b) => a + b, 0) / covered.length : null;
      cols.push({
        label,
        cond: entry ? entry.condition || "unknown" : "unknown",
        mm: entry && hourMm !== null ? toMm(hourMm, ctx.pu) : null,
        night: this._isNight(at),
        loading: this._hourly === null,
        missing: !entry,
        main: val(h.main),
        secondary: val(h.secondary),
      });
    }

    // Daily rows
    const d = cfg.daily;
    const dailyOn = d.enabled && !this._unsupported.daily;
    const rows = [];
    const parts = this._parts(now);
    const midday = now.getTime() - (parts.hour * 60 + parts.minute) * 60e3 + 12 * 3600e3;
    const wdShort = new Intl.DateTimeFormat(lang, { weekday: "short", timeZone: this._tz });
    const wdLong = new Intl.DateTimeFormat(lang, { weekday: "long", timeZone: this._tz });
    const dayNum = new Intl.DateTimeFormat(lang, { day: "numeric", timeZone: this._tz });
    const dayMonth = new Intl.DateTimeFormat(lang, { day: "numeric", month: "numeric", timeZone: this._tz });
    const maxOf = (arr) => (arr.length ? Math.max(...arr) : null);
    const label = (day, i) => {
      const short = wdShort.format(day).replace(".", "").toUpperCase();
      if (i === 0) return t.today;
      switch (d.day_label) {
        case "day_long": return wdLong.format(day);
        case "day_date": return `${short} ${dayNum.format(day)}.`;
        case "date": return dayMonth.format(day).replace(/\.$/, "");
        default: return short;
      }
    };
    for (let i = 0; i < d.days && dailyOn; i++) {
      const day = new Date(midday + i * 24 * 3600e3);
      const key = this._parts(day).key;
      let entry = daily.find((x) => this._parts(new Date(x.datetime)).key === key);
      if (!entry && i === 0) entry = daily[0];
      const hrs = hourly.filter((x) => {
        const dt = new Date(x.datetime);
        return this._parts(dt).key === key && (i > 0 || dt.getTime() >= now.getTime() - 3600e3);
      });
      const hrsAll = hourly.filter((x) => this._parts(new Date(x.datetime)).key === key);
      const sum = (arr, f) => arr.reduce((acc, x) => acc + (num(x[f]) ?? 0), 0);
      const precNative = entry && num(entry.precipitation) !== null
        ? num(entry.precipitation)
        : hrsAll.length ? sum(hrsAll, "precipitation") : null;
      const gustsNative = [num(entry?.wind_gust_speed), ...hrsAll.map((x) => num(x.wind_gust_speed))].filter((x) => x !== null);
      const gustNative = maxOf(gustsNative);
      const probs = [num(entry?.precipitation_probability), ...hrs.map((x) => num(x.precipitation_probability))].filter((x) => x !== null);
      const prob = probs.length ? Math.round(Math.max(...probs) / 5) * 5 : null;
      const speed = num(entry?.wind_speed) ?? maxOf(hrsAll.map((x) => num(x.wind_speed)).filter((x) => x !== null));
      const dayBearing = bearingDeg(entry?.wind_bearing ?? hrsAll.find((x) => bearingDeg(x.wind_bearing) !== null)?.wind_bearing);
      const row = {
        today: i === 0,
        name: label(day, i),
        cond: entry ? entry.condition || "unknown" : "unknown",
        min: entry ? num(entry.templow) : null,
        max: entry ? num(entry.temperature) : null,
        precNative,
        mm: toMm(precNative, ctx.pu),
        gustNative,
        windLevel: windLevel(toKmh(gustNative, ctx.wu)),
        windSpeed: speed,
        windBearing: dayBearing,
        windBearingName: dayBearing === null ? "" : names[Math.round(dayBearing / 22.5) % 16],
        prob,
        loading: this._daily === null,
        missing: !entry,
      };
      row.attr = (key) => {
        switch (key) {
          case "precipitation_probability": return row.prob;
          case "precipitation": return row.precNative;
          case "wind_speed": return row.windSpeed;
          case "wind_gust_speed": return row.gustNative;
          default: return attrValue(key, entry, ctx);
        }
      };
      rows.push(row);
    }

    // Shortcuts: current values
    const curVal = (key) => {
      switch (key) {
        case "apparent_temperature": return feels;
        case "wind_speed": return wind;
        case "wind_gust_speed": return gust;
        case "precipitation_probability": {
          const v = num(cur?.precipitation_probability);
          return v === null ? null : Math.round(v / 5) * 5;
        }
        default: return num(a[key]) ?? num(cur?.[key]);
      }
    };
    const shortcuts = cfg.shortcuts.map((key) => ({
      key,
      value: curVal(key),
      bearing: key === "wind_speed" ? bearing : null,
      bearingName: current.bearingName,
    }));

    return { t, ctx, current, cols, rows, shortcuts, hoursOn, dailyOn, noHourly: h.enabled && this._unsupported.hourly, noDaily: d.enabled && this._unsupported.daily };
  }

  /* ---------- Render ---------- */

  _renderWind(r, mode, ctx) {
    if (mode === "none") return "";
    const cls = `w${Math.min(r.windLevel, 3)}`;
    if (mode === "icon") {
      return `<span class="c wx wide1 ${cls}">${r.windLevel >= 1 ? `<span class="wic">${windSvg(r.windLevel)}</span>` : ""}</span>`;
    }
    const wide = mode === "gust" ? "wide3" : "wide2";
    if (r.windSpeed === null) {
      return `<span class="c wx ${wide}"><span class="wic">${windSvg(1)}</span>${attrMissing("wind_speed", ctx)}</span>`;
    }
    const arrow = r.windBearing !== null
      ? `<ha-icon class="arrow" title="${esc(r.windBearingName)}" icon="mdi:arrow-up" style="transform:rotate(${Math.round(r.windBearing + 180)}deg)"></ha-icon>`
      : "";
    const gust = mode === "gust" ? ` <span class="g">(${r.gustNative === null ? "–" : rnd(r.gustNative)})</span>` : "";
    return `<span class="c wx ${wide} ${cls}"><span class="wic">${windSvg(Math.max(r.windLevel, 1))}</span>` +
      `<span class="v"><b>${rnd(r.windSpeed)}</b>${gust} <small>${esc(ctx.wu)}</small></span>${arrow}</span>`;
  }

  _renderRow(r, m, shared) {
    const d = this._config.daily;
    const { t, ctx } = m;
    const T = (v) => (v === null ? "–°" : `${rnd(v)}°`);
    if (r.loading) return `<div class="cell"><div class="d${r.today ? " today" : ""}"></div></div>`;
    const cells = [];
    cells.push(`<span class="c nm" style="width:${shared.nameW}">${esc(r.name)}</span>`);
    cells.push(`<span class="c ic">${iconHtml(r.cond, { size: 30, mm: r.mm, perDay: true })}</span>`);

    // Temperature
    if (d.temperature === "min_max") {
      cells.push(`<span class="c tx">${r.missing ? "–°" : `<span class="full">${T(r.min)}<small> ${esc(t.to)} </small><b>${T(r.max)}</b></span><span class="cmp">${T(r.min)}<small>–</small><b>${T(r.max)}</b></span>`}</span>`);
    } else if (d.temperature === "range") {
      const k = shared.tKnown;
      let bar = `<span class="bar"></span>`;
      if (r.min !== null && r.max !== null && k) {
        const span = k.max - k.min || 1;
        const width = Math.min(Math.max(((r.max - r.min) / span) * 100, 8), 100);
        const left = clamp(((r.min - k.min) / span) * 100, 0, 100 - width);
        bar = `<span class="bar"><i style="left:${left.toFixed(1)}%;width:${width.toFixed(1)}%;background:linear-gradient(90deg,${tempColor(r.min, ctx.tu)},${tempColor(r.max, ctx.tu)})"></i></span>`;
      }
      cells.push(`<span class="c rg"><span class="rn lo">${T(r.min)}</span>${bar}<b class="rn hi">${T(r.max)}</b></span>`);
    }

    // Precipitation
    if (d.precipitation !== "none") {
      const val = r.precNative === null ? attrMissing("precipitation", ctx) : attrFormat("precipitation", r.precNative, ctx);
      if (d.precipitation === "value") {
        cells.push(`<span class="c pv">${attrIcon("precipitation")}${val}</span>`);
      } else {
        const w = r.precNative !== null && shared.maxMm > 0 && r.mm > 0 ? clamp((r.mm / shared.maxMm) * 100, 6, 100) : 0;
        cells.push(`<span class="c rg"><span class="bar"><i style="left:0;width:${w.toFixed(1)}%;background:linear-gradient(90deg,#9cc9f0,var(--cwc-rain))"></i></span><span class="rn pr">${val}</span></span>`);
      }
    }

    cells.push(this._renderWind(r, d.wind, ctx));

    // Additional attributes: one column each, always icon + value
    d.attributes.forEach((key) => {
      const v = r.attr(key);
      cells.push(`<span class="c ex">${attrIcon(key)}${v === null ? attrMissing(key, ctx) : attrFormat(key, v, ctx)}</span>`);
    });

    return `<div class="cell"><div class="d${r.today ? " today" : ""}">${cells.join("")}</div></div>`;
  }

  _render() {
    if (!this._config) return;
    const root = this.shadowRoot;

    if (!this._hass || !this._stateObj || ["unavailable", "unknown"].includes(this._stateObj.state)) {
      const lang = ((this._hass?.locale?.language || this._hass?.language || "en") + "").slice(0, 2);
      const msg = translations(lang)[this._stateObj ? "unavailable" : "nodata"];
      root.innerHTML = `<style>${STYLE}</style><ha-card><div class="empty">${esc(msg)}</div></ha-card>`;
      return;
    }

    const m = this._model();
    const { t, current: c, ctx } = m;
    const cfg = this._config;
    const T = (v) => (v === null ? "?" : `${rnd(v)}°`);

    const disp = cfg.shortcuts_display;
    const scLabel = (k) => t.attr[k] || k;
    const longestLabel = m.shortcuts.map((sc) => scLabel(sc.key)).reduce((a, b) => (b.length > a.length ? b : a), "");
    const longest = longestLabel.length;
    // minimum cell width: grows with the label, so the number of columns adapts to the available space
    const scMin = disp === "icon" ? "5.5em" : `${(longest * 0.42 + (disp === "label" ? 5.2 : 6.4)).toFixed(1)}em`;
    const scCls = disp === "icon" ? "shortcuts" : "shortcuts left";
    const shortcuts = m.shortcuts.length
      ? `<div class="${scCls}" style="--sc-min:${scMin}">` + m.shortcuts.map((sc) => {
        const arrow = sc.bearing !== null
          ? `<ha-icon class="arrow" title="${esc(sc.bearingName)}" icon="mdi:arrow-up" style="transform:rotate(${Math.round(sc.bearing + 180)}deg)"></ha-icon>`
          : "";
        const label = disp !== "icon" ? `<span class="sl"><i>${esc(scLabel(sc.key))}:</i><i class="gh">${esc(longestLabel)}:</i></span>` : "";
        const icon = disp !== "label" ? attrIcon(sc.key) : "";
        return `<div class="sc"${disp === "icon" ? ` title="${esc(scLabel(sc.key))}"` : ""}>${icon}${label}${sc.value === null ? attrMissing(sc.key, ctx) : attrFormat(sc.key, sc.value, ctx)}${arrow}</div>`;
      }).join("") + `</div>`
      : "";

    // Hourly
    let hours = "";
    if (m.hoursOn) {
      const vis = Math.min(cfg.hourly.visible_columns, cfg.hourly.total_columns);
      hours = `<hr><div class="hours${cfg.hourly.total_columns > vis ? " scrollable" : ""}" style="--vis:${vis}"><div class="track">` +
        m.cols.map((h) => `<div class="h"><span class="hl">${esc(h.label)}</span>` +
          (h.loading ? `<span class="ico" style="--s:34px"></span><b>&nbsp;</b>` :
            `${iconHtml(h.cond, { size: 34, mm: h.mm, night: h.night })}<span class="hm">${cfg.hourly.main_icon ? attrIcon(cfg.hourly.main) : ""}<b>${h.main ?? attrMissing(cfg.hourly.main, ctx)}</b></span>`) +
          `<span class="h2">${cfg.hourly.secondary === "none" ? "&nbsp;" : `${attrIcon(cfg.hourly.secondary)}${h.secondary ?? attrMissing(cfg.hourly.secondary, ctx)}`}</span></div>`).join("") +
        `</div></div>`;
    }

    else if (m.noHourly) hours = `<hr><div class="note">${esc(m.t.no_hourly)}</div>`;

    // Daily
    let days = "";
    if (m.dailyOn) {
      const d = cfg.daily;
      const known = m.rows.filter((r) => r.min !== null && r.max !== null);
      const shared = {
        nameW: { day_short: "2.9em", day_long: "6.4em", day_date: "4.3em", date: "3.3em" }[d.day_label],
        tKnown: known.length ? { min: Math.min(...known.map((r) => r.min)), max: Math.max(...known.map((r) => r.max)) } : null,
        maxMm: Math.max(0, ...m.rows.map((r) => r.mm ?? 0)),
      };
      days = `<hr><div class="days" style="--rows:${Math.ceil(d.days / d.columns)};--cols:${d.columns}">` +
        m.rows.map((r) => this._renderRow(r, m, shared)).join("") + `</div>`;
    } else if (m.noDaily) days = `<hr><div class="note">${esc(m.t.no_daily)}</div>`;

    root.innerHTML = `<style>${STYLE}</style>
<ha-card>
  ${cfg.title ? `<div class="title">${esc(cfg.title)}</div>` : ""}
  <div class="top">
    ${iconHtml(c.cond, { size: cfg.icon_size, mm: c.mm, night: c.night })}
    <span class="ctext">${esc(c.label)}</span>
    <span class="tv">${T(c.temp)}</span>
    ${c.service ? `<small class="svc">${esc(c.service)}</small>` : ""}
    ${c.feels !== null ? `<small class="fl">${esc(t.feels)} ${T(c.feels)}</small>` : ""}
  </div>
  ${shortcuts}
  ${hours}
  ${days}
</ha-card>`;

    const el = root.querySelector(".hours");
    if (el) {
      const track = el.querySelector(".track");
      const vis = Math.min(cfg.hourly.visible_columns, cfg.hourly.total_columns);
      const maxCol = Math.max(0, m.cols.length - vis);
      const colW = () => el.clientWidth / vis;
      const apply = (col, animate) => {
        this._hcol = clamp(col, 0, maxCol);
        track.style.transition = animate ? "transform .2s ease" : "none";
        track.style.setProperty("--col", this._hcol);
        el.style.setProperty("--fl", this._hcol > 0.05 ? "28px" : "0px");
        el.style.setProperty("--fr", this._hcol < maxCol - 0.05 ? "28px" : "0px");
      };
      apply(this._hcol || 0, false);
      if (maxCol > 0) {
        // Drag (mouse, touch, pen) and horizontal wheel / trackpad swipe; no native scrollbar involved.
        let st = null;
        el.addEventListener("pointerdown", (e) => {
          if (e.pointerType === "mouse" && e.button !== 0) return;
          st = { x: e.clientX, col: this._hcol, moved: false };
        });
        el.addEventListener("pointermove", (e) => {
          if (!st) return;
          const dx = e.clientX - st.x;
          if (!st.moved) {
            if (Math.abs(dx) < 5) return;
            st.moved = true;
            try { el.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
            el.classList.add("drag");
          }
          apply(st.col - dx / colW(), false);
        });
        const end = () => {
          if (!st) return;
          const moved = st.moved;
          st = null;
          el.classList.remove("drag");
          if (moved) apply(Math.round(this._hcol), true);
        };
        el.addEventListener("pointerup", end);
        el.addEventListener("pointercancel", end);
        let timer = null;
        el.addEventListener("wheel", (e) => {
          const d = e.shiftKey ? e.deltaY : e.deltaX;
          if (!d || (!e.shiftKey && Math.abs(e.deltaX) < Math.abs(e.deltaY))) return; // vertical scroll: leave to the page
          if ((d < 0 && this._hcol <= 0) || (d > 0 && this._hcol >= maxCol)) return;
          e.preventDefault();
          apply(this._hcol + d / colW(), false);
          clearTimeout(timer);
          timer = setTimeout(() => apply(Math.round(this._hcol), true), 140);
        }, { passive: false });
      }
    }
  }
}

const STYLE = `
:host { --cwc-rain: #3b8fd9; --cwc-accent: var(--cwc-attr-color, #3b8fd9); --cwc-warn: #f0a030; --cwc-alert: #e0453a; --cwc-icon: var(--cwc-icon-color, var(--secondary-text-color)); display:block; }
ha-card { padding: 16px; color: var(--primary-text-color); }
.empty { padding: 8px; color: var(--secondary-text-color); }
.title { font-size: 1.1em; font-weight: 500; margin-bottom: 8px; }
.note { color: var(--secondary-text-color); font-size:.95em; text-align:center; padding:4px 0; }
hr { border: 0; border-top: 1px solid var(--divider-color); margin: 12px 0; }
b { font-weight: 700; }
small { color: var(--secondary-text-color); }
ha-icon { color: inherit; display:inline-flex; align-items:center; justify-content:center; line-height:0; }
.v { display:inline-block; white-space:nowrap; }
.h2, .ex, .pv, .wx, .sc, .hm { line-height:1; }
.ico { display:inline-flex; width: var(--s); height: var(--s); align-items:center; justify-content:center; --mdc-icon-size: var(--s); flex: none; color: var(--cwc-icon); }
.ico svg { width:100%; height:100%; display:block; }
.wic { display:inline-flex; width:1.1em; height:1.1em; --mdc-icon-size:1.1em; flex:none; }
.wic svg, .wic ha-icon { width:100%; height:100%; }
.ai { color: var(--cwc-accent); }

.top { display:grid; grid-template-columns: auto minmax(0,1fr) auto; column-gap:14px; row-gap:0; align-items:baseline; }
.top .ico { grid-row: 1 / span 2; grid-column: 1; align-self:center; }
/* the cloud sits in the upper part of its box (room for rain drops below): shift it so the cloud itself is centred */
.top .ico.cl { transform: translateY(12%); }
.ctext { grid-column:2; grid-row:1; font-size:1.7em; font-weight:600; line-height:1.2; min-width:0; }
.tv { grid-column:3; grid-row:1; justify-self:end; font-size:3em; font-weight:700; line-height:1.05; }
.svc { grid-column:2; grid-row:2; font-size:1.05em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; min-width:0; }
.fl { grid-column:3; grid-row:2; justify-self:end; font-size:.95em; white-space:nowrap; }
.arrow { --mdc-icon-size:1.4em; width:1.4em; height:1.4em; margin-left:6px; flex:none; transition: transform .3s; }

.hours { overflow:hidden; touch-action:pan-y; user-select:none; -webkit-user-select:none;
  -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 var(--fl, 0px), #000 calc(100% - var(--fr, 0px)), transparent 100%);
  mask-image: linear-gradient(90deg, transparent 0, #000 var(--fl, 0px), #000 calc(100% - var(--fr, 0px)), transparent 100%); }
.hours.scrollable { cursor:grab; }
.hours.drag { cursor:grabbing; }
.track { display:flex; transform: translateX(calc(var(--col, 0) * -100% / var(--vis))); will-change: transform; }
.h { flex: 0 0 calc(100% / var(--vis)); display:flex; flex-direction:column; align-items:center; gap:6px; min-width:0; }
.hl { color: var(--secondary-text-color); font-size:1.05em; }
.h b { font-size:1.2em; white-space:nowrap; }
.h b small { font-weight:400; font-size:.65em; }
.shortcuts { display:grid; grid-template-columns: repeat(auto-fit, minmax(var(--sc-min, 7.6em), 1fr)); gap:10px 28px; margin-top:24px; justify-items:center; }
.sl { color: var(--secondary-text-color); display:inline-grid; }
.sl > i { grid-area:1 / 1; font-style:normal; }
.sl > .gh { visibility:hidden; height:0; overflow:hidden; }
.shortcuts.left { justify-items:start; }
.shortcuts.left .sc { justify-content:flex-start; }
.sc { display:flex; align-items:center; justify-content:center; gap:6px; font-size:1.05em; white-space:nowrap; min-width:0; }
.sc ha-icon, .sc .wic { --mdc-icon-size:20px; width:20px; height:20px; }
.hm { display:inline-flex; align-items:center; gap:3px; }
.hm ha-icon, .hm .wic { --mdc-icon-size:16px; width:16px; height:16px; }
.h2 { display:flex; align-items:center; gap:2px; font-size:.85em; color: var(--secondary-text-color); white-space:nowrap; min-height:1.2em; }
.h2 ha-icon { --mdc-icon-size:14px; width:14px; height:14px; }
.h2 .wic { width:14px; height:14px; --mdc-icon-size:14px; }

.days { display:grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); grid-template-rows: repeat(var(--rows), 42px); grid-auto-flow: column; column-gap: 32px; }
.cell { container-type: inline-size; min-width:0; }
/* Cells are laid out left to right; whatever does not fit wraps below and is clipped. */
.d { display:flex; flex-wrap:wrap; align-content:flex-start; column-gap:10px; height:42px; overflow:hidden; padding:0 8px; box-sizing:border-box; border-radius:12px; }
.d.today { background: var(--secondary-background-color); }
.c { height:42px; display:flex; align-items:center; flex:0 0 auto; white-space:nowrap; min-width:0; }
.nm { color: var(--secondary-text-color); }
.today .nm { color: var(--primary-text-color); }
.ic { width:30px; }
.tx { width:6.6em; font-size:1.15em; }
.tx b { font-size:1.05em; }
.tx .cmp { display:none; }
.rg { flex:1 1 130px; gap:8px; font-size:1.1em; }
.rn { flex:none; }
.rn.lo { width:2.3em; text-align:right; }
.rn.hi { width:2.3em; }
.rn.pr { width:3.6em; font-size:.9em; text-align:right; }
.bar { flex:1 1 auto; min-width:20px; position:relative; height:6px; border-radius:3px; background: var(--divider-color); overflow:hidden; }
.bar i { position:absolute; top:0; bottom:0; border-radius:3px; }
.pv { width:5.6em; gap:3px; }
.pv ha-icon, .ex ha-icon { --mdc-icon-size:16px; width:16px; height:16px; }
.wx { gap:2px; color: var(--secondary-text-color); }
.wx b { color: var(--primary-text-color); font-size:.95em; }
.wx .wic { width:22px; height:22px; --mdc-icon-size:22px; }
.wx .arrow { margin-left:3px; }
.wx.w2 .wic { color: var(--cwc-warn); }
.wx.w3 .wic { color: var(--cwc-alert); }
.wide1 { width:26px; }
.wide2 { width:6.2em; }
.wide3 { width:8.9em; }
.ex { width:5em; justify-content:flex-end; gap:3px; font-size:1.05em; }
.ex small, .pv small { font-size:.75em; }
.g { color: var(--secondary-text-color); }
@container (max-width: 270px) {
  .d { column-gap:6px; padding:0 4px; font-size:.9em; }
  .tx { width:4.6em; }
  .tx .full { display:none; }
  .tx .cmp { display:inline; }
  .wx .wic { width:18px; height:18px; --mdc-icon-size:18px; }
}
`;

/* ------------------------------------------------------------------ */
/* Visual editor                                                       */
/* ------------------------------------------------------------------ */

const EDITOR_LABELS = {
  entity: "Weather entity",
  title: "Title (optional)",
  enabled: "Enabled",
  visible_columns: "Visible columns",
  total_columns: "Total number of columns",
  interval: "Interval (hours)",
  main: "Main attribute",
  secondary: "Second attribute (below)",
  days: "Number of days",
  columns: "Columns",
  day_label: "Day label",
  temperature: "Temperature",
  precipitation: "Precipitation",
  wind: "Wind",
  attributes: "Additional attributes",
  shortcuts: "Shortcuts",
  main_icon: "Show icon (main attribute)",
  icon_size: "Main icon size (px)",
  shortcuts_display: "Shortcut display",
};

const ATTR_LABELS = {
  temperature: "Temperature",
  temperature_feels: "Temperature + feels like",
  apparent_temperature: "Feels-like temperature",
  wind_speed: "Wind speed",
  wind_gust_speed: "Wind gusts",
  precipitation: "Precipitation",
  precipitation_probability: "Rain probability",
  humidity: "Humidity",
  cloud_coverage: "Cloud coverage",
  uv_index: "UV index",
  pressure: "Pressure",
  dew_point: "Dew point",
  visibility: "Visibility",
};

const opts = (list, withNone) => [
  ...list.map((value) => ({ value, label: ATTR_LABELS[value] })),
  ...(withNone ? [{ value: "none", label: "Disabled" }] : []),
];
const slider = (name, min, max) => ({ name, selector: { number: { min, max, step: 1, mode: "slider" } } });
const select = (name, options, required = false) => ({ name, required, selector: { select: { mode: "dropdown", options } } });

const EDITOR_SCHEMA = [
  {
    type: "expandable", name: "", title: "General", icon: "mdi:cog-outline", expanded: true, schema: [
      { name: "entity", required: true, selector: { entity: { domain: "weather" } } },
      { name: "title", selector: { text: {} } },
      slider("icon_size", 20, 100),
    ],
  },
  {
    type: "expandable", name: "", title: "Shortcuts", icon: "mdi:flash-outline", schema: [
      select("shortcuts_display", [
        { value: "icon", label: "Icon only" },
        { value: "icon_label", label: "Icon + label" },
        { value: "label", label: "Label only" },
      ], true),
      { name: "shortcuts", type: "multi_select", options: SHORTCUT_ATTRIBUTES.map((a) => [a, ATTR_LABELS[a]]) },
    ],
  },
  {
    type: "expandable", name: "hourly", title: "Hourly forecast", icon: "mdi:clock-outline", schema: [
      { name: "enabled", selector: { boolean: {} } },
      slider("visible_columns", 3, 8),
      slider("total_columns", 3, 24),
      slider("interval", 1, 12),
      select("main", opts(HOURLY_ATTRIBUTES, false), true),
      { name: "main_icon", selector: { boolean: {} } },
      select("secondary", opts(HOURLY_ATTRIBUTES, true)),
    ],
  },
  {
    type: "expandable", name: "daily", title: "Daily forecast", icon: "mdi:calendar-week", schema: [
      { name: "enabled", selector: { boolean: {} } },
      slider("days", 1, 14),
      slider("columns", 1, 2),
      select("day_label", [
        { value: "day_short", label: "Day (short), e.g. MON" },
        { value: "day_long", label: "Day (long), e.g. Monday" },
        { value: "day_date", label: "Day and date number, e.g. MON 3." },
        { value: "date", label: "Date, e.g. 14.12" },
      ]),
      select("temperature", [
        { value: "min_max", label: "Min / Max" },
        { value: "range", label: "Range bar" },
        { value: "none", label: "Disabled" },
      ]),
      select("precipitation", [
        { value: "value", label: "Value" },
        { value: "range", label: "Bar with value" },
        { value: "none", label: "Disabled" },
      ]),
      select("wind", [
        { value: "icon", label: "Icon" },
        { value: "value", label: "Icon + value" },
        { value: "gust", label: "Icon + value + gust" },
        { value: "none", label: "Disabled" },
      ]),
      { name: "attributes", type: "multi_select", options: DAILY_ATTRIBUTES.map((a) => [a, ATTR_LABELS[a]]) },
    ],
  },
];

class CleanWeatherCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = config;
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (this._form) this._form.hass = hass;
  }

  _render() {
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => EDITOR_LABELS[s.name] || s.name;
      this._form.addEventListener("value-changed", (ev) => {
        const config = { ...ev.detail.value };
        // An emptied (cleared) option means "disabled"; the default only applies to options that were never set.
        const fix = (section, keys) => {
          const o = { ...(config[section] || {}) };
          keys.forEach((k) => { if (o[k] === undefined || o[k] === null || o[k] === "") o[k] = "none"; });
          config[section] = o;
        };
        fix("hourly", ["secondary"]);
        fix("daily", ["temperature", "precipitation", "wind"]);
        if (!Array.isArray(config.daily.attributes)) config.daily.attributes = [];
        if (!Array.isArray(config.shortcuts)) config.shortcuts = [];
        if (!config.hourly.main) config.hourly.main = DEFAULTS.hourly.main;
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
      });
      this.appendChild(this._form);
    }
    const c = this._config || {};
    this._form.hass = this._hass;
    this._form.schema = EDITOR_SCHEMA;
    this._form.data = {
      ...c,
      icon_size: c.icon_size ?? DEFAULTS.icon_size,
      shortcuts_display: c.shortcuts_display || DEFAULTS.shortcuts_display,
      shortcuts: normalizeList(c.shortcuts, SHORTCUT_ATTRIBUTES, DEFAULTS.shortcuts),
      hourly: { ...DEFAULTS.hourly, ...(c.hourly || {}) },
      daily: { ...DEFAULTS.daily, ...(c.daily || {}), attributes: normalizeAttributes(c.daily) },
    };
    delete this._form.data.daily.extra_1;
    delete this._form.data.daily.extra_2;
  }
}

customElements.define("clean-weather-card", CleanWeatherCard);
customElements.define("clean-weather-card-editor", CleanWeatherCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "clean-weather-card",
  name: "Clean Weather Card",
  description: "Clean, read-only weather card with a scrollable hourly row and a daily forecast.",
  preview: false,
  documentationURL: "https://github.com/bwalter/ha-clean-weather-card",
});

console.info("%c CLEAN-WEATHER-CARD ", "color:white;background:#3b8fd9;font-weight:700");
