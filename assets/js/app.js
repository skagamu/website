let allWorks = [];
let allBabs = [];
let allProjects = [];
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
      allBabs = res.data.babs || [];
      allProjects = res.data.projects || [];
      renderSettings(res.data.settings || {});
      
      // Adaptasi data karya (3-layer hierarchy) dengan fallback portfolio legacy
      if (res.data.karya && res.data.karya.length > 0) {
        renderKaryaShowcase(res.data.karya);
      } else if (res.data.portfolio && res.data.portfolio.length > 0) {
        renderLegacyPortfolio(res.data.portfolio);
      } else {
        renderFallbackPortfolio();
      }

      renderGallery(res.data.gallery || []);
    } else {
      renderFallbackPortfolio();
    }
  } catch (err) {
    console.warn('Using fallback data:', err);
    renderFallbackPortfolio();
  }
  
  setTimeout(initScrollReveal, 50);
}

function renderSettings(settings) {
  if (settings.hero_title) {
    const formatted = settings.hero_title.replace(/\n/g, '<br>');
    document.getElementById('heroTitle').innerHTML = `<span class="text-reveal-item">${formatted}</span>`;
  }
  if (settings.hero_lead) document.getElementById('heroLead').innerText = settings.hero_lead;
  if (settings.about_title) document.getElementById('aboutTitle').innerText = settings.about_title;
  if (settings.about_desc) document.getElementById('aboutDesc').innerText = settings.about_desc;
  if (settings.contact_email) document.getElementById('contactBtn').href = `mailto:${settings.contact_email}`;
  if (settings.footer_text) document.getElementById('footerText').innerText = settings.footer_text;
}

// Render Top 6 Karya Terbaru
function renderKaryaShowcase(karyaList) {
  const published = karyaList.filter(k => k.status !== 'draft');
  
  // Sort terbaru & ambil maksimal 6 karya
  const latestSix = published
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    .slice(0, 6);

  allWorks = latestSix.map(k => {
    const project = allProjects.find(p => p.id === k.project_id) || {};
    const bab = allBabs.find(b => b.id === project.bab_id) || {};
    return {
      id: k.id,
      title: k.title || 'Karya Siswa',
      author: `${k.student_name || 'Siswa SKAGAMU'}${k.class ? ' • ' + k.class : ''}`,
      image_url: k.media_url,
      media_type: k.media_type || 'image',
      description: k.description,
      project_title: project.title || 'Project Pembelajaran',
      bab_title: bab.title || 'Modul DKV',
      lkpd_url: project.lkpd_url || ''
    };
  });

  const grid = document.getElementById('portfolioGrid');
  if (allWorks.length === 0) {
    renderFallbackPortfolio();
    return;
  }

  grid.innerHTML = allWorks.map((item, idx) => `
    <article class="work-card reveal-init stagger-${(idx % 3) + 1}" onclick="openModal('${item.id}')" tabindex="0" role="button" aria-label="Lihat detail ${item.title}">
      <div class="work-thumb">
        ${item.image_url ? `<img src="${item.image_url}" alt="${item.title}" loading="lazy">` : `<div class="work-thumb-placeholder">${item.media_type.toUpperCase()}</div>`}
        <div class="media-type-badge">${item.media_type.toUpperCase()}</div>
      </div>
      <div class="work-body">
        <div>
          <span class="work-category-badge">${item.bab_title.split(':')[0] || 'Modul'} • ${item.project_title}</span>
          <h3>${item.title}</h3>
        </div>
        <p class="work-meta">${item.author}</p>
      </div>
    </article>
  `).join('');
}

function renderLegacyPortfolio(works) {
  const published = works.filter(w => w.status !== 'draft').slice(0, 6);
  allWorks = published.map(w => ({
    id: w.id,
    title: w.title,
    author: w.author,
    image_url: w.image_url,
    media_type: 'image',
    description: w.description,
    project_title: w.category ? w.category.toUpperCase() : 'Project',
    bab_title: 'Modul DKV',
    lkpd_url: ''
  }));
  
  const grid = document.getElementById('portfolioGrid');
  grid.innerHTML = allWorks.map((item, idx) => `
    <article class="work-card reveal-init stagger-${(idx % 3) + 1}" onclick="openModal('${item.id}')" tabindex="0" role="button">
      <div class="work-thumb">
        ${item.image_url ? `<img src="${item.image_url}" alt="${item.title}" loading="lazy">` : `<div class="work-thumb-placeholder">KARYA</div>`}
      </div>
      <div class="work-body">
        <div>
          <span class="work-category-badge">${item.project_title}</span>
          <h3>${item.title}</h3>
        </div>
        <p class="work-meta">${item.author}</p>
      </div>
    </article>
  `).join('');
}

function renderFallbackPortfolio() {
  const defaults = [
    { id: '1', title: 'Carragreen • Eco-Friendly Stationery Brand', bab_title: 'Modul 1: Brand Identity', project_title: 'Desain Brand Ramah Lingkungan', author: 'Fajar Nugraha • XII DKV 1', media_type: 'image', image_url: 'https://lh3.googleusercontent.com/d/1Zc79_ojPJ9KHQdyQ_eQHXb7GCMX9OGr7', description: 'Perancangan identitas visual kemasan dan katalog ramah lingkungan.', lkpd_url: '' },
    { id: '2', title: 'WellNest • On-Demand Wellness UI/UX', bab_title: 'Modul 3: UI/UX & Digital', project_title: 'Mobile App Mockup', author: 'Dewi Anggraini • XI DKV 2', media_type: 'image', image_url: 'https://lh3.googleusercontent.com/d/1DhQe5DqI9J6BEa4716Zvly1H__oDIC3a', description: 'Perancangan prototipe antarmuka aplikasi pemesanan terapi mobile interaktif.', lkpd_url: '' },
    { id: '3', title: 'HookLab • Short-Form Motion Promo', bab_title: 'Modul 2: Motion Ads', project_title: 'Video Iklan Digital', author: 'Rizky Pratama • XII DKV 1', media_type: 'video', image_url: '', description: 'Konsep kampanye visual video berkinerja tinggi untuk brand lokal.', lkpd_url: '' }
  ];
  allWorks = defaults;
  const grid = document.getElementById('portfolioGrid');
  grid.innerHTML = defaults.map((item, idx) => `
    <article class="work-card reveal-init stagger-${(idx % 3) + 1}" onclick="openModal('${item.id}')" tabindex="0" role="button">
      <div class="work-thumb">
        ${item.image_url ? `<img src="${item.image_url}" alt="${item.title}">` : `<div class="work-thumb-placeholder">${item.media_type.toUpperCase()}</div>`}
      </div>
      <div class="work-body">
        <div>
          <span class="work-category-badge">${item.bab_title.split(':')[0]} • ${item.project_title}</span>
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
  const filterWrap = document.getElementById('filterContainer');
  if (!filterWrap) return;
  filterWrap.innerHTML = `
    <span style="font-size: 13px; color: var(--ink-muted); display: flex; align-items: center; gap: 8px;">
      ✨ Menampilkan 6 Karya Siswa Terbaru Berbasis Modul & Proyek Nyata
    </span>
  `;
}

function initScrollReveal() {
  const heroSection = document.querySelector('.hero');
  if (heroSection) heroSection.classList.add('reveal-visible');

  const staticTargets = document.querySelectorAll('.hero-grid > div, .section-head, .two-col > div, .service-card, .contact-card');
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
    urlBar.innerText = `skagamu.sch.id/karya/${encodeURIComponent(item.title.toLowerCase().replace(/\s+/g, '-'))}`;
  } else {
    frame.style.display = 'none';
  }
  
  document.getElementById('modalCategory').innerText = `${item.bab_title} • ${item.project_title}`;
  document.getElementById('modalTitle').innerText = item.title || '';
  document.getElementById('modalAuthor').innerText = item.author || 'Siswa SKAGAMU';
  
  let descHtml = item.description || 'Tidak ada deskripsi.';
  if (item.lkpd_url) {
    descHtml += `<div style="margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--line);"><a href="${item.lkpd_url}" target="_blank" rel="noopener" class="btn" style="padding: 6px 14px; font-size: 13px; display: inline-flex; align-items: center; gap: 6px;">📄 Lihat Panduan LKPD Acuan</a></div>`;
  }
  document.getElementById('modalDesc').innerHTML = descHtml;
  
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
  urlBar.innerText = `skagamu.sch.id/gallery/dokumentasi`;
  
  document.getElementById('modalCategory').innerText = 'Dokumentasi & Galeri';
  document.getElementById('modalTitle').innerText = title;
  document.getElementById('modalAuthor').innerText = 'Aktivitas Belajar & Kreatif • SKAGAMU';
  document.getElementById('modalDesc').innerHTML = 'Dokumentasi resmi aktivitas pembelajaran berbasis proyek dan kegiatan kreatif siswa SMK Gajah Mungkur 1 Wuryantoro.';
  
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
