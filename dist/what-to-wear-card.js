/* what-to-wear-card
 *
 * A figure on the dashboard, dressed for the weather of the coming hours.
 * Reads any weather entity of Home Assistant, needs nothing else.
 *
 *   type: custom:what-to-wear-card
 *   entity: weather.home
 *   hours: 10                  # optional, how far to look ahead
 *   people:                    # optional, up to four
 *     - name: Mia
 *       hair: long             # short | long | curly | bun | bald
 *       hair_color: brown
 *       skin: light
 *       color: teal            # favourite colour of the clothes
 *       size: child            # child | adult
 *       feels: 0               # degrees; -3 feels the cold, 3 rarely does
 */
const VERSION = "0.1.0";

const SKIN = { light: "#F3C7A6", fair: "#FBDCC4", olive: "#DDA879", brown: "#B97A50", dark: "#7F4E31" };
const HAIR = { brown: "#7A4B2A", black: "#2E211C", blond: "#D9A94E", red: "#B5522B", grey: "#9AA0A6" };
const COLORS = {
  teal: "#26A69A", blue: "#2E86C1", red: "#C8383F", orange: "#E0874A", pink: "#DB5F85", purple: "#7E6BC4", green: "#3C8D5A", yellow: "#EDB92E",
};
const HAIR_STYLES = ["short", "long", "curly", "bun", "bald"];
const DEFAULT_PERSON = { name: "", hair: "short", hair_color: "brown", skin: "light", color: "teal", size: "child", feels: 0 };

const TEXT = {
  en: {
    no_entity: "Choose a weather entity", missing: "Weather entity not found", unavailable: "No weather data right now",
    now: "now", feels: "feels like",
    hot: "Light clothes", warm: "T-shirt weather", mild: "A sweater is enough", cool: "Put on a light jacket", cold: "Put on a warm jacket", frost: "Wrap up warm",
    umbrella: "Take an umbrella", raincoat: "Rain jacket instead of an umbrella, it is windy", snow: "Snow: boots and gloves", storm: "Thunderstorm: better stay inside",
    sun: "Sun hat and sunscreen", milder: "Milder later, up to {t}", colder: "Colder later, down to {t}: take a jacket", rain_later: "Rain from about {h}", ice: "Watch out for ice",
    person: "Person", add: "Add person", remove: "Remove", entity: "Weather", hours: "Hours ahead", name: "Name", hair: "Hair", hair_color: "Hair colour", skin: "Skin", color: "Colour", size: "Size", sense: "Feels the cold (−) or rarely (+)",
    short: "Short", long: "Long", curly: "Curly", bun: "Bun", bald: "Bald", brown: "Brown", black: "Black", blond: "Blond", red: "Red", grey: "Grey", light: "Light", fair: "Very light", olive: "Olive", dark: "Dark", teal: "Teal", blue: "Blue", orange: "Orange", pink: "Pink", purple: "Purple", green: "Green", yellow: "Yellow", child: "Child", adult: "Adult",
  },
  de: {
    no_entity: "Wähle eine Wetter-Entität", missing: "Wetter-Entität nicht gefunden", unavailable: "Zurzeit keine Wetterdaten",
    now: "jetzt", feels: "gefühlt",
    hot: "Luftig anziehen", warm: "T-Shirt-Wetter", mild: "Ein Pullover reicht", cool: "Leichte Jacke anziehen", cold: "Warme Jacke anziehen", frost: "Dick einpacken",
    umbrella: "Schirm mitnehmen", raincoat: "Regenjacke statt Schirm, es ist windig", snow: "Schnee: Stiefel und Handschuhe", storm: "Gewitter: besser drinnen bleiben",
    sun: "Sonnenhut und Sonnencreme", milder: "Später milder, bis {t}", colder: "Später kälter, bis {t}: Jacke mitnehmen", rain_later: "Regen ab etwa {h}", ice: "Achtung, Glätte",
    person: "Person", add: "Person hinzufügen", remove: "Entfernen", entity: "Wetter", hours: "Stunden voraus", name: "Name", hair: "Frisur", hair_color: "Haarfarbe", skin: "Hautton", color: "Farbe", size: "Grösse", sense: "Friert schnell (−) oder selten (+)",
    short: "Kurz", long: "Lang", curly: "Locken", bun: "Dutt", bald: "Glatze", brown: "Braun", black: "Schwarz", blond: "Blond", red: "Rot", grey: "Grau", light: "Hell", fair: "Sehr hell", olive: "Oliv", dark: "Dunkel", teal: "Türkis", blue: "Blau", orange: "Orange", pink: "Rosa", purple: "Violett", green: "Grün", yellow: "Gelb", child: "Kind", adult: "Erwachsen",
  },
  fr: {
    no_entity: "Choisissez une entité météo", missing: "Entité météo introuvable", unavailable: "Pas de données météo",
    now: "maintenant", feels: "ressenti",
    hot: "Vêtements légers", warm: "Un t-shirt suffit", mild: "Un pull suffit", cool: "Mettre une veste légère", cold: "Mettre une veste chaude", frost: "Bien se couvrir",
    umbrella: "Prendre un parapluie", raincoat: "Veste de pluie plutôt que parapluie, il y a du vent", snow: "Neige : bottes et gants", storm: "Orage : mieux vaut rester à l'intérieur",
    sun: "Chapeau et crème solaire", milder: "Plus doux ensuite, jusqu'à {t}", colder: "Plus froid ensuite, jusqu'à {t} : prendre une veste", rain_later: "Pluie vers {h}", ice: "Attention au verglas",
    person: "Personne", add: "Ajouter une personne", remove: "Supprimer", entity: "Météo", hours: "Heures à venir", name: "Nom", hair: "Coiffure", hair_color: "Couleur des cheveux", skin: "Peau", color: "Couleur", size: "Taille", sense: "Frileux (−) ou non (+)",
    short: "Courts", long: "Longs", curly: "Bouclés", bun: "Chignon", bald: "Chauve", brown: "Brun", black: "Noir", blond: "Blond", red: "Rouge", grey: "Gris", light: "Claire", fair: "Très claire", olive: "Mate", dark: "Foncée", teal: "Turquoise", blue: "Bleu", orange: "Orange", pink: "Rose", purple: "Violet", green: "Vert", yellow: "Jaune", child: "Enfant", adult: "Adulte",
  },
  it: {
    no_entity: "Scegli un'entità meteo", missing: "Entità meteo non trovata", unavailable: "Nessun dato meteo al momento",
    now: "ora", feels: "percepiti",
    hot: "Vestiti leggeri", warm: "Basta una maglietta", mild: "Basta un maglione", cool: "Mettere una giacca leggera", cold: "Mettere una giacca calda", frost: "Coprirsi bene",
    umbrella: "Prendere l'ombrello", raincoat: "Giacca da pioggia invece dell'ombrello, c'è vento", snow: "Neve: stivali e guanti", storm: "Temporale: meglio restare al chiuso",
    sun: "Cappello e crema solare", milder: "Più mite dopo, fino a {t}", colder: "Più freddo dopo, fino a {t}: prendere una giacca", rain_later: "Pioggia verso le {h}", ice: "Attenzione al ghiaccio",
    person: "Persona", add: "Aggiungi persona", remove: "Rimuovi", entity: "Meteo", hours: "Ore successive", name: "Nome", hair: "Capelli", hair_color: "Colore dei capelli", skin: "Pelle", color: "Colore", size: "Statura", sense: "Freddoloso (−) o no (+)",
    short: "Corti", long: "Lunghi", curly: "Ricci", bun: "Chignon", bald: "Calvo", brown: "Marrone", black: "Nero", blond: "Biondo", red: "Rosso", grey: "Grigio", light: "Chiara", fair: "Molto chiara", olive: "Olivastra", dark: "Scura", teal: "Turchese", blue: "Blu", orange: "Arancione", pink: "Rosa", purple: "Viola", green: "Verde", yellow: "Giallo", child: "Bambino", adult: "Adulto",
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

// One figure. o: { skin, hair, long, top, topC, legs, legsC, feet, feetC, hat, hatC, scarf, scarfC, gloves, glasses, umbrella, wind, mood }
function figure(o) {
  const s = [];
  const skinD = shade(o.skin, 0.88);
  const armL = "M74 138 Q58 158 56 184";
  const armR = o.umbrella ? "M126 138 Q148 152 150 132" : o.wave ? "M126 138 Q150 136 156 110" : "M126 138 Q142 158 144 184";
  const handR = o.umbrella ? [150, 130] : o.wave ? [156, 108] : [144, 186];
  s.push(`<ellipse cx="100" cy="282" rx="52" ry="7" fill="#000" opacity=".14"/>`);

  // hair behind the head
  if (o.long) {
    const sway = o.wind ? -16 : 0;
    s.push(`<path d="M62 70 C50 112 ${58 + sway} 140 ${64 + sway} 152 Q100 164 ${136 + sway} 152 C${142 + sway} 140 150 112 138 70 Z" fill="${shade(o.hair, 0.85)}"/>`);
  }
  if (o.bun && !o.hat && o.hood !== "up") s.push(`<circle cx="100" cy="24" r="15" fill="${shade(o.hair, 0.85)}"/>`);
  if (o.curly) s.push(`<g fill="${shade(o.hair, 0.85)}"><circle cx="60" cy="66" r="15"/><circle cx="140" cy="66" r="15"/><circle cx="58" cy="86" r="11"/><circle cx="142" cy="86" r="11"/></g>`);
  // hood behind
  if (o.hood === "down") s.push(`<path d="M66 124 Q100 100 134 124 Q132 140 100 140 Q68 140 66 124Z" fill="${shade(o.topC, 0.8)}"/>`);

  // legs
  const legL = "M88 206 L86 264", legR = "M112 206 L114 264";
  s.push(line(legL, 22, o.skin), line(legR, 22, o.skin));
  if (o.legs === "shorts") s.push(line("M87 202 L86 226", 30, o.legsC), line("M113 202 L114 226", 30, o.legsC));
  if (o.legs === "skirt") s.push(`<path d="M74 190 L126 190 L140 234 Q100 246 60 234 Z" fill="${o.legsC}"/><path d="M84 196 L78 236 M100 196 L100 240 M116 196 L122 236" stroke="${shade(o.legsC, 0.86)}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`);
  if (o.legs === "trousers") s.push(line("M88 202 L86 258", 27, o.legsC), line("M112 202 L114 258", 27, o.legsC), line("M100 212 L100 252", 2, shade(o.legsC, 0.75)));
  if (o.legs === "snow") s.push(line("M86 202 L84 256", 33, o.legsC), line("M114 202 L116 256", 33, o.legsC), line("M73 240 L96 240 M104 240 L127 240", 3, shade(o.legsC, 0.8)));

  // feet
  const shoe = (x, dir) => {
    const c = o.feetC, d = shade(c, 0.75);
    if (o.feet === "sandals") return `<path d="M${x - 15} 276 q0 -14 15 -14 q15 0 15 14z" fill="${o.skin}"/><rect x="${x - 17}" y="274" width="34" height="7" rx="3.5" fill="${d}"/><path d="M${x - 12} 270 Q${x} 258 ${x + 12} 270" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    if (o.feet === "sneakers") return `<path d="M${x - 16} 278 v-9 q0 -13 16 -13 q16 0 16 13 v9z" fill="${c}"/><rect x="${x - 17}" y="274" width="34" height="8" rx="4" fill="#fff"/><path d="M${x - 6} 264 h12 M${x - 6} 269 h12" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`;
    if (o.feet === "rain") return `<path d="M${x - 14} 236 h28 v34 q4 4 4 10 q0 2 -3 2 h-30 q-3 0 -3 -2 q0 -6 4 -10z" fill="${c}"/><rect x="${x - 16}" y="234" width="32" height="8" rx="4" fill="${shade(c, 1.15)}"/><rect x="${x - 18}" y="276" width="36" height="6" rx="3" fill="${d}"/><path d="M${x - 8} 248 v16" stroke="#fff" opacity=".5" stroke-width="3.5" stroke-linecap="round"/>`;
    return `<path d="M${x - 16} 250 h32 v20 q3 4 3 9 q0 3 -3 3 h-32 q-3 0 -3 -3 q0 -5 3 -9z" fill="${c}"/><rect x="${x - 19}" y="244" width="38" height="11" rx="5.5" fill="#fff"/><rect x="${x - 19}" y="276" width="38" height="6" rx="3" fill="${d}"/><path d="M${x - 7} 262 h14 M${x - 7} 268 h14" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>`;
  };
  s.push(shoe(84, -1), shoe(116, 1));

  // arms under sleeves
  const puffy = o.top === "winter" ? 27 : o.top === "rain" ? 24 : o.top === "sweater" || o.top === "wind" ? 22 : 18;
  const sleeve = shade(o.topC, 0.92);
  const hand = (x, y) => (o.gloves ? `<circle cx="${x}" cy="${y}" r="12" fill="${o.gloves}"/>` : `<circle cx="${x}" cy="${y}" r="9.5" fill="${o.skin}"/>`);
  if (o.umbrella) s.push(`<path d="M150 146 L150 10" stroke="#5b4636" stroke-width="4" stroke-linecap="round"/><path d="M150 146 q0 12 -9 12 q-7 0 -7 -7" stroke="#5b4636" stroke-width="4" fill="none" stroke-linecap="round"/>`);
  const arms = [];
  for (const [d, hx, hy] of [[armL, 56, 187], [armR, handR[0], handR[1]]]) {
    if (o.top === "tshirt") {
      arms.push(line(d, 18, o.skin), hand(hx, hy));
      arms.push(d === armL ? line("M76 136 Q68 146 64 156", 25, sleeve) : o.wave ? line("M124 136 Q136 138 144 130", 25, sleeve) : line("M124 136 Q132 146 136 156", 25, sleeve));
    } else {
      const s2 = d === armL ? "M74 138 Q61 154 58 169" : o.umbrella ? "M126 138 Q146 152 149 144" : o.wave ? "M126 138 Q147 138 153 122" : "M126 138 Q139 154 142 169";
      const [cx, cy] = d === armL ? [57, 190] : o.umbrella ? [150, 124] : o.wave ? [157, 100] : [143, 190];
      arms.push(hand(cx, cy), line(s2, puffy, sleeve));
    }
  }
  // torso
  const w = o.top === "winter" ? 9 : o.top === "rain" ? 6 : o.top === "sweater" || o.top === "wind" ? 3 : 0;
  const low = o.top === "winter" ? 216 : o.top === "rain" ? 222 : 200;
  const flare = o.top === "rain" ? 8 : 0;
  s.push(`<path d="M${74 - w} 138 Q${76 - w} 122 100 120 Q${124 + w} 122 ${126 + w} 138 L${127 + w + flare} ${low - 8} Q${127 + w + flare} ${low} ${119 + w + flare} ${low} L${81 - w - flare} ${low} Q${73 - w - flare} ${low} ${73 - w - flare} ${low - 8} Z" fill="${o.topC}"/>`);
  const dk = shade(o.topC, 0.82), lt = shade(o.topC, 1.14);
  if (o.top === "tshirt") s.push(o.print === "sun" ? `<circle cx="100" cy="164" r="11" fill="#FFD54F"/><path d="M100 146v-4M100 186v-4M82 164h-4M122 164h-4M87 151l-3-3M116 180l-3-3M87 177l-3 3M116 148l-3 3" stroke="#FFD54F" stroke-width="3.4" stroke-linecap="round"/>` : `<path d="M75 156 H125 M75 172 H125 M75 188 H125" stroke="#fff" opacity=".85" stroke-width="5"/>`);
  if (o.top === "sweater") s.push(`<path d="M72 172 H128" stroke="${lt}" stroke-width="9"/><path d="M74 172 l6 -4 l6 8 l6 -8 l6 8 l6 -8 l6 8 l6 -8 l6 8 l5 -5" stroke="#fff" opacity=".8" stroke-width="2.4" fill="none" stroke-linejoin="round"/><path d="M76 194 H124" stroke="${dk}" stroke-width="6" stroke-linecap="round"/>`);
  if (o.top === "wind") s.push(`<path d="M100 122 V199" stroke="#fff" stroke-width="3"/><path d="M71 160 Q100 168 129 160 L129 174 Q100 182 71 174Z" fill="#fff" opacity=".85"/><path d="M82 188 l8 6 M118 188 l-8 6" stroke="${dk}" stroke-width="3.4" stroke-linecap="round"/><path d="M100 122 V199" stroke="${dk}" stroke-width="2"/>`);
  if (o.top === "rain") s.push(`<path d="M100 124 V220" stroke="${dk}" stroke-width="2.6"/>${[144, 166, 188].map((y) => `<rect x="93" y="${y}" width="14" height="6" rx="3" fill="${dk}"/>`).join("")}<path d="M76 192 h14 v12 h-14z M110 192 h14 v12 h-14z" fill="${dk}" opacity=".55"/>`);
  if (o.top === "winter") s.push(`<path d="M66 152 Q100 160 134 152 M64 174 Q100 182 136 174 M64 195 Q100 203 136 195" stroke="${dk}" stroke-width="3.4" fill="none"/><path d="M100 124 V214" stroke="${lt}" stroke-width="4"/><rect x="97" y="134" width="6" height="11" rx="3" fill="#fff"/>`);
  s.push(...arms);

  // neck, head
  if (o.scarf) s.push(`<path d="M74 122 Q100 138 126 122 L128 134 Q100 152 72 134Z" fill="${o.scarf}"/>`);
  s.push(`<rect x="91" y="104" width="18" height="18" fill="${skinD}" opacity="${o.scarf ? 0 : 1}"/>`);
  if (o.hood === "up") s.push(`<path d="M100 22 C62 22 54 60 56 88 C58 116 78 126 100 126 C122 126 142 116 144 88 C146 60 138 22 100 22Z" fill="${o.topC}"/><path d="M100 22 C62 22 54 60 56 88" stroke="${lt}" stroke-width="3" fill="none"/>`);
  s.push(`<circle cx="62" cy="80" r="8" fill="${skinD}"/><circle cx="138" cy="80" r="8" fill="${skinD}"/>`);
  if (o.hood === "up") s.push(`<circle cx="62" cy="80" r="9" fill="${o.topC}"/><circle cx="138" cy="80" r="9" fill="${o.topC}"/>`);
  s.push(`<path d="M100 38 C124 38 138 54 138 78 C138 102 122 116 100 116 C78 116 62 102 62 78 C62 54 76 38 100 38Z" fill="${o.skin}"/>`);
  // hair front
  if (o.long) s.push(`<path d="M62 80 C58 44 80 32 100 32 C122 32 142 44 138 80 C134 64 124 56 112 54 C98 66 76 62 62 80Z" fill="${o.hair}"/>`);
  else if (o.bald) s.push("");
  else if (o.curly) s.push(`<g fill="${o.hair}"><circle cx="70" cy="52" r="14"/><circle cx="86" cy="40" r="15"/><circle cx="106" cy="38" r="16"/><circle cx="125" cy="46" r="14"/><circle cx="135" cy="60" r="10"/><circle cx="64" cy="66" r="9"/></g>`);
  else if (o.bun) s.push(`<path d="M62 76 C56 44 78 30 100 30 C122 30 144 44 138 76 C130 56 116 48 100 48 C84 48 70 56 62 76Z" fill="${o.hair}"/>`);
  else s.push(`<path d="M62 74 C56 44 78 28 104 30 C130 30 144 50 138 76 C134 66 130 62 126 58 C112 64 92 62 84 54 C74 58 66 64 62 74Z" fill="${o.hair}"/>${o.hat || o.hood === "up" ? "" : o.wind ? `<path d="M84 34 Q66 26 60 34 Q72 34 80 42Z" fill="${o.hair}"/>` : `<path d="M98 31 Q100 18 112 20 Q106 26 110 33Z" fill="${o.hair}"/>`}`);
  // face
  if (o.glasses) s.push(`<path d="M72 78 h22 q2 16 -11 16 q-13 0 -11 -16z M106 78 h22 q2 16 -11 16 q-13 0 -11 -16z" fill="#263238"/><path d="M93 81 q7 -5 14 0 M72 80 l-9 -3 M128 80 l9 -3" stroke="#263238" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M77 82 l5 6 M111 82 l5 6" stroke="#fff" opacity=".55" stroke-width="2.6" stroke-linecap="round"/>`);
  else s.push(`<g class="eyes"><ellipse cx="84" cy="82" rx="4.6" ry="6" fill="#2b2320"/><ellipse cx="116" cy="82" rx="4.6" ry="6" fill="#2b2320"/><circle cx="85.6" cy="79.6" r="1.7" fill="#fff"/><circle cx="117.6" cy="79.6" r="1.7" fill="#fff"/></g>${line("M78 70 q6 -4 11 -1", 2.6, shade(o.hair, 0.8))}${line("M111 69 q6 -3 11 1", 2.6, shade(o.hair, 0.8))}`);
  s.push(`<circle cx="74" cy="95" r="6.5" fill="#f0635f" opacity="${o.mood === "cold" ? 0.55 : 0.28}"/><circle cx="126" cy="95" r="6.5" fill="#f0635f" opacity="${o.mood === "cold" ? 0.55 : 0.28}"/>`);
  s.push(o.mood === "cold" ? line("M91 102 q4.5 -4 9 0 q4.5 4 9 0", 2.8, "#7a3b36") : o.mood === "open" ? `<path d="M88 97 Q100 99 112 97 Q110 111 100 111 Q90 111 88 97Z" fill="#7a2f2c"/><path d="M93 107 Q100 102 107 107 Q104 111 100 111 Q96 111 93 107Z" fill="#f0817c"/>` : line("M90 99 Q100 108 110 99", 2.8, "#7a3b36"));
  if (o.mood === "cold") s.push(`<g class="breath" fill="#fff" opacity=".85"><circle cx="150" cy="104" r="6"/><circle cx="160" cy="99" r="8"/><circle cx="171" cy="102" r="6"/></g>`);

  // hats
  if (o.hat === "beanie") s.push(`<path d="M60 62 C60 28 80 18 100 18 C120 18 140 28 140 62 Z" fill="${o.hatC}"/><path d="M74 30 V56 M87 22 V56 M100 20 V56 M113 22 V56 M126 30 V56" stroke="${shade(o.hatC, 0.86)}" stroke-width="3" stroke-linecap="round"/><rect x="56" y="50" width="88" height="17" rx="8.5" fill="${shade(o.hatC, 1.16)}"/><circle cx="100" cy="13" r="11" fill="#fff"/><circle cx="96" cy="10" r="3" fill="#e6ecf0"/>`);
  if (o.hat === "sun") s.push(`<path d="M34 56 Q100 34 166 56 Q168 64 156 65 Q100 50 44 65 Q32 64 34 56Z" fill="${o.hatC}"/><path d="M66 50 Q68 16 100 16 Q132 16 134 50 Q100 40 66 50Z" fill="${shade(o.hatC, 1.06)}"/><path d="M66 50 Q100 38 134 50 L133 41 Q100 30 67 41Z" fill="#E8604C"/>`);
  if (o.hat === "cap") s.push(`<path d="M61 58 C61 30 80 22 100 22 C122 22 139 32 139 58 Q100 46 61 58Z" fill="${o.hatC}"/><path d="M64 56 Q40 56 32 66 Q46 70 78 58Z" fill="${shade(o.hatC, 0.8)}"/><circle cx="100" cy="23" r="4" fill="${shade(o.hatC, 0.8)}"/>`);
  // scarf front
  if (o.scarf) {
    const sd = shade(o.scarf, 0.82);
    s.push(`<path d="M70 118 Q100 134 130 118 Q134 128 128 134 Q100 150 72 134 Q66 128 70 118Z" fill="${o.scarf}"/>`);
    s.push(o.wind ? `<g class="wave"><path d="M76 130 C52 120 40 138 16 124 C14 132 14 136 18 142 C42 152 56 138 78 142Z" fill="${sd}"/><path d="M30 130 l-2 13 M44 130 l0 14" stroke="#fff" opacity=".75" stroke-width="4"/></g>` : `<path d="M112 134 L122 132 L128 178 L112 180Z" fill="${sd}"/><path d="M114 152 l11 -1 M115 164 l12 -1" stroke="#fff" opacity=".75" stroke-width="4"/>`);
  }
  // umbrella canopy
  if (o.umbrella) {
    const u = o.umbrella, ud = shade(u, 0.82);
    s.push(`<path d="M44 34 C50 -22 160 -34 204 20 C206 26 204 32 200 36 Q188 26 172 34 Q156 22 138 34 Q120 22 98 36 Q80 24 60 38 Q52 34 44 34Z" fill="${u}"/><path d="M98 36 C100 4 116 -12 128 -14 C140 -10 140 14 138 34 Q120 22 98 36Z M172 34 C172 10 152 -8 128 -14 C170 -16 196 4 200 36 Q188 26 172 34Z" fill="${ud}" opacity=".6"/><circle cx="128" cy="-16" r="4" fill="#5b4636"/>`);
  }
  return s.join("");
}

// The clothes of `recommend` in the colours of a person, as `figure` takes them.
function outfit(o, person) {
  const c = COLORS[person.color] || COLORS.teal;
  const accent = { teal: "#F2B134", blue: "#E0874A", red: "#2F7FB8", orange: "#2A9D8F", pink: "#58B4AE", purple: "#EDB92E", green: "#D98E3F", yellow: "#C8383F" }[person.color] || "#F2B134";
  const hair = HAIR_STYLES.includes(person.hair) ? person.hair : "short";
  const legs = { shorts: "#3F6FB5", trousers: "#3D5A80", snow: "#34465F" }[o.legs];
  const feet = { sandals: "#8E5B3A", sneakers: accent, rain: accent, winter: "#5A4334" }[o.feet];
  return {
    skin: SKIN[person.skin] || SKIN.light,
    hair: HAIR[person.hair_color] || HAIR.brown,
    long: hair === "long", curly: hair === "curly", bun: hair === "bun", bald: hair === "bald",
    top: o.top, topC: c, print: o.level === "hot" ? "sun" : "stripes",
    legs: o.legs, legsC: legs, feet: o.feet, feetC: feet,
    hat: o.beanie ? "beanie" : o.sunhat ? "sun" : null, hatC: o.beanie ? accent : "#F2D59A",
    hood: o.top === "rain" ? (o.hood ? "up" : "down") : null,
    scarf: o.scarf ? accent : null, gloves: o.gloves ? accent : null,
    glasses: o.glasses, umbrella: o.umbrella ? accent : null, wind: o.wind,
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
ha-card { display: block; position: relative; overflow: hidden; height: 100%; min-height: 220px; container-type: inline-size; isolation: isolate; }
.back, .front { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; }
.front { z-index: 3; pointer-events: none; }
.in { position: relative; display: grid; grid-template-rows: minmax(0, 1fr); grid-template-columns: minmax(150px, 38%) 1fr; height: 100%; min-height: 220px; box-sizing: border-box; padding: 14px; gap: 8px; cursor: pointer; }
.info { display: flex; flex-direction: column; justify-content: space-between; gap: 10px; min-width: 0; position: relative; z-index: 4; }
.w, .tips { background: rgba(18, 28, 40, .5); color: #fff; border-radius: 14px; padding: 10px 12px; backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }
.w { align-self: flex-start; max-width: 100%; box-sizing: border-box; }
.t { font-size: 34px; line-height: 1.05; font-weight: 600; white-space: nowrap; }
.s { font-size: 14px; line-height: 1.35; opacity: .95; }
.tips { font-size: 14px; line-height: 1.35; }
.tips b { display: block; font-size: 16px; }
.people { position: relative; z-index: 2; display: flex; align-items: flex-end; justify-content: space-evenly; min-width: 0; min-height: 0; }
.p { flex: 0 1 260px; min-width: 0; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; }
.p svg { width: 100%; max-height: 100%; min-height: 0; flex: 0 1 auto; overflow: visible; display: block; }
.p.child svg { width: 80%; max-height: 82%; }
.n { flex: none; background: rgba(18, 28, 40, .5); color: #fff; border-radius: 10px; padding: 1px 10px; font-size: 13px; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; box-sizing: border-box; }
.msg { padding: 24px 16px; color: var(--secondary-text-color); }
@container (max-width: 480px) {
  .in { grid-template-columns: 46% 1fr; padding: 10px; }
  .t { font-size: 30px; } .s, .tips { font-size: 13px; } .tips b { font-size: 15px; }
  .in.many { grid-template-columns: 1fr; grid-template-rows: auto minmax(0, 1fr) auto; }
  .many .info { display: contents; }
  .many .w { position: relative; z-index: 4; grid-row: 1; display: flex; align-items: center; gap: 12px; padding: 6px 12px; }
  .many .people { grid-row: 2; }
  .many .tips { position: relative; z-index: 4; grid-row: 3; padding: 6px 12px; }
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
    return { entity: entity || "", people: [{ ...DEFAULT_PERSON }] };
  }

  setConfig(config) {
    if (!config) throw new Error("Invalid configuration");
    if (config.entity && !String(config.entity).startsWith("weather.")) throw new Error("entity must be a weather entity");
    const people = (Array.isArray(config.people) && config.people.length ? config.people : [{}]).slice(0, 4);
    const hours = num(config.hours);
    this._config = { ...config, hours: hours === null ? 10 : Math.min(24, Math.max(1, hours)), people: people.map((p) => ({ ...DEFAULT_PERSON, ...(p || {}) })) };
    this._shown = null;
    this._forecast = null;
    this._unsubscribe();
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
    return 5;
  }

  getGridOptions() {
    return { columns: 12, rows: 5, min_columns: 4, min_rows: 4 };
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
    const persons = config.people.map((p) => ({ p, o: recommend(hours, num(p.feels) || 0) }));
    if (!persons[0].o) return this._message("unavailable");
    const unit = state.attributes.temperature_unit || "°C";
    const deg = (c) => (c === null ? "–" : `${Math.round(fromC(c, unit))}°`);
    const clock = (d) => (d ? d.toLocaleTimeString((hass.locale && hass.locale.language) || undefined, { hour: "2-digit", minute: "2-digit" }) : "");
    const tip = (x) => esc(text(hass, x.key).replace("{t}", x.value === undefined ? "" : deg(x.value)).replace("{h}", clock(x.time)));
    const h = hours[0];
    const temps = hours.map((x) => x.temperature).filter((x) => x !== null);
    const sun = hass.states["sun.sun"];
    const s = scene(sceneOf(state.state, !!sun && sun.state === "below_horizon"), persons[0].o);
    const condition = hass.formatEntityState ? hass.formatEntityState(state) : state.state;
    const wind = num(state.attributes.wind_speed);
    const details = [
      temps.length > 1 ? `${deg(Math.min(...temps))} / ${deg(Math.max(...temps))}` : "",
      wind !== null ? `${Math.round(wind)} ${state.attributes.wind_speed_unit || "km/h"}` : "",
    ].filter(Boolean);
    const feels = h.feels !== null && h.temperature !== null && Math.abs(h.feels - h.temperature) >= 2 ? `<div class="s">${esc(text(hass, "feels"))} ${deg(h.feels)}</div>` : "";
    const tips = persons[0].o.tips.map((x, i) => (i ? `<div>${tip(x)}</div>` : `<b>${tip(x)}</b>`)).join("");
    const label = persons[0].o.tips.map(tip).join(". ");
    this._paint(
      `${s.back}<div class="in${persons.length > 2 ? " many" : ""}"><div class="info"><div class="w"><div class="t">${deg(h.temperature)}</div><div><div class="s">${esc(condition)}</div>${feels}<div class="s">${esc(details.join(" · "))}</div></div></div><div class="tips">${tips}</div></div><div class="people">${persons
        .map(({ p, o }) => `<div class="p ${p.size === "adult" ? "adult" : "child"}"><svg viewBox="14 -30 196 320" role="img" aria-label="${esc(p.name)} ${label}">${figure(outfit(o, p))}</svg>${p.name ? `<div class="n">${esc(p.name)}</div>` : ""}</div>`)
        .join("")}</div></div>${s.front}`
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

  _send(config) {
    this._config = config;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
    this._render();
  }

  _form(data, schema, changed) {
    const form = document.createElement("ha-form");
    form.computeLabel = (s) => text(this._hass, s.name === "feels" ? "sense" : s.name);
    form.addEventListener("value-changed", (ev) => {
      ev.stopPropagation();
      changed(ev.detail.value);
    });
    form.schema = schema;
    form.data = data;
    form.hass = this._hass;
    return form;
  }

  _render() {
    if (!this._hass || !this._config) return;
    const people = Array.isArray(this._config.people) && this._config.people.length ? this._config.people : [{}];
    // typing must not lose the focus: rebuild only when the number of people changes
    if (this._forms && this._count === people.length) {
      this._forms[0].data = { hours: 10, ...this._config };
      this._forms.forEach((f, i) => {
        f.hass = this._hass;
        if (i) f.data = { ...DEFAULT_PERSON, ...people[i - 1] };
      });
      return;
    }
    this._count = people.length;
    const pick = (name, list) => ({ name, selector: { select: { mode: "dropdown", options: list.map((value) => ({ value, label: text(this._hass, value) })) } } });
    const person = [
      { name: "name", selector: { text: {} } },
      { type: "grid", name: "", schema: [pick("hair", HAIR_STYLES), pick("hair_color", Object.keys(HAIR)), pick("skin", Object.keys(SKIN)), pick("color", Object.keys(COLORS)), pick("size", ["child", "adult"])] },
      { name: "feels", selector: { number: { min: -5, max: 5, step: 1, mode: "slider", unit_of_measurement: "°C" } } },
    ];
    this.replaceChildren();
    const first = this._form({ hours: 10, ...this._config }, [
      { name: "entity", required: true, selector: { entity: { domain: "weather" } } },
      { name: "hours", selector: { number: { min: 1, max: 24, step: 1, mode: "slider" } } },
    ], (value) => this._send({ ...this._config, ...value }));
    this.append(first);
    this._forms = [first];
    people.forEach((p, i) => {
      const head = document.createElement("div");
      head.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin:18px 0 6px;font-weight:500";
      const title = document.createElement("span");
      title.textContent = `${text(this._hass, "person")} ${i + 1}`;
      head.append(title);
      if (people.length > 1) head.append(this._button("remove", () => this._send({ ...this._config, people: this._people().filter((_, k) => k !== i) })));
      const form = this._form({ ...DEFAULT_PERSON, ...p }, person, (value) => {
        const next = this._people();
        next[i] = value;
        this._send({ ...this._config, people: next });
      });
      this.append(head, form);
      this._forms.push(form);
    });
    if (people.length < 4) {
      const add = this._button("add", () => {
        const colors = Object.keys(COLORS), next = this._people();
        this._send({ ...this._config, people: [...next, { ...DEFAULT_PERSON, color: colors[(next.length * 3) % colors.length] }] });
      });
      add.style.marginTop = "16px";
      this.append(add);
    }
  }

  _people() {
    return Array.isArray(this._config.people) && this._config.people.length ? [...this._config.people] : [{ ...DEFAULT_PERSON }];
  }

  _button(key, handler) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = text(this._hass, key);
    b.style.cssText = "border:1px solid var(--divider-color);border-radius:16px;padding:6px 14px;background:none;color:var(--primary-color);cursor:pointer;font:inherit";
    b.addEventListener("click", handler);
    return b;
  }
}

if (!customElements.get("what-to-wear-card")) {
  customElements.define("what-to-wear-card", WhatToWearCard);
  customElements.define("what-to-wear-card-editor", WhatToWearCardEditor);
  window.customCards = window.customCards || [];
  window.customCards.push({ type: "what-to-wear-card", name: "What to Wear", description: "A figure dressed for the weather of the coming hours", preview: true });
  console.info(`what-to-wear-card ${VERSION}`);
}

export { COLORS, HAIR, HAIR_STYLES, SKIN, TEXT, VERSION, feelsLike, figure, hourOf, outfit, recommend, scene, sceneOf, toC, toKmh };
