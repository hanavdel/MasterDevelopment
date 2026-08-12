'use strict';

const MD = {
  view: 'overview',
  data: null,
  loading: false,
};

const VIEW_LABELS = {
  overview: { label: 'Genel Bakış', icon: 'bi-speedometer2' },
  priorities: { label: 'Öncelikli İşler', icon: 'bi-exclamation-diamond' },
  projects: { label: 'Projeler', icon: 'bi-boxes' },
  activity: { label: 'Son Gelişmeler', icon: 'bi-activity' },
  opportunities: { label: 'Fırsatlar', icon: 'bi-lightbulb' },
  agenda: { label: 'Gündem', icon: 'bi-bookmark-star' },
  integrations: { label: 'Entegrasyon Hatları', icon: 'bi-share' },
  docs: { label: 'Dokümanlar', icon: 'bi-journal-text' },
  settings: { label: 'Ayarlar', icon: 'bi-sliders' },
};

const INTEGRATIONS = [
  { from: 'Opus SDK', to: 'LCW mockup', priority: 'P0', workId: 'MD-001', status: 'Devam ediyor' },
  { from: 'CMS Read API', to: 'LCW Next.js', priority: 'P1', workId: 'MD-011', status: 'Page bundle Faz 2' },
  { from: 'BannerPlanner', to: 'CMS → LCW vitrin', priority: 'P1', workId: 'MD-011', status: 'Gözlem hedefi' },
  { from: 'BannerPlanner', to: 'CMS (CPC)', priority: 'P1', workId: 'MD-007', status: 'Şema hazır' },
  { from: 'CMS', to: 'BannerPlanner', priority: 'P1', workId: 'MD-004', status: 'Faz 1 tamam' },
  { from: 'Backoffice mobile', to: 'CMS lokalizasyon', priority: 'P1', workId: 'MD-010', status: 'Toplantı kararı' },
  { from: 'Web lokalizasyon', to: 'CMS ortak havuz', priority: 'P1', workId: 'MD-010', status: 'Planlama' },
  { from: 'shared/opus-client', to: 'CMS preview', priority: 'P2', workId: 'MD-006', status: 'Tamamlandı' },
  { from: 'Opus Analytics', to: 'CMS + LCW', priority: 'P2', workId: 'MD-005', status: 'Talep iletildi' },
  { from: 'BannerPlanner', to: 'Opus campaigns', priority: 'P2', workId: 'MD-002', status: 'Eşleme bekliyor' },
  { from: 'Fulfilment', to: 'Opus Postcheckout', priority: 'P1', workId: 'MD-014', status: 'Planlama' },
  { from: 'Opus Postcheckout', to: 'Customer CRM', priority: 'P1', workId: 'MD-014', status: 'Faz 3' },
  { from: 'CMS Personalization', to: 'LCW vitrin', priority: 'P1', workId: 'MD-015', status: 'API + modal hazır' },
  { from: 'EPIM CategoryId', to: 'CMS Menu / Category Tree', priority: 'P1', workId: 'MD-016', status: 'Sınır dokümanı' },
];

function initShellUi() {
  const pos = localStorage.getItem('md_sbpos') || 'right';
  setSbPos(pos);
  if (localStorage.getItem('md_sc') === '1') {
    document.getElementById('shell')?.classList.add('sc');
    const ico = document.getElementById('sbico');
    if (ico) ico.className = 'bi bi-layout-sidebar';
  }
  if (localStorage.getItem('md_sb_hidden') === '1') {
    document.getElementById('shell')?.classList.add('sb-hidden');
  }
  updateHdrSbBtn();
  const theme = localStorage.getItem('md_theme') || 'dark';
  document.documentElement.setAttribute('data-bs-theme', theme);
  document.getElementById('setDark')?.classList.toggle('sel', theme === 'dark');
  document.getElementById('setLight')?.classList.toggle('sel', theme === 'light');
}

function updateHdrSbBtn() {
  const shell = document.getElementById('shell');
  const ico = document.getElementById('hdrSbIco');
  const btn = document.getElementById('hdrSbToggle');
  if (!shell || !ico || !btn) return;
  const hidden = shell.classList.contains('sb-hidden');
  const right = shell.classList.contains('sb-right');
  btn.title = hidden ? 'Kenar çubuğunu göster' : 'Kenar çubuğunu gizle';
  if (hidden) {
    ico.className = right ? 'bi bi-layout-sidebar-reverse' : 'bi bi-layout-sidebar';
  } else {
    ico.className = right ? 'bi bi-layout-sidebar-inset-reverse' : 'bi bi-layout-sidebar-inset';
  }
}

function toggleSbVisible() {
  const shell = document.getElementById('shell');
  if (!shell) return;
  shell.classList.toggle('sb-hidden');
  localStorage.setItem('md_sb_hidden', shell.classList.contains('sb-hidden') ? '1' : '0');
  updateHdrSbBtn();
}

function toggleSb() {
  const shell = document.getElementById('shell');
  shell.classList.toggle('sc');
  localStorage.setItem('md_sc', shell.classList.contains('sc') ? '1' : '0');
}

function setSbPos(pos) {
  const shell = document.getElementById('shell');
  shell.classList.remove('sb-left', 'sb-right');
  shell.classList.add('sb-' + pos);
  document.getElementById('setLeft')?.classList.toggle('sel', pos === 'left');
  document.getElementById('setRight')?.classList.toggle('sel', pos === 'right');
  localStorage.setItem('md_sbpos', pos);
  updateHdrSbBtn();
}

function setThemeMode(mode) {
  document.documentElement.setAttribute('data-bs-theme', mode);
  localStorage.setItem('md_theme', mode);
  document.getElementById('setDark')?.classList.toggle('sel', mode === 'dark');
  document.getElementById('setLight')?.classList.toggle('sel', mode === 'light');
}

function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2600);
}

function priBadge(p) {
  const cls = p.toLowerCase();
  return `<span class="pri-badge ${cls}">${p}</span>`;
}

function fmtTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

MD.toggleSbVisible = toggleSbVisible;
MD.toggleSb = toggleSb;
MD.setSbPos = setSbPos;
MD.setThemeMode = setThemeMode;

window.MD = MD;
