const VISITOR_KEY = 'retro_visitor_id';
const NAME_KEY    = 'retro_visitor_name';

export function getVisitorId(): string {
  if (typeof window === 'undefined') return 'server';
  let id = sessionStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export function getVisitorName(): string {
  if (typeof window === 'undefined') return 'Explorer';
  let name = sessionStorage.getItem(NAME_KEY);
  if (!name) {
    name = `Explorer #${Math.floor(Math.random() * 9000) + 1000}`;
    sessionStorage.setItem(NAME_KEY, name);
  }
  return name;
}
