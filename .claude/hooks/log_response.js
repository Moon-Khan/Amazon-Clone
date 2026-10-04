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

// Walk the transcript backwards from the end, collecting assistant text
// blocks until we hit the user prompt that opened this turn. Thinking
// blocks and tool_use/tool_result blocks are skipped on purpose.
function extractFinalResponse(transcriptPath) {
  const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n').filter(Boolean);
  const texts = [];
  let model = null;

  for (let i = lines.length - 1; i >= 0; i--) {
    let obj;
    try {
      obj = JSON.parse(lines[i]);
    } catch (e) {
      continue;
    }

    if (obj.type === 'user') {
      const content = obj.message && obj.message.content;
      if (typeof content === 'string') break;
      if (Array.isArray(content)) {
        const isToolResultOnly = content.every(b => b.type === 'tool_result');
        if (!isToolResultOnly) break;
      }
      continue;
    }

    if (obj.type === 'assistant' && obj.message) {
      if (!model && obj.message.model) model = obj.message.model;
      const blocks = obj.message.content || [];
      for (const b of blocks) {
        if (b.type === 'text' && b.text) texts.unshift(b.text);
      }
    }
  }

  return { text: texts.join('\n\n'), model: model || 'unknown' };
}

function main() {
  const input = readStdin();
  const sessionId = input.session_id || 'unknown-session';
  const transcriptPath = input.transcript_path;
  const cwd = process.cwd();
  const repoRoot = findRepoRoot(cwd);
  const logsDir = path.join(repoRoot, '.agent-logs');
  const stateDir = path.join(logsDir, '.state');
  const stateFile = path.join(stateDir, `${sessionId}.json`);

  if (!fs.existsSync(stateFile)) return; // no matching prompt entry logged
  const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));

  const { text, model } = extractFinalResponse(transcriptPath);
  const nowIso = new Date().toISOString();

  const entry = `
[LOG_ENTRY type=RESPONSE num=${state.num} session=${sessionId}]
timestamp: ${nowIso}
model: ${model}

${text}

---
`;
  const logPath = path.join(logsDir, state.logfile);
  fs.appendFileSync(logPath, entry, 'utf8');

  state.last_response_time = nowIso;
  state.last_model = model;
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2), 'utf8');

  // Update only the frontmatter counters/model line, never the entries below it.
  let content = fs.readFileSync(logPath, 'utf8');
  content = content
    .replace(/model: .*/, `model: ${model}`)
    .replace(/total_exchanges: .*/, `total_exchanges: ${state.num}`)
    .replace(/last_prompt_time: .*/, `last_prompt_time: ${state.last_prompt_time}`);
  fs.writeFileSync(logPath, content, 'utf8');
}

main();
