'use strict';

function parseAgentSyncTable(content) {
  const block = content.match(/<!-- agent-sync:log -->([\s\S]*?)<!-- \/agent-sync:log -->/);
  if (!block) return [];
  return block[1]
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|') && !line.includes('---') && !/^\|\s*Tarih/i.test(line))
    .map((line) => {
      const cols = line.split('|').map((c) => c.trim()).filter(Boolean);
      return {
        date: cols[0] || '',
        change: stripMd(cols[1] || ''),
        project: cols[2] || '',
        note: stripMd(cols[3] || ''),
      };
    });
}

function parseWorkQueue(content) {
  const items = [];
  const chunks = content.split(/^## /m).slice(1);
  for (const chunk of chunks) {
    const titleLine = chunk.split('\n')[0] || '';
    if (/^İptal|^Tamamlanan|^Iptal/i.test(titleLine)) continue;
    const m = titleLine.match(/^(MD-\d+)\s*\((P\d)\)\s*(?:[—–\-]|\u2014|\u2013)\s*(.+)$/)
      || titleLine.match(/^(MD-\d+)\s*\((P\d)\)\s+\S+\s+(.+)$/);
    if (!m) continue;
    const body = chunk.slice(titleLine.length);
    const statusMatch = body.match(/\|\s*Durum\s*\|\s*\*\*(.+?)\*\*/);
    const status = statusMatch ? stripMd(statusMatch[1]) : 'Açık';
    const guideMatch = body.match(/\|\s*Rehber\s*\|\s*\[`?([^`\]|]+)`?\]/);
    const guide = guideMatch ? guideMatch[1].trim() : null;
    const subtasks = [...body.matchAll(/^- \[([ xX])\]\s*(.+)$/gm)].map((x) => ({
      done: x[1].toLowerCase() === 'x',
      text: stripMd(x[2].trim()),
    }));
    const exitMatch = body.match(/\*\*Çıkış kriteri:\*\*\s*(.+)/);
    items.push({
      id: m[1],
      priority: m[2],
      title: m[3].trim(),
      status,
      guide,
      subtasks,
      exitCriteria: exitMatch ? stripMd(exitMatch[1]) : '',
      openSubtasks: subtasks.filter((s) => !s.done),
      doneSubtasks: subtasks.filter((s) => s.done),
      progress: subtasks.length ? Math.round((subtasks.filter((s) => s.done).length / subtasks.length) * 100) : 0,
    });
  }
  return items;
}

function parseScanLog(content) {
  const entries = [];
  const parts = content.split(/^### /m).slice(1);
  for (const part of parts) {
    const head = part.split('\n')[0] || '';
    const titleMatch = head.match(/^\[([^\]]+)\]\s*(.*)$/);
    if (!titleMatch) continue;
    const body = part.slice(head.length);
    const section = { date: titleMatch[1].trim(), title: titleMatch[2].trim(), bullets: [] };
    for (const line of body.split('\n')) {
      const t = line.trim();
      if (t.startsWith('- ')) section.bullets.push(stripMd(t.slice(2)));
    }
    entries.push(section);
  }
  return entries.sort((a, b) => parseFlexibleDate(b.date) - parseFlexibleDate(a.date));
}

function parseFlexibleDate(str) {
  const iso = str.match(/(\d{4}-\d{2}-\d{2})/);
  if (iso) return new Date(iso[1]).getTime();
  const tr = str.match(/(\d{4}-\d{2}-\d{2}|\d{2}:\d{2})/);
  return tr ? Date.parse(str.replace('—', ' ')) || 0 : 0;
}

function stripMd(text) {
  return String(text)
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/~~(.+?)~~/g, '$1')
    .replace(/`/g, '')
    .trim();
}

function isDoneStatus(status) {
  return /tamamland/i.test(status);
}

function isOpenStatus(status) {
  return /açık|devam|planlama|bootstrap|şema yazıldı|talep|uyguland/i.test(status) && !isDoneStatus(status);
}

module.exports = {
  parseAgentSyncTable,
  parseWorkQueue,
  parseScanLog,
  stripMd,
  isDoneStatus,
  isOpenStatus,
};
