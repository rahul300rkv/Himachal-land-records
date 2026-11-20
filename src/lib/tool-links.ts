/**
 * Single source of truth for tool URLs and which tools link to which.
 * Add a tool here once and every breadcrumb / "related tools" block picks it up.
 */
export const TOOL_KEYS = ['search', 'map', 'nakal', 'converter', 'stampDuty', 'circleRate', 'verify'] as const;
export type ToolKey = (typeof TOOL_KEYS)[number];

export const TOOL_HREFS = {
  search: '/search',
  map: '/map',
  nakal: '/check',
  converter: '/converter',
  stampDuty: '/stamp-duty-calculator',
  circleRate: '/circle-rate',
  verify: '/verify',
} as const satisfies Record<ToolKey, string>;

/** Ordered by how a buyer usually moves from one check to the next. */
export const RELATED_TOOLS = {
  search: ['nakal', 'map', 'circleRate', 'verify'],
  map: ['search', 'nakal', 'converter', 'verify'],
  nakal: ['search', 'verify', 'map', 'circleRate'],
  converter: ['search', 'map', 'circleRate', 'stampDuty'],
  circleRate: ['stampDuty', 'converter', 'search', 'verify'],
  stampDuty: ['circleRate', 'converter', 'verify', 'search'],
  verify: ['nakal', 'search', 'map', 'circleRate', 'stampDuty'],
} as const satisfies Record<ToolKey, readonly ToolKey[]>;
