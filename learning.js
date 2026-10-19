import { noteAt } from './music.js';
import { escapeHTML, heading, icon } from './ui.js';

const CHAPTERS = [
  { id: 'foundation', title: 'วางพื้นฐานให้มั่นคง', level: 'beginner' },
  { id: 'connections', title: 'เชื่อมภาพ เสียง และคอร์ด', level: 'intermediate' },
  { id: 'fingerstyle', title: 'เบสกับเมโลดี้ไปด้วยกัน', level: 'advanced' },
  { id: 'musicianship', title: 'นำไปใช้เป็นดนตรี', level: 'advanced' },
];
const b = (title, text, example = '') => ({ title, text, example });
const q = (question, options, answer, explanation) => ({ question, options, answer, explanation });
const room = (kind, instructions) => ({ kind, href: `#${kind}`, instructions });
const lesson = (id, chapter, title, summary, blocks, practice, quiz, audio = null) => ({ id, chapter: CHAPTERS[chapter].id, chapterTitle: CHAPTERS[chapter].title, level: CHAPTERS[chapter].level, title, summary, minutes: 4, blocks, practice, quiz, audio });

export const LESSONS = [
  lesson('guitar-map', 0, 'รู้จักสายกีตาร์และมือของเรา', 'เริ่มจากการตั้งสายและทิศทางของคอกีตาร์', [
    b('สาย 1 อยู่ด้านเสียงสูง', 'สาย 1 คือสายบางสุด เสียงสูง E4 ส่วนสาย 6 คือสายหนาสุด เสียงต่ำ E2 ตัวเลขอ็อกเทฟช่วยแยก E คนละระดับเสียง', 'จากสาย 6 → 1: E2 · A2 · D3 · G3 · B3 · E4'),
    b('กดหลังเฟรต ดีดอย่างผ่อนคลาย', 'วางปลายนิ้วใกล้ลวดเฟรตด้านหัวกีตาร์ กดเท่าที่เสียงใส ข้อมือไม่หักมาก เมื่อเมื่อยให้พัก สายเปิดคือดีดโดยไม่กดเฟรต'),
  ], room('fretboard', 'เลือกโหมดสำรวจ เฟรต 0–3 แล้วฟังสายเปิดทั้ง 6 จากสาย 6 มาสาย 1'), [
    q('สาย 1 คือสายใด?', ['สายบางสุด E4', 'สายหนาสุด E2', 'สาย A2'], 0, 'เรานับสายจากด้านเสียงสูง: สาย 1 เป็น E4 ที่บางที่สุด'),
    q('สายเปิดหมายถึงอะไร?', ['ดีดทุกสายพร้อมกัน', 'ดีดโดยไม่กดเฟรต', 'กดเฟรต 12'], 1, 'สายเปิดหรือเฟรต 0 คือเสียงของสายที่ไม่ได้กด'),
    q('สายเปิดจากสาย 6 ไปสาย 1 เรียงอย่างไร?', ['E B G D A E', 'A D G B E A', 'E A D G B E'], 2, 'Standard tuning เรียงจากเสียงต่ำเป็น E A D G B E'),
  ]),
  lesson('half-steps', 0, 'หนึ่งเฟรตคือหนึ่งครึ่งเสียง', 'เข้าใจทางเดินของโน้ตแทนการจำแบบเดาสุ่ม', [
    b('วงกลมโน้ต 12 เสียง', 'โน้ตดนตรีแบบแบ่งเท่า 12 เสียงวนซ้ำไปเรื่อย ๆ เลื่อนขึ้นหนึ่งเฟรตคือขึ้นหนึ่งครึ่งเสียง สองเฟรตคือหนึ่งเสียงเต็ม', 'C · C♯ · D · D♯ · E · F · F♯ · G · G♯ · A · A♯ · B'),
    b('คู่ที่ไม่มีชาร์ปคั่น', 'E ไป F และ B ไป C อยู่ติดกัน ส่วนโน้ตธรรมชาติคู่อื่น ๆ ห่างกันสองเฟรต จึงอย่าใส่เฟรตว่างระหว่าง E–F หรือ B–C'),
  ], room('fretboard', 'เลือกสาย 1 ช่วง 0–5 แล้วเทียบ E เฟรต 0, F เฟรต 1 และ G เฟรต 3'), [
    q('เลื่อนขึ้นหนึ่งเฟรต เสียงเปลี่ยนเท่าไร?', ['หนึ่งอ็อกเทฟ', 'หนึ่งครึ่งเสียง', 'สองเสียงเต็ม'], 1, 'ระยะระหว่างเฟรตที่ติดกันคือครึ่งเสียงหรือหนึ่ง semitone'),
    q('E ไป F ห่างกี่เฟรต?', ['1 เฟรต', '2 เฟรต', '3 เฟรต'], 0, 'E–F และ B–C เป็นคู่โน้ตธรรมชาติที่ห่างครึ่งเสียง'),
    q('C ไป D ห่างกี่ครึ่งเสียง?', ['1', '3', '2'], 2, 'C → C♯ → D รวมสองครึ่งเสียง'),
  ], { label: 'ฟัง E4 → F4 → G4', midis: [64, 65, 67] }),
  lesson('octave-map', 0, 'หาโน้ตเดิมในอีกอ็อกเทฟ', 'โน้ตชื่อเดียวกันอาจมีระดับเสียงต่างกัน', [
    b('เฟรต 12 เป็นจุดเชื่อม', 'สายเดียวกัน เฟรต 12 สูงกว่าสายเปิดหนึ่งอ็อกเทฟ ความถี่เพิ่มเป็นสองเท่า ชื่อโน้ตเดิมแต่เลขอ็อกเทฟสูงขึ้นหนึ่ง', 'สาย 6: เฟรต 0 = E2 · เฟรต 12 = E3'),
    b('โน้ตเดียวกันอยู่ได้หลายสาย', 'E4 อยู่ได้ทั้งสาย 1 เฟรต 0 และสาย 2 เฟรต 5 เสียงสูงเท่ากันแต่สีเสียงและวิธีจับต่างกัน ไมค์บอกระดับเสียงได้ แต่บอกสายที่ใช้ไม่ได้'),
  ], room('fretboard', 'เลือกทุกสาย เฟรต 0–12 แล้วเทียบ E4 สาย 1 เฟรต 0 กับสาย 2 เฟรต 5'), [
    q('สายเดียวกัน เฟรต 12 เทียบกับเฟรต 0 เป็นอย่างไร?', ['ต่ำกว่าหนึ่งอ็อกเทฟ', 'เสียงเดียวกันทุกอย่าง', 'สูงกว่าหนึ่งอ็อกเทฟ'], 2, 'เฟรต 12 เพิ่ม 12 ครึ่งเสียง จึงสูงขึ้นหนึ่งอ็อกเทฟ'),
    q('E2 และ E4 เป็นอะไร?', ['ชื่อโน้ตเดียวกัน คนละอ็อกเทฟ', 'ความถี่เท่ากัน', 'E4 ต่ำกว่า E2'], 0, 'เลขหลังชื่อโน้ตระบุระดับอ็อกเทฟ E4 สูงกว่า E2 สองอ็อกเทฟ'),
    q('ไมค์ยืนยันสายและเฟรตที่ใช้ได้หรือไม่?', ['ได้ทุกครั้ง', 'ไม่ได้ ตรวจได้เพียงระดับเสียง', 'ได้เฉพาะสาย 1'], 1, 'หลายตำแหน่งให้ MIDI เดียวกัน จึงต้องตรวจตำแหน่งมือด้วยตัวเอง'),
  ], { label: 'ฟัง E3 → E4', midis: [52, 64] }),
  lesson('read-tab', 0, 'อ่าน TAB ให้ถูกด้าน', 'เปลี่ยนเส้นกับตัวเลขให้เป็นตำแหน่งเล่น', [
    b('เส้นบนสุดคือสาย 1', 'TAB หกเส้นเรียงจากสาย 1 ด้านบนถึงสาย 6 ด้านล่าง ตัวเลขบนเส้นคือเฟรต อ่านจากซ้ายไปขวาตามเวลา', 'e|--0--1--3--|  = สาย 1 เฟรต 0 → 1 → 3'),
    b('ตัวเลขตรงกันในแนวตั้ง', 'ถ้าตัวเลขอยู่ในตำแหน่งเวลาเดียวกัน ให้ดีดพร้อมกัน ช่องที่ไม่มีตัวเลขไม่ต้องดีด TAB อย่างเดียวอาจไม่บอกความยาวเสียง ต้องอ่านจังหวะหรือฟังประกอบ'),
  ], room('fingerstyle', 'เลือกอาร์เพจจิโอ ดูสาย e ด้านบนและ E ด้านล่าง แล้วไล่ตัวเลขตามไฮไลต์ช้า ๆ'), [
    q('เส้นบนสุดของ TAB คือสายใด?', ['สาย 6', 'สาย 1', 'สาย 3'], 1, 'TAB วางสายบางเสียงสูงไว้ด้านบน'),
    q('เลข 0 บนสาย 2 หมายถึงอะไร?', ['ไม่ดีดสาย 2', 'จับคอร์ด C', 'ดีดสาย 2 แบบสายเปิด'], 2, '0 คือสายเปิด ไม่ใช่เครื่องหมายงดดีด'),
    q('เลขสองตัวอยู่แนวตั้งเดียวกันควรเล่นอย่างไร?', ['ดีดพร้อมกัน', 'เล่นตัวบนก่อนเสมอ', 'ข้ามทั้งคู่'], 0, 'แนวตั้งเดียวกันแทนเวลาเดียวกัน จึงดีดพร้อมกัน'),
  ]),
  lesson('pima', 0, 'จัดนิ้ว P I M A อย่างสบาย', 'เตรียมมือขวาให้แยกเบสและสายแหลมได้', [
    b('ชื่อย่อของสี่นิ้ว', 'P คือโป้ง I คือชี้ M คือกลาง A คือนาง ในแพตเทิร์นเริ่มต้นให้ P ดูแลสายเบส 4–6 และ I M A วางบนสาย 3 2 1 ตามลำดับ', 'P → เบส · I → 3 · M → 2 · A → 1'),
    b('ปล่อยให้เสียงต่อกัน', 'ดีดเบาและเคลื่อนไหวเท่าที่จำเป็น ไม่ดึงสายออกจากหน้ากีตาร์แรง ๆ ลองแยกแต่ละนิ้วก่อน แล้วค่อยเชื่อมเป็นวงซ้ำ ไม่ฝืนเมื่อเจ็บ'),
  ], room('fingerstyle', 'เลือกอาร์เพจจิโอ 50–60 BPM จับคอร์ด C ค้างก่อน แล้วฝึกนิ้ว P I M A โดยยังไม่เร่งเปลี่ยนคอร์ด'), [
    q('P หมายถึงนิ้วใด?', ['นิ้วโป้ง', 'นิ้วก้อย', 'นิ้วชี้'], 0, 'P หรือ pulgar คือนิ้วโป้ง ใช้ดูแลเบสในแพตเทิร์นเริ่มต้น'),
    q('นิ้ว M มักเริ่มวางบนสายใด?', ['สาย 6', 'สาย 2', 'สาย 4'], 1, 'รูปแบบพื้นฐาน I–M–A วางบนสาย 3–2–1'),
    q('เมื่อนิ้วเกร็งและเสียงไม่สม่ำเสมอควรทำอย่างไร?', ['เพิ่มแรงทันที', 'เร่งจังหวะ', 'ช้าลง ผ่อนมือ แล้วแยกฝึก'], 2, 'การผ่อนมือและฝึกช้าช่วยสร้างการเคลื่อนไหวที่ควบคุมได้'),
  ]),
  lesson('triads', 0, 'คอร์ด Major กับ Minor ต่างกันตรงไหน', 'รู้จักสูตรสามเสียงที่ใช้บ่อยที่สุด', [
    b('ราก สาม ห้า', 'คอร์ดสามเสียงหรือ triad มีราก เสียงสาม และเสียงห้า Major ใช้ 0–4–7 ครึ่งเสียงจากราก ส่วน Minor ใช้ 0–3–7', 'C = C E G · Cm = C E♭ G'),
    b('เสียงสามเป็นตัวเปลี่ยนคุณภาพ', 'จาก Major เป็น Minor ลดเสียงสามลงหนึ่งครึ่งเสียง รากกับเสียงห้าคงเดิม ความรู้สึกของคอร์ดขึ้นอยู่กับบริบทเพลงด้วย ไม่จำเป็นต้องสรุปว่าอารมณ์เหมือนกันทุกเพลง'),
  ], room('chords', 'ค้นหา C แล้วฟังเทียบ Cm ดูว่าชื่อโน้ตตัวกลางเปลี่ยนจาก E เป็น E♭'), [
    q('สูตร Major triad คืออะไร?', ['0–3–7', '0–4–7', '0–3–6'], 1, 'Major มีเมเจอร์สาม 4 ครึ่งเสียง และเพอร์เฟกต์ห้า 7 ครึ่งเสียง'),
    q('โน้ตใดเปลี่ยนเมื่อ C กลายเป็น Cm?', ['C เป็น D', 'G เป็น A', 'E เป็น E♭'], 2, 'เสียงสามลดลงครึ่งเสียงจาก E เป็น E♭'),
    q('โน้ตใน Am คืออะไร?', ['A C E', 'A C♯ E', 'A D F'], 0, 'A → C เป็นไมเนอร์สาม และ A → E เป็นเพอร์เฟกต์ห้า'),
  ], { label: 'ฟัง C แล้ว Cm', groups: [[60, 64, 67], [60, 63, 67]] }),
  lesson('open-chords', 1, 'จับคอร์ดเปิดให้ใสทีละสาย', 'อ่านเครื่องหมายในแผนภาพและตรวจเสียงจริง', [
    b('วงกลม กากบาท และเลขนิ้ว', '○ คือสายเปิด × คือสายที่ไม่ดีด เลข 1–4 ในจุดแทนนิ้วชี้ กลาง นาง ก้อย ส่วนตัวเลขเฟรตข้างแผนภาพบอกตำแหน่งบนคอ'),
    b('เสียงสะอาดสำคัญกว่าความเร็ว', 'เริ่ม C Am G D Em ดีดจากสายเบสที่คอร์ดอนุญาตทีละสาย ถ้าบอดให้เช็กว่าปลายนิ้วแตะสายข้างเคียงหรือไม่ คอร์ด F เต็มรูปต้องทาบ ไม่ต้องฝืนให้คล่องในวันเดียว', 'C: × 3 2 0 1 0 · Am: × 0 2 2 1 0 (สาย 6 → 1)'),
  ], room('chords', 'เลือก C แล้วฟังแต่ละสาย จากนั้นลอง Am และซ้อมเปลี่ยน C ↔ Am ช้า ๆ'), [
    q('เครื่องหมาย × หมายถึงอะไร?', ['ดีดสายเปิด', 'ไม่ดีดสายนั้น', 'กดเฟรต 10'], 1, '× ระบุว่าสายนั้นไม่ควรดังในรูปจับนี้'),
    q('รูป C แบบ ×32010 ต้องเริ่มดีดเบสที่สายใด?', ['สาย 6', 'สาย 1', 'สาย 5'], 2, 'สาย 6 เป็น × จึงเริ่มสาย 5 เฟรต 3 ซึ่งเป็น C'),
    q('เสียงบอดควรตรวจอะไรเป็นอย่างแรก?', ['ปลายนิ้วและการแตะสายข้างเคียง', 'เพิ่ม BPM', 'เปลี่ยนโน้ตทุกตัว'], 0, 'แก้ตำแหน่งนิ้วและแรงกดทีละสายก่อนเพิ่มความเร็ว'),
  ]),
  lesson('pulse-eighths', 1, 'จังหวะ 4/4 และการแบ่งครึ่ง', 'ให้จังหวะอยู่กับเราแม้มีเสียงดีดหลายตัว', [
    b('หนึ่งห้องมีสี่จังหวะ', 'ใน 4/4 โน้ตดำเป็นหนึ่งจังหวะ เมโทรนอม 60 BPM คือโน้ตดำหนึ่งครั้งต่อวินาที ถ้าเล่นโน้ตเขบ็ตหนึ่งชั้นจะมีสองเสียงต่อหนึ่งคลิก', 'นับ: 1 & 2 & 3 & 4 &'),
    b('แยกจังหวะออกจากจำนวนเสียง', 'หนึ่งห้อง 4/4 ที่เล่นเขบ็ตต่อเนื่องมี 8 ช่องเวลา แต่ยังมี 4 จังหวะ อย่าเปลี่ยนคลิกเป็นทุกเสียงย่อยโดยไม่ตั้งใจ'),
  ], room('fingerstyle', 'เลือกอาร์เพจจิโอ 60 BPM เปิดคลิก นับ 1 & 2 & 3 & 4 & แล้วฟังให้ได้ 8 ช่องต่อห้อง'), [
    q('หนึ่งห้อง 4/4 มีกี่จังหวะโน้ตดำ?', ['8', '6', '4'], 2, 'เลขบน 4 กำหนดสี่จังหวะ และเลขล่าง 4 ใช้โน้ตดำเป็นหน่วย'),
    q('เขบ็ตหนึ่งชั้นต่อเนื่องในหนึ่งห้อง 4/4 มีกี่ตัว?', ['8', '4', '3'], 0, 'โน้ตดำหนึ่งตัวแบ่งเป็นเขบ็ตหนึ่งชั้นสองตัว รวม 4 × 2 = 8'),
    q('60 BPM โดยใช้โน้ตดำเป็นหน่วย หมายถึงอะไร?', ['ดีดหกสิบสายพร้อมกัน', 'โน้ตดำ 60 ครั้งต่อนาที', 'หนึ่งห้องต่อนาที'], 1, 'BPM คือจำนวนหน่วยจังหวะต่อนาที ต้องทราบว่าหน่วยนั้นเป็นโน้ตชนิดใด'),
  ]),
  lesson('intervals', 1, 'ระยะคู่เสียงคือเครื่องมือแกะเพลง', 'ฟังความใกล้ไกลและนับครึ่งเสียงประกอบกัน', [
    b('เริ่มจากคู่ที่จำง่าย', 'Minor 2 ห่าง 1 ครึ่งเสียง Major 2 ห่าง 2 Major 3 ห่าง 4 Perfect 4 ห่าง 5 Perfect 5 ห่าง 7 และ Octave ห่าง 12', 'C → E = M3 · C → G = P5 · C → C สูง = P8'),
    b('ฟังสัมพันธ์กัน ไม่ต้องมี perfect pitch', 'ฟังเสียงต่ำเป็นฐาน แล้วร้องหรือฮัมไปหาเสียงสูง การรู้ระยะช่วยจำเมโลดี้ แม้เปลี่ยนคีย์ชื่อโน้ตเปลี่ยน แต่ระยะยังเหมือนเดิม'),
  ], room('ear', 'เลือกทายระยะคู่เสียง ฟังโจทย์จนจบ แล้วลองแยก P5 กับ P8 ก่อนอ่านคำอธิบายหลังตอบ'), [
    q('C ไป G สูงขึ้นกี่ครึ่งเสียง?', ['4', '7', '12'], 1, 'C–G เป็น Perfect 5 หรือ 7 ครึ่งเสียง'),
    q('ระยะ 12 ครึ่งเสียงเรียกว่าอะไร?', ['Minor 3', 'Major 2', 'Octave'], 2, '12 ครึ่งเสียงคือหนึ่งอ็อกเทฟหรือ P8'),
    q('เมื่อย้ายเมโลดี้ทั้งชุดขึ้นเท่ากัน ระยะคู่เสียงเปลี่ยนหรือไม่?', ['ไม่เปลี่ยน', 'เปลี่ยนเป็น Major ทั้งหมด', 'ต้องเพิ่มสองเท่า'], 0, 'การ transpose เลื่อนทุกโน้ตเท่ากัน จึงรักษาระยะระหว่างโน้ต'),
  ], { label: 'ฟัง C4 → G4', midis: [60, 67] }),
  lesson('sound-reference', 1, 'ใช้เสียงอ้างอิงช่วยจำชื่อโน้ต', 'ฝึกหูโดยมีจุดตั้งต้นที่ชัดเจน', [
    b('C4 เป็นโดกลาง', 'แอปใช้ fixed-do คือ C=โด D=เร E=มี F=ฟา G=ซอล A=ลา B=ที ชื่อเหล่านี้คงตามชื่อโน้ต ไม่เปลี่ยนตามคีย์ในแบบฝึกนี้', 'C4 เป็นโดกลาง · A4 มาตรฐาน = 440 Hz'),
    b('ฟังอ้างอิงก่อนโจทย์ได้', 'การทายชื่อโน้ตโดยไม่มีจุดอ้างอิงยากกว่าการเทียบเสียงมาก ให้ฟัง C4 ก่อน แล้วเทียบว่าโจทย์สูงกว่าเท่าไร จดคู่ที่สับสนโดยไม่เดาจากความดัง'),
  ], room('ear', 'ฟังปุ่ม C4 อ้างอิง จากนั้นฟังโจทย์ชื่อโน้ตให้จบก่อนตอบ เริ่ม 7 โน้ตธรรมชาติก่อน'), [
    q('A4 ที่ใช้เป็นมาตรฐานมีความถี่เท่าไร?', ['220 Hz', '880 Hz', '440 Hz'], 2, 'A4 ใช้ 440 Hz ในการจูนแบบมาตรฐานนี้'),
    q('fixed-do ในแอป C แทนชื่อใด?', ['โด', 'ซอล', 'ลา'], 0, 'ใน fixed-do ชื่อโดผูกกับ C'),
    q('วิธีเริ่มฝึกทายชื่อโน้ตที่เหมาะสมคืออะไร?', ['เดาจากความดัง', 'ฟังเสียงอ้างอิงแล้วเทียบระยะ', 'หลีกเลี่ยงเสียงอ้างอิงเสมอ'], 1, 'การเทียบระยะจากเสียงที่รู้จักเป็นวิธีฝึกที่นำไปใช้ได้จริง'),
  ], { label: 'ฟัง C4 อ้างอิง', midis: [60] }),
  lesson('enharmonic', 1, 'ชาร์ป แฟลต และชื่อที่เสียงเท่ากัน', 'อ่านชื่อโน้ตให้เข้ากับบริบทของคอร์ด', [
    b('ขึ้นครึ่งเสียง ลงครึ่งเสียง', '♯ ยกหนึ่งครึ่งเสียง ♭ ลดหนึ่งครึ่งเสียง บนกีตาร์ตั้งสายปกติและระบบแบ่งเท่า C♯ กับ D♭ อยู่เฟรตเดียวกัน แต่สะกดต่างกันตามหน้าที่ในเพลง'),
    b('ชื่อไม่ได้มีไว้บอกเฟรตอย่างเดียว', 'คอร์ด Cm สะกด C E♭ G แทน C D♯ G เพราะต้องการบอกโครงสร้างราก–สาม–ห้า ชื่อเทียบเสียงเหมือนกันได้ แต่หน้าที่ทางทฤษฎีต่างกัน'),
  ], room('fretboard', 'เลือก 12 โน้ต รวม # / ♭ แล้วหา C♯ ระหว่าง C กับ D พิจารณาว่า D♭ คือเสียงเดียวกัน'), [
    q('♭ ทำให้เสียงเปลี่ยนอย่างไร?', ['สูงขึ้นสองเฟรต', 'ต่ำลงหนึ่งครึ่งเสียง', 'สูงขึ้นหนึ่งอ็อกเทฟ'], 1, 'แฟลตลดโน้ตลงหนึ่งครึ่งเสียง'),
    q('C♯ กับ D♭ ในระบบแบ่งเท่าเป็นอย่างไร?', ['เสียงสูงเท่ากัน แต่สะกดต่าง', 'ห่างกันหนึ่งอ็อกเทฟ', 'เป็นคนละเฟรตเสมอ'], 0, 'เรียกว่า enharmonic equivalents ใช้เสียงเดียวกันแต่บริบทชื่อแตกต่าง'),
    q('เสียงสามของ Cm ควรสะกดอย่างไร?', ['D♯', 'F', 'E♭'], 2, 'เสียงสามต้องใช้ตัวอักษร E จึงสะกด E♭'),
  ]),
  lesson('barre', 1, 'คอร์ดทาบและรูปจับที่เลื่อนได้', 'ใช้รากคอร์ดช่วยหาตำแหน่งใหม่', [
    b('นิ้วชี้แทนสายเปิด', 'คอร์ดทาบนำรูปจับที่เลื่อนได้ไปวางบนเฟรตใหม่ นิ้วชี้ทาบแทนจุดที่เดิมใช้สายเปิด แต่ทุกรูปไม่ได้เลื่อนได้โดยเก็บสายเปิดเดิมเสมอ'),
    b('เริ่มจาก F รูป E', 'F แบบเต็มคือ 1 3 3 2 1 1 เรียงสาย 6 ถึง 1 รากต่ำอยู่สาย 6 เฟรต 1 ขยับทั้งรูปขึ้นสองเฟรตจะได้ G รูปเดียวกัน', 'F = 133211 · G รูปทาบ = 355433'),
  ], room('chords', 'ค้นหา F กรองคอร์ดทาบ ดูแนวทาบและนิ้ว จากนั้นเปรียบเทียบ G รูปทาบ อย่าฝืนข้อมือ'), [
    q('F รูปทาบ 133211 มีรากต่ำอยู่ที่ใด?', ['สาย 1 เฟรต 3', 'สาย 5 เฟรต 1', 'สาย 6 เฟรต 1'], 2, 'สาย 6 เฟรต 1 เป็น F2 ซึ่งเป็นรากต่ำของรูปคอร์ดนี้'),
    q('เลื่อนรูป F ทั้งหมดขึ้นสองเฟรต ได้คอร์ดใด?', ['G', 'E', 'A♭'], 0, 'F ขึ้นสองครึ่งเสียงเป็น G โดยรูป Major ยังคงเดิม'),
    q('คอร์ดที่ยังใช้สายเปิดเดิม เลื่อนนิ้วบางส่วนแล้วเป็นคอร์ดเดิมที่สูงขึ้นเสมอหรือไม่?', ['เสมอ', 'ไม่เสมอ ต้องตรวจทุกโน้ต', 'เสมอถ้าใช้นิ้วชี้'], 1, 'สายเปิดที่ไม่เลื่อนทำให้ความสัมพันธ์โน้ตเปลี่ยน จึงต้องตรวจองค์ประกอบคอร์ด'),
  ]),
  lesson('sevenths', 2, 'maj7, 7 และ m7 ฟังและคิดต่างกัน', 'เพิ่มเสียงเจ็ดโดยไม่สับสนกับเลขชื่อคอร์ด', [
    b('สามสูตรที่ใช้บ่อย', 'maj7 ใช้ 0–4–7–11, dominant 7 ใช้ 0–4–7–10 และ m7 ใช้ 0–3–7–10 อย่าตัดสินคุณภาพจากเลข 7 อย่างเดียว', 'Cmaj7 = C E G B · C7 = C E G B♭ · Cm7 = C E♭ G B♭'),
    b('ฟังแรงดึงของเสียงเจ็ด', 'ฟังคอร์ดสามเสียงก่อนแล้วเพิ่มเสียงเจ็ด เปรียบเทียบ C กับ Cmaj7 และ C7 ระวังอย่าแปล C7 ว่า C major seventh เพราะสัญลักษณ์ต่างกัน'),
  ], room('chords', 'ค้นหา Cmaj7, C7 และ Cm7 ดูสูตรและโน้ต แล้วฟังทีละคอร์ดโดยคงราก C'), [
    q('C7 มีโน้ตใด?', ['C E G B', 'C E G B♭', 'C E♭ G B'], 1, 'C7 หมายถึง dominant seventh จึงใช้ B♭ เป็นเสียงเจ็ด'),
    q('maj7 ห่างจากรากกี่ครึ่งเสียง?', ['9', '10', '11'], 2, 'Major seventh ห่างราก 11 ครึ่งเสียง'),
    q('Cm7 ต่างจาก C7 ที่ใด?', ['เสียงสาม E ลดเป็น E♭', 'ราก C เปลี่ยนเป็น D', 'ไม่มีเสียงเจ็ด'], 0, 'ทั้งคู่ใช้เสียงเจ็ดเล็ก B♭ แต่ Cm7 ใช้เสียงสามเล็ก E♭'),
  ], { label: 'ฟัง Cmaj7 → C7', groups: [[60, 64, 67, 71], [60, 64, 67, 70]] }),
  lesson('diminished', 2, 'dim กับ dim7 ต่างกันหนึ่งเสียงสำคัญ', 'เข้าใจคอร์ดลดและใช้สีเสียงอย่างตั้งใจ', [
    b('Diminished triad', 'dim ใช้ราก เสียงสามเล็ก และเสียงห้าลด สูตร 0–3–6 จากราก ตัวอย่าง Cdim คือ C E♭ G♭ ไม่ใช่คอร์ด Minor ธรรมดาที่ใช้ G'),
    b('Fully diminished seventh', 'dim7 เพิ่มเสียงเจ็ดลด สูตร 0–3–6–9 ตัวอย่าง Cdim7 คือ C E♭ G♭ B𝄫 โดย B double-flat มีเสียงเท่ากับ A ในระบบแบ่งเท่า ส่วน m7♭5 ใช้เสียงเจ็ดเล็ก 10 ครึ่งเสียง จึงเป็นอีกคอร์ดหนึ่ง', 'Cdim = C E♭ G♭ · Cdim7 = C E♭ G♭ B𝄫 (เสียง A)'),
  ], room('chords', 'ค้นหา Cdim แล้ว Cdim7 ฟังแบบแยกเสียง สังเกตว่า dim7 เพิ่มอีกหนึ่งเสียงจาก dim'), [
    q('สูตร dim triad คืออะไร?', ['0–3–7', '0–4–7', '0–3–6'], 2, 'Diminished triad มีไมเนอร์สามกับเสียงห้าลด'),
    q('dim7 เพิ่มเสียงห่างรากกี่ครึ่งเสียง?', ['9', '10', '11'], 0, 'Fully diminished seventh ใช้ diminished seventh ซึ่งห่าง 9 ครึ่งเสียง'),
    q('Cdim7 สะกดเสียงเจ็ดเป็นอะไร?', ['B♭', 'B𝄫 ซึ่งมีเสียงเท่า A', 'B ธรรมชาติ'], 1, 'ต้องใช้ตัวอักษร B สำหรับเสียงเจ็ด แล้วลดสองครั้งเป็น B double-flat'),
  ], { label: 'ฟัง Cdim → Cdim7', groups: [[60, 63, 66], [60, 63, 66, 69]] }),
  lesson('travis', 2, 'Travis picking: เบสต้องเดินเองได้', 'แยกหน้าที่โป้งออกจากนิ้วเมโลดี้', [
    b('สร้างเครื่องยนต์ที่นิ้วโป้ง', 'ฝึกนิ้วโป้งสลับเบสบนจังหวะ 1 2 3 4 ก่อนเติมสายแหลมในจังหวะยก เสียงเบสอาจเป็นราก สายที่ให้เสียงในคอร์ด หรืออ็อกเทฟ ตามรูปจับที่ใช้'),
    b('อย่าทำให้ทุกเสียงเน้นเท่ากัน', 'ให้เบสสม่ำเสมอและมีเมโลดี้ด้านบน เมื่อเติมนิ้วแล้วโป้งสะดุด ให้กลับไปฝึกโป้งเดี่ยว ในห้องฝึก C สลับสาย 5 กับ 4 คือ C กับ E ซึ่งต่างก็เป็นเสียงในคอร์ด'),
  ], room('fingerstyle', 'เลือก Travis picking 50–60 BPM ฟังโป้งบนจังหวะเลข แล้วเติม M/A ในจังหวะ & โดยไม่เร่ง'), [
    q('นิ้วใดดูแลเบสสลับเป็นหลัก?', ['I', 'P', 'A'], 1, 'P หรือนิ้วโป้งเล่นเบส ส่วน I/M/A ช่วยสายแหลมตามแพตเทิร์น'),
    q('เมื่อเติมสายแหลมแล้วเบสสะดุดควรทำอย่างไร?', ['เร่งทันที', 'ตัดเบสทิ้ง', 'แยกฝึกโป้งช้า ๆ อีกครั้ง'], 2, 'สร้างจังหวะโป้งให้มั่นคงก่อนค่อยประกอบเสียงอื่น'),
    q('คอร์ด C สาย 5 เฟรต 3 และสาย 4 เฟรต 2 คือโน้ตใด?', ['C และ E', 'C และ F', 'G และ B'], 0, 'สาย 5 เฟรต 3 เป็น C3 และสาย 4 เฟรต 2 เป็น E3'),
  ]),
  lesson('pinch-melody', 2, 'ให้เบสกับเมโลดี้ดังพร้อมกัน', 'ฝึก pinch และการแยกน้ำหนักเสียง', [
    b('Pinch คือดีดคนละสายพร้อมกัน', 'ใช้ P คู่กับ A หรือ M ให้สองสายเริ่มเสียงพร้อมกัน แล้วผ่อนนิ้วกลับ ไม่บีบมือแรง การเขียนสองเลขในแนวตั้งเดียวกันบน TAB สื่อถึงการเล่นพร้อมกัน'),
    b('เมโลดี้เป็นเสียงที่ต้องฟังออก', 'ลองทำให้สายแหลมชัดกว่าเบสเล็กน้อย โดยเบสยังคงสม่ำเสมอ ความดังไม่ได้กำหนดระดับเสียงสูงต่ำ การแยกน้ำหนักต้องอาศัยการฟังและควบคุมแรงดีด'),
  ], room('fingerstyle', 'เลือกเบส + เมโลดี้ 60 BPM ฟังช่อง P+A และ P+M แล้วดีดสองสายให้เริ่มพร้อมกัน'), [
    q('P+A หมายถึงอะไร?', ['เล่นโป้งแล้วหยุดหนึ่งห้อง', 'ดีดสายเดียวด้วยสองนิ้ว', 'โป้งกับนิ้วนางดีดพร้อมกัน'], 2, 'เครื่องหมาย + ในแพตเทิร์นนี้หมายถึงเริ่มเสียงพร้อมกัน'),
    q('จะทำให้เมโลดี้ชัดขึ้นควรปรับอะไร?', ['น้ำหนักการดีดสายเมโลดี้', 'เปลี่ยนทุกโน้ตให้สูงขึ้น', 'เพิ่มความเร็วเสมอ'], 0, 'การเน้นเมโลดี้เป็นเรื่องสมดุลความดัง ไม่จำเป็นต้องเปลี่ยนโน้ตหรือ BPM'),
    q('เลขสองตัวแนวตั้งเดียวกันใน TAB ของ pinch ควรเริ่มเสียงอย่างไร?', ['ห่างกันหนึ่งจังหวะ', 'พร้อมกัน', 'เล่นเฉพาะเบส'], 1, 'ตำแหน่งเวลาเดียวกันใน TAB ให้เสียงเริ่มพร้อมกัน'),
  ]),
  lesson('six-eight', 2, 'จังหวะ 6/8: สองกลุ่มที่ไหลต่อกัน', 'นับหนึ่ง-ลา-ลี สอง-ลา-ลีให้เป็นธรรมชาติ', [
    b('หกช่องย่อย สองจังหวะใหญ่', '6/8 มักจัดกลุ่มเป็น 3+3 ของโน้ตเขบ็ตหนึ่งชั้น หนึ่งจังหวะใหญ่เป็นโน้ตดำประจุด จึงมีสองจังหวะใหญ่ต่อห้อง', 'นับ: 1 ลา ลี 2 ลา ลี'),
    b('อ่านหน่วย BPM ให้ชัด', 'ห้องฟิงเกอร์สไตล์นี้ตั้งหนึ่งคลิกเป็นโน้ตดำประจุด เมื่อ 60 BPM แต่ละคลิกห่างหนึ่งวินาที และแบ่งออกเป็นสามเสียงย่อย ไม่เท่ากับเล่นเขบ็ตทุกตัวที่ 60 ครั้งต่อนาที'),
  ], room('fingerstyle', 'เลือกไหลลื่น 6/8 ที่ 60 BPM นับสองกลุ่มต่อห้องและให้เสียงในกลุ่มห่างเท่ากัน'), [
    q('6/8 แบบที่ใช้ในห้องฝึกจัดกลุ่มอย่างไร?', ['3+3', '2+2+2 เสมอ', '4+2 เสมอ'], 0, 'การนับสองจังหวะใหญ่แบ่งเขบ็ตเป็นสองกลุ่ม กลุ่มละสาม'),
    q('หนึ่งคลิกของ 6/8 ในห้องนี้แทนอะไร?', ['เขบ็ตหนึ่งชั้น', 'โน้ตดำประจุด', 'โน้ตขาว'], 1, 'โน้ตดำประจุดมีความยาวเท่าเขบ็ตหนึ่งชั้นสามตัว'),
    q('หนึ่งห้อง 6/8 มีเสียงย่อยเขบ็ตต่อเนื่องกี่ตัว?', ['4', '8', '6'], 2, 'มีเขบ็ตหกตัวหรือสองกลุ่ม กลุ่มละสาม'),
  ]),
  lesson('inversions', 2, 'คอร์ดเดิม เบสใหม่: การกลับคอร์ด', 'ดูโน้ตต่ำสุดและแยกชื่อคอร์ดออกจากรูปจับ', [
    b('รากไม่จำเป็นต้องอยู่ต่ำสุด', 'C ประกอบด้วย C E G ถ้าให้ E ต่ำสุดจะเป็น C/E และถ้าให้ G ต่ำสุดจะเป็น C/G ชุดเสียงหลักเหมือนเดิมแต่แนวเบสเปลี่ยน', 'C: C E G · C/E: E G C · C/G: G C E'),
    b('เลือกตำแหน่งเพื่อเมโลดี้', 'ฟิงเกอร์สไตล์อาจใช้รูปคอร์ดที่ทำให้เมโลดี้อยู่สายบนหรือเบสเดินต่อเนื่อง คอร์ดชื่อเดียวกันจึงมีหลาย voicing แต่ต้องตรวจทุกเสียงจริง ไม่เลื่อนนิ้วแบบเดาสุ่ม'),
  ], room('chords', 'เลือกคอร์ดเดียวกันหลายรูปจับ ดูโน้ตในแต่ละสาย แล้วระบุว่าโน้ตต่ำสุดคือรากหรือเสียงใดในคอร์ด'), [
    q('C/E หมายถึงอะไร?', ['คอร์ด E major', 'คอร์ด C ที่มี E เป็นเบส', 'สลับ C และ E ทุกจังหวะ'], 1, 'โน้ตหลัง slash บอกโน้ตเบส ในที่นี้เบสคือ E'),
    q('โน้ตหลักใน C major มีอะไร?', ['C F A', 'C E♭ G', 'C E G'], 2, 'C major triad มี C E G แม้จัดลำดับใหม่ก็ยังใช้ชุดนี้'),
    q('Voicing ต่างกันได้โดยอะไรคงเดิม?', ['ชนิดและองค์ประกอบคอร์ดหลัก', 'ตำแหน่งนิ้วทุกนิ้ว', 'สายที่ใช้ทุกสาย'], 0, 'การจัดเสียงและตำแหน่งเปลี่ยนได้โดยยังเป็นคอร์ดชนิดเดิม'),
  ]),
  lesson('voice-leading', 3, 'เปลี่ยนคอร์ดให้น้อยแต่ต่อเนื่อง', 'มองหาเสียงร่วมและเตรียมนิ้วก่อนห้องถัดไป', [
    b('เก็บเสียงร่วมเป็นสะพาน', 'C มี C E G ส่วน Am มี A C E ทั้งสองมี C กับ E ร่วมกัน จึงลองเก็บนิ้วหรือเสียงที่ต่อเนื่องไว้ แล้วขยับเฉพาะส่วนจำเป็นตามรูปจับ'),
    b('วางเมโลดี้ให้มีทิศทาง', 'ลองร้องเสียงบนก่อนกำหนดคอร์ด ไม่จำเป็นต้องให้ทุกเสียงกระโดดตามรากพร้อมกัน ฝึกช้าแล้วตรวจว่ามีเสียงที่ไม่ตั้งใจดับหรือชนกันหรือไม่'),
  ], room('chords', 'เลือกวง C–Am–F–G ที่ 60 BPM สังเกตเสียงร่วม C กับ E ระหว่าง C และ Am แล้วเตรียมคอร์ดก่อนจังหวะหนึ่ง'), [
    q('C และ Am มีโน้ตใดร่วมกัน?', ['G และ A', 'D และ F', 'C และ E'], 2, 'C=C E G และ Am=A C E จึงมี C กับ E ร่วมกัน'),
    q('Voice leading ที่ต่อเนื่องมักพิจารณาอะไร?', ['การเคลื่อนแต่ละเสียงให้น้อยและมีเหตุผล', 'ให้ทุกเสียงกระโดดเท่ากัน', 'เปลี่ยนความเร็วก่อนทุกคอร์ด'], 0, 'พิจารณาแต่ละแนวเสียงและเสียงร่วมเพื่อเชื่อมคอร์ดให้ลื่นไหล'),
    q('ควรเริ่มเตรียมนิ้วคอร์ดถัดไปเมื่อไร?', ['หลังจังหวะหนึ่งผ่านไปแล้วเท่านั้น', 'มองและวางแผนก่อนถึงจังหวะหนึ่ง', 'ไม่ต้องวางแผน'], 1, 'การมองล่วงหน้าช่วยเปลี่ยนตรงต้นห้อง โดยคงเสียงเดิมเท่าที่จำเป็น'),
  ]),
  lesson('practice-loop', 3, 'ทำวลีสั้นให้เป็นเพลงของเรา', 'ตั้งเป้าฟังได้จริงและทบทวนโดยไม่เร่งตัวเอง', [
    b('หนึ่งรอบ หนึ่งเป้าหมาย', 'เลือกเพียงเรื่องเดียว เช่น เบสตรงคลิก เมโลดี้ชัด หรือเปลี่ยนคอร์ดไม่สะดุด ฟังหนึ่งวลี เล่นตาม แล้วหยุดประเมินด้วยหู ไม่ตีความจำนวนรอบว่าเล่นถูกทั้งหมด'),
    b('เพิ่มความเร็วเมื่อคุณภาพคงอยู่', 'เมื่อเล่นช้าได้หลายรอบโดยสบายมือ ค่อยเพิ่มทีละ 5 BPM หากเริ่มเกร็งให้ลดลง การพักและฝึกสั้นสม่ำเสมอช่วยให้สังเกตข้อผิดพลาดได้ดีกว่าฝืนยาว'),
  ], room('fingerstyle', 'เลือกแพตเทิร์นที่ชอบ เล่นครบ 4 ห้องหนึ่งครั้ง แล้วบอกตัวเองว่าเบส จังหวะ และเมโลดี้ ส่วนใดควรปรับ'), [
    q('จำนวนวลีที่เครื่องเล่นเดินครบยืนยันอะไร?', ['ผู้ใช้เล่นถูกทุกโน้ต', 'เครื่องเล่นเดินครบวลี ยังไม่ยืนยันฝีมือผู้ใช้', 'เมโลดี้ดังสมดุลแล้ว'], 1, 'ตัวนับเป็นกิจกรรมการฝึก ไม่ได้ตรวจการเล่นจริงจากไมค์'),
    q('เมื่อเล่นคล่องควรเพิ่มความเร็วอย่างไร?', ['เพิ่มเป็นสองเท่าทันที', 'เพิ่มทุกวินาที', 'ทีละประมาณ 5 BPM พร้อมฟังคุณภาพ'], 2, 'เพิ่มทีละน้อยและคงความผ่อนคลายกับจังหวะให้ได้'),
    q('เป้าหมายหนึ่งรอบแบบใดตรวจด้วยหูได้ชัด?', ['ให้เบสตรงคลิกทั้ง 4 ห้อง', 'ต้องเก่งทุกเรื่องทันที', 'ต้องเร็วที่สุดเสมอ'], 0, 'เป้าหมายเล็กและสังเกตได้ช่วยประเมินและปรับการฝึกจริง'),
  ]),
];

const localDay = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const validDay = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(new Date(`${value}T12:00:00`).getTime()) && localDay(new Date(`${value}T12:00:00`)) === value;
const stamp = value => typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : typeof value === 'string' ? Date.parse(value) : NaN;
const count = value => Number.isFinite(Number(value)) ? Math.max(0, Math.floor(Number(value))) : 0;
const LEVEL_NAMES = { beginner: 'เริ่มต้น', intermediate: 'ต่อยอด', advanced: 'ท้าทาย' };
const GOAL_NAMES = { fingerstyle: 'เบสกับเมโลดี้', notes: 'แผนที่โน้ตบนคอ', ear: 'หูและความสัมพันธ์ของเสียง' };
const goalOrder = {
  fingerstyle: LESSONS.map(item => item.id),
  notes: ['guitar-map', 'half-steps', 'octave-map', 'enharmonic', 'intervals', 'triads', 'open-chords', 'barre', 'inversions', 'voice-leading'],
  ear: ['half-steps', 'sound-reference', 'intervals', 'octave-map', 'triads', 'enharmonic', 'sevenths', 'diminished', 'voice-leading'],
};

/** Pure, deterministic daily checklist. Existing plan IDs win; today's work never moves its own goalposts. */
export function getDailyPlan(data = {}, requestedDay = localDay()) {
  const day = validDay(requestedDay) ? requestedDay : localDay();
  const profile = data.profile || {};
  const level = Object.hasOwn(LEVEL_NAMES, profile.level) ? profile.level : 'beginner';
  const goal = Object.hasOwn(GOAL_NAMES, profile.goal) ? profile.goal : 'fingerstyle';
  const minutes = [10, 15, 20, 30].includes(Number(profile.minutes)) ? Number(profile.minutes) : 15;
  const started = validDay(profile.startedAt) ? profile.startedAt : day;
  const ordinal = date => Date.UTC(...date.split('-').map((part, index) => Number(part) - (index === 1 ? 1 : 0))) / 86400000;
  const dayIndex = Math.max(1, Math.floor(ordinal(day) - ordinal(started)) + 1);
  const beforeToday = new Date(`${day}T00:00:00`).getTime();
  const completedLessons = data.learning?.completedLessons || {};
  const priorCompletion = id => stamp(completedLessons[id]) < beforeToday;
  const preferred = [...goalOrder[goal], ...LESSONS.map(item => item.id)].filter((id, i, all) => all.indexOf(id) === i);
  const levelRank = { beginner: 0, intermediate: 1, advanced: 2 };
  const ordered = [...preferred.filter(id => levelRank[LESSONS.find(item => item.id === id).level] >= levelRank[level]), ...preferred].filter((id, i, all) => all.indexOf(id) === i);
  const saved = Array.isArray(data.learning?.plans?.[day]) ? data.learning.plans[day].filter(id => LESSONS.some(item => item.id === id) && !priorCompletion(id)).slice(0, 1) : [];
  const chosen = saved.length ? saved : ordered.filter(id => !priorCompletion(id)).slice(0, 1);
  const lessons = chosen.map(id => LESSONS.find(item => item.id === id));
  const today = data.days?.[day] || {};
  const rotation = (dayIndex - 1) % 3;
  const weak = Object.entries(data.positions || {}).map(([key, value]) => {
    const match = /^([0-5]):([0-9]|1[0-2])$/.exec(key);
    if (!match || count(value?.total) < 3) return null;
    return { si: Number(match[1]), fret: Number(match[2]), ratio: count(value.correct) / count(value.total), total: count(value.total) };
  }).filter(value => value && value.ratio < .8).sort((a, b) => a.ratio - b.ratio || b.total - a.total || a.si - b.si || a.fret - b.fret)[0];
  const budget = { 10: [3, 2, 1, 1, 3], 15: [3, 3, 2, 2, 5], 20: [4, 4, 3, 3, 6], 30: [5, 6, 5, 4, 10] }[minutes].slice();
  if (goal === 'notes') { budget[1] += 2; budget[4] -= 2; }
  if (goal === 'ear') { budget[3] += 2; budget[4] -= 2; }
  if (!lessons.length) { budget[goal === 'notes' ? 1 : goal === 'ear' ? 3 : 4] += budget[0]; budget[0] = 0; }
  const difficulty = levelRank[level];
  const fretTarget = Math.max(3, Math.round((5 + difficulty * 3) * minutes / 15));
  const earTarget = Math.max(3, Math.round((4 + difficulty * 2) * minutes / 15));
  const range = level === 'beginner' ? '0–3' : level === 'intermediate' ? '0–5' : '0–12';
  const guidedRange = Math.max([3, 5, 12][difficulty], weak ? weak.fret <= 3 ? 3 : weak.fret <= 5 ? 5 : 12 : 3);
  const fretExercise = new URLSearchParams({ mode: rotation === 1 ? 'name' : 'find', range: String(guidedRange), strings: weak ? String(weak.si) : difficulty === 0 ? '0' : 'all', notes: difficulty === 2 || (weak && noteAt(weak.si, weak.fret).name.includes('#')) ? 'all' : 'natural' });
  const fretDescription = weak ? `ทบทวน ${noteAt(weak.si, weak.fret).name}${noteAt(weak.si, weak.fret).octave} สาย ${weak.si + 1} เฟรต ${weak.fret} ที่เคยสับสน แล้วตอบแบบฝึกให้ครบ เปลี่ยนช่วงเฟรตให้ครอบคลุมตำแหน่งนี้ด้วย` : `เลือก${rotation === 1 ? 'ทายชื่อโน้ต' : 'หาโน้ต'} เฟรต ${range} ${difficulty === 0 ? 'ทีละสาย เริ่มสาย 1' : 'ทุกสาย'} ${difficulty === 2 ? 'รวมชาร์ปและแฟลต' : 'โน้ตธรรมชาติ'} นับทุกคำตอบเพื่อให้ได้ฝึก ไม่ใช้จำนวนข้อแทนความชำนาญ`;
  const patternName = difficulty === 0 ? 'อาร์เพจจิโอ' : rotation === 0 ? 'Travis picking' : rotation === 1 ? 'เบส + เมโลดี้' : 'ไหลลื่น 6/8';
  const tasks = [];
  if (lessons.length) {
    const item = lessons[0];
    const finished = Number.isFinite(stamp(completedLessons[item.id])) && localDay(new Date(stamp(completedLessons[item.id]))) === day;
    tasks.push({ id: `lesson:${item.id}`, lessonId: item.id, kind: 'lesson', title: item.title, description: 'อ่านตัวอย่าง ยืนยันว่าอ่านแล้ว และทำแบบทดสอบ 3 ข้อให้ถูกครบเพื่อจบบทเรียน', target: 1, current: finished ? 1 : 0, minutes: budget[0], href: `#learn?lesson=${item.id}` });
  }
  tasks.push(
    { id: 'daily:fretboard', kind: 'fretboard', title: weak ? 'เก็บโน้ตที่ยังสับสน' : 'จำคอกีตาร์ทีละตำแหน่ง', description: fretDescription, target: fretTarget, current: count(today.fretboard), minutes: budget[1], href: `#fretboard?${fretExercise}` },
    { id: 'daily:chords', kind: 'chords', title: difficulty === 2 ? 'ฟังสีคอร์ดและวางนิ้ว' : 'คอร์ดใสก่อนเปลี่ยนเร็ว', description: difficulty === 2 ? 'ค้นหา dim และ dim7 เทียบโน้ตและเสียง จากนั้นเลือกคอร์ดที่อยากใช้จริง ฟังหรือฝึกตามปุ่มในห้องคอร์ด' : `เลือก ${rotation === 0 ? 'C และ Am' : rotation === 1 ? 'G และ D' : 'Em และ F'} ดีดแยกทีละสาย ฟังเสียงบอด และใช้ปุ่มฝึก 30 วินาทีเมื่อพร้อม จำนวนกิจกรรมไม่ยืนยันว่าจับถูกทุกสาย`, target: minutes >= 20 ? 3 : 2, current: count(today.chords), minutes: budget[2], href: '#chords' },
    { id: 'daily:ear', kind: 'ear', title: goal === 'ear' ? 'ฟัง เทียบ แล้วจึงตอบ' : 'ให้หูช่วยจำโน้ต', description: difficulty === 0 ? 'ฟัง C4 อ้างอิงก่อน แล้วเลือกทายชื่อโน้ตธรรมชาติ ฟังโจทย์จนจบและอ่านคำอธิบายหลังตอบ' : 'สลับฝึกชื่อโน้ตกับระยะคู่เสียง ฮัมจากเสียงต่ำไปเสียงสูงก่อนตอบ จดว่าคู่ใดสับสนโดยไม่เร่งเดา', target: earTarget, current: count(today.ear), minutes: budget[3], href: '#ear' },
    { id: 'daily:fingerstyle', kind: 'fingerstyle', title: 'เชื่อมสองมือให้ครบวลี', description: `เลือก ${patternName} ที่ ${difficulty === 0 ? '50–60' : difficulty === 1 ? '60–80' : '70–90'} BPM ชุด C–Am–F–G หรือ G–D–Em–C ให้เบสตรงคลิกและฟังเมโลดี้ ตัวนับยืนยันว่าเครื่องเล่นครบ 4 ห้อง ยังไม่ตรวจการเล่นจริง`, target: minutes >= 30 ? 3 : minutes >= 20 ? 2 : 1, current: count(today.fingerstyle), minutes: budget[4], href: '#fingerstyle' },
  );
  for (const task of tasks) { task.current = Math.min(task.target, task.current); task.complete = task.current >= task.target; }
  const completed = tasks.filter(task => task.complete).length;
  return { title: `แผนวันที่ ${dayIndex} · ${minutes} นาทีของเรา`, subtitle: `${LEVEL_NAMES[level]} · เน้น${GOAL_NAMES[goal]} · ตั้งใจฝึกทีละเรื่อง`, focus: weak ? `ทบทวนโน้ตที่เคยสับสน แล้วค่อยต่อเป็นวลี` : GOAL_NAMES[goal], minutes, dayIndex, level, lessons, tasks, completed, total: tasks.length, percent: Math.round(completed / tasks.length * 100), nextTask: tasks.find(task => !task.complete) || null };
}

export function renderLearning(container, { store, audio, onProfileChange = () => {}, lessonId } = {}) {
  let disposed = false;
  let soundToken = 0;
  const timers = new Map();
  const attempts = new Map();
  let quizIndex = 0;
  let selectedAnswer = null;
  let answers = [];
  let read = false;
  const initialPlan = getDailyPlan(store.data);
  store.getOrCreatePlan?.(localDay(), initialPlan.lessons.map(item => item.id));
  const queryLesson = globalThis.location?.hash?.split('?')[1];
  let selected = LESSONS.find(item => item.id === (lessonId || new URLSearchParams(queryLesson || '').get('lesson'))) || initialPlan.lessons[0] || LESSONS[0];
  const completed = id => Number.isFinite(stamp(store.data.learning?.completedLessons?.[id]));
  const delay = (ms, run) => new Promise(resolve => {
    const id = setTimeout(() => { timers.delete(id); resolve(!disposed && run === soundToken); }, ms);
    timers.set(id, resolve);
  });
  function stopAudio() { soundToken += 1; for (const [id, resolve] of timers) { clearTimeout(id); resolve(false); } timers.clear(); audio?.stopAll?.(); }
  function persistAttempt() { attempts.set(selected.id, { quizIndex, selectedAnswer, answers: answers.slice(), read }); }
  function setLesson(id) {
    const next = LESSONS.find(item => item.id === id);
    if (!next || disposed) return;
    persistAttempt(); stopAudio(); selected = next;
    const saved = attempts.get(id) || { quizIndex: 0, selectedAnswer: null, answers: [], read: false };
    ({ quizIndex, selectedAnswer, read } = saved); answers = saved.answers.slice();
    if (globalThis.history?.replaceState) history.replaceState(null, '', `#learn?lesson=${id}`);
    draw();
    container.querySelector('[data-lesson-heading]')?.focus();
  }
  function draw() {
    const plan = getDailyPlan(store.data);
    const name = escapeHTML(store.data.profile?.displayName || 'เรา');
    const done = LESSONS.filter(item => completed(item.id)).length;
    container.innerHTML = `${heading('YOUR GUIDED LEARNING PATH', 'พี่พาฝึก ทีละเรื่อง ทีละวัน', `${name} เลือกเดินตามแผน หรือเปิดบทที่สนใจก่อนได้ ไม่มีบทไหนถูกล็อกค่ะ`)}
      <section class="panel learn-daily"><div><span class="eyebrow">TODAY’S SMALL STEPS</span><h2>${plan.title}</h2><p>${plan.subtitle}</p><span class="learn-focus">${plan.focus}</span></div><div class="learn-daily-progress"><strong>${plan.completed}<small> / ${plan.total}</small></strong><span>กิจกรรมวันนี้</span></div><div class="learn-task-grid">${plan.tasks.map(task => `<a href="${task.href}" class="learn-task${task.complete ? ' is-complete' : ''}"><span class="learn-task-check">${task.complete ? '✓' : '○'}</span><span><b>${task.title}</b><small>${task.minutes} นาที · ${task.current}/${task.target} ${task.kind === 'lesson' ? 'บท' : task.kind === 'fingerstyle' ? 'วลี' : task.kind === 'chords' ? 'กิจกรรม' : 'ข้อ'}</small></span><span aria-hidden="true">↗</span></a>`).join('')}</div><p class="learn-plan-note">เวลาเป็นแนวทางแบ่งการฝึก ไม่ใช่เวลาที่ระบบยืนยันว่าเล่นถูก · แผนวันนี้คงเดิมเมื่อทำกิจกรรมสำเร็จ</p></section>
      <div class="learn-layout"><aside class="panel learn-course"><div class="learn-course-heading"><span class="eyebrow">THE WHOLE JOURNEY</span><strong>${done} / ${LESSONS.length} บท</strong></div><div class="learn-course-track"><i style="width:${done / LESSONS.length * 100}%"></i></div>${CHAPTERS.map((chapter, index) => `<section class="learn-chapter"><h2><span>0${index + 1}</span>${chapter.title}</h2>${LESSONS.filter(item => item.chapter === chapter.id).map(item => `<button type="button" data-lesson="${item.id}" class="learn-lesson-link${selected.id === item.id ? ' is-selected' : ''}" aria-current="${selected.id === item.id ? 'step' : 'false'}"><span>${completed(item.id) ? '✓' : String(LESSONS.indexOf(item) + 1).padStart(2, '0')}</span><span>${item.title}</span>${plan.lessons.some(recommended => recommended.id === item.id) ? '<small>วันนี้</small>' : ''}</button>`).join('')}</section>`).join('')}</aside>
      <article class="panel learn-detail"><div class="learn-detail-top"><span class="eyebrow">${LEVEL_NAMES[selected.level]} · ${selected.chapterTitle}</span><span class="learn-completion-badge">${completed(selected.id) ? '✓ เรียนผ่านแล้ว · ทบทวนได้' : 'อ่าน + เช็กความเข้าใจ 3 ข้อ'}</span></div><h2 data-lesson-heading tabindex="-1">${selected.title}</h2><p class="learn-summary">${selected.summary}</p><div class="learn-reading">${selected.blocks.map((block, i) => `<section><span class="learn-block-number">0${i + 1}</span><div><h3>${block.title}</h3><p>${block.text}</p>${block.example ? `<div class="learn-example">${block.example}</div>` : ''}</div></section>`).join('')}</div>${selected.audio ? `<button type="button" class="btn btn-secondary learn-listen" data-listen>${icon('volume')} ${selected.audio.label}</button><p class="learn-audio-status" role="status" data-audio-status>เสียงตัวอย่างสังเคราะห์ · เปิดเสียงเมื่อกดปุ่ม</p>` : ''}<div class="learn-try"><span class="eyebrow">TRY IT ON YOUR GUITAR</span><p>${selected.practice.instructions}</p><a class="btn btn-secondary" href="${selected.practice.href}">เปิดห้องฝึก ${icon('arrow')}</a><small>เลือกการตั้งค่าตามคำแนะนำด้วยตัวเอง แล้วกลับมาทำแบบทดสอบได้ค่ะ</small></div><label class="learn-read-confirm"><input type="checkbox" data-read ${read ? 'checked' : ''}><span>อ่านตัวอย่างแล้ว และพร้อมเช็กความเข้าใจ</span></label><section class="learn-quiz" data-quiz aria-label="แบบทดสอบความเข้าใจ"></section></article></div>`;
    drawQuiz();
  }
  function drawQuiz() {
    const el = container.querySelector('[data-quiz]');
    if (!el) return;
    if (quizIndex >= selected.quiz.length) {
      const score = answers.filter(Boolean).length;
      const passed = score === selected.quiz.length;
      el.innerHTML = `<span class="eyebrow">CHECK YOUR UNDERSTANDING</span><h3>${passed ? 'เข้าใจครบแล้ว เก็บบทเรียนนี้ได้เลยค่ะ' : 'เจอจุดให้ทบทวนแล้ว ลองอีกครั้งได้เสมอ'}</h3><div class="learn-quiz-score">${score}<small> / ${selected.quiz.length}</small></div><p>${passed ? read ? 'อ่านและตอบครบ พร้อมบันทึกว่าเรียนผ่านบทนี้' : 'ยืนยันว่าอ่านเนื้อหาด้านบนแล้ว เพื่อบันทึกการเรียนผ่าน' : 'กลับไปอ่านคำอธิบาย แล้วเริ่มชุดคำถามใหม่ ต้องถูกครบทั้ง 3 ข้อจึงเรียนผ่าน'}</p><div class="learn-quiz-actions">${passed ? `<button type="button" class="btn btn-primary" data-finish ${!read || completed(selected.id) ? 'disabled' : ''}>${completed(selected.id) ? '✓ บันทึกว่าเรียนผ่านแล้ว' : 'บันทึกว่าเรียนผ่าน'}</button>` : ''}<button type="button" class="btn btn-secondary" data-retry>ทำคำถามอีกครั้ง</button></div><p class="learn-save-status" role="status" data-save-status></p>`;
      return;
    }
    const question = selected.quiz[quizIndex];
    const answered = selectedAnswer !== null;
    const ok = answered && selectedAnswer === question.answer;
    el.innerHTML = `<div class="learn-quiz-heading"><span class="eyebrow">CHECK YOUR UNDERSTANDING</span><span>ข้อ ${quizIndex + 1} / ${selected.quiz.length}</span></div><h3>${question.question}</h3><div class="learn-answers">${question.options.map((option, index) => `<button type="button" data-answer="${index}" ${answered ? 'disabled' : ''} class="${answered && index === question.answer ? 'is-correct' : answered && index === selectedAnswer ? 'is-wrong' : ''}"><span>${String.fromCharCode(65 + index)}</span>${option}</button>`).join('')}</div>${answered ? `<div class="learn-feedback ${ok ? 'is-correct' : 'is-wrong'}" role="status"><strong>${ok ? 'ใช่เลยค่ะ' : 'อีกนิดเดียวค่ะ ลองจำจุดนี้ไว้'}</strong><p>${question.explanation}</p></div><button type="button" class="btn btn-primary" data-next-question>${quizIndex === selected.quiz.length - 1 ? 'ดูผลความเข้าใจ' : 'ข้อถัดไป'} ${icon('arrow')}</button>` : '<p class="learn-quiz-hint">เลือกคำตอบหนึ่งข้อ แล้วอ่านเหตุผลก่อนเดินต่อค่ะ</p>'}`;
  }
  async function playExample() {
    const example = selected.audio;
    if (!example || !audio || disposed) return;
    stopAudio(); const run = soundToken;
    const status = message => { if (!disposed && run === soundToken) { const el = container.querySelector('[data-audio-status]'); if (el) el.textContent = message; } };
    status('กำลังฟังตัวอย่าง…');
    try {
      await audio.init(); if (disposed || run !== soundToken) return;
      if (example.groups) {
        for (const group of example.groups) {
          if (disposed || run !== soundToken) return;
          await audio.playChord(group, { strum: .04, duration: 1 });
          if (disposed || run !== soundToken || !await delay(1250, run)) return;
        }
      } else {
        for (const midi of example.midis) {
          if (disposed || run !== soundToken) return;
          await audio.playNote(midi, .7);
          if (disposed || run !== soundToken || !await delay(800, run)) return;
        }
      }
      status('ฟังจบแล้ว ลองฮัมหรือหาตำแหน่งบนกีตาร์ตามเสียงค่ะ');
    } catch { status('เปิดเสียงไม่สำเร็จ ลองกดฟังอีกครั้งและตรวจอุปกรณ์เสียงค่ะ'); }
  }
  const click = event => {
    const button = event.target.closest('button');
    if (!button || button.disabled || disposed) return;
    if (button.dataset.lesson) { setLesson(button.dataset.lesson); return; }
    if (button.hasAttribute('data-listen')) { playExample(); return; }
    if (button.hasAttribute('data-answer') && selectedAnswer === null && quizIndex < selected.quiz.length) { selectedAnswer = Number(button.dataset.answer); answers[quizIndex] = selectedAnswer === selected.quiz[quizIndex].answer; persistAttempt(); drawQuiz(); return; }
    if (button.hasAttribute('data-next-question') && selectedAnswer !== null) { quizIndex += 1; selectedAnswer = null; persistAttempt(); drawQuiz(); return; }
    if (button.hasAttribute('data-retry')) { quizIndex = 0; selectedAnswer = null; answers = []; persistAttempt(); drawQuiz(); return; }
    if (button.hasAttribute('data-finish') && !completed(selected.id) && read && quizIndex === selected.quiz.length && answers.length === selected.quiz.length && answers.every(Boolean)) {
      store.completeLesson(selected.id);
      onProfileChange(); draw();
      const message = container.querySelector('[data-save-status]');
      if (message) message.textContent = store.saveError ? 'ผ่านบทเรียนแล้ว แต่เบราว์เซอร์ยังบันทึกถาวรไม่ได้ ผลอยู่ในรอบนี้ค่ะ' : 'เก็บบทเรียนนี้แล้วค่ะ ลองนำไปใช้ในห้องฝึกต่อได้เลย';
    }
  };
  const change = event => { if (event.target.hasAttribute('data-read')) { read = event.target.checked; persistAttempt(); drawQuiz(); } };
  const visibility = () => { if (document.hidden) { stopAudio(); const status = container.querySelector('[data-audio-status]'); if (status) status.textContent = 'พักเสียงแล้ว กลับมากดฟังตัวอย่างอีกครั้งเมื่อพร้อมค่ะ'; } };
  container.addEventListener('click', click); container.addEventListener('change', change); document.addEventListener('visibilitychange', visibility);
  draw();
  return () => { if (disposed) return; disposed = true; stopAudio(); container.removeEventListener('click', click); container.removeEventListener('change', change); document.removeEventListener('visibilitychange', visibility); };
}
