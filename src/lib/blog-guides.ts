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
];

export function getBlogGuide(slug: string) {
  return BLOG_GUIDES.find((guide) => guide.slug === slug);
}
