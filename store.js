const KEY = 'fret-flow-v2';
const KINDS = new Set(['fretboard', 'chords', 'ear', 'fingerstyle']);
const MAX_COUNT = Number.MAX_SAFE_INTEGER;
const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const counter = value => typeof value === 'number' && Number.isFinite(value) ? Math.min(MAX_COUNT, Math.max(0, Math.floor(value))) : 0;
const increment = value => Math.min(MAX_COUNT, counter(value) + 1);
const dictionary = () => Object.create(null);
const defaultPreferences = () => ({ range: 5, strings: 'all', notes: 'natural' });
const defaultProfile = () => ({ displayName: 'เพื่อนนักกีตาร์', level: 'beginner', goal: 'fingerstyle', minutes: 15, onboarded: false, startedAt: localDay() });
const emptyLearning = () => ({ completedLessons: dictionary(), plans: dictionary() });
const emptyDay = () => ({ fretboard: 0, chords: 0, ear: 0, fingerstyle: 0, correct: 0, total: 0, seconds: 0 });
const fresh = () => ({ version: 2, seconds: 0, days: dictionary(), history: [], positions: dictionary(), preferences: defaultPreferences(), profile: defaultProfile(), learning: emptyLearning() });
const clone = value => JSON.parse(JSON.stringify(value));
const freeze = value => { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };
const validTimestamp = value => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 8640000000000000;

export const localDay = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

function validDayKey(key) {
  if (typeof key !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(key)) return false;
  const date = new Date(`${key}T12:00:00`);
  return Number.isFinite(date.getTime()) && localDay(date) === key;
}

function normalizeDay(value) {
  const day = emptyDay();
  for (const key of Object.keys(day)) day[key] = counter(value[key]);
  day.correct = Math.min(day.correct, day.total);
  return day;
}

function preferenceValue(key, value) {
  if (key === 'range') {
    const number = typeof value === 'number' || typeof value === 'string' ? Number(value) : NaN;
    return [3, 5, 12].includes(number) ? number : undefined;
  }
  if (key === 'strings') return ['all', '0', '1', '2', '3', '4', '5'].includes(value) ? value : undefined;
  if (key === 'notes') return ['natural', 'all'].includes(value) ? value : undefined;
  return undefined;
}

function positionKey(value) {
  if (typeof value === 'number' && Number.isFinite(value)) value = String(value);
  return typeof value === 'string' && value.length > 0 && value.length <= 80 && !['__proto__', 'prototype', 'constructor'].includes(value) ? value : null;
}

function lessonKey(value) {
  return typeof value === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,79}$/.test(value) && !['prototype', 'constructor'].includes(value) ? value : null;
}

function profileValue(key, value) {
  if (key === 'displayName' && typeof value === 'string') {
    const name = value.replace(/[\u0000-\u001f\u007f-\u009f]/g, '').trim().slice(0, 60);
    return name || undefined;
  }
  if (key === 'level') return ['beginner', 'intermediate', 'advanced'].includes(value) ? value : undefined;
  if (key === 'goal') return ['fingerstyle', 'notes', 'ear'].includes(value) ? value : undefined;
  if (key === 'minutes') {
    const number = typeof value === 'number' || typeof value === 'string' ? Number(value) : NaN;
    return [10, 15, 20, 30].includes(number) ? number : undefined;
  }
  if (key === 'onboarded') return typeof value === 'boolean' ? value : undefined;
  if (key === 'startedAt') return typeof value === 'string' && validDayKey(value) ? value : undefined;
  return undefined;
}

function planSelection(value) {
  return Array.isArray(value) ? [...new Set(value.filter(id => lessonKey(id) !== null))].slice(0, 2) : [];
}

function normalize(saved) {
  const result = fresh();
  if (!isObject(saved) || saved.version !== 2) return result;
  result.seconds = counter(saved.seconds);
  if (isObject(saved.days)) {
    for (const [key, value] of Object.entries(saved.days)) {
      if (validDayKey(key) && isObject(value)) result.days[key] = normalizeDay(value);
    }
  }
  if (Array.isArray(saved.history)) {
    result.history = saved.history.filter(item => isObject(item) && KINDS.has(item.kind) &&
      typeof item.at === 'number' && Number.isFinite(item.at) && item.at >= 0 && item.at <= 8640000000000000)
      .slice(0, 100).map(item => ({
        kind: item.kind,
        correct: item.correct === true,
        label: typeof item.label === 'string' ? item.label.slice(0, 100) : '',
        at: item.at,
      }));
  }
  if (isObject(saved.positions)) {
    for (const [key, value] of Object.entries(saved.positions)) {
      if (!positionKey(key) || !isObject(value)) continue;
      const total = counter(value.total);
      result.positions[key] = { correct: Math.min(counter(value.correct), total), total };
    }
  }
  if (isObject(saved.preferences)) {
    for (const key of Object.keys(result.preferences)) {
      const value = preferenceValue(key, saved.preferences[key]);
      if (value !== undefined) result.preferences[key] = value;
    }
  }
  if (isObject(saved.profile)) {
    for (const key of Object.keys(result.profile)) {
      const value = profileValue(key, saved.profile[key]);
      if (value !== undefined) result.profile[key] = value;
    }
  }
  if (isObject(saved.learning)) {
    if (isObject(saved.learning.completedLessons)) {
      for (const [id, at] of Object.entries(saved.learning.completedLessons)) {
        if (lessonKey(id) !== null && validTimestamp(at)) result.learning.completedLessons[id] = at;
      }
    }
    if (isObject(saved.learning.plans)) {
      for (const [day, selection] of Object.entries(saved.learning.plans)) {
        const ids = planSelection(selection);
        if (validDayKey(day) && ids.length) result.learning.plans[day] = ids;
      }
    }
  }
  return result;
}

const listeners = new Set();
let saveError = false;

function readSaved() {
  try { return normalize(JSON.parse(localStorage.getItem(KEY))); }
  catch { return fresh(); /* A blocked or corrupt store should never prevent practice. */ }
}

let data = readSaved();

function save() {
  const snapshot = clone(data);
  try {
    localStorage.setItem(KEY, JSON.stringify(snapshot));
    saveError = false;
  } catch { saveError = true; }
  if (listeners.size) {
    const event = freeze({ data: clone(snapshot) });
    for (const callback of [...listeners]) {
      try { callback(event); } catch { /* A sync observer must not interrupt practice. */ }
    }
  }
}

function currentDay() {
  const key = localDay();
  if (!own(data.days, key)) data.days[key] = emptyDay();
  return data.days[key];
}

const practiced = day => Boolean(day && (day.total || day.chords || day.fingerstyle));

export const store = {
  normalizeSnapshot: normalize,
  get data() { return data; },
  get saveError() { return saveError; },
  subscribe(callback) {
    if (typeof callback !== 'function') return () => {};
    listeners.add(callback);
    return () => { listeners.delete(callback); };
  },
  setProfile(partial) {
    if (!isObject(partial)) return false;
    let changed = false;
    for (const key of Object.keys(data.profile)) {
      if (!own(partial, key)) continue;
      const value = profileValue(key, partial[key]);
      if (value !== undefined && data.profile[key] !== value) { data.profile[key] = value; changed = true; }
    }
    if (changed) save();
    return changed;
  },
  completeLesson(id) {
    const key = lessonKey(id);
    if (key === null || own(data.learning.completedLessons, key)) return false;
    data.learning.completedLessons[key] = Date.now();
    save();
    return true;
  },
  getOrCreatePlan(day, selection) {
    if (!validDayKey(day)) return [];
    if (own(data.learning.plans, day)) return [...data.learning.plans[day]];
    const ids = planSelection(selection);
    if (ids.length) { data.learning.plans[day] = ids; save(); }
    return [...ids];
  },
  today() { return data.days[localDay()] || emptyDay(); },
  record(kind, correct, label, position) {
    if (!KINDS.has(kind)) return;
    const day = currentDay();
    day[kind] = increment(day[kind]);
    if (kind === 'fretboard' || kind === 'ear') {
      day.total = increment(day.total);
      if (correct) day.correct = Math.min(day.total, increment(day.correct));
    }
    data.history.unshift({ kind, correct: !!correct, label: String(label ?? '').slice(0, 100), at: Date.now() });
    data.history.length = Math.min(100, data.history.length);
    const key = positionKey(position);
    if (key !== null) {
      if (!own(data.positions, key)) data.positions[key] = { correct: 0, total: 0 };
      const result = data.positions[key];
      result.total = increment(result.total);
      if (correct) result.correct = Math.min(result.total, increment(result.correct));
    }
    save();
  },
  tick() {
    data.seconds = increment(data.seconds);
    const day = currentDay();
    day.seconds = increment(day.seconds);
    if (data.seconds % 10 === 0) save();
  },
  preference(key, value) {
    const valid = preferenceValue(key, value);
    if (valid === undefined) return;
    data.preferences[key] = valid;
    save();
  },
  totals() {
    return Object.values(data.days).reduce((total, day) => ({
      correct: Math.min(MAX_COUNT, total.correct + day.correct),
      total: Math.min(MAX_COUNT, total.total + day.total),
      sessions: Math.min(MAX_COUNT, total.sessions + day.fingerstyle),
    }), { correct: 0, total: 0, sessions: 0 });
  },
  streak() {
    let count = 0;
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    const lessonDays = new Set(Object.values(data.learning.completedLessons).map(at => localDay(new Date(at))));
    const active = key => practiced(data.days[key]) || lessonDays.has(key);
    if (!active(localDay(date))) date.setDate(date.getDate() - 1);
    for (let i = 0; i < 3660; i++) {
      if (!active(localDay(date))) break;
      count++;
      date.setDate(date.getDate() - 1);
    }
    return count;
  },
  flush: save,
};
