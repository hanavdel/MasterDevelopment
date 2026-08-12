'use strict';

/** fetch + zaman aşımı — takılı istekler dashboard'u kilitlemesin */
async function fetchText(url, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { cache: 'no-store', signal: controller.signal });
    if (!res.ok) throw new Error(url + ' → ' + res.status);
    return res.text();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchJson(url, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { cache: 'no-store', signal: controller.signal });
    if (!res.ok) throw new Error(url + ' → ' + res.status);
    return res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function loadSnapshotFromCoordFiles() {
  const reg = await fetchJson('data/registry.json');
  const { PROJECTS, WORK_OPPORTUNITIES = {}, AGENDA_TOPICS = [], DOC_LINKS = [] } = reg;
  const CP = window.CoordParser;
  if (!CP) throw new Error('CoordParser yüklenmedi');

  const workQueueRaw = await fetchText('coord/WORK_QUEUE.md');
  const scanLogRaw = await fetchText('coord/SCAN_LOG.md');
  const workItems = CP.parseWorkQueue(workQueueRaw);
  const scanEntries = CP.parseScanLog(scanLogRaw).slice(0, 8);

  const projectActivity = await Promise.all(
    PROJECTS.map(async (proj) => {
      let recent = [];
      if (proj.agentSync) {
        try {
          const raw = await fetchText('repo/' + proj.agentSync.replace(/\\/g, '/'), 8000);
          recent = CP.parseAgentSyncTable(raw).slice(0, 5);
        } catch {
          recent = [];
        }
      }
      const relatedWork = workItems.filter((w) => proj.workIds.includes(w.id));
      const openWork = relatedWork.filter((w) => CP.isOpenStatus(w.status));
      return { ...proj, recent, relatedWork, openWork };
    })
  );

  const allActivity = projectActivity
    .flatMap((p) => p.recent.map((r) => ({ ...r, projectId: p.id, projectName: p.name })))
    .sort((a, b) => CP.parseFlexibleDate(b.date) - CP.parseFlexibleDate(a.date))
    .slice(0, 20);

  const openPriorities = workItems
    .filter((w) => CP.isOpenStatus(w.status))
    .sort((a, b) => a.priority.localeCompare(b.priority) || a.id.localeCompare(b.id));

  const opportunities = [];
  for (const item of workItems) {
    const rules = WORK_OPPORTUNITIES[item.id] || [];
    for (const opp of rules) {
      const hasOpenSubtask = item.openSubtasks.length > 0;
      const recentlyProgressed = item.doneSubtasks.length > 0 && item.progress > 0;
      if (hasOpenSubtask || recentlyProgressed || item.progress === 100) {
        opportunities.push({
          workId: item.id,
          workTitle: item.title,
          priority: item.priority,
          status: item.status,
          progress: item.progress,
          ...opp,
        });
      }
    }
  }

  const nextActions = openPriorities.flatMap((w) =>
    w.openSubtasks.slice(0, 3).map((s) => ({
      workId: w.id,
      priority: w.priority,
      workTitle: w.title,
      task: s.text,
    }))
  );

  return {
    generatedAt: new Date().toISOString(),
    source: 'coord-files',
    summary: {
      projectCount: PROJECTS.length,
      openWorkCount: openPriorities.length,
      p0Count: openPriorities.filter((w) => w.priority === 'P0').length,
      p1Count: openPriorities.filter((w) => w.priority === 'P1').length,
      recentActivityCount: allActivity.length,
    },
    workItems,
    openPriorities,
    nextActions: nextActions.slice(0, 12),
    agenda: AGENDA_TOPICS,
    projects: projectActivity,
    activity: allActivity,
    scanLog: scanEntries,
    opportunities,
    docs: DOC_LINKS,
  };
}

window.loadSnapshotFromCoordFiles = loadSnapshotFromCoordFiles;
