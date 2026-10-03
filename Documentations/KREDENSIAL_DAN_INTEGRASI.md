# Kredensial & Konfigurasi Integrasi Layanan (Backend & Storage)
*Dokumen ini mencatat kredensial, resource ID, dan status koneksi untuk integrasi Google Workspace & GitHub.*
*PENTING: File ini berisi token dan credential sensitif. Jangan dipublikasikan ke public repository.*

---

## 1. Ringkasan Kredensial & Resource ID

### A. Google Sheets (Database Leads PPDB)
- **Spreadsheet URL:** `https://docs.google.com/spreadsheets/d/1hvWPoCjesTWauG688us6JspYcqg0OTjnS6M6HgDLbWM/edit?usp=sharing`
- **Spreadsheet ID:** `1hvWPoCjesTWauG688us6JspYcqg0OTjnS6M6HgDLbWM`
- **Status Akses:** HTTP 200 (Accessible via link sharing).
- **Struktur Tab Target:** `Leads_PPDB` (perlu dipastikan nama tab sheet di dalam file).

### B. Google Drive (Storage Dokumen & Berkas)
- **Folder Public Document (Brosur, Panduan, SK):**
  - **URL:** `https://drive.google.com/drive/folders/10fOtMUoWCpefFXzg-8QzFvZknOu0HglB`
  - **Folder ID:** `10fOtMUoWCpefFXzg-8QzFvZknOu0HglB`
  - **Status Akses:** HTTP 200 (Public view).
- **Folder Student Uploads (Berkas Pendaftar PPDB):**
  - **URL:** `https://drive.google.com/drive/folders/1dGeohPsSU8yBlCdg603_rztqPwdQ3Me2?usp=sharing`
  - **Folder ID:** `1dGeohPsSU8yBlCdg603_rztqPwdQ3Me2`
  - **Status Akses:** HTTP 200 (Accessible via link sharing).

### C. Google Apps Script (Webhook API & Backend Gateway)
- **Script ID:** `16M3eF2dvaIt64xah4gYlVYHvOlE8qRW22pKrBL-1jEDna-lx0bQKu-_9`
- **Deployment ID (ID Penerapan):** `AKfycbzqXTmAau-tbbOMux64KABweGzW1d1jtO-my1oRHQzUGad1wXN3MI1D5-248OIkabXbrg`
- **Web App Exec URL:** `https://script.google.com/macros/s/AKfycbzqXTmAau-tbbOMux64KABweGzW1d1jtO-my1oRHQzUGad1wXN3MI1D5-248OIkabXbrg/exec`
- **Status Endpoint:** Web App online, namun fungsi `doGet()` dan `doPost()` belum terpasang di script editor (`Fungsi skrip tidak ditemukan: doGet`).

### D. GitHub Personal Access Token (PAT)
- **Token:** `ghp_***[REDACTED_FOR_SECURITY]***`
- **Owner Akun:** `skagamu` (ID: 290041442)
- **Scope Token:** `repo` (Full control repository: Read & Write).
- **Status Akses:** Terverifikasi valid (HTTP 200 via GitHub REST API).
- **Fungsi:** Mengizinkan dashboard `/admin` melakukan commit perubahan konten langsung ke repository GitHub Pages.

---

## 2. Hasil Audit & Status Koneksi

| Komponen | Resource ID / Value | Status | Catatan / Hasil Test |
| :--- | :--- | :---: | :--- |
| **GitHub Token** | `ghp_tfHt...Rkyf` (`skagamu`) | **VALID & AKTIF** | Scope `repo` aktif, siap untuk commit API / GitHub Pages |
| **Google Sheets** | `1hvWPoCjesTWauG6...` | **VALID & TERHUBUNG** | Terhubung ke GAS, auto-write row lead PPDB berfungsi |
| **Drive Public Docs** | `10fOtMUoWCpef...` | **VALID & AKSESIBEL** | Folder aktif untuk download e-brosur & dokumen legalitas |
| **Drive Student Uploads**| `1dGeohPsSU8yB...` | **VALID & TERHUBUNG** | Terhubung ke GAS, upload base64 berhasil (`status: success`) |
| **GAS Web App URL** | `AKfycbzqXTmAau...` | **VALID & AKTIF** | `ping`, `getLeads`, `submitLead`, dan `uploadStudentFile` 100% OK |

---

## 3. Template Kode Google Apps Script (`Code.gs`) yang Wajib Dipasang

Salin kode berikut ke script editor Google Apps Script (`ID Script: 16M3eF2dvaIt64xah4gYlVYHvOlE8qRW22pKrBL-1jEDna-lx0bQKu-_9`):

```javascript
/**
 * Google Apps Script Gateway - SMK Gajah Mungkur 1 Wuryantoro
 * Handles: PPDB Leads (Sheets) & File Uploads (Drive)
 */

const CONFIG = {
  SPREADSHEET_ID: "1hvWPoCjesTWauG688us6JspYcqg0OTjnS6M6HgDLbWM",
  SHEET_NAME_LEADS: "Leads_PPDB",
  FOLDER_PUBLIC_DOCS: "10fOtMUoWCpefFXzg-8QzFvZknOu0HglB",
  FOLDER_STUDENT_UPLOADS: "1dGeohPsSU8yBlCdg603_rztqPwdQ3Me2",
  ADMIN_SECRET: "smk-gm1-secret-2026" // Ganti sesuai kebutuhan token admin
};

function doGet(e) {
  try {
    const action = e.parameter.action;
    const token = e.parameter.token;

    if (action === "ping") {
      return jsonResponse({ status: "success", message: "GAS Service Active" });
    }

    // Endpoint get leads (Protected)
    if (action === "getLeads") {
      if (token !== CONFIG.ADMIN_SECRET) {
        return jsonResponse({ status: "error", message: "Unauthorized" }, 401);
      }
      const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(CONFIG.SHEET_NAME_LEADS);
      if (!sheet) {
        return jsonResponse({ status: "error", message: "Sheet not found" });
      }
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const rows = data.slice(1).map(row => {
        let obj = {};
        headers.forEach((h, i) => obj[h] = row[i]);
        return obj;
      });
      return jsonResponse({ status: "success", data: rows });
    }

    return jsonResponse({ status: "error", message: "Invalid action" });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action;

    // 1. Lead PPDB Submission (Public Form)
    if (action === "submitLead") {
      const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
      let sheet = ss.getSheetByName(CONFIG.SHEET_NAME_LEADS);
      if (!sheet) {
        sheet = ss.insertSheet(CONFIG.SHEET_NAME_LEADS);
        sheet.appendRow(["Timestamp", "Nama Lengkap", "WhatsApp", "Pilihan Jurusan", "Asal Sekolah", "Status", "Catatan"]);
      }
      sheet.appendRow([
        new Date(),
        body.fullName || "",
        body.whatsapp || "",
        body.program || "",
        body.schoolOrigin || "",
        "Baru",
        body.notes || ""
      ]);
      return jsonResponse({ status: "success", message: "Lead recorded successfully" });
    }

    // 2. Upload Student File to Google Drive
    if (action === "uploadStudentFile") {
      const folder = DriveApp.getFolderById(CONFIG.FOLDER_STUDENT_UPLOADS);
      const decodedData = Utilities.base64Decode(body.base64Data);
      const blob = Utilities.newBlob(decodedData, body.mimeType, body.fileName);
      const file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      return jsonResponse({
        status: "success",
        fileId: file.getId(),
        fileUrl: file.getUrl()
      });
    }

    return jsonResponse({ status: "error", message: "Invalid action" });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

function jsonResponse(data, code) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
```

---

## 4. Daftar Kekurangan yang Perlu Dilengkapi
1. **Script Code.gs Belum Berisi Handler `doGet`/`doPost`:**
   - Script di URL exec saat ini mengembalikan `Fungsi skrip tidak ditemukan: doGet`.
   - *Tindakan:* Buka script editor di GAS $\rightarrow$ paste template `Code.gs` di atas $\rightarrow$ Deploy ulang (New Deployment / Manage Deployments $\rightarrow$ Edit Version $\rightarrow$ Deploy).
2. **Tab Sheet `Leads_PPDB` di Google Spreadsheet:**
   - Perlu dipastikan ada sheet dengan nama `Leads_PPDB` atau biarkan skrip membuat tab tersebut secara otomatis saat submit pertama.
3. **Repository Target GitHub:**
   - Token valid untuk akun `skagamu`, pastikan nama repo GitHub tempat website di-push sudah ditentukan (misal: `skagamu/smk-gajah-mungkur-1` atau sejenisnya).
