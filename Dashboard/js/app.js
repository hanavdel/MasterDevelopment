'use strict';

/* eslint-disable no-unused-vars */

function repoUrl(rel) {
  const clean = String(rel).replace(/^\//, '').replace(/\\/g, '/');
  return 'repo/' + clean;
}

function projectIconHtml(p) {
  const local = `assets/projects/${p.id}.svg`;
  const remote = p.iconSrc ? repoUrl(p.iconSrc) : '';
  if (remote) {
    return `<img class="md-proj-ico-img" src="${esc(local)}" alt="" width="42" height="42" onerror="this.onerror=null;this.src='${esc(remote)}'">`;
  }
  return `<i class="bi ${esc(p.icon || 'bi-box')}"></i>`;
}

function apiUrl(path) {
  const clean = String(path).replace(/^\//, '');
  return clean;
}

MD.go = function go(view) {
  MD.view = view;
  document.querySelectorAll('.ni[data-view]').forEach((el) => {
    el.classList.toggle('act', el.dataset.view === view);
  });
  const meta = VIEW_LABELS[view] || { label: view, icon: 'bi-file-earmark' };
  const bc = document.getElementById('bc');
  if (bc) {
    bc.innerHTML = `<i class="bi ${meta.icon} me-1" style="color:var(--lcw)"></i>${meta.label}`;
  }
  render();
};

MD.refresh = async function refresh() {
  const ico = document.getElementById('refreshIco');
  ico?.classList.add('spin');
  try {
    await loadSnapshot(true);
    showToast('Koordinasyon verisi güncellendi');
  } catch (err) {
    console.error('[Dashboard refresh]', err);
    showToast('Yenileme başarısız');
  } finally {
    ico?.classList.remove('spin');
  }
};

let loadSeq = 0;

async function fetchJsonWithTimeout(url, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { cache: 'no-store', signal: controller.signal });
    if (!res.ok) throw new Error(String(res.status));
    return res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function loadSnapshot(silent) {
  const seq = ++loadSeq;
  MD.loading = true;
  if (!silent) render();

  const tryApply = (data, label) => {
    if (seq !== loadSeq) return false;
    MD.data = data;
    const hdr = document.getElementById('hdrStatus');
    if (hdr) {
      const src = label ? ` · ${label}` : '';
      const summary = MD.data.summary || {};
      hdr.textContent = `${summary.openWorkCount ?? '—'} açık iş · ${fmtTime(MD.data.generatedAt)}${src}`;
      hdr.classList.remove('d-none');
    }
    const sbUp = document.getElementById('sbUpdated');
    if (sbUp) sbUp.textContent = 'Güncelleme: ' + fmtTime(MD.data.generatedAt);
    MD.loading = false;
    render();
    return true;
  };

  const loadMode = document.documentElement.getAttribute('data-load-mode') || 'iis';

  const tryCoord = async () => {
    if (typeof loadSnapshotFromCoordFiles !== 'function') return false;
    try {
      return tryApply(await loadSnapshotFromCoordFiles(), 'canlı md');
    } catch (err) {
      console.warn('[Dashboard] coord load failed', err);
      return false;
    }
  };

  const tryStatic = async () => {
    try {
      const data = await fetchJsonWithTimeout('data/snapshot.json', 10000);
      return tryApply(data, 'önbellek');
    } catch (err) {
      console.warn('[Dashboard] static snapshot failed', err);
      return false;
    }
  };

  const tryApi = async () => {
    for (const url of [
      apiUrl('api/dashboard/snapshot'),
      'http://127.0.0.1:3283/api/dashboard/snapshot',
    ]) {
      try {
        const data = await fetchJsonWithTimeout(url, 10000);
        return tryApply(data, 'API');
      } catch (err) {
        console.warn('[Dashboard] API failed', url, err);
      }
    }
    return false;
  };

  try {
    const order = loadMode === 'node'
      ? [tryApi, tryStatic, tryCoord]
      : [tryStatic, tryCoord, tryApi];

    for (const fn of order) {
      if (seq !== loadSeq) return;
      if (await fn()) return;
    }

    if (seq !== loadSeq) return;
    MD.data = null;
    if (!silent) showToast('Veri yüklenemedi');
  } finally {
    if (seq === loadSeq) {
      MD.loading = false;
      render();
    }
  }
}

function render() {
  const vc = document.getElementById('vc');
  if (!vc) return;
  if (MD.loading && !MD.data) {
    vc.innerHTML = loadingBlock();
    return;
  }
  if (!MD.data) {
    vc.innerHTML = `<div class="md-error"><i class="bi bi-exclamation-triangle me-2"></i>Veri yüklenemedi.<br><br>
      <strong>IIS (3282) — bir kez çalıştırın:</strong><br>
      <code>powershell -ExecutionPolicy Bypass -File scripts\\link-coord-data.ps1</code><br>
      <code>node scripts\\build-snapshot.js</code><br><br>
      <strong>veya canlı API:</strong> <code>start-api.bat</code> (3283)</div>`;
    return;
  }
  const views = {
    overview: renderOverview,
    priorities: renderPriorities,
    projects: renderProjects,
    activity: renderActivity,
    opportunities: renderOpportunities,
    agenda: renderAgenda,
    integrations: renderIntegrations,
    docs: renderDocs,
    settings: renderSettings,
  };
  vc.innerHTML = (views[MD.view] || renderOverview)();
}

function loadingBlock() {
  return `<div class="md-empty"><i class="bi bi-arrow-repeat spin" style="font-size:1.5rem"></i><p class="mt-3 mb-0">Koordinasyon verisi okunuyor…</p></div>`;
}

function renderOverview() {
  const d = MD.data;
  const s = d.summary;
  return `
    <div class="mb-3">
      <h5 class="fw-bold mb-1"><i class="bi bi-speedometer2 me-2" style="color:var(--lcw)"></i>Genel Bakış</h5>
      <p class="text-muted mb-0" style="font-size:.8rem">Sayfa her yenilendiğinde WORK_QUEUE, AGENT_SYNC ve SCAN_LOG dosyalarından taze özet üretilir.</p>
    </div>

    <div class="md-stat-grid">
      <div class="md-stat"><div class="md-stat-num pri-p0">${s.p0Count}</div><div class="md-stat-lbl">P0 kritik</div></div>
      <div class="md-stat"><div class="md-stat-num pri-p1">${s.p1Count}</div><div class="md-stat-lbl">P1 yakın</div></div>
      <div class="md-stat"><div class="md-stat-num">${s.openWorkCount}</div><div class="md-stat-lbl">Açık iş kodu</div></div>
      <div class="md-stat"><div class="md-stat-num">${s.projectCount}</div><div class="md-stat-lbl">Aktif proje</div></div>
    </div>

    <div class="row g-3">
      <div class="col-lg-7">
        <div class="md-panel">
          <div class="md-panel-h"><h6><i class="bi bi-list-check me-2"></i>Şimdi yapılması gerekenler</h6>
            <button class="btn btn-link btn-sm p-0" style="font-size:.72rem" onclick="MD.go('priorities')">Tümü →</button></div>
          <div class="md-panel-b">${renderNextActions(d.nextActions.slice(0, 8))}</div>
        </div>

        <div class="md-panel">
          <div class="md-panel-h"><h6><i class="bi bi-lightbulb me-2"></i>Paralel fırsatlar</h6>
            <button class="btn btn-link btn-sm p-0" style="font-size:.72rem" onclick="MD.go('opportunities')">Tümü →</button></div>
          <div class="md-panel-b">${renderOpportunityCards(d.opportunities.slice(0, 4))}</div>
        </div>
      </div>
      <div class="col-lg-5">
        <div class="md-panel">
          <div class="md-panel-h"><h6><i class="bi bi-activity me-2"></i>Son gelişmeler</h6>
            <button class="btn btn-link btn-sm p-0" style="font-size:.72rem" onclick="MD.go('activity')">Tümü →</button></div>
          <div class="md-panel-b">${renderActivityList(d.activity.slice(0, 6))}</div>
        </div>

        <div class="md-panel">
          <div class="md-panel-h"><h6><i class="bi bi-journal-check me-2"></i>Son tarama notları</h6></div>
          <div class="md-panel-b">${renderScanBlocks(d.scanLog.slice(0, 3))}</div>
        </div>
      </div>
    </div>
  `;
}

function renderNextActions(actions) {
  if (!actions.length) return `<div class="md-empty">Açık alt görev bulunamadı.</div>`;
  return actions.map((a) => `
    <div class="md-action-row">
      ${priBadge(a.priority)}
      <div><span class="md-chip">${a.workId}</span> <strong>${esc(a.task)}</strong>
        <div class="md-work-meta">${esc(a.workTitle)}</div></div>
    </div>`).join('');
}

function renderPriorities() {
  const items = MD.data.openPriorities;
  return `
    <div class="mb-3">
      <h5 class="fw-bold mb-1"><i class="bi bi-exclamation-diamond me-2" style="color:var(--lcw)"></i>Öncelikli İşler</h5>
      <p class="text-muted mb-0" style="font-size:.8rem">WORK_QUEUE.md — açık MD kodları, alt görev ilerlemesi ve çıkış kriterleri.</p>
    </div>
    <div class="md-panel"><div class="md-panel-b">${items.map(renderWorkItem).join('') || '<div class="md-empty">Açık iş yok.</div>'}</div></div>
  `;
}

function renderWorkItem(w) {
  const tasks = w.subtasks.map((t) =>
    `<li class="${t.done ? 'done' : ''}"><i class="bi ${t.done ? 'bi-check-circle-fill text-success' : 'bi-circle'}"></i>${esc(t.text)}</li>`
  ).join('');
  return `
    <div class="md-work-row">
      <div>${priBadge(w.priority)}<div class="md-chip mt-2">${w.id}</div></div>
      <div class="md-work-main">
        <div class="md-work-title">${esc(w.title)}</div>
        <div class="md-work-meta">Durum: <strong>${esc(w.status)}</strong> · İlerleme ${w.progress}%</div>
        <div class="md-progress"><span style="width:${w.progress}%"></span></div>
        ${w.subtasks.length ? `<ul class="md-task-list">${tasks}</ul>` : ''}
        ${w.exitCriteria ? `<div class="md-work-meta mt-2"><i class="bi bi-flag me-1"></i>Çıkış: ${esc(w.exitCriteria)}</div>` : ''}
      </div>
    </div>`;
}

function renderProjects() {
  const projects = MD.data.projects;
  return `
    <div class="mb-3">
      <h5 class="fw-bold mb-1"><i class="bi bi-boxes me-2" style="color:var(--lcw)"></i>Projeler</h5>
      <p class="text-muted mb-0" style="font-size:.8rem">Hızlı erişim — dev URL, açık iş kodları ve son AGENT_SYNC kayıtları.</p>
    </div>
    <div class="md-proj-grid">${projects.map(renderProjectCard).join('')}</div>
  `;
}

function renderProjectCard(p) {
  const links = p.devUrls.map((u) =>
    `<a class="md-link-btn" href="${esc(u.url)}" target="_blank" rel="noopener noreferrer">${esc(u.label)} <i class="bi bi-box-arrow-up-right"></i></a>`
  ).join('');
  const work = p.openWork.map((w) => `<span class="md-chip">${w.id}</span>`).join(' ') || '<span class="text-muted" style="font-size:.7rem">Açık MD yok</span>';
  const recent = p.recent[0]
    ? `<div class="mt-2" style="font-size:.72rem;color:var(--tx3)"><i class="bi bi-clock me-1"></i>${esc(p.recent[0].date)} — ${esc(p.recent[0].change)}</div>`
    : '';
  return `
    <div class="md-proj-card">
      <div class="md-proj-head">
        <div class="md-proj-ico${p.iconSrc ? ' md-proj-ico-app' : ''}"${p.iconSrc ? '' : ` style="background:${p.accent}"`}>${projectIconHtml(p)}</div>
        <div>
          <div class="md-proj-name">${esc(p.name)}</div>
          <div class="md-proj-sub">${esc(p.subtitle)}</div>
          <code style="font-size:.62rem;color:var(--tx3)">${esc(p.path)}</code>
        </div>
      </div>
      <div style="font-size:.72rem;margin-bottom:6px">Açık iş: ${work}</div>
      ${recent}
      <div class="md-proj-links">${links}
        <a class="md-link-btn" href="${esc(repoUrl(p.path + '/'))}" target="_blank" rel="noopener noreferrer">Klasör</a>
        ${p.agentSync ? `<a class="md-link-btn" href="${esc(repoUrl(p.agentSync))}" target="_blank" rel="noopener noreferrer">AGENT_SYNC</a>` : ''}
      </div>
    </div>`;
}

function renderActivity() {
  return `
    <div class="mb-3">
      <h5 class="fw-bold mb-1"><i class="bi bi-activity me-2" style="color:var(--lcw)"></i>Son Gelişmeler</h5>
      <p class="text-muted mb-0" style="font-size:.8rem">Tüm projelerin AGENT_SYNC günlüklerinden birleşik akış.</p>
    </div>
    <div class="md-panel"><div class="md-panel-b">${renderActivityList(MD.data.activity)}</div></div>
  `;
}

function renderActivityList(items) {
  if (!items.length) return `<div class="md-empty">Henüz AGENT_SYNC kaydı yok.</div>`;
  return items.map((a) => `
    <div class="md-activity-item">
      <div class="md-activity-date">${esc(a.date)}</div>
      <div class="md-activity-body">
        <div class="md-activity-title"><span class="md-chip">${esc(a.projectName)}</span> ${esc(a.change)}</div>
        <div class="md-activity-sub">${esc(a.note)}</div>
      </div>
    </div>`).join('');
}

function renderOpportunities() {
  return `
    <div class="mb-3">
      <h5 class="fw-bold mb-1"><i class="bi bi-lightbulb me-2" style="color:var(--lcw)"></i>Fırsatlar</h5>
      <p class="text-muted mb-0" style="font-size:.8rem">Alt geliştirmeler tamamlandıkça ortaya çıkan paralel kazanımlar — blokaj yaratmadan değerlendirilebilir.</p>
    </div>
    <div class="md-panel"><div class="md-panel-b">${renderOpportunityCards(MD.data.opportunities)}</div></div>
  `;
}

function renderOpportunityCards(opps) {
  if (!opps.length) return `<div class="md-empty">Fırsat kuralı eşleşmedi.</div>`;
  return opps.map((o) => `
    <div class="md-opp-card">
      <div class="d-flex align-items-center gap-2 mb-1">${priBadge(o.priority)} <span class="md-chip">${o.workId}</span> <span style="font-size:.7rem;color:var(--tx3)">${o.progress}% · ${esc(o.status)}</span></div>
      <div class="md-opp-title">${esc(o.title)}</div>
      <div class="md-opp-detail">${esc(o.detail)}</div>
      ${o.unlocks?.length ? `<div class="md-opp-unlock">${o.unlocks.map((u) => `<span class="md-chip"><i class="bi bi-unlock me-1"></i>${u}</span>`).join('')}</div>` : ''}
    </div>`).join('');
}

function renderAgenda() {
  const items = MD.data.agenda;
  return `
    <div class="mb-3">
      <h5 class="fw-bold mb-1"><i class="bi bi-bookmark-star me-2" style="color:var(--lcw)"></i>Gündem</h5>
      <p class="text-muted mb-0" style="font-size:.8rem">Takip edilmesi gereken stratejik konular — iş kodu ile WORK_QUEUE'ya bağlı.</p>
    </div>
    <div class="md-panel"><div class="md-panel-b">${items.map((a) => `
      <div class="md-agenda-item">
        <div class="d-flex align-items-center gap-2 mb-1">${priBadge(a.priority)} <span class="md-chip">${a.workId}</span></div>
        <div class="fw-semibold" style="font-size:.86rem">${esc(a.title)}</div>
        <div style="font-size:.76rem;color:var(--tx2);margin-top:4px">${esc(a.detail)}</div>
      </div>`).join('')}</div></div>
  `;
}

function renderIntegrations() {
  return `
    <div class="mb-3">
      <h5 class="fw-bold mb-1"><i class="bi bi-share me-2" style="color:var(--lcw)"></i>Entegrasyon Hatları</h5>
      <p class="text-muted mb-0" style="font-size:.8rem">Projeler arası bağımlılıklar — detay için INTEGRATION_MAP.md</p>
    </div>
    <div class="md-panel">
      <div class="md-panel-b">
        <div class="md-int-row" style="font-weight:700;font-size:.68rem;color:var(--tx3);text-transform:uppercase">
          <div>Kaynak → Hedef</div><div>Durum</div><div>İş kodu</div>
        </div>
        ${INTEGRATIONS.map((r) => `
          <div class="md-int-row">
            <div><strong>${esc(r.from)}</strong> <i class="bi bi-arrow-right mx-1" style="color:var(--tx3)"></i> ${esc(r.to)}</div>
            <div>${esc(r.status)}</div>
            <div>${priBadge(r.priority)} <span class="md-chip">${r.workId}</span></div>
          </div>`).join('')}
      </div>
    </div>
  `;
}

function docCoordUrl(path) {
  const name = String(path)
    .replace(/^MasterDevelopment[/\\]/, '')
    .replace(/^coord[/\\]/, '');
  return 'coord/' + name.replace(/\\/g, '/');
}

MD.openDoc = async function openDoc(path, label) {
  const el = document.getElementById('docMod');
  if (!el || !window.bootstrap) return;
  const modal = bootstrap.Modal.getOrCreateInstance(el);
  document.getElementById('docModT').textContent = label || 'Doküman';
  const fetchUrl = docCoordUrl(path);
  document.getElementById('docModPath').textContent = fetchUrl;
  const body = document.getElementById('docModB');
  const meta = document.getElementById('docModMeta');
  body.innerHTML = '<div class="md-empty"><i class="bi bi-arrow-repeat spin" style="font-size:1.2rem"></i><p class="mt-2 mb-0">Yükleniyor…</p></div>';
  meta.textContent = '';
  modal.show();
  try {
    const res = await fetch(fetchUrl, { cache: 'no-store' });
    if (!res.ok) throw new Error(String(res.status));
    const text = await res.text();
    if (window.marked) {
      marked.setOptions({ gfm: true, breaks: true });
      body.innerHTML = `<div class="md-doc-body">${marked.parse(text)}</div>`;
    } else {
      body.innerHTML = `<pre class="md-doc-raw">${esc(text)}</pre>`;
    }
    meta.textContent = `${(text.length / 1024).toFixed(1)} KB · ${new Date().toLocaleString('tr-TR')}`;
  } catch {
    body.innerHTML = `<div class="md-error"><i class="bi bi-exclamation-triangle me-2"></i>Dosya okunamadı: <code>${esc(fetchUrl)}</code><br><span style="font-size:.75rem">Junction kurulu mu? <code>scripts\\link-coord-data.ps1</code></span></div>`;
  }
};

function escAttr(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;');
}

function renderDocs() {
  const docs = MD.data.docs;
  return `
    <div class="mb-3">
      <h5 class="fw-bold mb-1"><i class="bi bi-journal-text me-2" style="color:var(--lcw)"></i>Koordinasyon Dokümanları</h5>
      <p class="text-muted mb-0" style="font-size:.8rem">Tıklayınca modal içinde açılır — IIS tanımı gerekmez (<code>coord/</code> junction).</p>
    </div>
    <div class="md-panel"><div class="md-panel-b md-doc-list">${docs.map((d) =>
      `<a href="#" role="button" class="md-doc-row" data-doc-path="${escAttr(d.path)}" data-doc-label="${escAttr(d.label)}"><i class="bi bi-file-earmark-text" style="color:var(--lcw)"></i>${esc(d.label)}<i class="bi bi-chevron-right ms-auto" style="font-size:.7rem;color:var(--tx3)"></i></a>`
    ).join('')}</div></div>
  `;
}

function renderSettings() {
  const pos = localStorage.getItem('md_sbpos') || 'right';
  const theme = localStorage.getItem('md_theme') || 'dark';
  return `
    <div class="mb-3"><h5 class="fw-bold mb-1"><i class="bi bi-sliders me-2" style="color:var(--lcw)"></i>Ayarlar</h5></div>
    <div class="set-grid">
      <div class="set-card">
        <div class="set-card-head"><div class="set-card-ico" style="background:var(--lcw)"><i class="bi bi-layout-sidebar-reverse"></i></div><div><div class="fw-semibold">Sidebar</div><div style="font-size:.72rem;color:var(--tx3)">BannerPlanner shell ile aynı</div></div></div>
        <div class="row g-2">
          <div class="col-6"><div class="set-opt ${pos === 'left' ? 'sel' : ''}" id="setLeft" onclick="MD.setSbPos('left')"><i class="bi bi-layout-sidebar set-opt-icon"></i><div><div class="set-opt-title">Solda</div></div></div></div>
          <div class="col-6"><div class="set-opt ${pos === 'right' ? 'sel' : ''}" id="setRight" onclick="MD.setSbPos('right')"><i class="bi bi-layout-sidebar-reverse set-opt-icon"></i><div><div class="set-opt-title">Sağda</div></div></div></div>
        </div>
      </div>
      <div class="set-card">
        <div class="set-card-head"><div class="set-card-ico" style="background:#6f42c1"><i class="bi bi-palette"></i></div><div><div class="fw-semibold">Tema</div></div></div>
        <div class="row g-2">
          <div class="col-6"><div class="set-opt ${theme === 'dark' ? 'sel' : ''}" id="setDark" onclick="MD.setThemeMode('dark')"><i class="bi bi-moon-stars set-opt-icon"></i><div><div class="set-opt-title">Koyu</div></div></div></div>
          <div class="col-6"><div class="set-opt ${theme === 'light' ? 'sel' : ''}" id="setLight" onclick="MD.setThemeMode('light')"><i class="bi bi-sun set-opt-icon"></i><div><div class="set-opt-title">Açık</div></div></div></div>
        </div>
      </div>
      <div class="set-card">
        <div class="set-card-head"><div class="set-card-ico" style="background:#20c997"><i class="bi bi-terminal"></i></div><div><div class="fw-semibold">Sunucu</div></div></div>
        <code style="font-size:.72rem;display:block;padding:8px;background:var(--sb);border-radius:8px">cd C:\\web\\MasterDevelopment\\Dashboard<br>node server.js</code>
        <p class="text-muted mt-2 mb-0" style="font-size:.72rem">Port: <strong>3282</strong> (IIS) · Node dev aynı port · API her istekte markdown dosyalarını yeniden okur.</p>
      </div>
    </div>`;
}

function renderScanBlocks(entries) {
  if (!entries.length) return `<div class="md-empty">SCAN_LOG kaydı yok.</div>`;
  return entries.map((e) => `
    <div class="md-scan-block">
      <div class="md-scan-title">${esc(e.date)} — ${esc(e.title)}</div>
      <ul class="mb-0 ps-3">${e.bullets.slice(0, 3).map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
    </div>`).join('');
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

document.querySelectorAll('.ni[data-view]').forEach((el) => {
  el.addEventListener('click', () => MD.go(el.dataset.view));
});

document.getElementById('vc')?.addEventListener('click', (e) => {
  const row = e.target.closest('.md-doc-row');
  if (!row) return;
  e.preventDefault();
  MD.openDoc(row.getAttribute('data-doc-path'), row.getAttribute('data-doc-label'));
});

document.addEventListener('DOMContentLoaded', () => {
  initShellUi();
  loadSnapshot(false);
});

window.addEventListener('focus', () => {
  if (MD.data) loadSnapshot(true);
});
