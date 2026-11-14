export type IntegrationMode = 'guided-external' | 'provider-portal';

export type LandSource = {
  id: 'himbhoomi' | 'hp-high-court' | 'district-courts';
  url: string;
  mode: IntegrationMode;
  government: boolean;
  requiresCaptcha: boolean;
  requiresAccount: boolean;
  himachalCoverage: 'official' | 'unconfirmed' | 'statewide';
};

/**
 * Public entry points only. We deliberately do not proxy or replay protected
 * requests: HimBhoomi/eCourts require a human CAPTCHA completed at the official source.
 */
export const LAND_SOURCES: readonly LandSource[] = [
  {
    id: 'himbhoomi',
    url: 'https://himbhoomilmk.nic.in/viewlandrecords.aspx',
    mode: 'guided-external',
    government: true,
    requiresCaptcha: true,
    requiresAccount: false,
    himachalCoverage: 'official',
  },
  {
    id: 'hp-high-court',
    url: 'https://hcservices.ecourts.gov.in/ecourtindiaHC/cases/ki_petres.php?court_code=1&dist_cd=1&stateNm=Himachal+Pradesh&state_cd=5',
    mode: 'guided-external',
    government: true,
    requiresCaptcha: true,
    requiresAccount: false,
    himachalCoverage: 'statewide',
  },
  {
    id: 'district-courts',
    url: 'https://services.ecourts.gov.in/ecourtindia_v6/',
    mode: 'guided-external',
    government: true,
    requiresCaptcha: true,
    requiresAccount: false,
    himachalCoverage: 'statewide',
  },
] as const;

export function getLandSource(id: LandSource['id']) {
  return LAND_SOURCES.find((source) => source.id === id);
}
