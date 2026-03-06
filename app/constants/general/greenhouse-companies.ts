import { GreenhouseCompany } from "@/app/types/greenhouse";

export const GREENHOUSE_COMPANIES: GreenhouseCompany[] = [
  // ── Security / Infra ──
  { name: 'Cloudflare',         slug: 'cloudflare' },
  { name: 'Okta',               slug: 'okta' },
  { name: 'Fastly',             slug: 'fastly' },
  { name: 'PagerDuty',          slug: 'pagerduty' },
  { name: 'Abnormal Security',  slug: 'abnormalsecurity' },
  { name: 'Huntress',           slug: 'huntress' },
  { name: 'Verkada',            slug: 'verkada' },

  // ── Developer Tools ──
  { name: 'Vercel',             slug: 'vercel' },
  { name: 'PlanetScale',        slug: 'planetscale' },
  { name: 'Netlify',            slug: 'netlify' },
  { name: 'Honeycomb',          slug: 'honeycomb' },
  { name: 'Temporal',           slug: 'temporal' },
  { name: 'Grafana Labs',       slug: 'grafanalabs' },
  { name: 'Algolia',            slug: 'algolia' },
  { name: 'Contentful',         slug: 'contentful' },
  { name: 'Descript',           slug: 'descript' },
  { name: 'LaunchDarkly',       slug: 'launchdarkly' },
  { name: 'Starburst',          slug: 'starburst' },

  // ── Data / Cloud ──
  { name: 'Databricks',         slug: 'databricks' },
  { name: 'MongoDB',            slug: 'mongodb' },
  { name: 'Elastic',            slug: 'elastic' },
  { name: 'Fivetran',           slug: 'fivetran' },
  { name: 'Salsify',            slug: 'salsify' },

  // ── Enterprise SaaS ──
  { name: 'Dropbox',            slug: 'dropbox' },
  { name: 'Twilio',             slug: 'twilio' },
  { name: 'HubSpot',            slug: 'hubspot' },
  { name: 'Intercom',           slug: 'intercom' },
  { name: 'Mixpanel',           slug: 'mixpanel' },
  { name: 'Amplitude',          slug: 'amplitude' },
  { name: 'Workato',            slug: 'workato' },
  { name: 'Make',               slug: 'make' },
  { name: 'ZoomInfo',           slug: 'zoominfo' },

  // ── Sales / Marketing Tech ──
  { name: 'Salesloft',          slug: 'salesloft' },
  { name: 'Apollo',             slug: 'apollo' },
  { name: 'Klaviyo',            slug: 'klaviyo' },
  { name: 'Braze',              slug: 'braze' },
  { name: 'Iterable',           slug: 'iterable' },
  { name: 'Sendbird',           slug: 'sendbird' },

  // ── Productivity / Collab ──
  { name: 'Airtable',           slug: 'airtable' },
  { name: 'Figma',              slug: 'figma' },
  { name: 'Calendly',           slug: 'calendly' },
  { name: 'Lattice',            slug: 'lattice' },

  // ── Fintech ──
  { name: 'Stripe',             slug: 'stripe' },
  { name: 'Coinbase',           slug: 'coinbase' },
  { name: 'Robinhood',          slug: 'robinhood' },
  { name: 'Brex',               slug: 'brex' },
  { name: 'Chime',              slug: 'chime' },
  { name: 'Carta',              slug: 'carta' },
  { name: 'Gusto',              slug: 'gusto' },
  { name: 'Checkr',             slug: 'checkr' },
  { name: 'Affirm',             slug: 'affirm' },
  { name: 'Marqeta',            slug: 'marqeta' },
  { name: 'Mercury',            slug: 'mercury' },
  { name: 'Adyen',              slug: 'adyen' },
  { name: 'Betterment',         slug: 'betterment' },
  { name: 'SoFi',               slug: 'sofi' },
  { name: 'Gemini',             slug: 'gemini' },

  // ── AI / ML ──
  { name: 'Scale AI',           slug: 'scaleai' },
  { name: 'Runway',             slug: 'runwayml' },
  { name: 'Stability AI',       slug: 'stabilityai' },
  { name: 'Together AI',        slug: 'togetherai' },

  // ── Consumer / Marketplace ──
  { name: 'Airbnb',             slug: 'airbnb' },
  { name: 'Instacart',          slug: 'instacart' },
  { name: 'Lyft',               slug: 'lyft' },
  { name: 'Poshmark',           slug: 'poshmark' },
  { name: 'Thumbtack',          slug: 'thumbtack' },
  { name: 'Opendoor',           slug: 'opendoor' },
  { name: 'Taskrabbit',         slug: 'taskrabbit' },
  { name: 'Faire',              slug: 'faire' },

  // ── Logistics ──
  { name: 'Flexport',           slug: 'flexport' },
  { name: 'Samsara',            slug: 'samsara' },
  { name: 'project44',          slug: 'project44' },
  { name: 'Bird',               slug: 'bird' },

  // ── HR Tech ──
  { name: 'Remote',             slug: 'remote' },
  { name: 'Culture Amp',        slug: 'cultureamp' },

  // ── Healthcare Tech ──
  { name: 'Oscar Health',       slug: 'oscar' },
  { name: 'Calm',               slug: 'calm' },
  { name: 'Grow Therapy',       slug: 'growtherapy' },

  // ── EdTech ──
  { name: 'Duolingo',           slug: 'duolingo' },
  { name: 'Coursera',           slug: 'coursera' },

  // ── Real Estate ──
  { name: 'Orchard',            slug: 'orchard' },
  { name: 'Pacaso',             slug: 'pacaso' },

  // ── Gaming ──
  { name: 'Roblox',             slug: 'roblox' },
  { name: 'Riot Games',         slug: 'riotgames' },
  { name: 'Scopely',            slug: 'scopely' },
  { name: 'Epic Games',         slug: 'epicgames' },
  { name: 'Bungie',             slug: 'bungie' },
  { name: 'Gearbox',            slug: 'gearbox' },

  // ── Social / Media ──
  { name: 'Reddit',             slug: 'reddit' },
  { name: 'Pinterest',          slug: 'pinterest' },
  { name: 'Discord',            slug: 'discord' },
  { name: 'Twitch',             slug: 'twitch' },

  // ── Travel ──
  { name: 'Vacasa',             slug: 'vacasa' },
  { name: 'GetYourGuide',       slug: 'getyourguide' },

  // ── Non-Tech (dev 많이 뽑는 곳) ──
  { name: 'Peloton',            slug: 'peloton' },
]

export const TECH_KEYWORDS = [
  'software engineer', 'software developer',
  'frontend', 'front-end', 'front end',
  'backend', 'back-end', 'back end',
  'full stack', 'fullstack',
  'ios', 'android', 'mobile engineer',
  'devops', 'platform engineer', 'site reliability', 'sre',
  'machine learning', 'ml engineer',
  'data engineer', 'data scientist',
  'security engineer', 'infrastructure engineer',
  'engineering manager', 'staff engineer', 'principal engineer',
]