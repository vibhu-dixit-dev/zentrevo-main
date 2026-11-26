import subscribe from '../../server/newsletter/subscribe.js';
import unsubscribe from '../../server/newsletter/unsubscribe.js';
import settings from '../../server/newsletter/settings.js';
import broadcast from '../../server/newsletter/broadcast.js';
import cron from '../../server/newsletter/cron.js';

const routes = {
  subscribe,
  unsubscribe,
  settings,
  broadcast,
  cron
};

function resolveAction(req) {
  const fromQuery = req.query?.action;
  if (typeof fromQuery === 'string' && fromQuery) return fromQuery.toLowerCase();
  if (Array.isArray(fromQuery) && fromQuery[0]) return String(fromQuery[0]).toLowerCase();

  const path = String(req.url || '').split('?')[0];
  const match = path.match(/\/newsletter\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]).toLowerCase() : '';
}

export default async function handler(req, res) {
  const action = resolveAction(req);
  const route = routes[action];

  if (!route) {
    return res.status(404).json({
      success: false,
      message: 'Unknown newsletter action.'
    });
  }

  return route(req, res);
}
