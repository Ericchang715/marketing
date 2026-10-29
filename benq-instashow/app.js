'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const scrollBehavior = () => reducedMotion.matches ? 'instant' : 'smooth';

// Progressive enhancement keeps all editorial content readable without JavaScript.
if ('IntersectionObserver' in window) {
  document.documentElement.classList.add('js-ready');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .08, rootMargin: '0px 0px 30px 0px' });
  $$('.reveal').forEach(element => revealObserver.observe(element));
}

const scenes = [
  { tag: 'TEACHING', title: '熟悉的筆電，<br>帶進今天的課堂。', description: '由授課筆電展示授權教材與教學網站，連接發射器後，按下按鍵分享畫面。', image: 'assets/image2.webp', alt: '使用筆電分享內容的 BenQ 官方會議情境示意', model: '依課程分享需求比較機型' },
  { tag: 'STUDENT PRESENTATIONS', title: '每一組的想法，<br>一起放上大畫面。', description: '各組使用自己的筆電輪流報告。需要並排比較成果時，可評估 WDC25 的最多四分割畫面。', image: 'assets/image8.webp', alt: 'BenQ 官方多裝置四分割分享示意', model: '探索 WDC25 的課堂分享', key: 'wdc25' },
  { tag: 'GUEST PRESENTATIONS', title: '把講者的觀點，<br>帶到大家面前。', description: '來賓將發射器接上自己的筆電，以硬體按鍵分享畫面，基本無線投影免裝驅動程式與投影 App。', image: 'assets/image2.webp', alt: 'BenQ 官方來賓簡報情境示意', model: '探索 WDC15 的輪流簡報', key: 'wdc15' },
  { tag: 'HYBRID MEETINGS', title: '同一場討論，<br>連接不同校園。', description: '以自己的筆電主持遠距會議，透過 VS25 共用相容攝影機與收音設備。遠距會議需由筆電連網。', image: 'assets/image9.webp', alt: 'BenQ 官方混合會議情境示意', model: '探索 VS25 的 BYOM 應用', key: 'vs25' }
];
const sceneTabs = $$('[data-scene]');
let selectedScene = 0;
function selectScene(index, focus = false) {
  selectedScene = index;
  const scene = scenes[index];
  sceneTabs.forEach((button, i) => {
    button.setAttribute('aria-selected', String(i === index));
    button.tabIndex = i === index ? 0 : -1;
  });
  $('#scene-panel').setAttribute('aria-labelledby', `scene-tab-${index}`);
  $('#scene-panel').dataset.scene = index;
  $('#scene-image').src = scene.image;
  $('#scene-image').alt = scene.alt;
  $('#scene-tag').textContent = scene.tag;
  $('#scene-title').innerHTML = scene.title;
  $('#scene-description').textContent = scene.description;
  const modelLink = $('#scene-model');
  modelLink.replaceChildren(document.createTextNode(scene.model + ' '));
  modelLink.insertAdjacentHTML('beforeend', '<svg aria-hidden="true"><use href="#i-arrow"/></svg>');
  if (focus) sceneTabs[index].focus();
}
sceneTabs.forEach((button, index) => button.addEventListener('click', () => selectScene(index)));
$('.scenario-tabs').addEventListener('keydown', event => {
  let next = selectedScene;
  if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = (next + 1) % scenes.length;
  else if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = (next + scenes.length - 1) % scenes.length;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = scenes.length - 1;
  else return;
  event.preventDefault();
  selectScene(next, true);
});
$('#scene-model').addEventListener('click', () => {
  if (scenes[selectedScene].key) selectModel(scenes[selectedScene].key);
});

const models = {
  wdc15: { name: 'WDC15', title: '一位分享，<br>全班看見。', description: '以單一畫面進行教師講授、小型討論與來賓簡報，接上自己的筆電輪流分享。', image: 'assets/image7.webp', alt: 'WDC15 接收器與發射器產品組合', output: '4K<span>30Hz</span>', connections: '16<span>台</span>', third: '1<span>個畫面</span>', thirdLabel: '單一畫面分享', reason: '對應單一畫面簡報，適合以輪流分享為主的使用需求。' },
  wdc25: { name: 'WDC25', title: '四組成果，<br>同畫面討論。', description: '最多四分割畫面，可用來比較各組作業與不同解題方式。支援行動裝置投屏，最多同時連線 64 台。', image: 'assets/image8.webp', alt: 'WDC25 最多四分割畫面的 BenQ 官方分享示意', output: '4K<span>60Hz</span>', connections: '64<span>台</span>', third: '4<span>分割</span>', thirdLabel: '最多同畫面分享數', reason: '對應多裝置課堂分享，可用最多四分割畫面比較小組成果。' },
  vs25: { name: 'VS25', title: '自己的筆電，<br>會議室的影音。', description: '透過 BYOM 共用會議室相容的 USB 影音設備。連接 MTX 多媒體發射器，再於筆電會議軟體選取對應設備。', image: 'assets/image1.webp', alt: 'BenQ InstaShow VS25 接收器與發射器產品組合', output: '4K<span>60Hz</span>', connections: '64<span>台</span>', third: 'BYOM', thirdLabel: '共用相容 USB 影音周邊', reason: '對應 BYOM 應用，讓自己的筆電使用會議室相容的 USB 影音周邊。' }
};
let activeModel = 'wdc15';
function selectModel(key) {
  if (!models[key]) return;
  activeModel = key;
  const model = models[key];
  $$('[data-model]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.model === key)));
  $('#model-label').textContent = model.name;
  $('#model-title').innerHTML = model.title;
  $('#model-description').textContent = model.description;
  $('#model-image').src = model.image;
  $('#model-image').alt = model.alt;
  $('#model-official').href = `https://www.benq.com/zh-tw/projector/wireless/${key}/spec.html`;
  $('#fact-one').innerHTML = model.output;
  $('#fact-two').innerHTML = model.connections;
  $('#fact-three').innerHTML = model.third;
  $('#fact-three-label').textContent = model.thirdLabel;
  $$('[data-col]').forEach(cell => cell.classList.toggle('selected', cell.dataset.col === key));
  $('#model-spotlight').dataset.model = key;
}
$$('[data-model]').forEach(button => button.addEventListener('click', () => selectModel(button.dataset.model)));

let connectionStep = 0;
const instructions = ['接收器連接教室顯示設備', '筆電已接上發射器，按一下示範分享', '概念示意：教材畫面正在分享'];
const nextLabels = ['下一步：接上筆電', '下一步：按鍵分享', '重新體驗'];
function setConnectionStep(step) {
  connectionStep = step;
  $('#connection-stage').dataset.state = step;
  $('.screen-sharing').setAttribute('aria-hidden', String(step !== 2));
  $('.screen-idle').setAttribute('aria-hidden', String(step === 2));
  $$('[data-step]').forEach(button => {
    const active = Number(button.dataset.step) === step;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  $('#stage-instruction').innerHTML = `<span class="mono">0${step + 1} / 03</span> ${instructions[step]}`;
  $('#stage-next').innerHTML = `${nextLabels[step]} <svg aria-hidden="true"><use href="#i-arrow"/></svg>`;
  const shareButton = $('#demo-share');
  shareButton.disabled = step === 0;
  shareButton.setAttribute('aria-label', step === 0 ? '先連接筆電，再按鍵示範分享' : step === 1 ? '按鍵示範分享教材畫面' : '停止示範分享');
  $('span', shareButton).textContent = step === 2 ? '停止分享' : '按一下';
  $('#screen-status').textContent = step === 0 ? '顯示設備已連接' : '已準備好分享';
}
$$('[data-step]').forEach(button => button.addEventListener('click', () => setConnectionStep(Number(button.dataset.step))));
$('#stage-next').addEventListener('click', () => setConnectionStep((connectionStep + 1) % 3));
$('#demo-share').addEventListener('click', () => setConnectionStep(connectionStep === 2 ? 1 : 2));

let recommendedModel = 'wdc15';
$$('input[name="requirement"]').forEach(input => input.addEventListener('change', () => {
  recommendedModel = input.value;
  const model = models[recommendedModel];
  $('#recommended-model').textContent = model.name;
  $('#recommendation-reason').textContent = model.reason;
  $('#recommendation-link').setAttribute('aria-label', `查看 ${model.name} 比較`);
}));
$('#recommendation-link').addEventListener('click', () => {
  selectModel(recommendedModel);
  goToChapter(chapters.findIndex(chapter => chapter.id === 'compare'));
});
const checks = $$('.checklist input');
function updateChecks() {
  const count = checks.filter(input => input.checked).length;
  $('#check-count').textContent = `已確認 ${count} / 4 項${count === 4 ? '，可進行實機評估' : ''}`;
}
checks.forEach(input => input.addEventListener('change', updateChecks));
$('#reset-checklist').addEventListener('click', () => { checks.forEach(input => input.checked = false); updateChecks(); });

const mobileMenu = $('#mobile-nav');
const menuToggle = $('#menu-toggle');
function closeMenu() {
  mobileMenu.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', '開啟選單');
}
menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  mobileMenu.hidden = isOpen;
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? '開啟選單' : '關閉選單');
});
$$('a', mobileMenu).forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('click', event => {
  if (!mobileMenu.hidden && !mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
});

const chapters = $$('.chapter');
const chapterLinks = $$('.chapter-nav a');
let chapterIndex = 0;
let presenting = false;
let scrollQueued = false;
let navigationTarget = null;
let navigationTimer;
function updateProgress() {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  $('#reading-progress').style.width = `${scrollHeight > 0 ? Math.min(100, Math.max(0, window.scrollY / scrollHeight * 100)) : 100}%`;
  const referencePoint = window.innerHeight * .32;
  let current = 0;
  chapters.forEach((chapter, index) => { if (chapter.getBoundingClientRect().top <= referencePoint) current = index; });
  if (navigationTarget !== null) {
    const top = chapters[navigationTarget].getBoundingClientRect().top;
    const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    if (Math.abs(top - padding) < 4) { navigationTarget = null; clearTimeout(navigationTimer); }
    else current = navigationTarget;
  }
  chapterIndex = current;
  chapterLinks.forEach((link, index) => {
    link.classList.toggle('active', index === current);
    if (index === current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  $('#presentation-count').textContent = `${String(current + 1).padStart(2, '0')} / ${String(chapters.length).padStart(2, '0')}`;
  $('#presentation-title').textContent = chapters[current].dataset.title;
  $('#presentation-prev').disabled = current === 0;
  $('#presentation-next').disabled = current === chapters.length - 1;
  scrollQueued = false;
}
function requestProgressUpdate() {
  if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateProgress); }
}
window.addEventListener('scroll', requestProgressUpdate, { passive: true });
window.addEventListener('wheel', () => { navigationTarget = null; clearTimeout(navigationTimer); }, { passive: true });
window.addEventListener('touchstart', () => { navigationTarget = null; clearTimeout(navigationTimer); }, { passive: true });
window.addEventListener('resize', () => { if (window.innerWidth > 800) closeMenu(); requestProgressUpdate(); }, { passive: true });
window.addEventListener('load', updateProgress);
updateProgress();

let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  $('#toast').textContent = message;
  $('#toast').classList.add('visible');
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 4000);
}
function goToChapter(index) {
  const target = Math.max(0, Math.min(chapters.length - 1, index));
  navigationTarget = target;
  clearTimeout(navigationTimer);
  navigationTimer = setTimeout(() => { navigationTarget = null; updateProgress(); }, 1600);
  updateProgress();
  chapters[target].scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
}
function setPresentation(value) {
  presenting = value;
  document.body.classList.toggle('presenting', value);
  $('#presentation-controls').hidden = !value;
  document.documentElement.style.scrollPaddingTop = value ? '0px' : '';
  if (value) {
    closeMenu();
    goToChapter(chapterIndex);
    showToast('簡報模式：使用 ← → 切換章節，Esc 離開。可自由捲動閱讀。');
  }
  updateProgress();
}
$('#presentation-trigger').addEventListener('click', () => {
  setPresentation(true);
  if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => { /* Chapter controls work in embedded previews, too. */ });
  }
  $('#presentation-next').focus({ preventScroll: true });
});
function exitPresentation() {
  setPresentation(false);
  if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
  $('#presentation-trigger').focus({ preventScroll: true });
}
$('#presentation-exit').addEventListener('click', exitPresentation);
$('#presentation-prev').addEventListener('click', () => goToChapter(chapterIndex - 1));
$('#presentation-next').addEventListener('click', () => goToChapter(chapterIndex + 1));
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement && presenting) setPresentation(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    if (presenting) exitPresentation();
    if (!mobileMenu.hidden) { closeMenu(); menuToggle.focus(); }
    return;
  }
  if (!presenting || event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input,textarea,select,[role="tablist"],details')) return;
  if (['ArrowRight', 'PageDown'].includes(event.key)) { event.preventDefault(); goToChapter(chapterIndex + 1); }
  if (['ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); goToChapter(chapterIndex - 1); }
});

// Decorative SVGs do not repeat their parent control's accessible name.
$$('svg:not(.svg-library)').forEach(svg => svg.setAttribute('aria-hidden', 'true'));
