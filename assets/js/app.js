let allWorks = [];
let allGallery = [];

document.addEventListener('DOMContentLoaded', () => {
  initPublicData();
  setupFilters();
  setupKeyboardClose();
  initSpotlightEffect();
});

async function initPublicData() {
  try {
    const res = await fetchAPI('getData');
    if (res && res.success && res.data) {
      renderSettings(res.data.settings || {});
      renderPortfolio(res.data.portfolio || []);
      renderGallery(res.data.gallery || []);
    } else {
      renderFallbackPortfolio();
    }
  } catch (err) {
    console.warn('Using fallback data:', err);
    renderFallbackPortfolio();
  }
  // Setup reveal observer after content is injected
  setTimeout(initScrollReveal, 50);
}

function renderSettings(settings) {
  if (settings.hero_title) document.getElementById('heroTitle').innerHTML = settings.hero_title.replace(/\n/g, '<br>');
  if (settings.hero_lead) document.getElementById('heroLead').innerText = settings.hero_lead;
  if (settings.about_title) document.getElementById('aboutTitle').innerText = settings.about_title;
  if (settings.about_desc) document.getElementById('aboutDesc').innerText = settings.about_desc;
  if (settings.contact_email) document.getElementById('contactBtn').href = `mailto:${settings.contact_email}`;
  if (settings.footer_text) document.getElementById('footerText').innerText = settings.footer_text;
}

function renderPortfolio(works) {
  allWorks = works.filter(w => w.status !== 'draft');
  const grid = document.getElementById('portfolioGrid');
  
  if (allWorks.length === 0) {
    renderFallbackPortfolio();
    return;
  }

  grid.innerHTML = allWorks.map((item, idx) => `
    <article class="work-card reveal-init stagger-${(idx % 4) + 1}" data-category="${item.category || 'branding'}" onclick="openModal('${item.id}')" tabindex="0" role="button" aria-label="Lihat detail ${item.title}">
      <div class="work-thumb">
        ${item.image_url ? `<img src="${item.image_url}" alt="${item.title}" loading="lazy">` : `<div class="work-thumb-placeholder">${(item.category || 'WORK').toUpperCase()}</div>`}
      </div>
      <div class="work-body">
        <div>
          <span class="work-category-badge">${getCategoryName(item.category)}</span>
          <h3>${item.title || 'Untitled Project'}</h3>
        </div>
        <p class="work-meta">${item.author || 'Siswa SKAGAMU'}</p>
      </div>
    </article>
  `).join('');
}

function getCategoryName(cat) {
  switch (cat) {
    case 'branding': return 'Branding';
    case 'design': return 'Desain Grafis';
    case 'content': return 'Konten Digital';
    default: return cat || 'Karya';
  }
}

function renderFallbackPortfolio() {
  const grid = document.getElementById('portfolioGrid');
  const defaults = [
    { id: '1', title: 'Carragreen • Eco-Friendly Stationery Brand', category: 'branding', author: 'Fajar Nugraha • XII DKV 1', description: 'Desain identitas visual dan landing page e-commerce produk ramah lingkungan.' },
    { id: '2', title: 'WellNest • On-Demand Wellness & Massage Platform', category: 'design', author: 'Dewi Anggraini • XI DKV 2', description: 'Perancangan antarmuka UI/UX mobile web untuk pemesanan layanan terapi relaksasi.' },
    { id: '3', title: 'HookLab • Short-Form Creative Agency', category: 'content', author: 'Rizky Pratama • XII DKV 1', description: 'Konsep branding agensi produksi konten video vertikal berkinerja tinggi.' }
  ];
  allWorks = defaults;
  grid.innerHTML = defaults.map((item, idx) => `
    <article class="work-card reveal-init stagger-${(idx % 3) + 1}" data-category="${item.category}" onclick="openModal('${item.id}')" tabindex="0" role="button">
      <div class="work-thumb">
        <div class="work-thumb-placeholder">${item.category.toUpperCase()}</div>
      </div>
      <div class="work-body">
        <div>
          <span class="work-category-badge">${getCategoryName(item.category)}</span>
          <h3>${item.title}</h3>
        </div>
        <p class="work-meta">${item.author}</p>
      </div>
    </article>
  `).join('');
}

function renderGallery(gallery) {
  allGallery = gallery || [];
  const container = document.getElementById('galleryGrid');
  if (!container || !allGallery || allGallery.length === 0) return;

  const rhythmPatterns = ['aspect-featured', 'aspect-normal', 'aspect-tall', 'aspect-wide', 'aspect-normal', 'aspect-normal', 'aspect-tall', 'aspect-normal'];

  container.innerHTML = allGallery.map((item, idx) => {
    const patternClass = rhythmPatterns[idx % rhythmPatterns.length];
    return `
      <div class="gallery-masonry-item ${patternClass} reveal-init stagger-${(idx % 4) + 1}" onclick="openGalleryModal('${item.id || ''}', '${item.image_url}', '${encodeURIComponent(item.title)}')" tabindex="0" role="button" aria-label="Lihat foto ${item.title}">
        ${item.image_url ? `<img src="${item.image_url}" alt="${item.title}" loading="lazy">` : ''}
        <div class="gallery-masonry-caption">${item.title}</div>
      </div>
    `;
  }).join('');
}

function setupFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.work-card').forEach(card => {
        const matches = (filter === 'all' || card.dataset.category === filter);
        card.style.display = matches ? 'flex' : 'none';
        if (matches) {
          card.classList.add('reveal-visible');
        }
      });
    });
  });
}

/* ============================================================
   ANIMATION: INTERSECTION OBSERVER SCROLL REVEAL
============================================================ */
function initScrollReveal() {
  // Add initial class to static section targets
  const staticTargets = document.querySelectorAll('.hero-grid > div, .section-header, .two-col > div, .service-card, .contact-card');
  staticTargets.forEach(el => el.classList.add('reveal-init'));

  const revealElements = document.querySelectorAll('.reveal-init');
  
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('reveal-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ============================================================
   ANIMATION: DYNAMIC CURSOR SPOTLIGHT TRACKING
============================================================ */
function initSpotlightEffect() {
  document.addEventListener('pointermove', (e) => {
    const cards = document.querySelectorAll('.work-card:hover, .gallery-masonry-item:hover, .service-card:hover');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  }, { passive: true });
}

function openModal(id) {
  const item = allWorks.find(w => w.id === id);
  if (!item) return;
  
  const frame = document.getElementById('modalMockupFrame');
  const imgEl = document.getElementById('modalImg');
  const urlBar = document.getElementById('modalUrlBar');
  
  if (item.image_url) {
    imgEl.src = item.image_url;
    frame.style.display = 'block';
    urlBar.innerText = `skagamu.sch.id/works/${encodeURIComponent(item.title.toLowerCase().replace(/\s+/g, '-'))}`;
  } else {
    frame.style.display = 'none';
  }
  
  document.getElementById('modalCategory').innerText = getCategoryName(item.category);
  document.getElementById('modalTitle').innerText = item.title || '';
  document.getElementById('modalAuthor').innerText = item.author || 'Siswa SKAGAMU';
  document.getElementById('modalDesc').innerText = item.description || 'Tidak ada deskripsi.';
  
  const modal = document.getElementById('workModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function openGalleryModal(id, url, titleEnc) {
  const title = decodeURIComponent(titleEnc);
  const frame = document.getElementById('modalMockupFrame');
  const imgEl = document.getElementById('modalImg');
  const urlBar = document.getElementById('modalUrlBar');
  
  imgEl.src = url;
  frame.style.display = 'block';
  urlBar.innerText = `skagamu.sch.id/gallery/kemerdekaan-ri-81`;
  
  document.getElementById('modalCategory').innerText = 'Dokumentasi & Galeri';
  document.getElementById('modalTitle').innerText = title;
  document.getElementById('modalAuthor').innerText = 'HUT RI Ke-81 • Wuryantoro';
  document.getElementById('modalDesc').innerText = 'Dokumentasi resmi kemeriahan dan partisipasi kontingen siswa & guru SMK Gajah Mungkur 1 Wuryantoro.';
  
  const modal = document.getElementById('workModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('workModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function setupKeyboardClose() {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
  
  window.addEventListener('click', (e) => {
    if (e.target.id === 'workModal') closeModal();
  });
}
