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
  for (const condition of conditions)
    for (const t of [-15, 0, 4, 9, 15, 21, 33])
      for (const hair of [...c.HAIR_STYLES, "unknown"])
        for (const night of [true, false]) {
          const o = c.recommend([h(condition, t, { wind_speed: t < 0 ? 50 : 5 })]);
          const svg = c.figure(c.outfit(o, { hair, hair_color: "x", skin: "<b>", color: "none" })) + c.scene(c.sceneOf(condition, night), o).back;
          assert.ok(!/undefined|NaN|null|<b>/.test(svg), `${condition} ${t} ${hair}`);
        }
});

test("all languages have the same texts", () => {
  for (const [lang, t] of Object.entries(c.TEXT)) assert.deepEqual(Object.keys(t).sort(), Object.keys(c.TEXT.en).sort(), lang);
});
