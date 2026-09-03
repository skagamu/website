let allWorks = [];

document.addEventListener('DOMContentLoaded', () => {
  initPublicData();
  setupFilters();
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
}

function renderSettings(settings) {
  if (settings.hero_title) document.getElementById('heroTitle').innerHTML = settings.hero_title.replace('\n', '<br>');
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

  grid.innerHTML = allWorks.map(item => `
    <article class="work-card" data-category="${item.category || 'branding'}" onclick="openModal('${item.id}')">
      <div class="work-thumb">
        ${item.image_url ? `<img src="${item.image_url}" alt="${item.title}" loading="lazy">` : `<div class="work-thumb-placeholder">${(item.category || 'WORK').toUpperCase()}</div>`}
      </div>
      <div class="work-body">
        <div>
          <span class="work-category-badge">${item.category || 'Karya'}</span>
          <h3>${item.title || 'Untitled Project'}</h3>
        </div>
        <p class="work-meta">${item.author || 'Siswa SKAGAMU'}</p>
      </div>
    </article>
  `).join('');
}

function renderFallbackPortfolio() {
  const grid = document.getElementById('portfolioGrid');
  const defaults = [
    { id: '1', title: 'Identitas Merek Kopi Wuryantoro', category: 'branding', author: 'Ahmad • Kelas XI DKV', description: 'Perancangan identitas visual merek produk kopi khas daerah.' },
    { id: '2', title: 'Poster Kampanye Lingkungan', category: 'design', author: 'Siti • Kelas X DKV', description: 'Poster visual edukasi peduli lingkungan dan hemat energi.' },
    { id: '3', title: 'Video Dokumenter Kreatif', category: 'content', author: 'Budi • Kelas XI DKV', description: 'Produksi video sinematik aktivitas ekstrakurikuler sekolah.' }
  ];
  allWorks = defaults;
  grid.innerHTML = defaults.map(item => `
    <article class="work-card" data-category="${item.category}" onclick="openModal('${item.id}')">
      <div class="work-thumb">
        <div class="work-thumb-placeholder">${item.category.toUpperCase()}</div>
      </div>
      <div class="work-body">
        <div>
          <span class="work-category-badge">${item.category}</span>
          <h3>${item.title}</h3>
        </div>
        <p class="work-meta">${item.author}</p>
      </div>
    </article>
  `).join('');
}

function renderGallery(gallery) {
  const container = document.getElementById('galleryGrid');
  if (!gallery || gallery.length === 0) return;
  container.innerHTML = gallery.map(item => `
    <div class="gallery-item">
      ${item.image_url ? `<img src="${item.image_url}" alt="${item.title}" loading="lazy">` : ''}
      <div class="gallery-item-title">${item.title}</div>
    </div>
  `).join('');
}

function setupFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.work-card').forEach(card => {
        card.style.display = (filter === 'all' || card.dataset.category === filter) ? 'flex' : 'none';
      });
    });
  });
}

function openModal(id) {
  const item = allWorks.find(w => w.id === id);
  if (!item) return;
  
  const imgEl = document.getElementById('modalImg');
  if (item.image_url) {
    imgEl.src = item.image_url;
    imgEl.style.display = 'block';
  } else {
    imgEl.style.display = 'none';
  }
  
  document.getElementById('modalCategory').innerText = item.category || 'Karya';
  document.getElementById('modalTitle').innerText = item.title || '';
  document.getElementById('modalAuthor').innerText = item.author || 'Siswa SKAGAMU';
  document.getElementById('modalDesc').innerText = item.description || 'Tidak ada deskripsi.';
  document.getElementById('workModal').classList.add('active');
}

function closeModal() {
  document.getElementById('workModal').classList.remove('active');
}

window.onclick = (e) => {
  if (e.target.id === 'workModal') closeModal();
};
