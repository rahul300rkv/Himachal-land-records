type Localized = { en: string; hi: string };

export type BlogGuide = {
  slug: string;
  image: string;
  publishedAt: string;
  /** Optional. Used for the "Last updated" line and for dateModified in JSON-LD and metadata. */
  updatedAt?: string;
  readTime: Localized;
  title: Localized;
  summary: Localized;
  intro: Localized;
  sections: Array<{
    title: Localized;
    body: Localized;
    /** Statutory or source reference shown under the heading. */
    citation?: Localized;
    /** Bulleted list shown after the body. */
    list?: { en: string[]; hi: string[] };
    /** Highlighted note shown after the list. */
    note?: Localized;
    /** Link button shown at the end of the section. */
    link?: { href: string; label: Localized };
  }>;
  takeaway: Localized;
  sources: Array<{ label: string; url: string }>;
};
export const BLOG_GUIDES: BlogGuide[] = [
  {
    slug: 'how-to-read-jamabandi-khewat-khatauni-khasra',
    image: '/images/land-record-guides.webp',
    publishedAt: '2026-11-17T10:00:00+05:30',
    readTime: { en: '8 minute guide', hi: '8 मिनट की मार्गदर्शिका' },
    title: { en: 'How to read a Himachal Jamabandi: Khewat, Khatauni and Khasra explained', hi: 'हिमाचल जमाबंदी कैसे पढ़ें: खेवट, खतौनी और खसरा समझें' },
    summary: { en: 'A practical field-by-field guide to the ownership, cultivation, plot and remarks columns in a Himachal Pradesh record of rights.', hi: 'हिमाचल प्रदेश के अधिकार अभिलेख में स्वामित्व, काश्त, भूखंड और टिप्पणी कॉलम समझने की व्यावहारिक मार्गदर्शिका।' },
    intro: {
      en: 'A Jamabandi is often treated as a single answer to the question “who owns this land?” In reality, it is a structured revenue record that connects an ownership account, a cultivation account and individual survey plots for a particular estate and settlement year. Reading only the seller’s name is risky. A useful review follows the relationship between Khewat, Khatauni and Khasra, checks the seller’s fractional share, reads the land classification and then studies the remarks column for later events. The online HimBhoomi copy is an excellent starting point, but its own disclaimer says the information is for public benefit and that data updates remain the responsibility of revenue officials. Use it to frame questions, then compare it with a current certified copy and the underlying deeds.',
      hi: 'जमाबंदी को अक्सर “ज़मीन किसकी है?” का एकमात्र उत्तर मान लिया जाता है। वास्तव में यह किसी राजस्व गाँव और बंदोबस्त वर्ष के लिए मालिकाना खाते, काश्त खाते और अलग-अलग सर्वे भूखंडों को जोड़ने वाला अभिलेख है। केवल विक्रेता का नाम देखना पर्याप्त नहीं। खेवट, खतौनी और खसरा का संबंध, विक्रेता का हिस्सा, भूमि की किस्म और टिप्पणी कॉलम—सब साथ पढ़ें। हिमभूमि की ऑनलाइन प्रति प्रारंभिक जाँच के लिए उपयोगी है, पर इसे नई प्रमाणित नकल और मूल विलेखों से मिलाना चाहिए।',
    },
    sections: [
      { title: { en: 'Start with the record identity', hi: 'पहले अभिलेख की पहचान जाँचें' }, body: { en: 'Before reading any owner entry, confirm the district, tehsil or sub-tehsil, revenue village, Hadbast number and Jamabandi year. Villages with similar names can exist in different administrative units, and the same visible plot number can be meaningless without the correct estate. Note whether the copy is the latest available year or an older settlement record. The Revenue Department explains that some tehsils may rely on data imported to a central server, so also look for the displayed update date. Save the receipt or reference number, because it helps reproduce the exact copy that was reviewed. If the seller supplied a printout, independently retrieve the same combination instead of trusting the heading on the paper.', hi: 'मालिक का नाम पढ़ने से पहले जिला, तहसील/उप-तहसील, राजस्व गाँव, हदबस्त नंबर और जमाबंदी वर्ष मिलाएँ। एक जैसे नाम वाले गाँव अलग इकाइयों में हो सकते हैं। प्रति नवीनतम है या पुरानी, यह भी देखें और उपलब्ध अपडेट तिथि तथा रसीद नंबर सुरक्षित रखें। विक्रेता की दी हुई प्रति पर निर्भर न रहकर वही संयोजन स्वयं खोजें।' } },
      { title: { en: 'Khewat is the ownership account', hi: 'खेवट मालिकाना खाता है' }, body: { en: 'Khewat groups one or more recorded owners and states their shares in an ownership holding. It is not automatically one physical plot and it is not proof that every co-owner has agreed to sell a particular corner on the ground. Read every owner listed under that Khewat, the parentage or address details and the fractional shares. If the seller owns one-half or one-eighth, the proposed deed cannot safely describe the entire holding unless the remaining rights and any lawful partition are addressed. Names may also remain after death until inheritance mutation is attested. Match spellings and relationships with identity documents, succession papers and the registered chain rather than treating a similar name as a match.', hi: 'खेवट में एक मालिकाना होल्डिंग के दर्ज मालिक और उनके हिस्से होते हैं। यह अपने-आप एक भौतिक भूखंड नहीं और न ही यह सिद्ध करता है कि हर सह-मालिक किसी खास हिस्से को बेचने पर सहमत है। सभी मालिक, पिता/पति का नाम, पता और अंश पढ़ें। विक्रेता का हिस्सा सीमित हो तो पूरे भूखंड की बिक्री मानना जोखिमपूर्ण है।' } },
      { title: { en: 'Khatauni connects possession or cultivation', hi: 'खतौनी काश्त या कब्जे को जोड़ती है' }, body: { en: 'Khatauni is the cultivation or tenancy account associated with land under an ownership account. Depending on the entry, the person cultivating or possessing the land may be the owner, a tenant or another recorded occupant. That distinction matters. A buyer should not assume that a seller shown in Khewat has vacant physical possession of every Khasra linked to it. Compare the proprietor column with the cultivator or possession column and investigate unfamiliar names, tenancy terms or rent entries. Where possession on site differs from the record, pause the deal and ask for a lawful explanation, supporting orders and, where appropriate, actual demarcation and possession documentation.', hi: 'खतौनी मालिकाना खाते के अधीन काश्त या कब्जे का खाता है। काश्तकार मालिक, किरायेदार या अन्य दर्ज कब्जाधारी हो सकता है। खेवट में नाम होने से हर खसरे का खाली भौतिक कब्जा सिद्ध नहीं होता। मालिक और काश्त/कब्जा कॉलम मिलाएँ तथा अपरिचित नाम या लगान प्रविष्टि की जाँच करें।' } },
      { title: { en: 'Khasra identifies the survey parcel', hi: 'खसरा सर्वे भूखंड की पहचान है' }, body: { en: 'A Khasra number identifies a surveyed parcel within the revenue estate. The corresponding row normally records area, land type, irrigation and links back to the relevant accounts. It does not by itself show the boundary that a broker points out on a hillside. Copy every Khasra number from the proposed deed and compare it with the Jamabandi, Tatima or BhuNaksha view, the total area and the site. Watch for subdivisions, old and new number references, repeated numbers across villages and sales of an undivided share. If only part of a Khasra is offered, demand the lawful subdivision record and a clear map rather than relying on painted stones or oral measurements.', hi: 'खसरा राजस्व गाँव के भीतर सर्वे किए भूखंड की पहचान करता है। उसकी पंक्ति में क्षेत्रफल, भूमि किस्म और संबंधित खाते होते हैं। दलाल द्वारा मौके पर दिखाई सीमा इससे अपने-आप सिद्ध नहीं होती। डीड, जमाबंदी, ततीमा/भू-नक्शा और मौके के सभी खसरा नंबर व क्षेत्रफल मिलाएँ।' } },
      { title: { en: 'Read land class and area together', hi: 'भूमि किस्म और क्षेत्रफल साथ पढ़ें' }, body: { en: 'The area and classification columns affect far more than price. They may indicate agricultural land, orchard, grazing, uncultivable area, built use or another locally recorded category. Classification does not replace planning, forest, municipal or development permission, but a mismatch with the seller’s advertised use is an immediate question. Add the areas of the offered Khasras and verify the unit used in that estate; do not casually convert local units using a generic internet calculator. Compare the revenue area with the deed schedule, Tatima and any sanctioned plan. A small difference may reflect measurement history, but it still needs a written, professional explanation before consideration is fixed.', hi: 'क्षेत्रफल और भूमि वर्ग कीमत तथा उपयोग दोनों को प्रभावित करते हैं। कृषि, बागीचा, चरागाह, गैर-मुमकिन या निर्मित उपयोग जैसी प्रविष्टि विक्रेता के दावे से मेल खानी चाहिए। स्थानीय इकाई की सही समझ लें और राजस्व क्षेत्रफल को डीड, ततीमा तथा स्वीकृत योजना से मिलाएँ।' } },
      { title: { en: 'Remarks and mutations tell the later story', hi: 'टिप्पणी और इंतकाल बाद की कहानी बताते हैं' }, body: { en: 'The remarks or Kaifiyat column can point to mutations, mortgages, releases, court orders, partitions, acquisitions or corrections that changed the apparent position after the main entry. Treat every referenced mutation number as a document to retrieve, not a decorative note. Check whether it is proposed, attested, rejected or later superseded and compare its date with the sale deed chain. A mutation is a revenue entry; it does not cure an invalid underlying transfer or replace title due diligence. Conversely, a valid registered transaction may not yet appear in an older Jamabandi. Build a chronology of deeds, mutations and Jamabandi years so gaps and reversals become visible.', hi: 'कैफियत/टिप्पणी कॉलम इंतकाल, बंधक, मुक्ति, न्यायालय आदेश, बँटवारा, अधिग्रहण या सुधार की ओर संकेत कर सकता है। हर इंतकाल नंबर का आदेश और स्थिति लें। इंतकाल राजस्व प्रविष्टि है; यह गलत मूल हस्तांतरण को वैध नहीं बनाता। डीड, इंतकाल और जमाबंदी वर्षों की समयरेखा बनाएँ।' } },
    ],
    takeaway: { en: 'A reliable reading moves from record identity to Khewat ownership, Khatauni possession, Khasra parcel, area and class, and finally remarks. All of those elements must agree with the registered chain, map and site inspection. Any mismatch is a reason to investigate before money moves—not something to “correct later” after registration.', hi: 'विश्वसनीय जाँच क्रम है: अभिलेख पहचान, खेवट स्वामित्व, खतौनी कब्जा, खसरा भूखंड, क्षेत्रफल/किस्म और अंत में टिप्पणी। इन्हें पंजीकृत डीड, नक्शे और मौके की जाँच से मेल खाना चाहिए। असंगति हो तो भुगतान से पहले समाधान लें।' },
    sources: [
      { label: 'HimBhoomi public land records', url: 'https://himbhoomilmk.nic.in/viewlandrecords.aspx' },
      { label: 'Himachal Pradesh Revenue Department', url: 'https://himachal.nic.in/revenue' },
    ],
  },
  {
    slug: 'section-118-permission-himachal-land-buyers',
    image: '/images/himachal-valley.jpg',
    publishedAt: '2026-11-17T10:30:00+05:30',
    updatedAt: '2026-11-20T12:00:00+05:30',
    readTime: { en: '13 minute guide', hi: '13 मिनट की मार्गदर्शिका' },
    title: {
      en: 'Section 118 in Himachal Pradesh: a due-diligence guide for land buyers',
      hi: 'हिमाचल प्रदेश में धारा 118: भूमि खरीदारों के लिए जाँच मार्गदर्शिका',
    },
    summary: {
      en: 'Who counts as an agriculturist, which transfers and exceptions Section 118 covers, how Form LR-XIV permission works, and the utilisation deadlines that can make land vest in the State.',
      hi: 'कृषक कौन है, धारा 118 किन हस्तांतरणों और अपवादों पर लागू होती है, फॉर्म LR-XIV से अनुमति कैसे मिलती है और उपयोग की समय-सीमा चूकने पर भूमि राज्य सरकार में कैसे निहित हो सकती है।',
    },
    intro: {
      en: 'Section 118 of the H.P. Tenancy and Land Reforms Act is frequently reduced to an unsafe slogan: outsiders cannot buy land in Himachal Pradesh. The law is more precise. The outcome depends on the statutory definition of agriculturist, the kind of transfer, the exceptions in sub-section (2), the property and the purpose for which permission is sought. The section bars a transfer of land in favour of a non-agriculturist, but it also contains exclusions and a permission route. Neither a broker’s reassurance nor a buyer’s residence certificate alone decides the question. This guide cites the Act and the Revenue Department’s compendium, which reproduces the section and Rules as amended up to 2012. An amendment Bill was pending at the last report we could find, so confirm the current text, and have a Himachal property lawyer review it together with the buyer’s evidence, before structuring the transaction.',
      hi: 'धारा 118 को अक्सर “बाहरी व्यक्ति हिमाचल में भूमि नहीं खरीद सकता” जैसे अधूरे वाक्य में समझाया जाता है। कानून इससे अधिक सटीक है। परिणाम कृषक की कानूनी परिभाषा, हस्तांतरण के प्रकार, उप-धारा (2) के अपवाद, संपत्ति और अनुमत उद्देश्य पर निर्भर करता है। धारा गैर-कृषक के पक्ष में भूमि हस्तांतरण पर रोक लगाती है, पर उसमें अपवाद और अनुमति का मार्ग भी है। दलाल का आश्वासन या केवल निवास प्रमाण पात्रता तय नहीं करता। यह मार्गदर्शिका अधिनियम और राजस्व विभाग के संकलन (2012 तक संशोधित धारा व नियम) पर आधारित है। हमारी जानकारी के अनुसार एक संशोधन विधेयक लंबित था, इसलिए लेन-देन तय करने से पहले वर्तमान पाठ की पुष्टि करें और खरीदार के दस्तावेज़ों के साथ किसी हिमाचली संपत्ति वकील से जाँच कराएँ।',
    },
    sections: [
      {
        title: {
          en: 'Identify the buyer’s legal status first: who is an “agriculturist”',
          hi: 'पहले खरीदार की कानूनी स्थिति तय करें: “कृषक” कौन है',
        },
        citation: {
          en: 'H.P. Tenancy and Land Reforms Act, 1972, sections 2(2), 2(4), 2(5) and 2(10); Revenue Department clarifications of 12 December 2011 and 2 July 2012',
          hi: 'हि.प्र. काश्तकारी एवं भूमि सुधार अधिनियम, 1972, धारा 2(2), 2(4), 2(5) और 2(10); राजस्व विभाग के स्पष्टीकरण दिनांक 12 दिसंबर 2011 और 2 जुलाई 2012',
        },
        body: {
          en: 'The first question is not the plot number; it is whether the proposed transferee is an agriculturist. Section 2(2), as amended in 1997, defines an agriculturist as a landowner who cultivates land personally in an estate situated in Himachal Pradesh. Section 2(4) says personal cultivation means cultivating on one’s own account, by one’s own labour, by the labour of a family member, or under the personal supervision of oneself or a family member using hired labour or servants paid wages in cash. In a joint family, cultivation by any member counts. Section 2(5) defines “family” to include a spouse, children, parents, grandparents, brothers and certain categories of sisters. Because section 2(10) treats a landowner’s predecessors and successors in interest as landowners, the Revenue Department has clarified that a Himachali woman whose parents are agriculturists remains one after marrying a non-agriculturist (her own successors do not inherit that status), and that people made landless by acquisition of their land are also covered. Residence, an Aadhaar address or farmland in another State does not satisfy the definition. Collect the buyer’s revenue records, ancestry or succession papers and any agriculturist certificate issued by the revenue authorities. Where a company, trust, society, partnership or several purchasers are involved, examine each proposed holder separately. Put the lawyer’s conclusion and the evidence behind it in writing before signing a binding agreement.',
          hi: 'पहला प्रश्न प्लॉट नंबर नहीं, बल्कि यह है कि प्रस्तावित खरीदार कृषक है या नहीं। 1997 के संशोधन के बाद धारा 2(2) के अनुसार कृषक वह भू-स्वामी है जो हिमाचल प्रदेश के किसी राजस्व गाँव (एस्टेट) में स्वयं भूमि जोतता है। धारा 2(4) के अनुसार “स्वयं जोतना” का अर्थ है अपने खाते से, अपने श्रम से, परिवार के सदस्य के श्रम से, या स्वयं/परिवार के सदस्य की व्यक्तिगत देखरेख में नकद मजदूरी पर रखे मजदूरों या नौकरों से खेती करना। संयुक्त परिवार में किसी भी सदस्य की खेती मान्य है। धारा 2(5) में “परिवार” में पति/पत्नी, बच्चे, माता-पिता, दादा-दादी, भाई और कुछ श्रेणियों की बहनें शामिल हैं। धारा 2(10) भू-स्वामी के पूर्ववर्ती और उत्तराधिकारी को भी भू-स्वामी मानती है; इसी आधार पर राजस्व विभाग ने स्पष्ट किया है कि जिस हिमाचली महिला के माता-पिता कृषक हैं, वह गैर-कृषक से विवाह के बाद भी कृषक रहती है (उसके अपने उत्तराधिकारियों को यह दर्जा नहीं मिलता), और जिनकी भूमि अधिग्रहण से चली गई है वे भी शामिल हैं। केवल निवास, आधार का पता या दूसरे राज्य की कृषि भूमि इस परिभाषा को पूरा नहीं करती। खरीदार के राजस्व रिकॉर्ड, वंश/उत्तराधिकार दस्तावेज़ और राजस्व अधिकारियों से जारी कृषक प्रमाणपत्र लें। कंपनी, ट्रस्ट, सोसाइटी, साझेदारी या कई खरीदार हों तो हर प्रस्तावित धारक की अलग जाँच करें। बाध्यकारी समझौते से पहले वकील का निष्कर्ष और उसका आधार लिखित में लें।',
        },
      },
      {
        title: {
          en: 'Check whether the transaction itself is covered',
          hi: 'हस्तांतरण का प्रकार जाँचें',
        },
        citation: {
          en: 'Section 118(1), Explanations I and II to section 118, and section 118(3)',
          hi: 'धारा 118(1), धारा 118 के स्पष्टीकरण I और II, तथा धारा 118(3)',
        },
        body: {
          en: 'Section 118(1) bars any transfer of land in favour of a non-agriculturist, whether by sale, gift, will, exchange, lease, mortgage with possession, creation of a tenancy or any other manner. It expressly includes transfers by a civil-court decree or for recovery of arrears of land revenue. The Explanation says three things are not treated as a “transfer”: inheritance; a gift made or will executed in favour of legal heirs of the donor or testator; and a lease of land or building in a municipal area. It also says two things are treated as transfers: a benami transaction in which land goes to an agriculturist for a price paid or provided by a non-agriculturist, and any general or special power of attorney, or agreement, meant to put a non-agriculturist in possession so that he can deal with the land as if he were the owner. For this section “land” also includes land recorded as Gair-mumkin and the site of a building in a town or village not used for agriculture, but not a built-up area in a municipal area (a Nagar Panchayat, Cantonment Board, Municipal Council or Municipal Corporation). Sub-section (3) bars registration of a document that contravenes sub-section (1), with limited provisos for leases of the whole or part of a building and for mortgages taken to raise construction or improvement loans from the Government or a recognised financial institution. An agreement dressed up as a long lease, power of attorney or company transfer is therefore exactly what the Explanation targets. Ask counsel to classify the instrument, identify the applicable clause and confirm whether permission or an exclusion is needed before possession or money changes hands.',
          hi: 'धारा 118(1) गैर-कृषक के पक्ष में भूमि के किसी भी हस्तांतरण पर रोक लगाती है, चाहे वह बिक्री, दान, वसीयत, विनिमय, पट्टा, कब्जे सहित बंधक, किरायेदारी सृजन या किसी अन्य तरीके से हो। इसमें दीवानी न्यायालय की डिक्री या भू-राजस्व बकाया की वसूली के लिए किया गया हस्तांतरण भी शामिल है। स्पष्टीकरण के अनुसार तीन बातें “हस्तांतरण” नहीं मानी जातीं: विरासत; दाता या वसीयतकर्ता के विधिक वारिसों के पक्ष में दान या वसीयत; और नगरीय क्षेत्र में भूमि या भवन का पट्टा। दो बातें हस्तांतरण मानी जाती हैं: बेनामी लेन-देन, जिसमें भूमि कृषक के नाम पर पर कीमत गैर-कृषक देता है, और ऐसी कोई सामान्य या विशेष मुख्तारनामा या करार जिसका उद्देश्य गैर-कृषक को कब्जा देकर उसे मालिक की तरह भूमि पर अधिकार देना है। इस धारा के लिए “भूमि” में गैर-मुमकिन दर्ज भूमि और नगर/गाँव में गैर-कृषि उपयोग वाली भवन-भूमि भी शामिल है, पर नगरीय क्षेत्र (नगर पंचायत, छावनी बोर्ड, नगर परिषद या नगर निगम) का निर्मित क्षेत्र नहीं। उप-धारा (3) के अनुसार उप-धारा (1) के विरुद्ध दस्तावेज़ का पंजीकरण नहीं हो सकता; अपवाद केवल भवन के पूरे या कुछ हिस्से के पट्टे और सरकार या मान्यता प्राप्त वित्तीय संस्था से निर्माण/सुधार हेतु ऋण के लिए बंधक के हैं। लंबी लीज, मुख्तारनामा या कंपनी हस्तांतरण के रूप में सजाया गया समझौता ठीक वही है जिसे स्पष्टीकरण पकड़ता है। कब्जा या पैसा देने से पहले वकील से दस्तावेज़ का वर्गीकरण कराएँ और पता करें कि अनुमति या अपवाद की आवश्यकता है या नहीं।',
        },
      },
      {
        title: {
          en: 'Know the statutory exceptions, and what each one still requires',
          hi: 'वैधानिक अपवाद जानें और हर एक की शेष शर्तें समझें',
        },
        citation: {
          en: 'Section 118(2)(a) to (h) and its provisos; section 5 of the Amendment Act 6 of 1988 (savings)',
          hi: 'धारा 118(2)(a) से (h) और उसके परंतुक; संशोधन अधिनियम संख्या 6 सन् 1988 की धारा 5 (व्यावृत्ति)',
        },
        body: {
          en: 'Section 118(2) lists the people and bodies in whose favour a transfer is not prohibited. The list below follows the Revenue Department’s compendium of the section as amended up to 2012, so check it against the current text. An exception is a legal route, not a substitute for paperwork: ask for the document that proves you fit it.',
          hi: 'धारा 118(2) उन व्यक्तियों और निकायों की सूची देती है जिनके पक्ष में हस्तांतरण निषिद्ध नहीं है। नीचे की सूची राजस्व विभाग के संकलन (2012 तक संशोधित धारा) पर आधारित है, इसलिए वर्तमान पाठ से मिलान करें। अपवाद एक कानूनी मार्ग है, कागज़ी कार्रवाई का विकल्प नहीं: उस श्रेणी में आने का प्रमाण-दस्तावेज़ माँगें।',
        },
        list: {
          en: [
            '(a) A landless labourer.',
            '(b) A landless person belonging to a Scheduled Caste or Scheduled Tribe.',
            '(c) A village artisan.',
            '(d) A landless person carrying on an allied pursuit (dairy farming, poultry, livestock breeding, grazing and similar pursuits under section 2(14)).',
            '(dd) A person who, at the commencement of the Act, worked and continues to work for gain in an estate in Himachal Pradesh, buying land in a municipal area to build a dwelling house (up to 500 square metres) or a shop or commercial establishment (up to 300 square metres), provided he owns no vacant land or dwelling house in any municipal area of the State.',
            '(e) The State or Central Government, a Government company, a company incorporated under the Companies Act, 1956 for which land is acquired through the State Government under the Land Acquisition Act, 1894, or a statutory body, corporation or board owned and controlled by either Government.',
            '(f) A person who became a non-agriculturist because his land was acquired for a public purpose under the Land Acquisition Act, 1894, or vested in tenants under the Act. The Revenue Department has directed that a certificate be issued for this clause, and the benefit extends to successors and predecessors in interest.',
            '(g) A non-agriculturist buying land to build a house or shop, or buying a built-up house or shop, from the Himachal Pradesh Housing and Urban Development Authority (HIMUDA), a Development Authority under the Town and Country Planning Act, 1977, or another statutory housing corporation.',
            '(h) A non-agriculturist with the State Government’s permission for a prescribed purpose (covered in the next two sections).',
          ],
          hi: [
            '(a) भूमिहीन मजदूर।',
            '(b) अनुसूचित जाति या अनुसूचित जनजाति का भूमिहीन व्यक्ति।',
            '(c) ग्रामीण कारीगर।',
            '(d) संबद्ध व्यवसाय (डेयरी, मुर्गी पालन, पशु-प्रजनन, चराई आदि, धारा 2(14)) करने वाला भूमिहीन व्यक्ति।',
            '(dd) जो व्यक्ति अधिनियम के प्रारंभ पर हिमाचल प्रदेश के किसी एस्टेट में लाभ के लिए कार्यरत था और अब भी है, और नगरीय क्षेत्र में आवासीय मकान (अधिकतम 500 वर्ग मीटर) या दुकान/वाणिज्यिक प्रतिष्ठान (अधिकतम 300 वर्ग मीटर) के लिए भूमि ले रहा है, बशर्ते प्रदेश के किसी नगरीय क्षेत्र में उसके पास खाली भूमि या आवासीय मकान न हो।',
            '(e) राज्य या केंद्र सरकार, सरकारी कंपनी, कंपनी अधिनियम, 1956 के अंतर्गत पंजीकृत वह कंपनी जिसके लिए भूमि भूमि अधिग्रहण अधिनियम, 1894 के तहत राज्य सरकार ने अधिगृहीत की हो, या राज्य/केंद्र सरकार के स्वामित्व व नियंत्रण वाला सांविधिक निकाय, निगम या बोर्ड।',
            '(f) वह व्यक्ति जो भूमि अधिग्रहण अधिनियम, 1894 के तहत सार्वजनिक प्रयोजन के लिए भूमि अधिग्रहण से, या अधिनियम के तहत भूमि के काश्तकारों में निहित होने से गैर-कृषक हो गया है। राजस्व विभाग ने इस खंड के लिए प्रमाणपत्र जारी करने के निर्देश दिए हैं, और लाभ पूर्ववर्ती व उत्तराधिकारी को भी मिलता है।',
            '(g) गैर-कृषक जो हिमाचल प्रदेश आवास एवं शहरी विकास प्राधिकरण (हिमुडा), नगर एवं ग्राम योजना अधिनियम, 1977 के तहत विकास प्राधिकरण या किसी अन्य सांविधिक आवास निगम से मकान या दुकान के निर्माण के लिए भूमि या बना-बनाया मकान/दुकान खरीदता है।',
            '(h) राज्य सरकार की अनुमति से गैर-कृषक, निर्धारित प्रयोजनों के लिए (अगले दो अनुभागों में विवरण)।',
          ],
        },
        note: {
          en: 'Cautions. A buyer under clause (dd), (g) or (h) stays a non-agriculturist for the purposes of the Act, so any later transfer needs fresh scrutiny. Clauses (dd) and (h) also carry a utilisation condition with a forfeiture consequence. The Explanation to sub-section (1) separately excludes inheritance, gifts or wills to legal heirs and leases in municipal areas from the meaning of “transfer”. Transfers made before the 1988 amendment within municipal limits for houses, shops, offices or industrial units are protected by a savings clause. Do not rely on a broker’s label: obtain the certificate, allotment letter or order that proves the exception.',
          hi: 'सावधानियाँ। खंड (dd), (g) या (h) के अंतर्गत खरीदने वाला अधिनियम के प्रयोजन के लिए गैर-कृषक ही रहता है, इसलिए आगे के हर हस्तांतरण की नई जाँच चाहिए। खंड (dd) और (h) में उपयोग की शर्त भी है जिसका उल्लंघन होने पर भूमि राज्य में निहित हो सकती है। उप-धारा (1) का स्पष्टीकरण अलग से विरासत, विधिक वारिसों को दान/वसीयत और नगरीय क्षेत्र के पट्टे को “हस्तांतरण” से बाहर रखता है। 1988 के संशोधन से पहले नगरीय सीमा में मकान, दुकान, कार्यालय या औद्योगिक इकाई के लिए हुए हस्तांतरण व्यावृत्ति खंड से सुरक्षित हैं। दलाल के कथन पर निर्भर न रहें: अपवाद सिद्ध करने वाला प्रमाणपत्र, आवंटन पत्र या आदेश प्राप्त करें।',
        },
      },
      {
        title: {
          en: 'How the permission process works (Rule 38-A and Form LR-XIV)',
          hi: 'अनुमति प्रक्रिया कैसे चलती है (नियम 38-A और फॉर्म LR-XIV)',
        },
        citation: {
          en: 'Section 118(2)(h); Rule 38-A, H.P. Tenancy and Land Reforms Rules, 1975; Revenue Department letters of 22 September 2011 and 30 July 2012',
          hi: 'धारा 118(2)(h); नियम 38-A, हि.प्र. काश्तकारी एवं भूमि सुधार नियम, 1975; राजस्व विभाग के पत्र दिनांक 22 सितंबर 2011 और 30 जुलाई 2012',
        },
        body: {
          en: 'A non-agriculturist who wants to acquire land by sale, gift, will, exchange, lease or mortgage with possession applies on Form LR-XIV to the Collector (Deputy Commissioner) of the district where the land lies. The Collector checks that the application and documents are complete, returns it once with all objections stated together if they are not, and otherwise recommends it to the State Government. The Rules prescribe 30 days for the Collector’s recommendation and 30 days for the State Government to allow or reject the application, but real processing can take longer, so do not build a closing date around them. A rejected applicant may seek review within 60 days of the order. The Revenue Department’s instructions treat six situations as part of this machinery: an application to buy for a purpose listed in the Rules; permission to sell land bought with permission; permission for a non-agriculturist to buy from such a seller; change of purpose; extension of the utilisation period; and extension of the period for registering the sale deed. The State began an online module for Section 118 permissions in 2019, starting with Mandi district. Confirm with the Deputy Commissioner’s office which route your district accepts before relying on online submission. The documents below are those listed in Part II of Form LR-XIV.',
          hi: 'जो गैर-कृषक बिक्री, दान, वसीयत, विनिमय, पट्टे या कब्जे सहित बंधक से भूमि लेना चाहता है, वह भूमि जिस जिले में है उसके कलेक्टर (उपायुक्त) को फॉर्म LR-XIV पर आवेदन करता है। कलेक्टर आवेदन और दस्तावेज़ों की पूर्णता जाँचता है; कमी हो तो सभी आपत्तियाँ एक साथ बताकर आवेदन लौटा देता है, अन्यथा राज्य सरकार को अनुशंसा भेजता है। नियमों में कलेक्टर की अनुशंसा के लिए 30 दिन और राज्य सरकार के निर्णय के लिए 30 दिन निर्धारित हैं, पर वास्तविक समय अधिक लग सकता है, इसलिए सौदे की तिथि इन पर आधारित न करें। अस्वीकृति के आदेश से 60 दिन के भीतर पुनर्विचार का आवेदन किया जा सकता है। राजस्व विभाग के निर्देश छह स्थितियों को इसी प्रक्रिया में रखते हैं: नियमों में सूचीबद्ध प्रयोजन के लिए खरीद का आवेदन; अनुमति से खरीदी भूमि बेचने की अनुमति; ऐसे विक्रेता से गैर-कृषक द्वारा खरीदने की अनुमति; प्रयोजन में बदलाव; उपयोग की अवधि में विस्तार; और बिक्री विलेख के पंजीकरण की अवधि में विस्तार। राज्य ने 2019 में मंडी जिले से धारा 118 अनुमतियों का ऑनलाइन मॉड्यूल शुरू किया था। ऑनलाइन आवेदन पर निर्भर होने से पहले उपायुक्त कार्यालय से पता करें कि आपके जिले में कौन-सा मार्ग मान्य है। नीचे फॉर्म LR-XIV के भाग-II में सूचीबद्ध दस्तावेज़ हैं।',
        },
        list: {
          en: [
            'Latest Jamabandi and Tatima (shajra) of the land.',
            'A copy of the agreement between the transferor and the transferee.',
            'A declaration by the transferor that he will not become landless after the transfer and will not claim benefits under schemes for the landless. Since July 2012 a self-attested declaration with a photo-ID copy is accepted instead of an affidavit.',
            'Where one Khasra or part of it is transferred out of a joint holding, a no-objection from all co-sharers and tenants. This is not needed when a share in the entire holding is transferred.',
            'Proof that the applicant is eligible for the chosen purpose, such as a certificate from a revenue officer or, for most commercial purposes, an Essentiality Certificate from the department concerned.',
            'For a resale of land bought under Section 118, proof that the land was used for the permitted purpose within the allowed period.',
          ],
          hi: [
            'भूमि की नवीनतम जमाबंदी और ततीमा (शजरा)।',
            'हस्तांतरणकर्ता और हस्तांतरिती के बीच हुए करार की प्रति।',
            'हस्तांतरणकर्ता की घोषणा कि हस्तांतरण के बाद वह भूमिहीन नहीं होगा और भूमिहीनों की योजनाओं का लाभ नहीं माँगेगा। जुलाई 2012 से शपथ-पत्र के स्थान पर फोटो पहचान-पत्र की प्रति सहित स्व-सत्यापित घोषणा स्वीकार्य है।',
            'संयुक्त जोत में से कोई खसरा या उसका भाग हस्तांतरित हो तो सभी सह-हिस्सेदारों और काश्तकारों की अनापत्ति। पूरी जोत में हिस्सा हस्तांतरित हो तो यह आवश्यक नहीं।',
            'चुने गए प्रयोजन के लिए आवेदक की पात्रता का प्रमाण, जैसे राजस्व अधिकारी का प्रमाणपत्र या अधिकांश वाणिज्यिक प्रयोजनों के लिए संबंधित विभाग का आवश्यकता प्रमाणपत्र (Essentiality Certificate)।',
            'धारा 118 के तहत खरीदी भूमि के पुनर्विक्रय पर, अनुमत अवधि में उस प्रयोजन के लिए उपयोग का प्रमाण।',
          ],
        },
        link: {
          href: 'https://emerginghimachal.hp.gov.in/',
          label: {
            en: 'Himachal Pradesh Single Window portal (Essentiality Certificates)',
            hi: 'हिमाचल प्रदेश सिंगल विंडो पोर्टल (आवश्यकता प्रमाणपत्र)',
          },
        },
      },
      {
        title: {
          en: 'Permission must match the land and purpose',
          hi: 'अनुमति भूमि और उद्देश्य से मेल खाए',
        },
        citation: {
          en: 'Rule 38-A(3), H.P. Tenancy and Land Reforms Rules, 1975 (as reproduced in the Revenue Department compendium, amended up to 2012)',
          hi: 'नियम 38-A(3), हि.प्र. काश्तकारी एवं भूमि सुधार नियम, 1975 (राजस्व विभाग के संकलन के अनुसार, 2012 तक संशोधित)',
        },
        body: {
          en: 'A Section 118 permission is not a reusable licence to buy any property. Rule 38-A(3) allows permission only for listed purposes and within stated area limits, and it ties each purpose to who may qualify. Verify the applicant, seller, Khasra numbers, area, village, purpose and every condition in the actual order. If the permission was obtained for a residence, industry or tourism project, confirm that the present deed and intended development stay within it. A mismatch should be cleared by the issuing authority in writing, not explained orally by an intermediary. The purposes and limits below are as reproduced in the compendium, so check the current Rule 38-A.',
          hi: 'धारा 118 की अनुमति किसी भी संपत्ति को खरीदने का दोबारा उपयोग होने वाला लाइसेंस नहीं है। नियम 38-A(3) केवल सूचीबद्ध प्रयोजनों और निर्धारित क्षेत्रफल सीमा के भीतर अनुमति देता है और हर प्रयोजन को पात्र व्यक्तियों से जोड़ता है। आदेश में खरीदार, विक्रेता, खसरा, क्षेत्रफल, गाँव, उद्देश्य और सभी शर्तें मिलाएँ। आवास, उद्योग या पर्यटन परियोजना के लिए मिली अनुमति हो तो देखें कि वर्तमान डीड और प्रस्तावित विकास उसी दायरे में रहें। असंगति जारी करने वाले प्राधिकरण से लिखित में दूर कराएँ, बिचौलिए के मौखिक स्पष्टीकरण से नहीं। नीचे के प्रयोजन और सीमाएँ संकलन के अनुसार हैं; वर्तमान नियम 38-A से मिलान करें।',
        },
        list: {
          en: [
            'Agriculture or horticulture: up to 4 acres, rural area only. The transferor must not become landless or houseless, and an Essentiality Certificate from the department concerned is needed.',
            'Residential house: 150 to 500 square metres. Eligible categories include those who worked in the State for gain since the Act began, those who have worked in the State for more than 30 years with the local body’s recommendation, employees with a bona fide Himachali certificate, Padma or gallantry award winners, and other eminent persons recommended by a committee of Principal Secretaries. The Deputy Commissioner recommends.',
            'Built-up residential building or part of one: up to 500 square metres. Any Indian citizen, an OCI or a legal entity registered in India may buy, and the seller must be registered with the Town and Country Planning Department where it has not already issued an NOC or approval.',
            'Shop: 150 to 300 square metres, for the same categories of worker as the residential house, on the Deputy Commissioner’s recommendation.',
            'Industrial, religious, tourism, apartment, hydel, BT or IT projects: area as certified by the department concerned, with an Essentiality Certificate.',
            'Socially useful activities such as old-age homes, gaushalas, health facilities, orphanages, and education or sports facilities: area as certified by the department, with an Essentiality Certificate.',
            'Public-use facilities normally run for profit, such as shopping malls, office complexes, garages, cold stores, service stations and petrol pumps: area as certified by the department, with an Essentiality Certificate.',
          ],
          hi: [
            'कृषि या बागवानी: अधिकतम 4 एकड़, केवल ग्रामीण क्षेत्र में। हस्तांतरणकर्ता भूमिहीन या बेघर न हो और संबंधित विभाग का आवश्यकता प्रमाणपत्र चाहिए।',
            'आवासीय मकान: 150 से 500 वर्ग मीटर। पात्र श्रेणियों में अधिनियम के प्रारंभ से प्रदेश में लाभ के लिए कार्यरत व्यक्ति, स्थानीय निकाय की सिफारिश पर 30 वर्ष से अधिक समय से प्रदेश में कार्यरत व्यक्ति, बोनाफाइड हिमाचली प्रमाणपत्र वाले कर्मचारी, पद्म या वीरता पुरस्कार विजेता, और प्रधान सचिवों की समिति द्वारा अनुशंसित अन्य प्रतिष्ठित व्यक्ति शामिल हैं। उपायुक्त अनुशंसा करता है।',
            'बना-बनाया आवासीय भवन या उसका भाग: अधिकतम 500 वर्ग मीटर। कोई भी भारतीय नागरिक, ओसीआई या भारत में पंजीकृत विधिक इकाई खरीद सकती है, और जहाँ नगर एवं ग्राम योजना विभाग ने एनओसी/स्वीकृति न दी हो वहाँ विक्रेता का उस विभाग में पंजीकृत होना आवश्यक है।',
            'दुकान: 150 से 300 वर्ग मीटर, आवासीय मकान जैसी ही कार्यरत श्रेणियों के लिए, उपायुक्त की अनुशंसा पर।',
            'औद्योगिक, धार्मिक, पर्यटन, अपार्टमेंट, जल-विद्युत, बीटी या आईटी परियोजनाएँ: संबंधित विभाग द्वारा प्रमाणित क्षेत्रफल, आवश्यकता प्रमाणपत्र सहित।',
            'सामाजिक रूप से उपयोगी गतिविधियाँ, जैसे वृद्धाश्रम, गौसदन, स्वास्थ्य सुविधाएँ, अनाथालय, शिक्षा या खेल सुविधाएँ: विभाग द्वारा प्रमाणित क्षेत्रफल, आवश्यकता प्रमाणपत्र सहित।',
            'सामान्यतः लाभ के लिए चलने वाली सार्वजनिक उपयोग की सुविधाएँ, जैसे शॉपिंग मॉल, कार्यालय परिसर, गैराज, कोल्ड स्टोर, सर्विस स्टेशन और पेट्रोल पंप: विभाग द्वारा प्रमाणित क्षेत्रफल, आवश्यकता प्रमाणपत्र सहित।',
          ],
        },
      },
      {
        title: {
          en: 'Permission conditions and utilisation deadlines',
          hi: 'अनुमति की शर्तें और उपयोग की समय-सीमा',
        },
        citation: {
          en: 'Section 118(2), proviso; Rule 38-A(3), provisos; Revenue Department instructions of 22 September 2011 and 15 March 2012',
          hi: 'धारा 118(2), परंतुक; नियम 38-A(3), परंतुक; राजस्व विभाग के निर्देश दिनांक 22 सितंबर 2011 और 15 मार्च 2012',
        },
        body: {
          en: 'Permission comes with clocks. Under Rule 38-A the permission itself is valid for one year from the date of the State Government’s order, which the Government may extend for reasons recorded in writing, so the sale deed must be registered inside that window or an extension sought. Once the deed is registered, the buyer must put the land to the permitted use within two years, extendable by up to one more year by the State Government for reasons recorded in writing. If the buyer fails to do so, diverts the land to another use without permission, or sells or gifts it without permission, the land vests in the State Government free of all encumbrances in the prescribed manner. The March 2012 instructions soften the practical edges. Permission to sell or change the purpose is ordinarily granted if sought within the period, if the land has been used as intended, or if it has been partly used, for example when a structure is partly or fully built. Where nothing was done despite bona fide efforts, the time spent obtaining essential statutory approvals can be excluded, but only after the department concerned records the facts in a speaking order and forwards the case through the Deputy Commissioner.',
          hi: 'अनुमति के साथ समय-सीमाएँ जुड़ी होती हैं। नियम 38-A के अनुसार अनुमति स्वयं राज्य सरकार के आदेश की तिथि से एक वर्ष के लिए वैध है, जिसे सरकार लिखित कारण दर्ज कर बढ़ा सकती है; इसलिए बिक्री विलेख उसी अवधि में पंजीकृत होना चाहिए या विस्तार माँगना चाहिए। विलेख पंजीकृत होने के बाद खरीदार को दो वर्ष के भीतर भूमि को अनुमत प्रयोजन में लगाना होता है, जिसे राज्य सरकार लिखित कारण दर्ज कर अधिकतम एक वर्ष और बढ़ा सकती है। ऐसा न करने, बिना अनुमति किसी अन्य उपयोग में बदलने, या बिना अनुमति बेचने/दान करने पर भूमि निर्धारित तरीके से सभी भारों से मुक्त होकर राज्य सरकार में निहित हो जाती है। मार्च 2012 के निर्देश व्यावहारिक कठोरता घटाते हैं। अवधि के भीतर माँगने पर, भूमि का इच्छित उपयोग हो चुका हो तो, या आंशिक उपयोग हुआ हो (जैसे संरचना आंशिक या पूर्ण बनी हो) तो बेचने या प्रयोजन बदलने की अनुमति सामान्यतः दी जाती है। सद्भावनापूर्ण प्रयास के बावजूद कुछ न हो सका हो तो आवश्यक सांविधिक स्वीकृतियाँ लेने में लगा समय अवधि से बाहर रखा जा सकता है, पर तभी जब संबंधित विभाग तथ्य दर्ज कर तर्कसंगत आदेश पारित करे और मामला उपायुक्त के माध्यम से भेजे।',
        },
        list: {
          en: [
            'The date of the permission order and its one-year validity for registering the deed.',
            'The date of registration, from which the two-year utilisation period runs, plus any one-year extension.',
            'The exact permitted purpose and area. Any change of purpose needs the State Government’s permission first.',
            'Resale needs permission. The application carries the original permission and any extension letter or, after the period has run, a utilisation certificate from the department, local body or revenue officer.',
            'A later non-agriculturist buyer needs his own permission on Form LR-XIV. Where the purpose is unchanged, the department’s recommendation can replace a fresh Essentiality Certificate.',
          ],
          hi: [
            'अनुमति आदेश की तिथि और विलेख के पंजीकरण के लिए उसकी एक वर्ष की वैधता।',
            'पंजीकरण की तिथि, जिससे दो वर्ष की उपयोग अवधि और कोई एक वर्ष का विस्तार गिना जाता है।',
            'अनुमत प्रयोजन और क्षेत्रफल की ठीक-ठीक जानकारी। प्रयोजन बदलने से पहले राज्य सरकार की अनुमति चाहिए।',
            'पुनर्विक्रय के लिए अनुमति चाहिए। आवेदन के साथ मूल अनुमति और विस्तार पत्र (यदि हो), या अवधि बीत जाने पर विभाग, स्थानीय निकाय या राजस्व अधिकारी का उपयोग प्रमाणपत्र लगता है।',
            'बाद के गैर-कृषक खरीदार को फॉर्म LR-XIV पर अपनी अनुमति लेनी होती है। प्रयोजन वही हो तो नए आवश्यकता प्रमाणपत्र के स्थान पर विभाग की अनुशंसा पर्याप्त हो सकती है।',
          ],
        },
        note: {
          en: 'A 2025 amendment Bill proposes letting investors seek extra utilisation time on payment of a prescribed penalty. Unless and until it becomes law, plan around the two-plus-one-year rule and confirm the current position before relying on any extension.',
          hi: '2025 का एक संशोधन विधेयक निवेशकों को निर्धारित जुर्माना देकर उपयोग के लिए अतिरिक्त समय माँगने की अनुमति देने का प्रस्ताव करता है। जब तक यह कानून नहीं बन जाता, दो-जमा-एक वर्ष के नियम के आधार पर योजना बनाएँ और किसी विस्तार पर भरोसा करने से पहले वर्तमान स्थिति की पुष्टि करें।',
        },
      },
      {
        title: {
          en: 'Sequence the agreement, permission and payment',
          hi: 'समझौता, अनुमति और भुगतान का क्रम तय करें',
        },
        body: {
          en: 'The commercial documents should anticipate that permission may take time, be conditional or be refused. A carefully drafted agreement can make the transaction subject to permission, define who prepares the application, require the seller’s cooperation and establish a clear refund mechanism if approval is not obtained. Avoid large non-refundable token payments based on a promise that permission is routine. Do not take informal possession or begin construction while eligibility and approval remain unresolved. Also diarise the one-year validity of the permission for registering the deed and the utilisation clock that starts on registration. Payment milestones should follow verified legal milestones, not the pressure of a broker’s closing date.',
          hi: 'अनुमति में समय लग सकता है, शर्त लग सकती है या आवेदन अस्वीकृत हो सकता है। समझौते में अनुमति को पूर्व शर्त, आवेदन की जिम्मेदारी, विक्रेता का सहयोग और अस्वीकृति पर स्पष्ट धनवापसी लिखें। “अनुमति सामान्य प्रक्रिया है” कहकर बड़ी गैर-वापसी योग्य टोकन राशि न दें। पात्रता और अनुमति तय होने तक अनौपचारिक कब्जा या निर्माण शुरू न करें। विलेख के पंजीकरण के लिए अनुमति की एक वर्ष की वैधता और पंजीकरण से शुरू होने वाली उपयोग-अवधि की तिथियाँ डायरी में दर्ज करें। भुगतान के चरण सत्यापित कानूनी चरणों के अनुसार हों, दलाल की समय-सीमा के दबाव के अनुसार नहीं।',
        },
      },
      {
        title: {
          en: 'Verify the permission, and the current law, independently',
          hi: 'अनुमति और वर्तमान कानून को स्वतंत्र रूप से सत्यापित करें',
        },
        body: {
          en: 'A photocopy, WhatsApp image or application receipt is not the final verification. Obtain the signed order and annexures, check the file and dispatch references, and confirm authenticity and current status with the issuing Revenue authority. Read the conditions on registration, construction, commencement, utilisation, transfer and reporting. Compare the permission’s land schedule word for word with the latest Jamabandi, Tatima and draft deed. If the seller previously acquired the property under Section 118, inspect that earlier permission and the proof of utilisation as well. Keep certified copies in the closing file and make sure the registered deed recites the correct permission particulars.',
          hi: 'फोटो कॉपी, व्हाट्सऐप चित्र या आवेदन रसीद अंतिम सत्यापन नहीं। हस्ताक्षरित आदेश और संलग्नक लें, फाइल/डिस्पैच संदर्भ मिलाएँ और जारी करने वाले राजस्व प्राधिकरण से प्रामाणिकता और वर्तमान स्थिति की पुष्टि करें। पंजीकरण, निर्माण, प्रारंभ, उपयोग, हस्तांतरण और रिपोर्टिंग की शर्तें पढ़ें। अनुमति की भूमि अनुसूची को नवीनतम जमाबंदी, ततीमा और ड्राफ्ट डीड से शब्दशः मिलाएँ। विक्रेता ने पहले धारा 118 के तहत संपत्ति ली हो तो वह पुरानी अनुमति और उपयोग का प्रमाण भी देखें। प्रमाणित प्रतियाँ सौदे की फाइल में रखें और सुनिश्चित करें कि पंजीकृत विलेख में अनुमति का सही विवरण दर्ज हो।',
        },
        note: {
          en: 'Check the law as it stands today. The statutory text above follows the compendium current to 2012. In December 2025 the Assembly referred the Tenancy and Land Reforms (Amendment) Bill, 2025 to a Select Committee. As introduced, it proposed building leases of up to 10 years in rural areas without permission, extending the HIMUDA exemption to later purchasers, exempting agriculturist-only co-operative societies, and extra utilisation time against a penalty. We could not confirm its final outcome, so verify with the Revenue Department or a Himachal property lawyer whether any of it has become law.',
          hi: 'आज की स्थिति में कानून जाँचें। ऊपर का सांविधिक पाठ 2012 तक के संकलन पर आधारित है। दिसंबर 2025 में विधानसभा ने काश्तकारी एवं भूमि सुधार (संशोधन) विधेयक, 2025 को प्रवर समिति को भेजा। प्रस्तुत रूप में उसमें ग्रामीण क्षेत्र में 10 वर्ष तक के भवन पट्टे बिना अनुमति के, हिमुडा अपवाद को बाद के खरीदारों तक, केवल कृषकों की सहकारी समितियों को छूट, और जुर्माने के साथ उपयोग के लिए अतिरिक्त समय देने के प्रस्ताव थे। हम इसका अंतिम परिणाम पुष्ट नहीं कर सके, इसलिए राजस्व विभाग या हिमाचली संपत्ति वकील से पता करें कि इनमें से कुछ कानून बना है या नहीं।',
        },
      },
      {
        title: {
          en: 'What happens if the transfer breaks Section 118',
          hi: 'धारा 118 का उल्लंघन होने पर क्या होता है',
        },
        citation: {
          en: 'Section 118(3), (3-A) to (3-D) and (4); Rule 38-B',
          hi: 'धारा 118(3), (3-A) से (3-D) और (4); नियम 38-B',
        },
        body: {
          en: 'The Registrar or Sub-Registrar may not register a document that contravenes sub-section (1). If one is presented, or if a Revenue Officer learns of a transfer made or proposed in contravention, the matter goes to the District Collector. The Collector must hear the parties, hold an inquiry and decide, ordinarily within six months. An aggrieved person can appeal to the Divisional Commissioner within 30 days, whose order is final, and the Financial Commissioner has revisional powers. A transfer finally held to be in contravention is void from the start, and the land together with structures, buildings and other attachments vests in the State Government free of all encumbrances. A buyer can therefore lose both the land and the money paid, which is why eligibility and permission must be settled before payment, not “corrected later” after registration.',
          hi: 'रजिस्ट्रार या उप-रजिस्ट्रार उप-धारा (1) के विरुद्ध किसी दस्तावेज़ का पंजीकरण नहीं कर सकता। ऐसा दस्तावेज़ प्रस्तुत हो, या राजस्व अधिकारी को उल्लंघन में हुए या प्रस्तावित हस्तांतरण की जानकारी मिले, तो मामला जिला कलेक्टर को जाता है। कलेक्टर को पक्षों को सुनकर जाँच करनी और सामान्यतः छह माह में निर्णय देना होता है। पीड़ित व्यक्ति 30 दिन के भीतर संभागीय आयुक्त के पास अपील कर सकता है, जिसका आदेश अंतिम है, और वित्तायुक्त के पास पुनरीक्षण की शक्ति है। जिस हस्तांतरण को अंततः उल्लंघन माना जाए वह प्रारंभ से ही शून्य होता है और भूमि, संरचनाओं, भवनों तथा अन्य जुड़ी वस्तुओं सहित सभी भारों से मुक्त होकर राज्य सरकार में निहित हो जाती है। इसलिए खरीदार भूमि और दिया हुआ धन दोनों खो सकता है; पात्रता और अनुमति भुगतान से पहले तय हों, पंजीकरण के बाद “बाद में ठीक करने” के भरोसे नहीं।',
        },
      },
      {
        title: {
          en: 'Section 118 is only one layer',
          hi: 'धारा 118 केवल एक परत है',
        },
        body: {
          en: 'Permission does not certify good title, erase a mortgage, settle a boundary or approve construction. Complete the ordinary title chain, mutation, encumbrance, litigation, map, access, land-use and planning checks in parallel. Confirm that the seller owns the stated share and that the permission describes the same parcel. If a bank, court, co-owner, tenant or government department has a competing interest, Section 118 approval does not remove it. Likewise, registration does not prove that every utilisation condition was later fulfilled. Create a post-registration compliance calendar and retain evidence of use, construction approvals and any reports required by the order.',
          hi: 'अनुमति अच्छा टाइटल प्रमाणित नहीं करती, बंधक समाप्त नहीं करती, सीमा तय नहीं करती और निर्माण स्वीकृति नहीं देती। टाइटल कड़ी, इंतकाल, भार, मुकदमा, नक्शा, रास्ता, भूमि उपयोग और नियोजन जाँच साथ-साथ करें। पुष्टि करें कि विक्रेता का बताया हिस्सा उसी का है और अनुमति उसी भूखंड का वर्णन करती है। बैंक, न्यायालय, सह-मालिक, काश्तकार या सरकारी विभाग का प्रतिस्पर्धी हित हो तो धारा 118 की अनुमति उसे नहीं हटाती। इसी तरह पंजीकरण यह सिद्ध नहीं करता कि बाद में हर उपयोग-शर्त पूरी हुई। पंजीकरण के बाद का अनुपालन कैलेंडर बनाएँ और उपयोग, निर्माण स्वीकृतियों तथा आदेश में माँगी गई रिपोर्टों के प्रमाण रखें।',
        },
      },
    ],
    takeaway: {
      en: 'Treat Section 118 as a transaction-specific legal gateway, not a checkbox. Establish whether the buyer is an agriculturist, classify the transfer, test it against the statutory exceptions, apply on Form LR-XIV where none applies, match the order to the land and purpose, and diarise the one-year registration window and the two-year utilisation deadline. Because an amendment Bill was pending at the last report we could find, rely on the current official text and transaction-specific legal advice at the time of purchase.',
      hi: 'धारा 118 को सामान्य चेकबॉक्स नहीं, बल्कि विशेष लेन-देन की कानूनी शर्त मानें। तय करें कि खरीदार कृषक है या नहीं, हस्तांतरण का वर्गीकरण करें, उसे वैधानिक अपवादों पर परखें, कोई अपवाद लागू न हो तो फॉर्म LR-XIV पर आवेदन करें, आदेश को भूमि और उद्देश्य से मिलाएँ, और एक वर्ष की पंजीकरण अवधि तथा दो वर्ष की उपयोग-समय सीमा डायरी में दर्ज करें। हमारी जानकारी के अनुसार एक संशोधन विधेयक लंबित था, इसलिए खरीद के समय वर्तमान आधिकारिक पाठ और विशेष कानूनी सलाह पर भरोसा करें।',
    },
    sources: [
      { label: 'H.P. Tenancy and Land Reforms Act, 1972', url: 'https://emerginghimachal.hp.gov.in/themes/backend/uploads/landreformAct1972.pdf' },
      { label: 'Government Section 118 compendium (section, Rules and instructions up to 2012)', url: 'https://himachal.nic.in/WriteReadData/l892s/13_l892s/3618435Section118-Compendium.pdf' },
      { label: 'H.P. Tenancy and Land Reforms (Amendment) Bill, 2025 (PRS Legislative Research)', url: 'https://prsindia.org/files/bills_acts/bills_states/himachal-pradesh/2025/Bill25of2025HP.pdf' },
      { label: 'Himachal Pradesh Single Window portal', url: 'https://emerginghimachal.hp.gov.in/' },
    ],
  },
  {
    slug: 'tatima-plot-map-boundary-access-check',
    image: '/images/himachal-concept-hero.webp',
    publishedAt: '2026-11-17T11:00:00+05:30',
    readTime: { en: '8 minute guide', hi: '8 मिनट की मार्गदर्शिका' },
    title: { en: 'Tatima and plot maps: how to verify boundary, area and legal access', hi: 'ततीमा और प्लॉट नक्शा: सीमा, क्षेत्रफल और कानूनी रास्ता कैसे जाँचें' },
    summary: { en: 'A map-to-ground workflow for checking whether the land shown by a seller is the same parcel described in the revenue record.', hi: 'विक्रेता द्वारा दिखाई भूमि और राजस्व रिकॉर्ड के भूखंड को मिलाने की नक्शा-से-मौका जाँच प्रक्रिया।' },
    intro: { en: 'A buyer can verify the correct owner and still purchase the wrong patch of ground. In hill property transactions, the approach road, slope, retaining walls, neighbouring cultivation and informal footpaths can make a site appear different from its cadastral parcel. A Tatima or plot extract helps place the Khasra among neighbouring plots, while BhuNaksha can provide a useful digital view where mapping has been completed. The Himachal Revenue Department cautions that digitisation is still underway and online map availability varies by tehsil. A screen image is therefore a research tool, not a substitute for a current official extract, lawful demarcation and an access review.', hi: 'सही मालिक की जाँच के बाद भी खरीदार जमीन का गलत हिस्सा खरीद सकता है। पहाड़ी क्षेत्रों में सड़क, ढलान, दीवार, पड़ोसी खेती और पगडंडी भूखंड को नक्शे से अलग दिखा सकते हैं। ततीमा खसरे को पड़ोसी भूखंडों के बीच रखता है और जहाँ डिजिटाइजेशन हुआ है वहाँ भू-नक्शा उपयोगी है। पर ऑनलाइन चित्र आधिकारिक प्रति, निशानदेही और रास्ते की कानूनी जाँच का विकल्प नहीं।' },
    sections: [
      { title: { en: 'Match the administrative identity', hi: 'प्रशासनिक पहचान मिलाएँ' }, body: { en: 'Begin with district, tehsil, revenue village, Hadbast number, Jamabandi year and Khasra number. Do not search by plot number alone. The map and record must refer to the same estate and numbering system, particularly where settlement or consolidation created old and new numbers. Copy the identifiers from the proposed deed and retrieve them independently. If the deed uses several Khasras, create a schedule showing each number, recorded area and map location. Where the seller offers only part of a Khasra, ask for the sanctioned subdivision and mutation that created a separately transferable parcel. A hand-drawn line on a printout is not that record.', hi: 'जिला, तहसील, राजस्व गाँव, हदबस्त, जमाबंदी वर्ष और खसरा नंबर से शुरुआत करें। केवल प्लॉट नंबर से खोज न करें। पुराने और नए नंबर होने पर दोनों की कड़ी लें। कई खसरों की सूची बनाएँ और आंशिक खसरे के लिए स्वीकृत उप-विभाजन व इंतकाल माँगें।' } },
      { title: { en: 'Read neighbours, shape and orientation', hi: 'पड़ोसी, आकार और दिशा पढ़ें' }, body: { en: 'A cadastral map is most useful as a relationship map. Identify every adjoining Khasra, public feature, water channel and path shown around the target. Compare the parcel’s shape and orientation with the site, but remember that a north arrow, scale and scanned image quality may limit direct measurement. Satellite imagery can help orientation, yet visible fences and roofs do not establish legal boundaries. Ask why a neighbour appears to occupy a corner or why a wall cuts across the mapped shape. Photograph stable site features and mark them on a working copy for the revenue official or survey professional. The objective is to generate precise questions before demarcation, not to conduct a do-it-yourself survey.', hi: 'ततीमा में लक्ष्य खसरे के सभी पड़ोसी खसरे, रास्ते, जलधारा और सार्वजनिक चिन्ह देखें। आकार व दिशा को मौके से मिलाएँ, पर सैटेलाइट चित्र, बाड़ या छत कानूनी सीमा नहीं सिद्ध करते। स्थायी चिन्हों की फोटो लेकर कार्य प्रति पर चिह्न लगाएँ ताकि राजस्व अधिकारी से सही प्रश्न पूछे जा सकें।' } },
      { title: { en: 'Reconcile area without guessing units', hi: 'इकाई का अनुमान लगाए बिना क्षेत्रफल मिलाएँ' }, body: { en: 'The map shape, Jamabandi area and deed schedule should tell one consistent story. Confirm the local area unit and obtain a professional conversion before comparing it with square metres or square feet used in marketing. Do not derive legal area by measuring pixels on a downloaded image. Sloping surface area, horizontal cadastral area and a broker’s tape measurement may differ conceptually. List the area of each Khasra and calculate the offered total using the official unit. If the deed proposes an undivided share rather than an identified subdivision, make that distinction explicit: a percentage in a holding is not automatically the fenced rectangle shown during inspection.', hi: 'नक्शा, जमाबंदी और डीड का क्षेत्रफल एक-दूसरे से मेल खाए। स्थानीय इकाई की पेशेवर गणना लें; डाउनलोड चित्र के पिक्सेल से कानूनी क्षेत्रफल न निकालें। ढलान की सतह, राजस्व क्षेत्रफल और दलाल की टेप माप अलग हो सकती है। अविभाजित हिस्से को मौके पर घिरे आयत के बराबर न मानें।' } },
      { title: { en: 'Separate physical approach from legal access', hi: 'भौतिक पहुँच और कानूनी रास्ता अलग हैं' }, body: { en: 'A vehicle reaching the plot today does not prove a transferable right of way. Determine whether the approach lies on a public road, a recorded path, the seller’s own land or a neighbour’s private Khasra. Review the map, deed recitals, easement documents, mutation remarks and any road acquisition or dedication record. Ask who maintains the road, whether gates are locked seasonally and whether its width supports the intended use and approvals. If access depends on oral neighbour consent, treat it as unresolved. A lawyer should examine the legal right while a survey professional traces the route on the map and ground. Construction feasibility may require more width than simple pedestrian access.', hi: 'आज वाहन पहुँच जाना कानूनी रास्ते का अधिकार सिद्ध नहीं करता। देखें कि रास्ता सार्वजनिक सड़क, दर्ज पथ, विक्रेता की भूमि या पड़ोसी के निजी खसरे पर है। नक्शा, डीड, ईज़मेंट, इंतकाल और सड़क अभिलेख जाँचें। मौखिक अनुमति पर निर्भर रास्ता अनसुलझा जोखिम है।' } },
      { title: { en: 'Request official demarcation when stakes are high', hi: 'महत्वपूर्ण लेन-देन में आधिकारिक निशानदेही लें' }, body: { en: 'Where boundaries are unclear, neighbouring occupation exists or the price depends on a particular frontage, seek demarcation through the competent revenue process before closing. Ensure affected neighbours receive whatever notice the process requires and retain the application, field report, measurements, attendance and final order or plan. Demarcation should use the relevant official record, not merely coordinates supplied by a private phone application. A private survey can be valuable preparation, especially for design, but confirm how it relates to the revenue process. If the seller refuses a reasonable boundary exercise, that refusal is itself important due-diligence information.', hi: 'सीमा अस्पष्ट हो, पड़ोसी कब्जा हो या कीमत खास फ्रंटेज पर निर्भर हो तो सौदा पूरा करने से पहले सक्षम राजस्व प्रक्रिया से निशानदेही लें। आवेदन, फील्ड रिपोर्ट, माप, उपस्थिति और अंतिम योजना सुरक्षित रखें। निजी सर्वे उपयोगी हो सकता है, पर उसे राजस्व प्रक्रिया से मिलाएँ।' } },
      { title: { en: 'Overlay planning and site constraints', hi: 'नियोजन और स्थल प्रतिबंध भी जोड़ें' }, body: { en: 'A correct boundary does not make the plot buildable. Once the parcel is identified, check revenue classification, planning area rules, setbacks, road width, forest or protected-land issues, utilities, drainage, slope stability and local body permissions. Confirm whether existing structures sit inside the target Khasra and whether they were approved. In mountain terrain, natural drainage and retaining works can affect neighbours even when the title boundary is clear. Give the same map pack to the property lawyer, architect or planner and survey professional so each adviser evaluates the identical parcel. Conflicting assumptions between advisers are a common source of expensive surprises.', hi: 'सही सीमा से भूखंड अपने-आप निर्माण योग्य नहीं बनता। भूमि वर्ग, नियोजन नियम, सेटबैक, सड़क चौड़ाई, वन/संरक्षित क्षेत्र, उपयोगिताएँ, जल निकासी और ढलान स्थिरता जाँचें। वकील, वास्तुकार और सर्वे पेशेवर को एक ही नक्शा पैक दें ताकि सभी उसी भूखंड का मूल्यांकन करें।' } },
    ],
   takeaway: { en: 'The safest map review uses three layers: the revenue record identifies the parcel, the Tatima or <a href="/en/map" class="takeaway-link">BhuNaksha view</a> shows its relationship to neighbours, and a lawful field process confirms what those lines mean on the ground. Add a separate legal-access investigation and planning review. Do not release substantial payment merely because the seller\'s pins, fence or phone map appear convincing.', hi: 'सुरक्षित जाँच की तीन परतें हैं: राजस्व रिकॉर्ड भूखंड पहचानता है, ततीमा या <a href="/hi/map" class="takeaway-link">भू-नक्शा दृश्य</a> पड़ोसी संबंध दिखाता है और वैध फील्ड प्रक्रिया मौके की सीमा स्पष्ट करती है। रास्ते और नियोजन की अलग जाँच जोड़ें। केवल खूंटी, बाड़ या फोन नक्शे पर बड़ा भुगतान न करें।' },
    sources: [
      { label: 'BhuNaksha Himachal Pradesh', url: 'https://bhunakshahp.nic.in/home/' },
      { label: 'Himachal Pradesh Revenue Department', url: 'https://himachal.nic.in/revenue' },
    ],
  },
{
          slug: 'himachal-land-mutation-intkal-guide',
          image: '/images/himachal-concept-hero.webp',
          publishedAt: '2026-11-20T12:00:00+05:30',
          readTime: { en: '15 minute guide', hi: '15 मिनट की मार्गदर्शिका' },
          title: { en: 'Himachal Pradesh Land Mutation (Intkal): Complete Guide to Sale, Inheritance, Gift and Partition', hi: 'हिमाचल प्रदेश में भूमि इंतकाल (म्यूटेशन): बिक्री, विरासत, दान और बँटवारे की पूरी मार्गदर्शिका' },
          summary: { en: 'Understand how land mutation (Intkal) works in Himachal Pradesh after sale, inheritance, gift or partition. Learn the process, documents, status checks and why mutation differs from registration.', hi: 'समझें कि हिमाचल प्रदेश में बिक्री, विरासत, दान या बँटवारे के बाद भूमि इंतकाल (म्यूटेशन) कैसे काम करता है। प्रक्रिया, दस्तावेज़, स्थिति जाँच और पंजीकरण से अंतर जानें।' },
          intro: { en: 'Land mutation, commonly known as Intkal in Himachal Pradesh, is the process of recording a change in rights or interests in land in the revenue records following a transaction or other legally recognized event. It is a revenue-record process and does not independently create or conclusively establish ownership. A registered sale deed transfers ownership, but the revenue records (Jamabandi) are updated only through mutation. Many landowners discover years later that their name never entered the Jamabandi because mutation was never completed. This guide explains when mutation is required, the step-by-step process, documents needed, how to check status, and why verifying the Jamabandi entry matters.', hi: 'भूमि इंतकाल, जिसे हिमाचल प्रदेश में आमतौर पर इंतकाल कहा जाता है, किसी लेन-देन या अन्य कानूनी रूप से मान्य घटना के बाद राजस्व रिकॉर्ड में भूमि के अधिकारों या हितों में परिवर्तन दर्ज करने की प्रक्रिया है। यह एक राजस्व-अभिलेख प्रक्रिया है और स्वतंत्र रूप से स्वामित्व सृजित या निर्णायक रूप से स्थापित नहीं करती। पंजीकृत विक्रय विलेख स्वामित्व हस्तांतरित करता है, लेकिन राजस्व अभिलेख (जमाबंदी) केवल इंतकाल के माध्यम से अद्यतन होते हैं। कई भूमि मालिक वर्षों बाद पता लगाते हैं कि उनका नाम कभी जमाबंदी में दर्ज ही नहीं हुआ क्योंकि इंतकाल पूरा नहीं हुआ था। यह मार्गदर्शिका बताती है कि इंतकाल कब आवश्यक है, चरण-दर-चरण प्रक्रिया, आवश्यक दस्तावेज़, स्थिति कैसे जांचें, और जमाबंदी प्रविष्टि सत्यापित करना क्यों महत्वपूर्ण है।' },
          sections: [
            { title: { en: 'What Is Intkal (Land Mutation) in Himachal Pradesh?', hi: 'हिमाचल प्रदेश में इंतकाल (भूमि म्यूटेशन) क्या है?' }, body: { en: 'Intkal is the revenue administration\'s process of updating the record of rights (Jamabandi) when ownership or other interests in land change. The Patwari or Revenue Officer records the mutation order, which then reflects in the next Jamabandi. Mutation serves three main purposes: it updates the revenue record for land revenue collection, it provides a public record of the change, and it enables the new owner to obtain a certified copy showing their name. However, mutation is not a title-creating document. A registered deed creates the legal transfer; mutation merely records it in the revenue system. The Himachal Pradesh Land Revenue Act, 1954 and the Himachal Pradesh Tenancy and Land Reforms Act, 1972 govern the revenue framework. The mutation entry references the underlying document (sale deed, gift deed, succession certificate, partition decree) but does not validate its legality.', hi: 'इंतकाल राजस्व प्रशासन की वह प्रक्रिया है जिससे अधिकार अभिलेख (जमाबंदी) अद्यतन होता है जब भूमि में स्वामित्व या अन्य हित बदलते हैं। पटवारी या राजस्व अधिकारी इंतकाल आदेश दर्ज करते हैं, जो अगली जमाबंदी में प्रतिबिंबित होता है। इंतकाल तीन मुख्य उद्देश्य पूरे करता है: यह भू-राजस्व संग्रह के लिए राजस्व रिकॉर्ड अद्यतन करता है, परिवर्तन का सार्वजनिक रिकॉर्ड प्रदान करता है, और नए मालिक को उनका नाम दर्शाने वाली प्रमाणित प्रति प्राप्त करने में सक्षम बनाता है। हालांकि, इंतकाल स्वामित्व सृजित करने वाला दस्तावेज़ नहीं है। पंजीकृत विलेख कानूनी हस्तांतरण सृजित करता है; इंतकाल केवल उसे राजस्व प्रणाली में दर्ज करता है। हिमाचल प्रदेश भूमि राजस्व अधिनियम, 1954 और हिमाचल प्रदेश काश्तकारी एवं भूमि सुधार अधिनियम, 1972 राजस्व ढांचे को नियंत्रित करते हैं। इंतकाल प्रविष्टि मूल दस्तावेज़ (विक्रय विलेख, दान विलेख, उत्तराधिकार प्रमाणपत्र, बँटवारा डिक्री) का संदर्भ देती है लेकिन उसकी वैधता प्रमाणित नहीं करती।' }, citation: { en: 'H.P. Land Revenue Act, 1954; H.P. Tenancy and Land Reforms Act, 1972; Revenue Department mutation instructions', hi: 'हि.प्र. भूमि राजस्व अधिनियम, 1954; हि.प्र. काश्तकारी एवं भूमि सुधार अधिनियम, 1972; राजस्व विभाग के इंतकाल निर्देश' } },
            { title: { en: 'When Is Land Mutation Required?', hi: 'भूमि इंतकाल कब आवश्यक है?' }, body: { en: 'Mutation is required whenever there is a change in the recorded rights or interests in land. The major situations are:', hi: 'जब भी भूमि में दर्ज अधिकारों या हितों में परिवर्तन होता है, इंतकाल आवश्यक होता है। प्रमुख स्थितियाँ हैं:' }, list: { en: ['Sale of land – after registration of the sale deed', 'Inheritance – after the death of a recorded owner', 'Gift – after registration of a gift deed', 'Family partition – after a partition deed, court decree or revenue partition', 'Court decree – when a civil court orders a change in land rights', 'Exchange of land – mutual transfer of parcels', 'Other recognized changes – such as government acquisition, surrender, or relinquishment'], hi: ['भूमि की बिक्री – विक्रय विलेख के पंजीकरण के बाद', 'विरासत – दर्ज मालिक की मृत्यु के बाद', 'दान – दान विलेख के पंजीकरण के बाद', 'पारिवारिक बँटवारा – बँटवारा विलेख, न्यायालय डिक्री या राजस्व बँटवारे के बाद', 'न्यायालय डिक्री – जब दीवानी न्यायालय भूमि अधिकारों में परिवर्तन का आदेश दे', 'भूमि विनिमय – भूखंडों का पारस्परिक हस्तांतरण', 'अन्य मान्य परिवर्तन – जैसे सरकारी अधिग्रहण, समर्पण या त्याग'] } },
            { title: { en: 'Mutation After Sale of Land', hi: 'भूमि बिक्री के बाद इंतकाल' }, body: { en: 'After a sale deed is registered at the Sub-Registrar office, the buyer (or seller) must report the transaction to the revenue authorities. The Patwari identifies the Khasra, Khewat and Khatauni, verifies the registered deed, and initiates mutation proceedings. The revenue officer may issue notices, conduct an inquiry, and then pass the mutation order. The buyer should verify that the mutation order has been passed and that the next Jamabandi reflects the change. A registered sale deed and a mutation entry serve different purposes: the deed proves the transfer; the mutation records it for revenue purposes.', hi: 'विक्रय विलेख उप-पंजीयक कार्यालय में पंजीकृत होने के बाद, खरीदार (या विक्रेता) को लेन-देन की सूचना राजस्व अधिकारियों को देनी होती है। पटवारी खसरा, खेवट और खतौनी की पहचान करता है, पंजीकृत विलेख सत्यापित करता है, और इंतकाल कार्यवाही शुरू करता है। राजस्व अधिकारी नोटिस जारी कर सकते हैं, जांच कर सकते हैं, और फिर इंतकाल आदेश पारित करते हैं। खरीदार को सत्यापित करना चाहिए कि इंतकाल आदेश पारित हो चुका है और अगली जमाबंदी में परिवर्तन प्रतिबिंबित हो रहा है। पंजीकृत विक्रय विलेख और इंतकाल प्रविष्टि अलग-अलग उद्देश्य पूरे करते हैं: विलेख हस्तांतरण सिद्ध करता है; इंतकाल उसे राजस्व उद्देश्यों के लिए दर्ज करता है।' }, citation: { en: 'Registration Act, 1908; H.P. Land Revenue Act, 1954; local mutation practice', hi: 'पंजीकरण अधिनियम, 1908; हि.प्र. भूमि राजस्व अधिनियम, 1954; स्थानीय इंतकाल प्रथा' } },
            { title: { en: 'Mutation After Inheritance or Death of an Owner', hi: 'मालिक की मृत्यु या विरासत के बाद इंतकाल' }, body: { en: 'When a recorded landowner dies, their legal heirs must apply for mutation based on inheritance. The process requires a death certificate, proof of heirship (such as a succession certificate, legal heir certificate, or family settlement), and the existing Jamabandi. If there are multiple heirs, the mutation records their respective shares. Disputed inheritance claims may require a civil court decree before mutation can proceed. A will, if any, must be probated or otherwise proved as applicable. The applicable succession law (Hindu Succession Act, 1956, or other personal law) determines the heirs and shares. Mutation does not resolve title disputes; it records the revenue entry based on the documents produced.', hi: 'जब किसी दर्ज भूमि मालिक की मृत्यु होती है, तो उनके कानूनी वारिसों को विरासत के आधार पर इंतकाल के लिए आवेदन करना होता है। प्रक्रिया में मृत्यु प्रमाणपत्र, वारिस होने का प्रमाण (जैसे उत्तराधिकार प्रमाणपत्र, कानूनी वारिस प्रमाणपत्र, या पारिवारिक समझौता), और मौजूदा जमाबंदी आवश्यक होती है। यदि कई वारिस हैं, तो इंतकाल उनके संबंधित हिस्से दर्ज करता है। विवादित विरासत दावों के लिए इंतकाल से पहले दीवानी न्यायालय की डिक्री आवश्यक हो सकती है। यदि वसीयत है, तो उसे प्रोबेट कराया जाना चाहिए या लागू अनुसार सिद्ध किया जाना चाहिए। लागू उत्तराधिकार कानून (हिंदू उत्तराधिकार अधिनियम, 1956, या अन्य व्यक्तिगत कानून) वारिसों और हिस्सों का निर्धारण करता है। इंतकाल शीर्षक विवाद हल नहीं करता; यह प्रस्तुत दस्तावेजों के आधार पर राजस्व प्रविष्टि दर्ज करता है।' }, citation: { en: 'Hindu Succession Act, 1956; Indian Succession Act, 1925; local revenue practice', hi: 'हिंदू उत्तराधिकार अधिनियम, 1956; भारतीय उत्तराधिकार अधिनियम, 1925; स्थानीय राजस्व प्रथा' } },
            { title: { en: 'Mutation After Gift of Property', hi: 'संपत्ति दान के बाद इंतकाल' }, body: { en: 'A registered gift deed (where registration is mandatory under the Registration Act, 1908) is the basis for gift mutation. The donor and donee are identified, the land parcel is verified against the Jamabandi, and mutation proceedings follow. The donee should verify that the mutation order records the gift correctly and that the Jamabandi is updated. A gift deed does not automatically update the Jamabandi; the mutation process must be completed separately.', hi: 'पंजीकृत दान विलेख (जहां पंजीकरण अधिनियम, 1908 के तहत पंजीकरण अनिवार्य है) दान इंतकाल का आधार है। दाता और दानग्राही की पहचान की जाती है, भूमि भूखंड का जमाबंदी से मिलान किया जाता है, और इंतकाल कार्यवाही होती है। दानग्राही को सत्यापित करना चाहिए कि इंतकाल आदेश दान को सही ढंग से दर्ज करता है और जमाबंदी अद्यतन हो गई है। दान विलेख अपने-आप जमाबंदी अद्यतन नहीं करता; इंतकाल प्रक्रिया अलग से पूरी करनी होती है।' }, citation: { en: 'Registration Act, 1908; Transfer of Property Act, 1882; local mutation practice', hi: 'पंजीकरण अधिनियम, 1908; संपत्ति हस्तांतरण अधिनियम, 1882; स्थानीय इंतकाल प्रथा' } },
            { title: { en: 'Mutation After Family Partition', hi: 'पारिवारिक बँटवारे के बाद इंतकाल' }, body: { en: 'Partition divides joint ownership into separate shares. It may be effected by a family arrangement, a registered partition deed, a court decree, or revenue partition proceedings. The mutation records the new Khewat, Khatauni and Khasra structure reflecting the divided shares. Each co-owner\'s separate holding gets a new Khewat number. The partition document must clearly identify the parcels allotted to each share. Verification of the final mutation entry against the partition terms is essential.', hi: 'बँटवारा संयुक्त स्वामित्व को अलग-अलग हिस्सों में विभाजित करता है। यह पारिवारिक व्यवस्था, पंजीकृत बँटवारा विलेख, न्यायालय डिक्री, या राजस्व बँटवारा कार्यवाही द्वारा किया जा सकता है। इंतकाल नई खेवट, खतौनी और खसरा संरचना दर्ज करता है जो विभाजित हिस्सों को दर्शाती है। प्रत्येक सह-मालिक की अलग होल्डिंग को नया खेवट नंबर मिलता है। बँटवारा दस्तावेज़ में प्रत्येक हिस्से को आवंटित भूखंड स्पष्ट रूप से पहचाने जाने चाहिए। अंतिम इंतकाल प्रविष्टि का बँटवारा शर्तों से सत्यापन आवश्यक है।' }, citation: { en: 'Partition Act, 1893; H.P. Land Revenue Act, 1954; local revenue partition practice', hi: 'बँटवारा अधिनियम, 1893; हि.प्र. भूमि राजस्व अधिनियम, 1954; स्थानीय राजस्व बँटवारा प्रथा' } },
            { title: { en: 'Step-by-Step Land Mutation Process', hi: 'भूमि इंतकाल की चरण-दर-चरण प्रक्रिया' }, body: { en: 'The general process varies by transaction type and local practice. A typical sequence is:', hi: 'सामान्य प्रक्रिया लेन-देन के प्रकार और स्थानीय प्रथा के अनुसार भिन्न होती है। एक सामान्य क्रम है:' }, list: { en: ['Identify the land parcel: district, tehsil, village, Hadbast, Khasra, Khewat, Khatauni', 'Obtain the registered deed, succession documents, or other legal basis', 'Approach the Patwari, Kanungo, or Tehsil Revenue Office (or use an official online service where available)', 'Submit the mutation application with supporting documents', 'Revenue officials verify documents and land particulars', 'Notices may be issued; inquiry or hearing may be held depending on the mutation type', 'The competent revenue authority passes the mutation order', 'Verify the mutation in the updated Jamabandi and obtain a certified copy if needed'], hi: ['भूखंड की पहचान करें: जिला, तहसील, गाँव, हदबस्त, खसरा, खेवट, खतौनी', 'पंजीकृत विलेख, उत्तराधिकार दस्तावेज़, या अन्य कानूनी आधार प्राप्त करें', 'पटवारी, कानूनगो, या तहसील राजस्व कार्यालय से संपर्क करें (या जहां उपलब्ध हो आधिकारिक ऑनलाइन सेवा का उपयोग करें)', 'सहायक दस्तावेजों के साथ इंतकाल आवेदन जमा करें', 'राजस्व अधिकारी दस्तावेज़ और भूमि विवरण सत्यापित करते हैं', 'नोटिस जारी हो सकते हैं; इंतकाल प्रकार के अनुसार जांच या सुनवाई हो सकती है', 'सक्षम राजस्व प्राधिकारी इंतकाल आदेश पारित करता है', 'अद्यतन जमाबंदी में इंतकाल सत्यापित करें और आवश्यकता हो तो प्रमाणित प्रति लें'] }, note: { en: 'Procedural steps differ between sale, inheritance, gift and partition. Not every mutation requires a hearing. Confirm the exact process with the concerned revenue office.', hi: 'प्रक्रियात्मक चरण बिक्री, विरासत, दान और बँटवारे में भिन्न होते हैं। हर इंतकाल में सुनवाई आवश्यक नहीं। संबंधित राजस्व कार्यालय से सटीक प्रक्रिया की पुष्टि करें।' } },
            { title: { en: 'Documents Required for Land Mutation', hi: 'भूमि इंतकाल के लिए आवश्यक दस्तावेज़' }, body: { en: 'The following are commonly relevant documents. Requirements vary by mutation type and local practice. This is not a universally mandatory checklist.', hi: 'निम्नलिखित आमतौर पर प्रासंगिक दस्तावेज़ हैं। आवश्यकताएं इंतकाल प्रकार और स्थानीय प्रथा के अनुसार भिन्न होती हैं। यह सार्वभौमिक अनिवार्य चेकलिस्ट नहीं है।' }, list: { en: ['Sale: Registered sale deed, previous Jamabandi, identity proofs, Khasra/Khewat details', 'Inheritance: Death certificate, succession/legal heir certificate, will (if any), identity proofs, existing Jamabandi', 'Gift: Registered gift deed, identity proofs of donor and donee, previous Jamabandi, Khasra/Khewat details', 'Partition: Partition deed/court decree/revenue order, identity proofs, previous Jamabandi, survey/map if applicable', 'Court decree: Certified copy of decree, identity proofs, relevant Jamabandi'], hi: ['बिक्री: पंजीकृत विक्रय विलेख, पिछली जमाबंदी, पहचान प्रमाण, खसरा/खेवट विवरण', 'विरासत: मृत्यु प्रमाणपत्र, उत्तराधिकार/कानूनी वारिस प्रमाणपत्र, वसीयत (यदि कोई हो), पहचान प्रमाण, मौजूदा जमाबंदी', 'दान: पंजीकृत दान विलेख, दाता और दानग्राही के पहचान प्रमाण, पिछली जमाबंदी, खसरा/खेवट विवरण', 'बँटवारा: बँटवारा विलेख/न्यायालय डिक्री/राजस्व आदेश, पहचान प्रमाण, पिछली जमाबंदी, सर्वे/नक्शा (यदि लागू)', 'न्यायालय डिक्री: डिक्री की प्रमाणित प्रति, पहचान प्रमाण, संबंधित जमाबंदी'] } },
            { title: { en: 'How to Check Land Mutation Status', hi: 'भूमि इंतकाल स्थिति कैसे जांचें' }, body: { en: 'There is no single unified online mutation tracking portal for Himachal Pradesh that is publicly confirmed as fully operational for all tehsils. The most reliable methods are:', hi: 'हिमाचल प्रदेश के लिए कोई एकीकृत ऑनलाइन इंतकाल ट्रैकिंग पोर्टल सार्वजनिक रूप से पुष्ट नहीं है जो सभी तहसीलों के लिए पूरी तरह चालू हो। सबसे विश्वसनीय विधियाँ हैं:' }, list: { en: ['Visit the concerned Patwari or Kanungo with the Khasra, Khewat, village and tehsil details', 'Enquire at the Tehsil Revenue Office for the mutation register or order', 'Check the updated Jamabandi on HimBhoomi (himbhoomilmk.nic.in) for the latest revenue entry', 'If an e-District or local portal mutation service exists for your tehsil, use it with the mutation/application number'], hi: ['संबंधित पटवारी या कानूनगो के पास खसरा, खेवट, गाँव और तहसील विवरण लेकर जाएँ', 'तहसील राजस्व कार्यालय में इंतकाल रजिस्टर या आदेश के लिए पूछताछ करें', 'हिमभूमि (himbhoomilmk.nic.in) पर अद्यतन जमाबंदी जांचें नवीनतम राजस्व प्रविष्टि के लिए', 'यदि आपकी तहसील के लिए ई-डिस्ट्रिक्ट या स्थानीय पोर्टल इंतकाल सेवा मौजूद है, तो इंतकाल/आवेदन नंबर के साथ उपयोग करें'] }, note: { en: 'Keep ready: district, tehsil, village, Khasra number, Khewat/Khatauni number, mutation/Intkal number (if available), registered deed details. Online informational records may differ from certified copies.', hi: 'तैयार रखें: जिला, तहसील, गाँव, खसरा नंबर, खेवट/खतौनी नंबर, इंतकाल नंबर (यदि उपलब्ध हो), पंजीकृत विलेख विवरण। ऑनलाइन सूचनात्मक रिकॉर्ड प्रमाणित प्रतियों से भिन्न हो सकते हैं।' }, link: { href: '/en/map', label: { en: 'Open BhuNaksha map to locate your parcel', hi: 'भू-नक्शा खोलकर अपना भूखंड ढूंढें' } } },
            { title: { en: 'How to Check Whether Mutation Has Been Updated in Jamabandi', hi: 'जांचें कि इंतकाल जमाबंदी में अद्यतन हुआ है या नहीं' }, body: { en: 'To verify the mutation in Jamabandi:', hi: 'जमाबंदी में इंतकाल सत्यापित करने के लिए:' }, list: { en: ['Locate the current Jamabandi for the village and year', 'Identify the Khewat and Khatauni for the parcel', 'Check the recorded owner/rightholder name against the expected name', 'Compare with the previous Jamabandi year if available', 'Look for the mutation reference or order number in the remarks (Kaifiyat) column', 'Confirm the Khasra parcels and recorded shares match the transaction', 'Obtain a certified copy (nakal) from the competent revenue office for legal use'], hi: ['गाँव और वर्ष के लिए वर्तमान जमाबंदी ढूंढें', 'भूखंड के लिए खेवट और खतौनी पहचानें', 'दर्ज मालिक/अधिकारधारी का नाम अपेक्षित नाम से मिलाएँ', 'पिछली जमाबंदी वर्ष से तुलना करें यदि उपलब्ध हो', 'टिप्पणी (कैफियत) कॉलम में इंतकाल संदर्भ या आदेश नंबर देखें', 'पुष्टि करें कि खसरा भूखंड और दर्ज हिस्से लेन-देन से मेल खाते हैं', 'कानूनी उपयोग के लिए सक्षम राजस्व कार्यालय से प्रमाणित प्रति (नकल) प्राप्त करें'] }, note: { en: 'An online Jamabandi view is informational. A certified nakal is required for court, bank or official purposes. See our Jamabandi reading guide for detailed field-by-field explanation.', hi: 'ऑनलाइन जमाबंदी दृश्य केवल सूचनात्मक है। न्यायालय, बैंक या आधिकारिक उद्देश्यों के लिए प्रमाणित नकल आवश्यक है। विस्तृत फील्ड-दर-फील्ड व्याख्या के लिए हमारी जमाबंदी पढ़ने की मार्गदर्शिका देखें।' }, link: { href: '/en/blog/how-to-read-jamabandi-khewat-khatauni-khasra', label: { en: 'Read: How to read a Himachal Jamabandi', hi: 'पढ़ें: हिमाचल जमाबंदी कैसे पढ़ें' } } },
            { title: { en: 'How Long Does Land Mutation Take?', hi: 'भूमि इंतकाल में कितना समय लगता है?' }, body: { en: 'Mutation timelines depend on the transaction type, completeness of documents, whether notices or hearings are required, and the workload of the revenue office. There is no single notified service standard for all mutation types across Himachal Pradesh. Sale mutations may be faster if documents are complete and undisputed. Inheritance, gift and partition mutations often involve more verification. If a mutation remains pending, follow up with the concerned Patwari, Kanungo or Tehsil office. Do not assume a fixed timeline; confirm expected processing time with the local revenue authority.', hi: 'इंतकाल की समय-सीमा लेन-देन के प्रकार, दस्तावेजों की पूर्णता, नोटिस या सुनवाई की आवश्यकता, और राजस्व कार्यालय के कार्यभार पर निर्भर करती है। हिमाचल प्रदेश में सभी इंतकाल प्रकारों के लिए कोई एक अधिसूचित सेवा मानक नहीं है। यदि दस्तावेज़ पूरे और निर्विवाद हों तो बिक्री इंतकाल तेज़ हो सकते हैं। विरासत, दान और बँटवारा इंतकाल में अक्सर अधिक सत्यापन होता है। यदि इंतकाल लंबित है, तो संबंधित पटवारी, कानूनगो या तहसील कार्यालय से अनुवर्ती कार्रवाई करें। निश्चित समय-सीमा न मानें; स्थानीय राजस्व प्राधिकरण से अपेक्षित प्रसंस्करण समय की पुष्टि करें।' } },
            { title: { en: 'What Happens If Land Mutation Is Not Completed?', hi: 'यदि भूमि इंतकाल पूरा न हो तो क्या होता है?' }, body: { en: 'If mutation is not completed, the old owner\'s name may continue appearing in the revenue records. Subsequent Jamabandi entries may not reflect the transaction. This can cause difficulty in verifying updated revenue particulars, complications during later transactions (sale, loan, gift), issues during inheritance or family partition, and problems obtaining certified copies showing the current owner. However, absence of mutation does not automatically invalidate an otherwise legally valid registered transaction. The deed remains legally effective between the parties; the revenue record simply has not been updated.', hi: 'यदि इंतकाल पूरा नहीं होता, तो पुराने मालिक का नाम राजस्व रिकॉर्ड में बना रह सकता है। बाद की जमाबंदी प्रविष्टियाँ लेन-देन को प्रतिबिंबित नहीं कर सकतीं। इससे अद्यतन राजस्व विवरण सत्यापित करने में कठिनाई, बाद के लेन-देन (बिक्री, ऋण, दान) में जटिलताएं, विरासत या पारिवारिक बँटवारे में समस्याएं, और वर्तमान मालिक दर्शाने वाली प्रमाणित प्रति प्राप्त करने में समस्या हो सकती है। हालांकि, इंतकाल की अनुपस्थिति अपने-आप किसी अन्यथा कानूनी रूप से वैध पंजीकृत लेन-देन को अमान्य नहीं करती। विलेख पक्षकारों के बीच कानूनी रूप से प्रभावी रहता है; केवल राजस्व रिकॉर्ड अद्यतन नहीं हुआ है।' } },
            { title: { en: 'Can Land Mutation Be Rejected or Disputed?', hi: 'क्या भूमि इंतकाल अस्वीकार या विवादित हो सकता है?' }, body: { en: 'Yes. Mutation may be rejected or disputed in cases of conflicting claims, missing or defective documents, disputes among legal heirs, incorrect land identification, disputed partition, pending court proceedings, or objections by interested parties. The competent revenue authority must follow the applicable legal procedure. If a mutation is rejected or disputed, the parties should obtain the relevant order and seek appropriate legal remedy. A revenue entry alone does not resolve a title dispute.', hi: 'हाँ। इंतकाल विरोधी दावों, लापता या दोषपूर्ण दस्तावेज़ों, कानूनी वारिसों में विवाद, गलत भूमि पहचान, विवादित बँटवारे, लंबित न्यायालय कार्यवाही, या इच्छुक पक्षों की आपत्तियों के मामलों में अस्वीकार या विवादित हो सकता है। सक्षम राजस्व प्राधिकारी को लागू कानूनी प्रक्रिया का पालन करना चाहिए। यदि इंतकाल अस्वीकार या विवादित होता है, तो पक्षकारों को संबंधित आदेश प्राप्त करना चाहिए और उचित कानूनी उपाय अपनाना चाहिए। केवल राजस्व प्रविष्टि शीर्षक विवाद हल नहीं करती।' } },
            { title: { en: 'Difference Between Mutation (Intkal), Jamabandi and Registration', hi: 'इंतकाल (म्यूटेशन), जमाबंदी और पंजीकरण में अंतर' }, body: { en: 'The table below summarizes the key differences:', hi: 'नीचे दी गई तालिका मुख्य अंतरों का सारांश देती है:' }, list: { en: ['Mutation (Intkal): Revenue record update | Records change in rights/interests | After transaction/event | Patwari/Revenue Officer | Revenue record entry; not title proof', 'Jamabandi: Record of rights (periodic) | Ownership, cultivation, plot details | Periodic settlement/update | Revenue Department | Prima facie evidence of revenue entries', 'Registration: Deed registration | Legal transfer/document execution | At transaction time | Sub-Registrar | Creates legal rights; title evidence'], hi: ['इंतकाल (म्यूटेशन): राजस्व रिकॉर्ड अद्यतन | अधिकारों/हितों में परिवर्तन दर्ज | लेन-देन/घटना के बाद | पटवारी/राजस्व अधिकारी | राजस्व रिकॉर्ड प्रविष्टि; शीर्षक प्रमाण नहीं', 'जमाबंदी: अधिकारों का अभिलेख (आवधिक) | स्वामित्व, काश्त, भूखंड विवरण | आवधिक बंदोबस्त/अद्यतन | राजस्व विभाग | राजस्व प्रविष्टियों का प्रथम दृष्टया प्रमाण', 'पंजीकरण: विलेख पंजीकरण | कानूनी हस्तांतरण/दस्तावेज़ निष्पादन | लेन-देन के समय | उप-पंजीयक | कानूनी अधिकार सृजित करता है; शीर्षक प्रमाण'] } },
            { title: { en: 'Important Checks Before Buying Land in Himachal Pradesh', hi: 'हिमाचल प्रदेश में भूमि खरीदने से पहले महत्वपूर्ण जांच' }, body: { en: 'Buyers should verify all of the following. Mutation alone is not a complete title verification.', hi: 'खरीदारों को निम्नलिखित सभी की पुष्टि करनी चाहिए। अकेला इंतकाल पूर्ण शीर्षक सत्यापन नहीं है।' }, list: { en: ['Registered title documents (sale deed chain)', 'Current Jamabandi and mutation history', 'Khasra, Khatauni and Khewat details', 'Shajra/Tatima and boundary verification', 'Encumbrances, mortgages, litigation', 'Section 118 applicability for non-agriculturists', 'Land classification (private vs forest/government)', 'Approved layout/plan if applicable'], hi: ['पंजीकृत शीर्षक दस्तावेज़ (विक्रय विलेख श्रृंखला)', 'वर्तमान जमाबंदी और इंतकाल इतिहास', 'खसरा, खतौनी और खेवट विवरण', 'शजरा/ततीमा और सीमा सत्यापन', 'भार, बंधक, मुकदमेबाज़ी', 'गैर-कृषकों के लिए धारा 118 प्रयोज्यता', 'भूमि वर्गीकरण (निजी बनाम वन/सरकारी)', 'स्वीकृत लेआउट/योजना यदि लागू हो'] }, link: { href: '/en/blog/7-documents-before-buying-land', label: { en: 'Read: 7 documents before buying land', hi: 'पढ़ें: खरीदने से पहले 7 दस्तावेज़' } } },
            { title: { en: 'Frequently Asked Questions', hi: 'अक्सर पूछे जाने वाले प्रश्न' }, body: { en: 'Answers to common questions about land mutation in Himachal Pradesh:', hi: 'हिमाचल प्रदेश में भूमि इंतकाल के बारे में सामान्य प्रश्नों के उत्तर:' }, list: { en: ['What is Intkal in Himachal Pradesh? Intkal is the revenue process of recording a change in land rights in the Jamabandi after a transaction or event.', 'How can I apply for land mutation? Submit an application with supporting documents to the Patwari, Kanungo or Tehsil Revenue Office.', 'How can I check mutation status online? There is no single confirmed statewide portal. Check HimBhoomi for updated Jamabandi or enquire at the Tehsil office.', 'How do I transfer land records after the death of an owner? Apply for inheritance mutation with death certificate, heirship proof, and existing Jamabandi.', 'Is mutation automatic after registering a sale deed? No. Mutation is a separate revenue process that must be initiated after registration.', 'Is a registered sale deed enough to update Jamabandi? No. The deed proves transfer; mutation records it in revenue records.', 'What documents are needed for inheritance mutation? Death certificate, succession/legal heir certificate, will (if any), identity proofs, existing Jamabandi.', 'How is mutation done after a gift deed? Register the gift deed, then apply for mutation with the deed, identity proofs, and Jamabandi.', 'How does family partition affect Jamabandi? Partition creates new Khewat/Khatauni/Khasra structure reflecting divided shares.', 'Can mutation be disputed by another legal heir? Yes. Conflicting heir claims can lead to disputed mutation proceedings.', 'What should I do if the old owner\'s name still appears in Jamabandi? Check mutation status, follow up with revenue office, and verify whether mutation was completed.', 'How can I obtain a copy of a mutation order? Request it from the Tehsil Revenue Office or the Patwari who processed the mutation.', 'Does mutation prove legal ownership? No. Mutation is a revenue entry; it does not create or conclusively prove title.', 'Can I sell land if mutation is pending? You can sell, but the buyer will see the old name in Jamabandi. Complete mutation first for smoother transactions.', 'What is the difference between Intkal and Jamabandi? Intkal is the process of updating; Jamabandi is the periodic record of rights that reflects the updates.'], hi: ['हिमाचल प्रदेश में इंतकाल क्या है? इंतकाल लेन-देन या घटना के बाद जमाबंदी में भूमि अधिकारों में परिवर्तन दर्ज करने की राजस्व प्रक्रिया है।', 'भूमि इंतकाल के लिए आवेदन कैसे करें? सहायक दस्तावेजों के साथ पटवारी, कानूनगो या तहसील राजस्व कार्यालय में आवेदन जमा करें।', 'इंतकाल स्थिति ऑनलाइन कैसे जांचें? कोई एक पुष्ट राज्यव्यापी पोर्टल नहीं। हिमभूमि पर अद्यतन जमाबंदी जांचें या तहसील कार्यालय में पूछताछ करें।', 'मालिक की मृत्यु के बाद भूमि रिकॉर्ड कैसे हस्तांतरित करें? मृत्यु प्रमाणपत्र, वारिस प्रमाण, और मौजूदा जमाबंदी के साथ विरासत इंतकाल के लिए आवेदन करें।', 'क्या विक्रय विलेख पंजीकरण के बाद इंतकाल स्वचालित है? नहीं। इंतकाल एक अलग राजस्व प्रक्रिया है जो पंजीकरण के बाद शुरू की जानी चाहिए।', 'क्या पंजीकृत विक्रय विलेख जमाबंदी अद्यतन के लिए पर्याप्त है? नहीं। विलेख हस्तांतरण सिद्ध करता है; इंतकाल उसे राजस्व रिकॉर्ड में दर्ज करता है।', 'विरासत इंतकाल के लिए कौन से दस्तावेज़ चाहिए? मृत्यु प्रमाणपत्र, उत्तराधिकार/कानूनी वारिस प्रमाणपत्र, वसीयत (यदि कोई हो), पहचान प्रमाण, मौजूदा जमाबंदी।', 'दान विलेख के बाद इंतकाल कैसे होता है? दान विलेख पंजीकृत करें, फिर विलेख, पहचान प्रमाण और जमाबंदी के साथ इंतकाल आवेदन करें।', 'पारिवारिक बँटवारा जमाबंदी को कैसे प्रभावित करता है? बँटवारा विभाजित हिस्सों को दर्शाने वाली नई खेवट/खतौनी/खसरा संरचना सृजित करता है।', 'क्या इंतकाल किसी अन्य कानूनी वारिस द्वारा विवादित हो सकता है? हाँ। विरोधी वारिस दावे विवादित इंतकाल कार्यवाही का कारण बन सकते हैं।', 'यदि पुराने मालिक का नाम अभी भी जमाबंदी में दिखे तो क्या करें? इंतकाल स्थिति जांचें, राजस्व कार्यालय से अनुवर्ती कार्रवाई करें, और सत्यापित करें कि इंतकाल पूरा हुआ या नहीं।', 'इंतकाल आदेश की प्रति कैसे प्राप्त करें? उस तहसील राजस्व कार्यालय या पटवारी से अनुरोध करें जिसने इंतकाल संसाधित किया।', 'क्या इंतकाल कानूनी स्वामित्व सिद्ध करता है? नहीं। इंतकाल राजस्व प्रविष्टि है; यह शीर्षक सृजित या निर्णायक रूप से सिद्ध नहीं करता।', 'क्या मैं भूमि बेच सकता हूँ यदि इंतकाल लंबित है? आप बेच सकते हैं, लेकिन खरीदार को जमाबंदी में पुराना नाम दिखेगा। सुचारू लेन-देन के लिए पहले इंतकाल पूरा करें।', 'इंतकाल और जमाबंदी में क्या अंतर है? इंतकाल अद्यतन करने की प्रक्रिया है; जमाबंदी आवधिक अधिकार अभिलेख है जो अद्यतनों को प्रतिबिंबित करती है।'] } },
          ],
          takeaway: { en: 'Mutation (Intkal) is the revenue process that updates Jamabandi after a change in land rights. It is separate from registration and does not create title. Always verify the mutation has been completed and reflected in the current Jamabandi. Check the updated Jamabandi on HimBhoomi or obtain a certified nakal. For due diligence, also review the mutation history, Section 118 applicability, and boundary records.', hi: 'इंतकाल (म्यूटेशन) वह राजस्व प्रक्रिया है जो भूमि अधिकारों में परिवर्तन के बाद जमाबंदी अद्यतन करती है। यह पंजीकरण से अलग है और शीर्षक सृजित नहीं करती। हमेशा सत्यापित करें कि इंतकाल पूरा हो चुका है और वर्तमान जमाबंदी में प्रतिबिंबित हो रहा है। हिमभूमि पर अद्यतन जमाबंदी जांचें या प्रमाणित नकल प्राप्त करें। उचित जांच के लिए इंतकाल इतिहास, धारा 118 प्रयोज्यता, और सीमा रिकॉर्ड की भी समीक्षा करें।' },
          sources: [
                    { label: 'HimBhoomi Land Records Portal', url: 'https://himbhoomilmk.nic.in/viewlandrecords.aspx' },
            { label: 'H.P. Land Revenue Act, 1954', url: 'https://himachal.nic.in/WriteReadData/l892s/13_l892s/3618435HPLandRevenueAct1954.pdf' },
            { label: 'H.P. Tenancy and Land Reforms Act, 1972', url: 'https://emerginghimachal.hp.gov.in/themes/backend/uploads/landreformAct1972.pdf' },
           
          ],
        },
  {
    slug: 'land-registry-vs-mutation-himachal-pradesh',
    image: '/images/blog-land-research.webp',
    publishedAt: '2026-11-22T12:00:00+05:30',
    readTime: { en: '7 minute guide', hi: '7 मिनट की मार्गदर्शिका' },
    title: {
      en: 'Land Registry vs Mutation in Himachal Pradesh: Complete Guide for Property Buyers',
      hi: 'हिमाचल प्रदेश में भूमि रजिस्ट्री बनाम इंतकाल: संपत्ति खरीदारों के लिए संपूर्ण मार्गदर्शिका',
    },
    summary: {
      en: 'Registering a sale deed and getting a mutation (Intkal) are two different processes. Learn what each does, how to check your Jamabandi online and what to do if the mutation is pending.',
      hi: 'बिक्री विलेख का पंजीकरण और इंतकाल दो अलग प्रक्रियाएँ हैं। जानें कि हर एक क्या करती है, जमाबंदी ऑनलाइन कैसे जाँचें और इंतकाल लंबित हो तो क्या करें।',
    },
    intro: {
      en: 'Buying land in Himachal Pradesh is a major financial decision, whether the plot is residential land in Solan, agricultural land in Kangra or property near Shimla. Two terms confuse buyers more than any others: land registry (registration of the sale deed) and mutation (Intkal). Many people assume that once the deed is registered, their name automatically appears in the latest Jamabandi. It does not. Registration and mutation are separate processes handled by different offices, and both need to be checked. This guide explains how each works, why both matter and what a buyer should verify after the purchase.',
      hi: 'हिमाचल प्रदेश में भूमि खरीदना बड़ा वित्तीय निर्णय है, चाहे वह सोलन में आवासीय भूखंड हो, कांगड़ा में कृषि भूमि हो या शिमला के पास संपत्ति। दो शब्द खरीदारों को सबसे ज़्यादा भ्रमित करते हैं: भूमि रजिस्ट्री (बिक्री विलेख का पंजीकरण) और इंतकाल। बहुत से लोग मान लेते हैं कि डीड रजिस्टर होते ही उनका नाम नवीनतम जमाबंदी में अपने-आप आ जाएगा। ऐसा नहीं होता। रजिस्ट्री और इंतकाल अलग-अलग कार्यालयों द्वारा की जाने वाली अलग प्रक्रियाएँ हैं और दोनों की जाँच ज़रूरी है। यह मार्गदर्शिका बताती है कि हर प्रक्रिया कैसे काम करती है, दोनों क्यों ज़रूरी हैं और खरीद के बाद क्या जाँचना चाहिए।',
    },
    sections: [
      {
        title: { en: 'What is land registry?', hi: 'भूमि रजिस्ट्री क्या है?' },
        body: {
          en: 'Land registry generally means the official registration of a property transfer document, such as a sale deed, with the competent Sub-Registrar. A registered deed records the names of the buyer and seller, the description and location of the property, the agreed consideration, the details of the land transferred and the date and registration particulars. A properly executed and registered sale deed is an important legal document supporting the transfer of property rights. Registration alone, however, does not settle every question about ownership, disputes or restrictions affecting the land.',
          hi: 'भूमि रजिस्ट्री का सामान्य अर्थ है बिक्री विलेख जैसे हस्तांतरण दस्तावेज़ का सक्षम उप-पंजीयक के पास आधिकारिक पंजीकरण। पंजीकृत डीड में क्रेता और विक्रेता के नाम, संपत्ति का विवरण व स्थान, तय प्रतिफल, हस्तांतरित भूमि का ब्योरा तथा तिथि और पंजीकरण विवरण दर्ज होते हैं। विधिवत निष्पादित और पंजीकृत बिक्री विलेख संपत्ति अधिकारों के हस्तांतरण का महत्वपूर्ण कानूनी दस्तावेज़ है। फिर भी केवल पंजीकरण से स्वामित्व, विवाद या भूमि पर प्रतिबंधों से जुड़े सभी प्रश्न हल नहीं होते।',
        },
      },
      {
        title: { en: 'What is mutation (Intkal)?', hi: 'इंतकाल (म्यूटेशन) क्या है?' },
        body: {
          en: 'Mutation, commonly called Intkal, is the process of updating revenue records when land rights change. If an owner sells a plot, the mutation process records the change so that the new owner’s details can be reflected in the revenue records. It may be required after a sale or purchase, inheritance after an owner’s death, a gift or other qualifying transfer, or a court order affecting recorded rights.',
          hi: 'इंतकाल भूमि अधिकार बदलने पर राजस्व अभिलेख अद्यतन करने की प्रक्रिया है। मालिक भूखंड बेचे तो इंतकाल उस परिवर्तन को दर्ज करता है ताकि नए मालिक का विवरण राजस्व अभिलेख में दिखे। यह बिक्री/खरीद, मालिक की मृत्यु पर विरासत, दान या अन्य योग्य हस्तांतरण, या दर्ज अधिकारों को प्रभावित करने वाले न्यायालय आदेश के बाद आवश्यक हो सकता है।',
        },
        note: {
          en: 'Important: mutation is primarily a revenue-record process. A mutation entry by itself does not create or conclusively establish ownership title.',
          hi: 'महत्वपूर्ण: इंतकाल मुख्यतः राजस्व अभिलेख की प्रक्रिया है। केवल इंतकाल प्रविष्टि से स्वामित्व हक़ न बनता है और न निर्णायक रूप से सिद्ध होता है।',
        },
        link: {
          href: '/en/blog/himachal-land-mutation-intkal-guide',
          label: { en: 'Read the complete Intkal guide', hi: 'पूरी इंतकाल मार्गदर्शिका पढ़ें' },
        },
      },
      {
        title: { en: 'Land registry vs mutation: key differences', hi: 'भूमि रजिस्ट्री बनाम इंतकाल: मुख्य अंतर' },
        body: {
          en: 'The two processes serve different purposes, and both should be checked when completing a land transaction.',
          hi: 'दोनों प्रक्रियाओं के उद्देश्य अलग हैं और भूमि लेन-देन पूरा करते समय दोनों की जाँच होनी चाहिए।',
        },
        list: {
          en: [
            'Land registry: Registers a legal transfer document | Records the transaction and its parties | At the time of the transfer | Sub-Registrar | Does not by itself guarantee clear title',
            'Mutation (Intkal): Updates revenue records | Reflects changes in recorded land rights | After the transfer or other change in rights | Revenue authorities (Patwari / Tehsil) | Does not independently confer title',
          ],
          hi: [
            'भूमि रजिस्ट्री: हस्तांतरण का कानूनी दस्तावेज़ पंजीकृत करती है | लेन-देन और उसके पक्षकारों को दर्ज करती है | हस्तांतरण के समय | उप-पंजीयक | अपने-आप साफ़ हक़ की गारंटी नहीं देती',
            'इंतकाल: राजस्व अभिलेख अद्यतन करता है | दर्ज भूमि अधिकारों में बदलाव दर्शाता है | हस्तांतरण या अधिकारों में बदलाव के बाद | राजस्व अधिकारी (पटवारी / तहसील) | स्वतंत्र रूप से हक़ प्रदान नहीं करता',
          ],
        },
      },
      {
        title: { en: 'Why mutation matters after buying land', hi: 'जमीन खरीदने के बाद इंतकाल क्यों ज़रूरी है' },
        body: {
          en: 'Imagine registering a sale deed and, months later, finding the previous owner’s name still in the ownership column of the Jamabandi. This may mean the mutation has not been completed, incorporated or reflected in the record you are viewing. An outdated entry can cause practical difficulties with revenue offices, future buyers, banks and other institutions that rely on updated records. After any transaction, confirm that the mutation has been processed and reflected correctly.',
          hi: 'कल्पना करें कि आपने बिक्री विलेख रजिस्टर कराया और महीनों बाद जमाबंदी के मालिक कॉलम में पिछले मालिक का नाम ही दिख रहा है। इसका अर्थ हो सकता है कि इंतकाल पूरा नहीं हुआ या आपके देखे अभिलेख में दर्ज नहीं हुआ। पुरानी प्रविष्टि से राजस्व कार्यालयों, भावी खरीदारों, बैंकों और अद्यतन अभिलेख माँगने वाली संस्थाओं के साथ व्यावहारिक कठिनाइयाँ आ सकती हैं। हर लेन-देन के बाद पुष्टि करें कि इंतकाल हो चुका है और सही दर्ज हुआ है।',
        },
      },
      {
        title: { en: 'How to check land records online in Himachal Pradesh', hi: 'हिमाचल प्रदेश में भूमि अभिलेख ऑनलाइन कैसे जाँचें' },
        body: {
          en: 'The Revenue Department provides online services for viewing land records. Open the HimBhoomi land records service, select the district, tehsil and revenue village as the portal requires, search with identifiers such as Khasra, Khata or Khatauni details, and review the Jamabandi. Compare the ownership names, land area, Khasra numbers and remarks with your property documents. For official or legal purposes, obtain the appropriate certified or digitally authenticated record rather than relying only on an online preview.',
          hi: 'राजस्व विभाग भूमि अभिलेख देखने की ऑनलाइन सेवाएँ देता है। हिमभूमि भू-अभिलेख सेवा खोलें, पोर्टल के अनुसार जिला, तहसील और राजस्व गाँव चुनें, खसरा, खाता या खतौनी विवरण से खोजें और जमाबंदी देखें। मालिकों के नाम, क्षेत्रफल, खसरा नंबर और टिप्पणी को अपने दस्तावेज़ों से मिलाएँ। आधिकारिक या कानूनी प्रयोजन के लिए केवल ऑनलाइन प्रति पर निर्भर न रहकर उपयुक्त प्रमाणित या डिजिटल रूप से सत्यापित नकल लें।',
        },
        link: {
          href: '/en/search',
          label: { en: 'Search land records', hi: 'भूमि अभिलेख खोजें' },
        },
      },
      {
        title: { en: 'What to do if mutation is pending', hi: 'इंतकाल लंबित हो तो क्या करें' },
        body: {
          en: 'If you have bought land but the ownership details are not updated, work through these steps. The procedure can vary with the type of transaction and the circumstances of the property.',
          hi: 'यदि आपने जमीन खरीदी है पर स्वामित्व विवरण अद्यतन नहीं हुआ, तो ये कदम उठाएँ। प्रक्रिया लेन-देन के प्रकार और संपत्ति की परिस्थितियों के अनुसार बदल सकती है।',
        },
        list: {
          en: [
            'Check the registration details and the mutation status.',
            'Keep the registered sale deed and supporting documents ready.',
            'Contact the concerned Patwari or Tehsil office to find out why the update is pending.',
            'Ask whether additional documents, verification or proceedings are required.',
            'Obtain the mutation order or the updated revenue record once the process is complete.',
          ],
          hi: [
            'पंजीकरण विवरण और इंतकाल की स्थिति जाँचें।',
            'पंजीकृत बिक्री विलेख और सहायक दस्तावेज़ तैयार रखें।',
            'संबंधित पटवारी या तहसील कार्यालय से अद्यतन लंबित रहने का कारण पूछें।',
            'पूछें कि अतिरिक्त दस्तावेज़, सत्यापन या कार्यवाही आवश्यक है या नहीं।',
            'प्रक्रिया पूरी होने पर इंतकाल आदेश या अद्यतन राजस्व अभिलेख प्राप्त करें।',
          ],
        },
      },
      {
        title: { en: 'Does mutation prove ownership?', hi: 'क्या इंतकाल स्वामित्व सिद्ध करता है?' },
        body: {
          en: 'Not by itself. A mutation entry is important evidence of how rights are recorded for revenue purposes, but it is not a substitute for valid title documents. A buyer should examine the sale deeds, ownership history, revenue records, restrictions, and any disputes or encumbrances. Where title is unclear, get professional legal verification before making payment.',
          hi: 'अपने-आप में नहीं। इंतकाल प्रविष्टि राजस्व प्रयोजन से अधिकार दर्ज होने का महत्वपूर्ण साक्ष्य है, पर वैध हक़ दस्तावेज़ों का विकल्प नहीं। खरीदार को बिक्री विलेख, स्वामित्व इतिहास, राजस्व अभिलेख, प्रतिबंध तथा किसी विवाद या भार की जाँच करनी चाहिए। हक़ अस्पष्ट हो तो भुगतान से पहले पेशेवर कानूनी सत्यापन कराएँ।',
        },
      },
      {
        title: { en: 'Common mistakes property buyers should avoid', hi: 'संपत्ति खरीदारों की आम गलतियाँ' },
        body: {
          en: 'Most post-purchase problems come from a few repeated assumptions.',
          hi: 'खरीद के बाद की ज़्यादातर समस्याएँ कुछ दोहराई जाने वाली धारणाओं से आती हैं।',
        },
        list: {
          en: [
            'Assuming registration means every record is updated. Always verify the mutation and later revenue entries.',
            'Checking only the seller’s name. Confirm land identification, share, area and ownership history.',
            'Ignoring joint ownership. A seller may own only a share of a larger holding, so verify exactly which rights are being transferred.',
            'Overlooking purchase restrictions. Section 118 of the H.P. Tenancy and Land Reforms Act, 1972 may require permission, so confirm whether the transaction is legally permissible.',
            'Paying before verifying. Avoid large payments based only on verbal assurances or unverified documents.',
          ],
          hi: [
            'यह मान लेना कि रजिस्ट्री होते ही सब अभिलेख अद्यतन हो गए। इंतकाल और बाद की राजस्व प्रविष्टियाँ ज़रूर जाँचें।',
            'केवल विक्रेता का नाम देखना। भूमि की पहचान, हिस्सा, क्षेत्रफल और स्वामित्व इतिहास की पुष्टि करें।',
            'संयुक्त स्वामित्व की अनदेखी। विक्रेता बड़ी होल्डिंग के केवल एक हिस्से का मालिक हो सकता है, इसलिए ठीक-ठीक देखें कि कौन-से अधिकार हस्तांतरित हो रहे हैं।',
            'खरीद प्रतिबंधों की अनदेखी। हि.प्र. काश्तकारी एवं भूमि सुधार अधिनियम, 1972 की धारा 118 में अनुमति आवश्यक हो सकती है, इसलिए लेन-देन की वैधता जाँचें।',
            'जाँच से पहले भुगतान। केवल मौखिक आश्वासन या असत्यापित दस्तावेज़ों पर बड़ी रकम न दें।',
          ],
        },
        link: {
          href: '/en/blog/section-118-permission-himachal-land-buyers',
          label: { en: 'Read the Section 118 guide', hi: 'धारा 118 मार्गदर्शिका पढ़ें' },
        },
      },
      {
        title: { en: 'Frequently Asked Questions', hi: 'अक्सर पूछे जाने वाले प्रश्न' },
        body: {
          en: 'Short answers to common questions about registration and mutation.',
          hi: 'रजिस्ट्री और इंतकाल से जुड़े आम प्रश्नों के संक्षिप्त उत्तर।',
        },
        list: {
          en: [
            'Is mutation compulsory after land registration? Where a transaction changes rights recorded in revenue records, the corresponding mutation should be processed under applicable law and procedure. The precise requirements depend on the transaction.',
            'Can land registration be completed without mutation? Registration of a qualifying document and mutation of the revenue record are distinct processes, so the revenue record may not reflect the transfer immediately.',
            'Can I check Himachal Pradesh land records online? Yes. The Revenue Department provides online access to computerised land records for available areas.',
            'Is Jamabandi the same as a sale deed? No. Jamabandi is a revenue record, whereas a sale deed is a document relating to the transfer of property rights.',
            'Does mutation guarantee ownership? No. Mutation records changes for revenue purposes but does not independently create or conclusively establish legal title.',
          ],
          hi: [
            'क्या रजिस्ट्री के बाद इंतकाल अनिवार्य है? जहाँ लेन-देन से राजस्व अभिलेख में दर्ज अधिकार बदलते हैं, वहाँ संबंधित इंतकाल लागू कानून और प्रक्रिया के अनुसार होना चाहिए। सटीक आवश्यकताएँ लेन-देन पर निर्भर हैं।',
            'क्या इंतकाल के बिना भूमि रजिस्ट्री पूरी हो सकती है? योग्य दस्तावेज़ का पंजीकरण और राजस्व अभिलेख का इंतकाल अलग प्रक्रियाएँ हैं, इसलिए राजस्व अभिलेख में हस्तांतरण तुरंत न दिखे, ऐसा हो सकता है।',
            'क्या मैं हिमाचल प्रदेश के भूमि अभिलेख ऑनलाइन देख सकता हूँ? हाँ। राजस्व विभाग उपलब्ध क्षेत्रों के कंप्यूटरीकृत भूमि अभिलेखों तक ऑनलाइन पहुँच देता है।',
            'क्या जमाबंदी और बिक्री विलेख एक ही हैं? नहीं। जमाबंदी राजस्व अभिलेख है, जबकि बिक्री विलेख संपत्ति अधिकारों के हस्तांतरण का दस्तावेज़ है।',
            'क्या इंतकाल स्वामित्व की गारंटी देता है? नहीं। इंतकाल राजस्व प्रयोजन से बदलाव दर्ज करता है, पर स्वतंत्र रूप से कानूनी हक़ न बनाता है और न निर्णायक रूप से सिद्ध करता है।',
          ],
        },
      },
    ],
    takeaway: {
      en: 'A registered sale deed and an updated revenue record serve different functions, so check both. Before completing any transaction, verify the seller’s rights, the land identification, applicable restrictions and the latest revenue records. For the revenue side, see our <a href="/en/blog/himachal-land-mutation-intkal-guide" class="takeaway-link">complete Intkal guide</a>.',
      hi: 'पंजीकृत बिक्री विलेख और अद्यतन राजस्व अभिलेख के काम अलग हैं, इसलिए दोनों जाँचें। किसी भी लेन-देन से पहले विक्रेता के अधिकार, भूमि की पहचान, लागू प्रतिबंध और नवीनतम राजस्व अभिलेख की पुष्टि करें। राजस्व पक्ष के लिए हमारी <a href="/hi/blog/himachal-land-mutation-intkal-guide" class="takeaway-link">संपूर्ण इंतकाल मार्गदर्शिका</a> देखें।',
    },
    sources: [
      { label: 'Himachal Pradesh Revenue Department', url: 'https://himachal.nic.in/revenue' },
      { label: 'HimBhoomi public land records', url: 'https://himbhoomilmk.nic.in/viewlandrecords.aspx' },
      { label: 'Himachal Pradesh Revenue Management System', url: 'https://rms.hp.gov.in/' },
      { label: 'Himachal Pradesh e-District Services', url: 'https://himseva.hp.gov.in/pages/staticSite/edistrict.xhtml' },
    ],
  },
  {
    slug: 'land-demarcation-nishandehi-himachal-pradesh',
    image: '/images/himachal-valley.jpg',
    publishedAt: '2026-11-22T14:00:00+05:30',
    readTime: { en: '9 minute guide', hi: '9 मिनट की मार्गदर्शिका' },
    title: {
      en: 'Land Demarcation (Nishandehi) in Himachal Pradesh 2026: How to Apply Online, Fees, Documents and Status',
      hi: 'हिमाचल प्रदेश में भूमि निशानदेही 2026: ऑनलाइन आवेदन, शुल्क, दस्तावेज़ और स्थिति कैसे जाँचें',
    },
    summary: {
      en: 'Who can apply for Nishandehi, the documents to prepare, how to submit the online MEGH-Demarcation request, what happens at the field visit, the fee position and how to track your application.',
      hi: 'निशानदेही के लिए कौन आवेदन कर सकता है, कौन-से दस्तावेज़ तैयार रखें, ऑनलाइन मेघ-निशानदेही अनुरोध कैसे करें, मौके पर क्या होता है, शुल्क की स्थिति और आवेदन की ट्रैकिंग कैसे करें।',
    },
    intro: {
      en: 'Are you unsure where your land ends and a neighbour’s begins? Are you buying a plot in Shimla, Solan, Kangra, Mandi or elsewhere in Himachal Pradesh and want the boundary measured officially? In these situations you may need land demarcation, commonly called Nishandehi. This guide explains who may apply, which records to prepare, how to submit an online request through the Revenue Department’s MEGH-Demarcation service, what happens during the field visit and how to follow up. The online application is a Government of Himachal Pradesh service on eHimbhoomi, not a HimLand Check service.',
      hi: 'क्या आप निश्चित नहीं कि आपकी ज़मीन कहाँ खत्म होती है और पड़ोसी की कहाँ शुरू? क्या आप शिमला, सोलन, कांगड़ा, मंडी या हिमाचल के किसी और हिस्से में भूखंड खरीद रहे हैं और सीमा की आधिकारिक माप चाहते हैं? ऐसी स्थितियों में भूमि निशानदेही की ज़रूरत पड़ सकती है। यह मार्गदर्शिका बताती है कि आवेदन कौन कर सकता है, कौन-से अभिलेख तैयार रखें, राजस्व विभाग की मेघ-निशानदेही सेवा से ऑनलाइन अनुरोध कैसे करें, मौके पर क्या होता है और आगे कैसे पूछताछ करें। ऑनलाइन आवेदन हिमाचल प्रदेश सरकार की ई-हिमभूमि सेवा है, हिमलैंड चेक की नहीं।',
    },
    sections: [
      {
        title: { en: 'What is land demarcation or Nishandehi?', hi: 'भूमि निशानदेही क्या है?' },
        body: {
          en: 'Nishandehi is the formal process of locating and marking a parcel’s boundary on the ground by reference to recognised revenue maps and records. The competent revenue authority considers the measurements, field report and objections before issuing an order. It can help when land is jointly held, an old boundary mark has disappeared or neighbouring owners disagree about the boundary. For example, you may own a Khasra parcel shown in the Jamabandi while the fence on the ground does not match the revenue map. A private mobile map or satellite image can help you understand the approximate location, but it is not a substitute for official demarcation.',
          hi: 'निशानदेही मान्यता प्राप्त राजस्व नक्शों और अभिलेखों के आधार पर भूखंड की सीमा को मौके पर खोजने और चिह्नित करने की औपचारिक प्रक्रिया है। सक्षम राजस्व अधिकारी माप, मौका रिपोर्ट और आपत्तियों पर विचार करके आदेश देता है। यह तब उपयोगी है जब भूमि संयुक्त हो, पुराना सीमा-चिह्न मिट गया हो या पड़ोसी मालिक सीमा पर असहमत हों। उदाहरण के लिए, जमाबंदी में आपका खसरा दर्ज है पर मौके की बाड़ राजस्व नक्शे से मेल नहीं खाती। निजी मोबाइल मैप या सैटेलाइट चित्र अनुमानित स्थान समझने में मदद करते हैं, पर आधिकारिक निशानदेही का विकल्प नहीं हैं।',
        },
      },
      {
        title: { en: 'Who can apply for Nishandehi?', hi: 'निशानदेही के लिए आवेदन कौन कर सकता है?' },
        citation: {
          en: 'Chapter 10, Himachal Pradesh Land Records Manual, as amended in the state’s published notification',
          hi: 'हिमाचल प्रदेश भूमि अभिलेख नियमावली का अध्याय 10, राज्य की प्रकाशित अधिसूचना के अनुसार संशोधित',
        },
        body: {
          en: 'The manual provides for an application by a co-sharer or a person with legally established title of ownership or possession. Applicants should identify the other co-sharers and relevant adjoining owners or occupants, as required for the proceedings. If you are only a prospective purchaser, ask the current landowner to arrange an appropriate demarcation, or take advice on your legal standing before applying yourself.',
          hi: 'नियमावली के अनुसार आवेदन सह-हिस्सेदार या ऐसा व्यक्ति कर सकता है जिसका स्वामित्व या कब्जे का हक़ विधिवत स्थापित हो। कार्यवाही के लिए आवश्यक अन्य सह-हिस्सेदारों और संबंधित पड़ोसी मालिकों या कब्जाधारियों की पहचान करें। केवल संभावित खरीदार हों तो वर्तमान भू-स्वामी से उपयुक्त निशानदेही कराने को कहें, या स्वयं आवेदन से पहले अपनी कानूनी स्थिति पर सलाह लें।',
        },
      },
      {
        title: { en: 'Documents required for land demarcation', hi: 'निशानदेही के लिए आवश्यक दस्तावेज़' },
        citation: {
          en: 'Revenue Department MEGH-Demarcation checklist',
          hi: 'राजस्व विभाग की मेघ-निशानदेही चेकलिस्ट',
        },
        body: {
          en: 'Prepare the documents listed in the Revenue Department’s official checklist. The applicant’s contact details, identification and relevant title documents should also be at hand, because the office may ask for more depending on the case. Do not assume that an online entry replaces the documentary submission required by the published procedure.',
          hi: 'राजस्व विभाग की आधिकारिक चेकलिस्ट में बताए दस्तावेज़ तैयार रखें। आवेदक का संपर्क विवरण, पहचान और संबंधित हक़ दस्तावेज़ भी साथ रखें, क्योंकि कार्यालय मामले के अनुसार और कागज़ माँग सकता है। यह न मानें कि ऑनलाइन प्रविष्टि प्रकाशित प्रक्रिया में माँगी गई दस्तावेज़ी प्रस्तुति का स्थान ले लेती है।',
        },
        list: {
          en: [
            'Latest Jamabandi (Record of Rights), to identify the holding, ownership and Khasra numbers.',
            'Mutation sheet, where the Khasra number has been subdivided and the mutation is relevant to the application.',
            'Current settlement map (Musavi) showing the land and adjoining Khasra numbers or subdivisions.',
            'Prescribed process fee, as instructed by the concerned Tehsil or Sub-Tehsil.',
          ],
          hi: [
            'नवीनतम जमाबंदी (अधिकार अभिलेख), ताकि होल्डिंग, स्वामित्व और खसरा नंबर पहचाने जा सकें।',
            'इंतकाल शीट, जहाँ खसरा नंबर का उप-विभाजन हुआ हो और इंतकाल आवेदन से संबंधित हो।',
            'वर्तमान बंदोबस्त नक्शा (मुसावी), जिसमें भूमि और आसपास के खसरा नंबर या उप-विभाजन दिखें।',
            'निर्धारित प्रोसेस फीस, जैसा संबंधित तहसील या उप-तहसील निर्देश दे।',
          ],
        },
      },
      {
        title: { en: 'How to apply for Nishandehi online', hi: 'निशानदेही के लिए ऑनलाइन आवेदन कैसे करें' },
        body: {
          en: 'Step 1: open the official eHimbhoomi online demarcation request page. If it is unavailable, start at the eHimbhoomi citizen services homepage and choose Demarcation. Step 2: enter the land details the portal asks for. The departmental circular explains that the module uses land details from the revenue database, so check the district, Tehsil or Sub-Tehsil, village and parcel identifiers against your current Jamabandi, because portal labels may change. Step 3: after submitting, save the acknowledgement number and any confirmation or printout. Step 4: the department’s published instructions require you to mention the acknowledgement number on the application and submit the prescribed annexures to the concerned Tehsil or Sub-Tehsil, so check whether a newer electronic submission arrangement applies to your case. Step 5: watch for scrutiny and the field date. If the application is in order it can be forwarded to the Field Kanungo, who fixes a demarcation date and updates the online system. If there are objections or deficiencies, the application may need clarification or may be rejected with reasons.',
          hi: 'चरण 1: ई-हिमभूमि का आधिकारिक ऑनलाइन निशानदेही अनुरोध पृष्ठ खोलें। न खुले तो ई-हिमभूमि नागरिक सेवाएँ होमपेज से “Demarcation” चुनें। चरण 2: पोर्टल जो भूमि विवरण माँगे वह भरें। विभागीय परिपत्र के अनुसार मॉड्यूल राजस्व डेटाबेस के भूमि विवरण का उपयोग करता है, इसलिए जिला, तहसील/उप-तहसील, गाँव और भूखंड पहचान अपनी वर्तमान जमाबंदी से मिलाएँ; पोर्टल के लेबल बदल सकते हैं। चरण 3: जमा करने के बाद पावती संख्या और उपलब्ध पुष्टि या प्रिंटआउट सुरक्षित रखें। चरण 4: विभाग के प्रकाशित निर्देशों के अनुसार आवेदन पर पावती संख्या लिखें और निर्धारित संलग्नक संबंधित तहसील/उप-तहसील में जमा करें; पूछ लें कि आपके मामले में कोई नई इलेक्ट्रॉनिक प्रस्तुति व्यवस्था लागू है या नहीं। चरण 5: जाँच और मौका तिथि पर नज़र रखें। आवेदन सही हो तो वह फील्ड कानूनगो को भेजा जा सकता है, जो निशानदेही की तिथि तय करके ऑनलाइन प्रणाली अद्यतन करता है। आपत्ति या कमी होने पर स्पष्टीकरण माँगा जा सकता है या कारण सहित आवेदन अस्वीकार हो सकता है।',
        },
        link: {
          href: 'https://ehimbhoomi.nic.in/Demarcation/frmOnlineDemReq.aspx',
          label: { en: 'Open the official demarcation request page', hi: 'आधिकारिक निशानदेही अनुरोध पृष्ठ खोलें' },
        },
      },
      {
        title: { en: 'What happens during the field inspection?', hi: 'मौका निरीक्षण के दौरान क्या होता है?' },
        body: {
          en: 'On the scheduled date the authorised officer or Field Kanungo measures the land using the relevant revenue map and recognised reference points. The amended manual describes procedures involving fixed reference points, field measurements and, where suitable, electronic survey equipment. The field report should document the method and points used, parties present or absent, measurements and any objections. The Tehsildar, Naib Tehsildar or competent revenue officer then considers the report and passes the appropriate order.',
          hi: 'निर्धारित तिथि पर अधिकृत अधिकारी या फील्ड कानूनगो संबंधित राजस्व नक्शे और मान्य संदर्भ बिंदुओं से माप करता है। संशोधित नियमावली में स्थिर संदर्भ बिंदुओं, मौका माप और उपयुक्त होने पर इलेक्ट्रॉनिक सर्वे उपकरणों की प्रक्रिया बताई गई है। मौका रिपोर्ट में प्रयुक्त विधि और बिंदु, उपस्थित या अनुपस्थित पक्ष, माप और आपत्तियाँ दर्ज होनी चाहिए। इसके बाद तहसीलदार, नायब तहसीलदार या सक्षम राजस्व अधिकारी रिपोर्ट पर विचार करके उचित आदेश देता है।',
        },
        list: {
          en: [
            'Keep the parcel and the access routes to it identifiable.',
            'Make sure concerned co-sharers and adjoining parties receive the required notices through the official process.',
            'Observe the measurement and raise any genuine objection through the appropriate record.',
            'Do not treat an informal fence line or a private GPS pin as the final legal boundary.',
          ],
          hi: [
            'भूखंड और उस तक पहुँच के रास्ते पहचाने जा सकें, यह सुनिश्चित करें।',
            'संबंधित सह-हिस्सेदारों और पड़ोसी पक्षों को आधिकारिक प्रक्रिया से आवश्यक नोटिस मिलें, यह देखें।',
            'माप के समय उपस्थित रहें और वास्तविक आपत्ति उचित अभिलेख में दर्ज कराएँ।',
            'अनौपचारिक बाड़ या निजी जीपीएस पिन को अंतिम कानूनी सीमा न मानें।',
          ],
        },
      },
      {
        title: { en: 'Nishandehi fees in Himachal Pradesh', hi: 'हिमाचल प्रदेश में निशानदेही शुल्क' },
        body: {
          en: 'The Revenue Department’s published MEGH procedure refers to a ₹6 court fee for a specified class of applications under a cited notification, and separately lists a process fee as prescribed under the rules. These are not necessarily the only charges payable in every situation.',
          hi: 'राजस्व विभाग की प्रकाशित मेघ प्रक्रिया में एक उद्धृत अधिसूचना के अंतर्गत आवेदनों की निर्दिष्ट श्रेणी के लिए ₹6 कोर्ट फीस का उल्लेख है और अलग से नियमों के अनुसार निर्धारित प्रोसेस फीस बताई गई है। हर स्थिति में केवल यही शुल्क देय हों, यह ज़रूरी नहीं।',
        },
        note: {
          en: 'Before paying, verify the current court fee, process fee and any case-specific requirements with your Tehsil or Sub-Tehsil or the live government portal. Do not rely on any blog, including this one, that presents ₹6 as a universal all-inclusive demarcation fee.',
          hi: 'भुगतान से पहले वर्तमान कोर्ट फीस, प्रोसेस फीस और मामले की विशेष आवश्यकताएँ अपनी तहसील/उप-तहसील या सक्रिय सरकारी पोर्टल से पुष्ट करें। किसी भी ब्लॉग, इस सहित, पर भरोसा न करें जो ₹6 को निशानदेही का सार्वभौमिक और संपूर्ण शुल्क बताता हो।',
        },
      },
      {
        title: { en: 'How to check the application status', hi: 'आवेदन की स्थिति कैसे जाँचें' },
        body: {
          en: 'Use your acknowledgement number through the demarcation module, or ask the concerned Tehsil or Sub-Tehsil to check the record if online tracking is unavailable. Under the published workflow the record may move through submission, office scrutiny, referral to the Field Kanungo, date fixing, field report and final order. Save copies of the acknowledgement, submissions, notices and final order for your property file. If the application is delayed, contact the dealing revenue office with the acknowledgement number and application date.',
          hi: 'पावती संख्या से निशानदेही मॉड्यूल में स्थिति देखें, या ऑनलाइन ट्रैकिंग उपलब्ध न हो तो संबंधित तहसील/उप-तहसील से रिकॉर्ड जँचवाएँ। प्रकाशित कार्यप्रवाह में रिकॉर्ड प्रस्तुति, कार्यालय जाँच, फील्ड कानूनगो को प्रेषण, तिथि निर्धारण, मौका रिपोर्ट और अंतिम आदेश के चरणों से गुज़र सकता है। पावती, जमा किए कागज़, नोटिस और अंतिम आदेश की प्रतियाँ अपनी संपत्ति फ़ाइल में रखें। देरी हो तो पावती संख्या और आवेदन तिथि के साथ संबंधित राजस्व कार्यालय से संपर्क करें।',
        },
      },
      {
        title: { en: 'How long does land demarcation take?', hi: 'निशानदेही में कितना समय लगता है?' },
        body: {
          en: 'Check time limits against the current rules that apply to your case. An older MEGH checklist quotes a three-month period for the Field Kanungo under the earlier Land Records Manual procedure, while more recent state reporting describes a two-month target for Nishandehi cases. Because published documents and reported service targets differ, ask the concerned revenue office which current deadline governs your application. Neither figure guarantees a completion date for an individual case.',
          hi: 'समय-सीमा अपने मामले पर लागू वर्तमान नियमों से जाँचें। पुरानी मेघ चेकलिस्ट में पूर्व भूमि अभिलेख नियमावली प्रक्रिया के अंतर्गत फील्ड कानूनगो के लिए तीन माह बताए गए हैं, जबकि हाल की राज्य रिपोर्टिंग में निशानदेही मामलों के लिए दो माह का लक्ष्य बताया गया है। प्रकाशित दस्तावेज़ों और बताए गए सेवा लक्ष्यों में अंतर है, इसलिए संबंधित राजस्व कार्यालय से पूछें कि आपके आवेदन पर कौन-सी वर्तमान समय-सीमा लागू है। कोई भी आँकड़ा किसी व्यक्तिगत मामले की पूर्ति तिथि की गारंटी नहीं देता।',
        },
      },
      {
        title: { en: 'What if your neighbour disagrees?', hi: 'पड़ोसी असहमत हो तो क्या होगा?' },
        body: {
          en: 'Demarcation is a formal revenue proceeding, not simply a private measurement. The competent revenue officer may consider the objections of adjoining owners and co-sharers before accepting a report. If an objection is sustainable, the manual provides for re-demarcation and a reasoned decision. Where title, possession or wider legal rights are contested, a separate legal remedy may be necessary.',
          hi: 'निशानदेही औपचारिक राजस्व कार्यवाही है, केवल निजी माप नहीं। सक्षम राजस्व अधिकारी रिपोर्ट स्वीकार करने से पहले पड़ोसी मालिकों और सह-हिस्सेदारों की आपत्तियों पर विचार कर सकता है। आपत्ति टिकने योग्य हो तो नियमावली में पुनः निशानदेही और तर्कसंगत निर्णय का प्रावधान है। जहाँ हक़, कब्जा या व्यापक कानूनी अधिकार विवादित हों, वहाँ अलग कानूनी उपचार आवश्यक हो सकता है।',
        },
      },
      {
        title: { en: 'Nishandehi vs Tatima vs BhuNaksha vs Jamabandi', hi: 'निशानदेही बनाम ततीमा बनाम भू-नक्शा बनाम जमाबंदी' },
        body: {
          en: 'These four terms are often mixed up. A digital map does not, by itself, settle a disputed physical boundary.',
          hi: 'ये चारों शब्द अक्सर आपस में उलझ जाते हैं। डिजिटल नक्शा अपने-आप किसी विवादित भौतिक सीमा का समाधान नहीं करता।',
        },
        list: {
          en: [
            'Nishandehi: Official field demarcation of a land boundary | When the boundary on the ground is unclear or disputed | Revenue authorities (Field Kanungo, Tehsildar) | An order follows the field report',
            'Tatima: A map extract or plan for a plot or subdivision | When you need the plot or subdivision plan | Revenue Department | A reference document, not a boundary order',
            'BhuNaksha: A digital viewer of available cadastral parcel maps | For a quick look at a parcel and its neighbours | Government portal | A helpful reference only',
            'Jamabandi: Revenue record of rights and land holding | To check ownership, shares and Khasra numbers | Revenue Department | A revenue record, not a boundary determination',
          ],
          hi: [
            'निशानदेही: भूमि सीमा की आधिकारिक मौका माप | जब मौके की सीमा अस्पष्ट या विवादित हो | राजस्व अधिकारी (फील्ड कानूनगो, तहसीलदार) | मौका रिपोर्ट के बाद आदेश होता है',
            'ततीमा: भूखंड या उप-विभाजन का नक्शा अंश या योजना | जब भूखंड या उप-विभाजन की योजना चाहिए | राजस्व विभाग | संदर्भ दस्तावेज़, सीमा आदेश नहीं',
            'भू-नक्शा: उपलब्ध कैडस्ट्रल भूखंड नक्शों का डिजिटल दर्शक | भूखंड और पड़ोसियों की त्वरित झलक के लिए | सरकारी पोर्टल | केवल सहायक संदर्भ',
            'जमाबंदी: अधिकार और भूमि होल्डिंग का राजस्व अभिलेख | स्वामित्व, हिस्से और खसरा नंबर जाँचने के लिए | राजस्व विभाग | राजस्व अभिलेख, सीमा निर्धारण नहीं',
          ],
        },
        link: {
          href: '/en/blog/tatima-plot-map-boundary-access-check',
          label: { en: 'Read the Tatima, plot boundary and road access guide', hi: 'ततीमा, भूखंड सीमा और सड़क पहुँच मार्गदर्शिका पढ़ें' },
        },
      },
      {
        title: { en: 'Checklist before requesting a boundary survey', hi: 'सीमा माप का अनुरोध करने से पहले चेकलिस्ट' },
        body: {
          en: 'Run through these points before you apply.',
          hi: 'आवेदन से पहले इन बिंदुओं को देख लें।',
        },
        list: {
          en: [
            'Match the Khasra number against the latest Jamabandi.',
            'Obtain the relevant current Musavi or settlement map.',
            'Check for subdivisions and obtain the applicable mutation sheet.',
            'Identify co-sharers and adjacent landholders.',
            'Keep the online acknowledgement number and the office receipt.',
            'Confirm the field visit date and the prescribed fee.',
            'Obtain the final report and order, and retain them safely.',
          ],
          hi: [
            'खसरा नंबर को नवीनतम जमाबंदी से मिलाएँ।',
            'संबंधित वर्तमान मुसावी या बंदोबस्त नक्शा प्राप्त करें।',
            'उप-विभाजन की जाँच करें और लागू इंतकाल शीट लें।',
            'सह-हिस्सेदारों और सटे भू-धारकों की पहचान करें।',
            'ऑनलाइन पावती संख्या और कार्यालय की रसीद रखें।',
            'मौका तिथि और निर्धारित शुल्क की पुष्टि करें।',
            'अंतिम रिपोर्ट और आदेश प्राप्त करके सुरक्षित रखें।',
          ],
        },
      },
      {
        title: { en: 'Frequently Asked Questions', hi: 'अक्सर पूछे जाने वाले प्रश्न' },
        body: {
          en: 'Short answers to common questions about Nishandehi.',
          hi: 'निशानदेही से जुड़े आम प्रश्नों के संक्षिप्त उत्तर।',
        },
        list: {
          en: [
            'Can I apply for land demarcation online in Himachal Pradesh? Yes. The state publishes a MEGH-Demarcation request service on eHimbhoomi. The published process also calls for supporting documents to be submitted to the concerned Tehsil or Sub-Tehsil.',
            'Do I need a Jamabandi for Nishandehi? Yes. The official checklist specifies a copy of the latest Jamabandi, along with other documents depending on the parcel.',
            'Is a BhuNaksha screenshot enough to prove my boundary? No. Online map views are helpful references but do not replace a formal field demarcation and the competent revenue officer’s order.',
            'Can joint land be demarcated? The published rules allow qualifying co-sharers to apply. Other co-sharers and neighbouring parties may need to be included in the proceedings.',
            'Does demarcation decide who legally owns the land? Demarcation addresses the identification of boundaries. It should not be treated as a substitute for a complete title examination or as automatic resolution of every ownership dispute.',
            'Where can I complain if my application is delayed? Start with the concerned Tehsil or Sub-Tehsil, quoting your acknowledgement number. Ask what stage the application has reached and which current statutory or service timeline applies.',
          ],
          hi: [
            'क्या मैं हिमाचल प्रदेश में भूमि निशानदेही के लिए ऑनलाइन आवेदन कर सकता हूँ? हाँ। राज्य ई-हिमभूमि पर मेघ-निशानदेही अनुरोध सेवा प्रकाशित करता है। प्रकाशित प्रक्रिया में सहायक दस्तावेज़ संबंधित तहसील/उप-तहसील में जमा करने की भी अपेक्षा है।',
            'क्या निशानदेही के लिए जमाबंदी चाहिए? हाँ। आधिकारिक चेकलिस्ट में नवीनतम जमाबंदी की प्रति और भूखंड के अनुसार अन्य दस्तावेज़ बताए गए हैं।',
            'क्या भू-नक्शा का स्क्रीनशॉट मेरी सीमा सिद्ध करने के लिए काफ़ी है? नहीं। ऑनलाइन नक्शे उपयोगी संदर्भ हैं पर औपचारिक मौका निशानदेही और सक्षम राजस्व अधिकारी के आदेश का स्थान नहीं लेते।',
            'क्या संयुक्त भूमि की निशानदेही हो सकती है? प्रकाशित नियम योग्य सह-हिस्सेदारों को आवेदन की अनुमति देते हैं। अन्य सह-हिस्सेदारों और पड़ोसी पक्षों को कार्यवाही में शामिल करना पड़ सकता है।',
            'क्या निशानदेही तय करती है कि ज़मीन का कानूनी मालिक कौन है? निशानदेही सीमाओं की पहचान से संबंधित है। इसे पूर्ण हक़ जाँच का विकल्प या हर स्वामित्व विवाद का अपने-आप समाधान न मानें।',
            'आवेदन में देरी हो तो शिकायत कहाँ करें? पावती संख्या बताकर संबंधित तहसील/उप-तहसील से शुरू करें। पूछें कि आवेदन किस चरण में है और कौन-सी वर्तमान वैधानिक या सेवा समय-सीमा लागू है।',
          ],
        },
      },
    ],
    takeaway: {
      en: 'Before building a fence, paying for a disputed plot or assuming a map screenshot settles a boundary, compare the latest Jamabandi and settlement map and consider formal Nishandehi where needed. The online service lets you start and track the process, but field verification and the revenue authority’s order are what count. For the map side, see our <a href="/en/blog/tatima-plot-map-boundary-access-check" class="takeaway-link">Tatima and plot boundary guide</a>.',
      hi: 'बाड़ लगाने, विवादित भूखंड का भुगतान करने या नक्शे के स्क्रीनशॉट को सीमा का प्रमाण मानने से पहले नवीनतम जमाबंदी और बंदोबस्त नक्शा मिलाएँ और ज़रूरत हो तो औपचारिक निशानदेही पर विचार करें। ऑनलाइन सेवा प्रक्रिया शुरू करने और ट्रैक करने देती है, पर मौका सत्यापन और राजस्व अधिकारी का आदेश ही निर्णायक हैं। नक्शे के पक्ष के लिए हमारी <a href="/hi/blog/tatima-plot-map-boundary-access-check" class="takeaway-link">ततीमा और भूखंड सीमा मार्गदर्शिका</a> देखें।',
    },
    sources: [
      { label: 'eHimbhoomi online demarcation request', url: 'https://ehimbhoomi.nic.in/Demarcation/frmOnlineDemReq.aspx' },
      { label: 'District Una: Apply for demarcation of land', url: 'https://hpuna.nic.in/service/apply-for-demarcation-of-land/' },
      { label: 'Revenue Department MEGH-Demarcation procedure and checklist (PDF)', url: 'https://emerginghimachal.hp.gov.in/themes/backend/uploads/notification/Notification/new/dem.pdf' },
      { label: 'H.P. Land Records Manual: demarcation chapter notification (PDF)', url: 'https://rajpatrahimachal.nic.in/openFile.aspx?etype=Notice&id=13687' },
      { label: 'Himachal Pradesh Revenue Department', url: 'https://himachal.nic.in/revenue' },
    ],
  },
  {
    slug: 'stamp-duty-registration-charges-himachal-pradesh-2026',
    image: '/images/seven-land-documents.webp',
    publishedAt: '2026-11-22T16:00:00+05:30',
    readTime: { en: '10 minute guide', hi: '10 मिनट की मार्गदर्शिका' },
    title: {
      en: 'Stamp Duty and Registration Charges for Buying Land in Himachal Pradesh 2026: Rates, Examples and Calculator',
      hi: 'हिमाचल प्रदेश में जमीन खरीदने पर स्टाम्प शुल्क और पंजीकरण खर्च 2026: दरें, उदाहरण और कैलकुलेटर',
    },
    summary: {
      en: 'The 2026 stamp duty slabs for sale deeds, the one-year linked-deed rule, the 12% rate with Section 118 permission, family gifts and leases, with worked examples you can reproduce in our calculator.',
      hi: 'बिक्री विलेख की 2026 स्टाम्प शुल्क दरें, एक वर्ष के जुड़े विलेखों का नियम, धारा 118 अनुमति पर 12% दर, पारिवारिक उपहार और पट्टे, साथ में हल किए उदाहरण जिन्हें आप हमारे कैलकुलेटर में दोहरा सकते हैं।',
    },
    intro: {
      en: 'Stamp duty is usually the largest cost after the price of the land itself, and in Himachal Pradesh it changed in 2026. The Indian Stamp (Himachal Pradesh Second Amendment) Act, 2026 (Act No. 17 of 2026) substituted a new Schedule I-A. A legal-update report records that it was issued on 28 October 2026. This guide explains how the new schedule treats ordinary sale deeds, how linked deeds are added together, when the 12% rate applies, and how gifts and leases are charged. Every example uses the same rules as the HimLand Check stamp duty calculator, so you can reproduce the figures yourself. The calculator gives an estimate, not an official assessment, so confirm the final amount with your Sub-Registrar before paying.',
      hi: 'जमीन की कीमत के बाद स्टाम्प शुल्क आमतौर पर सबसे बड़ा खर्च होता है, और हिमाचल प्रदेश में 2026 में इसमें बदलाव हुआ। भारतीय स्टाम्प (हिमाचल प्रदेश द्वितीय संशोधन) अधिनियम, 2026 (अधिनियम संख्या 17/2026) ने नई अनुसूची I-A लागू की। एक कानूनी अपडेट रिपोर्ट के अनुसार यह 28 अक्टूबर 2026 को जारी हुआ। यह मार्गदर्शिका बताती है कि नई अनुसूची साधारण बिक्री विलेख को कैसे देखती है, जुड़े विलेख कैसे जोड़े जाते हैं, 12% दर कब लगती है और उपहार तथा पट्टे पर शुल्क कैसे लगता है। हर उदाहरण हिमलैंड चेक स्टाम्प शुल्क कैलकुलेटर के उन्हीं नियमों पर है, इसलिए आप आँकड़े खुद दोहरा सकते हैं। कैलकुलेटर अनुमान देता है, आधिकारिक निर्धारण नहीं, इसलिए भुगतान से पहले अंतिम राशि उप-पंजीयक से पुष्ट करें।',
    },
    sections: [
      {
        title: { en: 'Stamp duty and registration fee are two different charges', hi: 'स्टाम्प शुल्क और पंजीकरण शुल्क दो अलग खर्च हैं' },
        body: {
          en: 'Stamp duty is the tax paid on the deed, calculated from the value and the deed type. The registration fee is a separate charge paid when the deed is registered with the Sub-Registrar, and the calculator estimates it at 2% of the property value used for stamp duty. Many online pages mix the two charges together. If the Sub-Registrar quotes a different registration fee for your deed, type it into the calculator to replace the estimate, and confirm the final figure at the counter before you budget.',
          hi: 'स्टाम्प शुल्क वह कर है जो विलेख पर मूल्य और विलेख के प्रकार के आधार पर लगता है। पंजीकरण शुल्क अलग है और विलेख उप-पंजीयक के यहाँ पंजीकृत कराते समय दिया जाता है; कैलकुलेटर इसका अनुमान स्टाम्प शुल्क के लिए प्रयुक्त संपत्ति मूल्य के 2% पर लगाता है। कई ऑनलाइन पन्ने दोनों शुल्कों को मिला देते हैं। उप-पंजीयक आपके विलेख के लिए अलग पंजीकरण शुल्क बताएं तो उसे कैलकुलेटर में दर्ज करके अनुमान बदल लें, और बजट बनाने से पहले अंतिम राशि काउंटर पर पुष्ट करें।',
        },
      },
      {
        title: { en: 'Stamp duty rates on a sale deed in 2026', hi: '2026 में बिक्री विलेख पर स्टाम्प शुल्क दरें' },
        citation: {
          en: 'Indian Stamp (Himachal Pradesh Second Amendment) Act, 2026 (Act No. 17 of 2026), Schedule I-A',
          hi: 'भारतीय स्टाम्प (हिमाचल प्रदेश द्वितीय संशोधन) अधिनियम, 2026 (अधिनियम संख्या 17/2026), अनुसूची I-A',
        },
        body: {
          en: 'For an ordinary sale deed the rate depends on who is buying and on the value of the property. Once the value crosses the threshold, the higher rate applies to the whole value, not only to the amount above the threshold.',
          hi: 'साधारण बिक्री विलेख पर दर इस पर निर्भर करती है कि खरीदार कौन है और संपत्ति का मूल्य कितना है। मूल्य सीमा पार करते ही ऊँची दर पूरे मूल्य पर लगती है, केवल सीमा से ऊपर की राशि पर नहीं।',
        },
        list: {
          en: [
            'Woman buyer: 4% where the value is up to ₹1 crore, and 8% above ₹1 crore.',
            'Other buyers: 6% where the value is up to ₹40 lakh, and 8% above ₹40 lakh.',
            'Linked deeds between the same parties within one year are added together before the threshold is tested (see the section on linked deeds).',
            'A flat 12% applies where the State has granted permission under Section 118(2)(h) (see the section on Section 118).',
          ],
          hi: [
            'महिला खरीदार: ₹1 करोड़ तक मूल्य पर 4% और ₹1 करोड़ से ऊपर 8%।',
            'अन्य खरीदार: ₹40 लाख तक मूल्य पर 6% और ₹40 लाख से ऊपर 8%।',
            'एक वर्ष के भीतर उन्हीं पक्षों के जुड़े विलेख सीमा जाँचने से पहले जोड़े जाते हैं (जुड़े विलेख वाला अनुभाग देखें)।',
            'जहाँ राज्य ने धारा 118(2)(h) के तहत अनुमति दी हो वहाँ एकसमान 12% लगता है (धारा 118 वाला अनुभाग देखें)।',
          ],
        },
        note: {
          en: 'Early reporting on the Bill said the 4% women’s slab was raised from ₹80 lakh to ₹1 crore. If you are comparing with an older article, check that its slabs are not from before 2026.',
          hi: 'विधेयक पर शुरुआती रिपोर्टों में कहा गया कि महिलाओं की 4% की सीमा ₹80 लाख से बढ़ाकर ₹1 करोड़ की गई। किसी पुराने लेख से तुलना कर रहे हों तो देखें कि उसकी सीमाएँ 2026 से पहले की तो नहीं।',
        },
      },
      {
        title: { en: 'Which value is used: market value or agreed price?', hi: 'कौन-सा मूल्य लगता है: बाज़ार मूल्य या तय कीमत?' },
        body: {
          en: 'On an ordinary sale the calculator applies the rate to the higher of the assessed market value and the agreed purchase price. Market value depends on the location, the land classification and the valuation that applies to the property, so it can be well above the price in your agreement. Enter the assessed value for the whole property. For a first look at official rates in your area, use the circle rate lookup, then confirm the final valuation with the Sub-Registrar.',
          hi: 'साधारण बिक्री में कैलकुलेटर आँके गए बाज़ार मूल्य और तय खरीद कीमत में से जो अधिक हो उस पर दर लगाता है। बाज़ार मूल्य स्थान, भूमि वर्गीकरण और लागू मूल्यांकन पर निर्भर है, इसलिए वह आपके समझौते की कीमत से काफ़ी ऊपर हो सकता है। पूरी संपत्ति का आँका गया मूल्य भरें। अपने क्षेत्र की आधिकारिक दरें पहली बार देखने के लिए सर्कल रेट खोज का उपयोग करें, फिर अंतिम मूल्यांकन उप-पंजीयक से पुष्ट करें।',
        },
        link: {
          href: '/en/circle-rate',
          label: { en: 'Open the circle rate lookup', hi: 'सर्कल रेट खोज खोलें' },
        },
      },
      {
        title: { en: 'Worked examples you can reproduce in the calculator', hi: 'हल किए उदाहरण जो आप कैलकुलेटर में दोहरा सकते हैं' },
        body: {
          en: 'These examples assume the assessed market value is the higher figure and that no earlier deeds between the same parties fall within the last year. The figures below are stamp duty only. The calculator adds the registration fee at 2% of the same value on top, for example ₹60,000 on a ₹30 lakh property.',
          hi: 'इन उदाहरणों में माना गया है कि आँका गया बाज़ार मूल्य अधिक है और पिछले एक वर्ष में उन्हीं पक्षों के बीच कोई पूर्व विलेख नहीं है। नीचे के आँकड़े केवल स्टाम्प शुल्क के हैं। कैलकुलेटर उसी मूल्य के 2% पर पंजीकरण शुल्क ऊपर से जोड़ता है, जैसे ₹30 लाख की संपत्ति पर ₹60,000।',
        },
        list: {
          en: [
            'Woman buyer, ₹30 lakh: 4% gives ₹1,20,000.',
            'Other buyer, ₹30 lakh: 6% gives ₹1,80,000.',
            'Other buyer, exactly ₹40 lakh: 6% gives ₹2,40,000.',
            'Other buyer, ₹41 lakh: 8% on the whole value gives ₹3,28,000. One extra lakh of value adds ₹88,000 of duty.',
            'Other buyer, ₹50 lakh: 8% gives ₹4,00,000.',
            'Woman buyer, exactly ₹1 crore: 4% gives ₹4,00,000.',
            'Woman buyer, ₹1.2 crore: 8% gives ₹9,60,000.',
            'Section 118 permission, ₹50 lakh: 12% gives ₹6,00,000.',
          ],
          hi: [
            'महिला खरीदार, ₹30 लाख: 4% से ₹1,20,000।',
            'अन्य खरीदार, ₹30 लाख: 6% से ₹1,80,000।',
            'अन्य खरीदार, ठीक ₹40 लाख: 6% से ₹2,40,000।',
            'अन्य खरीदार, ₹41 लाख: पूरे मूल्य पर 8% से ₹3,28,000। मूल्य में एक लाख अधिक होने पर शुल्क ₹88,000 बढ़ जाता है।',
            'अन्य खरीदार, ₹50 लाख: 8% से ₹4,00,000।',
            'महिला खरीदार, ठीक ₹1 करोड़: 4% से ₹4,00,000।',
            'महिला खरीदार, ₹1.2 करोड़: 8% से ₹9,60,000।',
            'धारा 118 अनुमति, ₹50 लाख: 12% से ₹6,00,000।',
          ],
        },
        note: {
          en: 'The jump at the threshold is why the assessed value matters so much. A small difference in valuation near ₹40 lakh or ₹1 crore can change the duty by lakhs of rupees, so confirm the valuation early.',
          hi: 'सीमा पर यह उछाल ही कारण है कि आँका गया मूल्य इतना मायने रखता है। ₹40 लाख या ₹1 करोड़ के पास मूल्यांकन में थोड़ा अंतर भी शुल्क को लाखों रुपये से बदल सकता है, इसलिए मूल्यांकन जल्दी पुष्ट करें।',
        },
        link: {
          href: '/en/stamp-duty-calculator',
          label: { en: 'Try these in the stamp duty calculator', hi: 'ये उदाहरण स्टाम्प शुल्क कैलकुलेटर में आज़माएँ' },
        },
      },
      {
        title: { en: 'The one-year rule for linked deeds', hi: 'जुड़े विलेखों पर एक वर्ष का नियम' },
        body: {
          en: 'The new schedule was designed to stop a buyer splitting one purchase into several smaller deeds to stay under a threshold. Reports on the Bill say that deeds between the same buyer and seller within a one-year period are considered together if their combined value crosses the threshold, and duty is then worked out on the aggregated value. In the calculator, enter the value of earlier same-party deeds from the last year in the optional field, and it will flag that the higher rate applies. The calculator shows duty on the current deed only. The earlier deeds may also need to be repriced at 8%, and the Sub-Registrar calculates that adjustment.',
          hi: 'नई अनुसूची इसलिए बनी कि कोई खरीदार एक खरीद को कई छोटे विलेखों में बाँटकर सीमा के नीचे न रह सके। विधेयक पर रिपोर्टें बताती हैं कि एक ही खरीदार और विक्रेता के बीच एक वर्ष के भीतर के विलेख, यदि उनका संयुक्त मूल्य सीमा पार करे, साथ गिने जाते हैं और शुल्क जोड़े गए मूल्य पर निकाला जाता है। कैलकुलेटर में पिछले वर्ष के उन्हीं पक्षों के पूर्व विलेखों का मूल्य वैकल्पिक खाने में भरें, वह बताएगा कि ऊँची दर लगेगी। कैलकुलेटर केवल वर्तमान विलेख पर शुल्क दिखाता है। पूर्व विलेखों को भी 8% पर पुनः आँकना पड़ सकता है और वह समायोजन उप-पंजीयक निकालता है।',
        },
      },
      {
        title: { en: 'The 12% rate with Section 118 permission', hi: 'धारा 118 अनुमति पर 12% दर' },
        body: {
          en: 'Where the State Government has granted permission under Section 118(2)(h) of the H.P. Tenancy and Land Reforms Act, 1972, a sale or lease is charged at 12%. The calculator applies this whichever gender the buyer is, and for fixed-term leases it still uses the lease duration in the formula. Tick the Section 118 option only if you actually hold the permission order. Permission itself is a separate legal step, covered in our Section 118 guide.',
          hi: 'जहाँ राज्य सरकार ने हि.प्र. काश्तकारी एवं भूमि सुधार अधिनियम, 1972 की धारा 118(2)(h) के तहत अनुमति दी हो, वहाँ बिक्री या पट्टे पर 12% लगता है। कैलकुलेटर यह खरीदार के लिंग से स्वतंत्र लागू करता है, और निश्चित अवधि के पट्टे में सूत्र में पट्टे की अवधि ही प्रयोग करता है। धारा 118 का विकल्प तभी चुनें जब आपके पास अनुमति आदेश हो। अनुमति स्वयं एक अलग कानूनी चरण है, जो हमारी धारा 118 मार्गदर्शिका में समझाया गया है।',
        },
        link: {
          href: '/en/blog/section-118-permission-himachal-land-buyers',
          label: { en: 'Read the Section 118 guide', hi: 'धारा 118 मार्गदर्शिका पढ़ें' },
        },
      },
      {
        title: { en: 'Gifts between family members', hi: 'परिवार के सदस्यों के बीच उपहार' },
        body: {
          en: 'Qualifying gifts between spouses or between blood relatives with a common ancestor are charged at 0.1% of the market value, with a minimum of ₹5,000 and a maximum of ₹10,000. For example, a family gift of land worth ₹50 lakh would be 0.1% of the value, which is ₹5,000, so the minimum applies. Gifts that do not qualify as family gifts follow the standard thresholds above. After a gift deed is registered, the revenue record still has to be updated through mutation.',
          hi: 'पति-पत्नी या साझा पूर्वज वाले रक्त-संबंधियों के बीच योग्य उपहार पर बाज़ार मूल्य का 0.1% शुल्क लगता है, न्यूनतम ₹5,000 और अधिकतम ₹10,000। उदाहरण के लिए, ₹50 लाख की भूमि के पारिवारिक उपहार में शुल्क ₹5,000 बनता है, इसलिए न्यूनतम सीमा लागू होती है। जो उपहार पारिवारिक उपहार की श्रेणी में नहीं आते उन पर ऊपर की सामान्य सीमाएँ लगती हैं। उपहार विलेख पंजीकृत होने के बाद भी राजस्व अभिलेख इंतकाल से अद्यतन कराना पड़ता है।',
        },
        link: {
          href: '/en/blog/himachal-land-mutation-intkal-guide',
          label: { en: 'Read the mutation (Intkal) guide', hi: 'इंतकाल मार्गदर्शिका पढ़ें' },
        },
      },
      {
        title: { en: 'Lease deeds', hi: 'पट्टा विलेख' },
        body: {
          en: 'For a fixed-term lease the calculator multiplies the market value by the applicable rate (8%, or 12% with Section 118 permission) and by the lease term in years divided by 100. For a perpetual or indefinite lease it uses the higher of the market value and the total amount payable, with no term factor. Article 35 exempts certain cultivation leases, so confirm that your lease qualifies before choosing that option.',
          hi: 'निश्चित अवधि के पट्टे में कैलकुलेटर बाज़ार मूल्य को लागू दर (8%, या धारा 118 अनुमति पर 12%) से और पट्टे की वर्ष-अवधि को 100 से भाग देकर गुणा करता है। स्थायी या अनिश्चित पट्टे में वह बाज़ार मूल्य और कुल देय राशि में से अधिक को लेता है, अवधि-गुणक के बिना। अनुच्छेद 35 कुछ खेती के पट्टों को छूट देता है, इसलिए वह विकल्प चुनने से पहले जाँचें कि आपका पट्टा योग्य है।',
        },
      },
      {
        title: { en: 'How to estimate your costs step by step', hi: 'अपने खर्च का अनुमान चरण-दर-चरण कैसे लगाएँ' },
        body: {
          en: 'Work through these steps in the calculator and keep a note of each input.',
          hi: 'कैलकुलेटर में ये चरण अपनाएँ और हर इनपुट का नोट रखें।',
        },
        list: {
          en: [
            'Choose the deed type: sale, gift or lease.',
            'Enter the assessed market value for the whole property, and the agreed price if it is a sale.',
            'Select the buyer category (woman or other), or the family gift or Section 118 option where it genuinely applies.',
            'Add the value of any earlier deeds between the same parties in the last year.',
            'Check the registration fee, estimated at 2% of the value, and replace it if the Sub-Registrar quotes a different amount.',
            'Ask the Sub-Registrar to confirm the valuation, the registration fee and any local surcharge before you pay.',
          ],
          hi: [
            'विलेख का प्रकार चुनें: बिक्री, उपहार या पट्टा।',
            'पूरी संपत्ति का आँका गया बाज़ार मूल्य भरें, और बिक्री हो तो तय कीमत भी।',
            'खरीदार श्रेणी (महिला या अन्य) चुनें, या जहाँ वास्तव में लागू हो वहाँ पारिवारिक उपहार या धारा 118 का विकल्प चुनें।',
            'पिछले एक वर्ष में उन्हीं पक्षों के पूर्व विलेखों का मूल्य जोड़ें।',
            'मूल्य के 2% पर अनुमानित पंजीकरण शुल्क देखें, और उप-पंजीयक अलग राशि बताएं तो उसे बदल दें।',
            'भुगतान से पहले उप-पंजीयक से मूल्यांकन, पंजीकरण शुल्क और किसी स्थानीय अधिभार की पुष्टि कराएँ।',
          ],
        },
      },
      {
        title: { en: 'After you pay: registration, then mutation', hi: 'भुगतान के बाद: पंजीकरण, फिर इंतकाल' },
        body: {
          en: 'Paying stamp duty and registering the deed does not update the revenue record. Mutation is a separate process, so check the Jamabandi afterwards to see that your name has been entered. Our guide on registry versus mutation explains the difference and what to do if the entry is pending.',
          hi: 'स्टाम्प शुल्क देने और विलेख पंजीकृत कराने से राजस्व अभिलेख अपने-आप अद्यतन नहीं होता। इंतकाल अलग प्रक्रिया है, इसलिए बाद में जमाबंदी देखकर पुष्टि करें कि आपका नाम दर्ज हो गया है। रजिस्ट्री बनाम इंतकाल वाली हमारी मार्गदर्शिका अंतर और लंबित प्रविष्टि होने पर क्या करना है, यह समझाती है।',
        },
        link: {
          href: '/en/blog/land-registry-vs-mutation-himachal-pradesh',
          label: { en: 'Read the registry vs mutation guide', hi: 'रजिस्ट्री बनाम इंतकाल मार्गदर्शिका पढ़ें' },
        },
      },
      {
        title: { en: 'Common mistakes when budgeting stamp duty', hi: 'स्टाम्प शुल्क का बजट बनाते समय आम गलतियाँ' },
        body: {
          en: 'Most surprises at the Sub-Registrar’s office come from a few avoidable assumptions.',
          hi: 'उप-पंजीयक कार्यालय में ज़्यादातर चौंकाने वाली बातें कुछ टाली जा सकने वाली धारणाओं से आती हैं।',
        },
        list: {
          en: [
            'Using the agreed price instead of the higher assessed market value.',
            'Assuming the higher rate applies only to the amount above the threshold. It applies to the whole value.',
            'Splitting one purchase into several deeds with the same seller within a year to stay under a threshold.',
            'Quoting old articles with pre-2026 slabs, or old registration fee figures.',
            'Forgetting that registration fee is separate from stamp duty.',
            'Ignoring mutation after registration.',
          ],
          hi: [
            'ऊँचे आँके गए बाज़ार मूल्य के बजाय तय कीमत का उपयोग करना।',
            'यह मानना कि ऊँची दर केवल सीमा से ऊपर की राशि पर लगती है। वह पूरे मूल्य पर लगती है।',
            'सीमा के नीचे रहने के लिए एक वर्ष में उसी विक्रेता के साथ एक खरीद को कई विलेखों में बाँटना।',
            '2026 से पहले की सीमाओं या पुराने पंजीकरण शुल्क वाले पुराने लेखों का हवाला देना।',
            'यह भूल जाना कि पंजीकरण शुल्क स्टाम्प शुल्क से अलग है।',
            'पंजीकरण के बाद इंतकाल की अनदेखी।',
          ],
        },
      },
      {
        title: { en: 'Frequently Asked Questions', hi: 'अक्सर पूछे जाने वाले प्रश्न' },
        body: {
          en: 'Short answers to common questions about stamp duty on land in Himachal Pradesh.',
          hi: 'हिमाचल प्रदेश में जमीन पर स्टाम्प शुल्क से जुड़े आम प्रश्नों के संक्षिप्त उत्तर।',
        },
        list: {
          en: [
            'What is the stamp duty for women buying land in Himachal Pradesh? It is 4% where the value is up to ₹1 crore and 8% above ₹1 crore, under the 2026 schedule as applied in our calculator.',
            'What is the stamp duty for other buyers? It is 6% up to ₹40 lakh and 8% above ₹40 lakh. Above the threshold the higher rate applies to the full value.',
            'Is stamp duty charged on the sale price or the market value? On an ordinary sale the calculator uses the higher of the assessed market value and the agreed price.',
            'Does buying with Section 118 permission cost more? Yes. Where the State has granted permission under Section 118(2)(h), a flat 12% applies to the sale or lease.',
            'Can I split a purchase into two deeds to save duty? Reports on the 2026 rules say deeds between the same buyer and seller within one year are considered together, so splitting is unlikely to help.',
            'How much is stamp duty on a family gift deed? Qualifying family gifts are charged at 0.1% of market value with a ₹5,000 minimum and a ₹10,000 maximum.',
            'How much is the registration fee? The calculator estimates it at 2% of the property value, and it is separate from stamp duty. If the Sub-Registrar quotes a different amount, enter it to replace the estimate.',
          ],
          hi: [
            'हिमाचल प्रदेश में जमीन खरीदने वाली महिलाओं के लिए स्टाम्प शुल्क कितना है? हमारे कैलकुलेटर में लागू 2026 अनुसूची के अनुसार ₹1 करोड़ तक मूल्य पर 4% और ₹1 करोड़ से ऊपर 8%।',
            'अन्य खरीदारों के लिए स्टाम्प शुल्क कितना है? ₹40 लाख तक 6% और ₹40 लाख से ऊपर 8%। सीमा के ऊपर ऊँची दर पूरे मूल्य पर लगती है।',
            'स्टाम्प शुल्क बिक्री कीमत पर लगता है या बाज़ार मूल्य पर? साधारण बिक्री में कैलकुलेटर आँके गए बाज़ार मूल्य और तय कीमत में से अधिक को लेता है।',
            'क्या धारा 118 अनुमति से खरीदना महँगा पड़ता है? हाँ। जहाँ राज्य ने धारा 118(2)(h) के तहत अनुमति दी हो, बिक्री या पट्टे पर एकसमान 12% लगता है।',
            'क्या शुल्क बचाने के लिए खरीद को दो विलेखों में बाँट सकता हूँ? 2026 नियमों पर रिपोर्टों के अनुसार एक वर्ष के भीतर एक ही खरीदार और विक्रेता के विलेख साथ गिने जाते हैं, इसलिए बाँटने से लाभ की संभावना कम है।',
            'पारिवारिक उपहार विलेख पर स्टाम्प शुल्क कितना है? योग्य पारिवारिक उपहार पर बाज़ार मूल्य का 0.1% लगता है, न्यूनतम ₹5,000 और अधिकतम ₹10,000।',
            'पंजीकरण शुल्क कितना है? कैलकुलेटर इसका अनुमान संपत्ति मूल्य के 2% पर लगाता है, और यह स्टाम्प शुल्क से अलग है। उप-पंजीयक अलग राशि बताएं तो उसे दर्ज करके अनुमान बदल लें।',
          ],
        },
      },
    ],
    takeaway: {
      en: 'The 2026 schedule makes the assessed value, the buyer category and the one-year linked-deed rule the three things that decide your stamp duty, and a small change near a threshold can move the bill by lakhs. Work out an estimate in the <a href="/en/stamp-duty-calculator" class="takeaway-link">stamp duty calculator</a>, confirm the valuation, registration fee and any surcharge with the Sub-Registrar, and then check that mutation follows registration.',
      hi: '2026 की अनुसूची में आँका गया मूल्य, खरीदार श्रेणी और एक वर्ष का जुड़े विलेखों का नियम, ये तीन बातें आपका स्टाम्प शुल्क तय करती हैं, और सीमा के पास थोड़ा बदलाव भी बिल को लाखों रुपये से बदल सकता है। <a href="/hi/stamp-duty-calculator" class="takeaway-link">स्टाम्प शुल्क कैलकुलेटर</a> में अनुमान निकालें, मूल्यांकन, पंजीकरण शुल्क और किसी अधिभार की पुष्टि उप-पंजीयक से कराएँ, और फिर देखें कि पंजीकरण के बाद इंतकाल हुआ या नहीं।',
    },
    sources: [
      { label: 'Himachal Pradesh e-Gazette: Act No. 17 of 2026, Schedule I-A', url: 'https://rajpatra.hp.gov.in/OPENFILE1.aspx?ID=52317+&etype=NSPECIAL' },
      { label: 'TeamLease RegTech: Indian Stamp (Himachal Pradesh Second Amendment) Act, 2026', url: 'https://teamleaseregtech.com/updates/article/60937/indian-stamp-himachal-pradesh-second-amendment-act-2026/' },
      { label: 'Outlook Money: Himachal Pradesh sets out new stamp duty structure', url: 'https://www.outlookmoney.com/news/himachal-pradesh-sets-out-new-stamp-duty-structure-for-property-deals' },
      { label: 'The Tribune: Himachal Vidhan Sabha passes Bill on stamp duty', url: 'https://www.tribuneindia.com/news/himachal/himachal-vidhan-sabha-passes-bill-hiking-stamp-duty/' },
      { label: 'Himachal Pradesh Revenue Department', url: 'https://himachal.nic.in/revenue' },
    ],
  },
];

export function getBlogGuide(slug: string) {
  return BLOG_GUIDES.find((guide) => guide.slug === slug);
}