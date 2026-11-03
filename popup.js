const toggles = ['hideSolved', 'hideDifficulty', 'hideSubmissions'].map(id => document.getElementById(id));
const status = document.getElementById('status');
async function notifyPage() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error('No active tab');
    const result = await chrome.tabs.sendMessage(tab.id, { type: 'fresh-view-settings' });
    status.textContent = !result?.problemPage ? 'Đã lưu. Hãy mở trang đề bài LeetCode.' :
      !result.titleFound && !result.submissionsFound ? 'Đã lưu, nhưng chưa tìm được giao diện đề bài. Hãy tải lại trang.' :
      'Đã áp dụng trên trang hiện tại.';
  } catch {
    status.textContent = 'Đã lưu. Hãy refresh tab LeetCode để kết nối bản extension mới.';
  }
}
chrome.storage.local.get(['enabled', 'hideSolved', 'hideDifficulty', 'hideSubmissions']).then(values => {
  toggles.forEach(toggle => {
    toggle.checked = values[toggle.id] ?? (toggle.id === 'hideSubmissions' ? false : values.enabled ?? true);
    toggle.disabled = false;
  });
}).catch(() => { status.textContent = 'Không đọc được cài đặt. Hãy mở lại popup.'; });
toggles.forEach(toggle => toggle.addEventListener('change', async () => {
  toggle.disabled = true;
  try {
    await chrome.storage.local.set({ [toggle.id]: toggle.checked });
    await notifyPage();
  } catch {
    toggle.checked = !toggle.checked;
    status.textContent = 'Không lưu được. Hãy thử lại.';
  } finally { toggle.disabled = false; }
}));
