let currentAuth = null;
let currentBabs = [];
let currentProjects = [];
let currentKarya = [];
let currentGallery = [];
let currentSettings = {};

// Navigation State (1: Bab, 2: Project, 3: Karya)
let currentLevel = 1;
let selectedBab = null;
let selectedProject = null;

document.addEventListener('DOMContentLoaded', () => {
  checkAuthSession();
  setupLoginForm();
  setupNavTabs();
  setupSettingsForm();
  setupGalleryForm();
  setupBabForm();
  setupProjectForm();
  setupKaryaForm();
});

/* ============================================================
   AUTH HANDLING
============================================================ */
function checkAuthSession() {
  const saved = sessionStorage.getItem(CONFIG.STORAGE_AUTH_KEY);
  if (saved) {
    try {
      currentAuth = JSON.parse(saved);
      document.getElementById('loginOverlay').style.display = 'none';
      document.getElementById('adminUserName').innerText = currentAuth.name || currentAuth.username;
      loadAllAdminData();
    } catch (e) {
      showLoginOverlay();
    }
  } else {
    showLoginOverlay();
  }
}

function showLoginOverlay() {
  document.getElementById('loginOverlay').style.display = 'flex';
}

function setupLoginForm() {
  const form = document.getElementById('loginForm');
  const toggleBtn = document.getElementById('togglePasswordBtn');
  const passInput = document.getElementById('loginPassword');
  const errorMsg = document.getElementById('loginErrorMsg');
  const loginBox = document.getElementById('loginBox');
  const submitBtn = document.getElementById('loginSubmitBtn');
  const btnText = document.getElementById('loginBtnText');

  toggleBtn.addEventListener('click', () => {
    const isPass = passInput.type === 'password';
    passInput.type = isPass ? 'text' : 'password';
    toggleBtn.innerText = isPass ? '🙈' : '👁️';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.style.display = 'none';
    loginBox.classList.remove('shake');
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = passInput.value.trim();

    submitBtn.disabled = true;
    btnText.innerHTML = '<span class="btn-spinner"></span> Memverifikasi...';

    try {
      const res = await fetchAPI('login', { username, password }, 'POST');
      if (res && res.success && res.user) {
        currentAuth = { username, password, name: res.user.name, role: res.user.role };
        sessionStorage.setItem(CONFIG.STORAGE_AUTH_KEY, JSON.stringify(currentAuth));
        document.getElementById('adminUserName').innerText = res.user.name || username;
        document.getElementById('loginOverlay').style.display = 'none';
        loadAllAdminData();
        showToast('Login berhasil! Selamat datang di CMS.');
      } else {
        throw new Error(res.message || 'Username atau password salah.');
      }
    } catch (err) {
      errorMsg.innerText = err.message || 'Gagal terhubung ke database.';
      errorMsg.style.display = 'block';
      loginBox.classList.add('shake');
    } finally {
      submitBtn.disabled = false;
      btnText.innerText = 'Masuk ke CMS';
    }
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem(CONFIG.STORAGE_AUTH_KEY);
    currentAuth = null;
    location.reload();
  });
}

function setupNavTabs() {
  const items = document.querySelectorAll('.sidebar .nav-item');
  items.forEach(item => {
    item.addEventListener('click', () => {
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const tabId = item.dataset.tab;
      document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');
    });
  });
}

/* ============================================================
   DATA LOADING
============================================================ */
async function loadAllAdminData() {
  try {
    const res = await fetchAPI('getData');
    if (res && res.success && res.data) {
      currentBabs = res.data.babs || [];
      currentProjects = res.data.projects || [];
      currentKarya = res.data.karya || [];
      currentGallery = res.data.gallery || [];
      currentSettings = res.data.settings || {};

      renderCurrentExplorerView();
      renderGalleryTable();
      populateSettings();
    }
  } catch (err) {
    showToast('Gagal memuat data dari database', true);
  }
}

/* ============================================================
   EXPLORER DRILL-DOWN LOGIC (LEVEL 1, 2, 3)
============================================================ */
function navigateToLevel(level, dataId = null) {
  currentLevel = level;
  const view1 = document.getElementById('viewLevel1');
  const view2 = document.getElementById('viewLevel2');
  const view3 = document.getElementById('viewLevel3');
  const bc = document.getElementById('explorerBreadcrumb');

  view1.style.display = 'none';
  view2.style.display = 'none';
  view3.style.display = 'none';

  if (level === 1) {
    selectedBab = null;
    selectedProject = null;
    view1.style.display = 'block';
    bc.innerHTML = `<span class="breadcrumb-item active">📁 Semua Modul</span>`;
    renderBabGrid();
  } else if (level === 2) {
    if (dataId) selectedBab = currentBabs.find(b => b.id === dataId);
    if (!selectedBab) return navigateToLevel(1);
    
    selectedProject = null;
    view2.style.display = 'block';
    document.getElementById('level2BabTitle').innerText = selectedBab.title;
    document.getElementById('level2BabDesc').innerText = selectedBab.description || 'Daftar proyek dan tugas siswa dalam modul ini.';
    
    bc.innerHTML = `
      <span class="breadcrumb-item" onclick="navigateToLevel(1)">📁 Semua Modul</span>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-item active">📂 ${selectedBab.title}</span>
    `;
    renderProjectGrid();
  } else if (level === 3) {
    if (dataId) selectedProject = currentProjects.find(p => p.id === dataId);
    if (!selectedProject) return navigateToLevel(2);

    view3.style.display = 'block';
    document.getElementById('level3ProjTitle').innerText = selectedProject.title;
    document.getElementById('level3ProjBrief').innerText = selectedProject.brief || 'Instruksi capaian tugas siswa.';
    
    const lkpdWrap = document.getElementById('level3LkpdBadge');
    if (selectedProject.lkpd_url) {
      lkpdWrap.innerHTML = `<a href="${selectedProject.lkpd_url}" target="_blank" rel="noopener" class="action-btn" style="color: #60a5fa; border-color: rgba(96,165,250,0.3);">📄 Buka Panduan LKPD</a>`;
    } else {
      lkpdWrap.innerHTML = `<span style="font-size: 12px; color: var(--ink-muted);">⚠️ Belum ada file/link LKPD</span>`;
    }

    bc.innerHTML = `
      <span class="breadcrumb-item" onclick="navigateToLevel(1)">📁 Semua Modul</span>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-item" onclick="navigateToLevel(2)">📂 ${selectedBab ? selectedBab.title : 'Modul'}</span>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-item active">📝 ${selectedProject.title}</span>
    `;
    renderKaryaTable();
  }
}

function renderCurrentExplorerView() {
  navigateToLevel(currentLevel, selectedProject ? selectedProject.id : (selectedBab ? selectedBab.id : null));
}

function renderBabGrid() {
  const container = document.getElementById('babFolderGrid');
  if (currentBabs.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; padding: 32px; text-align: center; color: var(--ink-muted);">Belum ada modul pembelajaran. Klik '+ Tambah Modul' di atas.</div>`;
    return;
  }

  container.innerHTML = currentBabs.map(b => {
    const projCount = currentProjects.filter(p => p.bab_id === b.id).length;
    const projectIds = currentProjects.filter(p => p.bab_id === b.id).map(p => p.id);
    const karyaCount = currentKarya.filter(k => projectIds.includes(k.project_id)).length;

    return `
      <div class="folder-card" onclick="navigateToLevel(2, '${b.id}')">
        <div>
          <div class="folder-icon">📁</div>
          <div class="folder-title">${b.title}</div>
          <div style="font-size: 13px; color: var(--ink-muted); margin-bottom: 12px; line-height: 1.4;">${b.description || 'Tidak ada deskripsi.'}</div>
        </div>
        <div class="folder-meta" style="display: flex; justify-content: space-between; border-top: 1px solid var(--hairline); padding-top: 10px;">
          <span>${projCount} Proyek</span>
          <span>${karyaCount} Karya Siswa</span>
        </div>
      </div>
    `;
  }).join('');
}

function renderProjectGrid() {
  const container = document.getElementById('projectFolderGrid');
  const filtered = currentProjects.filter(p => p.bab_id === selectedBab.id);

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; padding: 32px; text-align: center; color: var(--ink-muted);">Belum ada project di modul ini. Klik '+ Tambah Project'.</div>`;
    return;
  }

  container.innerHTML = filtered.map(p => {
    const karyaCount = currentKarya.filter(k => k.project_id === p.id).length;
    const hasLkpd = Boolean(p.lkpd_url);

    return `
      <div class="folder-card" onclick="navigateToLevel(3, '${p.id}')">
        <div>
          <div class="folder-icon">📂</div>
          <div class="folder-title">${p.title}</div>
          <div style="font-size: 13px; color: var(--ink-muted); margin-bottom: 10px;">${p.brief || 'Tidak ada instruksi khusus.'}</div>
        </div>
        <div>
          <div style="margin-bottom: 10px;">
            ${hasLkpd ? `<span class="badge" style="background: rgba(96,165,250,0.15); color: #60a5fa;">LKPD Terlampir</span>` : `<span class="badge" style="background: var(--surface-2); color: var(--ink-muted);">Tanpa LKPD</span>`}
          </div>
          <div class="folder-meta" style="display: flex; justify-content: space-between; border-top: 1px solid var(--hairline); padding-top: 10px;">
            <span>${karyaCount} Karya Siswa</span>
            <span>Buka Tugas →</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderKaryaTable() {
  const tbody = document.getElementById('karyaTableBody');
  const filtered = currentKarya.filter(k => k.project_id === selectedProject.id);

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 32px; color: var(--ink-muted);">Belum ada karya siswa yang diunggah. Klik '+ Upload Karya Siswa'.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(k => `
    <tr>
      <td style="width: 80px;">
        ${k.media_url ? `<img src="${k.media_url}" style="width: 60px; height: 42px; object-fit: cover; border-radius: 4px; border: 1px solid var(--hairline);" onerror="this.style.display='none'">` : `<div style="width: 60px; height: 42px; background: var(--surface-2); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: var(--ink-muted);">${(k.media_type||'DOC').toUpperCase()}</div>`}
      </td>
      <td><strong>${k.title}</strong><div style="font-size: 12px; color: var(--ink-muted);">${k.description ? k.description.substring(0, 45) + '...' : ''}</div></td>
      <td>${k.student_name} <span style="font-size: 12px; color: var(--ink-muted);">(${k.class || '-'})</span></td>
      <td><span class="badge" style="background: var(--surface-2); color: var(--ink);">${(k.media_type || 'image').toUpperCase()}</span></td>
      <td><span class="badge badge-${k.status || 'published'}">${k.status || 'published'}</span></td>
      <td>
        <button class="action-btn" onclick="editKarya('${k.id}')">Edit</button>
        <button class="action-btn delete" onclick="deleteKarya('${k.id}')">Hapus</button>
      </td>
    </tr>
  `).join('');
}

/* ============================================================
   BAB MODAL & HANDLER
============================================================ */
function openBabModal(isEdit = false) {
  const modal = document.getElementById('babModal');
  document.getElementById('babModalTitle').innerText = isEdit ? 'Edit Modul Pembelajaran' : 'Tambah Modul Baru';
  if (!isEdit) {
    document.getElementById('babId').value = '';
    document.getElementById('babTitle').value = '';
    document.getElementById('babDesc').value = '';
  }
  modal.classList.add('active');
}
function closeBabModal() { document.getElementById('babModal').classList.remove('active'); }
function editCurrentBab() {
  if (!selectedBab) return;
  document.getElementById('babId').value = selectedBab.id;
  document.getElementById('babTitle').value = selectedBab.title;
  document.getElementById('babDesc').value = selectedBab.description || '';
  openBabModal(true);
}

function setupBabForm() {
  document.getElementById('babForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('saveBabBtn');
    btn.disabled = true;
    btn.innerText = 'Menyimpan...';

    const id = document.getElementById('babId').value || ('bab_' + Date.now());
    const title = document.getElementById('babTitle').value.trim();
    const description = document.getElementById('babDesc').value.trim();

    try {
      const res = await fetchAPI('saveBab', {
        username: currentAuth.username,
        password: currentAuth.password,
        item: { id, title, description, order: 1 }
      }, 'POST');
      if (res && res.success) {
        showToast('Modul berhasil disimpan!');
        closeBabModal();
        await loadAllAdminData();
      } else {
        throw new Error(res.message || 'Gagal menyimpan modul');
      }
    } catch (err) {
      showToast(err.message, true);
    } finally {
      btn.disabled = false;
      btn.innerText = 'Simpan Modul';
    }
  });
}

/* ============================================================
   PROJECT MODAL & HANDLER (LKPD)
============================================================ */
function openProjectModal(isEdit = false) {
  if (!selectedBab) return;
  const modal = document.getElementById('projectModal');
  document.getElementById('projModalTitle').innerText = isEdit ? 'Edit Project' : `Tambah Project ke ${selectedBab.title}`;
  document.getElementById('projBabId').value = selectedBab.id;
  if (!isEdit) {
    document.getElementById('projId').value = '';
    document.getElementById('projTitle').value = '';
    document.getElementById('projBrief').value = '';
    document.getElementById('projLkpdUrl').value = '';
  }
  modal.classList.add('active');
}
function closeProjectModal() { document.getElementById('projectModal').classList.remove('active'); }
function editCurrentProject() {
  if (!selectedProject) return;
  document.getElementById('projId').value = selectedProject.id;
  document.getElementById('projBabId').value = selectedProject.bab_id;
  document.getElementById('projTitle').value = selectedProject.title;
  document.getElementById('projBrief').value = selectedProject.brief || '';
  document.getElementById('projLkpdUrl').value = selectedProject.lkpd_url || '';
  openProjectModal(true);
}

function setupProjectForm() {
  document.getElementById('projectForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('saveProjBtn');
    btn.disabled = true;
    btn.innerText = 'Menyimpan...';

    const id = document.getElementById('projId').value || ('proj_' + Date.now());
    const bab_id = document.getElementById('projBabId').value;
    const title = document.getElementById('projTitle').value.trim();
    const brief = document.getElementById('projBrief').value.trim();
    const lkpd_url = document.getElementById('projLkpdUrl').value.trim();

    try {
      const res = await fetchAPI('saveProject', {
        username: currentAuth.username,
        password: currentAuth.password,
        item: { id, bab_id, title, brief, lkpd_url, order: 1 }
      }, 'POST');
      if (res && res.success) {
        showToast('Project & LKPD berhasil disimpan!');
        closeProjectModal();
        await loadAllAdminData();
      } else {
        throw new Error(res.message || 'Gagal menyimpan project');
      }
    } catch (err) {
      showToast(err.message, true);
    } finally {
      btn.disabled = false;
      btn.innerText = 'Simpan Project';
    }
  });
}

/* ============================================================
   KARYA MODAL & HANDLER (MULTI-MEDIA + COMPRESSOR)
============================================================ */
function toggleMediaInput() {
  const type = document.getElementById('karyaMediaType').value;
  const groupImg = document.getElementById('groupImageUpload');
  const groupUrl = document.getElementById('groupMediaUrl');

  if (type === 'image') {
    groupImg.style.display = 'block';
    groupUrl.style.display = 'none';
  } else {
    groupImg.style.display = 'none';
    groupUrl.style.display = 'block';
  }
}

function openKaryaModal(isEdit = false) {
  if (!selectedProject) return;
  const modal = document.getElementById('karyaModal');
  document.getElementById('karyaModalTitle').innerText = isEdit ? 'Edit Karya Siswa' : `Upload Karya ke ${selectedProject.title}`;
  document.getElementById('karyaProjId').value = selectedProject.id;
  if (!isEdit) {
    document.getElementById('karyaId').value = '';
    document.getElementById('karyaMediaUrl').value = '';
    document.getElementById('karyaTitle').value = '';
    document.getElementById('karyaStudent').value = '';
    document.getElementById('karyaDesc').value = '';
    document.getElementById('karyaFile').value = '';
    document.getElementById('karyaUrlInput').value = '';
    document.getElementById('karyaImgPreview').innerHTML = '';
    document.getElementById('karyaMediaType').value = 'image';
    toggleMediaInput();
  }
  modal.classList.add('active');
}
function closeKaryaModal() { document.getElementById('karyaModal').classList.remove('active'); }

function editKarya(id) {
  const item = currentKarya.find(k => k.id === id);
  if (!item) return;
  document.getElementById('karyaId').value = item.id;
  document.getElementById('karyaProjId').value = item.project_id;
  document.getElementById('karyaMediaUrl').value = item.media_url || '';
  document.getElementById('karyaTitle').value = item.title;
  document.getElementById('karyaStudent').value = item.student_name + (item.class ? ` • ${item.class}` : '');
  document.getElementById('karyaMediaType').value = item.media_type || 'image';
  document.getElementById('karyaDesc').value = item.description || '';
  document.getElementById('karyaStatus').value = item.status || 'published';
  
  if (item.media_type === 'image' && item.media_url) {
    document.getElementById('karyaImgPreview').innerHTML = `<img src="${item.media_url}" style="width: 100px; height: 60px; object-fit: cover; border-radius: 4px;">`;
  } else {
    document.getElementById('karyaUrlInput').value = item.media_url || '';
  }
  toggleMediaInput();
  openKaryaModal(true);
}

async function deleteKarya(id) {
  if (!confirm('Yakin ingin menghapus karya siswa ini?')) return;
  try {
    const res = await fetchAPI('deleteKarya', {
      username: currentAuth.username,
      password: currentAuth.password,
      id
    }, 'POST');
    if (res && res.success) {
      showToast('Karya siswa berhasil dihapus');
      await loadAllAdminData();
    }
  } catch (err) {
    showToast('Gagal menghapus karya', true);
  }
}

function setupKaryaForm() {
  document.getElementById('karyaForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('saveKaryaBtn');
    btn.disabled = true;
    btn.innerText = 'Mengunggah & Menyimpan...';

    const id = document.getElementById('karyaId').value || ('kar_' + Date.now());
    const project_id = document.getElementById('karyaProjId').value;
    const title = document.getElementById('karyaTitle').value.trim();
    const rawStudent = document.getElementById('karyaStudent').value.trim();
    const [student_name, student_class] = rawStudent.includes('•') ? rawStudent.split('•').map(s => s.trim()) : [rawStudent, ''];
    const media_type = document.getElementById('karyaMediaType').value;
    const description = document.getElementById('karyaDesc').value.trim();
    const status = document.getElementById('karyaStatus').value;
    const fileInput = document.getElementById('karyaFile');
    let media_url = document.getElementById('karyaMediaUrl').value;

    try {
      if (media_type === 'image' && fileInput.files.length > 0) {
        btn.innerText = 'Mengompres & Upload ke Drive...';
        const base64 = await compressImage(fileInput.files[0], 1600, 0.85);
        const uploadRes = await fetchAPI('uploadImage', {
          username: currentAuth.username,
          password: currentAuth.password,
          base64,
          filename: `karya_${Date.now()}.jpg`
        }, 'POST');
        if (!uploadRes.success) throw new Error('Gagal upload gambar ke Google Drive');
        media_url = uploadRes.url;
      } else if (media_type !== 'image') {
        media_url = document.getElementById('karyaUrlInput').value.trim();
      }

      const res = await fetchAPI('saveKarya', {
        username: currentAuth.username,
        password: currentAuth.password,
        item: {
          id, project_id, title, student_name, class: student_class,
          media_type, media_url, description, status
        }
      }, 'POST');

      if (res && res.success) {
        showToast('Karya siswa berhasil disimpan!');
        closeKaryaModal();
        await loadAllAdminData();
      } else {
        throw new Error(res.message || 'Gagal menyimpan karya');
      }
    } catch (err) {
      showToast(err.message, true);
    } finally {
      btn.disabled = false;
      btn.innerText = 'Simpan Karya Siswa';
    }
  });
}

/* ============================================================
   GALLERY & SETTINGS HANDLERS
============================================================ */
function renderGalleryTable() {
  const tbody = document.getElementById('galleryTableBody');
  if (currentGallery.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 24px; color: var(--ink-muted);">Belum ada foto kegiatan.</td></tr>`;
    return;
  }
  tbody.innerHTML = currentGallery.map(g => `
    <tr>
      <td><img src="${g.image_url}" style="width: 80px; height: 50px; object-fit: cover; border-radius: 4px; border: 1px solid var(--hairline);"></td>
      <td><strong>${g.title}</strong></td>
      <td>#${g.order || 1}</td>
      <td><button class="action-btn delete" onclick="deleteGalleryItem('${g.id}')">Hapus</button></td>
    </tr>
  `).join('');
}

function openGalleryModal() { document.getElementById('galleryModal').classList.add('active'); }
function closeGalleryModal() { document.getElementById('galleryModal').classList.remove('active'); }

async function deleteGalleryItem(id) {
  if (!confirm('Yakin ingin menghapus foto kegiatan ini?')) return;
  try {
    const res = await fetchAPI('deleteGallery', { username: currentAuth.username, password: currentAuth.password, id }, 'POST');
    if (res && res.success) {
      showToast('Foto kegiatan berhasil dihapus');
      await loadAllAdminData();
    }
  } catch (err) {
    showToast('Gagal menghapus foto', true);
  }
}

function setupGalleryForm() {
  document.getElementById('galleryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('saveGalleryBtn');
    btn.disabled = true;
    btn.innerText = 'Mengompres & Upload...';

    const title = document.getElementById('gTitle').value.trim();
    const file = document.getElementById('gFile').files[0];

    try {
      const base64 = await compressImage(file, 1600, 0.85);
      const uploadRes = await fetchAPI('uploadImage', {
        username: currentAuth.username,
        password: currentAuth.password,
        base64,
        filename: `gal_${Date.now()}.jpg`
      }, 'POST');
      if (!uploadRes.success) throw new Error('Upload gambar gagal');

      const res = await fetchAPI('saveGallery', {
        username: currentAuth.username,
        password: currentAuth.password,
        item: { title, image_url: uploadRes.url, order: currentGallery.length + 1 }
      }, 'POST');

      if (res && res.success) {
        showToast('Foto dokumentasi berhasil ditambahkan!');
        closeGalleryModal();
        await loadAllAdminData();
      }
    } catch (err) {
      showToast(err.message, true);
    } finally {
      btn.disabled = false;
      btn.innerText = 'Upload ke Galeri';
    }
  });
}

function populateSettings() {
  if (currentSettings.hero_title) document.getElementById('settingHeroTitle').value = currentSettings.hero_title;
  if (currentSettings.hero_lead) document.getElementById('settingHeroLead').value = currentSettings.hero_lead;
  if (currentSettings.about_title) document.getElementById('settingAboutTitle').value = currentSettings.about_title;
  if (currentSettings.about_desc) document.getElementById('settingAboutDesc').value = currentSettings.about_desc;
  if (currentSettings.contact_email) document.getElementById('settingContactEmail').value = currentSettings.contact_email;
}

function setupSettingsForm() {
  document.getElementById('settingsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('saveSettingsBtn');
    btn.disabled = true;
    btn.innerText = 'Menyimpan...';

    const settings = {
      hero_title: document.getElementById('settingHeroTitle').value.trim(),
      hero_lead: document.getElementById('settingHeroLead').value.trim(),
      about_title: document.getElementById('settingAboutTitle').value.trim(),
      about_desc: document.getElementById('settingAboutDesc').value.trim(),
      contact_email: document.getElementById('settingContactEmail').value.trim()
    };

    try {
      const res = await fetchAPI('saveSettings', {
        username: currentAuth.username,
        password: currentAuth.password,
        settings
      }, 'POST');
      if (res && res.success) {
        showToast('Pengaturan website berhasil diperbarui!');
        await loadAllAdminData();
      }
    } catch (err) {
      showToast('Gagal menyimpan pengaturan', true);
    } finally {
      btn.disabled = false;
      btn.innerText = 'Simpan Pengaturan';
    }
  });
}

/* ============================================================
   CLIENT COMPRESSION UTILITY
============================================================ */
function compressImage(file, maxDimension = 1600, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  toast.innerText = msg;
  toast.style.background = isError ? '#ef4444' : '#22c55e';
  toast.style.display = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, 3500);
}
