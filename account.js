import { escapeHTML, heading, icon, toast } from './ui.js';

const levels = [
  { id: 'beginner', name: 'เพิ่งเริ่มต้น', text: 'ยังนับเฟรตหรือจับคอร์ดพื้นฐานได้บ้าง' },
  { id: 'intermediate', name: 'มีพื้นฐานแล้ว', text: 'เปลี่ยนคอร์ดได้ อยากแยกเบสกับเมโลดี้' },
  { id: 'advanced', name: 'อยากพัฒนาให้ลึกขึ้น', text: 'เล่นเป็นเพลงได้ อยากฝึกหูและเพิ่มสีสันคอร์ด' },
];
const goals = [
  { id: 'fingerstyle', name: 'เล่นฟิงเกอร์สไตล์', text: 'เบส เมโลดี้ และจังหวะที่ไปด้วยกัน', icon: 'fingerstyle' },
  { id: 'notes', name: 'จำโน้ตและคอร์ด', text: 'อ่านคอกีตาร์คล่อง หาโน้ตได้ไวขึ้น', icon: 'fretboard' },
  { id: 'ear', name: 'ฟังเสียงและแกะเพลง', text: 'จำระดับเสียงและระยะคู่เสียง', icon: 'ear' },
];

export function renderAccount(container, { store, onComplete = () => {} }) {
  const profile = store.data.profile;
  container.innerHTML = heading(
    'YOUR PRACTICE, YOUR PACE',
    'ตั้งเป้าหมายฝึก',
    'เลือกพื้นฐาน เรื่องที่อยากพัฒนา และเวลาที่สะดวก แผนฝึกวันนี้จะปรับให้ตามนี้ค่ะ',
  ) + `<section class="account-settings"><section class="panel"><span class="eyebrow">A LITTLE PROGRESS, EVERY DAY</span><h2>ความก้าวหน้าของเรา</h2><p class="muted small">บันทึกไว้ในเบราว์เซอร์ของอุปกรณ์นี้ เปิด URL เดิมเพื่อกลับมาฝึกต่อค่ะ</p><p class="account-privacy">แชร์ URL ให้เพื่อนเริ่มฝึกได้เลย แต่บันทึกของแต่ละคนจะอยู่ในเบราว์เซอร์ของตัวเองนะคะ</p></section><section class="panel"><h2>ปรับแผนฝึก</h2><form data-profile-form><label class="account-field">ชื่อที่แสดงในห้องฝึก<input name="displayName" value="${escapeHTML(profile.displayName)}" required minlength="2" maxlength="60" autocomplete="nickname"></label><label class="account-field">พื้นฐานตอนนี้<select name="level">${levels.map(item => `<option value="${item.id}" ${profile.level === item.id ? 'selected' : ''}>${item.name} — ${item.text}</option>`).join('')}</select></label><label class="account-field">เรื่องที่อยากพัฒนาที่สุด<select name="goal">${goals.map(item => `<option value="${item.id}" ${profile.goal === item.id ? 'selected' : ''}>${item.name} — ${item.text}</option>`).join('')}</select></label><label class="account-field">เวลาในแผนฝึกแต่ละวัน<select name="minutes">${[10, 15, 20, 30].map(minutes => `<option value="${minutes}" ${profile.minutes === minutes ? 'selected' : ''}>${minutes} นาที</option>`).join('')}</select></label><button class="btn btn-primary" type="submit">บันทึกเป้าหมาย ${icon('arrow')}</button></form></section></section>`;
  const form = container.querySelector('[data-profile-form]');
  form.onsubmit = event => {
    event.preventDefault();
    const values = new FormData(form);
    store.setProfile({
      displayName: String(values.get('displayName')).trim(),
      level: values.get('level'),
      goal: values.get('goal'),
      minutes: Number(values.get('minutes')),
      onboarded: true,
    });
    toast('บันทึกเป้าหมายแล้วค่ะ');
    onComplete();
  };
  return () => {};
}
