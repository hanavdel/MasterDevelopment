'use strict';

const {
  parseAgentSyncTable,
  parseWorkQueue,
  parseScanLog,
  isOpenStatus,
} = require('./coord-parser');
const { PROJECTS, WORK_OPPORTUNITIES, AGENDA_TOPICS, DOC_LINKS } = require('./projects-registry');

function parseFlexibleDate(str) {
  const iso = String(str).match(/(\d{4}-\d{2}-\d{2})/);
  if (iso) return new Date(iso[1]).getTime();
  return Date.parse(String(str).replace('—', ' ')) || 0;
}

function buildSnapshot(readText) {
  const workQueueRaw = readText('WORK_QUEUE.md') || '';
  const scanLogRaw = readText('SCAN_LOG.md') || '';
  const workItems = parseWorkQueue(workQueueRaw);
  const scanEntries = parseScanLog(scanLogRaw).slice(0, 8);

  const projectActivity = PROJECTS.map((proj) => {
    let recent = [];
    if (proj.agentSync) {
      const raw = readText(proj.agentSync);
      if (raw) recent = parseAgentSyncTable(raw).slice(0, 5);
    }
    const relatedWork = workItems.filter((w) => proj.workIds.includes(w.id));
    const openWork = relatedWork.filter((w) => isOpenStatus(w.status));
    return { ...proj, recent, relatedWork, openWork };
  });

  const allActivity = projectActivity
    .flatMap((p) => p.recent.map((r) => ({ ...r, projectId: p.id, projectName: p.name })))
    .sort((a, b) => parseFlexibleDate(b.date) - parseFlexibleDate(a.date))
    .slice(0, 20);

  const openPriorities = workItems
    .filter((w) => isOpenStatus(w.status))
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
    source: 'server',
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

module.exports = { buildSnapshot, parseFlexibleDate };
