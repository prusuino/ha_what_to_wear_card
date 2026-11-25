/* what-to-wear-card
 *
 * A person on the dashboard, dressed for the weather of the coming hours.
 * Reads any weather entity of Home Assistant, needs nothing else. One card
 * shows one person; use several cards for a family.
 *
 *   type: custom:what-to-wear-card
 *   entity: weather.home
 *   style: friendly            # friendly | comic | pictogram | mono | symbols; everything below is optional
 *   name: Mia
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
 *   demo:                      # invented weather, to see what the card does
 *     condition: snowy
 *     temperature: -2          # °C; also wind_speed (km/h), humidity, uv_index
 *     night: false
 *     later: [-1, 0, 1]        # temperatures of the coming hours
 *     later_condition: cloudy
 */
const VERSION = "1.0.0";

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
const STYLES = ["friendly", "comic", "pictogram", "mono", "symbols"];
const DEFAULTS = {
  style: "friendly", name: "", gender: "neutral", age: "adult", skin: "medium", hair: "short", hair_color: "brown", eyes: "brown", beard: "none", headwear: "none",
  glasses: false, freckles: false, earrings: false, color: "teal", bottom: "trousers", bottom_color: "navy", accent_color: "yellow",
  feels: 0, hours: 10, show_weather: true, show_tips: true,
};

const TEXT = {
  en: {
    no_entity: "Choose a weather entity", missing: "Weather entity not found", unavailable: "No weather data right now", feels: "feels like", hot: "Light clothes", warm: "T-shirt weather", mild: "A sweater is enough", cool: "Put on a light jacket", cold: "Put on a warm jacket", frost: "Wrap up warm", umbrella: "Take an umbrella", raincoat: "Rain jacket instead of an umbrella, it is windy", snow: "Snow: boots and gloves", storm: "Thunderstorm: better stay inside", sun: "Sun hat and sunscreen", milder: "Milder later, up to {t}", colder: "Colder later, down to {t}: take a jacket", rain_later: "Rain from about {h}", ice: "Watch out for ice", s_hot: "Light clothes", s_warm: "T-shirt", s_mild: "Sweater", s_cool: "Light jacket", s_cold: "Warm jacket", s_frost: "Wrap up warm", s_umbrella: "Umbrella", s_raincoat: "Rain jacket", s_snow: "Snow gear", s_storm: "Stay inside", arctic: "Bitter cold: cover your face", s_arctic: "Bitter cold", s_rain_later: "Rain later", f_style: "Style", friendly: "Friendly", comic: "Street comic", pictogram: "Pictogram", mono: "Black and white", symbols: "Clothes as symbols", f_entity: "Weather", f_name: "Name", f_person: "Person", f_hairgroup: "Hair", f_look: "Face and headwear", f_clothes: "Clothes", f_display: "Display", f_gender: "Gender", f_age: "Age", f_skin: "Skin", f_hair: "Hairstyle", f_hair_color: "Hair colour", f_eyes: "Eye colour", f_beard: "Beard", f_headwear: "Headwear", f_glasses: "Glasses", f_freckles: "Freckles", f_earrings: "Earrings", f_color: "Top", f_bottom: "Trousers or skirt", f_bottom_color: "Trousers or skirt colour", f_accent_color: "Hat, scarf, umbrella, shoes", f_sense: "Feels the cold (−) or rarely (+)", f_hours: "Hours ahead", f_show_weather: "Show the weather", f_show_tips: "Show the advice", female: "Female", male: "Male", neutral: "Neutral", child: "Child", teen: "Teenager", adult: "Adult", senior: "Senior", porcelain: "Porcelain", fair: "Fair", light: "Light", medium: "Medium", olive: "Olive", tan: "Tan", brown: "Brown", deep: "Deep brown", ebony: "Ebony", short: "Short", buzz: "Buzz cut", curly: "Curly", afro: "Afro", bob: "Bob", long: "Long", ponytail: "Ponytail", pigtails: "Pigtails", braids: "Braids", bun: "Bun", receding: "Receding", bald: "Bald", black: "Black", dark_brown: "Dark brown", light_brown: "Light brown", blond: "Blond", platinum: "Platinum", red: "Red", auburn: "Auburn", grey: "Grey", white: "White", blue: "Blue", pink: "Pink", dark: "Dark brown", hazel: "Hazel", green: "Green", none: "None", stubble: "Stubble", moustache: "Moustache", goatee: "Goatee", full: "Full beard", cap: "Cap", headscarf: "Headscarf", turban: "Turban", teal: "Teal", navy: "Navy", orange: "Orange", yellow: "Yellow", olive_green: "Olive green", purple: "Purple", beige: "Beige", trousers: "Trousers", skirt: "Skirt",
  },
  de: {
    no_entity: "Wähle eine Wetter-Entität", missing: "Wetter-Entität nicht gefunden", unavailable: "Zurzeit keine Wetterdaten", feels: "gefühlt", hot: "Luftig anziehen", warm: "T-Shirt-Wetter", mild: "Ein Pullover reicht", cool: "Leichte Jacke anziehen", cold: "Warme Jacke anziehen", frost: "Dick einpacken", umbrella: "Schirm mitnehmen", raincoat: "Regenjacke statt Schirm, es ist windig", snow: "Schnee: Stiefel und Handschuhe", storm: "Gewitter: besser drinnen bleiben", sun: "Sonnenhut und Sonnencreme", milder: "Später milder, bis {t}", colder: "Später kälter, bis {t}: Jacke mitnehmen", rain_later: "Regen ab etwa {h}", ice: "Achtung, Glätte", s_hot: "Luftig", s_warm: "T-Shirt", s_mild: "Pullover", s_cool: "Leichte Jacke", s_cold: "Warme Jacke", s_frost: "Dick einpacken", s_umbrella: "Schirm", s_raincoat: "Regenjacke", s_snow: "Schneesachen", s_storm: "Drinnen bleiben", arctic: "Eisig: Gesicht bedecken", s_arctic: "Eisig kalt", s_rain_later: "Später Regen", f_style: "Stil", friendly: "Freundlich", comic: "Street-Comic", pictogram: "Piktogramm", mono: "Schwarz-Weiss", symbols: "Kleidersymbole", f_entity: "Wetter", f_name: "Name", f_person: "Person", f_hairgroup: "Haare", f_look: "Gesicht und Kopfbedeckung", f_clothes: "Kleider", f_display: "Anzeige", f_gender: "Geschlecht", f_age: "Alter", f_skin: "Hautfarbe", f_hair: "Frisur", f_hair_color: "Haarfarbe", f_eyes: "Augenfarbe", f_beard: "Bart", f_headwear: "Kopfbedeckung", f_glasses: "Brille", f_freckles: "Sommersprossen", f_earrings: "Ohrringe", f_color: "Oberteil", f_bottom: "Hose oder Rock", f_bottom_color: "Farbe von Hose oder Rock", f_accent_color: "Mütze, Schal, Schirm, Schuhe", f_sense: "Friert schnell (−) oder selten (+)", f_hours: "Stunden voraus", f_show_weather: "Wetter anzeigen", f_show_tips: "Hinweise anzeigen", female: "Weiblich", male: "Männlich", neutral: "Neutral", child: "Kind", teen: "Teenager", adult: "Erwachsen", senior: "Senior/in", porcelain: "Porzellan", fair: "Sehr hell", light: "Hell", medium: "Mittel", olive: "Oliv", tan: "Gebräunt", brown: "Braun", deep: "Dunkelbraun", ebony: "Sehr dunkel", short: "Kurz", buzz: "Sehr kurz", curly: "Locken", afro: "Afro", bob: "Bob", long: "Lang", ponytail: "Pferdeschwanz", pigtails: "Zwei Zöpfe", braids: "Geflochten", bun: "Dutt", receding: "Lichtes Haar", bald: "Glatze", black: "Schwarz", dark_brown: "Dunkelbraun", light_brown: "Hellbraun", blond: "Blond", platinum: "Platinblond", red: "Rot", auburn: "Kastanie", grey: "Grau", white: "Weiss", blue: "Blau", pink: "Rosa", dark: "Dunkelbraun", hazel: "Haselnuss", green: "Grün", none: "Ohne", stubble: "Stoppeln", moustache: "Schnauz", goatee: "Kinnbart", full: "Vollbart", cap: "Mütze mit Schirm", headscarf: "Kopftuch", turban: "Turban", teal: "Türkis", navy: "Dunkelblau", orange: "Orange", yellow: "Gelb", olive_green: "Olivgrün", purple: "Violett", beige: "Beige", trousers: "Hose", skirt: "Rock",
  },
  fr: {
    no_entity: "Choisissez une entité météo", missing: "Entité météo introuvable", unavailable: "Pas de données météo", feels: "ressenti", hot: "Vêtements légers", warm: "Un t-shirt suffit", mild: "Un pull suffit", cool: "Mettre une veste légère", cold: "Mettre une veste chaude", frost: "Bien se couvrir", umbrella: "Prendre un parapluie", raincoat: "Veste de pluie plutôt que parapluie, il y a du vent", snow: "Neige : bottes et gants", storm: "Orage : mieux vaut rester à l'intérieur", sun: "Chapeau et crème solaire", milder: "Plus doux ensuite, jusqu'à {t}", colder: "Plus froid ensuite, jusqu'à {t} : prendre une veste", rain_later: "Pluie vers {h}", ice: "Attention au verglas", s_hot: "Léger", s_warm: "T-shirt", s_mild: "Pull", s_cool: "Veste légère", s_cold: "Veste chaude", s_frost: "Bien couvert", s_umbrella: "Parapluie", s_raincoat: "Veste de pluie", s_snow: "Tenue de neige", s_storm: "Rester dedans", arctic: "Glacial : se couvrir le visage", s_arctic: "Glacial", s_rain_later: "Pluie plus tard", f_style: "Style", friendly: "Sympathique", comic: "BD urbaine", pictogram: "Pictogramme", mono: "Noir et blanc", symbols: "Vêtements en symboles", f_entity: "Météo", f_name: "Nom", f_person: "Personne", f_hairgroup: "Cheveux", f_look: "Visage et couvre-chef", f_clothes: "Vêtements", f_display: "Affichage", f_gender: "Genre", f_age: "Âge", f_skin: "Peau", f_hair: "Coiffure", f_hair_color: "Couleur des cheveux", f_eyes: "Couleur des yeux", f_beard: "Barbe", f_headwear: "Couvre-chef", f_glasses: "Lunettes", f_freckles: "Taches de rousseur", f_earrings: "Boucles d'oreilles", f_color: "Haut", f_bottom: "Pantalon ou jupe", f_bottom_color: "Couleur du pantalon ou de la jupe", f_accent_color: "Bonnet, écharpe, parapluie, chaussures", f_sense: "Frileux (−) ou non (+)", f_hours: "Heures à venir", f_show_weather: "Afficher la météo", f_show_tips: "Afficher les conseils", female: "Féminin", male: "Masculin", neutral: "Neutre", child: "Enfant", teen: "Adolescent", adult: "Adulte", senior: "Senior", porcelain: "Porcelaine", fair: "Très claire", light: "Claire", medium: "Moyenne", olive: "Olive", tan: "Bronzée", brown: "Brune", deep: "Brun foncé", ebony: "Ébène", short: "Courts", buzz: "Rasés", curly: "Bouclés", afro: "Afro", bob: "Carré", long: "Longs", ponytail: "Queue de cheval", pigtails: "Couettes", braids: "Tresses", bun: "Chignon", receding: "Clairsemés", bald: "Chauve", black: "Noir", dark_brown: "Brun foncé", light_brown: "Châtain clair", blond: "Blond", platinum: "Platine", red: "Rouge", auburn: "Auburn", grey: "Gris", white: "Blanc", blue: "Bleu", pink: "Rose", dark: "Brun foncé", hazel: "Noisette", green: "Vert", none: "Sans", stubble: "Barbe naissante", moustache: "Moustache", goatee: "Bouc", full: "Barbe complète", cap: "Casquette", headscarf: "Foulard", turban: "Turban", teal: "Turquoise", navy: "Bleu marine", orange: "Orange", yellow: "Jaune", olive_green: "Vert olive", purple: "Violet", beige: "Beige", trousers: "Pantalon", skirt: "Jupe",
  },
  it: {
    no_entity: "Scegli un'entità meteo", missing: "Entità meteo non trovata", unavailable: "Nessun dato meteo al momento", feels: "percepiti", hot: "Vestiti leggeri", warm: "Basta una maglietta", mild: "Basta un maglione", cool: "Mettere una giacca leggera", cold: "Mettere una giacca calda", frost: "Coprirsi bene", umbrella: "Prendere l'ombrello", raincoat: "Giacca da pioggia invece dell'ombrello, c'è vento", snow: "Neve: stivali e guanti", storm: "Temporale: meglio restare al chiuso", sun: "Cappello e crema solare", milder: "Più mite dopo, fino a {t}", colder: "Più freddo dopo, fino a {t}: prendere una giacca", rain_later: "Pioggia verso le {h}", ice: "Attenzione al ghiaccio", s_hot: "Leggero", s_warm: "Maglietta", s_mild: "Maglione", s_cool: "Giacca leggera", s_cold: "Giacca calda", s_frost: "Ben coperti", s_umbrella: "Ombrello", s_raincoat: "Impermeabile", s_snow: "Abiti da neve", s_storm: "Stare in casa", arctic: "Gelo: coprire il viso", s_arctic: "Gelo intenso", s_rain_later: "Pioggia dopo", f_style: "Stile", friendly: "Simpatico", comic: "Fumetto urbano", pictogram: "Pittogramma", mono: "Bianco e nero", symbols: "Vestiti come simboli", f_entity: "Meteo", f_name: "Nome", f_person: "Persona", f_hairgroup: "Capelli", f_look: "Viso e copricapo", f_clothes: "Vestiti", f_display: "Visualizzazione", f_gender: "Genere", f_age: "Età", f_skin: "Pelle", f_hair: "Acconciatura", f_hair_color: "Colore dei capelli", f_eyes: "Colore degli occhi", f_beard: "Barba", f_headwear: "Copricapo", f_glasses: "Occhiali", f_freckles: "Lentiggini", f_earrings: "Orecchini", f_color: "Parte superiore", f_bottom: "Pantaloni o gonna", f_bottom_color: "Colore di pantaloni o gonna", f_accent_color: "Berretto, sciarpa, ombrello, scarpe", f_sense: "Freddoloso (−) o no (+)", f_hours: "Ore successive", f_show_weather: "Mostra il meteo", f_show_tips: "Mostra i consigli", female: "Femminile", male: "Maschile", neutral: "Neutro", child: "Bambino", teen: "Adolescente", adult: "Adulto", senior: "Anziano", porcelain: "Porcellana", fair: "Molto chiara", light: "Chiara", medium: "Media", olive: "Olivastra", tan: "Abbronzata", brown: "Marrone", deep: "Marrone scuro", ebony: "Ebano", short: "Corti", buzz: "Rasati", curly: "Ricci", afro: "Afro", bob: "Caschetto", long: "Lunghi", ponytail: "Coda", pigtails: "Codini", braids: "Trecce", bun: "Chignon", receding: "Radi", bald: "Calvo", black: "Nero", dark_brown: "Castano scuro", light_brown: "Castano chiaro", blond: "Biondo", platinum: "Platino", red: "Rosso", auburn: "Ramato", grey: "Grigio", white: "Bianco", blue: "Blu", pink: "Rosa", dark: "Marrone scuro", hazel: "Nocciola", green: "Verde", none: "Senza", stubble: "Barba incolta", moustache: "Baffi", goatee: "Pizzetto", full: "Barba piena", cap: "Cappellino", headscarf: "Foulard", turban: "Turbante", teal: "Turchese", navy: "Blu scuro", orange: "Arancione", yellow: "Giallo", olive_green: "Verde oliva", purple: "Viola", beige: "Beige", trousers: "Pantaloni", skirt: "Gonna",
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

  const level = t >= 26 ? "hot" : t >= 20 ? "warm" : t >= 14 ? "mild" : t >= 8 ? "cool" : t >= -1 ? "cold" : t >= -10 ? "frost" : "arctic";
  const o = { level, t, wind: windy, wet: !!wet, snow };
  o.legs = level === "hot" || t >= 22 ? "shorts" : "trousers";
  o.top = { hot: "tshirt", warm: "tshirt", mild: "sweater", cool: "wind", cold: "winter", frost: "winter", arctic: "winter" }[level];
  o.feet = level === "hot" ? "sandals" : t < 3 ? "winter" : "sneakers";
  o.beanie = t < 5;
  o.gloves = t < 3;
  o.scarf = t < 10 || (windy && t < 14);
  o.glasses = sunny && t >= 12;
  o.sunhat = (level === "hot" && bright) || uv >= 6;
  o.umbrella = false;
  if (wetSoon) {
    if (t < 20 && t >= 8) o.top = "rain";
    if (t < 22) o.feet = t < 3 ? "winter" : "rain";
    if ((storm || windy) && t >= 8) o.top = "rain";
    o.umbrella = !windy && !storm;
    o.hood = windy || storm;
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
  if (wetSoon && !snow) {
    if (!storm) tips.push({ key: windy ? "raincoat" : "umbrella" });
  }
  else if (wet && !snow && !storm) tips.push({ key: "rain_later", time: wet.time }, { key: "umbrella" });
  if (wet && !snow && Math.min(...soon.map((h) => (h.temperature === null ? 99 : h.temperature))) <= 0.5) tips.push({ key: "ice" });
  if (o.sunhat) tips.push({ key: "sun" });
  const first = known[0].feels;
  if (t >= 8 && first - low.feels >= 6 && known.indexOf(low) > 3) tips.push({ key: "colder", value: low.temperature });
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
const BUILD = { child: [1, 1, 1, 2], teen: [1.02, 1.14, 0.9, 2.5], adult: [1.06, 1.28, 0.84, 3], senior: [1.06, 1.23, 0.84, 2.5] };

// Hair behind the head and body.
function hairBack(o) {
  const c = shade(o.hair, 0.85), covered = o.hat || o.fur || o.hood === "up";
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
  if (o.legs === "snow") l.push(line("M86 202 L84 256", 33, o.legsC), line("M114 202 L116 256", 33, o.legsC), line("M100 214 L100 250", 3, shade(o.legsC, 0.75)), line("M74 236 L95 236 M105 236 L126 236", 3.4, shade(o.legsC, 0.75)));
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
  const low = o.top === "winter" ? (o.legs === "snow" ? 200 : o.fur ? 226 : 216) : o.top === "rain" ? 222 : 200;
  const flare = o.top === "rain" ? 8 : 0;
  const [a, m, b] = !grown ? [26, 26, 27] : o.shape === "female" ? [24, 19, 28] : o.shape === "male" ? [29, 28, 26] : [26, 25, 27];
  const A = a + w, M = m + w, B = b + w + flare, dk = shade(o.topC, 0.82), lt = shade(o.topC, 1.14);
  const t = [`<path d="M${100 - A} 138 Q${102 - A} 122 100 120 Q${98 + A} 122 ${100 + A} 138 Q${100 + M} 168 ${100 + B} ${low - 8} Q${100 + B} ${low} ${92 + B} ${low} L${108 - B} ${low} Q${100 - B} ${low} ${100 - B} ${low - 8} Q${100 - M} 168 ${100 - A} 138 Z" fill="${o.topC}"/>`];
  const e = Math.min(A, M + 2) - 1;
  if (o.top === "tshirt") t.push(o.print === "sun" ? `<circle cx="100" cy="164" r="11" fill="#FFD54F"/><path d="M100 146v-4M100 186v-4M82 164h-4M122 164h-4M87 151l-3-3M116 180l-3-3M87 177l-3 3M116 148l-3 3" stroke="#FFD54F" stroke-width="3.4" stroke-linecap="round"/>` : o.print === "stripes" ? `<path d="M${102 - e} 156 H${98 + e} M${102 - e} 172 H${98 + e} M${101 - e} 188 H${99 + e}" stroke="#fff" opacity=".85" stroke-width="5"/>` : `<path d="M90 122 Q100 134 110 122" stroke="${dk}" stroke-width="3" fill="none"/>`);
  if (o.top === "sweater") t.push(`<path d="M${100 - e} 172 H${100 + e}" stroke="${lt}" stroke-width="9"/><path d="M80 172 l5 -4 l5 8 l5 -8 l5 8 l5 -8 l5 8 l5 -8 l5 6" stroke="#fff" opacity=".8" stroke-width="2.4" fill="none" stroke-linejoin="round"/><path d="M${106 - b} 195 H${94 + b}" stroke="${dk}" stroke-width="6" stroke-linecap="round"/>`);
  if (o.top === "wind") t.push(`<path d="M${101 - e} 160 Q100 168 ${99 + e} 160 L${99 + e} 172 Q100 180 ${101 - e} 172Z" fill="#fff" opacity=".85"/><path d="M82 188 l8 6 M118 188 l-8 6" stroke="${dk}" stroke-width="3.4" stroke-linecap="round"/><path d="M100 122 V199" stroke="${dk}" stroke-width="2.4"/>`);
  if (o.top === "rain") t.push(`<path d="M100 124 V220" stroke="${dk}" stroke-width="2.6"/>${[144, 166, 188].map((y) => `<rect x="93" y="${y}" width="14" height="6" rx="3" fill="${dk}"/>`).join("")}<path d="M76 194 h14 v11 h-14z M110 194 h14 v11 h-14z" fill="${dk}" opacity=".55"/>`);
  if (o.top === "winter") t.push(`<path d="M${102 - A} 152 Q100 160 ${98 + A} 152 M${101 - M} 174 Q100 182 ${99 + M} 174 M${101 - B} ${low - 20} Q100 ${low - 12} ${99 + B} ${low - 20}" stroke="${dk}" stroke-width="3.4" fill="none"/><path d="M100 124 V${low - 3}" stroke="${lt}" stroke-width="4"/><rect x="97" y="134" width="6" height="11" rx="3" fill="#fff"/>`);
  s.push(body(...t), ...arms);

  // neck and head
  const nw = o.shape === "male" && grown ? 11 : 9;
  s.push(`<rect x="${100 - nw}" y="${(neck - 10).toFixed(1)}" width="${nw * 2}" height="${(Y(127) - neck + 10).toFixed(1)}" rx="7" fill="${skinD}"/>`);
  const h = [];
  if (o.hood === "up") h.push(`<path d="M100 22 C62 22 54 60 56 88 C58 116 78 126 100 126 C122 126 142 116 144 88 C146 60 138 22 100 22Z" fill="${o.topC}"/><path d="M100 22 C62 22 54 60 56 88" stroke="${lt}" stroke-width="3" fill="none"/>`);
  if (o.fur) h.push(`<path d="M100 14 C56 14 46 56 50 88 C54 122 78 132 100 132 C122 132 146 122 150 88 C154 56 144 14 100 14Z" fill="${o.topC}"/>`);
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
  if (o.fur) h.push(`<path d="M100 24 C62 24 56 58 58 86 C60 112 78 124 100 124 C122 124 140 112 142 86 C144 58 138 24 100 24Z" fill="none" stroke="#E9DDCB" stroke-width="11" stroke-linecap="round" stroke-dasharray="7 4"/><path d="M100 24 C62 24 56 58 58 86 C60 112 78 124 100 124 C122 124 140 112 142 86 C144 58 138 24 100 24Z" fill="none" stroke="#D8C8B0" stroke-width="6" stroke-linecap="round"/>`);
  if (o.veil) h.push(`<path d="M63 91 Q100 100 137 91 C136 112 122 124 100 124 C78 124 64 112 63 91Z" fill="${o.accent}"/><path d="M68 100 Q100 109 132 100 M74 110 Q100 118 126 110" stroke="${shade(o.accent, 0.82)}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`);
  if (o.goggles) h.push(`<path d="M64 46 Q100 38 136 46" stroke="#2B3440" stroke-width="8" fill="none" stroke-linecap="round"/><rect x="72" y="34" width="56" height="21" rx="10" fill="#2B3440"/><rect x="76" y="37.5" width="48" height="14" rx="7" fill="#F28C38"/><path d="M82 41 h14" stroke="#fff" opacity=".7" stroke-width="3" stroke-linecap="round"/>`);
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
  const fur = o.level === "arctic" && !cover, hood = o.hood && !cover && !fur ? "up" : o.top === "rain" ? "down" : null;
  // under a hood there is no room for curls
  let cut = HAIR_STYLES.includes(p.hair) ? p.hair : "short";
  if ((fur || hood === "up") && (cut === "curly" || cut === "afro")) cut = "bun";
  const skirt = p.bottom === "skirt" && o.legs !== "snow" && o.t >= 8;
  return {
    age, shape, cover, accent,
    skin: of(SKIN, p.skin, "medium"), hair: of(HAIR, p.hair_color, "brown"), eyes: of(EYES, p.eyes, "brown"),
    cut,
    beard: age === "child" ? null : BEARDS.includes(p.beard) && p.beard !== "none" ? p.beard : null,
    lashes: shape === "female", freckles: p.freckles === true, earrings: p.earrings === true,
    glasses: p.glasses === true ? "#2F3A44" : null, shades: o.glasses,
    top: o.top, topC: top, print: o.level === "hot" ? "sun" : p.age === "child" || p.age === "teen" ? "stripes" : "plain",
    legs: skirt ? "skirt" : o.legs, legsC: o.legs === "snow" ? (accent === top ? COLORS.navy : accent) : o.legs === "shorts" && !skirt && bottom === COLORS.black ? "#3A3F47" : bottom,
    tights: skirt && o.t < 20 ? "#4A4453" : null,
    feet: o.feet, feetC: { sandals: "#8E5B3A", sneakers: accent, rain: accent, winter: "#5A4334" }[o.feet],
    goggles: o.snow && !cover && !fur,
    hat: cover || fur || hood === "up" ? null : o.beanie ? "beanie" : o.sunhat ? "sun" : p.headwear === "cap" && o.top !== "rain" ? "cap" : null,
    hatC: o.sunhat && !o.beanie ? "#F2D59A" : accent,
    hood,
    scarf: o.scarf ? (cover === "headscarf" ? null : accent) : null, gloves: o.gloves ? accent : null,
    umbrella: o.umbrella ? accent : null, wind: o.wind,
    wave: !o.umbrella && o.level !== "frost" && o.level !== "arctic",
    fur, veil: o.level === "arctic",
    mood: o.level === "frost" || o.level === "arctic" ? "cold" : o.level === "hot" || o.level === "warm" || o.snow ? "open" : "smile",
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
  const white = night ? "#8C9AB5" : "#FFFFFF", dull = night ? "#5D6A82" : { rain: "#A3B3BE", storm: "#737C92" }[kind] || "#EDF1F4";
  let ground = o && (o.snow || kind === "snow") ? "#FFFFFF" : o && (o.level === "frost" || o.level === "arctic") ? "#E4F1F8" : o && o.level === "hot" ? "#F0D288" : o && (o.level === "cool" || o.level === "cold") ? "#A9B178" : "#92C463";
  if (night) ground = shade(ground, 0.5);
  const d = [];
  const orb = night ? `<path d="M322 36 A24 24 0 1 0 342 66 A20 20 0 0 1 322 36Z" fill="#F3EFD6"/>` : `<g class="sun"><circle cx="318" cy="58" r="40" fill="#FFE082" opacity=".35"/></g><circle cx="318" cy="58" r="26" fill="#FFD54F"/>`;
  if (kind === "sunny" || kind === "partlycloudy" || kind === "wind") d.push(orb);
  if (night && (kind === "sunny" || kind === "partlycloudy")) d.push(`<g fill="#fff">${Array.from({ length: 34 }, (_, i) => `<circle class="${i % 3 ? "" : "star"}" cx="${rnd(i) * 600}" cy="${rnd(i + 40) * 170}" r="${0.8 + rnd(i + 9) * 1.4}"/>`).join("")}</g>`);
  if (kind === "partlycloudy") d.push(cloud(318, 82, 0.9, white, "drift"), cloud(480, 60, 0.9, white, "drift slow"));
  if (kind === "cloudy" || kind === "rain" || kind === "storm" || kind === "snow" || kind === "wind") d.push(cloud(70, 60, 1.4, dull, "drift"), cloud(300, 42, 1.1, dull, "drift slow"), cloud(500, 70, 1.3, dull, "drift"));
  if (kind === "storm") d.push(`<path class="bolt" d="M420 70 l-22 50 h18 l-14 44 l44 -60 h-20 l16 -34z" fill="#FFE57F"/>`);
  if (kind === "wind" || (o && o.wind)) d.push(`<g class="gust" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"><path d="M230 96 h90 q14 0 14 -11 q0 -9 -10 -9"/><path d="M420 130 h80"/><path d="M20 170 h70 q12 0 12 9"/></g><g class="leaf" fill="#E07A3F"><path d="M150 200 q10 -12 22 -4 q-6 12 -22 4z"/><path d="M430 190 q10 -12 22 -4 q-6 12 -22 4z"/></g>`);
  const floor = `<ellipse cx="300" cy="356" rx="520" ry="76" fill="${ground}"/>`;
  const front = [];
  if (kind === "rain" || kind === "storm") front.push(`<defs><pattern id="rain" width="90" height="110" patternUnits="userSpaceOnUse">${Array.from({ length: 9 }, (_, i) => `<path d="M${8 + rnd(i) * 76} ${4 + rnd(i + 5) * 86} l-4 15" stroke="#E3F2FD" stroke-width="2.6" stroke-linecap="round"/>`).join("")}</pattern></defs><rect class="rain" x="-50" y="-120" width="700" height="580" fill="url(#rain)" opacity=".6"/>`);
  if (kind === "snow") front.push(`<defs><pattern id="snow" width="120" height="120" patternUnits="userSpaceOnUse">${Array.from({ length: 11 }, (_, i) => `<circle cx="${8 + rnd(i) * 104}" cy="${8 + rnd(i + 30) * 104}" r="${1.6 + rnd(i + 3) * 2.6}" fill="#fff"/>`).join("")}</pattern></defs><rect class="snowfall" x="-50" y="-140" width="700" height="600" fill="url(#snow)"/>`);
  if (kind === "fog") front.push(`<g class="drift fog" fill="#fff"><ellipse cx="170" cy="150" rx="260" ry="20" opacity=".4"/><ellipse cx="430" cy="205" rx="300" ry="26" opacity=".45"/><ellipse cx="200" cy="262" rx="320" ry="26" opacity=".5"/><ellipse cx="420" cy="310" rx="300" ry="24" opacity=".55"/></g>`);
  return {
    back: `<svg class="back" viewBox="0 0 600 336" preserveAspectRatio="xMidYMin slice" aria-hidden="true"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient></defs><rect width="600" height="336" fill="url(#sky)"/>${d.join("")}</svg><svg class="back" viewBox="0 0 600 336" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${floor}</svg>`,
    front: front.length ? `<svg class="front" viewBox="0 0 600 336" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${front.join("")}</svg>` : "",
  };
}

// --- drawing, street comic ------------------------------------------------------
// The same clothes with thick outlines and hard shadows, in grown-up proportions.
const INK = "#15121c";
let comicId = 0;
function inked(d, fill, shadow = "", width = 3.2) {
  const id = `c${comicId++}`;
  return `<clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="${fill}"/>${shadow ? `<path d="${shadow}" fill="#1a0f3a" opacity=".26" clip-path="url(#${id})"/>` : ""}<path d="${d}" fill="none" stroke="${INK}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round"/>`;
}
const ink = (d, w = 2.2, c = INK, o = 1) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" opacity="${o}"/>`;
// [width, height, head, how far the head sinks into the shoulders]
const COMIC_BUILD = { child: [0.96, 0.72, 1.22, 13], teen: [0.9, 0.86, 1.02, 6], adult: [1, 1, 1, 3], senior: [1, 0.96, 1, 3] };

function comicHairBack(o) {
  const c = shade(o.hair, 0.86), covered = o.hat || o.fur || o.hood === "up";
  if (o.cover || ((o.hood === "up" || o.fur) && (o.cut === "long" || o.cut === "ponytail"))) return "";
  switch (o.cut) {
    case "long":
      return inked(o.wind ? "M82 34 C66 52 44 64 30 92 C48 96 66 108 84 120 L118 112 C126 84 124 56 120 34Z" : "M80 34 C70 62 68 96 74 126 Q88 120 92 108 L110 108 Q116 124 130 122 C136 92 130 58 121 34Z", o.hair, "M104 20 L150 20 L150 130 L108 130Z");
    case "bob":
      return inked("M78 34 C68 64 69 84 77 92 L125 92 C133 84 134 64 124 34Z", o.hair, "M106 20 H150 V100 H108Z");
    case "ponytail":
      return inked(o.wind ? "M84 26 C56 22 34 40 18 34 C22 58 54 66 86 52Z" : "M116 24 C154 18 160 70 146 108 C136 92 132 64 114 50Z", o.hair, "M138 20 h30 v90 h-24z");
    case "pigtails":
      return inked("M80 40 C58 34 46 60 52 92 C62 88 74 72 82 56Z", o.hair) + inked("M120 40 C142 34 154 60 148 92 C138 88 126 72 118 56Z", o.hair, "M134 30 h24 v70 h-18z");
    case "braids":
      return [73, 129].map((x) => Array.from({ length: 5 }, (_, i) => `<ellipse cx="${x - (o.wind ? i * 4 : 0)}" cy="${64 + i * 13}" rx="7.5" ry="8.5" fill="${i % 2 ? c : o.hair}" stroke="${INK}" stroke-width="2.6"/>`).join("") + `<circle cx="${x - (o.wind ? 20 : 0)}" cy="126" r="4.5" fill="${o.accent}" stroke="${INK}" stroke-width="2.4"/>`).join("");
    case "afro":
      return covered ? inked("M84 40 Q60 36 62 56 Q66 70 82 64Z M118 40 Q142 36 140 56 Q136 70 120 64Z", o.hair) : inked("M101 -14 C140 -14 152 22 142 48 C136 66 122 70 101 70 C80 70 66 66 60 48 C50 22 62 -14 101 -14Z", o.hair, "M116 -20 H160 V80 H124 Q140 30 116 -20Z");
    case "curly":
      return covered ? inked("M84 40 Q66 38 68 54 Q72 66 82 60Z M118 40 Q136 38 134 54 Q130 66 120 60Z", o.hair) : "";
    case "bun":
      return covered ? "" : inked("M89 12 Q88 -8 101 -8 Q114 -8 113 12Z", o.hair);
    default:
      return "";
  }
}

function comicHairFront(o) {
  if (o.cover) return "";
  const covered = o.hat || o.fur || o.hood === "up", gloss = (d) => (covered ? "" : ink(d, 1.8, "#fff", 0.35));
  const cap = () => inked("M78 47 C75 22 88 12 101 12 C114 12 127 22 124 47 C118 34 110 28 101 28 C92 28 84 34 78 47Z", o.hair, "M108 8 H130 V50 H114Z");
  switch (o.cut) {
    case "bald":
      return "";
    case "receding":
      return inked("M79 50 Q74 32 82 24 Q86 34 83 52Z", o.hair, "", 2.6) + inked("M123 50 Q128 32 120 24 Q116 34 119 52Z", o.hair, "", 2.6);
    case "buzz":
      return inked("M79 42 Q75 14 101 13 Q127 14 123 42 Q117 27 101 26 Q85 27 79 42Z", o.hair, "M108 8 H130 V46 H114Z", 2.6);
    case "curly":
      return covered ? "" : inked("M78 44 Q68 40 72 30 Q68 20 79 16 Q82 5 94 8 Q102 0 111 7 Q123 5 125 16 Q135 22 130 32 Q133 42 124 45 Q121 36 114 34 Q108 38 101 33 Q94 38 88 34 Q81 36 78 44Z", o.hair, "M110 0 H136 V50 H114Z");
    case "afro":
      return covered ? "" : inked("M77 48 Q72 8 101 8 Q130 8 125 48 Q118 30 101 29 Q84 30 77 48Z", o.hair, "", 2.4);
    case "long":
    case "bob":
      return inked("M79 48 C74 24 86 12 101 12 C118 12 127 26 122 50 C119 38 112 30 104 28 C97 36 84 36 79 48Z", o.hair, "M108 8 H130 V52 H114Z") + gloss("M96 16 q-8 6 -10 14 M112 18 q5 6 6 12");
    case "pigtails":
      return cap() + ink("M101 14 V26", 1.8) + (covered ? "" : `<circle cx="79" cy="41" r="4" fill="${o.accent}" stroke="${INK}" stroke-width="2"/><circle cx="123" cy="41" r="4" fill="${o.accent}" stroke="${INK}" stroke-width="2"/>`);
    case "bun":
    case "ponytail":
    case "braids":
      return cap() + gloss("M94 16 q-6 4 -8 11 M110 17 q5 4 7 10");
    default:
      return covered ? ink("M80 32 V46 M122 32 V46", 5, o.hair) : inked(o.wind ? "M79 42 Q70 30 66 12 Q78 16 86 10 Q102 -4 120 10 Q128 24 122 42 L119 32 Q112 24 104 27 Q94 31 86 26 Q82 32 81 42Z" : "M79 42 Q73 20 88 10 Q108 -2 122 12 Q128 24 122 42 L119 32 Q112 24 104 27 Q94 31 86 26 Q82 32 81 42Z", o.hair, "M106 0 H132 V44 H112 Q116 30 106 0Z") + gloss("M92 12 q8 4 6 12 M106 8 q4 8 2 14");
  }
}

function comicFace(o) {
  const s = [], kid = o.age === "child", f = o.shape === "female", y = kid ? 62 : 64;
  if (o.beard === "stubble") s.push(`<path d="M81 56 Q84 72 95 77 L108 77 Q117 72 121 58 Q114 66 108 64 Q101 61 94 64 Q88 66 81 56Z" fill="${o.hair}" opacity=".42"/>`);
  if (o.beard === "full") s.push(inked("M80 50 Q80 72 92 82 Q101 87 111 82 Q122 72 122 50 Q118 60 110 60 Q101 57 92 60 Q84 60 80 50Z", o.hair, "M108 48 h20 v40 h-22z", 2.6), `<path d="M94 66 Q101 63 108 66 Q106 72 101 72 Q96 72 94 66Z" fill="${shade(o.skin, 0.75)}"/>`);
  if (o.beard === "goatee") s.push(inked("M92 70 Q101 66 110 70 Q110 84 101 86 Q92 84 92 70Z", o.hair, "", 2.4));
  if (o.freckles) s.push(`<g fill="${shade(o.skin, 0.62)}" opacity=".8">${[[84, 57], [88, 59], [92, 57], [110, 57], [114, 59], [118, 57]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="1.1"/>`).join("")}</g>`);
  if (kid || o.mood === "cold") s.push(`<g fill="#E8504C" opacity=".28"><circle cx="84" cy="59" r="5"/><circle cx="118" cy="59" r="5"/></g>`);
  if (o.age === "senior") s.push(ink("M82 53 q3 3 6 2 M120 53 q-3 3 -6 2 M88 60 q-3 4 -2 8 M114 60 q3 4 2 8 M90 30 q11 -3 22 0", 1.5, INK, 0.45));
  s.push(kid ? ink("M99 57 q2.5 2 5 0", 2.2) : ink("M102 48 l-3.5 9 l5 1", 2.2));
  if (o.shades) s.push(`<path d="M81 42 H100 L98 53 Q90 58 84 52Z M103 42 H121 L118 52 Q111 58 105 53Z" fill="#181824" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>`, ink("M99 44 h5 M81 43 l-4 -1", 2.6), ink("M86 45 l5 5 M108 45 l5 5", 2.4, "#F08A5D"));
  else {
    if (kid) s.push(`<g class="eyes">${[89, 113].map((x) => `<ellipse cx="${x}" cy="47" rx="6" ry="6.4" fill="#fff" stroke="${INK}" stroke-width="2"/><circle cx="${x + 0.6}" cy="47.6" r="4.4" fill="${o.eyes}"/><circle cx="${x + 0.6}" cy="47.6" r="2.5" fill="${INK}"/><circle cx="${x + 2.2}" cy="45.4" r="1.6" fill="#fff"/>`).join("")}</g>`, ink("M83 36 q6 -4 12 -.5 M107 35.5 q6 -3.5 12 .5", 2.6, shade(o.hair, 0.6)), o.lashes ? ink("M83 42 l-3 -2.4 M119 42 l3 -2.4", 2) : "");
    else s.push(`<g class="eyes">${[89, 112].map((x) => `<path d="M${x - 6.5} 47 Q${x} 40.5 ${x + 6.5} 47 Q${x} 52 ${x - 6.5} 47Z" fill="#fff" stroke="${INK}" stroke-width="1.8"/><circle cx="${x + 0.5}" cy="46.6" r="3" fill="${o.eyes}"/><circle cx="${x + 0.5}" cy="46.6" r="1.5" fill="${INK}"/><circle cx="${x + 1.5}" cy="45.4" r=".9" fill="#fff"/>`).join("")}</g>`, ink(f ? "M82 46 Q89 39 96 45 M105 45 Q112 39 119 46" : "M82.5 45.5 Q89 40 95.5 45 M105.5 45 Q112 40 118.5 45.5", 2.8), ink(f ? "M82 37.5 q7 -4 13 0 M106 37 q7 -4 13 1" : "M81 38.5 l14 .5 M106 39 l14 -1.5", f ? 2.4 : 4, shade(o.hair, 0.55)));
    if (o.glasses) s.push(`<g fill="rgba(255,255,255,.16)" stroke="${INK}" stroke-width="2.6"><rect x="80" y="39" width="18" height="15" rx="6"/><rect x="103" y="39" width="18" height="15" rx="6"/></g>`, ink("M98 45 q2.5 -2 5 0", 2.4));
  }
  if (o.mood === "cold") s.push(ink(`M93 ${y + 3} q4 -3.5 8 0 q4 3.5 8 0`, 2.6));
  else if (o.mood === "open") s.push(`<path d="M92 ${y} Q101 ${y + 2} 110 ${y} Q108 ${y + 8} 101 ${y + 8} Q94 ${y + 8} 92 ${y}Z" fill="#fff" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>`);
  else s.push(kid ? ink("M94 66 q7 4 14 0", 2.6) : f ? `<path d="M93 65 Q98 62 101 64 Q105 62 110 65 Q102 71 93 65Z" fill="#B8334A" stroke="${INK}" stroke-width="1.6"/>` : ink("M93 67 Q102 70 110 64 l2 -1.5", 2.6));
  if (["moustache", "full", "goatee"].includes(o.beard)) s.push(inked("M101 60 Q93 57 86 64 Q94 67 101 63 Q108 67 116 64 Q109 57 101 60Z", o.hair, "", 1.8));
  return s.join("");
}

function comicFigure(o) {
  comicId = 0;
  const f = o.shape === "female", kid = o.age === "child", s = [];
  const [sx, sy, hs, sink] = COMIC_BUILD[o.age] || COMIC_BUILD.adult;
  const neck = 346 - 256 * sy + sink, dy = neck - 90;
  const body = `<g transform="translate(101 346) scale(${sx} ${sy}) translate(-101 -346)">`, head = `<g transform="translate(101 ${neck}) scale(${hs}) translate(-101 -90)">`;
  const open = o.top === "tshirt" && o.print === "sun", sleeves = o.top !== "tshirt", dk = shade(o.topC, 0.62);
  s.push(`<ellipse cx="104" cy="346" rx="${62 * sx}" ry="8" fill="#000" opacity=".28"/>`, head, comicHairBack(o), "</g>", body);
  if (o.umbrella) s.push(ink(`M152 150 V${(346 - (338 - dy) / sy).toFixed(1)}`, 5), ink("M152 150 q0 10 -8 10 q-6 0 -6 -6", 5));

  // legs
  const bare = o.legs === "skirt" && o.tights ? o.tights : o.skin;
  if (o.legs === "shorts" || o.legs === "skirt") s.push(inked("M80 216 L98 216 Q98 262 94 290 L94 330 L78 330 L77 290 Q74 255 80 216Z", bare, "M90 200 H110 V340 H88Z"), inked("M104 216 L124 216 Q130 258 130 290 L136 330 L119 330 L114 290 Q106 256 104 216Z", bare, "M122 200 H150 V340 H126Z"));
  if (o.legs === "shorts") s.push(inked("M78 180 L101 188 L101 252 L72 248 Q72 210 78 180Z", o.legsC, "M92 180 H110 V260 H92Z"), inked("M101 188 L123 180 Q131 212 132 246 L104 252Z", o.legsC, "M118 180 H140 V260 H120Z"));
  if (o.legs === "skirt") s.push(inked("M78 176 L124 176 Q132 214 143 246 Q101 260 59 246 Q70 214 78 176Z", o.legsC, "M112 176 H150 V262 H116Z"), ink("M86 188 L76 248 M101 188 V253 M116 188 L127 248", 1.8, INK, 0.6));
  if (o.legs === "trousers") s.push(inked(f ? "M78 180 L101 188 L99 250 Q96 296 96 330 L77 330 Q75 290 76 255 Q70 212 78 180Z" : "M79 180 L101 188 L100 250 Q98 300 98 330 L72 330 Q72 290 74 255 Q73 215 79 180Z", o.legsC, "M90 180 H110 V335 H88Z"), inked(f ? "M101 188 L123 180 Q132 214 127 255 Q131 292 136 330 L117 330 Q112 290 106 255Z" : "M101 188 L122 180 Q129 220 128 255 Q133 292 139 330 L114 330 Q110 290 106 255Z", o.legsC, "M120 180 H150 V335 H126Z"), ink("M78 262 q8 5 15 3 M110 264 q8 4 14 0", 1.8, INK, 0.7));
  if (o.legs === "snow") s.push(inked("M75 178 L101 188 L101 252 Q100 300 102 326 L68 326 Q69 290 71 255 Q70 213 75 178Z", o.legsC, "M90 178 H110 V335 H88Z"), inked("M101 188 L126 178 Q132 214 131 255 Q135 292 142 326 L112 326 Q107 290 103 255Z", o.legsC, "M122 178 H150 V335 H128Z"), ink("M74 258 h22 M108 258 h20 M72 290 h26 M112 290 h24", 2, INK, 0.6));

  // feet
  const L = "M72 324 L99 324 L100 338 L60 338 Q62 331 72 324Z", R = "M113 324 L139 324 Q150 331 154 338 L114 338Z";
  if (o.feet === "rain" || o.feet === "winter") {
    s.push(inked("M72 296 L100 296 L101 338 Q101 347 94 347 L62 347 Q56 347 59 338 Q70 332 72 322Z", o.feetC, "M90 290 H110 V350 H88Z"), inked("M113 296 L139 296 L141 322 Q152 332 157 338 Q160 347 152 347 L120 347 Q114 347 114 339Z", o.feetC, "M130 290 H165 V350 H136Z"));
    s.push(o.feet === "winter" ? inked("M70 292 q15 -6 32 0 v10 q-16 5 -32 0z", "#EFE4D2") + inked("M111 292 q15 -6 31 0 v10 q-16 5 -31 0z", "#EFE4D2") : ink("M78 304 v18 M119 304 v18", 4, "#fff", 0.6));
  } else if (o.feet === "sandals") s.push(inked(L, o.skin), inked(R, o.skin), inked("M58 337 H101 V344 H58Z", o.feetC), inked("M113 337 H156 V344 H113Z", o.feetC), ink("M68 338 Q78 322 90 337 M124 337 Q134 322 146 338", 4.5, o.feetC), ink("M72 324 H98 M114 324 H139", 4, o.feetC));
  else s.push(inked(L, o.feetC, "M90 320 H105 V340 H88Z"), inked(R, o.feetC, "M134 320 H160 V340 H136Z"), inked("M58 337 H101 V343 Q101 347 96 347 H62 Q56 347 58 337Z", "#fff"), inked("M113 337 H155 Q158 347 152 347 H118 Q113 347 113 343Z", "#fff"), ink("M78 328 l8 4 M84 326 l7 4 M121 328 l8 4 M127 326 l7 4", 1.8, "#fff"));

  // arms: the left hand in the pocket
  const armL = f ? "M74 101 Q63 108 58 140 Q54 160 62 176 L76 186 L82 174 L72 158 Q76 136 80 118Z" : "M68 100 Q56 108 52 140 Q48 160 60 178 L76 188 L82 174 L70 157 Q75 135 79 118Z";
  const armR = o.umbrella ? "M130 100 Q143 110 146 136 L147 116 L161 118 L159 152 Q150 166 140 154 L124 128Z" : f ? "M127 101 Q138 108 142 140 Q147 165 146 188 L133 189 Q132 160 122 130Z" : "M131 100 Q144 108 148 140 Q153 165 150 190 L135 191 Q135 160 126 130Z";
  const [hx, hy] = o.umbrella ? [153, 112] : f ? [140, 196] : [143, 198];
  const hand = o.gloves ? inked(`M${hx - 10} ${hy - 8} q10 -6 20 0 v10 q-2 10 -10 10 q-9 0 -10 -10z`, o.gloves, `M${hx + 2} ${hy - 12} h14 v28 h-12z`, 2.8) : inked(`M${hx - 8} ${hy - 8} q8 -4 16 0 l1 9 q-2 9 -9 9 q-7 -1 -9 -8z`, o.skin, `M${hx + 2} ${hy - 12} h12 v26 h-10z`, 2.8);
  if (sleeves) s.push(inked(armL, o.topC, "M66 96 H84 V190 H70Z"));
  else s.push(inked(armL, o.skin, "M68 130 H84 V190 H72Z"), inked(f ? "M74 101 Q63 108 60 132 L78 138 L80 118Z" : "M68 100 Q56 108 53 134 L74 140 L79 118Z", o.topC, "M68 96 H84 V142 H70Z"));
  if (!o.umbrella) s.push(hand);

  // torso
  const coat = o.top === "rain", parka = o.top === "winter", low = coat ? 222 : parka ? (o.legs === "snow" ? 194 : 210) : 190;
  s.push(inked(f ? `M74 101 Q84 92 93 90 L108 90 Q117 92 127 101 Q127 122 121 142 Q124 162 ${coat ? 134 : 127} ${low} L${coat ? 68 : 74} ${low} Q78 162 81 142 Q74 122 74 101Z` : `M67 100 Q82 90 92 88 L109 88 Q119 90 133 100 L131 142 L${coat ? 136 : 129} ${low} L${coat ? 66 : 73} ${low} L71 142Z`, o.topC, "M114 84 L150 84 L150 230 L112 230 Q122 160 114 84Z"));
  if (open) s.push(inked("M92 89 L109 89 L108 188 L94 188Z", "#F4F1EA", "M103 89 h10 v100 h-8z", 2.4), `<g fill="${o.accent === o.topC ? "#fff" : o.accent}">${[[82, 118], [80, 150], [85, 176], [118, 112], [119, 148], [117, 176]].map(([x, y]) => `<path d="M${x} ${y - 6} l2 4 4.4 .6 -3.2 3 .8 4.4 -4 -2.2 -4 2.2 .8 -4.4 -3.2 -3 4.4 -.6z"/>`).join("")}</g>`, ink("M93 89 L86 102 L96 108 M109 89 L115 102 L106 108"));
  else if (o.top === "tshirt") s.push(ink("M90 91 Q101 103 112 91", 2.6), o.print === "stripes" ? ink("M76 128 H126 M77 142 H125", 5, "#fff", 0.9) : "", ink("M80 178 l8 -5 M122 178 l-8 -5", 1.8, INK, 0.6));
  if (o.top === "sweater") s.push(inked("M76 96 Q101 78 126 96 Q124 108 101 108 Q78 108 76 96Z", dk, "", 2.8), ink("M94 106 v16 M108 106 v16", 2.4, "#fff"), inked("M82 150 H120 L126 176 H76Z", shade(o.topC, 0.88), "", 2.4), ink("M74 186 H128", 3));
  if (o.top === "wind") s.push(ink("M101 92 V188", 3), inked("M73 182 H129 V194 H73Z", o.accent, "", 2.8), ink("M82 184 v8 M92 184 v8 M112 184 v8 M121 184 v8", 1.6), ink("M80 156 l10 8 M122 156 l-10 8", 2.6), `<rect x="111" y="116" width="13" height="10" rx="2" fill="${o.accent}" stroke="${INK}" stroke-width="2"/>`);
  if (coat) s.push(ink("M101 92 V220", 2.6), ...[112, 138, 164, 190].map((y) => `<rect x="94" y="${y}" width="14" height="6" rx="2" fill="${dk}" stroke="${INK}" stroke-width="2"/>`), ink("M76 178 h15 v14 M111 178 h14 v14", 2.2));
  if (parka) s.push(ink(`M101 92 V${low - 3}`, 4, o.accent), ink(`M70 126 Q100 136 131 126 M72 154 Q100 164 130 154 M73 ${low - 18} Q100 ${low - 8} 129 ${low - 18}`, 2.4));
  if (sleeves) s.push(inked(armR, o.topC, "M138 96 H175 V200 H140Z"));
  else s.push(inked(armR, o.skin, "M138 120 H165 V200 H142Z"), inked(f ? "M127 101 Q138 108 141 132 L124 138 L121 118Z" : "M131 100 Q144 108 147 134 L127 140 L124 118Z", o.topC, "M134 96 H152 V142 H138Z"));
  if (o.umbrella) s.push(hand);
  s.push("</g>", head);

  // neck and head
  const hooded = o.hood === "up" || o.fur;
  if (hooded) s.push(inked("M101 2 C70 2 65 40 69 68 C73 94 88 100 101 100 C114 100 129 94 133 68 C137 40 132 2 101 2Z", o.topC, "M108 0 H142 V102 H112Z"));
  if (parka && !o.fur && !o.scarf) s.push(inked("M72 94 Q101 76 130 94 Q134 108 124 110 Q101 94 78 110 Q68 106 72 94Z", "#EADBC2", "M110 80 h30 v32 h-26z", 3));
  if (o.hood === "down") s.push(inked("M74 98 Q101 78 128 98 Q124 108 101 106 Q78 108 74 98Z", dk, "", 2.8));
  s.push(inked(kid ? "M94 66 L108 66 L109 96 Q101 101 93 96Z" : "M91 66 L110 66 L111 94 Q101 101 91 94Z", o.skin, "M91 70 L112 78 L112 101 L91 84Z"));
  if (o.cover === "headscarf") s.push(inked("M101 8 C70 8 66 46 70 74 Q74 100 84 110 H118 Q128 100 132 74 C136 46 132 8 101 8Z", shade(o.accent, 0.85), "M110 0 H140 V112 H114Z"));
  else if (!hooded) s.push(inked("M79 42 q-6 -2 -6 5 q1 9 8 9z", o.skin, "", 2.6));
  s.push(inked(kid ? "M78 42 Q78 17 101 17 Q124 17 124 42 Q125 60 114 70 Q107 76 101 76 Q95 76 88 70 Q77 60 78 42Z" : f ? "M80 40 Q80 18 101 18 Q121 18 121 42 Q121 58 113 69 Q106 77 101 77 Q95 77 88 69 Q80 58 80 40Z" : "M79 40 Q79 17 101 17 Q122 17 122 42 L120 62 Q116 72 108 77 L95 77 Q86 73 82 64Z", o.skin, "M108 10 L130 10 L130 84 L104 84 Q114 60 108 10Z"));
  if (o.earrings && !o.cover && !hooded) s.push(`<circle cx="76" cy="59" r="3" fill="#F2C14E" stroke="${INK}" stroke-width="1.6"/>`);
  s.push(comicFace(o), comicHairFront(o));
  if (o.veil) s.push(inked("M79 57 Q101 64 123 57 Q122 74 112 80 Q101 85 90 80 Q80 74 79 57Z", o.accent, "M108 56 h20 v30 h-18z", 2.8), ink("M84 66 Q101 72 118 66 M88 74 Q101 79 114 74", 1.8));
  if (o.cover === "headscarf") s.push(inked("M79 56 C72 26 86 18 101 18 C116 18 130 26 123 56 C130 20 122 6 101 6 C80 6 72 20 79 56Z", o.accent, "M112 4 H134 V58 H118Z", 2.8), inked("M79 58 Q84 78 101 80 Q118 78 123 58 Q132 84 124 104 Q101 116 78 104 Q70 84 79 58Z", o.accent, "M108 70 H136 V116 H112Z", 2.8), ink("M84 92 Q104 100 120 84", 2));
  if (o.cover === "turban") s.push(inked("M76 38 C68 8 82 -8 101 -8 C120 -8 134 8 126 38 Q101 14 76 38Z", o.accent, "M108 -10 H136 V40 H114Z"), ink("M78 34 Q100 -2 122 2 M124 34 Q104 2 82 6", 2.2));
  if (hooded) s.push(o.fur ? `<path d="M101 10 C72 10 68 44 72 68 C76 88 88 94 101 94 C114 94 126 88 130 68 C134 44 130 10 101 10Z" fill="none" stroke="${INK}" stroke-width="14"/><path d="M101 10 C72 10 68 44 72 68 C76 88 88 94 101 94 C114 94 126 88 130 68 C134 44 130 10 101 10Z" fill="none" stroke="#EADBC2" stroke-width="9.5"/>` : ink("M80 72 C71 46 76 14 101 14 C126 14 131 46 122 72", 4));
  if (o.hat === "beanie") s.push(inked("M78 34 C76 6 90 -4 101 -4 C113 -4 126 6 124 34Z", o.hatC, "M106 -6 H130 V40 H112Z"), inked("M75 27 Q101 18 127 27 L127 39 Q101 30 75 39Z", shade(o.hatC, 1.12), "M110 18 H130 V42 H112Z"), ink("M88 25 v9 M101 23 v9 M114 25 v9", 1.8), o.goggles ? inked("M79 14 Q101 4 123 14 L122 27 Q110 22 101 26 Q92 22 80 27Z", "#F0872F", "M108 2 H130 V30 H110Z", 3) + ink("M86 16 l8 -4", 3, "#fff", 0.85) : `<circle cx="101" cy="-7" r="7.5" fill="#F4F1EA" stroke="${INK}" stroke-width="2.8"/>`);
  if (o.hat === "sun") s.push(inked("M78 32 Q77 0 101 0 Q125 0 124 32Z", o.hatC, "M108 -4 H130 V36 H112Z"), inked("M78 30 Q101 18 124 30 L124 23 Q101 11 78 23Z", "#D9432F", "", 2.4), inked("M50 38 Q101 14 152 38 Q153 47 141 45 Q101 30 61 45 Q49 47 50 38Z", o.hatC, "M112 20 H156 V50 H112Z"));
  if (o.hat === "cap") s.push(inked("M78 35 C76 8 90 0 101 0 C113 0 126 8 124 35 Q101 24 78 35Z", o.hatC, "M106 -4 H130 V38 H112Z"), inked("M77 33 Q101 20 125 33 Q133 44 118 44 Q101 36 84 44 Q69 44 77 33Z", shade(o.hatC, 0.75), "", 2.8), `<circle cx="101" cy="0" r="3" fill="${shade(o.hatC, 0.75)}" stroke="${INK}" stroke-width="2"/>`);
  if (o.mood === "cold" && !o.veil) s.push(`<g class="breath" fill="#fff" stroke="${INK}" stroke-width="1.6" opacity=".85"><circle cx="138" cy="70" r="4.5"/><circle cx="147" cy="66" r="6.5"/><circle cx="157" cy="69" r="4.5"/></g>`);
  s.push("</g>");
  if (o.scarf) {
    s.push(`<g transform="translate(101 ${neck}) scale(${(sx + hs) / 2} ${Math.max(sy, 0.8)}) translate(-101 -90)">`, inked("M78 82 Q101 96 124 82 Q132 92 124 102 Q101 114 78 102 Q70 92 78 82Z", o.scarf, "M108 78 H136 V112 H110Z"), ink("M84 92 q16 8 34 0", 2));
    s.push(o.wind ? `<g class="wave">${inked("M80 96 C58 84 40 100 10 78 C8 92 12 100 18 104 C42 116 58 106 80 110Z", o.scarf, "M8 92 L80 102 V114 H10Z")}</g>` : inked("M108 100 L122 98 L128 156 L110 160Z", o.scarf, "M120 96 h14 v66 h-10z") + ink("M112 160 v6 M118 159 v6 M124 157 v6", 2), "</g>");
  }
  if (o.umbrella) s.push(`<g transform="translate(${((152 - 101) * (sx - 1)).toFixed(1)} ${(dy - 12 * (hs - 1)).toFixed(1)})">`, inked("M60 22 C72 -34 182 -48 222 16 Q206 8 192 20 Q172 4 152 18 Q130 2 108 18 Q84 6 60 22Z", o.umbrella, "M154 -50 H236 V30 H154 Q184 0 154 -50Z"), ink("M108 18 Q122 -22 148 -30 M192 20 Q182 -18 148 -30", 2.4), ink("M148 -30 v-7", 5), "</g>");
  return s.join("");
}

const COMIC_SKY = {
  sunny: ["#2196D9", "#7CCBF2", "#FFE6A6"], hot: ["#FF5F7E", "#FF9A5B", "#FFD97A"], partlycloudy: ["#3B8FC9", "#93CDEE", "#E9F4FA"], cloudy: ["#5F7A90", "#9DB2C1", "#DCE4E8"], fog: ["#8B9AA5", "#B9C4CB", "#E3E8EA"], rain: ["#27405E", "#4C6C8C", "#8FAFC4"], storm: ["#231F45", "#463C78", "#7A5E96"], snow: ["#3C5AA8", "#7FA8E0", "#DCEBFA"], wind: ["#2F6F8F", "#6FB1BF", "#F2C58A"], night: ["#141A3C", "#2B2F6B", "#5B3B8C"], night_cloudy: ["#171C30", "#2E3756", "#4C5578"],
};
const skyline = (color, base, seed, lit) => {
  let x = -10, d = "", w = "";
  for (let i = 0; x < 610; i++) {
    const b = 26 + rnd(i + seed) * 34, h = 34 + rnd(i + seed + 30) * 96;
    d += `M${x.toFixed(1)} ${base} V${(base - h).toFixed(1)} h${b.toFixed(1)} V${base}Z`;
    if (lit) for (let k = 0; k < 6; k++) if (rnd(i * 9 + k + seed) > 0.5) w += `<rect x="${(x + 5 + (k % 3) * 8).toFixed(1)}" y="${(base - h + 9 + Math.floor(k / 3) * 14).toFixed(1)}" width="4" height="6" fill="${lit}"/>`;
    x += b;
  }
  return `<path d="${d}" fill="${color}"/>${w}`;
};
function comicScene(where, o) {
  const { kind, night } = where, hot = o.level === "hot" && !night && (kind === "sunny" || kind === "partlycloudy");
  const key = hot ? "hot" : night ? (kind === "sunny" || kind === "partlycloudy" ? "night" : "night_cloudy") : kind, sky = COMIC_SKY[key];
  const puff = (x, y, k, cls) => `<g transform="translate(${x} ${y}) scale(${k})"><path class="${cls}" d="M-20 18 a17 17 0 0 1 2 -34 a24 24 0 0 1 44 -4 a18 18 0 0 1 24 12 a14 14 0 0 1 -2 26Z" fill="${night ? "#5A6486" : { rain: "#7F93A6", storm: "#62587F", snow: "#CBD8E8", cloudy: "#DFE6EB" }[kind] || "#fff"}" stroke="${INK}" stroke-width="3.4" stroke-linejoin="round"/></g>`;
  const up = [], down = [];
  if (hot) up.push(`<g class="sun"><circle cx="318" cy="96" r="72" fill="#FFF0B8" opacity=".5"/></g><circle cx="318" cy="96" r="54" fill="#FFF0B8"/>`);
  else if (kind === "sunny" || kind === "partlycloudy" || kind === "wind") up.push(night ? `<path d="M322 36 A24 24 0 1 0 342 66 A20 20 0 0 1 322 36Z" fill="#F3EFD6" stroke="${INK}" stroke-width="3"/>` : `<g class="sun"><circle cx="318" cy="58" r="38" fill="#FFE082" opacity=".4"/></g><circle cx="318" cy="58" r="26" fill="#FFD54F" stroke="${INK}" stroke-width="3.4"/>`);
  if (key === "night") up.push(`<g fill="#fff">${Array.from({ length: 30 }, (_, i) => `<circle class="${i % 3 ? "" : "star"}" cx="${(rnd(i) * 600).toFixed(1)}" cy="${(rnd(i + 40) * 160).toFixed(1)}" r="${(0.9 + rnd(i + 9) * 1.4).toFixed(1)}"/>`).join("")}</g>`);
  if (kind === "partlycloudy") up.push(puff(350, 84, 0.8, "drift"), puff(500, 56, 0.8, "drift slow"));
  if (["cloudy", "rain", "storm", "snow", "wind"].includes(kind)) up.push(puff(80, 64, 1.1, "drift"), puff(300, 44, 0.9, "drift slow"), puff(490, 70, 1, "drift"));
  if (kind === "storm") up.push(`<path class="bolt" d="M420 70 l-22 50 h18 l-14 44 l44 -60 h-20 l16 -34z" fill="#FFE57F" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`);
  const mix = (hex, f) => shade(hex, f);
  if (kind === "snow" && !night) down.push(`<path d="M-20 306 L140 206 L220 258 L330 186 L430 256 L500 212 L630 306Z" fill="#9DB9DE"/><path d="M140 206 L170 224 L156 222 L146 232 L128 220 L116 221Z M330 186 L362 208 L346 206 L332 218 L316 204 L302 204Z M500 212 L524 229 L508 227 L496 236 L482 224Z" fill="#fff"/>`);
  else if (hot) down.push(skyline("#B2376E", 292, 3), skyline("#6E2463", 306, 40));
  else if (night) down.push(skyline("#2A2A5C", 292, 7, "#F5C84B"), skyline("#171A3A", 306, 60, "#4FD6E8"));
  else down.push(skyline(mix(sky[0], 0.86), 292, 12), skyline(mix(sky[0], 0.6), 306, 90));
  if (kind === "wind" || o.wind) down.push(`<g class="gust" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"><path d="M210 96 h110 q16 0 16 -13 q0 -10 -11 -10"/><path d="M420 130 h90"/><path d="M10 170 h80"/></g><g class="leaf" fill="#E4572E" stroke="${INK}" stroke-width="2"><path d="M150 200 q10 -14 24 -4 q-8 14 -24 4z"/><path d="M430 190 q10 -14 24 -4 q-8 14 -24 4z"/></g>`);
  const white = o.snow || kind === "snow" || o.level === "frost" || o.level === "arctic";
  const floor = hot ? "#3A1B4A" : white ? (night ? "#8E99B4" : "#F4F8FD") : night ? "#10142C" : mix(sky[0], 0.42);
  down.push(`<path d="M0 300 Q300 278 600 300 V336 H0Z" fill="${floor}"/>`);
  const svg = (align, inner) => `<svg class="back" viewBox="0 0 600 336" preserveAspectRatio="xMidY${align} slice" aria-hidden="true">${inner}</svg>`;
  return {
    back: svg("Min", `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">${sky.map((c, i) => `<stop offset="${i / 2}" stop-color="${c}"/>`).join("")}</linearGradient></defs><rect width="600" height="336" fill="url(#sky)"/>${up.join("")}`) + svg("Max", `<defs><pattern id="dots" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="4" cy="4" r="1.7" fill="#000" opacity=".12"/></pattern></defs>${down.join("")}<rect width="600" height="336" fill="url(#dots)"/>`),
    front: scene(where, o).front,
  };
}


// --- drawing, pictograms --------------------------------------------------------
const SIGN = { hot: "#E8663C", sunny: "#E08A2E", partlycloudy: "#3E93B8", cloudy: "#5E7F93", fog: "#7F8E98", rain: "#3D5A80", storm: "#4A3F73", snow: "#3F7FC4", wind: "#3F8391", frost: "#5873AE", night: "#232B52" };
function signColor({ kind, night }, o) {
  if (night) return SIGN.night;
  if (o.level === "hot" && kind !== "rain" && kind !== "storm") return SIGN.hot;
  if ((o.level === "frost" || o.level === "arctic") && (kind === "sunny" || kind === "partlycloudy" || kind === "cloudy")) return SIGN.frost;
  return SIGN[kind];
}
const channels = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
// A colour that can be told from the background (and is not white, which is the person).
function apart(hex, bg) {
  const far = (c) => Math.hypot(...channels(c).map((v, i) => v - channels(bg)[i]));
  let c = hex;
  if (Math.min(...channels(c)) > 215) c = "#CFD6DC";
  if (far(c) < 95) {
    const pale = "#" + channels(hex).map((v) => Math.round(v + (255 - v) * 0.45).toString(16).padStart(2, "0")).join("");
    c = [pale, shade(hex, 0.45), "#F2C14E"].find((x) => far(x) >= 95) || "#F2C14E";
  }
  return c;
}
const WX = {
  sun: `<circle r="11" fill="#fff"/>${line("M0 -19v-6M0 19v6M19 0h6M-19 0h-6M13.5 -13.5l4 -4M-13.5 -13.5l-4 -4M13.5 13.5l4 4M-13.5 13.5l-4 4", 4, "#fff")}`,
  part: `<circle cx="9" cy="-7" r="10" fill="#fff" opacity=".7"/><path d="M-20 16 a11 11 0 0 1 2 -21 a15 15 0 0 1 28 2 a10 10 0 0 1 6 19Z" fill="#fff"/>`,
  cloud: `<path d="M-20 12 a12 12 0 0 1 2 -23 a16 16 0 0 1 30 2 a11 11 0 0 1 6 21Z" fill="#fff"/>`,
  fog: line("M-20 -12h40M-14 0h34M-20 12h30", 5, "#fff"),
  rain: `<path d="M-20 4 a11 11 0 0 1 2 -21 a15 15 0 0 1 28 2 a10 10 0 0 1 6 19Z" fill="#fff"/>${line("M-11 12l-4 10M1 12l-4 10M13 12l-4 10", 4, "#fff")}`,
  storm: `<path d="M-20 4 a11 11 0 0 1 2 -21 a15 15 0 0 1 28 2 a10 10 0 0 1 6 19Z" fill="#fff"/><path d="M4 7 l-9 12 h7 l-4 10 l13 -15 h-7 l5 -7z" fill="#FFD54F"/>`,
  snow: line("M0 -20V20M-17 -10L17 10M17 -10L-17 10M-5 -16l5 5 5 -5M-5 16l5 -5 5 5", 4, "#fff"),
  wind: line("M-22 -8h30q9 0 9 -8q0 -7 -8 -7M-22 4h40M-22 16h26q8 0 8 7q0 6 -6 6", 4.5, "#fff"),
  moon: `<path d="M6 -20a20 20 0 1 0 14 28a17 17 0 0 1 -14 -28z" fill="#fff"/>`,
};
function signScene(where, o) {
  const { kind, night } = where, bg = signColor(where, o);
  const wx = night && (kind === "sunny" || kind === "partlycloudy") ? "moon" : { sunny: "sun", partlycloudy: "part", cloudy: "cloud", fog: "fog", rain: "rain", storm: "storm", snow: "snow", wind: "wind" }[kind];
  return { back: `<svg class="back" aria-hidden="true"><rect width="100%" height="100%" fill="${bg}"/></svg><svg class="wx WXNAMED" viewBox="-32 -32 64 64" aria-hidden="true">${WX[wx]}</svg>`, front: "", bg };
}

// Black on white, or white on black in a dark theme.
function monoScene(where, o, dark) {
  const s = signScene(where, o), bg = dark ? "#000000" : "#ffffff", ink = dark ? "#eeeeee" : "#111111";
  return { back: s.back.replace(/#fff(?![0-9a-f])|#FFD54F/g, ink).replace(s.bg, bg), front: "", bg, ink };
}

// A white person as on a sign, with the clothes in colour; with "ink" everything has that
// colour and gaps show where the clothes end.
function signFigure(o, bg, ink) {
  const a = ink || apart(o.topC, bg), b = ink || apart(o.accent, bg), hair = ink || shade(bg, 0.5), W = ink || "#fff", inner = ink ? bg : W, s = [];
  const gap = (d, w = 4) => ink && s.push(line(d, w, bg)), edge = ink ? ` stroke="${bg}" stroke-width="4"` : "";
  const k = { child: 0.74, teen: 0.9, adult: 1, senior: 0.96 }[o.age] || 1;
  const coat = o.top === "rain", parka = o.top === "winter", low = coat ? 214 : parka ? 196 : 178;
  if (o.legs === "shorts") {
    s.push(line("M86 180 V262 M114 180 V262", 22, W), line("M86 180 V206 M114 180 V206", 28, b));
    gap("M66 224 H134");
    gap("M100 198 V224", 3);
  }
  else s.push(line("M86 180 V262 M114 180 V262", o.legs === "snow" ? 28 : 24, o.legs === "snow" ? b : W));
  if (o.legs === "snow") s.push(line("M100 204 V262", 5, bg));
  if (o.legs === "skirt") s.push(`<path d="M76 168 H124 L142 226 Q100 238 58 226Z" fill="${W}" stroke="${bg}" stroke-width="5" stroke-linejoin="round"/>`);
  if (o.feet === "rain" || o.feet === "winter") gap("M86 238 V264 M114 238 V264", 36);
  if (o.feet === "rain" || o.feet === "winter") s.push(line("M86 238 V264 M114 238 V264", 28, b), line("M78 270 H92 M108 270 H122", 18, b), o.feet === "winter" ? line(`M74 ${ink ? 240 : 230} H98 M102 ${ink ? 240 : 230} H126`, ink ? 5 : 7, inner) : "");
  else s.push(o.feet === "sandals" ? line("M74 272 H94 M106 272 H126", 9, b) : line("M78 268 H92 M108 268 H122", 16, b));
  if (o.feet !== "rain" && o.feet !== "winter") gap(o.feet === "sandals" ? "M66 265 H134" : "M66 258 H134", 3.5);
  gap("M100 226 V280", 3);
  const right = o.umbrella ? "M128 104 L150 136 L160 112" : "M130 106 L146 170", sleeves = o.top !== "tshirt";
  for (const [d, x, y] of [["M70 106 L54 170", 54, 172], [right, ...(o.umbrella ? [160, 110] : [146, 172])]]) {
    s.push(line(d, 21, sleeves ? a : W));
    if (o.gloves) s.push(`<circle cx="${x}" cy="${y}" r="13" fill="${b}" stroke="${bg}" stroke-width="4"/>`);
    else if (sleeves) s.push(`<circle cx="${x}" cy="${y}" r="${ink ? 12 : 10.5}" fill="${W}"${edge}/>`);
  }
  if (!sleeves) gap(o.umbrella ? "M50 136 L80 144" : "M50 136 L80 144 M150 136 L120 144", 6);
  if (!sleeves) s.push(line("M71 106 L65 126", 25, a), line(o.umbrella ? "M129 106 L139 120" : "M129 106 L135 126", 25, a));
  const fl = coat ? 12 : 2;
  s.push(`<path d="M72 92 Q100 84 128 92 Q136 96 134 112 L${130 + fl} ${low - 6} Q${130 + fl} ${low} ${124 + fl} ${low} H${76 - fl} Q${70 - fl} ${low} ${70 - fl} ${low - 6} L66 112 Q64 96 72 92Z" fill="${a}" stroke="${bg}" stroke-width="4" stroke-linejoin="round"/>`);
  if (parka) s.push(line("M70 122 H130 M69 148 H131 M69 173 H131 M100 92 V192", 4, bg));
  if (coat) s.push(line("M100 92 V210", 4, bg), [112, 138, 164].map((y) => `<circle cx="112" cy="${y}" r="4.5" fill="${bg}"/>`).join(""));
  if (o.top === "wind") s.push(line("M100 90 V176 M80 152 l10 7 M120 152 l-10 7", 4, bg));
  if (o.top === "sweater") s.push(line("M72 130 l9 -8 l9 8 l10 -8 l10 8 l9 -8 l9 8", 5, inner), line("M76 170 H124", 4, bg));
  // head and hair
  const covered = o.hat || o.hood === "up" || o.fur || o.cover;
  if (!covered && (o.cut === "afro" || o.cut === "curly")) s.push(`<circle cx="100" cy="48" r="${o.cut === "afro" ? 39 : 34}" fill="${hair}" stroke="${bg}" stroke-width="4"/>`);
  if (!o.cover && !(o.hood === "up" || o.fur) && (o.cut === "pigtails" || o.cut === "braids")) s.push(`<path d="M74 50 Q52 44 ${o.cut === "braids" ? "50 112 Q62 108 74 64" : "48 80 Q66 78 76 64"}Z M126 50 Q148 44 ${o.cut === "braids" ? "150 112 Q138 108 126 64" : "152 80 Q134 78 124 64"}Z" fill="${hair}" stroke="${bg}" stroke-width="3"/>`);
  if (!o.cover && !(o.hood === "up" || o.fur) && (o.cut === "long" || o.cut === "bob")) {
    const y = o.cut === "long" ? 108 : 88;
    s.push(`<path d="M66 ${y} Q58 27 100 25 Q142 27 134 ${y} Q124 ${y + 5} 118 ${y} L118 60 H82 V${y} Q76 ${y + 5} 66 ${y}Z" fill="${hair}" stroke="${bg}" stroke-width="3" stroke-linejoin="round"/>`);
  }
  if (!covered && o.cut === "ponytail") s.push(`<path d="M120 40 Q160 40 148 92 Q134 82 120 62Z" fill="${hair}" stroke="${bg}" stroke-width="3"/>`);
  if (!covered && o.cut === "bun") s.push(`<circle cx="100" cy="24" r="11" fill="${hair}" stroke="${bg}" stroke-width="4"/>`);
  if (o.hood === "up" || o.fur) s.push(`<path d="M100 16 C62 16 60 54 64 76 Q80 98 100 98 Q120 98 136 76 C140 54 138 16 100 16Z" fill="${a}" stroke="${bg}" stroke-width="4"/>${o.fur ? `<circle cx="100" cy="58" r="27" fill="none" stroke="${inner}" stroke-width="5" stroke-dasharray="5 4"/>` : ""}`);
  if (o.cover === "headscarf") s.push(`<path d="M100 22 C64 22 62 58 66 80 Q80 104 100 104 Q120 104 134 80 C138 58 136 22 100 22Z" fill="${b}" stroke="${bg}" stroke-width="4"/>`);
  const small = o.hood === "up" || o.fur || o.cover === "headscarf";
  s.push(`<circle cx="100" cy="${small ? 58 : 56}" r="${small ? 20 : 26}" fill="${W}"${small ? edge : ` stroke="${bg}" stroke-width="4"`}/>`);
  if (!covered) {
    const crown = { short: "M71 54 Q66 22 100 22 Q134 22 129 54 Q124 40 112 37 Q100 44 84 38 Q76 42 71 54Z", buzz: "M74 47 Q76 27 100 27 Q124 27 126 47 Q114 36 100 36 Q86 36 74 47Z", receding: "M72 60 Q66 40 80 34 Q80 46 78 62Z M128 60 Q134 40 120 34 Q120 46 122 62Z", ponytail: "M72 52 Q70 24 100 24 Q130 24 128 52 Q116 36 100 36 Q84 36 72 52Z" };
    crown.bun = crown.pigtails = crown.braids = crown.ponytail;
    if (crown[o.cut]) s.push(`<path d="${crown[o.cut]}" fill="${hair}"${ink ? ` stroke="${bg}" stroke-width="3.4" stroke-linejoin="round"` : ""}/>`);
  }
  if (o.cover === "turban") s.push(`<path d="M68 56 Q62 18 100 18 Q138 18 132 56 Q100 32 68 56Z" fill="${b}"${edge}/>${line("M72 52 Q100 22 124 28 M128 52 Q100 24 78 30", 3.4, bg)}`);
  if (o.hat === "beanie") s.push(`<path d="M70 48 Q68 18 100 18 Q132 18 130 48Z" fill="${b}"/><rect x="66" y="42" width="68" height="14" rx="7" fill="${W}" stroke="${bg}" stroke-width="3"/><circle cx="100" cy="15" r="9" fill="${W}" stroke="${bg}" stroke-width="3"/>`);
  if (o.hat === "sun") s.push(`<path d="M40 44 Q100 24 160 44 Q160 54 148 53 Q100 40 52 53 Q40 54 40 44Z" fill="${b}" stroke="${bg}" stroke-width="3"/><path d="M72 38 Q74 12 100 12 Q126 12 128 38 Q100 30 72 38Z" fill="${b}"/>`);
  if (o.hat === "cap") s.push(`<path d="M70 48 Q68 22 100 22 Q132 22 130 48Z" fill="${b}"${edge}/>${ink ? line("M62 50 H108", 15, bg) : ""}${line("M62 50 H108", 8, b)}`);
  if (o.shades) s.push(`<path d="M76 56 H97 Q97 69 87 69 Q76 69 76 56Z M103 56 H124 Q124 69 113 69 Q103 69 103 56Z" fill="${bg}"/>${line("M95 59 h10", 4, bg)}`);
  else if (o.goggles) s.push(`<rect x="76" y="55" width="48" height="19" rx="9" fill="${b}" stroke="${bg}" stroke-width="4"/>`);
  else if (o.glasses) s.push(`<g fill="none" stroke="${bg}" stroke-width="3.4"><circle cx="90" cy="60" r="7.5"/><circle cx="110" cy="60" r="7.5"/><path d="M97.5 59h5"/></g>`);
  if (o.veil) s.push(`<path d="M${small ? 81 : 75} 64 Q100 70 ${small ? 119 : 125} 64 Q118 82 100 ${small ? 79 : 83} Q82 82 ${small ? 81 : 75} 64Z" fill="${b}"${edge}/>`);
  if (o.scarf) {
    gap("M78 92 Q100 102 122 92", 23);
    gap(o.wind ? "M80 94 Q52 82 30 98" : "M114 98 V136", 22);
  }
  if (o.scarf) s.push(line("M78 92 Q100 102 122 92", 15, b), o.wind ? line("M80 94 Q52 82 30 98", 14, b) : line("M114 98 V136", 14, b));
  if (o.age === "senior" && !o.umbrella) gap("M150 172 V270", 13);
  if (o.age === "senior" && !o.umbrella) s.push(line("M150 172 V270 M150 172 Q150 160 160 160", 6, W));
  if (o.umbrella) s.push(line("M160 130 V6", 5, W), `<path d="M74 26 Q84 -42 160 -42 Q236 -42 246 26 Q232 14 217 26 Q203 12 189 26 Q174 12 160 26 Q146 12 132 26 Q117 12 103 26 Q88 14 74 26Z" fill="${b}" stroke="${bg}" stroke-width="3" stroke-linejoin="round" transform="translate(48 0) scale(.7 .9)"/>`);
  return `<g transform="translate(100 276) scale(${k}) translate(-100 -276)">${s.join("")}</g>`;
}

// Only the clothes, as symbols of 48 x 48; "BG" is the background.
const SYMBOL = {
  tshirt: `<path d="M15 8 L5 15 L10 23 L14 21 V41 H34 V21 L38 23 L43 15 L33 8 Q24 15 15 8Z" fill="C"/>`,
  sweater: `<path d="M15 7 L6 13 L3 38 H10 L13 23 V42 H35 V23 L38 38 H45 L42 13 L33 7 Q24 13 15 7Z" fill="C"/>${line("M14 28 l4 -3 4 3 4 -3 4 3 4 -3", 2.2, "BG")}`,
  wind: `<path d="M15 6 L6 12 L3 38 H10 L13 23 V42 H35 V23 L38 38 H45 L42 12 L33 6 L24 14Z" fill="C"/>${line("M24 15V41M16 33l4 3M32 33l-4 3", 2.4, "BG")}`,
  rain: `<path d="M15 5 L6 11 L3 34 H10 L13 22 L10 45 H38 L35 22 L38 34 H45 L42 11 L33 5 L24 13Z" fill="C"/>${line("M24 14V44", 2.4, "BG")}<circle cx="29" cy="21" r="1.8" fill="BG"/><circle cx="29" cy="30" r="1.8" fill="BG"/>`,
  winter: `<path d="M15 8 L7 12 L3 37 H11 L13 26 V44 H35 V26 L37 37 H45 L41 12 L33 8Z" fill="C"/><path d="M13 9 Q24 -1 35 9 Q36 15 31 15 Q24 8 17 15 Q12 15 13 9Z" fill="C" stroke="BG" stroke-width="2"/>${line("M24 14V43M13 25H35M13 34H35", 2.2, "BG")}`,
  shorts: `<path d="M11 10 H37 L41 36 H27 L24 22 L21 36 H7Z" fill="C"/>`,
  skirt: `<path d="M15 9 H33 L43 39 Q24 45 5 39Z" fill="C"/>${line("M18 14L14 38M24 14V40M30 14L34 38", 1.8, "BG")}`,
  trousers: `<path d="M14 5 H34 L38 44 H27 L24 18 L21 44 H10Z" fill="C"/>`,
  snow: `<path d="M14 17 H34 L39 45 H26 L24 28 L22 45 H9Z" fill="C"/><path d="M16 8 H32 V19 H16Z" fill="C"/>${line("M17 9L14 2M31 9L34 2", 3.4, "C")}${line("M14 19H34", 2, "BG")}`,
  sandals: `${line("M6 36 H42", 6, "C")}${line("M12 33 Q20 16 28 33 M24 25 Q34 22 40 32", 4, "C")}`,
  boots: `<path d="M14 5 H28 V27 Q42 29 43 41 H14Z" fill="C"/>${line("M15 37H42", 2.4, "BG")}`,
  winterboots: `<path d="M14 8 H28 V27 Q42 29 43 41 H14Z" fill="C"/><rect x="11" y="4" width="20" height="8" rx="4" fill="C" stroke="BG" stroke-width="2"/>${line("M15 37H42M19 20h6M19 26h7", 2.2, "BG")}`,
  umbrella: `<path d="M4 25 Q7 5 24 5 Q41 5 44 25 Q39 20 34 25 Q29 20 24 25 Q19 20 14 25 Q9 20 4 25Z" fill="C"/>${line("M24 24V38q0 5 5 5q4 0 4 -4", 3.6, "C")}`,
  hood: `<path d="M24 3 C12 3 9 14 11 24 L4 44 H44 L37 24 C39 14 36 3 24 3Z" fill="C"/><circle cx="24" cy="18" r="8.5" fill="BG"/><circle cx="24" cy="18" r="6" fill="#fff"/>${line("M24 29V43", 2.2, "BG")}`,
  scarf: `<path d="M9 10 Q24 20 39 10 L41 20 Q24 30 7 20Z M27 23 L36 21 L39 43 H28Z" fill="C"/>`,
  beanie: `<path d="M8 29 Q6 11 24 11 Q42 11 40 29Z" fill="C"/><rect x="5" y="30" width="38" height="10" rx="5" fill="C"/><circle cx="24" cy="7" r="5" fill="C"/>`,
  gloves: `<path d="M14 5 Q22 1 26 8 V21 L33 15 Q40 15 38 22 L30 34 V44 H13Z" fill="C"/>${line("M13 37H30", 2.2, "BG")}`,
  goggles: `<rect x="5" y="15" width="38" height="20" rx="9" fill="C"/><path d="M11 20 H37 Q38 30 30 30 Q26 30 24 27 Q22 30 18 30 Q10 30 11 20Z" fill="BG"/>${line("M15 23l5 0", 2, "#fff")}`,
  hat: `<path d="M3 34 Q24 24 45 34 Q44 41 24 39 Q4 41 3 34Z M12 30 Q13 11 24 11 Q35 11 36 30 Q24 25 12 30Z" fill="C"/>`,
  shades: `<path d="M4 18 H22 Q22 34 13 34 Q4 34 4 18Z M26 18 H44 Q44 34 35 34 Q26 34 26 18Z" fill="C"/>${line("M21 20h6", 4, "C")}`,
};
// the clothes that matter first
function symbolsOf(o, d) {
  const list = [o.top];
  if (d.umbrella) list.push("umbrella");
  if (d.hood === "up" || d.fur || (o.hood && !d.umbrella && !d.cover)) list.push("hood");
  if (o.legs === "snow") list.push("snow");
  if (o.feet === "rain") list.push("boots");
  if (o.feet === "winter") list.push("winterboots");
  if (d.hat === "beanie") list.push("beanie");
  if (o.gloves) list.push("gloves");
  if (o.scarf) list.push("scarf");
  if (d.goggles) list.push("goggles");
  if (d.hat === "sun") list.push("hat");
  if (o.glasses) list.push("shades");
  if (d.legs !== "snow") list.push(d.legs);
  if (o.feet === "sandals") list.push("sandals");
  return [...new Set(list)].slice(0, 4);
}
function symbolFigure(o, d, bg) {
  const list = symbolsOf(o, d), top = apart(d.topC, bg), accent = apart(d.accent, bg);
  const at = { 1: [[26, 26]], 2: [[0, 26], [52, 26]], 3: [[26, 0], [0, 52], [52, 52]], 4: [[0, 0], [52, 0], [0, 52], [52, 52]] }[list.length];
  const color = (n) => (["umbrella", "scarf", "beanie", "gloves", "hat", "goggles"].includes(n) ? accent : n === o.top || n === "hood" ? top : "#fff");
  return list.map((n, i) => `<g transform="translate(${at[i][0]} ${at[i][1]})">${SYMBOL[n].replaceAll('"C"', `"${color(n)}"`).replaceAll('"BG"', `"${bg}"`)}</g>`).join("");
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
.tips .sm { display: none; }
.p { position: relative; z-index: 2; min-width: 0; min-height: 0; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; }
.p svg { width: 100%; min-height: 0; flex: 1 1 0; overflow: visible; display: block; }
.n { flex: none; background: rgba(18, 28, 40, .5); color: #fff; border-radius: 10px; padding: 1px 10px; font-size: 13px; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; box-sizing: border-box; }
.bare { grid-template-columns: 1fr; }
.bare .info { display: none; }
.comic .w, .comic .tips, .comic .n { background: rgba(15, 12, 25, .72); font-style: italic; }
.comic .t, .comic .tips b { font-weight: 800; }
.wx { position: absolute; z-index: 1; top: 8px; right: 10px; width: 46px; height: 46px; }
.pictogram .w, .pictogram .tips, .pictogram .n, .symbols .w, .symbols .tips, .symbols .n { background: none; backdrop-filter: none; -webkit-backdrop-filter: none; }
.lite .w, .lite .tips, .lite .n { color: #111; }
.symbols .p svg { padding: 6% 0; box-sizing: border-box; }
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
  .n { position: absolute; z-index: 4; top: 2px; right: 2px; max-width: calc(100% - 46px); font-size: 11px; padding: 1px 7px; }
  .tips { position: absolute; z-index: 4; left: 6px; right: 6px; bottom: 5px; padding: 2px 8px; border-radius: 10px; text-align: center; }
  .tips b { font-size: 12px; line-height: 1.5; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .wx { width: 26px; height: 26px; top: 6px; right: 7px; }
  .wx.named { top: 23px; }
  .wx.pictogram { top: 33px; right: auto; left: 9px; }
  .wx.pictogram.alone { top: 6px; }
  .pictogram.titled .p { top: 22px; }
  .symbols .p { top: 32px; }
  .symbols .n { top: -27px; }
  .pictogram.titled .n { top: -18px; }
  .tips div, .tips .lg { display: none; }
  .tips .sm { display: block; }
}
@container (max-width: 125px) {
  .wx.pictogram { top: 4px; right: 5px; left: auto; width: 24px; height: 24px; }
  .wx.pictogram.named { top: 25px; right: auto; left: 7px; width: 20px; height: 20px; }
  .pictogram .p { top: 26px; }
  .pictogram.titled .p { top: 46px; }
  .pictogram.titled .n { top: -42px; }
}
@container (min-width: 760px) {
  .t { font-size: 48px; } .s, .tips { font-size: 17px; } .tips b { font-size: 20px; } .n { font-size: 16px; }
}
.eyes { transform-box: fill-box; transform-origin: center; animation: blink 5.5s infinite; }
.wave { transform-box: fill-box; transform-origin: right center; animation: wave 1.1s ease-in-out infinite alternate; }
.breath { animation: breath 3.4s ease-out infinite; }
.drift { animation: drift 16s ease-in-out infinite alternate; }
.slow { animation-duration: 24s; }
.fog { filter: blur(11px); }
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
  _hours(state, now, demo) {
    const a = state.attributes;
    const units = { temperature: a.temperature_unit, wind: a.wind_speed_unit, precipitation: a.precipitation_unit };
    const list = [hourOf({ ...a, condition: state.state, precipitation: null }, units)];
    if (demo) {
      for (const [i, temperature] of (Array.isArray(demo.later) ? demo.later : []).slice(0, this._config.hours).entries())
        list.push(hourOf({ ...a, temperature, condition: demo.later_condition || state.state, datetime: new Date(now.getTime() + (i + 1) * 3600000) }, units));
      return list;
    }
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
    const real = hass.states[config.entity];
    if (!real) return this._message("missing");
    const demo = config.demo && typeof config.demo === "object" ? config.demo : null;
    const state = demo
      ? { ...real, state: String(demo.condition || "cloudy"), attributes: { temperature: num(demo.temperature), wind_speed: num(demo.wind_speed) === null ? 5 : num(demo.wind_speed), humidity: num(demo.humidity), uv_index: num(demo.uv_index), temperature_unit: "°C", wind_speed_unit: "km/h", precipitation_unit: "mm" } }
      : real;
    if (state.state === "unavailable" || state.state === "unknown") return this._message("unavailable");
    const now = new Date();
    const hours = this._hours(state, now, demo);
    const o = recommend(hours, num(config.feels) || 0);
    if (!o) return this._message("unavailable");
    const unit = state.attributes.temperature_unit || "°C";
    const deg = (c) => (c === null ? "–" : `${Math.round(fromC(c, unit))}°`);
    const clock = (d) => (d ? d.toLocaleTimeString((hass.locale && hass.locale.language) || undefined, { hour: "2-digit", minute: "2-digit" }) : "");
    const tip = (x) => esc(text(hass, x.key).replace("{t}", x.value === undefined ? "" : deg(x.value)).replace("{h}", clock(x.time)));
    const h = hours[0];
    const temps = hours.map((x) => x.temperature).filter((x) => x !== null);
    const sun = hass.states["sun.sun"];
    const style = STYLES.includes(config.style) ? config.style : "friendly";
    const dark = !!(hass.themes && hass.themes.darkMode);
    const s = { friendly: scene, comic: comicScene, pictogram: signScene, mono: monoScene, symbols: signScene }[style](sceneOf(state.state, demo ? demo.night === true : !!sun && sun.state === "below_horizon"), o, dark);
    const condition = hass.formatEntityState ? hass.formatEntityState(state) : state.state;
    const wind = num(state.attributes.wind_speed);
    const details = [
      temps.length > 1 ? `${deg(Math.min(...temps))} / ${deg(Math.max(...temps))}` : "",
      wind !== null ? `${Math.round(wind)} ${state.attributes.wind_speed_unit || "km/h"}` : "",
    ].filter(Boolean);
    const feels = h.feels !== null && h.temperature !== null && Math.abs(h.feels - h.temperature) >= 2 ? `<div class="s">${esc(text(hass, "feels"))} ${deg(h.feels)}</div>` : "";
    // the one word a small card has room for
    const urgent = ["storm", "snow", "raincoat", "umbrella", "rain_later"].find((k) => o.tips.some((x) => x.key === k) && (k !== "umbrella" || o.umbrella));
    const brief = urgent || o.level;
    const tips = o.tips.map((x, i) => (i ? `<div>${tip(x)}</div>` : `<b class="lg">${tip(x)}</b><b class="sm">${esc(text(hass, `s_${brief}`))}</b>`)).join("");
    const label = [config.name, ...o.tips.map(tip)].filter(Boolean).map((x, i) => (i || !config.name ? x : esc(x))).join(". ");
    const weather = config.show_weather === false ? "<div></div>" : `<div class="w"><div class="t">${deg(h.temperature)}</div><div><div class="s">${esc(condition)}</div>${feels}<div class="s">${esc(details.join(" · "))}</div></div></div>`;
    const advice = config.show_tips === false ? "" : `<div class="tips">${tips}</div>`;
    const bare = config.show_weather === false && config.show_tips === false;
    const dress = outfit(o, config);
    const [box, art] = {
      friendly: () => [dress.umbrella ? "10 -66 200 358" : "10 -44 200 336", figure(dress)],
      comic: () => [dress.umbrella ? "6 -44 190 400" : "6 -18 190 374", comicFigure(dress)],
      pictogram: () => [dress.umbrella ? "14 -44 190 326" : "14 0 190 282", signFigure(dress, s.bg)],
      mono: () => [dress.umbrella ? "14 -44 190 326" : "14 0 190 282", signFigure(dress, s.bg, s.ink)],
      symbols: () => ["-4 -2 108 104", symbolFigure(o, dress, s.bg)],
    }[style]();
    const look = { friendly: "", mono: ` pictogram mono${dark ? "" : " lite"}` }[style] ?? ` ${style}`;
    this._paint(
      `${s.back.replace("WXNAMED", `${config.name ? "named" : ""}${look}${config.show_weather === false ? " alone" : ""}`)}<div class="in${look}${bare ? " bare" : ""}${config.name ? " titled" : ""}${advice ? " adv" : ""}"><div class="info">${weather}${advice}</div><div class="p"><svg viewBox="${box}" preserveAspectRatio="xMid${style === "symbols" ? "YMid" : "YMax"} meet" role="img" aria-label="${label}">${art}</svg>${config.name ? `<div class="n">${esc(config.name)}</div>` : ""}</div></div>${s.front}`
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
      pick("style", STYLES),
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

export { AGES, SIGN, monoScene, STYLES, SYMBOL, apart, signFigure, signScene, symbolFigure, symbolsOf, comicFigure, comicScene, BEARDS, COLORS, DEFAULTS, EYES, GENDERS, HAIR, HAIR_STYLES, HEADWEAR, SKIN, TEXT, VERSION, feelsLike, figure, hourOf, outfit, recommend, scene, sceneOf, toC, toKmh };
