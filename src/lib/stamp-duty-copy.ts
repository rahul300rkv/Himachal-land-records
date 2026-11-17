const en = {
  title: 'Himachal Pradesh Stamp Duty Calculator',
  intro: 'Estimate stamp duty for a sale, gift or lease. Add your quoted registration fee to see the combined cost.',
  deed: 'Deed type', sale: 'Sale deed', gift: 'Gift deed', lease: 'Lease deed',
  term: 'Lease term', fixed: 'Fixed term', indefinite: 'Perpetual or indefinite',
  market: 'Assessed market value (₹)', consideration: 'Agreed purchase price (₹)',
  leaseAmount: 'Total amount payable under the lease (₹)', years: 'Lease term in years',
  family: 'Gift between blood relatives with a common ancestor or between spouses',
  section118: 'State permission granted under Section 118(2)(h)',
  exempt: 'Qualifying cultivation lease exempt under Article 35',
  recipient: 'Buyer or recipient category', woman: 'Woman', other: 'Other',
  earlier: 'Value of earlier same-party deeds within one year (₹, optional)',
  fee: 'Quoted registration fee (₹, optional)',
  result: 'Estimated charges', base: 'Value used', rate: 'Schedule rate', duty: 'Stamp duty',
  registration: 'Registration fee', pending: 'Enter quoted fee', total: 'Combined estimate',
  linked: 'The one-year rule may also reprice earlier deeds at 8%. This estimate shows duty on the current deed. Ask the Sub-Registrar to calculate the adjustment.',
  empty: 'Enter a valid market value and complete the fields for your deed.',
  verify: 'Confirm the valuation, registration fee and any local surcharge or special treatment with the Sub-Registrar before payment.',
  overview: 'Stamp duty overview',
  overviewText: 'Market value depends on the property’s location, classification and applicable valuation. Enter the assessed amount for the whole property. On an ordinary sale, the calculator applies the rate to the higher of that amount and the agreed price.',
  source: 'Himachal Pradesh e-Gazette, Act No. 17 of 2026, Schedule I-A',
  faqTitle: 'Frequently asked questions',
  faq: [
    ['Which rate applies to an ordinary sale?', 'For women, the rate is 4% up to ₹1 crore. For other buyers, it is 6% up to ₹40 lakh. Above the applicable threshold, 8% applies to the full value. Linked deeds within one year can affect the threshold.'],
    ['How are gifts treated?', 'The standard thresholds also apply to gifts. Qualifying gifts between blood relatives or spouses use 0.1% of market value with a ₹5,000 minimum and ₹10,000 maximum.'],
    ['How are leases calculated?', 'For a fixed term, multiply the market value by the applicable rate and by the term in years divided by 100. For perpetual or indefinite leases, use the higher of market value and the total lease amount. Article 35 exempts certain cultivation leases. Confirm eligibility before selecting that option.'],
    ['When does the 12% rate apply?', 'It applies to sales and leases where the state granted permission under Section 118(2)(h). The rate applies regardless of gender. The fixed-term lease formula still uses the lease duration.'],
    ['Where do I get the registration fee?', 'Ask the Sub-Registrar for the fee for your deed. Enter that amount to see the combined estimate. Stamp duty and registration fees are separate charges.'],
  ],
};

export type StampDutyCopy = typeof en;

const hi: StampDutyCopy = {
  title: 'हिमाचल प्रदेश स्टाम्प शुल्क कैलकुलेटर',
  intro: 'बिक्री, उपहार या पट्टे का स्टाम्प शुल्क जानें। कुल अनुमान के लिए बताया गया पंजीकरण शुल्क भी दर्ज करें।',
  deed: 'दस्तावेज़ का प्रकार', sale: 'बिक्री विलेख', gift: 'उपहार विलेख', lease: 'पट्टा विलेख',
  term: 'पट्टे की अवधि', fixed: 'निश्चित अवधि', indefinite: 'स्थायी या अनिश्चित अवधि',
  market: 'आकलित बाजार मूल्य (₹)', consideration: 'तय बिक्री मूल्य (₹)',
  leaseAmount: 'पट्टे के तहत कुल देय राशि (₹)', years: 'पट्टे की अवधि (वर्ष)',
  family: 'साझा पूर्वज वाले रक्त संबंधियों या पति-पत्नी के बीच उपहार',
  section118: 'धारा 118(2)(h) के तहत राज्य की अनुमति मिली है',
  exempt: 'अनुच्छेद 35 के तहत छूट वाला कृषि पट्टा',
  recipient: 'खरीदार या प्राप्तकर्ता की श्रेणी', woman: 'महिला', other: 'अन्य',
  earlier: 'एक वर्ष में उन्हीं पक्षों के पिछले विलेखों का मूल्य (₹, वैकल्पिक)',
  fee: 'बताया गया पंजीकरण शुल्क (₹, वैकल्पिक)',
  result: 'अनुमानित शुल्क', base: 'गणना का आधार', rate: 'अनुसूची की दर', duty: 'स्टाम्प शुल्क',
  registration: 'पंजीकरण शुल्क', pending: 'बताया गया शुल्क दर्ज करें', total: 'कुल अनुमान',
  linked: 'एक वर्ष के नियम के तहत पुराने विलेखों पर भी 8% लग सकता है। यहां केवल मौजूदा विलेख का शुल्क दिखाया गया है। समायोजन की गणना उप-पंजीयक से कराएं।',
  empty: 'सही बाजार मूल्य और विलेख के लिए जरूरी विवरण दर्ज करें।',
  verify: 'भुगतान से पहले मूल्यांकन, पंजीकरण शुल्क और स्थानीय अधिभार या विशेष नियम की पुष्टि उप-पंजीयक से करें।',
  overview: 'स्टाम्प शुल्क का परिचय',
  overviewText: 'बाजार मूल्य संपत्ति के स्थान, श्रेणी और लागू मूल्यांकन पर निर्भर करता है। पूरी संपत्ति का आकलित मूल्य दर्ज करें। सामान्य बिक्री में तय कीमत और बाजार मूल्य में से जो अधिक हो, उस पर दर लगती है।',
  source: 'हिमाचल प्रदेश ई-राजपत्र, 2026 का अधिनियम संख्या 17, अनुसूची I-A',
  faqTitle: 'अक्सर पूछे जाने वाले सवाल',
  faq: [
    ['सामान्य बिक्री पर कौन-सी दर लगती है?', 'महिलाओं के लिए ₹1 करोड़ तक 4% और अन्य खरीदारों के लिए ₹40 लाख तक 6% है। लागू सीमा पार होने पर पूरे मूल्य पर 8% लगता है। एक वर्ष के भीतर जुड़े विलेख सीमा को प्रभावित कर सकते हैं।'],
    ['उपहार पर शुल्क कैसे लगता है?', 'सामान्य दर सीमाएं उपहार पर भी लागू होती हैं। पात्र रक्त संबंधियों या पति-पत्नी के बीच उपहार पर बाजार मूल्य का 0.1% लगता है। न्यूनतम ₹5,000 और अधिकतम ₹10,000 है।'],
    ['पट्टे का शुल्क कैसे निकलता है?', 'निश्चित अवधि के लिए बाजार मूल्य को लागू दर और वर्षों की संख्या ÷ 100 से गुणा करें। स्थायी या अनिश्चित पट्टे में बाजार मूल्य और कुल पट्टा राशि में से अधिक राशि लें। कृषि पट्टे की छूट चुनने से पहले पात्रता की पुष्टि करें।'],
    ['12% की दर कब लागू होती है?', 'राज्य सरकार द्वारा धारा 118(2)(h) के तहत अनुमति मिलने पर बिक्री और पट्टे पर यह दर लागू होती है। दर लिंग पर निर्भर नहीं है। निश्चित अवधि के पट्टे में अवधि का सूत्र लागू रहता है।'],
    ['पंजीकरण शुल्क कहां से पता करें?', 'अपने विलेख का शुल्क उप-पंजीयक से पूछें। कुल अनुमान देखने के लिए वह राशि दर्ज करें। स्टाम्प शुल्क और पंजीकरण शुल्क अलग हैं।'],
  ],
};

export function getStampDutyCopy(locale: string) {
  return locale === 'hi' ? hi : en;
}
