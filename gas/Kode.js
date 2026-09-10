const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

function doGet(e) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  initSheets(ss);
  
  const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "getData";
  
  if (action === "getData") {
    const babs = getSheetData(ss.getSheetByName("babs"));
    const projects = getSheetData(ss.getSheetByName("projects"));
    const karya = getSheetData(ss.getSheetByName("karya"));
    const gallery = getSheetData(ss.getSheetByName("gallery"));
    const settings = getSettingsData(ss.getSheetByName("settings"));
    const portfolio = getSheetData(ss.getSheetByName("portfolio")); // legacy fallback
    
    return responseJSON({
      success: true,
      data: { babs, projects, karya, gallery, settings, portfolio }
    });
  }
  
  return responseJSON({ success: false, message: "Invalid action" });
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    initSheets(ss);

    const action = body.action;

    // --- AUTH LOGIN ---
    if (action === "login") {
      const user = validateUser(ss, body.username, body.password);
      if (user) {
        return responseJSON({ success: true, user: { username: user.username, name: user.name, role: user.role } });
      } else {
        return responseJSON({ success: false, message: "Username atau Password salah" });
      }
    }

    // Validasi credential untuk semua aksi modifikasi
    const isValid = validateUser(ss, body.username, body.password);
    if (!isValid) {
      return responseJSON({ success: false, message: "Unauthorized" });
    }

    // --- UPLOAD FILE/IMAGE KE GOOGLE DRIVE ---
    if (action === "uploadImage" || action === "uploadFile") {
      const folderName = "SKAGAMU_UPLOADS";
      let folders = DriveApp.getFoldersByName(folderName);
      let folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
      folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

      const contentType = body.base64.substring(body.base64.indexOf(":") + 1, body.base64.indexOf(";"));
      const bytes = Utilities.base64Decode(body.base64.split(",")[1]);
      const filename = body.filename || ("file_" + Date.now());
      const blob = Utilities.newBlob(bytes, contentType, filename);
      const file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

      const fileUrl = "https://lh3.googleusercontent.com/d/" + file.getId();
      return responseJSON({ success: true, url: fileUrl, fileId: file.getId(), downloadUrl: file.getDownloadUrl() });
    }

    // --- CRUD BAB / MODUL ---
    if (action === "saveBab") {
      const sheet = ss.getSheetByName("babs");
      const item = body.item;
      const data = sheet.getDataRange().getValues();
      let rowIndex = -1;
      
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] == item.id) { rowIndex = i + 1; break; }
      }

      if (rowIndex > -1) {
        sheet.getRange(rowIndex, 2, 1, 3).setValues([[item.title, item.description || "", item.order || 1]]);
      } else {
        const id = item.id || ("bab_" + Date.now());
        sheet.appendRow([id, item.title, item.description || "", item.order || (data.length), new Date().toISOString()]);
      }
      return responseJSON({ success: true });
    }

    if (action === "deleteBab") {
      deleteRowById(ss.getSheetByName("babs"), body.id);
      return responseJSON({ success: true });
    }

    // --- CRUD PROJECT ---
    if (action === "saveProject") {
      const sheet = ss.getSheetByName("projects");
      const item = body.item;
      const data = sheet.getDataRange().getValues();
      let rowIndex = -1;
      
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] == item.id) { rowIndex = i + 1; break; }
      }

      if (rowIndex > -1) {
        sheet.getRange(rowIndex, 2, 1, 6).setValues([[item.bab_id, item.title, item.brief || "", item.lkpd_url || "", item.deadline || "", item.order || 1]]);
      } else {
        const id = item.id || ("proj_" + Date.now());
        sheet.appendRow([id, item.bab_id, item.title, item.brief || "", item.lkpd_url || "", item.deadline || "", item.order || 1, new Date().toISOString()]);
      }
      return responseJSON({ success: true });
    }

    if (action === "deleteProject") {
      deleteRowById(ss.getSheetByName("projects"), body.id);
      return responseJSON({ success: true });
    }

    // --- CRUD KARYA SISWA ---
    if (action === "saveKarya") {
      const sheet = ss.getSheetByName("karya");
      const item = body.item;
      const data = sheet.getDataRange().getValues();
      let rowIndex = -1;
      
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] == item.id) { rowIndex = i + 1; break; }
      }

      if (rowIndex > -1) {
        sheet.getRange(rowIndex, 2, 1, 8).setValues([[
          item.project_id,
          item.title,
          item.student_name,
          item.class || "",
          item.media_type || "image",
          item.media_url,
          item.description || "",
          item.status || "published"
        ]]);
      } else {
        const id = item.id || ("kar_" + Date.now());
        sheet.appendRow([
          id,
          item.project_id,
          item.title,
          item.student_name,
          item.class || "",
          item.media_type || "image",
          item.media_url,
          item.description || "",
          item.status || "published",
          new Date().toISOString()
        ]);
      }
      return responseJSON({ success: true });
    }

    if (action === "deleteKarya") {
      deleteRowById(ss.getSheetByName("karya"), body.id);
      return responseJSON({ success: true });
    }

    // --- CRUD GALLERY ---
    if (action === "saveGallery") {
      const sheet = ss.getSheetByName("gallery");
      const item = body.item;
      const id = "g_" + Date.now();
      sheet.appendRow([id, item.title, item.image_url, item.order || 1, new Date().toISOString()]);
      return responseJSON({ success: true });
    }

    if (action === "deleteGallery") {
      deleteRowById(ss.getSheetByName("gallery"), body.id);
      return responseJSON({ success: true });
    }

    // --- SAVE SETTINGS ---
    if (action === "saveSettings") {
      const sheet = ss.getSheetByName("settings");
      const settings = body.settings;
      const data = sheet.getDataRange().getValues();
      const map = {};
      for (let i = 1; i < data.length; i++) map[data[i][0]] = i + 1;

      Object.keys(settings).forEach(k => {
        if (map[k]) {
          sheet.getRange(map[k], 2).setValue(settings[k]);
        } else {
          sheet.appendRow([k, settings[k]]);
        }
      });
      return responseJSON({ success: true });
    }

    return responseJSON({ success: false, message: "Unknown action" });
  } catch (err) {
    return responseJSON({ success: false, error: err.toString() });
  }
}

// Inisialisasi Sheet Struktur Baru
function initSheets(ss) {
  if (!ss.getSheetByName("users")) {
    const s = ss.insertSheet("users");
    s.appendRow(["username", "password", "name", "role", "created_at"]);
    s.appendRow(["adminwebsite", "skagamu123", "Administrator SKAGAMU", "admin", new Date().toISOString()]);
  }
  if (!ss.getSheetByName("babs")) {
    const s = ss.insertSheet("babs");
    s.appendRow(["id", "title", "description", "order", "created_at"]);
    s.appendRow(["bab_1", "Modul 1: Identitas & Brand Visual", "Perancangan sistem identitas visual, logo, dan brand collateral", 1, new Date().toISOString()]);
    s.appendRow(["bab_2", "Modul 2: Desain Grafis & Motion Ads", "Kampanye periklanan digital, poster, dan motion graphics", 2, new Date().toISOString()]);
    s.appendRow(["bab_3", "Modul 3: UI/UX & Digital Product", "Desain antarmuka web dan aplikasi interaktif", 3, new Date().toISOString()]);
  }
  if (!ss.getSheetByName("projects")) {
    const s = ss.insertSheet("projects");
    s.appendRow(["id", "bab_id", "title", "brief", "lkpd_url", "deadline", "order", "created_at"]);
    s.appendRow(["proj_1", "bab_1", "Brand Identity Kopi Wuryantoro", "Membuat logo, moodboard, dan mockup kemasan produk lokal", "https://docs.google.com/document/d/sample-lkpd-1", "2026-09-30", 1, new Date().toISOString()]);
    s.appendRow(["proj_2", "bab_2", "Social Media Feed & Story Ads", "Desain visual promosi produk UMKM", "", "2026-10-15", 1, new Date().toISOString()]);
    s.appendRow(["proj_3", "bab_3", "Landing Page Portfolio Studio", "Desain antarmuka responsif Figma & Webflow", "", "2026-10-30", 1, new Date().toISOString()]);
  }
  if (!ss.getSheetByName("karya")) {
    const s = ss.insertSheet("karya");
    s.appendRow(["id", "project_id", "title", "student_name", "class", "media_type", "media_url", "description", "status", "created_at"]);
  }
  if (!ss.getSheetByName("gallery")) {
    const s = ss.insertSheet("gallery");
    s.appendRow(["id", "title", "image_url", "order", "created_at"]);
  }
  if (!ss.getSheetByName("settings")) {
    const s = ss.insertSheet("settings");
    s.appendRow(["key", "value"]);
  }
}

function deleteRowById(sheet, id) {
  if (!sheet) return;
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
}

function validateUser(ss, username, password) {
  const sheet = ss.getSheetByName("users");
  if (!sheet) return null;
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    const rowUser = String(values[i][0]).trim();
    const rowPass = String(values[i][1]).trim();
    if (rowUser === String(username).trim() && rowPass === String(password).trim()) {
      return {
        username: values[i][0],
        name: values[i][2] || "Admin",
        role: values[i][3] || "admin"
      };
    }
  }
  return null;
}

function getSheetData(sheet) {
  if (!sheet) return [];
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  const headers = values[0];
  return values.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function getSettingsData(sheet) {
  if (!sheet) return {};
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return {};
  const settings = {};
  for (let i = 1; i < values.length; i++) {
    if (values[i][0]) settings[values[i][0]] = values[i][1];
  }
  return settings;
}

function responseJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
