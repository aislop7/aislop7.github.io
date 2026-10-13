const questions = [
  {title:"Портрет с подозрительными деталями",desc:"В ленте появился очень реалистичный портрет. На серьге и прядях волос есть странные детали, но изображение маленькое и сжато.",evidence:"У тебя нет ссылки на автора, исходного файла или независимого подтверждения.",answer:"unknown",explain:"По одному визуальному признаку нельзя надёжно установить происхождение картинки. Найди оригинал, проверь контекст и сравни другие версии."},
  {title:"Срочное голосовое сообщение",desc:"Тебе приходит голосовое сообщение от знакомого с просьбой немедленно перевести деньги. Голос звучит похоже на его обычный голос.",evidence:"Ты не связывался с этим человеком по другим каналам, а сообщение давит на срочность.",answer:"unknown",explain:"Знакомый голос не подтверждает личность. Не переводи деньги, а перезвони по сохранённому номеру или свяжись другим привычным способом."},
  {title:"Видео без первоисточника",desc:"В коротком ролике губы говорящего иногда будто не совпадают со звуком. Видео опубликовано в нескольких аккаунтах.",evidence:"Все найденные публикации могут быть перезаливами одного и того же ролика.",answer:"unknown",explain:"Несовпадение звука может быть признаком монтажа, задержки или сжатия. Найди оригинал и дополнительные подтверждения — пока данных недостаточно."},
  {title:"Сенсационная новость",desc:"Пост утверждает, что известный человек сделал громкое заявление. В публикации нет ссылки на полную запись или официальный источник.",evidence:"Другие аккаунты повторяют тот же текст, но не ссылаются на независимые источники.",answer:"unknown",explain:"Много перепостов не означает много независимых подтверждений. Найди первоисточник и надёжные источники. Пока вывод — недостаточно данных."},
  {title:"Старая фотография под новым заголовком",desc:"Обратный поиск показывает, что эта же фотография опубликована несколько лет назад в статье о другом событии.",evidence:"Подпись в новой публикации утверждает, что фото сделано сегодня.",answer:"false",explain:"В задании найдено проверяемое противоречие: изображение старое и относится к другому событию. Это не обязательно дипфейк, но подпись вводит в заблуждение."},
  {title:"Проверяемая официальная запись",desc:"Видео опубликовано на официальном сайте организации. Есть полная запись, дата, контекст и независимые репортажи, подтверждающие событие.",evidence:"Источники независимы друг от друга, а ключевые детали совпадают.",answer:"real",explain:"В рамках задания происхождение и контекст подтверждаются несколькими независимыми источниками. Это значительно повышает доверие, хотя в реальной проверке важно учитывать доступные доказательства."},
  {title:"Нет метаданных",desc:"У файла отсутствуют сведения о камере и истории редактирования. Кто-то утверждает, что поэтому видео точно создано ИИ.",evidence:"Других данных об источнике и содержании файла нет.",answer:"false",explain:"Вывод «точно создано ИИ» необоснован: метаданные могут отсутствовать или удаляться при обычной обработке. Их отсутствие не доказывает подделку."},
  {title:"Оригинал найден, но контекст спорный",desc:"Ты нашёл исходное видео на странице автора. Однако неизвестно, соответствует ли подпись к нему реальному событию.",evidence:"Подлинность файла не подтверждает автоматически правдивость описания.",answer:"unknown",explain:"Даже подлинное видео можно сопровождать ложной подписью. Проверь дату, место и независимые свидетельства. Пока недостаточно данных."}
];
const labels = {real:"Настоящий / подтверждённый",false:"Подпись или утверждение опровергнуто",unknown:"Недостаточно данных"};
let current = 0, score = 0, answered = false, finished = false;
const quizMain = document.getElementById("quizMain");
const quizProgress = document.getElementById("quizProgress");
const quizCount = document.getElementById("quizCount");
const scoreEl = document.getElementById("score");
const scoreHint = document.getElementById("scoreHint");

function renderQuestion(){
  answered = false;
  const q = questions[current];
  quizProgress.style.width = `${(current / questions.length) * 100}%`;
  quizCount.textContent = `ЗАДАНИЕ ${String(current+1).padStart(2,"0")} / ${questions.length}`;
  quizMain.innerHTML = `
    <div class="case-label">СЛУЧАЙ ${String(current+1).padStart(2,"0")} // АНАЛИЗ ДОКАЗАТЕЛЬСТВ</div>
    <h3 class="case-title">${q.title}</h3>
    <p class="case-desc">${q.desc}</p>
    <div class="evidence"><b>ЧТО ИЗВЕСТНО //</b><br>${q.evidence}</div>
    <div class="answers">
      <button class="answer" data-answer="real">НАСТОЯЩЕЕ</button>
      <button class="answer" data-answer="false">ОПРОВЕРГНУТО / ПОДДЕЛКА</button>
      <button class="answer" data-answer="unknown">НЕДОСТАТОЧНО ДАННЫХ</button>
    </div>
    <div id="quizFeedback"></div>
    <div class="next-row"><span class="micro">ПОДУМАЙ ПЕРЕД ОТВЕТОМ</span><button class="plain-btn" id="nextQuestion" disabled>${current === questions.length-1 ? "ПОКАЗАТЬ РЕЗУЛЬТАТ" : "СЛЕДУЮЩИЙ СЛУЧАЙ →"}</button></div>`;
  quizMain.querySelectorAll("[data-answer]").forEach(btn => btn.addEventListener("click", () => chooseAnswer(btn.dataset.answer)));
  document.getElementById("nextQuestion").addEventListener("click", nextQuestion);
}
function chooseAnswer(answer){
  if(answered || finished) return;
  answered = true;
  const q = questions[current];
  const correct = answer === q.answer;
  if(correct) score++;
  scoreEl.textContent = String(score).padStart(2,"0");
  scoreHint.textContent = correct ? "Хорошая проверка доказательств." : "Ошибка — тоже часть обучения.";
  quizMain.querySelectorAll("[data-answer]").forEach(btn => {btn.disabled = true; if(btn.dataset.answer === q.answer) btn.style.borderColor = "var(--green)";});
  const feedback = document.getElementById("quizFeedback");
  feedback.className = `feedback ${correct ? "" : "bad"}`;
  feedback.innerHTML = `<h4>${correct ? "ВЕРНО — ТЫ ОЦЕНИЛ ДОКАЗАТЕЛЬСТВА" : "РАЗБЕРЁМ ЭТОТ СЛУЧАЙ"}</h4><b>Лучший ответ: ${labels[q.answer]}.</b><br>${q.explain}`;
  document.getElementById("nextQuestion").disabled = false;
}
function nextQuestion(){
  if(!answered) return;
  current++;
  if(current < questions.length){renderQuestion();return;}
  finished = true;
  quizProgress.style.width = "100%";
  quizCount.textContent = "РАССЛЕДОВАНИЕ ЗАВЕРШЕНО";
  const level = score >= 7 ? "ОТЛИЧНЫЙ РАССЛЕДОВАТЕЛЬ" : score >= 4 ? "СИГНАЛ ОБНАРУЖЕН" : "НАЧНИ С ПРОВЕРКИ ИСТОЧНИКОВ";
  const message = score >= 7 ? "Ты хорошо различаешь подозрения и доказательства. Продолжай проверять контекст и первоисточники." : score >= 4 ? "Ты уже замечаешь важные сигналы. В сложных случаях ищи больше независимых подтверждений." : "Не делай вывод только по внешнему виду. Начинай с первоисточника, даты и независимых подтверждений.";
  quizMain.innerHTML = `<div class="case-label">ОТЧЁТ О РАССЛЕДОВАНИИ</div><h3 class="case-title">${level}</h3><div class="score-big">${score} / ${questions.length}</div><p class="case-desc">${message}</p><div class="evidence">Главное правило: если доказательств недостаточно, честный ответ — «пока неизвестно». Это лучше, чем уверенно ошибиться.</div><button class="button" id="restartQuiz">ПРОЙТИ ЕЩЁ РАЗ ↻</button>`;
  document.getElementById("restartQuiz").addEventListener("click", () => {current=0;score=0;answered=false;finished=false;scoreEl.textContent="00";scoreHint.textContent="Начни расследование.";renderQuestion();});
}
renderQuestion();

document.querySelectorAll(".flag button").forEach(button => {
  button.addEventListener("click", () => {
    const flag = button.closest(".flag");
    const open = flag.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
    button.querySelector(".flag-plus").textContent = open ? "−" : "＋";
  });
});

const checklist = document.querySelectorAll("#checklist input[type=checkbox]");
const checkProgress = document.getElementById("checkProgress");
function updateChecklist(){
  const checked = [...checklist].filter(item => item.checked).length;
  checkProgress.textContent = `ПРОГРЕСС ПРОВЕРКИ: ${checked} / ${checklist.length}`;
}
checklist.forEach(item => item.addEventListener("change", updateChecklist));
document.getElementById("startInvestigation").addEventListener("click", () => {
  const prompt = document.getElementById("investigationPrompt");
  prompt.hidden = !prompt.hidden;
  document.getElementById("startInvestigation").textContent = prompt.hidden ? "НАЧАТЬ РАССЛЕДОВАНИЕ ↗" : "СКРЫТЬ СЦЕНАРИЙ ↑";
});

document.querySelectorAll(".lab-open").forEach(button => {
  button.addEventListener("click", () => {
    const detail = document.getElementById(`lab-${button.dataset.lab}`);
    detail.hidden = !detail.hidden;
    button.textContent = detail.hidden ? "ОТКРЫТЬ ЭКСПЕРИМЕНТ ↗" : "СКРЫТЬ РАЗБОР ↑";
  });
});

const verdictTexts = {
  confirmed: "Такой вывод не обоснован: в сценарии нет первоисточника и независимых подтверждений. Нельзя считать заявление подтверждённым.",
  false: "Такой вывод тоже не обоснован: отсутствие источника не доказывает, что ролик ложный или создан ИИ. Для опровержения нужны доказательства.",
  unknown: "Верно. Пока доказательств недостаточно. Следующий шаг — найти первоисточник, проверить дату и контекст, а затем искать независимые подтверждения."
};
document.querySelectorAll(".verdict").forEach(button => {
  button.addEventListener("click", () => {
    const result = document.getElementById("bossResult");
    result.hidden = false;
    result.innerHTML = `<b>${button.dataset.verdict === "unknown" ? "ВЕРДИКТ ПРИНЯТ" : "ПРОВЕРЬ ЛОГИКУ ВЫВОДА"}</b><br>${verdictTexts[button.dataset.verdict]}`;
    result.style.borderColor = button.dataset.verdict === "unknown" ? "var(--green)" : "var(--red)";
  });
});

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.textContent = open ? "ЗАКРЫТЬ ✕" : "МЕНЮ ☰";
});
navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "МЕНЮ ☰";
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}
  });
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// Rainbow Bridge trail: ghostly green/purple sparks follow the pointer.
(() => {
  if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.createElement('canvas');
  canvas.id = 'cursor-trail';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, dpr = 1;
  const particles = [];
  let last = 0;
  const colors = ['#b6ff38', '#c6a1ff', '#a855f7', '#ff5a91', '#e8e0ef'];
  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize, {passive:true}); resize();
  window.addEventListener('pointermove', (e) => {
    const now = performance.now();
    if (now - last < 9) return;
    last = now;
    for(let i=0;i<2;i++) particles.push({
      x:e.clientX+(Math.random()-.5)*8, y:e.clientY+(Math.random()-.5)*8,
      vx:(Math.random()-.5)*1.1, vy:(Math.random()-.5)*1.1,
      life:1, decay:.018+Math.random()*.025, size:1.1+Math.random()*3.2,
      color:colors[Math.floor(Math.random()*colors.length)], cross:Math.random()>.72
    });
    if(particles.length>150) particles.splice(0,particles.length-150);
  }, {passive:true});
  function draw(){
    ctx.clearRect(0,0,w,h);
    for(let i=particles.length-1;i>=0;i--){
      const p=particles[i]; p.x+=p.vx; p.y+=p.vy; p.vy-=.012; p.life-=p.decay;
      if(p.life<=0){particles.splice(i,1);continue;}
      ctx.globalAlpha=Math.max(0,p.life); ctx.fillStyle=p.color; ctx.shadowColor=p.color; ctx.shadowBlur=12;
      if(p.cross){
        ctx.fillRect(p.x-p.size/2,p.y-p.size*2,p.size,p.size*4);
        ctx.fillRect(p.x-p.size*2,p.y-p.size/2,p.size*4,p.size);
      } else {ctx.beginPath();ctx.arc(p.x,p.y,p.size*p.life,0,Math.PI*2);ctx.fill();}
    }
    ctx.globalAlpha=1;ctx.shadowBlur=0;requestAnimationFrame(draw);
  }
  draw();
})();
