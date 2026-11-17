// Poptávkový formulář + chatovací asistent INNTEO.
// Obojí odesílá do formuláře „Poptávka INNTEO“ ve Wix Forms (správa webu → Formuláře, Kontakty).
import { createFormStore, FORM_ERROR, otherValue } from '/js/wix/form-store.js';

const FORM_ID = 'f184d738-80ae-4652-8fd5-c6ef15f58f0a';
const T = {
  name: 'jmeno_a_prijmeni_ks7yc2',
  email: 'e_mail_23i02e',
  phone: 'telefon_eogjdu',
  company: 'firma_vmr8ys',
  service: 'co_poptavate_lw4vxt',
  object: 'typ_objektu_t725z8',
  location: 'lokalita_po5av7',
  area: 'plocha_m_ukqdbs',
  message: 'zprava_21lpvb',
  consent: 'souhlasim_se_zpracovanim_osobn_flcppx',
};
const SERVICES = ['Klimatizace', 'Tepelné čerpadlo', 'Rekuperace / vzduchotechnika', 'Kotelna / vytápění', 'Měření a regulace (MaR)', 'Servis a údržba'];
const OBJECTS = ['Kancelář', 'Obchod / provozovna', 'Výroba / hala', 'Bytový dům', 'Rodinný dům'];
const PHONE = '+420 602 705 240';
const EMAIL = 'info@innteo.net';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* ---------------- odeslání do Wix Forms ---------------- */
const store = createFormStore({ formId: FORM_ID });
store.start();

function formReady() {
  return new Promise((resolve) => {
    const now = store.getState();
    if (now.form || now.errors[FORM_ERROR]) return resolve(now.form);
    const off = store.subscribe((s) => {
      if (s.form || s.errors[FORM_ERROR]) { off(); resolve(s.form); }
    });
  });
}

function choiceValue(form, target, text, list) {
  if (!text) return undefined;
  if (list.includes(text)) return text;
  const field = form && form.fields.find((f) => f.target === target);
  return field ? otherValue(field, text) : text;
}

async function submitInquiry(d) {
  const form = await formReady();
  if (!form) return { ok: false, error: 'Formulář se nepodařilo načíst.' };
  const values = {
    [T.name]: d.name || '',
    [T.email]: d.email || '',
    [T.phone]: d.phone || '',
    [T.company]: d.company || '',
    [T.service]: choiceValue(form, T.service, d.service, SERVICES) || '',
    [T.object]: choiceValue(form, T.object, d.object, OBJECTS) || '',
    [T.location]: d.location || '',
    [T.message]: d.message || '',
    [T.consent]: !!d.consent,
  };
  const area = Number(String(d.area || '').replace(',', '.'));
  if (area > 0) values[T.area] = area;
  store.reset();
  store.setValues((prev) => ({ ...prev, ...values }));
  try {
    const out = await store.submit();
    if (out === false) {
      const errs = store.getState().errors;
      return { ok: false, errors: errs, error: errs[FORM_ERROR] || 'Zkontrolujte prosím vyplněné údaje.' };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: 'Odeslání se nepodařilo. Zkuste to prosím znovu.' };
  }
}

/* ---------------- formulář v sekci Kontakt ---------------- */
const formEl = document.getElementById('inqForm');
if (formEl) {
  const msg = document.getElementById('inqMsg');
  const btn = formEl.querySelector('button[type="submit"]');
  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const v = Object.fromEntries(new FormData(formEl).entries());
    v.consent = formEl.elements.consent.checked;
    formEl.querySelectorAll('.bad').forEach((el) => el.classList.remove('bad'));
    const bad = [];
    if (!v.name.trim()) bad.push('name');
    if (!EMAIL_RE.test(v.email.trim())) bad.push('email');
    if (!v.service) bad.push('service');
    if (!v.consent) bad.push('consent');
    if (bad.length) {
      bad.forEach((n) => formEl.elements[n].closest('label').classList.add('bad'));
      msg.className = 'inq-msg err';
      msg.textContent = 'Vyplňte prosím označená pole.';
      formEl.elements[bad[0]].focus();
      return;
    }
    btn.disabled = true; btn.textContent = 'Odesílám…';
    msg.className = 'inq-msg'; msg.textContent = '';
    const res = await submitInquiry(v);
    btn.disabled = false; btn.textContent = 'Odeslat poptávku';
    if (res.ok) {
      formEl.reset();
      msg.className = 'inq-msg ok';
      msg.textContent = 'Děkujeme! Poptávku jsme přijali a ozveme se vám co nejdříve.';
    } else {
      msg.className = 'inq-msg err';
      msg.innerHTML = `${res.error} Případně volejte <a href="tel:${PHONE.replace(/\s/g, '')}">${PHONE}</a> nebo pište na <a href="mailto:${EMAIL}">${EMAIL}</a>.`;
    }
  });
}

/* ---------------- chatovací asistent ---------------- */
const fab = document.createElement('button');
fab.className = 'chat-fab';
fab.setAttribute('aria-label', 'Otevřít poptávkového asistenta');
fab.innerHTML = '<span class="chat-fab-ic"><img src="img/innteo-fan.png" alt=""></span><span class="chat-fab-t">Poptávka online</span>';
const box = document.createElement('section');
box.className = 'chat';
box.setAttribute('aria-label', 'Poptávkový asistent INNTEO');
box.innerHTML = `
  <header class="chat-h">
    <span class="chat-av"><img src="img/innteo-fan.png" alt=""></span>
    <span><b>Asistent INNTEO</b><small>Poptávka za 1 minutu</small></span>
    <button class="chat-x" aria-label="Zavřít">✕</button>
  </header>
  <div class="chat-log" aria-live="polite"></div>
  <div class="chat-opts"></div>
  <form class="chat-in"><input type="text" placeholder="Napište odpověď…" aria-label="Vaše odpověď"><button aria-label="Odeslat">➤</button></form>`;
document.body.append(fab, box);
const log = box.querySelector('.chat-log');
const opts = box.querySelector('.chat-opts');
const inForm = box.querySelector('.chat-in');
const input = inForm.querySelector('input');

let data = {};
let flow = [];
let idx = 0;
let started = false;

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function say(text, who = 'bot') {
  const el = document.createElement('div');
  el.className = `msg ${who}`;
  el.innerHTML = who === 'bot' ? text : esc(text);
  log.appendChild(el);
  log.scrollTop = log.scrollHeight;
}
function typing(then) {
  const el = document.createElement('div');
  el.className = 'msg bot typing';
  el.innerHTML = '<i></i><i></i><i></i>';
  log.appendChild(el);
  log.scrollTop = log.scrollHeight;
  setTimeout(() => { el.remove(); then(); }, 550);
}
function showOptions(list, handler) {
  opts.innerHTML = '';
  (list || []).forEach((o) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = o;
    b.addEventListener('click', () => (handler ? handler(o) : answer(o, true)));
    opts.appendChild(b);
  });
  log.scrollTop = log.scrollHeight;
}

const STEPS = {
  service: { ask: 'Dobrý den 👋 Jsem asistent INNTEO. S čím vám můžeme pomoci?', options: [...SERVICES, 'Mám jen dotaz'], input: false },
  question: { ask: 'Napište prosím svůj dotaz, předáme ho technikovi.', input: 'text', save: 'message' },
  rooms: { ask: 'Kolik místností nebo jednotek chcete klimatizovat?', options: ['1', '2–3', '4–6', 'Více než 6', 'Celou budovu'], input: false, note: (v) => `Počet místností/jednotek: ${v}` },
  object: { ask: 'Pro jaký typ objektu?', options: [...OBJECTS, 'Jiné'], input: false },
  area: { ask: 'Jakou má objekt přibližně plochu v m²? Když nevíte, klikněte na „Nevím“.', options: ['Nevím'], input: 'number' },
  location: { ask: 'Kde se objekt nachází? (město nebo část Prahy)', input: 'text' },
  extra: { ask: 'Chcete něco doplnit? Třeba termín, stávající zařízení nebo co vás trápí.', options: ['Nic dalšího'], input: 'text', note: (v) => v },
  name: { ask: 'Jak se jmenujete?', input: 'text' },
  email: { ask: 'Na jaký e-mail vám pošleme odpověď?', input: 'email' },
  phone: { ask: 'A telefon? Nepovinné, ale domluva bývá rychlejší.', options: ['Přeskočit'], input: 'tel' },
  consent: { ask: 'Souhlasíte se zpracováním osobních údajů pro vyřízení poptávky?', options: ['Ano, souhlasím'], input: false },
};

function buildFlow(service) {
  if (service === 'Mám jen dotaz') return ['question', 'name', 'email', 'phone', 'consent'];
  const f = ['object', 'area', 'location', 'extra', 'name', 'email', 'phone', 'consent'];
  if (service === 'Klimatizace') f.unshift('rooms');
  return f;
}

function ask() {
  const key = flow[idx];
  if (!key) return summary();
  const s = STEPS[key];
  typing(() => {
    say(s.ask);
    showOptions(s.options);
    inForm.hidden = !s.input;
    input.type = s.input === 'number' ? 'number' : s.input === 'email' ? 'email' : s.input === 'tel' ? 'tel' : 'text';
    input.value = '';
    if (s.input && matchMedia('(pointer:fine)').matches) input.focus();
  });
}

function answer(raw, fromOption) {
  const v = String(raw).trim();
  if (!v) return;
  const key = flow[idx];
  if (!key) return;
  if (key === 'email' && !EMAIL_RE.test(v)) {
    say(v, 'me');
    typing(() => say('Tahle adresa nevypadá úplně správně. Zkusíte ji prosím napsat znovu?'));
    return;
  }
  say(v, 'me');
  opts.innerHTML = '';
  if (key === 'service') {
    data.service = v === 'Mám jen dotaz' ? '' : v;
    flow = buildFlow(v); idx = 0;
    return ask();
  }
  const s = STEPS[key];
  if (key === 'area') data.area = v === 'Nevím' ? '' : v;
  else if (key === 'phone') data.phone = v === 'Přeskočit' ? '' : v;
  else if (key === 'consent') data.consent = true;
  else if (key === 'extra') { if (!(fromOption && v === 'Nic dalšího')) data.notes.push(v); }
  else if (s.note) data.notes.push(s.note(v));
  else data[s.save || key] = v;
  idx++;
  ask();
}

function summary() {
  inForm.hidden = true;
  const msgParts = [data.message, ...data.notes].filter(Boolean);
  data.messageFull = msgParts.join('\n');
  const rows = [
    ['Služba', data.service || 'Dotaz'],
    ['Objekt', data.object], ['Plocha', data.area && `${data.area} m²`], ['Lokalita', data.location],
    ['Poznámka', data.messageFull], ['Jméno', data.name], ['E-mail', data.email], ['Telefon', data.phone],
  ].filter((r) => r[1]);
  typing(() => {
    say(`Shrnutí poptávky:<ul class="sum">${rows.map(([k, v]) => `<li><span>${k}</span>${esc(v)}</li>`).join('')}</ul>Můžu ji odeslat?`);
    showOptions(['Odeslat poptávku', 'Začít znovu'], (o) => (o === 'Začít znovu' ? restart() : send()));
    opts.querySelector('button').classList.add('primary');
  });
}

async function send() {
  opts.innerHTML = '';
  say('Odeslat poptávku', 'me');
  const el = document.createElement('div');
  el.className = 'msg bot typing';
  el.innerHTML = '<i></i><i></i><i></i>';
  log.appendChild(el);
  const res = await submitInquiry({ ...data, message: data.messageFull });
  el.remove();
  if (res.ok) {
    say(`Hotovo, děkujeme! ✅ Poptávku jsme přijali a ozveme se vám co nejdříve. Pokud spěcháte, volejte <a href="tel:${PHONE.replace(/\s/g, '')}">${PHONE}</a>.`);
    showOptions(['Nová poptávka'], restart);
  } else {
    say(`${esc(res.error)} Zkuste to prosím znovu, nebo nám napište na <a href="mailto:${EMAIL}">${EMAIL}</a>.`);
    showOptions(['Zkusit znovu odeslat'], send);
  }
}

function restart() {
  log.innerHTML = '';
  data = { notes: [] };
  flow = ['service']; idx = 0;
  ask();
}

function openChat(preset) {
  box.classList.add('open');
  fab.classList.add('hide');
  if (!started) { started = true; restart(); }
  if (preset && flow[idx] === 'service') setTimeout(() => answer(preset, true), 700);
}
fab.addEventListener('click', () => openChat());
box.querySelector('.chat-x').addEventListener('click', () => { box.classList.remove('open'); fab.classList.remove('hide'); });
inForm.addEventListener('submit', (e) => { e.preventDefault(); answer(input.value); });
document.querySelectorAll('[data-open-chat]').forEach((b) => b.addEventListener('click', () => openChat(b.dataset.openChat || undefined)));
