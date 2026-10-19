import test from 'node:test';
import assert from 'node:assert/strict';
import { LESSONS, getDailyPlan, renderLearning } from '../learning.js';

const day = '2026-10-18';
const at = (date, hour = 10) => new Date(`${date}T${String(hour).padStart(2, '0')}:00:00`).getTime();
const data = (overrides = {}) => ({ profile: { displayName: 'ทดสอบ', level: 'beginner', goal: 'fingerstyle', minutes: 15, startedAt: '2026-10-17' }, learning: { completedLessons: {}, plans: {} }, days: {}, positions: {}, ...overrides });

test('curriculum has twenty unique substantive lessons and sixty valid explained questions', () => {
  assert.equal(LESSONS.length, 20);
  assert.equal(new Set(LESSONS.map(item => item.id)).size, 20);
  for (const item of LESSONS) {
    assert.equal(item.quiz.length, 3);
    assert.ok(item.blocks.length >= 2);
    assert.ok(item.practice.instructions.length > 20);
    assert.ok(['#fretboard', '#chords', '#ear', '#fingerstyle'].includes(item.practice.href));
    for (const question of item.quiz) {
      assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < question.options.length);
      assert.ok(question.explanation.length > 20);
      assert.equal(new Set(question.options).size, question.options.length);
    }
  }
  const diminished = LESSONS.find(item => item.id === 'diminished');
  assert.match(diminished.blocks.map(block => block.text).join(' '), /0–3–6–9/);
  assert.match(diminished.blocks.map(block => block.text).join(' '), /m7♭5/);
});

test('a first plan has real zero progress and a specific accessible lesson', () => {
  const plan = getDailyPlan(data(), day);
  assert.equal(plan.lessons[0].id, 'guitar-map');
  assert.equal(plan.dayIndex, 2);
  assert.equal(plan.completed, 0);
  assert.equal(plan.percent, 0);
  assert.equal(plan.tasks.length, 5);
  assert.ok(plan.tasks.every(task => task.current === 0 && !task.complete && task.target > 0));
  assert.equal(plan.nextTask.href, '#learn?lesson=guitar-map');
  assert.equal(typeof plan.focus, 'string');
});

test('levels and learning goals adapt recommendations and meaningful room instructions', () => {
  const beginner = data();
  const intermediate = data(); intermediate.profile.level = 'intermediate';
  const advanced = data(); advanced.profile.level = 'advanced';
  assert.equal(getDailyPlan(intermediate, day).lessons[0].id, 'open-chords');
  assert.equal(getDailyPlan(advanced, day).lessons[0].id, 'sevenths');
  assert.ok(getDailyPlan(advanced, day).tasks.find(task => task.kind === 'fretboard').target > getDailyPlan(beginner, day).tasks.find(task => task.kind === 'fretboard').target);
  const ear = data(); ear.profile.goal = 'ear';
  assert.equal(getDailyPlan(ear, day).lessons[0].id, 'half-steps');
  assert.match(getDailyPlan(ear, day).focus, /หู/);
  assert.ok(getDailyPlan(ear, day).tasks.find(task => task.kind === 'ear').minutes > getDailyPlan(beginner, day).tasks.find(task => task.kind === 'ear').minutes);
});

test('all supported time budgets sum exactly and retain practical nonzero tasks', () => {
  for (const minutes of [10, 15, 20, 30]) for (const goal of ['fingerstyle', 'notes', 'ear']) {
    const source = data(); Object.assign(source.profile, { minutes, goal });
    const plan = getDailyPlan(source, day);
    assert.equal(plan.minutes, minutes);
    assert.equal(plan.tasks.reduce((sum, task) => sum + task.minutes, 0), minutes);
    assert.ok(plan.tasks.every(task => task.minutes > 0 && task.target > 0));
  }
});

test('same-day completion cannot replace its lesson or shift checklist targets', () => {
  const source = data();
  const before = getDailyPlan(source, day);
  source.learning.completedLessons['guitar-map'] = at(day);
  source.days[day] = { fretboard: 99, chords: 99, ear: 99, fingerstyle: 99, correct: 0, total: 198 };
  const after = getDailyPlan(source, day);
  assert.deepEqual(after.tasks.map(task => [task.id, task.target]), before.tasks.map(task => [task.id, task.target]));
  assert.equal(after.completed, after.total);
  assert.equal(after.percent, 100);
  assert.equal(after.nextTask, null);
  assert.ok(after.tasks.every(task => task.current === task.target));
});

test('midnight advances the curriculum and resets only the new daily checklist', () => {
  const source = data();
  source.learning.completedLessons['guitar-map'] = at(day, 23);
  source.days[day] = { fretboard: 10, chords: 10, ear: 10, fingerstyle: 10 };
  const today = getDailyPlan(source, day);
  const tomorrow = getDailyPlan(source, '2026-10-19');
  assert.equal(today.lessons[0].id, 'guitar-map');
  assert.equal(tomorrow.lessons[0].id, 'half-steps');
  assert.equal(tomorrow.dayIndex, today.dayIndex + 1);
  assert.equal(tomorrow.completed, 0);
  assert.ok(tomorrow.tasks.every(task => task.current === 0));
});

test('a saved daily selection wins after reload and unknown lesson IDs are ignored', () => {
  const source = data(); source.learning.plans[day] = ['pima'];
  source.learning.completedLessons.pima = at(day);
  const plan = getDailyPlan(JSON.parse(JSON.stringify(source)), day);
  assert.equal(plan.lessons[0].id, 'pima');
  assert.equal(plan.tasks[0].complete, true);
  source.learning.plans[day] = ['unknown'];
  assert.equal(getDailyPlan(source, day).lessons[0].id, 'guitar-map');
  source.learning.plans[day] = ['guitar-map'];
  source.learning.completedLessons['guitar-map'] = at('2026-10-17');
  assert.equal(getDailyPlan(source, day).lessons[0].id, 'half-steps', 'an imported older completion must not leave an impossible daily task');
});

test('weak-note coaching uses actual attempted positions rather than invented mistakes', () => {
  const source = data();
  source.positions = { '0:1': { correct: 1, total: 5 }, '5:3': { correct: 0, total: 2 }, 'bad': { correct: 0, total: 50 } };
  const task = getDailyPlan(source, day).tasks.find(task => task.kind === 'fretboard');
  assert.match(task.description, /F4 สาย 1 เฟรต 1/);
  assert.equal(task.current, 0);
  source.positions = { '0:1': { correct: 0, total: 2 } };
  assert.doesNotMatch(getDailyPlan(source, day).tasks.find(task => task.kind === 'fretboard').description, /ที่เคยสับสน/);
});

test('fully completed curriculum produces useful practice rather than an impossible repeat lesson', () => {
  const source = data();
  source.learning.completedLessons = Object.fromEntries(LESSONS.map(item => [item.id, at('2026-10-17')]));
  const plan = getDailyPlan(source, day);
  assert.equal(plan.lessons.length, 0);
  assert.equal(plan.tasks.length, 4);
  assert.ok(plan.tasks.every(task => task.kind !== 'lesson'));
  assert.equal(plan.tasks.reduce((sum, task) => sum + task.minutes, 0), 15);
  assert.equal(plan.completed, 0);
});

test('planning is pure and tolerates missing or unrecognized profile choices', () => {
  const source = data(); const snapshot = JSON.stringify(source);
  getDailyPlan(source, day); assert.equal(JSON.stringify(source), snapshot);
  const plan = getDailyPlan({ profile: { level: '__proto__', goal: 'other', minutes: -1, startedAt: 'invalid' } }, day);
  assert.equal(plan.level, 'beginner'); assert.equal(plan.minutes, 15); assert.equal(plan.dayIndex, 1);
  assert.equal(plan.completed, 0);
});

class MockElement {
  constructor(attributes = {}) { this.attributes = attributes; this.dataset = {}; this.events = new Map(); this.children = new Map(); this.buttons = []; this.disabled = 'disabled' in attributes; this.checked = 'checked' in attributes; for (const [key, value] of Object.entries(attributes)) if (key.startsWith('data-')) this.dataset[key.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = value; }
  set innerHTML(value) { this.html = value; this.buttons = [...value.matchAll(/<button\b([^>]*)>/g)].map(([, attrs]) => { const attributes = Object.fromEntries([...attrs.matchAll(/([a-z-]+)(?:="([^"]*)")?/g)].map(([, key, value]) => [key, value || ''])); return new MockElement(attributes); }); }
  get innerHTML() { return this.html || ''; }
  hasAttribute(key) { return key in this.attributes; }
  closest(selector) { return selector === 'button' ? this : null; }
  querySelector(selector) { if (!this.children.has(selector)) this.children.set(selector, new MockElement()); return this.children.get(selector); }
  addEventListener(name, callback) { this.events.set(name, callback); }
  removeEventListener(name) { this.events.delete(name); }
  focus() {}
}

function view(t) {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const document = new MockElement(); document.hidden = false;
  Object.defineProperty(globalThis, 'document', { configurable: true, value: document });
  const source = data(); const completed = [];
  const store = { data: source, completeLesson(id) { if (source.learning.completedLessons[id]) return false; source.learning.completedLessons[id] = Date.now(); completed.push(id); return true; } };
  const container = new MockElement(); const played = [];
  const audio = { init: async () => {}, stopAll() {}, playNote: async midi => played.push(midi) };
  const cleanup = renderLearning(container, { store, audio, lessonId: 'guitar-map' });
  t.after(() => { cleanup(); if (descriptor) Object.defineProperty(globalThis, 'document', descriptor); else delete globalThis.document; });
  const quiz = () => container.querySelector('[data-quiz]');
  const click = button => container.events.get('click')({ target: button });
  return { source, store, completed, container, audio, played, cleanup, quiz, click,
    button(attribute, value) { return quiz().buttons.find(button => button.hasAttribute(attribute) && (value === undefined || button.attributes[attribute] === String(value))); },
    answerAll(wrong = false) { LESSONS[0].quiz.forEach(question => { click(this.button('data-answer', wrong ? (question.answer + 1) % question.options.length : question.answer)); click(this.button('data-next-question')); }); },
    confirmRead() { const checkbox = new MockElement({ 'data-read': '' }); checkbox.checked = true; container.events.get('change')({ target: checkbox }); },
  };
}

test('lesson completion requires all correct answers plus an explicit read confirmation', t => {
  const f = view(t);
  f.answerAll();
  assert.equal(f.button('data-finish').disabled, true);
  assert.equal(f.completed.length, 0);
  f.confirmRead();
  const finish = f.button('data-finish');
  assert.equal(finish.disabled, false);
  f.click(finish); f.click(finish);
  assert.deepEqual(f.completed, ['guitar-map']);
  assert.ok(f.source.learning.completedLessons['guitar-map'] > 0);
});

test('incorrect quiz attempts cannot complete a lesson; a fresh perfect retry can', t => {
  const f = view(t); f.confirmRead(); f.answerAll(true);
  assert.equal(f.button('data-finish'), undefined);
  assert.equal(f.completed.length, 0);
  f.click(f.button('data-retry')); f.answerAll(); f.click(f.button('data-finish'));
  assert.deepEqual(f.completed, ['guitar-map']);
});

test('cleanup while example audio is starting prevents a late sound', async t => {
  const f = view(t);
  const courseButton = new MockElement({ 'data-lesson': 'half-steps' }); f.click(courseButton);
  let resolve;
  f.audio.init = () => new Promise(done => { resolve = done; });
  f.click(new MockElement({ 'data-listen': '' }));
  f.cleanup(); resolve();
  for (let i = 0; i < 6; i++) await Promise.resolve();
  assert.equal(f.played.length, 0);
  assert.equal(f.container.events.size, 0);
});
