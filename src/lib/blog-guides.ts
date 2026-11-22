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
];

export function getBlogGuide(slug: string) {
  return BLOG_GUIDES.find((guide) => guide.slug === slug);
}
