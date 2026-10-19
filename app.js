import {audio} from './audio.js';
import {store,localDay} from './store.js';
import {icon,heading,toast,escapeHTML,soundError} from './ui.js';
import {renderFretboard} from './fretboard.js';
import {renderEar} from './ear.js';
import {renderTuner} from './tuner.js';
import {renderChords} from './chords.js';
import {renderPractice} from './practice.js';
import {renderAccount} from './account.js';
import {renderDashboard} from './home.js';
import {renderLearning} from './learning.js';

const pages=[{id:'home',name:'แผนฝึกวันนี้',icon:'home'},{id:'learn',name:'เส้นทางการเรียน',icon:'book'},{id:'fretboard',name:'จำโน้ตบนคอกีตาร์',icon:'fretboard'},{id:'chords',name:'คลังคอร์ด',icon:'chords'},{id:'ear',name:'ฝึกฟังเสียง',icon:'ear'},{id:'fingerstyle',name:'ฝึกฟิงเกอร์สไตล์',icon:'fingerstyle'},{id:'tuner',name:'เครื่องตั้งสาย',icon:'tuner'},{id:'account',name:'เป้าหมายการฝึก',icon:'target',hidden:true}];
let route='',cleanup=()=>{},lastActivity=Date.now(),toastStorage=false;
const main=document.getElementById('main');
document.querySelector('.skip-link').onclick=e=>{e.preventDefault();main.focus();};
document.getElementById('navigation').innerHTML=pages.filter(p=>!p.hidden).map((p,i)=>`${p.id==='tuner'?'<div class="nav-divider"></div>':''}<a class="nav-link" data-nav="${p.id}" href="#${p.id}">${icon(p.icon)}<span>${p.name}</span></a>`).join('');
function updateStreak(){document.getElementById('top-streak').innerHTML=`${icon('flame')} ฝึกต่อเนื่อง ${store.streak()} วัน`;}
function record(kind,correct,label,position){lastActivity=Date.now();store.record(kind,correct,label,position);updateStreak();if(store.saveError&&!toastStorage){toastStorage=true;toast('เบราว์เซอร์ไม่อนุญาตบันทึกข้อมูล ผลจะอยู่ในรอบนี้เท่านั้นค่ะ');}}
function guitarArt(){return `<svg viewBox="0 0 350 300" fill="none" aria-hidden="true"><defs><linearGradient id="wood" x1="98" y1="220" x2="295" y2="200" gradientUnits="userSpaceOnUse"><stop stop-color="#bba375"/><stop offset=".5" stop-color="#c8b181"/><stop offset="1" stop-color="#ac9468"/></linearGradient><linearGradient id="neck" x1="195" y1="20" x2="245" y2="20"><stop stop-color="#657352"/><stop offset="1" stop-color="#45513a"/></linearGradient></defs><circle cx="230" cy="150" r="115" stroke="#a5b593" stroke-opacity=".32"/><circle cx="230" cy="150" r="90" stroke="#a5b593" stroke-opacity=".25"/><path d="M60 250h280M45 260h290" stroke="#abb89a" stroke-opacity=".4"/><g transform="rotate(26 225 150)"><path d="M193 117c-30-17-62-4-61 23 2 23-6 25-22 39-23 22-18 65 14 84 28 17 81 17 109-3 30-21 34-59 11-81-17-16-23-21-19-40 4-21-8-33-32-22Z" fill="url(#wood)" stroke="#968559" stroke-width="2"/><path d="M194 122c-29-14-55-2-54 20 2 27-8 31-23 44-20 19-15 56 13 72 26 15 72 14 98-3 26-18 30-51 10-71-20-17-26-23-22-46 3-17-7-24-22-16Z" stroke="#dfc995" stroke-width="1.2"/><circle cx="180" cy="186" r="26" fill="#687355"/><circle cx="180" cy="186" r="22" fill="#344131"/><circle cx="180" cy="186" r="29" stroke="#8a7f56"/><path d="M164 172 165 16h32l-2 156Z" fill="url(#neck)"/><path d="M164 15 160-18q17-16 38-2l4 33Z" fill="#a48e64"/><path d="M166 31h30m-30 16h30m-30 17h30m-30 18h30m-30 20h30m-30 22h30m-30 23h30" stroke="#c3c6a7" stroke-opacity=".7"/><circle cx="180" cy="55" r="2" fill="#d6dcc3"/><circle cx="180" cy="91" r="2" fill="#d6dcc3"/><circle cx="180" cy="135" r="2" fill="#d6dcc3"/><rect x="153" y="225" width="54" height="10" rx="2" fill="#536047"/><path d="M170-12v243m4-243v243m4-243v243m4-243v243m4-243v243m4-243v243" stroke="#ebe2be" stroke-width=".65"/><path d="M201 186q14 3 17 18l-19 3Z" fill="#6b7552" opacity=".6"/></g><path d="m49 95 3-7 3 7 7 3-7 3-3 7-3-7-7-3Z" fill="#7b8d69"/><circle cx="300" cy="58" r="3" fill="#9aac88"/><path d="m71 163 5 2m-10-8-3-4" stroke="#7d906b" stroke-linecap="round"/></svg>`;}
function renderHome(){return renderDashboard(main,{store,guitarArt});}
function go(hash){if(location.hash===hash)navigate();else location.hash=hash;}
function updateAccountUI(){
  const name=store.data.profile.displayName;
  document.querySelector('.nav-label').textContent='ห้องฝึกกีตาร์';
  document.querySelector('.profile strong').textContent=name;
  document.querySelector('.profile .avatar').textContent=name.slice(0,1);
  const button=document.getElementById('account-button');button.textContent='ตั้งเป้าหมาย';button.setAttribute('aria-label','ตั้งเป้าหมายการฝึก');
}
function navigate(){
  document.getElementById('progress-dialog').close();
  document.getElementById('progress-content').replaceChildren();
  const raw=location.hash.slice(1)||'home',requested=raw.split('?')[0];let p=pages.find(x=>x.id===requested)||pages[0];
  cleanup();audio.stopMic();audio.stopAll();stopMetro();route=p.id;lastActivity=Date.now();document.getElementById('metronome').hidden=true;document.getElementById('metro-toggle').setAttribute('aria-expanded','false');
  document.getElementById('current-page').textContent=p.name;document.title=`${p.name} — Fret & Flow`;document.querySelectorAll('[data-nav]').forEach(a=>{a.classList.toggle('active',a.dataset.nav===route);if(a.dataset.nav===route)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  const context={audio,store,record,onMicStart:stopMetro,exercise:new URLSearchParams(raw.split('?')[1]||''),lessonId:new URLSearchParams(raw.split('?')[1]||'').get('lesson'),onProfileChange:()=>{lastActivity=Date.now();updateAccountUI();updateStreak();}};
  if(route==='home')cleanup=renderHome();
  else if(route==='account')cleanup=renderAccount(main,{store,onComplete:()=>go('#home')});
  else if(route==='learn')cleanup=renderLearning(main,context);
  else if(route==='fretboard')cleanup=renderFretboard(main,context);
  else if(route==='chords')cleanup=renderChords(main,context);
  else if(route==='ear')cleanup=renderEar(main,context);
  else if(route==='fingerstyle')cleanup=renderPractice(main,context);
  else if(route==='tuner')cleanup=renderTuner(main,context);
  updateStreak();updateAccountUI();window.scrollTo(0,0);main.focus({preventScroll:true});if(route==='learn'&&context.lessonId){const lessonHeading=main.querySelector('[data-lesson-heading]');lessonHeading?.focus({preventScroll:true});lessonHeading?.scrollIntoView({block:'start'});}
}

let metroTimer=null,metroRunning=false,metroGeneration=0,beat=0,bpm=72,nextBeatAt=0;
function stopMetro(){metroRunning=false;metroGeneration++;clearTimeout(metroTimer);metroTimer=null;document.getElementById('metro-start').textContent='เริ่มจังหวะ 4/4';document.querySelectorAll('#metro-beats i').forEach(i=>i.classList.remove('active'));}
function tickMetro(){if(!metroRunning||document.hidden)return;audio.click(beat%4===0).catch(soundError);document.querySelectorAll('#metro-beats i').forEach((el,i)=>el.classList.toggle('active',i===beat%4));beat++;nextBeatAt+=60000/bpm;const now=performance.now();if(nextBeatAt<now-100)nextBeatAt=now+60000/bpm;metroTimer=setTimeout(tickMetro,Math.max(0,nextBeatAt-now));}
document.getElementById('metro-toggle').onclick=()=>{const el=document.getElementById('metronome');if(route==='tuner'){toast('ตั้งสายในที่เงียบก่อน แล้วค่อยเปิดจังหวะในห้องฝึกค่ะ');return;}if(route==='fingerstyle'||route==='chords'){toast('ใช้ปุ่มจังหวะในห้องฝึกนี้ เพื่อให้ตรงกับแพตเทิร์นค่ะ');return;}el.hidden=!el.hidden;document.getElementById('metro-toggle').setAttribute('aria-expanded',String(!el.hidden));};
document.getElementById('metro-close').onclick=()=>{stopMetro();audio.stopAll();document.getElementById('metronome').hidden=true;document.getElementById('metro-toggle').setAttribute('aria-expanded','false');};
document.getElementById('metro-start').onclick=async()=>{if(metroRunning){stopMetro();audio.stopAll();return;}const generation=++metroGeneration;try{await audio.init();if(generation!==metroGeneration)return;if(audio.listening){toast('ปิดไมค์ในห้องฝึกก่อนเปิดจังหวะค่ะ');return;}metroRunning=true;beat=0;nextBeatAt=performance.now();document.getElementById('metro-start').textContent='หยุดจังหวะ';tickMetro();}catch(e){soundError(e);}};
function setBpm(value){bpm=Math.max(40,Math.min(180,Number(value)));document.getElementById('metro-tempo').value=bpm;document.getElementById('bpm-label').innerHTML=`${bpm} <small>BPM</small>`;if(metroRunning){clearTimeout(metroTimer);nextBeatAt=performance.now();tickMetro();}}
document.getElementById('metro-tempo').oninput=e=>setBpm(e.target.value);document.querySelectorAll('[data-bpm]').forEach(b=>b.onclick=()=>setBpm(bpm+Number(b.dataset.bpm)));
function showProgress(){
  const totals=store.totals(),history=store.data.history;document.getElementById('progress-content').innerHTML=`<div class="section-heading"><div><span class="eyebrow">YOUR PRACTICE JOURNAL</span><h2 id="progress-title">ค่อย ๆ เก่งขึ้นในแบบของเรา</h2></div><button class="icon-button" id="progress-close" aria-label="ปิดความก้าวหน้า">×</button></div><div class="progress-row"><span>เวลาฝึกสะสม</span><strong>${Math.floor(store.data.seconds/60)} นาที ${store.data.seconds%60} วินาที</strong></div><div class="progress-row"><span>แบบฝึกที่ตอบถูก</span><strong>${totals.correct} / ${totals.total} ข้อ</strong></div><div class="progress-row"><span>ฟิงเกอร์สไตล์ที่เล่นครบ</span><strong>${totals.sessions} วลี</strong></div><div class="progress-row"><span>วันที่ฝึกต่อเนื่อง</span><strong>${store.streak()} วัน</strong></div><h3 style="margin-top:22px">บันทึกล่าสุด</h3><div class="history-rows">${history.length?history.slice(0,20).map(h=>`<div class="progress-row"><span>${h.correct?'✓':'○'} ${escapeHTML(h.label)}</span><span>${new Intl.DateTimeFormat('th-TH',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}).format(new Date(h.at))}</span></div>`).join(''):'<div class="empty-state">หน้ากระดาษยังว่าง มาเริ่มโน้ตแรกด้วยกันค่ะ</div>'}</div><button class="btn btn-primary" id="export-progress">ดาวน์โหลดบันทึกการฝึก</button><p class="muted small" style="margin:14px 0 0">บันทึกอยู่ในเบราว์เซอร์นี้ ใช้ที่อยู่เว็บเดิมเพื่อดูสถิติต่อเนื่องค่ะ เวลาจะนับเฉพาะหน้าฝึกที่เปิดอยู่และมีการใช้งานในช่วง 90 วินาทีล่าสุด</p>`;document.getElementById('progress-close').onclick=()=>document.getElementById('progress-dialog').close();document.getElementById('export-progress').onclick=()=>{const blob=new Blob([JSON.stringify(store.data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`fret-flow-practice-${localDay()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};document.getElementById('progress-dialog').showModal();
}
document.getElementById('progress-button').onclick=showProgress;
// A mobile-accessible journal entry uses the streak badge as well as the desktop profile.
document.getElementById('top-streak').setAttribute('role','button');document.getElementById('top-streak').tabIndex=0;document.getElementById('top-streak').setAttribute('aria-label','ดูบันทึกความก้าวหน้า');document.getElementById('top-streak').onclick=showProgress;document.getElementById('top-streak').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();showProgress();}};
window.addEventListener('hashchange',navigate);document.addEventListener('pointerdown',()=>lastActivity=Date.now(),{passive:true});document.addEventListener('keydown',e=>{lastActivity=Date.now();if(e.key==='Escape'){stopMetro();document.getElementById('metronome').hidden=true;document.getElementById('metro-toggle').setAttribute('aria-expanded','false');}});
setInterval(()=>{if(['fretboard','chords','ear','fingerstyle','learn'].includes(route)&&!document.hidden&&Date.now()-lastActivity<90000&&!document.getElementById('progress-dialog').open)store.tick();},1000);
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopMetro();audio.stopMic();audio.stopAll();store.flush();}});window.addEventListener('pagehide',()=>{cleanup();stopMetro();store.flush();});
document.getElementById('account-button').onclick=()=>go('#account');
main.innerHTML='<div class="account-loading"><span>f.</span>กำลังเปิดห้องฝึกกีตาร์ค่ะ…</div>';
navigate();
