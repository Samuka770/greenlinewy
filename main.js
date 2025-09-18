// ===== Indicador deslizante (desktop) =====
const nav = document.getElementById('deskNav');
const indicator = document.getElementById('indicator');
const links = nav?.querySelectorAll('.nav-link');

function moveIndicator(el){
  if(!el) return;
  const rect = el.getBoundingClientRect();
  const parentRect = nav.getBoundingClientRect();
  const w = Math.max(24, rect.width * 0.6);
  const x = rect.left - parentRect.left + (rect.width - w)/2;
  indicator.style.opacity = 1;
  indicator.style.width = `${w}px`;
  indicator.style.transform = `translateX(${x}px)`;
}

function setToActive(){
  const act = nav.querySelector('.nav-link[data-active]') || links?.[0];
  moveIndicator(act);
}

links?.forEach(link =>{
  link.addEventListener('mouseenter', ()=> moveIndicator(link));
  link.addEventListener('focus', ()=> moveIndicator(link));
  link.addEventListener('mousemove', (e)=>{
    // atualiza posição do brilho "ink"
    link.style.setProperty('--x', `${e.offsetX}px`);
    link.style.setProperty('--y', `${e.offsetY}px`);
  });
  link.addEventListener('click', ()=>{
    links.forEach(l=> l.removeAttribute('data-active'));
    link.setAttribute('data-active','');
    moveIndicator(link);
  });
});

window.addEventListener('resize', setToActive);
window.addEventListener('load', setToActive);

// ===== Efeito de navbar ao rolar =====
const bar = document.getElementById('navbar');
const navWrap = document.querySelector('.nav-wrap');
let lastScrollY = window.scrollY;
const deltaHide = 2; // Distância mínima para esconder (scroll para baixo)
const deltaShow = 12; // Distância mínima para mostrar (scroll para cima)

const onScroll = ()=>{
  const currentScrollY = window.scrollY;
  
  // Always show navbar at the top of the page
  if (currentScrollY < 10) {
    bar.classList.remove('hidden');
    bar.classList.remove('showing');
  } else {
    // Hide/show navbar based on scroll direction with different deltas
    if (currentScrollY > lastScrollY + deltaHide && currentScrollY > 65) {
      bar.classList.add('hidden');
      bar.classList.remove('showing');
      navWrap?.classList.add('collapsed');
    } else if (currentScrollY < lastScrollY - deltaShow) {
      bar.classList.remove('hidden');
      bar.classList.add('showing');
      navWrap?.classList.remove('collapsed');
    }
  }
  
  // Add scrolled class for styling
  if(currentScrollY > 8) bar.classList.add('scrolled');
  else bar.classList.remove('scrolled');

  // Garantir estado consistente ao voltar ao topo
  if(!bar.classList.contains('hidden')) navWrap?.classList.remove('collapsed');
  
  lastScrollY = currentScrollY;
};
document.addEventListener('scroll', onScroll, {passive:true});
onScroll();

// ===== Expor altura aproximada da navbar como CSS variable (para heros que usam calc) =====
function setNavHeightVar(){
  const navEl = document.getElementById('navbar');
  if(!navEl) return;
  const h = Math.round(navEl.getBoundingClientRect().height);
  document.documentElement.style.setProperty('--nav-h', h + 'px');
}
window.addEventListener('load', setNavHeightVar);
window.addEventListener('resize', setNavHeightVar);
setNavHeightVar();

// ===== Menu mobile =====
const hamb = document.getElementById('hamb');
const mob = document.getElementById('mobMenu');
hamb?.addEventListener('click', ()=>{
  const open = mob.classList.toggle('open');
  hamb.setAttribute('aria-expanded', String(open));
});

// ===== Reveal on scroll =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
    }
  });
}, { threshold: 0.1 });

// Inclui novas classes da página Sobre (.reveal-fade e .stagger)
document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-fade, .stagger').forEach(el => {
  observer.observe(el);
});
