const BASE_URL = process.env.HIMBHOOMI_BASE_URL
  ?? 'https://himbhoomilmk.nic.in/';
const RECORDS_URL = new URL('viewlandrecords.aspx', BASE_URL).toString();
const POSTBACK_SETTLE_MS = 500;
const CAPTCHA_SETTLE_MS = 750;

export type OfficialOption = { value: string; label: string };
type UpstreamState = { cookie: string; html: string; url: string; redirected: boolean };

const OFFICIAL_DISTRICTS: OfficialOption[] = [
  { value: '04', label: 'ऊना' },
  { value: '07', label: 'कुल्लू' },
  { value: '02', label: 'कांगड़ा' },
  { value: '12', label: 'किन्नौर' },
  { value: '01', label: 'चम्बा' },
  { value: '05', label: 'बिलासपुर' },
  { value: '06', label: 'मण्डी' },
  { value: '08', label: 'लाहौल-स्पीति' },
  { value: '09', label: 'शिमला' },
  { value: '11', label: 'सिरमौर' },
  { value: '10', label: 'सोलन' },
  { value: '03', label: 'हमीरपुर' },
];

function delay(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

const FIELD = {
  district: 'ctl00$ContentPlaceHolder1$cmbdistrict',
  tehsil: 'ctl00$ContentPlaceHolder1$cmbtehsil',
  village: 'ctl00$ContentPlaceHolder1$cmbvillage',
  year: 'ctl00$ContentPlaceHolder1$cmbjyear',
  captcha: 'ctl00$ContentPlaceHolder1$txtSearchCaptcha',
  reloadCaptcha: 'ctl00$ContentPlaceHolder1$GenerateNewCode',
  submit: 'ctl00$ContentPlaceHolder1$btnGo',
} as const;

function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 16)));
}

function attributes(tag: string) {
  return Object.fromEntries(
    [...tag.matchAll(/([:\w$-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map((match) => [
      match[1].toLowerCase(),
      decodeEntities(match[2] ?? match[3] ?? ''),
    ]),
  );
}

function hiddenFields(html: string) {
  const fields: Record<string, string> = {};
  for (const match of html.matchAll(/<input\b[^>]*>/gi)) {
    const attrs = attributes(match[0]);
    if (attrs.type?.toLowerCase() === 'hidden' && attrs.name) fields[attrs.name] = attrs.value ?? '';
  }
  return fields;
}

function browserFormFields(html: string) {
  const fields: Record<string, string> = {};
  for (const match of html.matchAll(/<input\b[^>]*>/gi)) {
    const attrs = attributes(match[0]);
    if (!attrs.name || /\sdisabled(?:\s|=|\/?>)/i.test(match[0])) continue;
    const type = attrs.type?.toLowerCase() ?? 'text';
    const checked = /\schecked(?:\s*=\s*(?:["']checked["']|["']?true["']?))?(?:\s|\/?>)/i.test(match[0]);
    if ((type === 'radio' || type === 'checkbox') && checked) {
      fields[attrs.name] = attrs.value ?? '';
    } else if (!['hidden', 'radio', 'checkbox', 'submit', 'button', 'reset', 'file', 'image'].includes(type)) {
      fields[attrs.name] = attrs.value ?? '';
    }
  }
  for (const match of html.matchAll(/<select\b([^>]*)>([\s\S]*?)<\/select>/gi)) {
    const tag = `<select ${match[1]}>`;
    const attrs = attributes(tag);
    if (!attrs.name || /\sdisabled(?:\s|=|>)/i.test(tag)) continue;
    const options = [...match[2].matchAll(/<option\b([^>]*)>([\s\S]*?)<\/option>/gi)];
    const selected = options.find((option) => /\sselected(?:\s|=|>)/i.test(`<option ${option[1]}>`)) ?? options[0];
    if (selected) fields[attrs.name] = attributes(`<option ${selected[1]}>`).value ?? plainText(selected[2]);
  }
  return fields;
}

function formPostbacks(html: string) {
  const postbacks: Record<string, Record<string, string>> = {};
  for (const match of html.matchAll(/<(?:input|select)\b[^>]*>/gi)) {
    const attrs = attributes(match[0]);
    if (!attrs.name) continue;
    const script = attrs.onclick ?? attrs.onchange ?? '';
    const target = script.match(/__doPostBack\(\s*\\?["']([^\\"']+)\\?["']/i)?.[1];
    if (!target) continue;
    postbacks[attrs.name] ??= {};
    postbacks[attrs.name][attrs.value ?? '*'] = target;
  }
  return postbacks;
}

export function selectOptions(html: string, id: string): OfficialOption[] {
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const select = html.match(new RegExp(`<select\\b[^>]*id=["']${escaped}["'][^>]*>([\\s\\S]*?)<\\/select>`, 'i'));
  if (!select) return [];
  return [...select[1].matchAll(/<option\b([^>]*)>([\s\S]*?)<\/option>/gi)]
    .map((match) => {
      const attrs = attributes(`<option ${match[1]}>`);
      return { value: attrs.value ?? '', label: decodeEntities(match[2].replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim() };
    })
    .filter((option) => option.value);
}

function mergeCookie(current: string, response: Response) {
  const cookies = new Map(current.split(/;\s*/).filter(Boolean).map((part) => {
    const index = part.indexOf('=');
    return [part.slice(0, index), part.slice(index + 1)] as const;
  }));
  const setCookies = response.headers.getSetCookie?.() ?? (response.headers.get('set-cookie') ? [response.headers.get('set-cookie')!] : []);
  setCookies.forEach((header) => {
    const pair = header.split(';', 1)[0];
    const index = pair.indexOf('=');
    if (index > 0) cookies.set(pair.slice(0, index), pair.slice(index + 1));
  });
  return [...cookies].map(([name, value]) => `${name}=${value}`).join('; ');
}

async function request(url: string, init: RequestInit, cookie = ''): Promise<UpstreamState> {
  const response = await fetch(url, {
    ...init,
    cache: 'no-store',
    redirect: 'follow',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml',
      'Accept-Language': 'hi-IN,hi;q=0.9,en-IN;q=0.8,en;q=0.7',
      ...(cookie ? { Cookie: cookie } : {}),
      ...init.headers,
    },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`HimBhoomi returned ${response.status}`);
  return { cookie: mergeCookie(cookie, response), html: await response.text(), url: response.url, redirected: response.redirected };
}

async function start() {
  return request(RECORDS_URL, { method: 'GET' });
}

async function postback(state: UpstreamState, eventTarget: string, selected: Record<string, string>) {
  const body = new URLSearchParams({ ...hiddenFields(state.html), ...selected, __EVENTTARGET: eventTarget, __EVENTARGUMENT: '' });
  const nextState = await request(RECORDS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Referer: RECORDS_URL },
    body,
  }, state.cookie);
  await delay(POSTBACK_SETTLE_MS);
  return nextState;
}

export type OfficialSelection = { district: string; tehsil?: string; village?: string };

export async function loadOfficialState(selection: OfficialSelection) {
  let state = await start();
  const selected: Record<string, string> = { [FIELD.district]: selection.district };
  state = await postback(state, FIELD.district, selected);
  if (selection.tehsil) {
    selected[FIELD.tehsil] = selection.tehsil;
    state = await postback(state, FIELD.tehsil, selected);
  }
  if (selection.village) {
    selected[FIELD.village] = selection.village;
    state = await postback(state, FIELD.village, selected);
  }
  return { state, selected };
}

export async function getDistricts() {
  return OFFICIAL_DISTRICTS;
}

export async function getDependentOptions(selection: OfficialSelection) {
  const { state } = await loadOfficialState(selection);
  if (!selection.tehsil) return selectOptions(state.html, 'ctl00_ContentPlaceHolder1_cmbtehsil');
  if (!selection.village) return selectOptions(state.html, 'ctl00_ContentPlaceHolder1_cmbvillage');
  return selectOptions(state.html, 'ctl00_ContentPlaceHolder1_cmbjyear');
}

type CaptchaSession = OfficialSelection & {
  year: string;
  cookie: string;
  hidden: Record<string, string>;
  fields?: Record<string, string>;
  postbacks?: Record<string, Record<string, string>>;
};

export type OfficialControl = {
  name: string;
  label: string;
  kind: 'select' | 'radio' | 'text';
  options: OfficialOption[];
  selected?: string;
};

function plainText(value: string) {
  return decodeEntities(value.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function officialControls(html: string): OfficialControl[] {
  const relevant = /(khewat|khatauni|khasra|jamshj|rblkkk|ddlkh)/i;
  const labels = new Map(
    [...html.matchAll(/<label\b([^>]*)>([\s\S]*?)<\/label>/gi)].map((match) => {
      const attrs = attributes(`<label ${match[1]}>`);
      return [attrs.for ?? '', plainText(match[2])] as const;
    }),
  );
  const controls: OfficialControl[] = [];
  for (const match of html.matchAll(/<select\b([^>]*)>([\s\S]*?)<\/select>/gi)) {
    const attrs = attributes(`<select ${match[1]}>`);
    if (!attrs.name || !relevant.test(`${attrs.name} ${attrs.id ?? ''}`)) continue;
    const options = [...match[2].matchAll(/<option\b([^>]*)>([\s\S]*?)<\/option>/gi)]
      .map((option) => {
        const optionAttrs = attributes(`<option ${option[1]}>`);
        return { value: optionAttrs.value ?? '', label: plainText(option[2]) };
      })
      .filter((option) => option.value && !/^-?select-?$/i.test(option.value));
    const inferredLabel = /Khewat/i.test(attrs.name) ? 'Khewat number'
      : /Khatauni/i.test(attrs.name) ? 'Khatauni number'
        : /Khasra/i.test(attrs.name) ? 'Khasra number'
          : 'Official record choice';
    controls.push({ name: attrs.name, label: labels.get(attrs.id ?? '') || plainText(attrs.title ?? '') || inferredLabel, kind: 'select', options });
  }
  const radioGroups = new Map<string, OfficialOption[]>();
  for (const match of html.matchAll(/<input\b[^>]*type=["']radio["'][^>]*>/gi)) {
    const attrs = attributes(match[0]);
    if (!attrs.name || !relevant.test(`${attrs.name} ${attrs.id ?? ''}`)) continue;
    const option = { value: attrs.value ?? '', label: labels.get(attrs.id ?? '') || attrs.value || 'Option' };
    radioGroups.set(attrs.name, [...(radioGroups.get(attrs.name) ?? []), option]);
  }
  radioGroups.forEach((options, name) => controls.push({
    name,
    label: /JamShj/i.test(name) ? 'Record type' : 'Search record by',
    kind: 'radio',
    options,
  }));
  for (const match of html.matchAll(/<input\b[^>]*type=["']text["'][^>]*>/gi)) {
    const attrs = attributes(match[0]);
    if (attrs.name === 'ctl00$ContentPlaceHolder1$txtFullName') {
      controls.push({ name: attrs.name, label: 'Name for Shajra Nasab', kind: 'text', options: [] });
    }
  }
  const order = (control: OfficialControl) => /JamShj/i.test(control.name) ? 0
    : /RBLKKK/i.test(control.name) ? 1
      : control.kind === 'text' ? 2 : 3;
  const selected = browserFormFields(html);
  return controls
    .filter((control) => control.kind === 'text' || control.options.length > 0)
    .map((control) => ({
      ...control,
      selected: control.kind === 'text' || control.options.some(({ value }) => value === selected[control.name])
        ? selected[control.name]
        : undefined,
    }))
    .sort((left, right) => order(left) - order(right));
}

function encodeSession(session: CaptchaSession) {
  return Buffer.from(JSON.stringify(session), 'utf8').toString('base64url');
}

function decodeSession(token: string): CaptchaSession {
  const parsed = JSON.parse(Buffer.from(token, 'base64url').toString('utf8')) as CaptchaSession;
  if (!parsed.district || !parsed.tehsil || !parsed.village || !parsed.year || !parsed.hidden) {
    throw new Error('Invalid HimBhoomi session');
  }
  return parsed;
}

export async function prepareOfficialSearch(selection: Required<OfficialSelection> & { year: string }) {
  const loaded = await loadOfficialState(selection);
  const selected = { ...loaded.selected, [FIELD.year]: selection.year };
  const state = await postback(loaded.state, FIELD.year, selected);
  return {
    controls: officialControls(state.html),
    token: encodeSession({
      ...selection,
      cookie: state.cookie,
      hidden: hiddenFields(state.html),
      fields: browserFormFields(state.html),
      postbacks: formPostbacks(state.html),
    }),
  };
}

export async function createCaptchaSession(token: string) {
  const session = decodeSession(token);
  // The official Reload control is an image submit button. Its postback
  // refreshes the challenge in the same form session before the image loads.
  const body = new URLSearchParams({
    ...session.hidden,
    ...(session.fields ?? {}),
    [FIELD.district]: session.district,
    [FIELD.tehsil]: session.tehsil!,
    [FIELD.village]: session.village!,
    [FIELD.year]: session.year,
    [FIELD.captcha]: '',
    [`${FIELD.reloadCaptcha}.x`]: '1',
    [`${FIELD.reloadCaptcha}.y`]: '1',
    __EVENTTARGET: '',
    __EVENTARGUMENT: '',
  });
  const refreshed = await request(RECORDS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Referer: RECORDS_URL },
    body,
  }, session.cookie);
  const refreshedHidden = hiddenFields(refreshed.html);
  if (!refreshedHidden.__VIEWSTATE) throw new Error('HimBhoomi reload did not return the record form');
  await delay(CAPTCHA_SETTLE_MS);
  const captchaResponse = await fetch(new URL('CaptchaControl.aspx', BASE_URL), {
    cache: 'no-store',
    headers: { Cookie: refreshed.cookie, Referer: RECORDS_URL },
    signal: AbortSignal.timeout(30_000),
  });
  if (!captchaResponse.ok) throw new Error(`Captcha returned ${captchaResponse.status}`);
  const bytes = Buffer.from(await captchaResponse.arrayBuffer());
  const mediaType = captchaResponse.headers.get('content-type')?.split(';')[0] || 'image/jpeg';
  return {
    image: `data:${mediaType};base64,${bytes.toString('base64')}`,
    token: encodeSession({
      ...session,
      cookie: mergeCookie(refreshed.cookie, captchaResponse),
      hidden: refreshedHidden,
      fields: browserFormFields(refreshed.html),
      postbacks: formPostbacks(refreshed.html),
    }),
  };
}

function sanitizeOfficialResult(html: string) {
  const content = html.match(/<div\b[^>]*id=["']ctl00_ContentPlaceHolder1_UpdatePanel1["'][^>]*>([\s\S]*?)<div\b[^>]*id=["']footer_image["']/i)?.[1] ?? html;
  return content
    .replace(/<(script|style|form|iframe|object|embed|svg)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/<input\b[^>]*>/gi, '')
    .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*')/gi, '')
    .replace(/\s+(?:href|src|action)\s*=\s*(?:"[^"]*"|'[^']*')/gi, '')
    .replace(/<(?!\/?(?:table|thead|tbody|tfoot|tr|td|th|div|span|p|br|h[1-6]|strong|b|em|ul|ol|li)\b)[^>]+>/gi, '')
    .replace(/<(\w+)\b([^>]*)>/g, (_tag, name: string, attrs: string) => {
      const safe = [...attrs.matchAll(/\s+(colspan|rowspan)\s*=\s*(?:"(\d+)"|'(\d+)')/gi)]
        .map((match) => ` ${match[1]}="${match[2] ?? match[3]}"`).join('');
      return `<${name}${safe}>`;
    });
}

function isNakalPage(url: string) {
  return /\/viewNakal\.aspx(?:$|[?#])/i.test(url);
}

function nakalPopupUrl(html: string, responseUrl: string) {
  const origin = new URL(RECORDS_URL).origin;
  for (const script of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) {
    for (const call of script[1].matchAll(/\bwindow\s*\.\s*open\s*\(\s*(["'])([^"'\\]+)\1\s*(?=[,)])/gi)) {
      try {
        const target = new URL(decodeEntities(call[2]), responseUrl);
        if (target.origin === origin && /^\/viewNakal\.aspx$/i.test(target.pathname) && !target.username && !target.password) {
          return target.toString();
        }
      } catch {
        // The script did not contain a usable URL.
      }
    }
  }
  return null;
}

export async function submitOfficialSearch(token: string, captcha: string) {
  const session = decodeSession(token);
  const body = new URLSearchParams({
    ...session.hidden,
    [FIELD.district]: session.district,
    [FIELD.tehsil]: session.tehsil!,
    [FIELD.village]: session.village!,
    [FIELD.year]: session.year,
    ...(session.fields ?? {}),
    [FIELD.captcha]: captcha.trim().toUpperCase(),
    [FIELD.submit]: 'OK',
    __EVENTTARGET: '',
    __EVENTARGUMENT: '',
  });
  const formResponse = await request(RECORDS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Referer: RECORDS_URL },
    body,
  }, session.cookie);
  const popup = isNakalPage(formResponse.url) ? null : nakalPopupUrl(formResponse.html, formResponse.url);
  const state = popup
    ? await request(popup, { method: 'GET', headers: { Referer: formResponse.url } }, formResponse.cookie)
    : formResponse;
  const recordReady = isNakalPage(state.url);
  const responseText = plainText(state.html);
  const captchaFailed = !recordReady && /(?:wrong|incorrect|invalid)\s*(?:captcha\s*)?code|(?:invalid|wrong|incorrect)\s*captcha|captcha.{0,80}(?:invalid|wrong|incorrect|गलत|अमान्य|स्वीकार नहीं)/i.test(responseText);
  const responseFields = browserFormFields(formResponse.html);
  if (!recordReady) {
    const submittedControls = Object.entries(session.fields ?? {}).filter(([name, value]) =>
      /\$(?:DDL(?:Khewat|Khatauni|Khasra)|RBLKKK|.*JamShj|txtFullName)$/i.test(name)
      && Boolean(value) && !/^-?select-?$/i.test(value),
    );
    console.warn('HimBhoomi search returned no record', {
      redirected: state.redirected,
      openedNakalPopup: Boolean(popup),
      returnedSearchForm: /\/viewlandrecords\.aspx(?:$|[?#])/i.test(state.url),
      captchaRejected: captchaFailed,
      hasSessionCookie: Boolean(session.cookie),
      hasFormState: Boolean(session.hidden.__VIEWSTATE),
      submittedRecordControls: submittedControls.length,
      resetRecordControls: submittedControls.filter(([name, value]) => responseFields[name] !== value).length,
    });
  }
  const nextToken = encodeSession({
    ...session,
    cookie: formResponse.cookie,
    hidden: hiddenFields(formResponse.html),
    fields: responseFields,
    postbacks: formPostbacks(formResponse.html),
  });
  const replacementCaptcha = captchaFailed ? await createCaptchaSession(nextToken) : null;
  return {
    html: recordReady ? sanitizeOfficialResult(state.html) : '',
    captchaFailed,
    submissionFailed: !recordReady && !captchaFailed,
    recordReady,
    controls: recordReady || captchaFailed ? [] : officialControls(formResponse.html),
    image: replacementCaptcha?.image,
    token: replacementCaptcha?.token ?? nextToken,
  };
}

export async function continueOfficialSearch(token: string, fields: Record<string, string>, eventTarget = '') {
  const session = decodeSession(token);
  const safeFields = Object.fromEntries(
    Object.entries(fields).filter(([name, value]) =>
      name.startsWith('ctl00$ContentPlaceHolder1$') && name.length <= 150 && value.length <= 500,
    ),
  );
  const allFields = { ...(session.fields ?? {}), ...safeFields };
  const requestedTarget = eventTarget.startsWith('ctl00$ContentPlaceHolder1$') ? eventTarget : '';
  const selectedValue = safeFields[requestedTarget] ?? '';
  const resolvedTarget = session.postbacks?.[requestedTarget]?.[selectedValue]
    ?? session.postbacks?.[requestedTarget]?.['*']
    ?? requestedTarget;
  const body = new URLSearchParams({
    ...session.hidden,
    [FIELD.district]: session.district,
    [FIELD.tehsil]: session.tehsil!,
    [FIELD.village]: session.village!,
    [FIELD.year]: session.year,
    ...allFields,
    __EVENTTARGET: resolvedTarget,
    __EVENTARGUMENT: '',
  });
  const state = await request(RECORDS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Referer: RECORDS_URL },
    body,
  }, session.cookie);
  const recordReady = isNakalPage(state.url);
  const nextFields = browserFormFields(state.html);
  return {
    html: recordReady ? sanitizeOfficialResult(state.html) : '',
    recordReady,
    controls: recordReady ? [] : officialControls(state.html),
    token: encodeSession({
      ...session,
      cookie: state.cookie,
      hidden: hiddenFields(state.html),
      fields: nextFields,
      postbacks: formPostbacks(state.html),
    }),
  };
}

