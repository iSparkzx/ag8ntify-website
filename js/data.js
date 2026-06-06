/* ============================================================
   AG8NTIFY — Data
   ============================================================ */
window.AG8 = {
  // marquee function chips
  agents: [
    { tag: '#lead-gen',    nm: 'Lead Generation',    ds: 'Capture, qualify, and route 24/7.' },
    { tag: '#crm-sync',    nm: 'CRM Automation',      ds: 'Every record clean, always current.' },
    { tag: '#outreach',    nm: 'Outreach Sequences',  ds: 'Personalised follow-ups at scale.' },
    { tag: '#analytics',   nm: 'Analytics Agent',     ds: 'Live reports, zero manual pulling.' },
    { tag: '#support',     nm: 'Support Triage',      ds: 'Resolve and route before humans see it.' },
    { tag: '#sales-ops',   nm: 'Sales Ops',           ds: 'First touch to close, accelerated.' },
    { tag: '#seo',         nm: 'SEO Content',         ds: 'Briefs, refreshes, rankings on autopilot.' },
    { tag: '#onboarding',  nm: 'Client Onboarding',   ds: 'Every step automated, nothing dropped.' },
    { tag: '#invoicing',   nm: 'Invoicing & AR',      ds: 'Chases, reminders, reconciliation.' },
    { tag: '#reporting',   nm: 'Board Reporting',     ds: 'Auto-generated from live data.' }
  ],

  // capabilities grid
  capabilities: [
    { nm: 'AI Workflow Automation',  ds: 'Replace repetitive manual steps with intelligent connected flows.', i: 'flow' },
    { nm: 'AI Agent Development',    ds: 'Custom agents that handle operational work end-to-end.', i: 'bot' },
    { nm: 'Lead Generation Systems', ds: 'Capture, score, and route leads without manual effort.', i: 'magnet' },
    { nm: 'Sales Process Automation',ds: 'Accelerate pipeline from first touch to closed revenue.', i: 'arrow' },
    { nm: 'Support Automation',      ds: 'Resolve and escalate at scale, premium experience intact.', i: 'chat' },
    { nm: 'CRM & Data Automation',   ds: 'Clean, sync, and activate data across every tool you use.', i: 'db' },
    { nm: 'AI Dashboards',           ds: 'Real-time visibility into the metrics that move the business.', i: 'chart' },
    { nm: 'Websites & Landing Pages',ds: 'Conversion-engineered builds that turn traffic into pipeline.', i: 'globe' }
  ],

  // live activity feed lines
  feed: [
    { tag: 'lead', tt: 'lead-gen-agent', b: 'New lead captured', dim: 'sarah.k@techcorp.com · LinkedIn outreach' },
    { tag: 'qual', tt: 'qualifier-agent', b: 'Lead scored: 87/100', dim: 'Budget ✓ Authority ✓ Need ✓ Timeline ✓' },
    { tag: 'crm',  tt: 'crm-agent', b: 'CRM record created', dim: 'HubSpot · Contact + Deal added' },
    { tag: 'out',  tt: 'outreach-agent', b: 'Sequence enrolled', dim: '5-step email sequence triggered' },
    { tag: 'enr',  tt: 'enrichment-agent', b: 'Contact enriched', dim: 'Company: 240 employees · Series B' },
    { tag: 'cal',  tt: 'calendar-agent', b: 'Meeting booked', dim: 'Strategy call · Thu 14:00 · Confirmed' },
    { tag: 'lead', tt: 'lead-gen-agent', b: 'New lead captured', dim: 'm.torres@scaleup.io · paid search' },
    { tag: 'crm',  tt: 'crm-agent', b: 'Pipeline updated', dim: 'Deal moved → Qualified · $48k ARR' },
    { tag: 'qual', tt: 'qualifier-agent', b: 'Lead scored: 91/100', dim: 'High intent · routed to AE instantly' },
    { tag: 'out',  tt: 'outreach-agent', b: 'Reply detected', dim: 'Positive sentiment · follow-up drafted' }
  ],

  // before/after rows: [label, manualHrs, aiHrs]
  ba: [
    { k: 'Lead gen & outreach', m: 16, a: 2 },
    { k: 'CRM & data entry',    m: 11, a: 1 },
    { k: 'Reporting & admin',   m: 9,  a: 1 },
    { k: 'Support & follow-up', m: 13, a: 3 }
  ],

  // results bar chart: [label, manual, automated]
  bars: [
    { k: 'Sales',   m: 22, a: 5 },
    { k: 'Ops',     m: 28, a: 6 },
    { k: 'Support', m: 19, a: 4 },
    { k: 'Finance', m: 16, a: 3 },
    { k: 'Growth',  m: 24, a: 5 }
  ]
};

// shared SVG icon set
window.AG8_ICONS = {
  flow:  '<path d="M4 7h6M14 7h6M4 17h6M14 17h6M10 7a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2M10 17a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2M7 7v10M17 7v10"/>',
  bot:   '<rect x="5" y="8" width="14" height="11" rx="2"/><path d="M12 8V4M9 4h6"/><circle cx="9.5" cy="13" r="1.2"/><circle cx="14.5" cy="13" r="1.2"/>',
  magnet:'<path d="M6 4v8a6 6 0 0 0 12 0V4M6 4h4M14 4h4M6 8h4"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  chat:  '<path d="M4 6h16v10H9l-4 4V6z"/><path d="M8 11h8M8 8h5"/>',
  db:    '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 4 6 4 9s-1.5 6.5-4 9c-2.5-2.5-4-6-4-9s1.5-6.5 4-9z"/>'
};
