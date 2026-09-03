let adminAuth = null;
let currentData = { portfolio: [], gallery: [], settings: {} };

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  setupEvents();
});

function checkAuth() {
  const saved = sessionStorage.getItem(CONFIG.STORAGE_AUTH_KEY);
  if (saved) {
    adminAuth = JSON.parse(saved);
    showDashboard();
  }
}

function showDashboard() {
  document.getElementById('loginOverlay').style.display = 'none';
  document.getElementById('adminApp').style.display = 'grid';
  loadDashboardData();
}

async function loadDashboardData() {
  try {
    const res = await fetchAPI('getData');
    if (res && res.success && res.data) {
      currentData = res.data;
      renderPortfolioTable(currentData.portfolio || []);
      renderGalleryTable(currentData.gallery || []);
      fillSettings(currentData.settings || {});
    }
  } catch (err) {
    showToast('Gagal memuat data dari database', true);
  }
}

function setupEvents() {
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('loginBtn');
    btn.innerText = 'Memverifikasi...';
    btn.disabled = true;

    const username = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPass').value;

    try {
      const res = await fetchAPI('saveSettings', { username, password, settings: {} }, 'POST');
      if (res && res.success) {
        adminAuth = { username, password };
        sessionStorage.setItem(CONFIG.STORAGE_AUTH_KEY, JSON.stringify(adminAuth));
        showDashboard();
      } else {
        document.getElementById('loginError').innerText = 'Username atau Password salah!';
        document.getElementById('loginError').style.display = 'block';
      }
    } catch (err) {
      document.getElementById('loginError').innerText = 'Gagal menghubungi server Apps Script.';
      document.getElementById('loginError').style.display = 'block';
    } finally {
      btn.innerText = 'Masuk Dashboard';
      btn.disabled = false;
    }
  });

  document.getElementById('portfolioForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('savePortfolioBtn');
    btn.innerText = 'Menyimpan ke Google Drive & Sheets...';
    btn.disabled = true;

    try {
      let imageUrl = document.getElementById('pImageUrl').value;
      const fileInput = document.getElementById('pFile');
      if (fileInput.files.length > 0) {
        const base64 = await fileToBase64(fileInput.files[0]);
        const uploadRes = await fetchAPI('uploadImage', {
          username: adminAuth.username,
          password: adminAuth.password,
          filename: fileInput.files[0].name,
          base64: base64
        }, 'POST');
        if (uploadRes && uploadRes.success) {
          imageUrl = uploadRes.url;
        }
      }

      const item = {
        id: document.getElementById('pId').value || '',
        title: document.getElementById('pTitle').value,
        category: document.getElementById('pCategory').value,
        author: document.getElementById('pAuthor').value,
        image_url: imageUrl,
        description: document.getElementById('pDesc').value,
        status: document.getElementById('pStatus').value
      };

      const saveRes = await fetchAPI('savePortfolio', {
        username: adminAuth.username,
        password: adminAuth.password,
        item: item
      }, 'POST');

      if (saveRes && saveRes.success) {
        showToast('Karya berhasil disimpan!');
        closePortfolioModal();
        loadDashboardData();
      }
    } catch (err) {
      showToast('Gagal menyimpan karya', true);
    } finally {
      btn.innerText = 'Simpan Karya';
      btn.disabled = false;
    }
  });

  document.getElementById('galleryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('saveGalleryBtn');
    btn.innerText = 'Mengupload ke Google Drive...';
    btn.disabled = true;

    try {
      const fileInput = document.getElementById('gFile');
      const base64 = await fileToBase64(fileInput.files[0]);
      const uploadRes = await fetchAPI('uploadImage', {
        username: adminAuth.username,
        password: adminAuth.password,
        filename: fileInput.files[0].name,
        base64: base64
      }, 'POST');

      if (uploadRes && uploadRes.success) {
        const item = {
          title: document.getElementById('gTitle').value,
          image_url: uploadRes.url,
          order: (currentData.gallery ? currentData.gallery.length : 0) + 1
        };
        await fetchAPI('saveGallery', {
          username: adminAuth.username,
          password: adminAuth.password,
          item: item
        }, 'POST');
        showToast('Foto galeri berhasil diupload!');
        closeGalleryModal();
        loadDashboardData();
      }
    } catch (err) {
      showToast('Gagal upload galeri', true);
    } finally {
      btn.innerText = 'Upload ke Galeri';
      btn.disabled = false;
    }
  });

  document.getElementById('settingsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('saveSettingsBtn');
    btn.innerText = 'Menyimpan...';
    btn.disabled = true;

    try {
      const settings = {
        hero_title: document.getElementById('settingHeroTitle').value,
        hero_lead: document.getElementById('settingHeroLead').value,
        about_title: document.getElementById('settingAboutTitle').value,
        about_desc: document.getElementById('settingAboutDesc').value,
        contact_email: document.getElementById('settingContactEmail').value
      };

      const res = await fetchAPI('saveSettings', {
        username: adminAuth.username,
        password: adminAuth.password,
        settings: settings
      }, 'POST');

      if (res && res.success) {
        showToast('Pengaturan website berhasil diperbarui!');
      }
    } catch (err) {
      showToast('Gagal menyimpan pengaturan', true);
    } finally {
      btn.innerText = 'Simpan Pengaturan';
      btn.disabled = false;
    }
  });
}

function renderPortfolioTable(list) {
  const tbody = document.getElementById('portfolioTableBody');
  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 24px; color: var(--ink-muted);">Belum ada karya siswa. Silakan tambah karya baru.</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(item => `
    <tr>
      <td>${item.image_url ? `<img src="${item.image_url}" style="width: 44px; height: 44px; object-fit: cover; border-radius: 6px;">` : '—'}</td>
      <td><strong>${item.title || '-'}</strong></td>
      <td><span class="badge" style="background: var(--surface-3);">${item.category || '-'}</span></td>
      <td>${item.author || '-'}</td>
      <td><span class="badge ${item.status === 'published' ? 'badge-published' : 'badge-draft'}">${item.status || 'published'}</span></td>
      <td>
        <button class="action-btn" onclick="editPortfolio('${item.id}')">Edit</button>
        <button class="action-btn delete" onclick="deletePortfolio('${item.id}')">Hapus</button>
      </td>
    </tr>
  `).join('');
}

function renderGalleryTable(list) {
  const tbody = document.getElementById('galleryTableBody');
  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 24px; color: var(--ink-muted);">Belum ada foto kegiatan.</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(item => `
    <tr>
      <td><img src="${item.image_url}" style="width: 60px; height: 40px; object-fit: cover; border-radius: 6px;"></td>
      <td><strong>${item.title}</strong></td>
      <td>${item.order || 1}</td>
      <td>
        <button class="action-btn delete" onclick="deleteGallery('${item.id}')">Hapus</button>
      </td>
    </tr>
  `).join('');
}

function fillSettings(s) {
  if (s.hero_title) document.getElementById('settingHeroTitle').value = s.hero_title;
  if (s.hero_lead) document.getElementById('settingHeroLead').value = s.hero_lead;
  if (s.about_title) document.getElementById('settingAboutTitle').value = s.about_title;
  if (s.about_desc) document.getElementById('settingAboutDesc').value = s.about_desc;
  if (s.contact_email) document.getElementById('settingContactEmail').value = s.contact_email;
}

function switchTab(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.sidebar .nav-item').forEach(el => el.classList.remove('active'));
  
  if (tab === 'portfolio') {
    document.getElementById('portfolioTab').classList.add('active');
    document.querySelectorAll('.sidebar .nav-item')[0].classList.add('active');
  } else if (tab === 'gallery') {
    document.getElementById('galleryTab').classList.add('active');
    document.querySelectorAll('.sidebar .nav-item')[1].classList.add('active');
  } else if (tab === 'settings') {
    document.getElementById('settingsTab').classList.add('active');
    document.querySelectorAll('.sidebar .nav-item')[2].classList.add('active');
  }
}

function openPortfolioModal() {
  document.getElementById('portfolioForm').reset();
  document.getElementById('pId').value = '';
  document.getElementById('pImageUrl').value = '';
  document.getElementById('pImgPreview').innerHTML = '';
  document.getElementById('portfolioModalTitle').innerText = 'Tambah Karya Siswa';
  document.getElementById('portfolioModal').classList.add('active');
}

function closePortfolioModal() {
  document.getElementById('portfolioModal').classList.remove('active');
}

function editPortfolio(id) {
  const item = currentData.portfolio.find(p => p.id === id);
  if (!item) return;
  document.getElementById('pId').value = item.id;
  document.getElementById('pTitle').value = item.title;
  document.getElementById('pCategory').value = item.category;
  document.getElementById('pAuthor').value = item.author;
  document.getElementById('pDesc').value = item.description || '';
  document.getElementById('pStatus').value = item.status || 'published';
  document.getElementById('pImageUrl').value = item.image_url || '';
  document.getElementById('pImgPreview').innerHTML = item.image_url ? `<img src="${item.image_url}" style="height: 60px; border-radius: 6px;">` : '';
  document.getElementById('portfolioModalTitle').innerText = 'Edit Karya Siswa';
  document.getElementById('portfolioModal').classList.add('active');
}

async function deletePortfolio(id) {
  if (!confirm('Yakin ingin menghapus karya ini?')) return;
  try {
    const res = await fetchAPI('deletePortfolio', {
      username: adminAuth.username,
      password: adminAuth.password,
      id: id
    }, 'POST');
    if (res && res.success) {
      showToast('Karya berhasil dihapus');
      loadDashboardData();
    }
  } catch (err) {
    showToast('Gagal menghapus karya', true);
  }
}

function openGalleryModal() {
  document.getElementById('galleryForm').reset();
  document.getElementById('galleryModal').classList.add('active');
}

function closeGalleryModal() {
  document.getElementById('galleryModal').classList.remove('active');
}

async function deleteGallery(id) {
  if (!confirm('Yakin ingin menghapus foto galeri ini?')) return;
  try {
    const res = await fetchAPI('deleteGallery', {
      username: adminAuth.username,
      password: adminAuth.password,
      id: id
    }, 'POST');
    if (res && res.success) {
      showToast('Foto galeri berhasil dihapus');
      loadDashboardData();
    }
  } catch (err) {
    showToast('Gagal menghapus foto', true);
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  toast.innerText = msg;
  toast.style.background = isError ? '#ef4444' : '#22c55e';
  toast.style.display = 'block';
  setTimeout(() => toast.style.display = 'none', 3000);
}

function logout() {
  sessionStorage.removeItem(CONFIG.STORAGE_AUTH_KEY);
  location.reload();
}
