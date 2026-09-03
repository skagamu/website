const CONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycbzJoZ5OjeiUVHNZ6eCl6FSdwpJJre5cLgUQ5Pawr-5_5gSbDJza3c11vL_BjXSVBG7N/exec',
  STORAGE_AUTH_KEY: 'skagamu_admin_auth'
};

async function fetchAPI(action, params = {}, method = 'GET') {
  if (method === 'GET') {
    const query = new URLSearchParams({ action, ...params }).toString();
    const res = await fetch(`${CONFIG.API_URL}?${query}`);
    return await res.json();
  } else {
    const res = await fetch(CONFIG.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, ...params })
    });
    return await res.json();
  }
}
