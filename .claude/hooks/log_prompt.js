#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function readStdin() {
  return JSON.parse(fs.readFileSync(0, 'utf8'));
}

function findRepoRoot(start) {
  let dir = start;
  while (true) {
    if (fs.existsSync(path.join(dir, '.git'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return start;
    dir = parent;
  }
}

function getModelFromTranscript(transcriptPath) {
  try {
    const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n').filter(Boolean);
    for (let i = lines.length - 1; i >= 0; i--) {
      const obj = JSON.parse(lines[i]);
      if (obj.type === 'assistant' && obj.message && obj.message.model) {
        return obj.message.model;
      }
    }
  } catch (e) {}
  return 'unknown';
}

function main() {
  const input = readStdin();
  const sessionId = input.session_id || 'unknown-session';
  const transcriptPath = input.transcript_path;
  const prompt = input.prompt || '';
  const cwd = input.cwd || process.cwd();

  const repoRoot = findRepoRoot(cwd);
  const logsDir = path.join(repoRoot, '.agent-logs');
  const stateDir = path.join(logsDir, '.state');
  fs.mkdirSync(stateDir, { recursive: true });

  const stateFile = path.join(stateDir, `${sessionId}.json`);
  const nowIso = new Date().toISOString();
  let state;

  if (fs.existsSync(stateFile)) {
    state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
  } else {
    const ts = nowIso.replace(/[:.]/g, '-').slice(0, 19).replace('T', '_');
    const filename = `${ts}_${sessionId}.md`;
    const author = process.env.AGENT_LOG_AUTHOR || 'Moon-Khan';
    const project = path.basename(repoRoot);
    state = { logfile: filename, num: 0, author, project, first_prompt_time: nowIso };

    const header = `---
session_id: ${sessionId}
date: ${nowIso.slice(0, 10)}
author: ${author}
model: pending
tool: claude-code
project: ${project}
total_exchanges: 0
first_prompt_time: ${nowIso}
last_prompt_time: ${nowIso}
---

# Session Log - ${nowIso.slice(0, 10)}

Session: \`${sessionId.slice(0, 8)}\` | Project: \`${project}\` | Author: \`${author}\`

---
`;
    fs.writeFileSync(path.join(logsDir, filename), header, 'utf8');
  }

  state.num += 1;
  state.last_prompt_time = nowIso;
  const model = getModelFromTranscript(transcriptPath);

  const entry = `
[LOG_ENTRY type=PROMPT num=${state.num} session=${sessionId}]
timestamp: ${nowIso}
model: ${model}

${prompt}

`;
  fs.appendFileSync(path.join(logsDir, state.logfile), entry, 'utf8');
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2), 'utf8');
}

main();
