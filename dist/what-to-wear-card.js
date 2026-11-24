/* what-to-wear-card
 *
 * A person on the dashboard, dressed for the weather of the coming hours.
 * Reads any weather entity of Home Assistant, needs nothing else. One card
 * shows one person; use several cards for a family.
 *
 *   type: custom:what-to-wear-card
 *   entity: weather.home
 *   name: Mia                  # everything below is optional
 *   gender: female             # female | male | neutral
 *   age: child                 # child | teen | adult | senior
 *   skin: medium               # nine tones, porcelain to ebony
 *   hair: ponytail             # twelve styles
 *   hair_color: brown
 *   eyes: brown
 *   beard: none                # none | stubble | moustache | goatee | full
 *   headwear: none             # none | cap | headscarf | turban
 *   glasses: false
 *   freckles: false
 *   earrings: false
 *   color: teal                # top
 *   bottom: trousers           # trousers | skirt
 *   bottom_color: navy
 *   accent_color: yellow       # hat, scarf, gloves, umbrella, shoes
 *   feels: 0                   # degrees; -3 feels the cold, 3 rarely does
 *   hours: 10                  # how far to look ahead
 *   show_weather: true
 *   show_tips: true
 */
const VERSION = "0.2.1";

const SKIN = { porcelain: "#FBE4D5", fair: "#F6D0B3", light: "#EEBD97", medium: "#DDA577", olive: "#C8935F", tan: "#AE7748", brown: "#8B5834", deep: "#67401F", ebony: "#482A1A" };
const HAIR = { black: "#26201E", dark_brown: "#4A2E1F", brown: "#7A4B2A", light_brown: "#A5744A", blond: "#D9A94E", platinum: "#EBDDB8", red: "#B5522B", auburn: "#7E3022", grey: "#9AA0A6", white: "#E9ECEE", blue: "#3F78C9", pink: "#E07AA8" };
const EYES = { brown: "#6B4226", dark: "#33231A", hazel: "#8B7438", green: "#4E8A58", blue: "#3E7FBF", grey: "#7C8A96" };
const COLORS = {
  teal: "#26A69A", blue: "#2E86C1", navy: "#34506F", red: "#C8383F", orange: "#E0874A", yellow: "#EDB92E", green: "#3C8D5A", olive_green: "#75803F", pink: "#DB5F85", purple: "#7E6BC4", brown: "#7A5A41", beige: "#D2BC96", grey: "#7F8992", black: "#34383E", white: "#EEF0F2",
};
const GENDERS = ["female", "male", "neutral"];
const AGES = ["child", "teen", "adult", "senior"];
const HAIR_STYLES = ["short", "buzz", "curly", "afro", "bob", "long", "ponytail", "pigtails", "braids", "bun", "receding", "bald"];
const BEARDS = ["none", "stubble", "moustache", "goatee", "full"];
const HEADWEAR = ["none", "cap", "headscarf", "turban"];
const DEFAULTS = {
  name: "", gender: "neutral", age: "adult", skin: "medium", hair: "short", hair_color: "brown", eyes: "brown", beard: "none", headwear: "none",
  glasses: false, freckles: false, earrings: false, color: "teal", bottom: "trousers", bottom_color: "navy", accent_color: "yellow",
  feels: 0, hours: 10, show_weather: true, show_tips: true,
};

const TEXT = {
  en: {
    no_entity: "Choose a weather entity", missing: "Weather entity not found", unavailable: "No weather data right now", feels: "feels like", hot: "Light clothes", warm: "T-shirt weather", mild: "A sweater is enough", cool: "Put on a light jacket", cold: "Put on a warm jacket", frost: "Wrap up warm", umbrella: "Take an umbrella", raincoat: "Rain jacket instead of an umbrella, it is windy", snow: "Snow: boots and gloves", storm: "Thunderstorm: better stay inside", sun: "Sun hat and sunscreen", milder: "Milder later, up to {t}", colder: "Colder later, down to {t}: take a jacket", rain_later: "Rain from about {h}", ice: "Watch out for ice", f_entity: "Weather", f_name: "Name", f_person: "Person", f_hairgroup: "Hair", f_look: "Face and headwear", f_clothes: "Clothes", f_display: "Display", f_gender: "Gender", f_age: "Age", f_skin: "Skin", f_hair: "Hairstyle", f_hair_color: "Hair colour", f_eyes: "Eye colour", f_beard: "Beard", f_headwear: "Headwear", f_glasses: "Glasses", f_freckles: "Freckles", f_earrings: "Earrings", f_color: "Top", f_bottom: "Trousers or skirt", f_bottom_color: "Trousers or skirt colour", f_accent_color: "Hat, scarf, umbrella, shoes", f_sense: "Feels the cold (−) or rarely (+)", f_hours: "Hours ahead", f_show_weather: "Show the weather", f_show_tips: "Show the advice", female: "Female", male: "Male", neutral: "Neutral", child: "Child", teen: "Teenager", adult: "Adult", senior: "Senior", porcelain: "Porcelain", fair: "Fair", light: "Light", medium: "Medium", olive: "Olive", tan: "Tan", brown: "Brown", deep: "Deep brown", ebony: "Ebony", short: "Short", buzz: "Buzz cut", curly: "Curly", afro: "Afro", bob: "Bob", long: "Long", ponytail: "Ponytail", pigtails: "Pigtails", braids: "Braids", bun: "Bun", receding: "Receding", bald: "Bald", black: "Black", dark_brown: "Dark brown", light_brown: "Light brown", blond: "Blond", platinum: "Platinum", red: "Red", auburn: "Auburn", grey: "Grey", white: "White", blue: "Blue", pink: "Pink", dark: "Dark brown", hazel: "Hazel", green: "Green", none: "None", stubble: "Stubble", moustache: "Moustache", goatee: "Goatee", full: "Full beard", cap: "Cap", headscarf: "Headscarf", turban: "Turban", teal: "Teal", navy: "Navy", orange: "Orange", yellow: "Yellow", olive_green: "Olive green", purple: "Purple", beige: "Beige", trousers: "Trousers", skirt: "Skirt",
  },
  de: {
    no_entity: "Wähle eine Wetter-Entität", missing: "Wetter-Entität nicht gefunden", unavailable: "Zurzeit keine Wetterdaten", feels: "gefühlt", hot: "Luftig anziehen", warm: "T-Shirt-Wetter", mild: "Ein Pullover reicht", cool: "Leichte Jacke anziehen", cold: "Warme Jacke anziehen", frost: "Dick einpacken", umbrella: "Schirm mitnehmen", raincoat: "Regenjacke statt Schirm, es ist windig", snow: "Schnee: Stiefel und Handschuhe", storm: "Gewitter: besser drinnen bleiben", sun: "Sonnenhut und Sonnencreme", milder: "Später milder, bis {t}", colder: "Später kälter, bis {t}: Jacke mitnehmen", rain_later: "Regen ab etwa {h}", ice: "Achtung, Glätte", f_entity: "Wetter", f_name: "Name", f_person: "Person", f_hairgroup: "Haare", f_look: "Gesicht und Kopfbedeckung", f_clothes: "Kleider", f_display: "Anzeige", f_gender: "Geschlecht", f_age: "Alter", f_skin: "Hautfarbe", f_hair: "Frisur", f_hair_color: "Haarfarbe", f_eyes: "Augenfarbe", f_beard: "Bart", f_headwear: "Kopfbedeckung", f_glasses: "Brille", f_freckles: "Sommersprossen", f_earrings: "Ohrringe", f_color: "Oberteil", f_bottom: "Hose oder Rock", f_bottom_color: "Farbe von Hose oder Rock", f_accent_color: "Mütze, Schal, Schirm, Schuhe", f_sense: "Friert schnell (−) oder selten (+)", f_hours: "Stunden voraus", f_show_weather: "Wetter anzeigen", f_show_tips: "Hinweise anzeigen", female: "Weiblich", male: "Männlich", neutral: "Neutral", child: "Kind", teen: "Teenager", adult: "Erwachsen", senior: "Senior/in", porcelain: "Porzellan", fair: "Sehr hell", light: "Hell", medium: "Mittel", olive: "Oliv", tan: "Gebräunt", brown: "Braun", deep: "Dunkelbraun", ebony: "Sehr dunkel", short: "Kurz", buzz: "Sehr kurz", curly: "Locken", afro: "Afro", bob: "Bob", long: "Lang", ponytail: "Pferdeschwanz", pigtails: "Zwei Zöpfe", braids: "Geflochten", bun: "Dutt", receding: "Lichtes Haar", bald: "Glatze", black: "Schwarz", dark_brown: "Dunkelbraun", light_brown: "Hellbraun", blond: "Blond", platinum: "Platinblond", red: "Rot", auburn: "Kastanie", grey: "Grau", white: "Weiss", blue: "Blau", pink: "Rosa", dark: "Dunkelbraun", hazel: "Haselnuss", green: "Grün", none: "Keine", stubble: "Stoppeln", moustache: "Schnauz", goatee: "Kinnbart", full: "Vollbart", cap: "Mütze mit Schirm", headscarf: "Kopftuch", turban: "Turban", teal: "Türkis", navy: "Dunkelblau", orange: "Orange", yellow: "Gelb", olive_green: "Olivgrün", purple: "Violett", beige: "Beige", trousers: "Hose", skirt: "Rock",
  },
  fr: {
    no_entity: "Choisissez une entité météo", missing: "Entité météo introuvable", unavailable: "Pas de données météo", feels: "ressenti", hot: "Vêtements légers", warm: "Un t-shirt suffit", mild: "Un pull suffit", cool: "Mettre une veste légère", cold: "Mettre une veste chaude", frost: "Bien se couvrir", umbrella: "Prendre un parapluie", raincoat: "Veste de pluie plutôt que parapluie, il y a du vent", snow: "Neige : bottes et gants", storm: "Orage : mieux vaut rester à l'intérieur", sun: "Chapeau et crème solaire", milder: "Plus doux ensuite, jusqu'à {t}", colder: "Plus froid ensuite, jusqu'à {t} : prendre une veste", rain_later: "Pluie vers {h}", ice: "Attention au verglas", f_entity: "Météo", f_name: "Nom", f_person: "Personne", f_hairgroup: "Cheveux", f_look: "Visage et couvre-chef", f_clothes: "Vêtements", f_display: "Affichage", f_gender: "Genre", f_age: "Âge", f_skin: "Peau", f_hair: "Coiffure", f_hair_color: "Couleur des cheveux", f_eyes: "Couleur des yeux", f_beard: "Barbe", f_headwear: "Couvre-chef", f_glasses: "Lunettes", f_freckles: "Taches de rousseur", f_earrings: "Boucles d'oreilles", f_color: "Haut", f_bottom: "Pantalon ou jupe", f_bottom_color: "Couleur du pantalon ou de la jupe", f_accent_color: "Bonnet, écharpe, parapluie, chaussures", f_sense: "Frileux (−) ou non (+)", f_hours: "Heures à venir", f_show_weather: "Afficher la météo", f_show_tips: "Afficher les conseils", female: "Féminin", male: "Masculin", neutral: "Neutre", child: "Enfant", teen: "Adolescent", adult: "Adulte", senior: "Senior", porcelain: "Porcelaine", fair: "Très claire", light: "Claire", medium: "Moyenne", olive: "Olive", tan: "Bronzée", brown: "Brune", deep: "Brun foncé", ebony: "Ébène", short: "Courts", buzz: "Rasés", curly: "Bouclés", afro: "Afro", bob: "Carré", long: "Longs", ponytail: "Queue de cheval", pigtails: "Couettes", braids: "Tresses", bun: "Chignon", receding: "Clairsemés", bald: "Chauve", black: "Noir", dark_brown: "Brun foncé", light_brown: "Châtain clair", blond: "Blond", platinum: "Platine", red: "Rouge", auburn: "Auburn", grey: "Gris", white: "Blanc", blue: "Bleu", pink: "Rose", dark: "Brun foncé", hazel: "Noisette", green: "Vert", none: "Aucun", stubble: "Barbe naissante", moustache: "Moustache", goatee: "Bouc", full: "Barbe complète", cap: "Casquette", headscarf: "Foulard", turban: "Turban", teal: "Turquoise", navy: "Bleu marine", orange: "Orange", yellow: "Jaune", olive_green: "Vert olive", purple: "Violet", beige: "Beige", trousers: "Pantalon", skirt: "Jupe",
  },
  it: {
    no_entity: "Scegli un'entità meteo", missing: "Entità meteo non trovata", unavailable: "Nessun dato meteo al momento", feels: "percepiti", hot: "Vestiti leggeri", warm: "Basta una maglietta", mild: "Basta un maglione", cool: "Mettere una giacca leggera", cold: "Mettere una giacca calda", frost: "Coprirsi bene", umbrella: "Prendere l'ombrello", raincoat: "Giacca da pioggia invece dell'ombrello, c'è vento", snow: "Neve: stivali e guanti", storm: "Temporale: meglio restare al chiuso", sun: "Cappello e crema solare", milder: "Più mite dopo, fino a {t}", colder: "Più freddo dopo, fino a {t}: prendere una giacca", rain_later: "Pioggia verso le {h}", ice: "Attenzione al ghiaccio", f_entity: "Meteo", f_name: "Nome", f_person: "Persona", f_hairgroup: "Capelli", f_look: "Viso e copricapo", f_clothes: "Vestiti", f_display: "Visualizzazione", f_gender: "Genere", f_age: "Età", f_skin: "Pelle", f_hair: "Acconciatura", f_hair_color: "Colore dei capelli", f_eyes: "Colore degli occhi", f_beard: "Barba", f_headwear: "Copricapo", f_glasses: "Occhiali", f_freckles: "Lentiggini", f_earrings: "Orecchini", f_color: "Parte superiore", f_bottom: "Pantaloni o gonna", f_bottom_color: "Colore di pantaloni o gonna", f_accent_color: "Berretto, sciarpa, ombrello, scarpe", f_sense: "Freddoloso (−) o no (+)", f_hours: "Ore successive", f_show_weather: "Mostra il meteo", f_show_tips: "Mostra i consigli", female: "Femminile", male: "Maschile", neutral: "Neutro", child: "Bambino", teen: "Adolescente", adult: "Adulto", senior: "Anziano", porcelain: "Porcellana", fair: "Molto chiara", light: "Chiara", medium: "Media", olive: "Olivastra", tan: "Abbronzata", brown: "Marrone", deep: "Marrone scuro", ebony: "Ebano", short: "Corti", buzz: "Rasati", curly: "Ricci", afro: "Afro", bob: "Caschetto", long: "Lunghi", ponytail: "Coda", pigtails: "Codini", braids: "Trecce", bun: "Chignon", receding: "Radi", bald: "Calvo", black: "Nero", dark_brown: "Castano scuro", light_brown: "Castano chiaro", blond: "Biondo", platinum: "Platino", red: "Rosso", auburn: "Ramato", grey: "Grigio", white: "Bianco", blue: "Blu", pink: "Rosa", dark: "Marrone scuro", hazel: "Nocciola", green: "Verde", none: "Nessuno", stubble: "Barba incolta", moustache: "Baffi", goatee: "Pizzetto", full: "Barba piena", cap: "Cappellino", headscarf: "Foulard", turban: "Turbante", teal: "Turchese", navy: "Blu scuro", orange: "Arancione", yellow: "Giallo", olive_green: "Verde oliva", purple: "Viola", beige: "Beige", trousers: "Pantaloni", skirt: "Gonna",
  },
};
const text = (hass, key) => {
  const lang = String((hass && ((hass.locale && hass.locale.language) || hass.language)) || "en").slice(0, 2);
  return (TEXT[lang] || TEXT.en)[key] || TEXT.en[key] || key;
};
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const num = (v) => (v === null || v === undefined || v === "" || !Number.isFinite(Number(v)) ? null : Number(v));

// --- weather, in °C, km/h and mm ------------------------------------------------
const toC = (v, unit) => (v === null ? null : unit === "°F" ? ((v - 32) * 5) / 9 : v);
const fromC = (v, unit) => (unit === "°F" ? (v * 9) / 5 + 32 : v);
const KMH = { "km/h": 1, "m/s": 3.6, mph: 1.609344, kn: 1.852, "ft/s": 1.09728 };
const toKmh = (v, unit) => (v === null ? null : v * (KMH[unit] || 1));
const toMm = (v, unit) => (v === null ? null : unit === "in" ? v * 25.4 : v);

// What the air feels like: wind chill in the cold (the formula of the weather
// services), the dry air in mild weather, humid heat from 27 °C (heat index).
function feelsLike(t, wind, humidity) {
  if (t === null) return null;
  if (t <= 10 && wind !== null && wind > 4.8) {
    const v = Math.pow(wind, 0.16);
    return 13.12 + 0.6215 * t - 11.37 * v + 0.3965 * t * v;
  }
  if (t >= 27 && humidity !== null && humidity >= 40) {
    const f = (t * 9) / 5 + 32, h = humidity;
    const hi = -42.379 + 2.04901523 * f + 10.14333127 * h - 0.22475541 * f * h - 0.00683783 * f * f - 0.05481717 * h * h + 0.00122874 * f * f * h + 0.00085282 * f * h * h - 0.00000199 * f * f * h * h;
    return Math.max(t, ((hi - 32) * 5) / 9);
  }
  return t;
}

const WET = new Set(["rainy", "pouring", "lightning-rainy", "hail"]);
const SNOW = new Set(["snowy", "snowy-rainy"]);

function hourOf(item, units) {
  const temperature = toC(num(item.temperature), units.temperature);
  const wind = toKmh(num(item.wind_speed), units.wind);
  const own = toC(num(item.apparent_temperature), units.temperature);
  const rain = toMm(num(item.precipitation), units.precipitation);
  const chance = num(item.precipitation_probability);
  const condition = String(item.condition || "");
  const snow = SNOW.has(condition);
  return {
    time: item.datetime ? new Date(item.datetime) : null,
    temperature,
    feels: own !== null ? own : feelsLike(temperature, wind, num(item.humidity)),
    wind,
    gust: toKmh(num(item.wind_gust_speed), units.wind),
    uv: num(item.uv_index),
    condition,
    snow,
    wet: !snow && (WET.has(condition) || (rain !== null && rain >= 0.3 && (chance === null || chance >= 40))),
    storm: condition === "lightning" || condition === "lightning-rainy",
  };
}

// The outfit for one person. hours: [now, ...coming hours], each from hourOf.
function recommend(hours, sense = 0) {
  const known = hours.filter((h) => h.feels !== null);
  if (!known.length) return null;
  // dressed for the coldest of the next three hours, warned about the rest
  const soon = known.slice(0, 4);
  const t = Math.min(...soon.map((h) => h.feels)) + sense;
  const low = known.reduce((a, h) => (h.feels < a.feels ? h : a));
  const high = known.reduce((a, h) => (h.feels > a.feels ? h : a));
  const wind = Math.max(0, ...known.map((h) => h.wind || 0));
  const gust = Math.max(wind, ...known.map((h) => h.gust || 0));
  const wetSoon = soon.some((h) => h.wet), wet = known.find((h) => h.wet);
  const snow = known.some((h) => h.snow), storm = known.some((h) => h.storm);
  const bright = soon.some((h) => h.condition === "sunny" || h.condition === "partlycloudy");
  const sunny = soon.some((h) => h.condition === "sunny");
  const uv = Math.max(0, ...known.map((h) => h.uv || 0));
  const windy = wind >= 30 || gust >= 50;

  const level = t >= 26 ? "hot" : t >= 20 ? "warm" : t >= 14 ? "mild" : t >= 8 ? "cool" : t >= 1 ? "cold" : "frost";
  const o = { level, t, wind: windy, wet: !!wet, snow };
  o.legs = level === "hot" || t >= 22 ? "shorts" : "trousers";
  o.top = { hot: "tshirt", warm: "tshirt", mild: "sweater", cool: "wind", cold: "winter", frost: "winter" }[level];
  o.feet = level === "hot" ? "sandals" : level === "frost" || t < 3 ? "winter" : "sneakers";
  o.beanie = t < 5;
  o.gloves = t < 3;
  o.scarf = t < 7 || (windy && t < 14);
  o.glasses = sunny && t >= 12;
  o.sunhat = (level === "hot" && bright) || uv >= 6;
  o.umbrella = false;
  if (wetSoon) {
    if (t < 20 && t >= 8) o.top = "rain";
    if (t < 22) o.feet = t < 3 ? "winter" : "rain";
    o.umbrella = !windy;
    o.hood = windy && o.top === "rain";
    o.glasses = o.sunhat = false;
  }
  if (snow) {
    o.legs = "snow";
    o.feet = "winter";
    o.gloves = o.beanie = true;
    if (o.top !== "winter") o.top = "winter";
    o.glasses = o.sunhat = o.umbrella = o.hood = false;
  }
  const tips = [];
  if (storm) tips.push({ key: "storm" });
  if (snow) tips.push({ key: "snow" });
  if (!storm || !snow) tips.push({ key: level });
  if (wetSoon && !snow) tips.push({ key: windy ? "raincoat" : "umbrella" });
  else if (wet && !snow) tips.push({ key: "rain_later", time: wet.time }, { key: "umbrella" });
  if (wet && !snow && Math.min(...soon.map((h) => (h.temperature === null ? 99 : h.temperature))) <= 0.5) tips.push({ key: "ice" });
  if (o.sunhat) tips.push({ key: "sun" });
  const first = known[0].feels;
  if (level !== "frost" && level !== "cold" && first - low.feels >= 6 && known.indexOf(low) > 3) tips.push({ key: "colder", value: low.temperature });
  else if (t < 20 && high.feels + sense - t >= 7) tips.push({ key: "milder", value: high.temperature });
  o.tips = tips.slice(0, 3);
  return o;
}

// --- drawing --------------------------------------------------------------------
const shade = (hex, f) => "#" + [1, 3, 5].map((i) => Math.max(0, Math.min(255, Math.round(parseInt(hex.slice(i, i + 2), 16) * f))).toString(16).padStart(2, "0")).join("");
const line = (d, w, c) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const dot = (x, y, r, c) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;

// Drawn as a child (big head); older people get a longer body and a smaller head.
// [width, height, head, neck]
const BUILD = { child: [1, 1, 1, 5], teen: [1.02, 1.14, 0.9, 7], adult: [1.06, 1.28, 0.84, 8], senior: [1.06, 1.23, 0.84, 7] };

// Hair behind the head and body.
function hairBack(o) {
  const c = shade(o.hair, 0.85), covered = o.hat || o.hood === "up";
  const sway = o.wind ? -16 : 0;
  switch (o.cover ? "" : o.cut) {
    case "long":
      return `<path d="M62 70 C50 112 ${58 + sway} 140 ${62 + sway} 154 Q100 166 ${138 + sway} 154 C${142 + sway} 140 150 112 138 70 Z" fill="${c}"/>`;
    case "bob":
      return `<path d="M60 70 C52 100 56 116 62 120 L138 120 C144 116 148 100 140 70 Z" fill="${c}"/>`;
    case "ponytail":
      return `<path d="M128 44 C${168 + sway} 48 ${166 + sway} 100 ${150 + sway} 130 C${146 + sway} 106 144 84 126 66Z" fill="${c}"/>`;
    case "pigtails":
      return `<path d="M64 84 C${36 + sway / 2} 86 ${38 + sway} 120 ${50 + sway} 136 C58 124 62 112 72 100Z M136 84 C${164 + sway / 2} 86 ${162 + sway} 120 ${150 + sway} 136 C142 124 138 112 128 100Z" fill="${c}"/>`;
    case "braids":
      return [0, 1].map((k) => Array.from({ length: 5 }, (_, i) => `<ellipse cx="${(k ? 144 : 56) + (sway * i) / 5}" cy="${100 + i * 13}" rx="8" ry="8.5" fill="${i % 2 ? c : o.hair}"/>`).join("") + dot((k ? 144 : 56) + sway, 162, 5, o.accent)).join("");
    case "afro":
      return covered ? dot(58, 78, 15, c) + dot(142, 78, 15, c) : `<circle cx="100" cy="62" r="55" fill="${c}"/>`;
    case "curly":
      return `<g fill="${c}"><circle cx="60" cy="66" r="15"/><circle cx="140" cy="66" r="15"/><circle cx="58" cy="86" r="11"/><circle cx="142" cy="86" r="11"/></g>`;
    case "bun":
      return covered ? "" : dot(100, 22, 16, c);
    default:
      return "";
  }
}

function hairFront(o) {
  if (o.cover) return "";
  const c = o.hair;
  switch (o.cut) {
    case "bald":
      return "";
    case "receding":
      return `<path d="M61 84 C56 62 64 50 72 46 C70 58 68 70 66 86Z M139 84 C144 62 136 50 128 46 C130 58 132 70 134 86Z" fill="${c}"/>`;
    case "buzz":
      return `<path d="M62 74 C58 46 76 36 100 36 C124 36 142 46 138 74 C132 58 118 52 100 52 C82 52 68 58 62 74Z" fill="${c}" opacity=".8"/>`;
    case "curly":
      return `<g fill="${c}"><circle cx="70" cy="52" r="14"/><circle cx="86" cy="40" r="15"/><circle cx="106" cy="38" r="16"/><circle cx="125" cy="46" r="14"/><circle cx="135" cy="60" r="10"/><circle cx="64" cy="66" r="9"/></g>`;
    case "afro":
      return `<path d="M60 78 C54 40 76 24 100 24 C124 24 146 40 140 78 C136 60 122 50 100 50 C78 50 64 60 60 78Z" fill="${c}"/>`;
    case "long":
    case "bob":
      return `<path d="M62 82 C56 44 78 30 100 30 C124 30 144 44 138 82 C134 64 124 56 112 54 C98 66 76 62 62 82Z" fill="${c}"/>`;
    case "bun":
    case "ponytail":
    case "braids":
    case "pigtails":
      return `<path d="M62 78 C56 44 78 30 100 30 C122 30 144 44 138 78 C130 58 116 49 100 47 C84 49 70 58 62 78Z" fill="${c}"/><path d="M100 31 V46" stroke="${shade(c, 0.8)}" stroke-width="2"/>`;
    default:
      return `<path d="M62 74 C56 44 78 28 104 30 C130 30 144 50 138 76 C134 66 130 62 126 58 C112 64 92 62 84 54 C74 58 66 64 62 74Z" fill="${c}"/>${o.hat || o.hood === "up" ? "" : o.wind ? `<path d="M84 34 Q66 26 60 34 Q72 34 80 42Z" fill="${c}"/>` : `<path d="M98 31 Q100 18 112 20 Q106 26 110 33Z" fill="${c}"/>`}`;
  }
}

function face(o) {
  const s = [], ink = shade(o.skin, 0.42), dark = "#2b2320";
  if (o.freckles) s.push(`<g fill="${shade(o.skin, 0.72)}">${[[76, 91], [82, 94], [88, 91], [112, 91], [118, 94], [124, 91]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.5"/>`).join("")}</g>`);
  const blush = o.mood === "cold" ? 0.5 : 0.24;
  s.push(`<g opacity="${blush}">${dot(74, 95, 6.5, "#e8504c")}${dot(126, 95, 6.5, "#e8504c")}</g>`);
  if (o.beard === "full") s.push(`<path d="M62 84 C62 108 78 121 100 121 C122 121 138 108 138 84 C132 94 124 94 112 93 Q100 90 88 93 C76 94 68 94 62 84Z" fill="${o.hair}"/><ellipse cx="100" cy="103" rx="13" ry="7" fill="${shade(o.skin, 0.9)}"/>`);
  if (o.beard === "stubble") s.push(`<path d="M63 88 C66 108 80 116 100 116 C120 116 134 108 137 88 C130 96 122 95 112 94 Q100 92 88 94 C78 95 70 96 63 88Z" fill="${o.hair}" opacity=".3"/>`);
  if (o.beard === "goatee") s.push(`<path d="M86 96 Q100 91 114 96 L114 112 Q100 124 86 112Z" fill="${o.hair}"/><ellipse cx="100" cy="103" rx="10" ry="6" fill="${shade(o.skin, 0.92)}"/>`);
  s.push(line("M98 88 q2.5 3 5 0", 2.2, shade(o.skin, 0.72)));
  if (o.shades) {
    s.push(`<path d="M72 78 h22 q2 16 -11 16 q-13 0 -11 -16z M106 78 h22 q2 16 -11 16 q-13 0 -11 -16z" fill="#263238"/><path d="M93 81 q7 -5 14 0 M72 80 l-9 -3 M128 80 l9 -3" stroke="#263238" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M77 82 l5 6 M111 82 l5 6" stroke="#fff" opacity=".55" stroke-width="2.6" stroke-linecap="round"/>`);
  } else {
    s.push(`<g class="eyes">${[84, 116].map((x) => `<ellipse cx="${x}" cy="82" rx="6.4" ry="7" fill="#fff"/><circle cx="${x}" cy="82.4" r="4.8" fill="${o.eyes}"/><circle cx="${x}" cy="82.6" r="2.7" fill="${dark}"/><circle cx="${x + 1.6}" cy="80.2" r="1.7" fill="#fff"/>`).join("")}${o.lashes ? `<path d="M77 79 q6 -7 13 -1 M110 78 q7 -6 13 1 M77.5 79 l-4 -3 M122.5 79 l4 -3" stroke="${dark}" stroke-width="2.2" fill="none" stroke-linecap="round"/>` : ""}</g>`);
    const brow = shade(o.hair, 0.78), bw = o.lashes ? 2.4 : 3.2;
    s.push(line("M77 69 q6 -4 12 -1", bw, brow), line("M111 68 q6 -3 12 1", bw, brow));
    if (o.glasses) s.push(`<g fill="rgba(255,255,255,.14)" stroke="${o.glasses}" stroke-width="2.8"><circle cx="84" cy="82" r="11.5"/><circle cx="116" cy="82" r="11.5"/></g><path d="M95.5 81 q4.5 -3 9 0 M72.5 80 l-9 -3 M127.5 80 l9 -3" stroke="${o.glasses}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`);
  }
  if (o.age === "senior") s.push(`<g opacity=".5">${line("M70 88 q3 3 7 3 M130 88 q-3 3 -7 3 M84 60 q16 -4 32 0 M86 65.5 q14 -3 28 0", 1.6, shade(o.skin, 0.7))}</g>`);
  if (o.mood === "cold") s.push(line("M91 102 q4.5 -4 9 0 q4.5 4 9 0", 2.8, ink));
  else if (o.mood === "open") s.push(`<path d="M88 97 Q100 99 112 97 Q110 111 100 111 Q90 111 88 97Z" fill="#6d2523"/><path d="M93 107 Q100 102 107 107 Q104 111 100 111 Q96 111 93 107Z" fill="#f0817c"/>`);
  else s.push(o.lashes && o.age !== "child" ? `<path d="M90 100 Q95 97.5 100 99.5 Q105 97.5 110 100 Q100 110 90 100Z" fill="#c2484b"/>` : line("M90 99 Q100 108 110 99", 2.8, ink));
  if (o.beard === "moustache" || o.beard === "goatee" || o.beard === "full") s.push(`<path d="M100 93 Q91 89 82 97 Q92 100 100 96 Q108 100 118 97 Q109 89 100 93Z" fill="${shade(o.hair, 0.9)}"/>`);
  return s.join("");
}

// One person. o: see `outfit`.
function figure(o) {
  const [sx, sy, sh, gap] = BUILD[o.age] || BUILD.child;
  const grown = o.age !== "child";
  const X = (x) => 100 + (x - 100) * sx, Y = (y) => 282 - (282 - y) * sy;
  const body = (...p) => `<g transform="translate(100 282) scale(${sx} ${sy}) translate(-100 -282)">${p.join("")}</g>`;
  const neck = Y(118) - gap;
  const head = (...p) => `<g transform="translate(100 ${neck.toFixed(1)}) scale(${sh}) translate(-100 -118)">${p.join("")}</g>`;
  const lift = neck + (36 - 118) * sh - 36;
  const s = [`<ellipse cx="100" cy="282" rx="${52 * sx}" ry="7" fill="#000" opacity=".14"/>`, head(hairBack(o))];
  const skinD = shade(o.skin, 0.88);
  if (o.hood === "down") s.push(body(`<path d="M66 124 Q100 100 134 124 Q132 140 100 140 Q68 140 66 124Z" fill="${shade(o.topC, 0.8)}"/>`));

  // legs
  const legL = "M88 206 L86 264", legR = "M112 206 L114 264", l = [];
  l.push(line(legL, 21, o.legs === "skirt" && o.tights ? o.tights : o.skin), line(legR, 21, o.legs === "skirt" && o.tights ? o.tights : o.skin));
  if (o.legs === "shorts") l.push(line("M87 202 L86 226", 30, o.legsC), line("M113 202 L114 226", 30, o.legsC));
  if (o.legs === "skirt") l.push(`<path d="M74 190 L126 190 L140 236 Q100 246 60 236 Z" fill="${o.legsC}"/><path d="M84 196 L78 238 M100 196 L100 241 M116 196 L122 238" stroke="${shade(o.legsC, 0.86)}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`);
  if (o.legs === "trousers") l.push(line("M88 202 L86 258", 26, o.legsC), line("M112 202 L114 258", 26, o.legsC), line("M100 212 L100 252", 2, shade(o.legsC, 0.75)));
  if (o.legs === "snow") l.push(line("M86 202 L84 256", 33, o.legsC), line("M114 202 L116 256", 33, o.legsC), line("M73 240 L96 240 M104 240 L127 240", 3, shade(o.legsC, 0.8)));
  s.push(body(...l));

  // feet keep their shape
  const shoe = (x) => {
    const c = o.feetC, d = shade(c, 0.75);
    if (o.feet === "sandals") return `<path d="M${x - 15} 276 q0 -14 15 -14 q15 0 15 14z" fill="${o.skin}"/><rect x="${x - 17}" y="274" width="34" height="7" rx="3.5" fill="${d}"/><path d="M${x - 12} 270 Q${x} 258 ${x + 12} 270" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    if (o.feet === "sneakers") return `<path d="M${x - 16} 278 v-9 q0 -13 16 -13 q16 0 16 13 v9z" fill="${c}"/><rect x="${x - 17}" y="274" width="34" height="8" rx="4" fill="#fff"/><path d="M${x - 6} 264 h12 M${x - 6} 269 h12" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`;
    if (o.feet === "rain") return `<path d="M${x - 14} 236 h28 v34 q4 4 4 10 q0 2 -3 2 h-30 q-3 0 -3 -2 q0 -6 4 -10z" fill="${c}"/><rect x="${x - 16}" y="234" width="32" height="8" rx="4" fill="${shade(c, 1.15)}"/><rect x="${x - 18}" y="276" width="36" height="6" rx="3" fill="${d}"/><path d="M${x - 8} 248 v16" stroke="#fff" opacity=".5" stroke-width="3.5" stroke-linecap="round"/>`;
    return `<path d="M${x - 16} 250 h32 v20 q3 4 3 9 q0 3 -3 3 h-32 q-3 0 -3 -3 q0 -5 3 -9z" fill="${c}"/><rect x="${x - 19}" y="244" width="38" height="11" rx="5.5" fill="#fff"/><rect x="${x - 19}" y="276" width="38" height="6" rx="3" fill="${d}"/><path d="M${x - 7} 262 h14 M${x - 7} 268 h14" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>`;
  };
  s.push(shoe(X(84) - (grown ? 1 : 0)), shoe(X(116) + (grown ? 1 : 0)));

  // umbrella pole, arms, hands
  if (o.umbrella) s.push(`<path d="M${X(150)} ${Y(142)} V${10 + lift}" stroke="#5b4636" stroke-width="4" stroke-linecap="round"/><path d="M${X(150)} ${Y(142)} q0 12 -9 12 q-7 0 -7 -7" stroke="#5b4636" stroke-width="4" fill="none" stroke-linecap="round"/>`);
  const slim = o.shape === "female" && grown ? 2 : 0;
  const puffy = (o.top === "winter" ? 27 : o.top === "rain" ? 24 : o.top === "sweater" || o.top === "wind" ? 22 : 18) - slim;
  const sleeve = shade(o.topC, 0.92);
  const hand = (x, y) => (o.gloves ? dot(X(x), Y(y), 12, o.gloves) : dot(X(x), Y(y), 9.5, o.skin));
  const full = ["M74 138 Q58 158 56 184", o.umbrella ? "M126 138 Q148 152 150 132" : o.wave ? "M126 138 Q150 136 156 110" : "M126 138 Q142 158 144 184"];
  const part = ["M74 138 Q61 154 58 169", o.umbrella ? "M126 138 Q146 152 149 144" : o.wave ? "M126 138 Q147 138 153 122" : "M126 138 Q139 154 142 169"];
  const short = ["M76 136 Q68 146 64 156", o.wave || o.umbrella ? "M124 136 Q136 138 144 130" : "M124 136 Q132 146 136 156"];
  const arms = [];
  [[o.top === "tshirt" ? [56, 187] : [57, 190]], [o.umbrella ? [150, 126] : o.wave ? [157, 101] : o.top === "tshirt" ? [144, 187] : [143, 190]]].forEach(([p], i) => {
    if (o.top === "tshirt") arms.push(body(line(full[i], 17 - slim, o.skin)), hand(...p), body(line(short[i], 24 - slim, sleeve)));
    else arms.push(hand(...p), body(line(part[i], puffy, sleeve)));
  });

  // torso
  const w = o.top === "winter" ? 9 : o.top === "rain" ? 6 : o.top === "sweater" || o.top === "wind" ? 3 : 0;
  const low = o.top === "winter" ? 216 : o.top === "rain" ? 222 : 200;
  const flare = o.top === "rain" ? 8 : 0;
  const [a, m, b] = !grown ? [26, 26, 27] : o.shape === "female" ? [24, 19, 28] : o.shape === "male" ? [29, 28, 26] : [26, 25, 27];
  const A = a + w, M = m + w, B = b + w + flare, dk = shade(o.topC, 0.82), lt = shade(o.topC, 1.14);
  const t = [`<path d="M${100 - A} 138 Q${102 - A} 122 100 120 Q${98 + A} 122 ${100 + A} 138 Q${100 + M} 168 ${100 + B} ${low - 8} Q${100 + B} ${low} ${92 + B} ${low} L${108 - B} ${low} Q${100 - B} ${low} ${100 - B} ${low - 8} Q${100 - M} 168 ${100 - A} 138 Z" fill="${o.topC}"/>`];
  const e = Math.min(A, M + 2) - 1;
  if (o.top === "tshirt") t.push(o.print === "sun" ? `<circle cx="100" cy="164" r="11" fill="#FFD54F"/><path d="M100 146v-4M100 186v-4M82 164h-4M122 164h-4M87 151l-3-3M116 180l-3-3M87 177l-3 3M116 148l-3 3" stroke="#FFD54F" stroke-width="3.4" stroke-linecap="round"/>` : o.print === "stripes" ? `<path d="M${102 - e} 156 H${98 + e} M${102 - e} 172 H${98 + e} M${101 - e} 188 H${99 + e}" stroke="#fff" opacity=".85" stroke-width="5"/>` : `<path d="M90 122 Q100 134 110 122" stroke="${dk}" stroke-width="3" fill="none"/>`);
  if (o.top === "sweater") t.push(`<path d="M${100 - e} 172 H${100 + e}" stroke="${lt}" stroke-width="9"/><path d="M80 172 l5 -4 l5 8 l5 -8 l5 8 l5 -8 l5 8 l5 -8 l5 6" stroke="#fff" opacity=".8" stroke-width="2.4" fill="none" stroke-linejoin="round"/><path d="M${106 - b} 195 H${94 + b}" stroke="${dk}" stroke-width="6" stroke-linecap="round"/>`);
  if (o.top === "wind") t.push(`<path d="M${101 - e} 160 Q100 168 ${99 + e} 160 L${99 + e} 172 Q100 180 ${101 - e} 172Z" fill="#fff" opacity=".85"/><path d="M82 188 l8 6 M118 188 l-8 6" stroke="${dk}" stroke-width="3.4" stroke-linecap="round"/><path d="M100 122 V199" stroke="${dk}" stroke-width="2.4"/>`);
  if (o.top === "rain") t.push(`<path d="M100 124 V220" stroke="${dk}" stroke-width="2.6"/>${[144, 166, 188].map((y) => `<rect x="93" y="${y}" width="14" height="6" rx="3" fill="${dk}"/>`).join("")}<path d="M76 194 h14 v11 h-14z M110 194 h14 v11 h-14z" fill="${dk}" opacity=".55"/>`);
  if (o.top === "winter") t.push(`<path d="M${102 - A} 152 Q100 160 ${98 + A} 152 M${101 - M} 174 Q100 182 ${99 + M} 174 M${101 - B} 196 Q100 204 ${99 + B} 196" stroke="${dk}" stroke-width="3.4" fill="none"/><path d="M100 124 V214" stroke="${lt}" stroke-width="4"/><rect x="97" y="134" width="6" height="11" rx="3" fill="#fff"/>`);
  s.push(body(...t), ...arms);

  // neck and head
  const nw = o.shape === "male" && grown ? 11 : 9;
  s.push(`<rect x="${100 - nw}" y="${(neck - 10).toFixed(1)}" width="${nw * 2}" height="${(Y(127) - neck + 10).toFixed(1)}" rx="7" fill="${skinD}"/>`);
  const h = [];
  if (o.hood === "up") h.push(`<path d="M100 22 C62 22 54 60 56 88 C58 116 78 126 100 126 C122 126 142 116 144 88 C146 60 138 22 100 22Z" fill="${o.topC}"/><path d="M100 22 C62 22 54 60 56 88" stroke="${lt}" stroke-width="3" fill="none"/>`);
  if (o.cover === "headscarf") h.push(`<path d="M100 26 C64 26 54 58 56 88 C56 112 62 130 74 138 L126 138 C138 130 144 112 144 88 C146 58 136 26 100 26Z" fill="${o.accent}"/>`);
  else if (o.hood !== "up") h.push(dot(62, 80, 8, skinD), dot(138, 80, 8, skinD), o.earrings ? dot(61, 90, 2.8, "#E8B93C") + dot(139, 90, 2.8, "#E8B93C") : "");
  const jaw = o.shape === "male" && grown ? "M100 38 C124 38 138 54 138 78 C138 104 124 117 100 117 C76 117 62 104 62 78 C62 54 76 38 100 38Z" : "M100 38 C124 38 138 54 138 78 C138 102 121 116 100 116 C79 116 62 102 62 78 C62 54 76 38 100 38Z";
  h.push(`<path d="${jaw}" fill="${o.skin}"/>`, hairFront(o), face(o));
  if (o.cover === "headscarf") h.push(`<path d="M62 84 C58 54 74 40 100 40 C126 40 142 54 138 84 C144 44 124 26 100 26 C76 26 56 44 62 84Z" fill="${o.accent}"/><path d="M64 94 C70 112 86 119 100 119 C114 119 130 112 136 94 C140 118 132 136 120 142 L80 142 C68 136 60 118 64 94Z" fill="${shade(o.accent, 0.9)}"/><path d="M76 124 Q104 132 124 118" stroke="${shade(o.accent, 0.75)}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`);
  if (o.cover === "turban") h.push(`<path d="M58 66 C52 30 74 12 100 12 C126 12 148 30 142 66 Q100 34 58 66Z" fill="${o.accent}"/><path d="M60 62 Q92 22 136 30 M140 62 Q108 24 66 34 M72 50 Q100 22 128 50" stroke="${shade(o.accent, 0.78)}" stroke-width="3" fill="none" stroke-linecap="round"/>`);
  if (o.mood === "cold") h.push(`<g class="breath" fill="#fff" opacity=".85"><circle cx="150" cy="104" r="6"/><circle cx="160" cy="99" r="8"/><circle cx="171" cy="102" r="6"/></g>`);
  if (o.hat === "beanie") h.push(`<path d="M60 62 C60 28 80 18 100 18 C120 18 140 28 140 62 Z" fill="${o.hatC}"/><path d="M74 30 V56 M87 22 V56 M100 20 V56 M113 22 V56 M126 30 V56" stroke="${shade(o.hatC, 0.86)}" stroke-width="3" stroke-linecap="round"/><rect x="56" y="50" width="88" height="17" rx="8.5" fill="${shade(o.hatC, 1.16)}"/><circle cx="100" cy="13" r="11" fill="#fff"/><circle cx="96" cy="10" r="3" fill="#e6ecf0"/>`);
  if (o.hat === "sun") h.push(`<path d="M34 56 Q100 34 166 56 Q168 64 156 65 Q100 50 44 65 Q32 64 34 56Z" fill="${o.hatC}"/><path d="M66 50 Q68 16 100 16 Q132 16 134 50 Q100 40 66 50Z" fill="${shade(o.hatC, 1.06)}"/><path d="M66 50 Q100 38 134 50 L133 41 Q100 30 67 41Z" fill="#E8604C"/>`);
  if (o.hat === "cap") h.push(`<path d="M61 58 C61 30 80 22 100 22 C122 22 139 32 139 58 Q100 46 61 58Z" fill="${o.hatC}"/><path d="M62 56 Q100 40 138 56 Q140 66 130 66 Q100 54 70 66 Q60 66 62 56Z" fill="${shade(o.hatC, 0.8)}"/><circle cx="100" cy="23" r="4" fill="${shade(o.hatC, 0.8)}"/>`);
  s.push(head(...h));
  if (o.scarf) {
    const sd = shade(o.scarf, 0.82);
    s.push(body(`<path d="M72 117 Q100 132 128 117 Q132 128 126 134 Q100 148 74 134 Q68 128 72 117Z" fill="${o.scarf}"/>`, o.wind ? `<g class="wave"><path d="M76 130 C52 120 40 138 16 124 C14 132 14 136 18 142 C42 152 56 138 78 142Z" fill="${sd}"/><path d="M30 130 l-2 13 M44 130 l0 14" stroke="#fff" opacity=".75" stroke-width="4"/></g>` : `<path d="M112 134 L122 132 L128 178 L112 180Z" fill="${sd}"/><path d="M114 152 l11 -1 M115 164 l12 -1" stroke="#fff" opacity=".75" stroke-width="4"/>`));
  }
  if (o.umbrella) {
    const u = o.umbrella, ud = shade(u, 0.82);
    s.push(`<g transform="translate(${X(150) - 150} ${lift})"><path d="M44 34 C50 -22 160 -34 204 20 C206 26 204 32 200 36 Q188 26 172 34 Q156 22 138 34 Q120 22 98 36 Q80 24 60 38 Q52 34 44 34Z" fill="${u}"/><path d="M98 36 C100 4 116 -12 128 -14 C140 -10 140 14 138 34 Q120 22 98 36Z M172 34 C172 10 152 -8 128 -14 C170 -16 196 4 200 36 Q188 26 172 34Z" fill="${ud}" opacity=".6"/><circle cx="128" cy="-16" r="4" fill="#5b4636"/></g>`);
  }
  return s.join("");
}

// The clothes of `recommend` on a person, as `figure` takes them.
function outfit(o, person) {
  const p = { ...DEFAULTS, ...person };
  const of = (map, key, fallback) => map[key] || map[fallback];
  const accent = of(COLORS, p.accent_color, "yellow"), top = of(COLORS, p.color, "teal"), bottom = of(COLORS, p.bottom_color, "navy");
  const age = AGES.includes(p.age) ? p.age : "adult";
  const shape = GENDERS.includes(p.gender) ? p.gender : "neutral";
  const cover = ["headscarf", "turban"].includes(p.headwear) ? p.headwear : null;
  const skirt = p.bottom === "skirt" && o.legs !== "snow" && o.t >= 8;
  return {
    age, shape, cover, accent,
    skin: of(SKIN, p.skin, "medium"), hair: of(HAIR, p.hair_color, "brown"), eyes: of(EYES, p.eyes, "brown"),
    cut: HAIR_STYLES.includes(p.hair) ? p.hair : "short",
    beard: age === "child" ? null : BEARDS.includes(p.beard) && p.beard !== "none" ? p.beard : null,
    lashes: shape === "female", freckles: p.freckles === true, earrings: p.earrings === true,
    glasses: p.glasses === true ? "#2F3A44" : null, shades: o.glasses,
    top: o.top, topC: top, print: o.level === "hot" ? "sun" : p.age === "child" || p.age === "teen" ? "stripes" : "plain",
    legs: skirt ? "skirt" : o.legs, legsC: o.legs === "shorts" && !skirt && bottom === COLORS.black ? "#3A3F47" : bottom,
    tights: skirt && o.t < 20 ? "#4A4453" : null,
    feet: o.feet, feetC: { sandals: "#8E5B3A", sneakers: accent, rain: accent, winter: "#5A4334" }[o.feet],
    hat: cover ? null : o.beanie ? "beanie" : o.sunhat ? "sun" : p.headwear === "cap" && o.top !== "rain" ? "cap" : null,
    hatC: o.sunhat && !o.beanie ? "#F2D59A" : accent,
    hood: o.top === "rain" ? (o.hood && !cover ? "up" : "down") : null,
    scarf: o.scarf ? (cover === "headscarf" ? null : accent) : null, gloves: o.gloves ? accent : null,
    umbrella: o.umbrella ? accent : null, wind: o.wind,
    wave: !o.umbrella && o.level !== "frost",
    mood: o.level === "frost" ? "cold" : o.level === "hot" || o.level === "warm" || o.snow ? "open" : "smile",
  };
}

const rnd = (n) => {
  const x = Math.sin(n * 99.7) * 43758.5;
  return x - Math.floor(x);
};
const cloud = (x, y, k, c, cls = "") => `<g transform="translate(${x} ${y}) scale(${k})"><g class="${cls}" fill="${c}"><circle cx="0" cy="0" r="18"/><circle cx="22" cy="-10" r="22"/><circle cx="46" cy="0" r="17"/><rect x="-18" y="0" width="82" height="18" rx="9"/></g></g>`;

const SKY = {
  sunny: ["#4FB8F0", "#DDF3FD"], partlycloudy: ["#76BDEB", "#E3F2FB"], cloudy: ["#8FA6B5", "#DCE4E9"], fog: ["#A9B4BB", "#E2E6E8"], rain: ["#587686", "#B2C4CF"], storm: ["#3F4C63", "#8795A8"], snow: ["#8CA7BE", "#E6EFF5"], wind: ["#84A0B0", "#DAE5EA"], night: ["#101B3A", "#3A4C78"], night_cloudy: ["#1B2436", "#46536B"],
};
function sceneOf(condition, night) {
  const kind = { sunny: "sunny", "clear-night": "sunny", partlycloudy: "partlycloudy", cloudy: "cloudy", fog: "fog", rainy: "rain", pouring: "rain", hail: "rain", "lightning-rainy": "storm", lightning: "storm", snowy: "snow", "snowy-rainy": "snow", windy: "wind", "windy-variant": "wind" }[condition] || "cloudy";
  return { kind, night: night || condition === "clear-night" };
}
function scene({ kind, night }, o) {
  const sky = night ? (kind === "sunny" || kind === "partlycloudy" ? SKY.night : SKY.night_cloudy) : SKY[kind];
  const white = night ? "#8C9AB5" : "#FFFFFF", dull = night ? "#5D6A82" : "#EDF1F4";
  let ground = o && (o.snow || kind === "snow") ? "#FFFFFF" : o && o.level === "frost" ? "#E4F1F8" : o && o.level === "hot" ? "#F0D288" : o && (o.level === "cool" || o.level === "cold") ? "#A9B178" : "#92C463";
  if (night) ground = shade(ground, 0.5);
  const d = [];
  const orb = night ? `<path d="M322 36 A24 24 0 1 0 342 66 A20 20 0 0 1 322 36Z" fill="#F3EFD6"/>` : `<g class="sun"><circle cx="318" cy="58" r="40" fill="#FFE082" opacity=".35"/></g><circle cx="318" cy="58" r="26" fill="#FFD54F"/>`;
  if (kind === "sunny" || kind === "partlycloudy" || kind === "wind") d.push(orb);
  if (night && (kind === "sunny" || kind === "partlycloudy")) d.push(`<g fill="#fff">${Array.from({ length: 34 }, (_, i) => `<circle class="${i % 3 ? "" : "star"}" cx="${rnd(i) * 600}" cy="${rnd(i + 40) * 170}" r="${0.8 + rnd(i + 9) * 1.4}"/>`).join("")}</g>`);
  if (kind === "partlycloudy") d.push(cloud(318, 82, 0.9, white, "drift"), cloud(480, 60, 0.9, white, "drift slow"));
  if (kind === "cloudy" || kind === "rain" || kind === "storm" || kind === "snow" || kind === "wind") d.push(cloud(70, 60, 1.4, dull, "drift"), cloud(300, 42, 1.1, dull, "drift slow"), cloud(500, 70, 1.3, dull, "drift"));
  if (kind === "storm") d.push(`<path class="bolt" d="M420 70 l-22 50 h18 l-14 44 l44 -60 h-20 l16 -34z" fill="#FFE57F"/>`);
  if (kind === "wind" || (o && o.wind)) d.push(`<g class="gust" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"><path d="M230 96 h90 q14 0 14 -11 q0 -9 -10 -9"/><path d="M420 130 h80"/><path d="M20 170 h70 q12 0 12 9"/></g><g class="leaf" fill="#E07A3F"><path d="M150 200 q10 -12 22 -4 q-6 12 -22 4z"/><path d="M430 190 q10 -12 22 -4 q-6 12 -22 4z"/></g>`);
  d.push(`<ellipse cx="300" cy="356" rx="520" ry="76" fill="${ground}"/>`);
  const front = [];
  if (kind === "rain" || kind === "storm") front.push(`<defs><pattern id="rain" width="90" height="110" patternUnits="userSpaceOnUse">${Array.from({ length: 9 }, (_, i) => `<path d="M${8 + rnd(i) * 76} ${4 + rnd(i + 5) * 86} l-4 15" stroke="#E3F2FD" stroke-width="2.6" stroke-linecap="round"/>`).join("")}</pattern></defs><rect class="rain" x="-50" y="-120" width="700" height="580" fill="url(#rain)" opacity=".6"/>`);
  if (kind === "snow") front.push(`<defs><pattern id="snow" width="120" height="120" patternUnits="userSpaceOnUse">${Array.from({ length: 11 }, (_, i) => `<circle cx="${8 + rnd(i) * 104}" cy="${8 + rnd(i + 30) * 104}" r="${1.6 + rnd(i + 3) * 2.6}" fill="#fff"/>`).join("")}</pattern></defs><rect class="snowfall" x="-50" y="-140" width="700" height="600" fill="url(#snow)"/>`);
  if (kind === "fog") front.push(`<g class="drift" fill="#fff" opacity=".38"><rect x="-60" y="150" width="520" height="26" rx="13"/><rect x="120" y="206" width="560" height="30" rx="15"/><rect x="-30" y="268" width="480" height="26" rx="13"/></g>`);
  return {
    back: `<svg class="back" viewBox="0 0 600 336" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient></defs><rect width="600" height="336" fill="url(#sky)"/>${d.join("")}</svg>`,
    front: front.length ? `<svg class="front" viewBox="0 0 600 336" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${front.join("")}</svg>` : "",
  };
}

const STYLE = `
:host { display: block; height: 100%; }
ha-card { display: block; position: relative; overflow: hidden; height: 100%; min-height: 130px; container-type: inline-size; isolation: isolate; }
.back, .front { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; }
.front { z-index: 3; pointer-events: none; }
.in { position: relative; display: grid; grid-template-rows: minmax(0, 1fr); grid-template-columns: minmax(150px, 38%) 1fr; height: 100%; min-height: 130px; box-sizing: border-box; padding: 10px; gap: 8px; cursor: pointer; }
.info { display: flex; flex-direction: column; justify-content: space-between; gap: 10px; min-width: 0; position: relative; z-index: 4; }
.w, .tips { background: rgba(18, 28, 40, .5); color: #fff; border-radius: 14px; padding: 10px 12px; backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }
.w { align-self: flex-start; max-width: 100%; box-sizing: border-box; }
.t { font-size: 34px; line-height: 1.05; font-weight: 600; white-space: nowrap; }
.s { font-size: 14px; line-height: 1.35; opacity: .95; }
.tips { font-size: 14px; line-height: 1.35; }
.tips b { display: block; font-size: 16px; }
.p { position: relative; z-index: 2; min-width: 0; min-height: 0; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; }
.p svg { width: 100%; min-height: 0; flex: 1 1 0; overflow: visible; display: block; }
.n { flex: none; background: rgba(18, 28, 40, .5); color: #fff; border-radius: 10px; padding: 1px 10px; font-size: 13px; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; box-sizing: border-box; }
.bare { grid-template-columns: 1fr; }
.bare .info { display: none; }
.msg { padding: 24px 16px; color: var(--secondary-text-color); }
@container (max-width: 480px) {
  .in { grid-template-columns: 46% 1fr; padding: 8px; gap: 4px; }
  .info { gap: 4px; }
  .w, .tips { padding: 5px 9px; border-radius: 11px; }
  .t { font-size: 24px; } .s, .tips { font-size: 12px; line-height: 1.25; } .tips b { font-size: 13px; }
}
@container (max-width: 300px) {
  .in { display: block; padding: 0; }
  .info { display: block; position: static; }
  .w { position: absolute; z-index: 4; top: 6px; left: 6px; padding: 2px 8px; border-radius: 10px; }
  .w .s { display: none; }
  .t { font-size: 18px; }
  .p { position: absolute; inset: 4px 4px 4px 4px; }
  .in.adv .p { bottom: 25px; }
  .n { position: absolute; z-index: 4; top: 2px; right: 2px; max-width: 55%; font-size: 12px; }
  .tips { position: absolute; z-index: 4; left: 6px; right: 6px; bottom: 5px; padding: 2px 8px; border-radius: 10px; text-align: center; }
  .tips b { font-size: 12px; line-height: 1.5; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tips div { display: none; }
}
@container (min-width: 760px) {
  .t { font-size: 48px; } .s, .tips { font-size: 17px; } .tips b { font-size: 20px; } .n { font-size: 16px; }
}
.eyes { transform-box: fill-box; transform-origin: center; animation: blink 5.5s infinite; }
.wave { transform-box: fill-box; transform-origin: right center; animation: wave 1.1s ease-in-out infinite alternate; }
.breath { animation: breath 3.4s ease-out infinite; }
.drift { animation: drift 16s ease-in-out infinite alternate; }
.slow { animation-duration: 24s; }
.sun { transform-box: fill-box; transform-origin: center; animation: glow 4s ease-in-out infinite alternate; }
.star { animation: star 2.8s ease-in-out infinite alternate; }
.bolt { animation: bolt 6s infinite; }
.gust { animation: gust 5s ease-in-out infinite; }
.leaf { animation: leaf 6s linear infinite; }
.rain { animation: rain .9s linear infinite; }
.snowfall { animation: snow 7s linear infinite; }
@keyframes blink { 0%, 95%, 100% { transform: scaleY(1); } 97.5% { transform: scaleY(.1); } }
@keyframes wave { from { transform: rotate(-5deg); } to { transform: rotate(7deg) scaleX(1.06); } }
@keyframes breath { 0% { transform: translateX(-12px); opacity: 0; } 30% { opacity: .85; } 100% { transform: translateX(12px); opacity: 0; } }
@keyframes drift { from { transform: translateX(-10px); } to { transform: translateX(22px); } }
@keyframes glow { from { transform: scale(.9); } to { transform: scale(1.12); } }
@keyframes star { from { opacity: .25; } to { opacity: 1; } }
@keyframes bolt { 0%, 90%, 94%, 100% { opacity: 0; } 92%, 96% { opacity: 1; } }
@keyframes gust { 0% { transform: translateX(-30px); opacity: 0; } 40% { opacity: .8; } 100% { transform: translateX(50px); opacity: 0; } }
@keyframes leaf { from { transform: translate(-180px, -20px); } to { transform: translate(360px, 40px); } }
@keyframes rain { from { transform: translateY(0); } to { transform: translateY(110px); } }
@keyframes snow { from { transform: translateY(0); } to { transform: translateY(120px); } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; } .bolt { opacity: 1; } }
`;

class WhatToWearCard extends HTMLElement {
  static getConfigElement() {
    return document.createElement("what-to-wear-card-editor");
  }

  static getStubConfig(hass) {
    const entity = Object.keys((hass && hass.states) || {}).find((e) => e.startsWith("weather."));
    return { entity: entity || "" };
  }

  setConfig(config) {
    if (!config) throw new Error("Invalid configuration");
    if (config.entity && !String(config.entity).startsWith("weather.")) throw new Error("entity must be a weather entity");
    const hours = num(config.hours);
    const entity = this._config && this._config.entity;
    this._config = { ...DEFAULTS, ...config, hours: hours === null ? DEFAULTS.hours : Math.min(24, Math.max(1, hours)) };
    this._shown = null;
    if (entity !== this._config.entity) {
      this._forecast = null;
      this._unsubscribe();
      this._subscribe();
    }
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._subscribe();
    this._render();
  }

  connectedCallback() {
    this._subscribe();
    this._render();
    // hours pass even when the weather entity stays the same
    this._timer = setInterval(() => this._render(), 300000);
  }

  disconnectedCallback() {
    clearInterval(this._timer);
    this._unsubscribe();
  }

  getCardSize() {
    return 3;
  }

  getGridOptions() {
    return { columns: 4, rows: 3, min_columns: 3, min_rows: 2 };
  }

  _unsubscribe() {
    const sub = this._sub;
    this._sub = null;
    this._subKey = null;
    if (sub) sub.then((off) => off && off()).catch(() => {});
  }

  _subscribe() {
    if (!this._hass || !this._config || !this._config.entity || !this.isConnected) return;
    const state = this._hass.states[this._config.entity];
    const features = Number((state && state.attributes.supported_features) || 0);
    const type = features & 2 ? "hourly" : features & 4 ? "twice_daily" : features & 1 ? "daily" : null;
    const key = type && `${this._config.entity}|${type}`;
    if (!key || key === this._subKey || !this._hass.connection) return;
    this._unsubscribe();
    this._subKey = key;
    this._sub = this._hass.connection
      .subscribeMessage(
        (event) => {
          if (this._subKey !== key) return;
          this._forecast = { type, list: Array.isArray(event && event.forecast) ? event.forecast : [] };
          this._render();
        },
        { type: "weather/subscribe_forecast", forecast_type: type, entity_id: this._config.entity }
      )
      .catch(() => {
        if (this._subKey === key) this._subKey = null;
      });
  }

  // now and the coming hours; a daily forecast counts with today's entry only
  _hours(state, now) {
    const a = state.attributes;
    const units = { temperature: a.temperature_unit, wind: a.wind_speed_unit, precipitation: a.precipitation_unit };
    const list = [hourOf({ ...a, condition: state.state, precipitation: null }, units)];
    const f = this._forecast;
    if (!f) return list;
    const end = now.getTime() + this._config.hours * 3600000;
    for (const item of f.list) {
      const time = new Date(item.datetime).getTime();
      if (f.type === "hourly") {
        if (time > now.getTime() - 1800000 && time <= end) list.push(hourOf(item, units));
      } else if (time <= end && time > now.getTime() - (f.type === "daily" ? 24 : 12) * 3600000) {
        const day = hourOf(item, units);
        list.push(day);
      }
    }
    return list;
  }

  _message(key) {
    const html = `<div class="msg">${esc(text(this._hass, key))}</div>`;
    this._paint(html);
  }

  _paint(html) {
    if (html === this._shown) return;
    this._shown = html;
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `<style>${STYLE}</style><ha-card>${html}</ha-card>`;
    const open = this.shadowRoot.querySelector(".in");
    if (open)
      open.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: this._config.entity }, bubbles: true, composed: true }));
      });
  }

  _render() {
    const hass = this._hass, config = this._config;
    if (!hass || !config) return;
    if (!config.entity) return this._message("no_entity");
    const state = hass.states[config.entity];
    if (!state) return this._message("missing");
    if (state.state === "unavailable" || state.state === "unknown") return this._message("unavailable");
    const now = new Date();
    const hours = this._hours(state, now);
    const o = recommend(hours, num(config.feels) || 0);
    if (!o) return this._message("unavailable");
    const unit = state.attributes.temperature_unit || "°C";
    const deg = (c) => (c === null ? "–" : `${Math.round(fromC(c, unit))}°`);
    const clock = (d) => (d ? d.toLocaleTimeString((hass.locale && hass.locale.language) || undefined, { hour: "2-digit", minute: "2-digit" }) : "");
    const tip = (x) => esc(text(hass, x.key).replace("{t}", x.value === undefined ? "" : deg(x.value)).replace("{h}", clock(x.time)));
    const h = hours[0];
    const temps = hours.map((x) => x.temperature).filter((x) => x !== null);
    const sun = hass.states["sun.sun"];
    const s = scene(sceneOf(state.state, !!sun && sun.state === "below_horizon"), o);
    const condition = hass.formatEntityState ? hass.formatEntityState(state) : state.state;
    const wind = num(state.attributes.wind_speed);
    const details = [
      temps.length > 1 ? `${deg(Math.min(...temps))} / ${deg(Math.max(...temps))}` : "",
      wind !== null ? `${Math.round(wind)} ${state.attributes.wind_speed_unit || "km/h"}` : "",
    ].filter(Boolean);
    const feels = h.feels !== null && h.temperature !== null && Math.abs(h.feels - h.temperature) >= 2 ? `<div class="s">${esc(text(hass, "feels"))} ${deg(h.feels)}</div>` : "";
    const tips = o.tips.map((x, i) => (i ? `<div>${tip(x)}</div>` : `<b>${tip(x)}</b>`)).join("");
    const label = [config.name, ...o.tips.map(tip)].filter(Boolean).map((x, i) => (i || !config.name ? x : esc(x))).join(". ");
    const weather = config.show_weather === false ? "<div></div>" : `<div class="w"><div class="t">${deg(h.temperature)}</div><div><div class="s">${esc(condition)}</div>${feels}<div class="s">${esc(details.join(" · "))}</div></div></div>`;
    const advice = config.show_tips === false ? "" : `<div class="tips">${tips}</div>`;
    const bare = config.show_weather === false && config.show_tips === false;
    const dress = outfit(o, config), top = dress.umbrella ? -66 : -44;
    this._paint(
      `${s.back}<div class="in${bare ? " bare" : ""}${advice ? " adv" : ""}"><div class="info">${weather}${advice}</div><div class="p"><svg viewBox="10 ${top} 200 ${292 - top}" preserveAspectRatio="xMidYMax meet" role="img" aria-label="${label}">${figure(dress)}</svg>${config.name ? `<div class="n">${esc(config.name)}</div>` : ""}</div></div>${s.front}`
    );
  }
}

class WhatToWearCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = config;
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => s.title || text(this._hass, s.name === "feels" ? "f_sense" : `f_${s.name}`);
      this._form.addEventListener("value-changed", (ev) => {
        ev.stopPropagation();
        // only what differs from the defaults goes into the configuration
        const value = { ...ev.detail.value };
        for (const key of Object.keys(DEFAULTS)) if (value[key] === DEFAULTS[key] || value[key] === undefined) delete value[key];
        this._config = value;
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: value }, bubbles: true, composed: true }));
      });
      this.append(this._form);
    }
    const pick = (name, list) => ({ name, selector: { select: { mode: "dropdown", options: list.map((value) => ({ value, label: text(this._hass, value) })) } } });
    const bool = (name) => ({ name, selector: { boolean: {} } });
    const grid = (...schema) => ({ type: "grid", name: "", schema });
    const group = (name, icon, ...schema) => ({ type: "expandable", name: "", title: text(this._hass, `f_${name}`), icon, flatten: true, expanded: name === "person", schema });
    const colors = Object.keys(COLORS);
    this._form.hass = this._hass;
    this._form.schema = [
      { name: "entity", required: true, selector: { entity: { domain: "weather" } } },
      { name: "name", selector: { text: {} } },
      group("person", "mdi:account", grid(pick("gender", GENDERS), pick("age", AGES), pick("skin", Object.keys(SKIN)), pick("eyes", Object.keys(EYES)))),
      group("hairgroup", "mdi:content-cut", grid(pick("hair", HAIR_STYLES), pick("hair_color", Object.keys(HAIR)), pick("beard", BEARDS))),
      group("look", "mdi:glasses", grid(pick("headwear", HEADWEAR), bool("glasses"), bool("freckles"), bool("earrings"))),
      group("clothes", "mdi:tshirt-crew", grid(pick("color", colors), pick("bottom", ["trousers", "skirt"]), pick("bottom_color", colors), pick("accent_color", colors)), { name: "feels", selector: { number: { min: -5, max: 5, step: 1, mode: "slider", unit_of_measurement: "°C" } } }),
      group("display", "mdi:card-outline", { name: "hours", selector: { number: { min: 1, max: 24, step: 1, mode: "slider" } } }, grid(bool("show_weather"), bool("show_tips"))),
    ];
    this._form.data = { ...DEFAULTS, ...this._config };
  }
}

if (!customElements.get("what-to-wear-card")) {
  customElements.define("what-to-wear-card", WhatToWearCard);
  customElements.define("what-to-wear-card-editor", WhatToWearCardEditor);
  window.customCards = window.customCards || [];
  window.customCards.push({ type: "what-to-wear-card", name: "What to Wear", description: "A person dressed for the weather of the coming hours", preview: true });
  console.info(`what-to-wear-card ${VERSION}`);
}

export { AGES, BEARDS, COLORS, DEFAULTS, EYES, GENDERS, HAIR, HAIR_STYLES, HEADWEAR, SKIN, TEXT, VERSION, feelsLike, figure, hourOf, outfit, recommend, scene, sceneOf, toC, toKmh };
