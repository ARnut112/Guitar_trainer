import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../store.js', import.meta.url), 'utf8');
const moduleURL = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const NativeDate = Date;
const KEY = 'fret-flow-v2';
const TODAY = '2026-10-17';
const YESTERDAY = '2026-10-16';
const emptyDay = () => ({ fretboard: 0, chords: 0, ear: 0, fingerstyle: 0, correct: 0, total: 0, seconds: 0 });
const activity = (overrides = {}) => ({ ...emptyDay(), fretboard: 1, total: 1, ...overrides });
let importId = 0;

async function withStore(saved, run) {
  const originalDate = Object.getOwnPropertyDescriptor(globalThis, 'Date');
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  let now = new NativeDate(2026, 9, 17, 14, 0, 0).getTime();
  class Clock extends NativeDate {
    constructor(...args) { super(...(args.length ? args : [now])); }
    static now() { return now; }
  }
  const items = new Map(saved === undefined ? [] : [[KEY, typeof saved === 'string' ? saved : JSON.stringify(saved)]]);
  const storage = {
    writes: 0,
    blocked: false,
    getItem(key) { if (this.blocked) throw new Error('Storage blocked'); return items.get(key) ?? null; },
    setItem(key, value) { if (this.blocked) throw new Error('Storage blocked'); this.writes++; items.set(key, value); },
  };
  const reload = () => import(`${moduleURL}#store-test-${++importId}`);
  try {
    Object.defineProperty(globalThis, 'Date', { configurable: true, writable: true, value: Clock });
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage });
    const module = await reload();
    await run({ ...module, storage, reload, items, setDate: (year, month, day) => { now = new NativeDate(year, month - 1, day, 14).getTime(); } });
  } finally {
    Object.defineProperty(globalThis, 'Date', originalDate);
    if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage);
    else delete globalThis.localStorage;
  }
}

test('first visit has zero progress without inventing activity or writing storage', async () => {
  await withStore(undefined, ({ store, localDay, storage }) => {
    assert.equal(localDay(), TODAY);
    assert.deepEqual(store.today(), emptyDay());
    assert.deepEqual(store.totals(), { correct: 0, total: 0, sessions: 0 });
    assert.equal(store.data.seconds, 0);
    assert.equal(store.streak(), 0);
    assert.equal(store.saveError, false);
    assert.deepEqual(store.data.history, []);
    assert.deepEqual(Object.keys(store.data.days), []);
    assert.deepEqual(Object.keys(store.data.positions), []);
    assert.deepEqual(store.data.preferences, { range: 5, strings: 'all', notes: 'natural' });
    assert.equal(storage.writes, 0);
  });
});

test('correct and incorrect quizzes update daily accuracy and position recall; lessons remain separate', async () => {
  await withStore(undefined, ({ store }) => {
    store.record('fretboard', true, 'E2', '5-0');
    store.record('fretboard', false, 'F2', '5-0');
    store.record('ear', false, 'A3');
    store.record('chords', true, 'C major');
    store.record('fingerstyle', true, 'PIMA');
    assert.deepEqual(store.today(), { fretboard: 2, ear: 1, chords: 1, fingerstyle: 1, correct: 1, total: 3, seconds: 0 });
    assert.deepEqual(store.totals(), { correct: 1, total: 3, sessions: 1 });
    assert.deepEqual(store.data.positions['5-0'], { correct: 1, total: 2 });
    assert.equal(store.data.history[0].kind, 'fingerstyle');
    assert.equal(store.data.history[2].correct, false);
    assert.equal(store.streak(), 1);
    const before = JSON.stringify(store.data);
    store.record('unknown', true, 'Invalid lesson');
    assert.equal(JSON.stringify(store.data), before);
  });
});

test('progress, preferences, history and time survive a module reload', async () => {
  await withStore(undefined, async ({ store, reload, storage }) => {
    store.record('ear', true, 'A4');
    store.record('fretboard', false, 'C3', '4-3');
    store.preference('range', 12);
    store.preference('strings', '5');
    store.preference('notes', 'all');
    for (let i = 0; i < 11; i++) store.tick();
    store.flush();
    const reloaded = (await reload()).store;
    assert.deepEqual(reloaded.today(), store.today());
    assert.deepEqual(reloaded.totals(), { correct: 1, total: 2, sessions: 0 });
    assert.equal(reloaded.data.seconds, 11);
    assert.equal(reloaded.today().seconds, 11);
    assert.deepEqual(reloaded.data.preferences, { range: 12, strings: '5', notes: 'all' });
    assert.deepEqual(reloaded.data.history, store.data.history);
    assert.deepEqual(reloaded.data.positions['4-3'], { correct: 0, total: 1 });
    assert.ok(storage.writes > 0);
  });
});

test('time saves every ten seconds and rolls over into the correct local day', async () => {
  await withStore(undefined, ({ store, storage, setDate }) => {
    for (let i = 0; i < 9; i++) store.tick();
    assert.equal(storage.writes, 0);
    assert.equal(store.today().seconds, 9);
    assert.equal(store.streak(), 0);
    store.tick();
    assert.equal(storage.writes, 1);
    store.record('ear', true, 'C4');
    setDate(2026, 10, 18);
    assert.deepEqual(store.today(), emptyDay());
    store.tick();
    store.record('fretboard', true, 'E2');
    assert.equal(store.data.seconds, 11);
    assert.equal(store.data.days[TODAY].seconds, 10);
    assert.equal(store.today().seconds, 1);
    assert.equal(store.streak(), 2);
  });
});

test('streak counts consecutive days including today and stops at a missed day', async () => {
  await withStore({ version: 2, days: {
    [TODAY]: activity(), [YESTERDAY]: activity(), '2026-10-15': activity(), '2026-10-13': activity(),
  } }, ({ store }) => assert.equal(store.streak(), 3));
  await withStore({ version: 2, days: { [TODAY]: activity(), '2026-10-15': activity() } }, ({ store }) => assert.equal(store.streak(), 1));
});

test('streak keeps yesterday active before today is practiced, then expires after a missed day', async () => {
  await withStore({ version: 2, days: {
    [TODAY]: { seconds: 90 }, [YESTERDAY]: activity(), '2026-10-15': activity(),
  } }, ({ store, setDate }) => {
    assert.equal(store.streak(), 2);
    setDate(2026, 10, 18);
    assert.equal(store.streak(), 0);
  });
  await withStore({ version: 2, days: { [YESTERDAY]: { chords: 1 }, '2026-10-15': { fingerstyle: 1 } } }, ({ store }) => assert.equal(store.streak(), 2));
});

test('malformed day, history, position and preference entries are sanitized without losing valid progress', async () => {
  await withStore({
    version: 2,
    seconds: -30,
    days: {
      [TODAY]: { fretboard: -3, ear: 1.8, chords: 'bad', total: 3, correct: 99, seconds: -2 },
      [YESTERDAY]: null,
      '2026-10-15': [],
      '2026-10-14': 7,
      '2026-02-30': activity(),
      junk: activity(),
    },
    history: [null, 3, {}, { kind: 'wrong', at: 1 }, { kind: 'ear', at: 'not a date' },
      { kind: 'ear', at: 1720000000000, label: 'A'.repeat(200), correct: true },
      { kind: 'chords', at: 1720000000001, label: {}, correct: 'false' }],
    positions: { missing: null, array: [], valid: { total: 2, correct: 50 }, negative: { total: -1, correct: -2 }, constructor: { total: 4, correct: 4 } },
    preferences: { range: 999, strings: [], notes: 'invalid', extra: 'ignore' },
    unknown: 'ignore',
  }, ({ store }) => {
    assert.deepEqual(Object.keys(store.data.days), [TODAY]);
    assert.deepEqual(store.today(), { fretboard: 0, ear: 1, chords: 0, fingerstyle: 0, total: 3, correct: 3, seconds: 0 });
    assert.equal(store.data.seconds, 0);
    assert.equal(store.data.history.length, 2);
    assert.equal(store.data.history[0].label.length, 100);
    assert.equal(store.data.history[1].label, '');
    assert.equal(store.data.history[1].correct, false);
    assert.deepEqual(store.data.positions.valid, { correct: 2, total: 2 });
    assert.deepEqual(store.data.positions.negative, { correct: 0, total: 0 });
    assert.equal(Object.hasOwn(store.data.positions, 'constructor'), false);
    assert.deepEqual(store.data.preferences, { range: 5, strings: 'all', notes: 'natural' });
    assert.equal(store.data.unknown, undefined);
    assert.doesNotThrow(() => { store.record('ear', false, 'C4', 'valid'); store.tick(); store.totals(); store.streak(); });
    assert.equal(store.data.positions.valid.total, 3);
  });
});

test('invalid JSON, unsupported versions and malformed containers fall back safely', async () => {
  for (const saved of ['{invalid', null, [], { version: 1, seconds: 30 }, { version: 2, days: [null], history: {}, positions: [], preferences: null }]) {
    await withStore(saved, ({ store }) => {
      assert.deepEqual(store.today(), emptyDay());
      assert.equal(store.streak(), 0);
      assert.deepEqual(store.totals(), { correct: 0, total: 0, sessions: 0 });
      assert.doesNotThrow(() => store.record('fretboard', true, 'E2', '5-0'));
      assert.equal(store.today().correct, 1);
    });
  }
});

test('history stays bounded and unsafe keys cannot mutate object prototypes', async () => {
  await withStore(undefined, ({ store }) => {
    for (let i = 0; i < 105; i++) store.record('ear', i % 2 === 0, `Note ${i}`);
    assert.equal(store.data.history.length, 100);
    assert.equal(store.data.history[0].label, 'Note 104');
    assert.equal(store.data.history.at(-1).label, 'Note 5');
    store.record('fretboard', true, 'C4', '__proto__');
    store.record('fretboard', true, 'C4', 'toString');
    assert.equal(Object.hasOwn(store.data.positions, '__proto__'), false);
    assert.deepEqual(store.data.positions.toString, { correct: 1, total: 1 });
    store.preference('__proto__', { polluted: true });
    store.preference('range', 99);
    assert.equal({}.polluted, undefined);
    assert.equal(store.data.preferences.range, 5);
  });
});

test('blocked persistence preserves the session and clears its error after a successful retry', async () => {
  await withStore(undefined, async ({ store, storage, reload }) => {
    storage.blocked = true;
    const blockedStore = (await reload()).store;
    assert.deepEqual(blockedStore.today(), emptyDay());
    assert.doesNotThrow(() => blockedStore.record('ear', true, 'A4'));
    assert.equal(blockedStore.today().correct, 1);
    assert.equal(blockedStore.saveError, true);
    storage.blocked = false;
    blockedStore.flush();
    assert.equal(blockedStore.saveError, false);
    const restored = (await reload()).store;
    assert.equal(restored.today().correct, 1);
    assert.equal(store.today().total, 0);
  });
});

test('legacy progress gains a default profile and numeric string range values persist', async () => {
  await withStore({ version: 2, seconds: 90, days: { [YESTERDAY]: activity() } }, async ({ store, reload, storage }) => {
    assert.deepEqual(store.data.profile, { displayName: 'เพื่อนนักกีตาร์', level: 'beginner', goal: 'fingerstyle', minutes: 15, onboarded: false, startedAt: TODAY });
    assert.deepEqual(Object.keys(store.data.learning.completedLessons), []);
    assert.deepEqual(Object.keys(store.data.learning.plans), []);
    assert.equal(store.data.seconds, 90);
    assert.equal(storage.writes, 0);
    assert.equal(store.setProfile({ displayName: '  นัด\u0000  ', level: 'intermediate', goal: 'ear', minutes: '20', onboarded: true, startedAt: YESTERDAY, unknown: 'ignore' }), true);
    assert.deepEqual(store.data.profile, { displayName: 'นัด', level: 'intermediate', goal: 'ear', minutes: 20, onboarded: true, startedAt: YESTERDAY });
    const writes = storage.writes;
    assert.equal(store.setProfile({ displayName: '   ', level: 'expert', goal: 'invalid', minutes: 17, onboarded: 'true', startedAt: '2026-02-30' }), false);
    assert.equal(store.setProfile(null), false);
    assert.equal(storage.writes, writes);
    store.preference('range', '12');
    assert.equal(store.data.preferences.range, 12);
    assert.equal((await reload()).store.data.profile.displayName, 'นัด');
    assert.equal((await reload()).store.data.seconds, 90);
  });
});

test('profiles, lesson completions and daily plans normalize untrusted snapshots', async () => {
  const lessons = JSON.parse('{"__proto__":1,"constructor":2,"prototype":3,"lesson-one":100,"lesson.two":200,"bad id":300,"bad/path":400,"negative":-1,"string":"200","infinite":null}');
  await withStore({ version: 2, profile: { displayName: 'N'.repeat(100), level: 'advanced', goal: 'notes', minutes: 30, onboarded: true, startedAt: '2026-02-30', unknown: true }, learning: { completedLessons: lessons, plans: { [TODAY]: ['lesson-one', 'lesson-one', 'bad id', 'lesson.two', 'extra'], [YESTERDAY]: [], '2026-02-30': ['lesson-one'], junk: ['lesson-one'] } }, metadata: { importedGuest: 'true' } }, ({ store }) => {
    assert.equal(store.data.profile.displayName.length, 60);
    assert.equal(store.data.profile.startedAt, TODAY);
    assert.equal(store.data.profile.unknown, undefined);
    assert.deepEqual(Object.keys(store.data.learning.completedLessons), ['lesson-one', 'lesson.two']);
    assert.equal(store.data.learning.completedLessons['lesson-one'], 100);
    assert.deepEqual(Object.keys(store.data.learning.plans), [TODAY]);
    assert.deepEqual(store.data.learning.plans[TODAY], ['lesson-one', 'lesson.two']);
    assert.equal({}.polluted, undefined);
  });
});

test('lesson completion is idempotent and daily selections stay stable through completion and reload', async () => {
  await withStore(undefined, async ({ store, storage, reload }) => {
    assert.equal(store.completeLesson('intro-notes'), true);
    const timestamp = store.data.learning.completedLessons['intro-notes'];
    assert.equal(timestamp, Date.now());
    const writes = storage.writes;
    assert.equal(store.completeLesson('intro-notes'), false);
    for (const id of ['__proto__', 'constructor', '', 'bad id', null, 42]) assert.equal(store.completeLesson(id), false);
    assert.equal(storage.writes, writes);
    assert.deepEqual(store.today(), emptyDay());
    assert.deepEqual(store.data.history, []);
    const first = store.getOrCreatePlan(TODAY, ['intro-notes', 'open-chords', 'ear-start']);
    assert.deepEqual(first, ['intro-notes', 'open-chords']);
    first.push('mutated');
    store.completeLesson('open-chords');
    assert.deepEqual(store.getOrCreatePlan(TODAY, ['different']), ['intro-notes', 'open-chords']);
    assert.deepEqual(store.getOrCreatePlan('2026-02-30', ['intro-notes']), []);
    assert.deepEqual(store.getOrCreatePlan(Symbol('invalid'), ['intro-notes']), []);
    assert.deepEqual(store.getOrCreatePlan(YESTERDAY, [null, 'bad id']), []);
    const restored = (await reload()).store;
    assert.equal(restored.data.learning.completedLessons['intro-notes'], timestamp);
    assert.deepEqual(restored.getOrCreatePlan(TODAY, ['different']), ['intro-notes', 'open-chords']);
  });
});

test('progress and preferences stay in one local browser store', async () => {
  await withStore(undefined, async ({ store, items, reload }) => {
    store.record('ear', true, 'A4');
    store.setProfile({ displayName: 'นักกีตาร์' });
    store.preference('range', 12);
    for (let i = 0; i < 3; i++) store.tick();
    store.flush();
    assert.equal(store.saveError, false);
    assert.ok(items.has(KEY));
    assert.equal(items.has(KEY + ':account:learner%2Fa'), false);
    const restored = (await reload()).store;
    assert.equal(restored.data.seconds, 3);
    assert.equal(restored.today().total, 1);
    assert.equal(restored.data.profile.displayName, 'นักกีตาร์');
    assert.equal(restored.data.preferences.range, 12);
  });
});

test('save subscribers receive immutable local snapshots and can unsubscribe safely', async () => {
  await withStore(undefined, ({ store }) => {
    const events = [];
    const unsubscribe = store.subscribe(event => events.push(event));
    const stopThrowing = store.subscribe(() => { throw new Error('observer failure'); });
    assert.doesNotThrow(() => store.record('ear', true, 'A4'));
    assert.equal(events.length, 1);
    assert.ok(Object.isFrozen(events[0]));
    assert.ok(Object.isFrozen(events[0].data.days[TODAY]));
    assert.throws(() => { events[0].data.days[TODAY].ear = 900; }, TypeError);
    const count = events.length;
    unsubscribe(); stopThrowing();
    store.flush();
    assert.equal(events.length, count);
  });
});
test('completed lessons count once per local day toward streak without inventing quiz activity', async () => {
  const yesterdayAt = new NativeDate(2026, 9, 16, 23, 0, 0).getTime();
  await withStore({ version: 2, learning: { completedLessons: { yesterday: yesterdayAt } } }, ({ store, setDate }) => {
    assert.equal(store.streak(), 1);
    store.completeLesson('today-first');
    store.completeLesson('today-second');
    assert.equal(store.streak(), 2);
    assert.deepEqual(store.today(), emptyDay());
    assert.deepEqual(store.totals(), { correct: 0, total: 0, sessions: 0 });
    setDate(2026, 10, 18);
    assert.equal(store.streak(), 2);
    setDate(2026, 10, 19);
    assert.equal(store.streak(), 0);
  });
});
