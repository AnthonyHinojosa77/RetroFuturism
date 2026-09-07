// In-memory visitor identity — persists for the lifetime of the page session
// (sessionStorage is unavailable in the sandboxed iframe)

let visitorId: string | null = null;
let visitorName: string | null = null;

export function getVisitorId(): string {
  if (!visitorId) {
    visitorId = crypto.randomUUID();
  }
  return visitorId;
}

export function getVisitorName(): string {
  if (!visitorName) {
    visitorName = `Explorer #${Math.floor(Math.random() * 9000) + 1000}`;
  }
  return visitorName;
}

// Guard against duplicate visitor logs (React 18 StrictMode double-mount in dev)
const loggedWorlds = new Set<string>();

export function shouldLogVisit(world: string): boolean {
  if (loggedWorlds.has(world)) return false;
  loggedWorlds.add(world);
  return true;
}
