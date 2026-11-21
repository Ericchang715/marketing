(() => {
  'use strict';
  const pages = [...document.querySelectorAll('.page')];
  const main = document.querySelector('main');
  const nav = [...document.querySelectorAll('[data-nav]')];
  const routes = new Map(pages.map(page => [page.id, page]));
  const subroutes = new Map(['work-focus', 'work-projects', 'work-method'].map(id => [id, 'work']));
  const titles = {welcome:'艾瑞克的日常', story:'我的故事', work:'工作中的我', life:'生活裡的我', explore:'自由探索'};
  let currentRoute;
  let scrollFrame;
  function navigate(initial = false) {
    const hash = location.hash.slice(1);
    const target = hash === 'main' ? (currentRoute || 'welcome') : subroutes.get(hash) || (routes.has(hash) ? hash : 'welcome');
    const page = routes.get(target);
    const changed = currentRoute !== target;
    for (const item of pages) item.hidden = item !== page;
    for (const link of nav) {
      const selected = link.dataset.nav === target;
      if (selected) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
    currentRoute = target;
    document.title = `${titles[target]}｜Eric’s World`;
    if (hash === 'main') {
      main.focus({preventScroll:true});
    } else if (subroutes.has(hash)) {
      document.getElementById(hash).scrollIntoView({behavior: initial ? 'instant' : motionBehavior(), block:'start'});
    } else if (changed || !initial) {
      window.scrollTo({top:0, behavior:'instant'});
      if (!initial) main.focus({preventScroll:true});
    }
    updateScroll();
  }
  function motionBehavior() {
    return matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
  }
  window.addEventListener('hashchange', () => navigate());
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      if (link.hash === location.hash) {event.preventDefault(); navigate();}
    });
  });
  const tabs = [...document.querySelectorAll('[data-story]')];
  const scenes = [...document.querySelectorAll('.story-scene')];
  const meter = document.querySelector('.story-meter');
  const previous = document.querySelector('#story-prev');
  const next = document.querySelector('#story-next');
  let storyIndex = 0;
  function selectStory(index, focus = false) {
    storyIndex = Math.max(0, Math.min(tabs.length - 1, index));
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === storyIndex));
      tab.tabIndex = i === storyIndex ? 0 : -1;
      scenes[i].hidden = i !== storyIndex;
    });
    previous.disabled = storyIndex === 0;
    next.disabled = storyIndex === tabs.length - 1;
    meter.setAttribute('aria-valuenow', String(storyIndex + 1));
    meter.style.setProperty('--progress', `${(storyIndex + 1) * 25}%`);
    document.querySelector('#story-count').textContent = `關於我 · ${storyIndex + 1} / ${tabs.length}`;
    if (focus) tabs[storyIndex].focus();
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectStory(i));
    tab.addEventListener('keydown', event => {
      const destinations = {ArrowRight:(i + 1) % tabs.length, ArrowLeft:(i + tabs.length - 1) % tabs.length, Home:0, End:tabs.length - 1};
      if (event.key in destinations) {event.preventDefault();selectStory(destinations[event.key], true);}
    });
  });
  previous.addEventListener('click', () => selectStory(storyIndex - 1));
  next.addEventListener('click', () => selectStory(storyIndex + 1));
  const topButton = document.querySelector('#to-top');
  function updateScroll() { topButton.hidden = window.scrollY < 500; }
  window.addEventListener('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {updateScroll();scrollFrame = null;});
  }, {passive:true});
  topButton.addEventListener('click', () => {
    window.scrollTo({top:0, behavior:motionBehavior()});
    main.focus({preventScroll:true});
  });
  navigate(true);
})();
