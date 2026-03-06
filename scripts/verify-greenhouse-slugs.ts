// scripts/verify-greenhouse-slugs-batch4.ts
// 실행: npx tsx scripts/verify-greenhouse-slugs-batch4.ts

interface Company {
  name: string
  slug: string
}

interface CompanyResult extends Company {
  status: number
  valid: boolean
}

const CANDIDATE_COMPANIES: Company[] = [
  // ── Aerospace / Defense ──
  { name: 'Cloudflare',             slug: 'cloudflare' },
  { name: 'Okta',                   slug: 'okta' },
  { name: 'Fastly',                 slug: 'fastly' },
  { name: 'PagerDuty',              slug: 'pagerduty' },
  { name: 'Abnormal Security',      slug: 'abnormalsecurity' },
  { name: 'Huntress',               slug: 'huntress' },
  { name: 'Verkada',                slug: 'verkada' },
  { name: 'Rubrik',                 slug: 'rubrik' },
  { name: 'Axonius',                slug: 'axonius' },
  { name: 'Orca Security',          slug: 'orca' },
  { name: 'Torq',                   slug: 'torq' },
  { name: 'Brinqa',                 slug: 'brinqa' },
  { name: 'Tines',                  slug: 'tines' },

  // ── Developer Tools ──
  { name: 'Vercel',                 slug: 'vercel' },
  { name: 'PlanetScale',            slug: 'planetscale' },
  { name: 'Netlify',                slug: 'netlify' },
  { name: 'Honeycomb',              slug: 'honeycomb' },
  { name: 'Temporal',               slug: 'temporal' },
  { name: 'Grafana Labs',           slug: 'grafanalabs' },
  { name: 'Algolia',                slug: 'algolia' },
  { name: 'Contentful',             slug: 'contentful' },
  { name: 'Descript',               slug: 'descript' },
  { name: 'LaunchDarkly',           slug: 'launchdarkly' },
  { name: 'Starburst',              slug: 'starburst' },
  { name: 'Postman',                slug: 'postman' },
  { name: 'CircleCI',               slug: 'circleci' },
  { name: 'Buildkite',              slug: 'buildkite' },
  { name: 'Encore',                 slug: 'encore' },
  { name: 'Cortex',                 slug: 'cortex' },

  // ── Observability ──
  { name: 'Mezmo',                  slug: 'mezmo' },
  { name: 'Cribl',                  slug: 'cribl' },
  { name: 'Axiom',                  slug: 'axiom' },

  // ── Data / Cloud ──
  { name: 'Databricks',             slug: 'databricks' },
  { name: 'MongoDB',                slug: 'mongodb' },
  { name: 'Elastic',                slug: 'elastic' },
  { name: 'Fivetran',               slug: 'fivetran' },
  { name: 'Salsify',                slug: 'salsify' },
  { name: 'Hightouch',              slug: 'hightouch' },
  { name: 'Collibra',               slug: 'collibra' },
  { name: 'Stitch',                 slug: 'stitch' },

  // ── Enterprise SaaS ──
  { name: 'Dropbox',                slug: 'dropbox' },
  { name: 'Twilio',                 slug: 'twilio' },
  { name: 'HubSpot',                slug: 'hubspot' },
  { name: 'Intercom',               slug: 'intercom' },
  { name: 'Mixpanel',               slug: 'mixpanel' },
  { name: 'Amplitude',              slug: 'amplitude' },
  { name: 'Workato',                slug: 'workato' },
  { name: 'Make',                   slug: 'make' },
  { name: 'ZoomInfo',               slug: 'zoominfo' },
  { name: 'Qualtrics',              slug: 'qualtrics' },
  { name: 'Yext',                   slug: 'yext' },
  { name: 'Celonis',                slug: 'celonis' },

  // ── Sales / Marketing Tech ──
  { name: 'Salesloft',              slug: 'salesloft' },
  { name: 'Apollo',                 slug: 'apollo' },
  { name: 'Klaviyo',                slug: 'klaviyo' },
  { name: 'Braze',                  slug: 'braze' },
  { name: 'Iterable',               slug: 'iterable' },
  { name: 'Sendbird',               slug: 'sendbird' },
  { name: 'Attentive',              slug: 'attentive' },
  { name: 'Postscript',             slug: 'postscript' },
  { name: 'Yotpo',                  slug: 'yotpo' },
  { name: '6sense',                 slug: '6sense' },
  { name: 'Bombora',                slug: 'bombora' },
  { name: 'Trustpilot',             slug: 'trustpilot' },
  { name: 'Sprout Social',          slug: 'sproutsocial' },
  { name: 'Hootsuite',              slug: 'hootsuite' },
  { name: 'Later',                  slug: 'later' },
  { name: 'SOCi',                   slug: 'soci' },
  { name: 'Planable',               slug: 'planable' },
  { name: 'SMSBump',                slug: 'smsbump' },
  { name: 'Vidyard',                slug: 'vidyard' },
  { name: 'Weave',                  slug: 'weave' },

  // ── Productivity / Collab ──
  { name: 'Airtable',               slug: 'airtable' },
  { name: 'Figma',                  slug: 'figma' },
  { name: 'Calendly',               slug: 'calendly' },
  { name: 'Lattice',                slug: 'lattice' },

  // ── Fintech ──
  { name: 'Stripe',                 slug: 'stripe' },
  { name: 'Coinbase',               slug: 'coinbase' },
  { name: 'Robinhood',              slug: 'robinhood' },
  { name: 'Brex',                   slug: 'brex' },
  { name: 'Chime',                  slug: 'chime' },
  { name: 'Carta',                  slug: 'carta' },
  { name: 'Gusto',                  slug: 'gusto' },
  { name: 'Checkr',                 slug: 'checkr' },
  { name: 'Affirm',                 slug: 'affirm' },
  { name: 'Marqeta',                slug: 'marqeta' },
  { name: 'Mercury',                slug: 'mercury' },
  { name: 'Adyen',                  slug: 'adyen' },
  { name: 'Betterment',             slug: 'betterment' },
  { name: 'SoFi',                   slug: 'sofi' },
  { name: 'Gemini',                 slug: 'gemini' },
  { name: 'Payoneer',               slug: 'payoneer' },
  { name: 'Recharge',               slug: 'recharge' },
  { name: 'Sezzle',                 slug: 'sezzle' },
  { name: 'Perpay',                 slug: 'perpay' },
  { name: 'Alpaca',                 slug: 'alpaca' },
  { name: 'DriveWealth',            slug: 'drivewealth' },
  { name: 'Public',                 slug: 'public' },
  { name: 'Cleo',                   slug: 'cleo' },
  { name: 'Upstart',                slug: 'upstart' },
  { name: 'Blend',                  slug: 'blend' },
  { name: 'Morty',                  slug: 'morty' },
  { name: 'Credible',               slug: 'credible' },
  { name: 'Credit Karma',           slug: 'creditkarma' },

  // ── AI / ML ──
  { name: 'Scale AI',               slug: 'scaleai' },
  { name: 'Runway',                 slug: 'runwayml' },
  { name: 'Stability AI',           slug: 'stabilityai' },
  { name: 'Together AI',            slug: 'togetherai' },
  { name: 'xAI',                    slug: 'xai' },
  { name: 'Imbue',                  slug: 'imbue' },
  { name: 'Hebbia',                 slug: 'hebbia' },
  { name: 'Udio',                   slug: 'udio' },
  { name: 'Magic',                  slug: 'magic' },
  { name: 'Otter.ai',               slug: 'otterai' },
  { name: 'AssemblyAI',             slug: 'assemblyai' },
  { name: 'Snorkel AI',             slug: 'snorkelai' },
  { name: 'Labelbox',               slug: 'labelbox' },
  { name: 'Voxel51',                slug: 'voxel51' },
  { name: 'Clarifai',               slug: 'clarifai' },

  // ── Aerospace / Robotics / Autonomous ──
  { name: 'SpaceX',                 slug: 'spacex' },
  { name: 'Archer Aviation',        slug: 'archer' },
  { name: 'Nuro',                   slug: 'nuro' },
  { name: 'Waymo',                  slug: 'waymo' },
  { name: 'Motional',               slug: 'motional' },
  { name: 'Apptronik',              slug: 'apptronik' },
  { name: 'Figure AI',              slug: 'figureai' },
  { name: 'Outrider',               slug: 'outrider' },
  { name: 'Kodiak Robotics',        slug: 'kodiak' },

  // ── Consumer / Marketplace ──
  { name: 'Airbnb',                 slug: 'airbnb' },
  { name: 'Instacart',              slug: 'instacart' },
  { name: 'Lyft',                   slug: 'lyft' },
  { name: 'Poshmark',               slug: 'poshmark' },
  { name: 'Thumbtack',              slug: 'thumbtack' },
  { name: 'Opendoor',               slug: 'opendoor' },
  { name: 'Taskrabbit',             slug: 'taskrabbit' },
  { name: 'Faire',                  slug: 'faire' },

  // ── Logistics ──
  { name: 'Flexport',               slug: 'flexport' },
  { name: 'Samsara',                slug: 'samsara' },
  { name: 'project44',              slug: 'project44' },
  { name: 'Bird',                   slug: 'bird' },

  // ── HR Tech ──
  { name: 'Remote',                 slug: 'remote' },
  { name: 'Culture Amp',            slug: 'cultureamp' },
  { name: 'Handshake',              slug: 'handshake' },
  { name: 'SeekOut',                slug: 'seekout' },
  { name: 'Pallet',                 slug: 'pallet' },
  { name: 'Turing',                 slug: 'turing' },
  { name: 'Globalization Partners', slug: 'globalizationpartners' },
  { name: 'Workboard',              slug: 'workboard' },
  { name: 'Workstream',             slug: 'workstream' },
  { name: 'Degreed',                slug: 'degreed' },

  // ── Healthcare Tech ──
  { name: 'Oscar Health',           slug: 'oscar' },
  { name: 'Calm',                   slug: 'calm' },
  { name: 'Grow Therapy',           slug: 'growtherapy' },
  { name: 'Komodo Health',          slug: 'komodohealth' },
  { name: 'Cerebral',               slug: 'cerebral' },
  { name: 'Talkspace',              slug: 'talkspace' },
  { name: 'BetterHelp',             slug: 'betterhelp' },
  { name: 'Headway',                slug: 'headway' },
  { name: 'Truepill',               slug: 'truepill' },
  { name: 'Amwell',                 slug: 'amwell' },
  { name: 'One Medical',            slug: 'onemedical' },
  { name: 'Galileo Health',         slug: 'galileo' },
  { name: 'Transcarent',            slug: 'transcarent' },
  { name: 'Collective Health',      slug: 'collectivehealth' },

  // ── Climate / Clean Energy ──
  { name: 'Palmetto',               slug: 'palmetto' },
  { name: 'Electreon',              slug: 'electreon' },
  { name: 'ChargePoint',            slug: 'chargepoint' },
  { name: 'Lucid Motors',           slug: 'lucidmotors' },

  // ── Consumer Brands (dev 많이 뽑는 곳) ──
  { name: 'Peloton',                slug: 'peloton' },
  { name: 'Allbirds',               slug: 'allbirds' },
  { name: 'Rent the Runway',        slug: 'renttherunway' },
  { name: 'Stitch Fix',             slug: 'stitchfix' },
  { name: 'Glossier',               slug: 'glossier' },
  { name: 'Everlane',               slug: 'everlane' },
  { name: 'Cuyana',                 slug: 'cuyana' },
  { name: 'iFIT',                   slug: 'ifit' },
  { name: 'Purple',                 slug: 'purple' },
  { name: 'Saatva',                 slug: 'saatva' },

  // ── Food / Delivery ──
  { name: 'Chowbus',                slug: 'chowbus' },
  { name: 'Goldbelly',              slug: 'goldbelly' },
  { name: 'Misfits Market',         slug: 'misfitsmarket' },
  { name: 'Hungryroot',             slug: 'hungryroot' },
  { name: 'Daily Harvest',          slug: 'dailyharvest' },

  // ── EdTech ──
  { name: 'Duolingo',               slug: 'duolingo' },
  { name: 'Coursera',               slug: 'coursera' },
  { name: 'Khan Academy',           slug: 'khanacademy' },
  { name: 'Outschool',              slug: 'outschool' },
  { name: 'InStride',               slug: 'instride' },
  { name: 'NovoEd',                 slug: 'novoed' },
  { name: 'Skillsoft',              slug: 'skillsoft' },
  { name: 'Udacity',                slug: 'udacity' },
  { name: 'General Assembly',       slug: 'generalassembly' },
  { name: 'Springboard',            slug: 'springboard' },
  { name: 'Pathstream',             slug: 'pathstream' },

  // ── Real Estate ──
  { name: 'Orchard',                slug: 'orchard' },
  { name: 'Pacaso',                 slug: 'pacaso' },
  { name: 'Roofstock',              slug: 'roofstock' },
  { name: 'SpotHero',               slug: 'spothero' },

  // ── Legal Tech ──
  { name: 'Disco',                  slug: 'disco' },
  { name: 'Everlaw',                slug: 'everlaw' },
  { name: 'Relativity',             slug: 'relativity' },

  // ── Gaming ──
  { name: 'Roblox',                 slug: 'roblox' },
  { name: 'Riot Games',             slug: 'riotgames' },
  { name: 'Scopely',                slug: 'scopely' },
  { name: 'Epic Games',             slug: 'epicgames' },
  { name: 'Bungie',                 slug: 'bungie' },
  { name: 'Gearbox',                slug: 'gearbox' },
  { name: 'Insomniac Games',        slug: 'insomniac' },
  { name: 'Naughty Dog',            slug: 'naughtydog' },
  { name: 'Firaxis Games',          slug: 'firaxis' },
  { name: 'Social Point',           slug: 'socialpoint' },
  { name: 'Wooga',                  slug: 'wooga' },

  // ── Social / Media ──
  { name: 'Reddit',                 slug: 'reddit' },
  { name: 'Pinterest',              slug: 'pinterest' },
  { name: 'Discord',                slug: 'discord' },
  { name: 'Twitch',                 slug: 'twitch' },

  // ── Travel ──
  { name: 'Vacasa',                 slug: 'vacasa' },
  { name: 'GetYourGuide',           slug: 'getyourguide' },
  { name: 'Hopper',                 slug: 'hopper' },
  { name: 'Kasa Living',            slug: 'kasaliving' },
  { name: 'Mint House',             slug: 'minthouse' },

  // ── Misc ──
  { name: 'Lob',                    slug: 'lob' },
]

const CHUNK_SIZE = 10

async function checkSlug(company: Company): Promise<CompanyResult> {
  try {
    const res = await fetch(
      `https://boards-api.greenhouse.io/v1/boards/${company.slug}/jobs`,
      { signal: AbortSignal.timeout(5000) }
    )
    return { ...company, status: res.status, valid: res.ok }
  } catch {
    return { ...company, status: 0, valid: false }
  }
}

async function run() {
  const valid: Company[] = []

  console.log(`🔍 Checking ${CANDIDATE_COMPANIES.length} companies...\n`)

  for (let i = 0; i < CANDIDATE_COMPANIES.length; i += CHUNK_SIZE) {
    const chunk = CANDIDATE_COMPANIES.slice(i, i + CHUNK_SIZE)
    const results = await Promise.all(chunk.map(checkSlug))

    results.forEach(r => {
      if (r.valid) {
        valid.push({ name: r.name, slug: r.slug })
        console.log(`✅ ${r.name} (${r.slug})`)
      } else {
        console.log(`❌ ${r.name} → ${r.status}`)
      }
    })
  }

  console.log(`\n✅ Valid: ${valid.length} / ${CANDIDATE_COMPANIES.length}\n`)
  console.log('📋 기존 GREENHOUSE_COMPANIES 에 추가하세요:\n')
  valid.forEach(c => {
    console.log(`  { name: '${c.name}', slug: '${c.slug}' },`)
  })
}

run()