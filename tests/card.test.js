import assert from "node:assert/strict";
import { test } from "node:test";

globalThis.HTMLElement = class {};
globalThis.window = globalThis;
globalThis.customElements = { get: () => undefined, define: () => {} };
globalThis.console.info = () => {};
const c = await import("../dist/what-to-wear-card.js");

const U = { temperature: "°C", wind: "km/h", precipitation: "mm" };
const h = (condition, temperature, extra = {}) => c.hourOf({ condition, temperature, wind_speed: 5, ...extra }, U);
const keys = (o) => o.tips.map((t) => t.key);

test("units", () => {
  assert.equal(c.toC(50, "°F"), 10);
  assert.equal(c.toKmh(10, "m/s"), 36);
  const f = c.hourOf({ condition: "sunny", temperature: 86, wind_speed: 3, humidity: 30 }, { temperature: "°F", wind: "mph" });
  assert.equal(Math.round(f.temperature), 30);
});

test("what the air feels like", () => {
  assert.ok(Math.abs(c.feelsLike(-10, 30, null) - -19.5) < 0.6);
  assert.equal(c.feelsLike(18, 40, 50), 18);
  assert.ok(c.feelsLike(33, 5, 70) > 40);
  assert.equal(c.feelsLike(null, 5, 70), null);
  assert.equal(h("sunny", 5, { apparent_temperature: 1 }).feels, 1);
});

test("every step of the thermometer", () => {
  for (const [t, level, top] of [[31, "hot", "tshirt"], [21, "warm", "tshirt"], [17, "mild", "sweater"], [11, "cool", "wind"], [5, "cold", "winter"], [-6, "frost", "winter"]]) {
    const o = c.recommend([h("cloudy", t)]);
    assert.deepEqual([o.level, o.top], [level, top]);
  }
  const frost = c.recommend([h("cloudy", -6)]);
  assert.ok(frost.beanie && frost.gloves && frost.scarf && frost.feet === "winter");
});

test("someone who feels the cold dresses warmer", () => {
  assert.equal(c.recommend([h("cloudy", 15)]).top, "sweater");
  assert.equal(c.recommend([h("cloudy", 15)], -3).top, "wind");
});

test("rain, with and without wind", () => {
  const calm = c.recommend([h("rainy", 12)]);
  assert.ok(calm.umbrella && calm.top === "rain" && calm.feet === "rain" && keys(calm).includes("umbrella"));
  const wild = c.recommend([h("pouring", 12, { wind_speed: 45 })]);
  assert.ok(!wild.umbrella && wild.hood && keys(wild).includes("raincoat"));
  const later = c.recommend([h("cloudy", 18), ...Array.from({ length: 5 }, () => h("cloudy", 18)), h("rainy", 17, { datetime: "2026-11-24T15:00:00Z" })]);
  assert.ok(!later.umbrella && keys(later).includes("rain_later"));
  assert.ok(!h("cloudy", 12, { precipitation: 1, precipitation_probability: 10 }).wet);
});

test("snow beats the sun hat", () => {
  const o = c.recommend([h("sunny", 2, { uv_index: 7 }), h("snowy", 0)]);
  assert.ok(o.legs === "snow" && o.gloves && !o.sunhat && !o.glasses && keys(o)[0] === "snow");
});

test("the day changes", () => {
  const warmer = c.recommend([2, 2, 3, 5, 9, 13, 16].map((t) => h("sunny", t)));
  assert.ok(keys(warmer).includes("milder"));
  const colder = c.recommend([22, 22, 21, 20, 18, 14, 11].map((t) => h("sunny", t)));
  assert.ok(keys(colder).includes("colder"));
});

test("sun, storm, no data", () => {
  const o = c.recommend([h("sunny", 30, { uv_index: 8 })]);
  assert.ok(o.sunhat && o.glasses && keys(o).includes("sun"));
  assert.ok(!c.recommend([h("clear-night", 30)]).glasses);
  assert.equal(keys(c.recommend([h("lightning", 24)]))[0], "storm");
  assert.equal(c.recommend([h("sunny", null)]), null);
  assert.ok(c.recommend([h("exceptional", "12")]).top);
});

test("everything can be drawn", () => {
  const conditions = ["sunny", "clear-night", "partlycloudy", "cloudy", "fog", "rainy", "pouring", "hail", "lightning", "lightning-rainy", "snowy", "snowy-rainy", "windy", "windy-variant", "exceptional", "new"];
  const bad = /undefined|NaN|null|<b>|Infinity/;
  for (const condition of conditions)
    for (const t of [-15, 0, 4, 9, 15, 21, 33]) {
      const o = c.recommend([h(condition, t, { wind_speed: t < 0 ? 50 : 5 })]);
      for (const night of [true, false]) assert.ok(!bad.test(c.scene(c.sceneOf(condition, night), o).back));
      for (const age of [...c.AGES, "x"])
        for (const gender of c.GENDERS)
          for (const hair of [...c.HAIR_STYLES, "x"])
            for (const headwear of c.HEADWEAR) assert.ok(!bad.test(c.figure(c.outfit(o, { age, gender, hair, headwear, skin: "<b>", color: "none", bottom: gender === "female" ? "skirt" : "trousers" }))), `${condition} ${t} ${age} ${hair}`);
    }
  const o = c.recommend([h("cloudy", 18)]);
  for (const beard of c.BEARDS) for (const skin of Object.keys(c.SKIN)) assert.ok(!bad.test(c.figure(c.outfit(o, { beard, skin, glasses: true, freckles: true, earrings: true }))));
  for (const map of [c.SKIN, c.HAIR, c.EYES, c.COLORS]) for (const v of Object.values(map)) assert.match(v, /^#[0-9A-F]{6}$/);
});

test("bitter cold, snow and thunderstorms look different", () => {
  const arctic = c.recommend([h("sunny", -14)]), storm = c.recommend([h("lightning-rainy", 24)]), snow = c.recommend([h("snowy", -2)]);
  assert.equal(arctic.level, "arctic");
  assert.ok(c.outfit(arctic, {}).veil && c.outfit(arctic, {}).fur);
  assert.ok(!storm.umbrella && storm.hood && storm.top === "rain" && !keys(storm).includes("umbrella"));
  assert.ok(c.outfit(snow, {}).goggles);
  assert.ok(c.recommend([h("cloudy", 13)], -4).scarf && !c.recommend([h("cloudy", 13)]).scarf);
  for (const level of ["hot", "warm", "mild", "cool", "cold", "frost", "arctic"]) for (const tx of Object.values(c.TEXT)) assert.ok(tx[level] && tx[`s_${level}`]);
});

test("rain with wind always means a hood", () => {
  for (const t of [2, 6, 12, 23, 28]) {
    const o = c.recommend([h("pouring", t, { wind_speed: 50 })]), d = c.outfit(o, {});
    assert.ok(!d.umbrella && d.hood === "up" && d.hat === null, String(t));
  }
  assert.equal(c.outfit(c.recommend([h("pouring", 12, { wind_speed: 50 })]), { headwear: "headscarf" }).hood, "down");
});

test("everything can be drawn as a comic", () => {
  const bad = /undefined|NaN|null|<b>|Infinity/;
  const conditions = ["sunny", "clear-night", "partlycloudy", "cloudy", "fog", "rainy", "pouring", "lightning-rainy", "snowy", "windy", "new"];
  for (const condition of conditions)
    for (const t of [-15, -4, 4, 9, 15, 21, 33])
      for (const wind_speed of [5, 50]) {
        const o = c.recommend([h(condition, t, { wind_speed })]);
        for (const night of [true, false]) {
          const s = c.comicScene(c.sceneOf(condition, night), o);
          assert.ok(!bad.test(s.back + s.front), condition);
        }
        for (const age of [...c.AGES, "x"])
          for (const gender of c.GENDERS)
            for (const hair of [...c.HAIR_STYLES, "x"])
              for (const headwear of c.HEADWEAR) {
                const svg = c.comicFigure(c.outfit(o, { age, gender, hair, headwear, skin: "<b>", color: "none", bottom: gender === "female" ? "skirt" : "trousers" }));
                assert.ok(!bad.test(svg), `${condition} ${t} ${age} ${hair}`);
                assert.equal((svg.match(/<g[ >]/g) || []).length, (svg.match(/<\/g>/g) || []).length);
              }
      }
  const o = c.outfit(c.recommend([h("cloudy", 18)]), { beard: "full", glasses: true, freckles: true, earrings: true });
  assert.equal(c.comicFigure(o), c.comicFigure(o)); // the same picture, so the card does not redraw
});

test("everything can be drawn as a pictogram", () => {
  const bad = /undefined|NaN|null|<b>|Infinity|"C"|"BG"/;
  for (const condition of ["sunny", "clear-night", "partlycloudy", "cloudy", "fog", "rainy", "pouring", "lightning-rainy", "snowy", "windy", "new"])
    for (const t of [-15, -4, 4, 9, 15, 21, 33])
      for (const wind_speed of [5, 50])
        for (const night of [true, false]) {
          const o = c.recommend([h(condition, t, { wind_speed })]), s = c.signScene(c.sceneOf(condition, night), o);
          assert.match(s.bg, /^#[0-9A-Fa-f]{6}$/);
          assert.ok(!bad.test(s.back));
          for (const age of c.AGES) for (const hair of c.HAIR_STYLES) for (const headwear of c.HEADWEAR) {
            const d = c.outfit(o, { age, hair, headwear, color: "white", accent_color: "none", bottom: "skirt" });
            assert.ok(!bad.test(c.signFigure(d, s.bg) + c.symbolFigure(o, d, s.bg)), `${condition} ${t} ${hair}`);
            const list = c.symbolsOf(o, d);
            assert.ok(list.length >= 2 && list.length <= 4 && list.every((n) => c.SYMBOL[n]), list.join());
          }
        }
});

test("black and white has two colours only", () => {
  for (const dark of [true, false])
    for (const condition of ["sunny", "partlycloudy", "rainy", "lightning-rainy", "snowy", "windy", "fog", "clear-night"])
      for (const t of [-15, -4, 4, 9, 15, 21, 33])
        for (const wind_speed of [5, 50]) {
          const o = c.recommend([h(condition, t, { wind_speed })]), s = c.monoScene(c.sceneOf(condition, false), o, dark);
          for (const age of c.AGES) for (const hair of c.HAIR_STYLES) for (const headwear of c.HEADWEAR) {
            const svg = s.back + c.signFigure(c.outfit(o, { age, hair, headwear, glasses: true, bottom: "skirt" }), s.bg, s.ink);
            assert.ok(!/undefined|NaN|null|false/.test(svg));
            assert.deepEqual([...new Set(svg.match(/#[0-9a-fA-F]{3,6}/g))].sort(), [s.bg, s.ink].sort());
          }
        }
});

test("colours stand out from the sign", () => {
  const rgb = (x) => [1, 3, 5].map((i) => parseInt(x.slice(i, i + 2), 16));
  for (const bg of Object.values(c.SIGN)) for (const color of Object.values(c.COLORS)) assert.ok(Math.hypot(...rgb(c.apart(color, bg)).map((v, i) => v - rgb(bg)[i])) >= 90, `${bg} ${color}`);
});

test("choices", () => {
  const warm = c.recommend([h("cloudy", 24)]), cold = c.recommend([h("cloudy", -5)]);
  assert.equal(c.outfit(warm, { bottom: "skirt" }).legs, "skirt");
  assert.equal(c.outfit(cold, { bottom: "skirt" }).legs, "trousers");
  assert.equal(c.outfit(warm, { age: "child", beard: "full" }).beard, null);
  assert.equal(c.outfit(cold, { headwear: "turban" }).hat, null);
  assert.equal(c.outfit(cold, {}).hat, "beanie");
});

test("every choice has a name in every language", () => {
  for (const key of [...c.AGES, ...c.STYLES, ...c.BEARDS, ...c.GENDERS, ...c.HAIR_STYLES, ...c.HEADWEAR, ...Object.keys(c.SKIN), ...Object.keys(c.HAIR), ...Object.keys(c.EYES), ...Object.keys(c.COLORS)]) assert.ok(c.TEXT.en[key], key);
});

test("all languages have the same texts", () => {
  for (const [lang, t] of Object.entries(c.TEXT)) assert.deepEqual(Object.keys(t).sort(), Object.keys(c.TEXT.en).sort(), lang);
});
