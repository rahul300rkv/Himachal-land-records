/**
 * The 12 districts of Himachal Pradesh with their main tehsils.
 *
 * `value` is the canonical English name stored in the database
 * (land_records.district / land_records.tehsil); `hi` is the Hindi display name.
 *
 * NOTE: This is a convenience list of main tehsils. Administrative units (tehsils,
 * sub-tehsils) are re-organised from time to time, so verify against official revenue
 * data before relying on it, and extend it as you load real records.
 */
export type Named = { value: string; hi: string };
export type District = Named & { tehsils: readonly Named[] };

export const HP_DISTRICTS: readonly District[] = [
  {
    value: 'Bilaspur',
    hi: 'बिलासपुर',
    tehsils: [
      { value: 'Bilaspur Sadar', hi: 'बिलासपुर सदर' },
      { value: 'Ghumarwin', hi: 'घुमारवीं' },
      { value: 'Jhandutta', hi: 'झंडूता' },
      { value: 'Shri Naina Devi Ji', hi: 'श्री नैना देवी जी' },
    ],
  },
  {
    value: 'Chamba',
    hi: 'चंबा',
    tehsils: [
      { value: 'Chamba', hi: 'चंबा' },
      { value: 'Dalhousie', hi: 'डलहौजी' },
      { value: 'Bhattiyat', hi: 'भटियात' },
      { value: 'Bharmour', hi: 'भरमौर' },
      { value: 'Churah', hi: 'चुराह' },
      { value: 'Pangi', hi: 'पांगी' },
      { value: 'Salooni', hi: 'सलूणी' },
    ],
  },
  {
    value: 'Hamirpur',
    hi: 'हमीरपुर',
    tehsils: [
      { value: 'Hamirpur', hi: 'हमीरपुर' },
      { value: 'Barsar', hi: 'बड़सर' },
      { value: 'Bhoranj', hi: 'भोरंज' },
      { value: 'Nadaun', hi: 'नादौन' },
      { value: 'Sujanpur', hi: 'सुजानपुर' },
    ],
  },
  {
    value: 'Kangra',
    hi: 'कांगड़ा',
    tehsils: [
      { value: 'Dharamshala', hi: 'धर्मशाला' },
      { value: 'Kangra', hi: 'कांगड़ा' },
      { value: 'Palampur', hi: 'पालमपुर' },
      { value: 'Baijnath', hi: 'बैजनाथ' },
      { value: 'Dehra', hi: 'देहरा' },
      { value: 'Jawali', hi: 'जवाली' },
      { value: 'Nurpur', hi: 'नूरपुर' },
      { value: 'Indora', hi: 'इंदौरा' },
      { value: 'Fatehpur', hi: 'फतेहपुर' },
      { value: 'Shahpur', hi: 'शाहपुर' },
      { value: 'Jawalamukhi', hi: 'ज्वालामुखी' },
      { value: 'Nagrota Bagwan', hi: 'नगरोटा बगवां' },
      { value: 'Jaswan Pragpur', hi: 'जसवां-प्रागपुर' },
    ],
  },
  {
    value: 'Kinnaur',
    hi: 'किन्नौर',
    tehsils: [
      { value: 'Kalpa', hi: 'कल्पा' },
      { value: 'Nichar', hi: 'निचार' },
      { value: 'Pooh', hi: 'पूह' },
      { value: 'Sangla', hi: 'सांगला' },
      { value: 'Moorang', hi: 'मूरंग' },
    ],
  },
  {
    value: 'Kullu',
    hi: 'कुल्लू',
    tehsils: [
      { value: 'Kullu', hi: 'कुल्लू' },
      { value: 'Manali', hi: 'मनाली' },
      { value: 'Banjar', hi: 'बंजार' },
      { value: 'Anni', hi: 'आनी' },
      { value: 'Nirmand', hi: 'निरमंड' },
    ],
  },
  {
    value: 'Lahaul and Spiti',
    hi: 'लाहौल और स्पीति',
    tehsils: [
      { value: 'Keylong', hi: 'केलांग' },
      { value: 'Udaipur', hi: 'उदयपुर' },
      { value: 'Kaza', hi: 'काजा' },
    ],
  },
  {
    value: 'Mandi',
    hi: 'मंडी',
    tehsils: [
      { value: 'Mandi Sadar', hi: 'मंडी सदर' },
      { value: 'Sundernagar', hi: 'सुंदरनगर' },
      { value: 'Joginder Nagar', hi: 'जोगिंद्रनगर' },
      { value: 'Karsog', hi: 'करसोग' },
      { value: 'Sarkaghat', hi: 'सरकाघाट' },
      { value: 'Chachyot', hi: 'चच्योट' },
      { value: 'Gohar', hi: 'गोहर' },
      { value: 'Thunag', hi: 'थुनाग' },
      { value: 'Balh', hi: 'बल्ह' },
      { value: 'Dharampur', hi: 'धर्मपुर' },
      { value: 'Padhar', hi: 'पधर' },
    ],
  },
  {
    value: 'Shimla',
    hi: 'शिमला',
    tehsils: [
      { value: 'Shimla Urban', hi: 'शिमला शहरी' },
      { value: 'Shimla Rural', hi: 'शिमला ग्रामीण' },
      { value: 'Rampur', hi: 'रामपुर' },
      { value: 'Rohru', hi: 'रोहड़ू' },
      { value: 'Theog', hi: 'ठियोग' },
      { value: 'Chopal', hi: 'चौपाल' },
      { value: 'Kotkhai', hi: 'कोटखाई' },
      { value: 'Jubbal', hi: 'जुब्बल' },
      { value: 'Kumarsain', hi: 'कुमारसैन' },
      { value: 'Chirgaon', hi: 'चिड़गांव' },
      { value: 'Nankhari', hi: 'ननखड़ी' },
      { value: 'Sunni', hi: 'सुन्नी' },
    ],
  },
  {
    value: 'Sirmaur',
    hi: 'सिरमौर',
    tehsils: [
      { value: 'Nahan', hi: 'नाहन' },
      { value: 'Paonta Sahib', hi: 'पांवटा साहिब' },
      { value: 'Rajgarh', hi: 'राजगढ़' },
      { value: 'Pachhad', hi: 'पच्छाद' },
      { value: 'Sangrah', hi: 'संगड़ाह' },
      { value: 'Renukaji', hi: 'रेणुकाजी' },
      { value: 'Shillai', hi: 'शिलाई' },
    ],
  },
  {
    value: 'Solan',
    hi: 'सोलन',
    tehsils: [
      { value: 'Solan', hi: 'सोलन' },
      { value: 'Kandaghat', hi: 'कंडाघाट' },
      { value: 'Kasauli', hi: 'कसौली' },
      { value: 'Arki', hi: 'अर्की' },
      { value: 'Nalagarh', hi: 'नालागढ़' },
      { value: 'Baddi', hi: 'बद्दी' },
      { value: 'Kunihar', hi: 'कुनिहार' },
      { value: 'Dharampur', hi: 'धर्मपुर' },
      { value: 'Darlaghat', hi: 'दारलाघाट' },
      { value: 'Ramshehar', hi: 'रामशहर' },
    ],
  },
  {
    value: 'Una',
    hi: 'ऊना',
    tehsils: [
      { value: 'Una', hi: 'ऊना' },
      { value: 'Amb', hi: 'अंब' },
      { value: 'Bangana', hi: 'बंगाणा' },
      { value: 'Haroli', hi: 'हरोली' },
      { value: 'Gagret', hi: 'गगरेट' },
    ],
  },
];

const label = (item: Named | undefined, fallback: string, locale: string) =>
  item ? (locale === 'hi' ? item.hi : item.value) : fallback;

/** Tehsils of a district (canonical English district name). Empty if unknown. */
export function getTehsils(district: string): readonly Named[] {
  return HP_DISTRICTS.find((d) => d.value === district)?.tehsils ?? [];
}

/** Display name of a district in the given locale (falls back to the stored value). */
export function districtLabel(value: string, locale: string) {
  return label(
    HP_DISTRICTS.find((d) => d.value === value),
    value,
    locale,
  );
}

/** Display name of a tehsil in the given locale (falls back to the stored value). */
export function tehsilLabel(district: string, value: string, locale: string) {
  return label(
    getTehsils(district).find((t) => t.value === value),
    value,
    locale,
  );
}

export function isValidTehsil(district: string, tehsil: string) {
  return getTehsils(district).some((t) => t.value === tehsil);
}
