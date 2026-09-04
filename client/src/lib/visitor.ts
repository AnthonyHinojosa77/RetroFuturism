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
