/* Personalize the portfolio here. Use real, current URLs and contact details. */
const PORTFOLIO_CONFIG = {
  // Example: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID'
  youtubeUrl: '',
  // Example: 'lucas.seuemail@exemplo.com'
  email: ''
};

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

// Highlight the active section in the navigation.
const sectionLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
const observedSections = sectionLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        sectionLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: '-25% 0px -60% 0px' });
  observedSections.forEach(section => sectionObserver.observe(section));
}

// Check for the actual résumé file without breaking the rest of the site.
const cvUrl = 'assets/curriculo-lucas-dias.pdf';
const cvNote = document.getElementById('cv-note');
fetch(cvUrl, { method: 'HEAD' }).then(response => {
  if (response.ok) {
    cvNote.textContent = 'PDF disponível para visualização e download.';
    cvNote.classList.add('file-ready');
  }
}).catch(() => { /* Local file may not be checked when opened directly; keep the helpful file path. */ });

// Add a real YouTube embed only after a URL is configured.
function getYouTubeId(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) return parsed.pathname.slice(1);
    if (parsed.hostname.includes('youtube.com')) {
      if (parsed.pathname === '/watch') return parsed.searchParams.get('v');
      const parts = parsed.pathname.split('/');
      if (['embed', 'shorts'].includes(parts[1])) return parts[2];
    }
  } catch (_) { return null; }
  return null;
}
const videoId = getYouTubeId(PORTFOLIO_CONFIG.youtubeUrl);
if (videoId) {
  const frame = document.getElementById('video-frame');
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`;
  iframe.title = 'Pitch profissional de Lucas Dias';
  iframe.loading = 'lazy';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  iframe.allowFullscreen = true;
  frame.replaceChildren(iframe);
  const youtubeLink = document.getElementById('youtube-link');
  youtubeLink.href = PORTFOLIO_CONFIG.youtubeUrl;
  youtubeLink.hidden = false;
  document.querySelector('.pitch-reminder').textContent = 'Vídeo incorporado. Confirme se o acesso está liberado para avaliação.';
}

const emailLink = document.getElementById('email-link');
const emailHint = document.getElementById('email-hint');
if (PORTFOLIO_CONFIG.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(PORTFOLIO_CONFIG.email)) {
  emailLink.href = `mailto:${PORTFOLIO_CONFIG.email}`;
  emailLink.innerHTML = `${PORTFOLIO_CONFIG.email} <span>↗</span>`;
  emailHint.hidden = true;
}
