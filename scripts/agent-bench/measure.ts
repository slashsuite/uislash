/**
 * What one agent run did, read from its `claude -p --output-format stream-json` log: tool calls,
 * the files it read, the text the tools returned, tokens sent and received, cost.
 */

type Json = Record<string, unknown>;

const isRecord = (v: unknown): v is Json => typeof v === "object" && v !== null;
const records = (v: unknown): Json[] => (Array.isArray(v) ? v.filter(isRecord) : []);
const num = (v: unknown): number => (typeof v === "number" ? v : 0);
const str = (v: unknown): string => (typeof v === "string" ? v : "");
const field = (v: unknown, key: string): unknown => (isRecord(v) ? v[key] : undefined);

export interface Measure {
  calls: number;
  tools: Record<string, number>;
  textRead: number;
  files: string[];
  bash: string[];
  requests: number;
  inputSent: number;
  uncached: number;
  output: number;
  cost: number;
  apiMs: number;
  isError: boolean;
  model: string;
}

/** The characters a tool result handed back, whether a string or a list of text blocks. */
function resultLength(content: unknown): number {
  if (typeof content === "string") return content.length;
  return records(content).reduce((n, c) => n + str(c["text"]).length, 0);
}

interface Tally {
  calls: number;
  textRead: number;
  tools: Record<string, number>;
  files: Set<string>;
  bash: string[];
  usage: Map<string, unknown>;
}

function toolUse(t: Tally, block: Json) {
  const name = str(block["name"]);
  t.calls++;
  t.tools[name] = (t.tools[name] ?? 0) + 1;
  if (name === "Read") t.files.add(str(field(block["input"], "file_path")));
  if (name === "Bash") t.bash.push(str(field(block["input"], "command")));
}

function event(t: Tally, e: Json) {
  const message = field(e, "message");
  const blocks = records(field(message, "content"));
  if (e["type"] === "assistant") {
    // One model request can stream as several assistant events; its id keys its usage once.
    t.usage.set(str(field(message, "id")), field(message, "usage"));
    for (const b of blocks) if (b["type"] === "tool_use") toolUse(t, b);
  }
  if (e["type"] === "user")
    for (const b of blocks)
      if (b["type"] === "tool_result") t.textRead += resultLength(b["content"]);
}

/** Files the agent read through Bash rather than Read. */
const BASH_READ = /(?:cat|head|tail|sed -n [^ ]+|less)\s+(\S+\.(?:md|txt|tsx|ts|json|js))(?!\w)/g;

function tally(events: Json[]): Tally {
  const t: Tally = {
    calls: 0,
    textRead: 0,
    tools: {},
    files: new Set(),
    bash: [],
    usage: new Map(),
  };
  for (const e of events) event(t, e);
  for (const m of t.bash.flatMap((c) => [...c.matchAll(BASH_READ)]))
    if (m[1] !== undefined) t.files.add(m[1]);
  return t;
}

export function measure(jsonl: string): Measure {
  const events = jsonl
    .split("\n")
    .filter(Boolean)
    .map((l): unknown => JSON.parse(l))
    .filter(isRecord);
  const t = tally(events);
  const turns = [...t.usage.values()];
  const sum = (k: string) => turns.reduce((n: number, u) => n + num(field(u, k)), 0);
  const result = events.find((e) => e["type"] === "result") ?? {};
  const init = events.find((e) => e["type"] === "system" && e["subtype"] === "init") ?? {};
  return {
    calls: t.calls,
    tools: t.tools,
    textRead: t.textRead,
    files: [...t.files],
    bash: t.bash,
    requests: turns.length,
    inputSent:
      sum("input_tokens") + sum("cache_creation_input_tokens") + sum("cache_read_input_tokens"),
    uncached: sum("input_tokens") + sum("cache_creation_input_tokens"),
    output: sum("output_tokens"),
    cost: num(result["total_cost_usd"]),
    apiMs: num(result["duration_api_ms"]),
    isError: result["is_error"] === true,
    model: str(init["model"]),
  };
}
